var Montage = require("montage/core/core").Montage,
    servicesMJSON = require("./services.mjson");

//todo: need review with @benoit
var CURD = ["create", "update", "read", "delete"];

/**
 * @class Services
 * @extends Montage
 */
exports.Services = Montage.specialize(/* @lends Services# */null, {

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
    },

    findRPCMethodsForType: {
        value: function (type) {
            var service = servicesMJSON[type.typeName],
                rpcMethods = null;

            if (service) {
                var serviceMethodKeys = Object.keys(service),
                    serviceMethodKey;

                for (var i = 0, length = serviceMethodKeys.length; i < length; i++) {
                    serviceMethodKey = serviceMethodKeys[i];

                    if (CURD.indexOf(serviceMethodKey) === -1) {
                        if (!rpcMethods) {
                            rpcMethods = Object.create(null);
                        }

                        rpcMethods[serviceMethodKey] = service[serviceMethodKey];
                    }
                }
            }

            return rpcMethods;
        }
    }

});

