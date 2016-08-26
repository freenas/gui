var Montage = require("montage").Montage,
    BackendBridge = require('core/backend/backend-bridge'),
    WebSocketClient = require("core/backend/websocket-client").WebSocketClient,
    WebSocketConfiguration = require("core/backend/websocket-configuration").WebSocketConfiguration;

var ConsoleService = exports.ConsoleService = Montage.specialize({
    getSerialToken: {
        value: function(vmId) {
            return BackendBridge.defaultBackendBridge.send('rpc', 'call', {
                method: 'vm.request_serial_console',
                args: [vmId]
            }).then(function(response) {
                return response.data;
            });
        }
    },

    getCliToken: {
        value: function(columns) {
            columns = columns || 80;
            return BackendBridge.defaultBackendBridge.send('rpc', 'call', {
                method: 'shell.spawn',
                args: ['/usr/local/bin/cli', columns, 1]
            }).then(function(response) {
                return response.data;
            });
        }
    }
}, {
    instance: {
        get: function() {
            if (!this._instance) {
                this._instance = new ConsoleService();
            }
            return this._instance;
        }
    }
});

