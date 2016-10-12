var Component = require("montage/ui/component").Component;

/**
 * @class Interface
 * @extends Component
 */
exports.Interface = Component.specialize({
    active_media_type: {
        value: null
    },

    templateDidLoad: {
        value: function () {
            var self = this;
            self.active_media_type = this.object.status.active_media_type.concat(" ", this.object.status.active_media_subtype);
        }
    }
});
