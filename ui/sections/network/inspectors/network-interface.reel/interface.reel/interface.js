var Component = require("montage/ui/component").Component;

/**
 * @class Interface
 * @extends Component
 */
exports.Interface = Component.specialize({
    active_media_type: {
        value: null
    },

    enterDocument: {
        value: function () {
            this.active_media_type = this.object.status.active_media_type + " " + this.object.status.active_media_subtype;
        }
    }
});
