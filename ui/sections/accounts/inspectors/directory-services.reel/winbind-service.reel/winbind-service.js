var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model,
    WinbindDirectoryParamsSaslWrapping = require('core/model/enumerations/WinbindDirectoryParamsSaslWrapping').WinbindDirectoryParamsSaslWrapping,
    _ = require('lodash');

exports.WinbindService = Component.specialize({
    saslWrappingOptions: {
        value: _.map(_.values(_.omit(WinbindDirectoryParamsSaslWrapping, '_montage_metadata')), function(x) { return { label: x, value: x}})
    },

    enterDocument: {
        value: function () {
            console.log(WinbindDirectoryParamsSaslWrapping);
            var self = this;
            this.isLoading = true;
            this._populateObjectIfNeeded().then(function() {
                if (!self.object.parameters.sasl_wrapping) {
                    self.object.parameters.sasl_wrapping = 'PLAIN';
                }
                self.isLoading = false;
            });
        }
    },

    _populateObjectIfNeeded: {
        value: function () {
            var promise;
            if (this.object && !this.object.parameters) {
                var self = this;

                promise = this.application.dataService.getNewInstanceForType(Model.WinbindDirectoryParams).then(function (winbindDirectoryParams) {
                    return self.object.parameters = winbindDirectoryParams;
                });
            } else {
                promise = Promise.resolve();
            }
            return promise;
        }
    }

});
