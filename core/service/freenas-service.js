var DataService = require("montage-data/logic/service/data-service").DataService,
    BackEndBridge = require("core/backend/backend-bridge").BackEndBridge,
    Montage = require("montage/core/core").Montage;

//FIXME: Temporary
//var LoginService = require("./login-service").LoginService;

/**
 * The interface to all services used by FreeNAS.
 *
 * @class
 * @extends external:DataService
 */
var FreeNASService = exports.FreeNASService = DataService.specialize({
    constructor: {
        value: function FreeNASService() {
            this.backendBridge = new BackEndBridge();

            var info = Montage.getInfoForObject(this);
            this._authorizationServices = [info.moduleId];

            if(this.providesAuthorization) {
                DataService.authorizationManager.registerAuthorizationService(this);
            }
            if(this.authorizationPolicy === DataService.AuthorizationPolicyType.UpfrontAuthorizationPolicy) {
                DataService.authorizationManager.authorizeService(this).then(function(authorization) {
                    console.log("I'm Authorized!! ",authorization);
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
        get: function() {
            return this._authorizationServices || (this._authorizationServices = [this]);
        }
    },
    authorizationPanel: {
        value: "ui/sign-in.reel"
    },
    loginWithCredentials: {
        value: function (_username, _password) {
            return this.backendBridge.send("rpc", "auth", {
                username : _username,
                password : _password

            }).then(function (response) {
                console.log("logged!!", response);
                //This is a response object. We need to extract data and turn it into
                //a user objet using the User.objectDescriptor.

            }, function (error) {
                console.error("login failed", error.message, error.code);
            });
        }
    }

}, /** @lends FreeNASService */ {
    instance: {
        get: function () {
            var instance = this._instance;

            if (!instance) {
                instance = this._instance = new FreeNASService();
                // instance.addChildService(new LoginService());
            }

            return instance;
        }
    }

});
