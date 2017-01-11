var Montage = require("montage").Montage,
    AccountRepository = require("core/repository/account-repository").AccountRepository,
    BackEndBridgeModule = require("../backend/backend-bridge");

var AccountsService = exports.AccountsService = Montage.specialize({

    _NAMESPACE: {
        value: ""
    },

    _instance: {
        value: null
    },

    _backendBridge: {
        value: null
    },

    listUsers: {
        value: function() {
            return this._accountRepository.listUsers();
        }
    }

}, {
    instance: {
        get: function() {
            if (!this._instance) {
                this._instance = new AccountsService();
                this._instance._accountRepository = AccountRepository.getInstance();
                this._instance._backendBridge = BackEndBridgeModule.defaultBackendBridge;
            }
            return this._instance;
        }
    }
});
