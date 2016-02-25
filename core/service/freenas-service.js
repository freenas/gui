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
            //FIXME: ALL_TYPES doesn't Seems to work
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

    _fetchRawDataWithType: {
        value: function (stream, type) {
            var commandFetchForType = Services.getFetchServiceForType(type);

            if (commandFetchForType) {
                var self = this;

                return this.backendBridge.send(
                    commandFetchForType.namespace,
                    commandFetchForType.name,
                    {
                        method: commandFetchForType.method,
                        args: commandFetchForType.arguments || []
                    }

                ).then(function (response) {
                    self.addRawData(stream, response.data);
                    self.rawDataDone(stream);

                });
            }
        }
    }


}, /** @lends FreeNASService */ {

    instance: {
        get: function () {
            var instance = this._instance;

            if (!instance) {
                instance = this._instance = new DataService();
                DataService.mainService.addChildService(new FreeNASService());
            }

            return instance;
        }
    }

});
