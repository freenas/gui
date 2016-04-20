/**
 * @module ui/inspector.reel
 */
var Component = require("montage/ui/component").Component,
    Promise = require("montage/core/promise").Promise;

/**
 * @class Inspector
 * @extends Component
 */
exports.Inspector = Component.specialize(/** @lends Inspector# */ {

    handleDeleteAction: {
        value: function (event) {
            this._isToBeDeleted = true;

            if (typeof this.parentComponent.delete === 'function') {
                var promise = this.parentComponent.delete();

                if (Promise.is(promise)) {
                    promise.catch(this._logError);
                }
            } else if (this.object) {
                this.application.dataService.deleteDataObject(this.object).catch(this._logError);
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
                var promise = this.parentComponent.save();

                if (Promise.is(promise)) {
                    promise.catch(this._logError);
                }
            } else if (this.object) {
                this.application.dataService.saveDataObject(this.object).catch(this._logError);
            } else {
                console.warn('NOT IMPLEMENTED: save() on', this.parentComponent.templateModuleId);
            }
            event.stopPropagation();
        }
    },

    _logError: {
        value: function (message) {
            //todo: provide UI
            console.warn(JSON.stringify(message.error));
        }
    }
});
