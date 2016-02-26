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

                Model.fetchPrototypeForType(type).then(function () {
                    self._fetchRawDataWithType(stream, type);
                });
            }
        }
    },


    deleteRawData: {
        value: function (rawData, object) {
            //todo need review @charles + @benoit
            var deleteServiceDescriptor = Services.findDeleteServiceForType(object.Type);

            if (deleteServiceDescriptor) {
                return this.backendBridge.send(
                    deleteServiceDescriptor.namespace,
                    deleteServiceDescriptor.name,
                    {
                        method: deleteServiceDescriptor.method,
                        args: [deleteServiceDescriptor.task, [object.id]]
                    }

                ).then(function (response) {
                    //todo catch jobID + events
                    return response;
                });
            }

            return Promise.reject();
        }
    },

    mapToRawData: {
        value: function (object, data) {
            //fixme @charles how to reject promise here?
            if (object.id !== void 0) {
                var serviceDescriptor;

                if (object.id !== null) { //update
                    serviceDescriptor = Services.findUpdateServiceForType(object.Type);

                } else { // create (fixme: delete...)
                    serviceDescriptor = Services.findCreateServiceForType(object.Type);
                }

                if (serviceDescriptor) {
                    var restrictions = serviceDescriptor.restrictions,
                        hasRestrictions = !!restrictions,
                        keys = Object.keys(object),
                        key;

                    for (var i = 0, length = keys.length; i < length; i++) {
                        key = keys[i];

                        if (hasRestrictions) {
                            if (restrictions.forbiddenFields.indexOf(key) === -1) {
                                if (restrictions.requiredFields.indexOf(key) > -1) {
                                    throw new Error (
                                        "missing required key: '" + key + "' for type: '" + object.Type + "'"
                                    );
                                }

                                data[key] = object[key];
                            }
                        } else {
                            data[key] = object[key];
                        }
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
            if (object.id !== void 0) {
                var isUpdate = false,
                    serviceDescriptor;

                if (object.id !== null) { //update
                    serviceDescriptor = Services.findUpdateServiceForType(object.Type);
                    isUpdate = true;

                } else { // create (fixme: delete...)
                    serviceDescriptor = Services.findCreateServiceForType(object.Type);
                }

                if (serviceDescriptor) {
                    return this.backendBridge.send(
                        serviceDescriptor.namespace,
                        serviceDescriptor.name,
                        {
                            method: serviceDescriptor.method,
                            args: [serviceDescriptor.task, isUpdate ? [object.id, rawData] : [object.id]]
                        }

                    ).then(function (response) {
                        //todo catch jobID + events
                        return response;
                    });
                } else {
                    //todo warning
                }
            } else {
                //todo warning
            }

            return Promise.reject();
        }
    },

    _fetchRawDataWithType: {
        value: function (stream, type) {
            var readServiceDescriptor = Services.findReadServiceForType(type);

            if (readServiceDescriptor) {
                var self = this;

                return this.backendBridge.send(
                    readServiceDescriptor.namespace,
                    readServiceDescriptor.name,
                    {
                        method: readServiceDescriptor.method,
                        args: []
                    }
                ).then(function (response) {
                    self.addRawData(stream, response.data);
                    self.rawDataDone(stream);
                });
            }

            //Fixme: @charles how to reject a fetch ? stream ?
        }
    }


});
