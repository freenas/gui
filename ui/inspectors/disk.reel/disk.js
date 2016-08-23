var Component = require("montage/ui/component").Component,
    DiskAcousticlevel = require("core/model/enumerations/disk-acousticlevel").DiskAcousticlevel;

/**
 * @class Disk
 * @extends Component
 */
exports.Disk = Component.specialize({
    templateDidLoad: {
        value: function() {
            this.acousticLevelOptions = DiskAcousticlevel.members.map(function(x) {
                return {
                    label: x,
                    value: x
                };
            });
        }
    }
});
