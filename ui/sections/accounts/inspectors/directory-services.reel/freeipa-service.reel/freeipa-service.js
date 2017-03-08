var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

exports.FreeipaService = Component.specialize({

    enterDocument: {
        value: function () {
            this._populateObjectIfNeeded();
        }
    },

    _populateObjectIfNeeded: {
        value: function () {
            if (this.object && !this.object.parameters) {
                var self = this;

                return this.application.dataService.getNewInstanceForType(Model.FreeipaDirectoryParams).then(function (freeipaDirectoryParams) {
                    return (self.object.parameters = freeipaDirectoryParams);
                });
            }
        }
    }
});
