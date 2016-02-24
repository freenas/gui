var Montage = require("montage/core/core").Montage,
    servicesMJSON = require("./services.mjson");

//todo: need review with benoit
/**
 * @class Services
 * @extends Montage
 */
var Services = exports.Services = Montage.specialize(/* @lends Services# */null, {

    getServiceForType: {
        value: function (type) {
            return servicesMJSON[typeof type === "string" ? type : type.typeName];
        }
    },

    getFetchServiceForType: {
        value: function (type) {
            var service = servicesMJSON[type.typeName];

            if (service) {
                return service.read || null;
            }

            return null;
        }
    }

});

