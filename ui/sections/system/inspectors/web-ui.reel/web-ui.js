var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService,
    DataObjectChangeService = require("core/service/data-object-change-service").DataObjectChangeService,
    ModelEventName = require("core/model-event-name").ModelEventName,
    Units = require('core/Units');
    _ = require("lodash");

exports.WebUi = AbstractInspector.specialize({

    PROTOCOL_OPTIONS: {
        value: [
            {label: "HTTP", value: ["HTTP"]},
            {label: "HTTPS", value: ["HTTPS"]},
            {label: "HTTP + HTTPS", value: ["HTTP","HTTPS"]}
        ]
    },

    IPv4_OPTIONS: {
        value: []
    },

    IPv6_OPTIONS: {
        value: []
    },

    certificates: {
        value: null
    },

    timeUnits: {
        value: null
    },

    _handleChange: {
        value: function(state) {
            this._dataObjectChangeService.handleDataChange(this.certificates, state);
            // DTM
            this.dispatchOwnPropertyChange('certificates', this.certificates);
        }
    },

    _inspectorTemplateDidLoad: {
        value: function() {
            var self = this;
            this._eventDispatcherService = EventDispatcherService.getInstance();
            this._dataObjectChangeService = new DataObjectChangeService();          
            this.timeUnits = Units.SECONDS;
            return Promise.all([
                this.application.systemService.getUi().then(function(uiData) {
                    self.config = uiData;
                    self._snapshotDataObjectsIfNecessary();
                }),
                this.application.systemService.getMyIps().then(function(ipData){
                    for (var i = 0; i < ipData.length; i++) {
                        if (/^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/.test(ipData[i])) {
                            self.IPv4_OPTIONS.push(ipData[i]);
                        } else if(/!^[FE|fe]/.test(ipData[i])) {
                            self.IPv6_OPTIONS.push(ipData[i]);
                        }
                    }
                    self.IPv4_OPTIONS.unshift({label:"all", value: "0.0.0.0"});
                    self.IPv6_OPTIONS.unshift({label:"all", value: "::"});
                }),
                this.application.systemService.getAdvanced().then(function(systemAdvanced) {
                    self.systemAdvanced = systemAdvanced;
                })
            ]);
        }
    },

    save: {
        value: function() {
            var self = this;

            return Promise.all([
                this.application.systemService.saveAdvanced(this.systemAdvanced),
                this.application.systemService.saveUi(this.config)
            ]).spread(function (taskSaveAdvanced, taskSaveUi) {
                taskSaveUi.taskPromise.then(function () {
                    self._handleSaveDone();
                });
            });
        }
    },

    _handleSaveDone: {
        value: function () {
            var config = this.config,
                protocol = config.webui_protocol[0],
                isHttpProtocol = protocol === "HTTP",
                isHttpsProtocol = protocol === "HTTPS",
                url = isHttpProtocol ? "http://" :
                    isHttpsProtocol ? "https://" : void 0,

                httpsPort = config.webui_https_port || 443,
                httpPort = config.webui_http_port || 80,
                port = isHttpProtocol ? httpPort : httpsPort,

                ipv6 = config.ipv6,
                ipv4 = config.ipv4,
                ip = ipv6 || ipv4 || window.location.hostname;

            if (url) {
                url = url + ip + ":" + port;

                if (window.location.href !== url) {
                    window.location.href = url;
                }
            }
        }
    },

    enterDocument: {
        value: function (isFirstTime){
            this.super(isFirstTime);
            var self = this;
            this._sectionService.listCertificates().then(function (certificates) {
                self.certificates = certificates.filter(self._isCertificate);
            });
            this.availableCertsEventListener = this._eventDispatcherService.addEventListener(ModelEventName.CryptoCertificate.listChange, this._handleChange.bind(this));
        }
    },

    exitDocument: {
        value: function() {
            this._eventDispatcherService.removeEventListener(ModelEventName.CryptoCertificate.listChange, this.availableCertsEventListener);
        }
    },

    revert: {
        value: function() {
            this.config = _.cloneDeep(this._config);
            this.systemAdvanced = _.cloneDeep(this._systemAdvanced);
        }
    },

    _isCertificate: {
        value: function (cert) {
            return cert.type.startsWith("CERT");
        }
    },

    _snapshotDataObjectsIfNecessary: {
        value: function() {
            if(!this._config) {
                this._config = _.cloneDeep(this.config);
            }
            if (!this._systemAdvanced) {
                this._systemAdvanced = _.cloneDeep(this.systemAdvanced);
            }
        }
    }

});
