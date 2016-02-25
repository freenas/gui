var Montage = require("montage/core/core").Montage,
    servicesMJSON = require("./services.mjson");


//todo: need review with @benoit
var CRUD_MAP = {
        create: "create",
        read: "read",
        update: "update",
        delete: "delete"
    },

    CRUD_ARRAY = Object.keys(CRUD_MAP);


/**
 * @class Services
 * @extends Montage
 */
exports.Services = Montage.specialize(/* @lends Services# */null, {

    findServicesForType: {
        value: function (type) {
            return servicesMJSON[typeof type === "string" ? type : type.typeName];
        }
    },

    findCreateServiceForType: {
        value: function (type) {
            return this._findCrudServiceForType(CRUD_MAP.create, type);
        }
    },

    findReadServiceForType: {
        value: function (type) {
            return this._findCrudServiceForType(CRUD_MAP.read, type);
        }
    },

    findUpdateServiceForType: {
        value: function (type) {
            return this._findCrudServiceForType(CRUD_MAP.update, type);
        }
    },

    findDeleteServiceForType: {
        value: function (type) {
            return this._findCrudServiceForType(CRUD_MAP.delete, type);
        }
    },

    findRPCServicesForType: {
        value: function (type) {
            var servicesForType = servicesMJSON[type.typeName],
                rpcServices = null;

            if (servicesForType) {
                var servicesForTypeKeys = Object.keys(servicesForType),
                    servicesForTypeKey;

                for (var i = 0, length = servicesForTypeKeys.length; i < length; i++) {
                    servicesForTypeKey = servicesForTypeKeys[i];

                    if (CRUD_ARRAY.indexOf(servicesForTypeKey) === -1) {
                        if (!rpcServices) {
                            rpcServices = Object.create(null);
                        }

                        rpcServices[servicesForTypeKey] = servicesForType[servicesForTypeKey];
                    }
                }
            }

            return rpcServices;
        }
    },


     _findCrudServiceForType: {
        value: function (crudAction, type) {
            var services = this.findServicesForType(type);

            if (services) {
                return services[crudAction] || null;
            }

            return null;
        }
    }

});

