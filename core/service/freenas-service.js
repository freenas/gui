var DataService = require("montage-data/logic/service/data-service").DataService,
    RawDataService = require("montage-data/logic/service/raw-data-service").RawDataService,
    SnapshotService = require("montage-data/logic/service/snapshot-service").SnapshotService,
    BackEndBridgeModule = require("../backend/backend-bridge"),
    NotificationCenterModule = require("../backend/notification-center"),
    NotificationCenter = NotificationCenterModule.NotificationCenter,
    SelectionService = require("./selection-service").SelectionService,
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
var FreeNASService = exports.FreeNASService = RawDataService.specialize({


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
                DataService.authorizationManager.authorizeService(this);
            }

            //Fixme: wait for montage data?
            this.modelsCache = new Map();

            this._snapshotService = new SnapshotService();
            this._selectionService = SelectionService.instance;

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

    _snapshotService: {
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

    types: {
        value: [
            Model.Alert,
            Model.BootEnvironment,
            Model.Calendar,
            Model.CalendarTask,
            Model.DashboardContext,
            Model.DetachedVolume,
            Model.Disk,
            Model.Group,
            Model.Ipmi,
            Model.Mail,
            Model.NetworkConfig,
            Model.NetworkConfig,
            Model.NetworkInterface,
            Model.NetworkRoute,
            Model.Peer,
            Model.Permissions,
            Model.ReplicationOptions,
            Model.Service,
            Model.ServiceIscsi,
            Model.Share,
            Model.ShareAfp,
            Model.ShareIscsi,
            Model.ShareIscsiAuth,
            Model.ShareIscsiPortal,
            Model.ShareIscsiTarget,
            Model.ShareIscsiUser,
            Model.ShareNfs,
            Model.ShareSmb,
            Model.SideboardContext,
            Model.SystemAdvanced,
            Model.SystemDevice,
            Model.SystemGeneral,
            Model.SystemSection,
            Model.SystemTime,
            Model.SystemUi,
            Model.Update,
            Model.UpdateTrain,
            Model.User,
            Model.Vm,
            Model.VmDevice,
            Model.VmVolume,
            Model.VmReadme,
            Model.Volume,
            Model.VolumeDataset,
            Model.VolumeSettings,
            Model.VolumeSnapshot,
            Model.ZfsTopology,
            Model.ZfsVdev,
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
            var type = object.constructor.Type,
                deleteServiceDescriptor = Services.findDeleteServiceForType(type);

            if (deleteServiceDescriptor) {
                var self = this,
                    taskName = deleteServiceDescriptor.task;

                return this.backendBridge.send(
                    deleteServiceDescriptor.namespace,
                    deleteServiceDescriptor.name, {
                        method: deleteServiceDescriptor.method,
                        args: [taskName, [object.persistedId]]
                    }
                ).then(function (response) {
                    return self.notificationCenter.startTrackingTaskWithJobIdAndModel(taskName, response.data, object);
                }).then(function() {
                    return self._snapshotService.removeSnapshotForTypeNameAndId(type.typeName, object.id);
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
            var type = object.constructor.Type,
                modelHasNoId = this._isModelTypeHasNoId(type);

            /**
             * On some model objects, ids can be missing knowing that they are unique. (get_config)
             * On the other hand, ids can be forbidden (while saving) but they can be set to null.
             */
            if (modelHasNoId || object.id !== void 0) {
                var isUpdate = modelHasNoId || (object.id !== null && !object._isNew),
                    serviceDescriptor = isUpdate ?
                        Services.findUpdateServiceForType(type) : Services.findCreateServiceForType(type);

                if (type === Model.DirectoryserviceConfig) {
                    serviceDescriptor = {
                        "method": "task.submit",
                        "name": "call",
                        "namespace": "rpc",
                        "task": "directoryservice.update"
                    };
                }

                if (serviceDescriptor) {
                    var self = this,
                        payload,
                        taskName = serviceDescriptor.task,
                        taskId;

                    payload = this._snapshotService.getDifferenceWithSnapshotForTypeNameAndId(rawData, type.typeName, object.id);

                    var temporaryTaskId = this._selectionService.saveTemporaryTaskSelection(object);

                    return this.backendBridge.send(
                        serviceDescriptor.namespace,
                        serviceDescriptor.name, {
                            method: serviceDescriptor.method,
                            args: [taskName, isUpdate && !modelHasNoId ? [object.persistedId, payload] : [payload]]
                        }
                    ).then(function (response) {
                        taskId = response.data;
                        self._selectionService.persistTaskSelection(temporaryTaskId, taskId);
                        return self.notificationCenter.startTrackingTaskWithJobIdAndModel(taskName, taskId, object);
                    }).then(function() {
                        return self._selectionService.removeTaskSelection(taskId);
                    }, function(error) {
                        return self._selectionService.addErrorToTaskSelection(error.error, taskId);
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
            var type = object.constructor.Type,
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
            var propertyDescriptors = object.constructor.propertyBlueprints,
                keys = Object.keys(data),
                propertyDescriptor,
                rawValue,
                key,
                newArray,
                j, valuesLength;

            for (var i = 0, n = keys.length; i < n; i ++) {
                key = keys[i];
                propertyDescriptor = this._findPropertyDescriptorWithDescriptorAndPropertyName(propertyDescriptors, key);

                if (propertyDescriptor) {
                    rawValue = data[key];

                    if (propertyDescriptor.valueObjectPrototypeName) {
                        if (propertyDescriptor.valueType === "object") {
                            this._mapObjectPropertyReferenceFromRawData(propertyDescriptor, object, key, rawValue, data);
                        } else if (propertyDescriptor.valueType === "array") {
                            var type = Model[propertyDescriptor.valueObjectPrototypeName];

                            if (!type) {
                                type = propertyTypeService.getTypeForObjectProperty(object, data, key);
                            }


                            newArray = this.getEmptyCollectionForType(type);
                            for (j = 0, valuesLength = rawValue.length; j < valuesLength; j++) {
                                this._mapObjectPropertyReferenceFromRawData(propertyDescriptor, newArray, j, rawValue[j], data);
                            }
                            object[key] = newArray;
                        }
                    } else {
                        this._mapObjectPropertyFromRawData(propertyDescriptor, object, key, rawValue);

                        if (key === "id") {
                            this._mapObjectPropertyFromRawData(propertyDescriptor, object, "persistedId", rawValue);
                        }
                    }
                }
            }
            this._snapshotService.saveSnapshotForTypeNameAndId(data, object.constructor.Type.typeName, object.id);
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
                } else if (detail.service === "rename") { // Mostly use for renaming model object ids.
                    // The data array contains both ids, the previous and the new one [previousId, newId].
                    if (data.length === 2) {
                        model = this._findModelFromCacheWithTypeAndId(type, data[0]);

                        if (model) {
                            // We need to update the id and persistedId because the change could has been done by a third party.
                            model.id = model.persistedId = data[1];
                        }
                    } else {
                        console.warn("cannot handle the following rename event: " + JSON.stringify(detail));
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
                var instance = self.getDataObject(type);
                instance._isNew = true;
                return instance;
            });
        }
    },

    restoreSnapshotVersion: {
        value: function(object) {
            var self = this,
                type = object.constructor.Type;
            if (!object._isNew) {
                var id = object.id,
                    modelCache = this._findModelCacheForType(type),
                    snapshot = this._snapshotService.getSnapshotForTypeNameAndId(type.typeName, id);
                if (snapshot) {
                    var keys = Object.keys(object),
                        key;
                    for (var i = 0, length = keys.length; i < length; i++) {
                        key = keys[i];
                        if (key !== 'id' && key !== '_id') {
                            object[key] = null;
                        }
                    }
                    this.mapFromRawData(object, snapshot);
                }
                return Promise.resolve(object);
            } else {
                return this.getNewInstanceForType(type).then(function(cleanObject) {
                    var childrenPromises = [],
                        keys = Object.keys(object), key;
                    for (var i = 0, length = keys.length; i < length; i++) {
                        key = keys[i];
                        if (key in cleanObject && (key[0] !== '_' && !(key.slice(1) in object))) {
                            if (typeof object[key] === "object" && object[key] && object[key].constructor && object[key].constructor.Type) {
                                childrenPromises.push(self._resetObjectPropertyToNewInstance(object, key));
                            } else {
                                object[key] = cleanObject[key];
                            }
                        }
                    }
                    return childrenPromises.length > 0 ? Promise.all(childrenPromises).then(function() { return object; }) : object;
                });
            }
        }
    },

    _resetObjectPropertyToNewInstance: {
        value: function(object, propertyName) {
            return this.getNewInstanceForType(object[propertyName].constructor.Type).then(function(child) {
                object[propertyName] = child;
            });
        }
    },

    //FIXME: hacky
    getEmptyCollectionForType: {
        value: function (type) {
            return this.setTypeForCollection([], type);
        }
    },

    setTypeForCollection: {
        value: function (collection, type) {
            collection._meta_data = {collectionModelType: type};

            return collection;
        }
    },

    //FIXME: hacky, only used when fetching data without montage-data, which should never happen...
    mapRawDataToType: {
        value: function(data, type) {
            var self = this;
            return Model.populateObjectPrototypeForType(type).then(function() {
                var object = self.getDataObject(type);
                self._childServiceMap.get(type)[0].mapFromRawData(object, data);
                return object;
            });
        }
    },

    clone: {
        value: function(object) {
            if (object) {
                var result = Object.create(null),
                    keys = Object.keys(object),
                    key, temp, j, arrayLength, arrayKeys;
                for (var i = 0, length = keys.length; i < length; i++) {
                    key = keys[i];
                    if (Array.isArray(object[key])) {
                        result[key] = this._getArrayClone(object[key]);
                    } else if (typeof object[key] === "object") {
                        result[key] = this.clone(object[key]);
                    } else {
                        result[key] = object[key];
                    }
                }
            } else {
                result = object;
            }
            return result;
        }
    },

    _getArrayClone: {
        value: function(array) {
            var result = [],
                value;
            for (var i = 0, length = array.length; i < length; i++) {
                value = array[i];
                if (Array.isArray(value)) {
                    result.push(this._getArrayClone(value));
                } else if (typeof value === "object") {
                    result.push(this.clone(value));
                } else {
                    result.push(value);
                }
            }
            return result;
        }
    },

    _areSameValues: {
        value: function(a, b) {
            var result = a === b;
            if (!result) {
                if (typeof a === "object" && typeof b === "object") {
                    result = !!a === !!b;
                    if (result) {
                        var aKeys = Object.keys(a).sort(), aValue,
                            bKeys = Object.keys(b).sort(), bValue,
                            key;
                        result = aKeys.filter(function(x) { return a[x] !== null }).length === bKeys.filter(function(x) { return b[x] !== null }).length;
                        if (result) {
                            for (var i = 0, length = bKeys.length; i < length; i++) {
                                key = bKeys[i];
                                aValue = a[key];
                                bValue = b[key];
                                if (!this._areSameValues(aValue, bValue)) {
                                    result = false;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            return result;
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
            var type = object.constructor.Type;

            if (type) {
                if (!action) {
                    action = !!object._isToBeDeleted ? ACTION_DELETE :
                        this._isModelTypeHasNoId(type) || object.id !== null ? ACTION_UPDATE : ACTION_CREATE;
                }

                var serviceDescriptor = this._getServiceDescriptor(type, action),
                    restrictions = serviceDescriptor ? serviceDescriptor.restrictions : null,
                    propertyDescriptors = object.constructor.propertyBlueprints,
                    hasRestrictions = !!restrictions, requiredFields, isPropertyValueNullified, forbiddenFields,
                    propertyDescriptor, propertyValue, key, requiredFieldIndex, unsatisfiedRequiredFieldsCount = 0;

                if (hasRestrictions) {
                    forbiddenFields = restrictions.forbiddenFields || [];
                    requiredFields = restrictions.requiredFields ? restrictions.requiredFields.slice() : [];
                    unsatisfiedRequiredFieldsCount = requiredFields.length;
                }

                for (var i = 0, length = propertyDescriptors.length; i < length; i++) {
                    propertyDescriptor = propertyDescriptors[i];
                    if (!propertyDescriptor.readOnly) {
                        key = propertyDescriptor.name;
                        propertyValue = object[key];
                        isPropertyValueNullified = propertyValue === null || propertyValue === void 0;

                        if (propertyDescriptor.mandatory && isPropertyValueNullified) {
                            //FIXME: when montage-data will catch errors.
                            console.error("missing mandatory field '" + key + "' for type: '" + type.typeName + "'");
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
                }

                if (requiredFields && unsatisfiedRequiredFieldsCount > 0) {
                    //FIXME: when montage-data will catch errors.
                    console.error("missing " + unsatisfiedRequiredFieldsCount + " required fields for type: '" +
                        type.typeName + "': " + requiredFields.filter(function (x) {
                            return x;
                        }).join(', '));
                }
            } else {
                var i, length;
                if (typeof object.length !== 'undefined') {
                    for (i = 0, length = object.length; i < length; i++) {
                        if (typeof object[i] === 'object' && object[i]) {
                            data[i] = Array.isArray(object[i]) ? [] : {};
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
            var type = Model[propertyDescriptor.valueObjectPrototypeName];

            if (!type) {
                type = propertyTypeService.getTypeForObjectProperty(object, data, key);
            }

            if (type && rawValue) {
                //Fixme: hacky mapFromRawData need to return a promise
                if (type.objectPrototype && !Promise.is(type.objectPrototype)) {
                    this.__mapObjectPropertyReferenceFromRawData(type, rawValue, propertyDescriptor, object, key);
                } else {
                    var self = this;

                    object[key] = Model.populateObjectPrototypeForType(type).then(function () {
                        self.__mapObjectPropertyReferenceFromRawData(type, rawValue, propertyDescriptor, object, key);
                    });
                }
            } else if (rawValue) { //fallback
                this._mapObjectPropertyFromRawData(propertyDescriptor, object, key, rawValue);
            }
        }
    },

    __mapObjectPropertyReferenceFromRawData: {
        value: function (type, rawValue, propertyDescriptor, object, key) {
            var value = this.getDataObject(type);
            this.mapFromRawData(value, rawValue);
            this._mapObjectPropertyFromRawData(propertyDescriptor, object, key, value);
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

                // FIXME: Dirty hacky thing
                if (type === Model.DirectoryserviceConfig) {
                    readServiceDescriptor = {
                        "method": "directoryservice.get_config",
                        "name": "call",
                        "namespace": "rpc"
                    }
                }

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

                        self.notificationCenter.startListenToChangesOnModelTypeIfNeeded(type).then(function () {
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
                if (object[propertyKey] && typeof object[propertyKey] === 'object' && object[propertyKey]) {
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
                return self.notificationCenter.addEventListener("modelChange", self);
            }).then(function() {
                return Model.populateObjectPrototypeForType(Model.Alert);
            }).then(function() {
                return self.rootService.fetchData(Model.Alert);
            }).then(function(alerts) {
                var alert;
                for (var i = 0, length = alerts.length; i < length; i++) {
                    alert = alerts[i];
                    if (!alert.dismissed && alert.active) {
                        self.notificationCenter.addAlert(alert);
                    }
                }
                return self.notificationCenter.startListenToAlertEvents();
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
                return self.notificationCenter.removeEventListener("modelChange", self);
            }).then(function() {
                return self.notificationCenter.stopListenToAlertEvents();
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

                    if (model.persistedId === modelId) {
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
            //FIXME: Dirty hacky thing !
            if (modelType === Model.DirectoryserviceConfig) {
                return true;
            }
            return readServiceDescriptor && /\.get_config$/.test(readServiceDescriptor.method);
        }
    },

    callBackend: {
        value: function (method, args) {
            return this.backendBridge.send("rpc", "call", {
                method: method,
                args: args || []
            });
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
                instance.host = freeNASService.backendBridge.host;

                //Fixme: hacky
                instance.getNewInstanceForType = FreeNASService.prototype.getNewInstanceForType;
                instance.restoreSnapshotVersion = FreeNASService.prototype.restoreSnapshotVersion.bind(freeNASService);
                instance.getEmptyCollectionForType = FreeNASService.prototype.getEmptyCollectionForType;
                instance.setTypeForCollection = FreeNASService.prototype.setTypeForCollection;
                instance.callBackend = FreeNASService.prototype.callBackend;
                instance.backendBridge = BackEndBridgeModule.defaultBackendBridge;
                instance.mapRawDataToType = FreeNASService.prototype.mapRawDataToType;
                instance.clone = FreeNASService.prototype.clone;
                instance._getArrayClone = FreeNASService.prototype._getArrayClone;
                instance._isSameValue = FreeNASService.prototype._isSameValue;

                DataService.mainService.addChildService(freeNASService);
                NotificationCenterModule.defaultNotificationCenter = notificationCenter;

                this._instance = instance;
            }

            return instance;
        }
    }


});
