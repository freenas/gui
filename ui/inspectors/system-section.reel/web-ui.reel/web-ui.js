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

    Webui_Https_Certificate_Options: {
        value: null
    },

    enterDocument: {
        value: function(isFirstTime) {
            var self = this;
            if(isFirstTime) {
                this.isLoading = true;
                this.application.systemUIService.getUIData().then(function(uiData) {
                    self.object = uiData;
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
    }

});
