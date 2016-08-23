/**
 * @module ui/winbind-service.reel
 */
var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class WinbindService
 * @extends Component
 */
exports.WinbindService = Component.specialize(/** @lends WinbindService# */ {
   
   enterDocument: {
        value: function () {
            this._populateObjectIfNeeded();
        }
    },

    _populateObjectIfNeeded: {
        value: function () {
            if (this.object && !this.object.parameters) {
                var self = this;
                
                return this.application.dataService.getNewInstanceForType(Model.WinbindDirectoryParams).then(function (winbindDirectoryParams) {
                    return (self.object.parameters = winbindDirectoryParams);
                });
            }
        }
    }

});
