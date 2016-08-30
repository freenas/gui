var Montage = require("montage").Montage,
    Model = require("core/model/model").Model,
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    BackEndBridgeModule = require("../backend/backend-bridge");

var DockerSettingsService = exports.DockerSettingsService = Montage.specialize({
    _instance: {
        value: null
    },

    _dataService: {
        value: null
    },

    _backendBridge: {
        value: null
    },

    saveDockerConfigData: {
        value: function(dockerConfig){
            console.log(dockerConfig);
            return this._submitTask('docker.update', [dockerConfig]).then(function(response) {
                return response.data;
            })
        }
    },

    getDockerHostQueryData: {
        value: function() {
            return this._dataService.fetchData(Model.DockerHost).then(function (dockerHosts) {
                return dockerHosts;
            });
        }
    },

    getDockerConfigData: {
        value: function(){
            return this._dataService.fetchData(Model.DockerConfig).then(function(Docker) {
                return Docker[0];
            })
        }
    },

    _submitTask: {
        value: function(taskName, args) {
            args = args || [];
            return this._backendBridge.send("rpc", "call", {
                method: 'task.submit',
                args: [taskName, args]
            });

        }
    }
}, {
    instance: {
        get: function() {
            if(!this._instance) {
                this._instance = new DockerSettingsService();
                this._instance._dataService = FreeNASService.instance;
                this._instance._backendBridge = BackEndBridgeModule.defaultBackendBridge;
            }
            return this._instance;
        }
    }
});
