/**
 * @module ui/inspector-confirmation.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class InspectorConfirmation
 * @extends Component
 */
exports.InspectorConfirmation = Component.specialize(/** @lends InspectorConfirmation# */ {

    handleConfirmDeleteAction: {
        value: function (event) {
            this.parentComponent.isConfirmationVisible = false;
            this.confirmDelete();
        }
    },

    handleCancelDeleteAction: {
        value: function() {
            this.parentComponent.isConfirmationVisible = false;
        }
    },

    confirmDelete: {
        value: function (event) {
            var self = this,
                promise;

            this.parentComponent._isToBeDeleted = true;

            if (typeof this.parentComponent.parentComponent.delete === 'function') {
                promise = this.parentComponent.parentComponent.delete();

                if (Promise.is(promise)) {
                    promise.catch(this.parentComponent._logError);
                }
            } else if (this.parentComponent.object) {
                this.parentComponent.object.__isLocked = true;
                promise = this.application.dataService.deleteDataObject(this.parentComponent.object).catch(this.parentComponent._logError);
                promise.then(function(){
                    self.object.__isLocked = false;
                    self.clearObjectSelection();
                });
            } else {
                console.warn('NOT IMPLEMENTED: delete() on', this.parentComponent.parentComponent.templateModuleId);
            }

            if (event) {
                event.stopPropagation();
            }
        }
    }
});
