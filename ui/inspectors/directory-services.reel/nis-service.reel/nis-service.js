/**
 * @module ui/nis-service.reel
 */
var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class NisService
 * @extends Component
 */
exports.NisService = Component.specialize(/** @lends NisService# */ {

    enterDocument: {
        value: function () {
            this._populateObjectIfNeeded();
        }
    },

    _populateObjectIfNeeded: {
        value: function () {
            if (this.object && !this.object.parameters) {
                var self = this;

                return this.application.dataService.getNewInstanceForType(Model.NisDirectoryParams).then(function (nisDirectoryParams) {
                    return self.object.parameters = nisDirectoryParams;
                });
            }
        }
    }
});
