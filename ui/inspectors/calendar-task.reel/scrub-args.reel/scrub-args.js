/**
 * @module ui/scrub-args.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class ScrubArgs
 * @extends Component
 */
exports.ScrubArgs = Component.specialize(/** @lends ScrubArgs# */ {
    enterDocument: {
        value: function(isFirstTime) {
            var self = this;
            this.application.storageService.listVolumes().then(function(volumes) {
                self._volumes = volumes;
                if (isFirstTime) {
                    self.addRangeAtPathChangeListener("volumes", self, "_handleVolumesChange");
                }
            });

            if (!this.args || this.args.length != 1) {
                this.args = ['---'];
                this.args.length = 1;
            }
        }
    },

    _handleVolumesChange: {
        value: function() {
            this.volumes = [{id: '---'}].concat(this._volumes);
        }
    }
});
