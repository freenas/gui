var DataService = require("montage-data/logic/service/data-service").DataService,
    BackEndBridge = require("core/backend/backend-bridge").BackEndBridge;

//FIXME: Temporary
var LoginService = require("./login-service").LoginService;

/**
 * The interface to all services used by FreeNAS.
 *
 * @class
 * @extends external:DataService
 */
var FreeNASService = exports.FreeNASService = DataService.specialize(null, /** @lends FreeNASService */ {

    instance: {
        get: function () {
            var instance = this._instance;

            if (!instance) {
                instance = this._instance = new FreeNASService();
                instance.backend = new BackEndBridge();

                instance.addChildService(new LoginService());
            }

            return instance;
        }
    }

});
