var AbstractDao = require("core/dao/abstract-dao").AbstractDao,
	Model = require("core/model/model").Model,
	BackEndBridgeModule = require("../backend/backend-bridge"),
	FreeNASService = require("core/service/freenas-service").FreeNASService;

exports.SupportCategoryDao = AbstractDao.specialize(/** @lends SupportCategoryDao# */ {
	init: {
        value: function(backendBridge, dataService) {
            this._backendBridge = backendBridge || BackEndBridgeModule.defaultBackendBridge;
            this._dataService = dataService || FreeNASService.instance;
        }
	},
	list: {
		value: function() {
			var self = this;
			return this._backendBridge.send("rpc", "call", {
                method: "support.categories_no_auth", 
                args: []
            }).then(function(response) {
				return response.data;
			});
		}
	}
});
