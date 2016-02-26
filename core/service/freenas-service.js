var DataService = require("montage-data/logic/service/data-service").DataService,
    BackEndBridge = require("core/backend/backend-bridge").BackEndBridge,
    WebSocketConfiguration = require("../backend/websocket-configuration").WebSocketConfiguration,
    DataObjectDescriptor = require("montage-data/logic/model/data-object-descriptor").DataObjectDescriptor,
    Model = require("core/model/model").Model,
    Services = require("core/model/services").Services,
    Montage = require("montage/core/core").Montage;

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
            this.backendBridge = new BackEndBridge(WebSocketConfiguration.defaultConfiguration);

            //Fixme: @benoit where/how that should be done?
            Model.backendBridge = this.backendBridge;

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


    loginWithCredentials: {
        value: function (_username, _password) {
            //FIXME:
            //This is a response object. We need to extract data and turn it into
            //a user objet using the User.objectDescriptor.
            return this.backendBridge.send("rpc", "auth", {
                username : _username,
                password : _password
            });
        }
    },



/*----------------------------------------------------------------------------------------------------------------------
                                                    DataService
----------------------------------------------------------------------------------------------------------------------*/


    types: {
        value: [
            //FIXME: ALL_TYPES doesn't seems to work
            //DataObjectDescriptor.ALL_TYPES,
            Model.Disk,
            Model.NetworkInterface
        ]
    },


    fetchRawData: {
        value: function (stream) {
            var type = stream.selector.type;

            if (type.objectPrototype) {
                this._fetchRawDataWithType(stream, type);

            } else {
                var self = this;

                Model.getPrototypeForType(type).then(function () {
                    self._fetchRawDataWithType(stream, type);
                });
            }
        }
    },


    deleteRawData: {
        value: function (rawData, object) {
            var objectPrototype = Object.getPrototypeOf(object),
                type = objectPrototype.Type,
                deleteServiceDescriptor = Services.findDeleteServiceForType(type);

            if (deleteServiceDescriptor) {
                return this.backendBridge.send(
                    deleteServiceDescriptor.namespace,
                    deleteServiceDescriptor.name, {
                        method: deleteServiceDescriptor.method,
                        args: [deleteServiceDescriptor.task, [object.id]]
                    }
                ).then(function (response) {
                    //todo catch jobID + events
                    return response;
                });
            }

            return Promise.reject(new Error("No delete service for the model object '" + type.typeName + "'"));
        }
    },


    mapToRawData: {
        value: function (object, data) {
            //fixme @charles how to reject the promise here?
            if (object.id !== void 0) {
                var objectPrototype = Object.getPrototypeOf(object),
                    type = objectPrototype.Type,
                    serviceDescriptor = object.id !== null ?
                        Services.findUpdateServiceForType(type) : // -> update case (fixme: delete...)
                        Services.findCreateServiceForType(type); // -> create case

                if (serviceDescriptor) {
                    var restrictions = serviceDescriptor.restrictions,
                        propertyDescriptors = objectPrototype.blueprint.propertyBlueprints,
                        hasRestrictions = !!restrictions, respectedRestrictionsCounter = 0,
                        requiredFields, forbiddenFields, propertyDescriptor, objectValue, key;

                    if (hasRestrictions) {
                        forbiddenFields = restrictions.forbiddenFields;
                        requiredFields = restrictions.requiredFields;
                    }

                    for (var i = 0, length = propertyDescriptors.length; i < length; i++) {
                        propertyDescriptor = propertyDescriptors[i];
                        key = propertyDescriptor.name;
                        objectValue = object[key];

                        if (hasRestrictions) {
                            if (forbiddenFields && forbiddenFields.indexOf(key) === -1) {
                                if (requiredFields && requiredFields.indexOf(key) > -1 && objectValue !== null &&
                                    objectValue !== void 0) respectedRestrictionsCounter++;

                                if (objectValue !== null) data[key] = objectValue;
                            }
                        } else {
                            if (objectValue !== null) data[key] = objectValue;
                        }
                    }

                    if (requiredFields && requiredFields.length !== respectedRestrictionsCounter) {
                        //todo: improve this error message, with list of the missing fields ?
                        throw new Error ("missing required fields for type: '" + type.typeName + "'");
                    }
                } else {
                    //todo warning
                }
            } else {
                //todo warning
            }
        }
    },

    saveRawData: {
        value: function (rawData, object) {
            if (object.id !== void 0) { // id can be forbidden
                var isUpdate = object.id !== null,
                    type = Object.getPrototypeOf(object).Type,
                    serviceDescriptor = isUpdate ?
                        Services.findUpdateServiceForType(type) : Services.findCreateServiceForType(type);

                if (serviceDescriptor) {
                    return this.backendBridge.send(
                        serviceDescriptor.namespace,
                        serviceDescriptor.name, {
                            method: serviceDescriptor.method,
                            args: [serviceDescriptor.task, isUpdate ? [object.id, rawData] : [rawData]]
                        }

                    ).then(function (response) {
                        //todo catch jobID + events
                        return response;
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

    _fetchRawDataWithType: {
        value: function (stream, type) {
            var readServiceDescriptor = Services.findReadServiceForType(type);

            if (readServiceDescriptor) {
                var self = this;

                return this.backendBridge.send(
                    readServiceDescriptor.namespace,
                    readServiceDescriptor.name, {
                        method: readServiceDescriptor.method,
                        args: []
                    }
                ).then(function (response) {
                    self.addRawData(stream, response.data);
                    self.rawDataDone(stream);
                });
            } else {
                stream.reject(new Error("No fetch service for the model object '" + type.typeName + "'"));
            }
        }
    }
});
