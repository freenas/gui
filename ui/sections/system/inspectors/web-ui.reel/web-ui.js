var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Model = require("core/model/model").Model,
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

    _inspectorTemplateDidLoad: {
        value: function() {
            var self = this;
            return Promise.all([
                this.application.systemService.getUi().then(function(uiData) {
                    self.config = uiData;
                    self._snapshotDataObjectsIfNecessary();
                }),
                this.application.dataService.fetchData(Model.CryptoCertificate).then(function (certificates) {
                    self.certificates = certificates.filter(self._isCertificate);
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
            return Promise.all([
                this.application.systemService.saveAdvanced(this.systemAdvanced),
                this.application.systemService.saveUi(this.config)
            ]);
        }
    },

    revert: {
        value: function() {
            this.config.webui_protocol = this._config.webui_protocol;
            this.config.ipv4 = this._config.ipv4;
            this.config.ipv6 = this._config.ipv6;
            this.config.webui_http_port = this._config.webui_http_port;
            this.config.webui_https_port = this._config.webui_https_port;
            this.config.webui_https_certificate = this._config.webui_https_certificate;
            this.config.webui_http_redirect_https = this._config.webui_http_redirect_https;
            this.config.webui_listen = this._config.webui_listen;

            return this.application.systemAdvancedService.revertAdvancedData(this.systemAdvanced);
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
        }
    }

});
