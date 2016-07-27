/**
 * @module ui/web-ui.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class WebUi
 * @extends Component
 */
exports.WebUi = Component.specialize(/** @lends WebUi# */ {

    PROTOCOL_OPTIONS: {
        value: [
            "HTTP",
            "HTTPS"
        ]
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
                    self.uiData = uiData;
                    self.object = uiData.systemUI;
                });
                self.isLoading = false;
            }
        }
    }

});
