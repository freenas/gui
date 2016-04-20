/**
 * @module ui/inspector.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Inspector
 * @extends Component
 */
exports.Inspector = Component.specialize(/** @lends Inspector# */ {

    handleDeleteAction: {
        value: function (event) {
            this._isToBeDeleted = true;

            if (typeof this.parentComponent.delete === 'function') {
                this.parentComponent.delete();
            } else if (this.object) {
                this.application.dataService.deleteDataObject(this.object);
            } else {
                console.warn('NOT IMPLEMENTED: delete() on', this.parentComponent.templateModuleId);
            }

            event.stopPropagation();
        }
    },

    handleRevertAction: {
        value: function(event) {
            if (typeof this.parentComponent.revert === 'function') {
                this.parentComponent.revert();
            } else {
                console.warn('NOT IMPLEMENTED: revert() on', this.parentComponent.templateModuleId);
            }
            event.stopPropagation();
        }
    },

    handleSaveAction: {
        value: function(event) {
            if (typeof this.parentComponent.save === 'function') {
                this.parentComponent.save();
            } else if (this.object) {
                this.application.dataService.saveDataObject(this.object);
            } else {
                console.warn('NOT IMPLEMENTED: save() on', this.parentComponent.templateModuleId);
            }
            event.stopPropagation();
        }
    }
});
