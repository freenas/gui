/**
 * @module ui/table-routes.reel
 */
var AbstractMultipleEditController = require('ui/abstract/abstract-multiple-edit-controller').AbstractMultipleEditController;

/**
 * @class TableRoutes
 * @extends Component
 */
exports.TableRoutes = AbstractMultipleEditController.specialize({

    getNewInstance: {
        value: function() {
            return this._sectionService.getNewNetworkStaticRoute();
        }
    },

    loadObjects: {
        value: function() {
            return this._sectionService.loadStaticRoutes();
        }
    },

    saveObject: {
        value: function(object) {
            return this._sectionService.saveStaticRoute(object);
        }
    },

    deleteObject: {
        value: function(object) {
            return this._sectionService.deleteStaticRoute(object);
        }
    },

    mapObjectToValues: {
        value: function(object) {
            return {
                id: object.id,
                network: {
                    address: object.network,
                    netmask: object.netmask,
                    type: object.type
                },
                gateway: object.gateway,
                persistedId: object.persistedId
            };
        }
    },

    mergeValuesToObject: {
        value: function(data, object) {
            object.id = data.id;
            object.network = data.network.address;
            object.netmask = data.network.netmask;
            object.gateway = data.gateway;
            object.type = data.network.type;
            object.persistedId = data.persistedId;

            return object;
        }
    },

    isValueUpdated: {
        value: function(value, object) {
            return object.id !== value.id
                || object.type !== value.network.type
                || object.network !== value.network.address
                || object.netmask !== value.network.netmask
                || object.gateway !== value.gateway;
        }
    }
});
