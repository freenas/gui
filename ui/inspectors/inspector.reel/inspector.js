/**
 * @module ui/inspector.reel
 */
var Component = require("montage/ui/component").Component,
    CascadingList = require("ui/controls/cascading-list.reel").CascadingList;
    Promise = require("montage/core/promise").Promise;

/**
 * @class Inspector
 * @extends Component
 */
exports.Inspector = Component.specialize(/** @lends Inspector# */ {

    handleDeleteAction: {
        value: function(event) {
            var self = this;

            if (typeof this.parentComponent.delete === 'function') {
                var promise = this.parentComponent.delete();

                if (Promise.is(promise)) {
                    promise.then(function () {
                        self._dismissInspector();
                    });
                } else {
                    self._dismissInspector();
                }
            } else if (this.object) {
                this.application.dataService.deleteDataObject(this.object).then(function () {
                    self._dismissInspector();
                });
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
    },

    _dismissInspector: {
        value: function () {
            var cascadingListItem = CascadingList.findCascadingListItemContextWithComponent(this);

            if (cascadingListItem) {
                cascadingListItem.cascadingList._pop();
            } else {
                console.warn('BUG: inspector component doesn\'t belong to the cascading');
            }
        }
    }
});
