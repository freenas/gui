/**
 * @module ui/web-ui.reel
 */
var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class WebUi
 * @extends Component
 */
exports.WebUi = Component.specialize(/** @lends WebUi# */ {

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

    enterDocument: {
        value: function(isFirstTime) {
            var self = this;
            if(isFirstTime) {
                this.isLoading = true;
                this.application.systemUIService.getUIData().then(function(uiData) {
                    self.object = uiData;
                    self._snapshotDataObjectsIfNecessary();
                });
                return this.application.dataService.fetchData(Model.CryptoCertificate).then(function (certificates) {
                    self.certificates = certificates.filter(self._isCertificate);
                });
                Model.populateObjectPrototypeForType(Model.NetworkConfig).then(function(networkConfig) {
                    return networkConfig.constructor.services.getMyIps();
                }).then(function(ipData){
                    for (var i = 0; i < ipData.length; i++) {
                        if (/^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/.test(ipData[i])) {
                            self.IPv4_OPTIONS.push(ipData[i]);
                        } else if(/!^[FE|fe]/.test(ipData[i])) {
                            self.IPv6_OPTIONS.push(ipData[i]);
                        }
                    }
                    self.IPv4_OPTIONS.unshift({label:"all", value: "0.0.0.0"});
                    self.IPv6_OPTIONS.unshift({label:"all", value: "::"});
                });
                self.isLoading = false;
            }
        }
    },

    save: {
        value: function() {
            return this.application.systemUIService.saveUIData(this.object);
        }
    },

    revert: {
        value: function() {
            this.object.webui_protocol = this._object.webui_protocol;
            this.object.ipv4 = this._object.ipv4
            this.object.ipv6 = this._object.ipv6
            this.object.webui_http_port = this._object.webui_http_port
            this.object.webui_https_port = this._object.webui_https_port
            this.object.webui_https_certificate = this._object.webui_https_certificate
            this.object.webui_http_redirect_https = this._object.webui_http_redirect_https
            this.object.webui_listen = this._object.webui_listen

        }
    },

    _isCertificate: {
        value: function (cert) {
            return cert.type.startsWith("CERT");
        }
    },

    _snapshotDataObjectsIfNecessary: {
        value: function() {
            if(!this._object) {
                this._object = this.application.dataService.clone(this.object);
            }
        }
    }

});
