var DataService = require("montage-data/logic/service/data-service").DataService;

/**
 *
 * @class
 * @extends external:DataService
 */
var LoginService = exports.LoginService = DataService.specialize(/** @lends LoginService */ {

    //FIXME: TEMPORARY
    types: {
        value: ["LOGIN"]
    },

    loginWithCredentials: {
        value: function (_username, _password) {
            return this.rootService.backend.send("rpc", "auth", {
                username : _username,
                password : _password

            }).then(function (response) {
                console.log("logged!!", response);
            }, function (error) {
                console.error("login failed", error.message, error.code);
            });
        }
    }

});
