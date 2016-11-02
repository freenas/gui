/**
 * @module ui/table-hosts.reel
 */
var AbstractMultipleEditController = require('ui/abstract/abstract-multiple-edit-controller').AbstractMultipleEditController,
    Model = require("core/model/model").Model;

/**
 * @class TableHosts
 * @extends Component
 */
exports.TableHosts = AbstractMultipleEditController.specialize({

    getModelType: {
        value: function() {
            return Model.NetworkHost;
        }
    },

    loadObjects: {
        value: function() {
            return this._sectionService.loadHosts();
        }
    },

    saveObject: {
        value: function(object) {
            return this._sectionService.saveHost(object);
        }
    },

    deleteObject: {
        value: function(object) {
            return this._sectionService.deleteHost(object);
        }
    },

    mapObjectToRawData: {
        value: function(object) {
            return {
                id: object.id,
                addresses: object.addresses.clone(),
                persistedId: object.persistedId
            };
        }
    },

    mergeRawDataToObject: {
        value: function(data, object) {
            object.id = data.id;
            object.addresses = data.addresses;
            object.persistedId = data.persistedId;

            return object;
        }
    },

    isValueUpdated: {
        value: function(value, object) {
            return object.id !== value.id
                || !object.addresses.equals(value.addresses);
        }
    }
});
