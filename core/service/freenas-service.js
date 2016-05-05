var DataService = require("montage-data/logic/service/data-service").DataService,
    BackEndBridgeModule = require("../backend/backend-bridge"),
    DataObjectDescriptor = require("montage-data/logic/model/data-object-descriptor").DataObjectDescriptor,
    NotificationCenterModule = require("../backend/notification-center"),
    NotificationCenter = NotificationCenterModule.NotificationCenter,
    Services = require("../model/services").Services,
    Montage = require("montage/core/core").Montage,
    Model = require("../model/model").Model,
    propertyTypeService = require('../model/property-type-service').propertyTypeService,
    EMPTY_ARRAY = [],
    ACTION_DELETE = 'DELETE',
    ACTION_UPDATE = 'UPDATE',
    ACTION_CREATE = 'CREATE';


/**
 * The interface to all services used by FreeNAS.
 *
 * @class
 * @extends external:DataService
 */
var FreeNASService = exports.FreeNASService = DataService.specialize({


/*----------------------------------------------------------------------------------------------------------------------
                                              Authorization/Authentication
----------------------------------------------------------------------------------------------------------------------*/


    constructor: {
        value: function FreeNASService() {
            this.backendBridge = BackEndBridgeModule.defaultBackendBridge;

            var info = Montage.getInfoForObject(this);
            this._authorizationServices = [info.moduleId];

            if (this.providesAuthorization) {
                DataService.authorizationManager.registerAuthorizationService(this);
            }

            if (this.authorizationPolicy === DataService.AuthorizationPolicyType.UpfrontAuthorizationPolicy) {
                DataService.authorizationManager.authorizeService(this).then(function (authorization) {
                    console.log("I'm Authorized!! ", authorization);
                });
            }


            //Fixme: temporary cache
            this.modelsCache = new Map();

            return this;
        }
    },

    authorizationPolicy: {
        value: DataService.AuthorizationPolicyType.UpfrontAuthorizationPolicy
    },

    providesAuthorization: {
        value: true
    },

    _authorizationServices: {
        value: null
    },

    authorizationServices: {
        get: function () {
            return this._authorizationServices || (this._authorizationServices = [this]);
        }
    },

    authorizationPanel: {
        value: "ui/sign-in.reel"
    },

    _keepAliveInterval: {
        value: null
    },

    loginWithCredentials: {
        value: function (_username, _password) {
            var self = this;

            return this.backendBridge.send("rpc", "auth", {
                username : _username,
                password : _password
            }).then(function (response) {
                return self._startListenToBackendEvents().then(function () {
                    if (self._keepAliveInterval) {
                        clearInterval(self._keepAliveInterval)
                    }
                    self._keepAliveInterval = setInterval(function() {
                        self.backendBridge.send("rpc", "call", {
                            method: "session.whoami",
                            args: []
                        });
                    }, 30000);
                    //FIXME:
                    //This is a response object. We need to extract data and turn it into
                    //a user objet using the User.objectDescriptor.
                    return response;
                });
            });
        }
    },

/*----------------------------------------------------------------------------------------------------------------------
                                                    DataService
----------------------------------------------------------------------------------------------------------------------*/


    /**
     * @public
     *
     * @type {Array.<DataObjectDescriptor>}
     *
     */
    types: {
        value: [
            //FIXME: ALL_TYPES doesn't seems to work
            //DataObjectDescriptor.ALL_TYPES,
            Model.Disk,
            Model.NetworkInterface,
            Model.NetworkRoute,
            Model.NetworkConfig,
            Model.Ipmi,
            Model.Volume,
            Model.VolumeSnapshot,
            Model.VolumeDataset,
            Model.Share,
            Model.ShareSmb,
            Model.ShareNfs,
            Model.ShareAfp,
            Model.Permissions,
            Model.ZfsTopology,
            Model.ZfsVdev,
            Model.User,
            Model.Group,
            Model.SystemGeneral,
            Model.Service
        ]
    },


    /**
     * @public
     *
     * @type {Object.<NotificationCenter>}
     *
     */
    notificationCenter: {
        get: function () {
            return NotificationCenterModule.defaultNotificationCenter;
        }
    },


/*----------------------------------------------------------------------------------------------------------------------
                                        DataService Public Functions
----------------------------------------------------------------------------------------------------------------------*/


    /**
     * @function
     * @public
     *
     * @description todo
     *
     */
    fetchRawData: {
        value: function (stream) {
            var type = stream.selector.type;

            if (type.objectPrototype) {
                this._fetchRawDataWithType(stream, type);

            } else {
                var self = this;

                Model.populateObjectPrototypeForType(type).then(function () {
                    self._fetchRawDataWithType(stream, type);
                });
            }
        }
    },


    /**
     * @function
     * @public
     *
     * @description todo
     *
     */
    deleteRawData: {
        value: function (rawData, object) {
            var objectPrototype = Object.getPrototypeOf(object),
                type = objectPrototype.Type,
                deleteServiceDescriptor = Services.findDeleteServiceForType(type);

            if (deleteServiceDescriptor) {
                var self = this,
                    taskName = deleteServiceDescriptor.task;

                return this.backendBridge.send(
                    deleteServiceDescriptor.namespace,
                    deleteServiceDescriptor.name, {
                        method: deleteServiceDescriptor.method,
                        args: [taskName, [object.id]]
                    }
                ).then(function (response) {
                    return self.notificationCenter.startTrackingTaskWithJobIdAndModel(taskName, response.data, object);
                });
            }

            return Promise.reject(new Error("No delete service for the model object '" + type.typeName + "'"));
        }
    },


    /**
     * @function
     * @public
     *
     * @description todo
     *
     */
    saveRawData: {
        value: function (rawData, object) {
            var type = Object.getPrototypeOf(object).Type,
                modelHasNoId = this._isModelTypeHasNoId(type);

            /**
             * On some model objects, ids can be missing knowing that they are unique. (get_config)
             * On the other hand, ids can be forbidden (while saving) but they can be set to null.
             */
            if (modelHasNoId || object.id !== void 0) {
                var isUpdate = modelHasNoId || (object.id !== null && !object._isNew),
                    serviceDescriptor = isUpdate ?
                        Services.findUpdateServiceForType(type) : Services.findCreateServiceForType(type);

                if (serviceDescriptor) {
                    var self = this,
                        taskName = serviceDescriptor.task;

                    return this.backendBridge.send(
                        serviceDescriptor.namespace,
                        serviceDescriptor.name, {
                            method: serviceDescriptor.method,
                            args: [taskName, isUpdate && !modelHasNoId ? [object.id, rawData] : [rawData]]
                        }
                    ).then(function (response) {
                        return self.notificationCenter.startTrackingTaskWithJobIdAndModel(taskName, response.data, object);
                    });
                } else {
                    return Promise.reject(new Error(
                        "No '" + isUpdate ? "update" : "create" + "' service for the model object '" + type.typeName + "'"
                    ));
                }
            } else {
                return Promise.reject(new Error("Non supported model object '" + type.typeName + "', 'id' is missing"));
            }
        }
    },

    /**
     * @function
     * @public
     *
     * @description todo
     * fixme: @charles how to reject the promise here?
     */
    mapToRawData: {
        value: function (object, data) {
            var objectPrototype = Object.getPrototypeOf(object),
                type = objectPrototype.Type,
                modelHasNoId = this._isModelTypeHasNoId(type);

            /**
             * @see comment in saveRawData.
             */
            if (modelHasNoId || object.id !== void 0) {
                this._mapToRawDataForAction(object, data);
            } else {
                //todo warning
            }
        }
    },


    /**
     * @function
     * @public
     *
     * @description todo
     *
     */
    mapFromRawData: {
        value: function (object, data) {
            var propertyDescriptors = Object.getPrototypeOf(object).blueprint.propertyBlueprints,
                keys = Object.keys(data),
                propertyDescriptor,
                rawValue,
                key;

            for (var i = 0, n = keys.length; i < n; i ++) {
                key = keys[i];
                propertyDescriptor = this._findPropertyDescriptorWithDescriptorAndPropertyName(propertyDescriptors, key);

                if (propertyDescriptor) {
                    rawValue = data[key];

                    if (propertyDescriptor.valueObjectPrototypeName && propertyDescriptor.valueType === "object") {
                        this._mapObjectPropertyReferenceFromRawData(propertyDescriptor, object, key, rawValue, data);
                    } else {
                        this._mapObjectPropertyFromRawData(propertyDescriptor, object, key, rawValue);
                    }
                }
            }
        }
    },


    /**
     * @function
     * @public
     *
     * @description Handles model changes from middleware events.
     *
     * @param {Object.<MutableEvent>} event
     *
     */
    handleModelChange: {
        value: function (event) {
            var detail = event.detail,
                data = detail.data,
                modelType = detail.modelType,
                modelCache = this._findModelCacheForType(modelType);

            if (modelCache && data) {
                var type = Model[modelType],
                    length = data.length,
                    i = 0,
                    rawModel,
                    model;

                if (detail.service === "create") {
                    for (rawModel = data[i]; i < length; i++) {
                        model = this.getDataObject(type);
                        this.mapFromRawData(model, rawModel);
                        modelCache.push(model);
                    }
                } else if (detail.service === "delete") {
                    var modelIndex, id;

                    for (id = data[i]; i < length; i++) {
                        modelIndex = this._findModelIndexFromCacheWithTypeAndId(type, id);

                        if (modelIndex > -1) {
                            modelCache.splice(modelIndex, 1);
                        }
                    }
                } else { // consider other operations as an update.
                    for (rawModel = data[i]; i < length; i++) {
                        model = this._findModelFromCacheWithTypeAndId(type, rawModel.id);

                        if (model) {
                            this.mapFromRawData(model, rawModel);
                        } else {
                            //todo: warning?
                        }
                    }
                }
            }
        }
    },

    getNewInstanceForType: {
        value: function(type) {
            var self = this;
            return Model.populateObjectPrototypeForType(type).then(function() {
                return self.getDataObject(type);
            });
        }
    },

    //FIXME: hacky
    getEmptyCollectionForType: {
        value: function (type) {
            var collection = [];
            collection._meta_data = {collectionModelType: type};

            return collection;
        }
    },


/*----------------------------------------------------------------------------------------------------------------------
                                             DataService Private Functions
----------------------------------------------------------------------------------------------------------------------*/

    _getServiceDescriptor: {
        value: function (type, action) {
            var serviceDescriptor;
            switch (action) {
                case ACTION_DELETE:
                    serviceDescriptor = Services.findDeleteServiceForType(type);
                    break;
                case ACTION_UPDATE:
                    serviceDescriptor = Services.findUpdateServiceForType(type);
                    break;
                case ACTION_CREATE:
                    serviceDescriptor = Services.findCreateServiceForType(type);
                    break;
            }
            return serviceDescriptor;

        }
    },

    _mapToRawDataForActionUsingServiceDescriptor: {
        value: function (object, data, action, serviceDescriptor) {
        }
    },

    _mapToRawDataForAction: {
        value: function (object, data, action) {
            var objectPrototype = Object.getPrototypeOf(object),
                type = objectPrototype.Type;
            if (type) {
                if (!action) {
                    action = !!object._isToBeDeleted ? ACTION_DELETE :
                        this._isModelTypeHasNoId(type) || object.id !== null ? ACTION_UPDATE : ACTION_CREATE;
                }
                var serviceDescriptor = this._getServiceDescriptor(type, action),
                    restrictions = serviceDescriptor ? serviceDescriptor.restrictions : null,
                    propertyDescriptors = objectPrototype.blueprint.propertyBlueprints,
                    hasRestrictions = !!restrictions, requiredFields, isPropertyValueNullified, forbiddenFields,
                    propertyDescriptor, propertyValue, key, requiredFieldIndex, unsatisfiedRequiredFieldsCount = 0;

                if (hasRestrictions) {
                    forbiddenFields = restrictions.forbiddenFields || [];
                    requiredFields = restrictions.requiredFields ? restrictions.requiredFields.slice() : [];
                    unsatisfiedRequiredFieldsCount = requiredFields.length;
                }

                for (var i = 0, length = propertyDescriptors.length; i < length; i++) {
                    propertyDescriptor = propertyDescriptors[i];
                    key = propertyDescriptor.name;
                    propertyValue = object[key];
                    isPropertyValueNullified = propertyValue === null || propertyValue === void 0;

                    if (propertyDescriptor.mandatory && isPropertyValueNullified) {
                        throw new Error("missing mandatory field '" + key + "' for type: '" + type.typeName + "'");
                    }

                    if (hasRestrictions) {
                        if (forbiddenFields.indexOf(key) === -1) {
                            requiredFieldIndex = requiredFields.indexOf(key);
                            if (requiredFieldIndex > -1 && !isPropertyValueNullified) {
                                unsatisfiedRequiredFieldsCount--;
                                requiredFields.splice(requiredFieldIndex, 1);
                            }

                            this._mapPropertyToRawDataForAction(data, object, key, action);
                        }
                    } else {
                        this._mapPropertyToRawDataForAction(data, object, key, action);
                    }
                }

                if (requiredFields && unsatisfiedRequiredFieldsCount > 0) {
                    throw new Error("missing " + unsatisfiedRequiredFieldsCount + " required fields for type: '" +
                        type.typeName + "': " + requiredFields.filter(function (x) {
                            return x;
                        }).join(', '));
                }
            } else {
                var i, length;
                if (typeof object.length !== 'undefined') {
                    for (i = 0, length = object.length; i < length; i++) {
                        if (typeof object[i] === 'object') {
                            data[i] = {};
                            this._mapToRawDataForAction(object[i], data[i], action);
                        }else {
                            data[i] = object[i];
                        }
                    }
                } else {
                    console.warn('No type for object', object);
                    var objectKeys = Object.keys(object), key;
                    for (i = 0, length = objectKeys.length; i < length; i++) {
                        key = objectKeys[i];
                        if (object.hasOwnProperty('_' + key) || key.indexOf('_') != 0) {
                            data[key] = object[key];
                        }
                    }
                }
            }
        }
    },

    /**
     * @function
     * @private
     *
     * @description todo
     *
     */
    _mapObjectPropertyReferenceFromRawData: {
        value: function (propertyDescriptor, object, key, rawValue, data) {
            var type = Model[propertyDescriptor.valueObjectPrototypeName],
                self = this,
                value;

            if (!type) {
                type = propertyTypeService.getTypeForObjectProperty(object, data, key);
            }

            if (type && rawValue) {
                //Fixme: hacky mapFromRawData need to return a promise
                object[key] = Model.populateObjectPrototypeForType(type).then(function () {
                    value = self.getDataObject(type);
                    self.mapFromRawData(value, rawValue);
                    self._mapObjectPropertyFromRawData(propertyDescriptor, object, key, value);
                });
            } else if (rawValue) { //fallback
                console.warn("model type: '" + propertyDescriptor.valueObjectPrototypeName + "' unknown");
                this._mapObjectPropertyFromRawData(propertyDescriptor, object, key, rawValue);
            } else {
                console.warn("Cannot map empty property: '" + key + "'");
            }
        }
    },


    /**
     * @function
     * @private
     *
     * @description todo
     *
     */
    _mapObjectPropertyFromRawData: {
        value: function (propertyDescriptor, object, key, value) {
            if (propertyDescriptor.readOnly) {
                object["_" + key] = value;
            } else {
                object[key] = value;
            }
        }
    },


    /**
     * @function
     * @private
     *
     * @description todo
     *
     */
    _fetchRawDataWithType: {
        value: function (stream, type) {
            if (this.modelsCache.has(type.typeName)) {
                //Fixme: hacky
                stream._data = this._findModelCacheForType(type);
                stream.dataDone();

            } else {
                var readServiceDescriptor = Services.findReadServiceForType(type);

                if (readServiceDescriptor) {
                    var self = this;

                    return this.backendBridge.send(
                        readServiceDescriptor.namespace,
                        readServiceDescriptor.name, {
                            method: readServiceDescriptor.method,
                            args: EMPTY_ARRAY
                        }
                    ).then(function (response) {
                        var rawData = response.data;

                        self.notificationCenter.startListenToChangesOnModelIfNeeded(type).then(function () {
                            self.addRawData(stream, Array.isArray(rawData) ? rawData : [rawData]);
                            self.rawDataDone(stream);
                            //fixme: fix for UIDescriptor and empty array....
                            stream._data._meta_data = {collectionModelType: type};

                            stream.then(function (cookedData) {
                                self.modelsCache.set(type.typeName, cookedData);
                                return cookedData;
                            });
                        });
                    }, function (error) {
                        stream.dataError(error);
                    });
                } else {
                    stream.dataError(new Error("No fetch service for the model object '" + type.typeName + "'"));
                }
            }
        }
    },


    /**
     * @function
     * @private
     *
     * @description todo
     *
     * @param {Object.<Blueprint>} blueprint
     * @param {String} key - property name
     *
     */
    _findPropertyDescriptorWithDescriptorAndPropertyName: {
        value: function (propertyDescriptors, propertyName) {
            var propertyDescriptor = null,
                propertyDescriptorTemp;

            for (var i = 0, length = propertyDescriptors.length; i < length; i++) {
                propertyDescriptorTemp = propertyDescriptors[i];

                if (propertyDescriptorTemp.name === propertyName) {
                    propertyDescriptor = propertyDescriptorTemp;
                    break;
                }
            }

            return propertyDescriptor;
        }
    },


    /**
     * @function
     * @private
     *
     * @description todo
     *
     */
    _mapPropertyToRawDataForAction: {
        value: function (rawData, object, propertyKey, action) {
            if (object.hasOwnProperty("_" + propertyKey) || typeof propertyKey === 'number') { // filter unset values.
                if (object[propertyKey] && typeof object[propertyKey] === 'object') {
                    var isArray = typeof object[propertyKey].length != 'undefined';
                    rawData[propertyKey] = isArray ? [] : {};
                    this._mapToRawDataForAction(object[propertyKey], rawData[propertyKey], action);
                } else {
                    rawData[propertyKey] = object[propertyKey];
                }
            }
        }
    },


    /**
     * @function
     * @private
     *
     * @description Starts listening to the middleware events.
     *
     * @returns {Promise}
     *
     */
    _startListenToBackendEvents: {
        value: function () {
            var self = this;

            return this.notificationCenter.startListenToTaskEvents().then(function () {
                self.notificationCenter.addEventListener("modelChange", self);
            });
        }
    },


    /**
     * @function
     * @private
     *
     * @description Stops listening to the middleware events.
     *
     * @returns {Promise}
     *
     */
    _stopListenToBackendEvents: {
        value: function () {
            var self = this;

            return this.notificationCenter.stopListenToTaskEvents().then(function () {
                self.notificationCenter.removeEventListener("modelChange", self);
            });
        }
    },


    /**
     * @function
     * @private
     *
     * @description try to find the model collection cache according to a given model type.
     *
     * @returns {Array|null}
     *
     */
    _findModelCacheForType: {
        value: function (type) {
            return this.modelsCache.get(type.typeName || type);
        }
    },


    /**
     * @function
     * @private
     *
     * @description try to find a Model Object according to its type and its id within the models cache.
     *
     * @returns {Object.<Model>|null}
     *
     */
    _findModelFromCacheWithTypeAndId: {
        value: function (type, modelId) {
            var index = this._findModelIndexFromCacheWithTypeAndId(type, modelId);

            return index > -1 ? this._findModelCacheForType(type)[index] : null;
        }
    },


    /**
     * @function
     * @private
     *
     * @description try to find a Model index according to its type and its id within the models cache.
     *
     * @returns {number}
     *
     */
    _findModelIndexFromCacheWithTypeAndId: {
        value: function (type, modelId) {
            var modelCache = this._findModelCacheForType(type),
                index = -1,
                model;

            if (modelCache) {
                for (var i = 0, length = modelCache.length; i < length; i++) {
                    model = modelCache[i];

                    if (model.id === modelId) {
                        index = i;
                        break
                    }
                }
            }

            return index;
        }
    },


    /**
     * @function
     * @private
     *
     * @description todo
     *
     * @returns {Boolean}
     *
     */
    _isModelTypeHasNoId: {
        value: function (modelType) {
            var readServiceDescriptor = Services.findReadServiceForType(modelType);
            return readServiceDescriptor && /\.get_config$/.test(readServiceDescriptor.method);
        }
    }


}, {


    instance: {
        get: function () {
            var instance = this._instance;

            if (!instance) {
                var freeNASService = new FreeNASService(),
                    notificationCenter = new NotificationCenter().initWithBackendBridge(freeNASService.backendBridge);

                instance = new DataService();

                //Fixme: hacky
                instance.getNewInstanceForType = FreeNASService.prototype.getNewInstanceForType;
                instance.getEmptyCollectionForType = FreeNASService.prototype.getEmptyCollectionForType;

                DataService.mainService.addChildService(freeNASService);
                NotificationCenterModule.defaultNotificationCenter = notificationCenter;

                this._instance = instance;
            }

            return instance;
        }
    }


});
