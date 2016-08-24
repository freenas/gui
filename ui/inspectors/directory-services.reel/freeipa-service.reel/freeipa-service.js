/**
 * @module ui/freeipa-service.reel
 */
var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class FreeipaService
 * @extends Component
 */
exports.FreeipaService = Component.specialize(/** @lends FreeipaService# */ {
    
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
