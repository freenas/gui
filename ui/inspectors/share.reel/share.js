var Component = require("montage/ui/component").Component;

/**
 * @class Share
 * @extends Component
 */
exports.Share = Component.specialize({
    save: {
        value: function() {
            this.application.dataService.saveDataObject(this.object);
        }
    }
});
