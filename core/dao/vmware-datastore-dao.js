/**
 * @module core/dao/vmware-datastore-dao
 */
var AbstractDao = require("core/dao/abstract-dao").AbstractDao,
  	BackEndBridgeModule = require("../backend/backend-bridge");
/**
 * @class VmwareDatastoreDao
 * @extends AbstractDao
 */
exports.VmwareDatastoreDao = AbstractDao.specialize(/** @lends VmwareDatastoreDao# */ {
    init: {
        value: function(backendBridge, dataService) {
            this._backendBridge = backendBridge || BackEndBridgeModule.defaultBackendBridge;
            this._model = this.constructor.Model.VmwareDatastore;
        }
    },
	  list: {
		    value: function(peer, full) {
			      var self = this;
			      return this._backendBridge.send("rpc", "call", {
                method: "vmware.get_datastores", 
                args: [peer.credentials.address, peer.credentials.username, peer.credentials.password, full]
            }).then(function(response) {
				        return Promise.all(response.data.map(function(x) {
                    return self._dataService.mapRawDataToType(x, self._model);
                }));
			      });
	    	}
	  }
});
