var Component = require("montage/ui/component").Component,
    BackendBridge = require('core/backend/backend-bridge'),
    WebSocketClient = require("core/backend/websocket-client").WebSocketClient,
    WebSocketConfiguration = require("core/backend/websocket-configuration").WebSocketConfiguration,
    Terminal = require('term.js/src/term');

/**
 * @class Console
 * @extends Component
 */
exports.Console = Component.specialize({
    _term: {
        value: null
    },

    _shellClient: {
        value: null
    },

    _defaultBackendBridge: {
        value: null
    },

    enterDocument: {
        value: function(isFirstTime) {
            var self = this;

            if (isFirstTime) {
                this._shellClient = new WebSocketClient().initWithUrl(WebSocketConfiguration.shellConfiguration.get(WebSocketConfiguration.KEYS.URL));
                this._shellClient.responseType = WebSocketClient.RESPONSE_TYPE.BINARY_BLOB;
                this._defaultBackendBridge = BackendBridge.defaultBackendBridge;
                this._shellClient.connect().then(function() {
                    return self._defaultBackendBridge.send('rpc', 'call', {
                        method: 'shell.spawn',
                        args: ['/usr/local/bin/cli']
                    });
                }).then(function(response) {
                    self._term = new Terminal({
                        cols: 80,
                        rows: 24,
                        screenKeys: true
                    });
                    self._term.on('data', function(data) {
                        self._shellClient.sendMessage(data);
                    });
                    self._term.open(self.terminalElement);
                    self._shellClient.addEventListener('webSocketMessage', self, false);
                    self._shellClient.sendMessage(JSON.stringify({token: response.data}));
                });
            }
        }
    },

    handleWebSocketMessage: {
        value: function(event) {
            var data = event.detail;
            try {
                JSON.parse(data);
            } catch (e) {
                var self = this,
                    reader = new FileReader();
                reader.addEventListener('loadend', function() {
                    self._term.write(reader.result);
                });
                reader.readAsBinaryString(data);
            }
        }
    }
});
