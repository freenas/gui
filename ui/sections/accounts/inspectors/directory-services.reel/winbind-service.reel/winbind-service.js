var Component = require("montage/ui/component").Component,
    WinbindDirectoryParamsSaslWrapping = require('core/model/enumerations/WinbindDirectoryParamsSaslWrapping').WinbindDirectoryParamsSaslWrapping,
    _ = require('lodash');

exports.WinbindService = Component.specialize({
    saslWrappingOptions: {
        value: _.map(_.values(_.omit(WinbindDirectoryParamsSaslWrapping, '_montage_metadata')), function(x) { return { label: x, value: x}})
    },

    enterDocument: {
        value: function () {
            if (!this.object.parameters.sasl_wrapping) {
                this.object.parameters.sasl_wrapping = 'PLAIN';
            }
        }
    }

});
