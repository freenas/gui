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
        value: function() {
            var self = this;
            this.application.storageService.listVolumes().then(function(volumes) {
                self.volumes = volumes;
            });
        }
    }
});
