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

    _isFirstMessage: {
        value: true
    },

    enterDocument: {
        value: function(isFirstTime) {
            var self = this;

            if (!this._shellClient || !this._shellClient.isConnected) {
                this._connect();
            }
            this._cancelResizeHandler = window.addEventListener("resize", function() { self.needsDraw = true; });
        }
    },

    exitDocument: {
        value: function() {
            if (typeof this._cancelResizeHandler === "function") {
                this._cancelResizeHandler();
                this._cancelResizeHandler = null;
            }
        }
    },

    draw: {
        value: function() {
            this._resizeTerminal();
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
                    if (self._isFirstMessage) {
                        self._isFirstMessage = false;
                        self.needsDraw = true;
                    }
                });
                reader.readAsBinaryString(data);
            }
        }
    },
    
    handleWebSocketClose: {
        value: function() {
            if (this._inDocument) {
                this._connect();
            }
        }
    },

    _connect: {
        value: function() {
            var self = this;
            this._shellClient = new WebSocketClient().initWithUrl(WebSocketConfiguration.shellConfiguration.get(WebSocketConfiguration.KEYS.URL));
            this._shellClient.responseType = WebSocketClient.RESPONSE_TYPE.BINARY_BLOB;
            this._defaultBackendBridge = BackendBridge.defaultBackendBridge;
            this._shellClient.connect().then(function() {
                if (!self._term) {
                    self._term = new Terminal({
                        cols: 80,
                        rows: 24,
                        screenKeys: true
                    });
                    self._term.open(self.terminalElement);
                }
                return self._defaultBackendBridge.send('rpc', 'call', {
                    method: 'shell.spawn',
                    args: ['/usr/local/bin/cli', self._getColumns(), 24]
                });
            }).then(function(response) {
                self._term.on('data', function(data) {
                    self._shellClient.sendMessage(data);
                });
                self._shellClient.addEventListener('webSocketMessage', self, false);
                self._shellClient.addEventListener('webSocketClose', self, false);
                self._shellClient.sendMessage(JSON.stringify({token: response.data}));
            });
        }
    },  

    _resizeTerminal: {
        value: function() {
            if (this.terminalElement.firstElementChild) {
                var line = this.terminalElement.firstElementChild.firstElementChild,
                    container = this.terminalElement.parentElement,
                    lines = Math.floor(container.offsetHeight / line.offsetHeight) - 2,
                    columns = this._getColumns();
                this._term.resize(columns, lines);
                this._term.options.geometry = this._term.geometry = [columns, lines];
            }
        }
    },

    _getColumns: {
        value: function() {
            var fontSize = Number(getComputedStyle(this.terminalElement.firstElementChild, "").fontSize.match(/(\d*(\.\d*)?)px/)[1]);
            this.terminalElement.firstElementChild.style.display = 'none';
            var currentWidth = this.terminalElement.getBoundingClientRect().width,
                offset = this._oldWidth && this._oldWidth > currentWidth ? 16 : 4;
            this.terminalElement.firstElementChild.style.display = 'block';
            this._oldWidth = currentWidth;
            return Math.floor(currentWidth / fontSize * 1.6) - offset;
        }
    }
});
