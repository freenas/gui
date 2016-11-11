var Montage = require("montage").Montage,
    UserRepository = require("core/repository/user-repository").UserRepository,
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
            return this._userRepository.listUsers();
        }
    },

    getShells: {
        value: function(){
            return this._callBackend("shell.get_shells").then(function(response) {
                return response.data;
            });
        }
    },

    _callBackend: {
        value: function(method, args) {
            args = args || [];
            return this._backendBridge.send("rpc", "call", {
                method: this._NAMESPACE + method,
                args: args
            });
        }
    }

}, {
    instance: {
        get: function() {
            if (!this._instance) {
                this._instance = new AccountsService();
                this._instance._userRepository = UserRepository.instance;
                this._instance._backendBridge = BackEndBridgeModule.defaultBackendBridge;
            }
            return this._instance;
        }
    }
});
