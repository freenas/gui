/**
 * @module core/dao/importable-disk-dao
 */
var AbstractDao = require("core/dao/abstract-dao").AbstractDao,
    BackEndBridgeModule = require("../backend/backend-bridge");
/**
 * @class ImportableDiskDao
 * @extends AbstractDao
 */
exports.ImportableDiskDao = AbstractDao.specialize(/** @lends ImportableDiskDao# */ {
    init: {
        value: function(backendBridge) {
            this._backendBridge = backendBridge || BackEndBridgeModule.defaultBackendBridge;
            this._model = this.constructor.Model.ImportableDisk;
        }
    },

    list: {
        value: function() {
            this._checkModelIsInitialized();
            var self = this;
            return this._backendBridge.send("rpc", "call", {
                method: "volume.find_media", 
                args: []
            }).then(function(response) {
                return Promise.all(response.data.map(function(x) {
                    return self._dataService.mapRawDataToType(x, self._model);
                }));
            });
        }
    }
});
