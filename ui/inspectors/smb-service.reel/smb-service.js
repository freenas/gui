var Component = require("montage/ui/component").Component;

/**
 * @class SmbService
 * @extends Component
 */
exports.SmbService = Component.specialize({
    enterDocument: {
        value: function(isFirstTime) {
            if (!this.object.filemask) {
                this.object.filemask = '666';
            }
            if (!this.object.dirmask) {
                this.object.dirmask = '777';
            }
        }
    }
});
