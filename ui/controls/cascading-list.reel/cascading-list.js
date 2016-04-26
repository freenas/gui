var Component = require("montage/ui/component").Component,
    CascadingListItem = require("ui/controls/cascading-list.reel/cascading-list-item.reel").CascadingListItem;


exports.CascadingList = Component.specialize({


    constructor: {
        value: function () {
            this._stack = [];
        }
    },


    _stack: {
        value: null
    },


    _root: {
        value: null
    },


    root: {
        get: function () {
            return this._root;
        },
        set: function (value) {
            this._root = value;

            if (value) {
                this.expand(value);
            }
        }
    },


    _push: {
        value: function (object) {
            this._stack.push(object);
            this.needsDraw = true;
        }
    },


    _pop: {
        value: function () {
            this._resetCascadingListItemAtIndex(this._currentIndex);
            this._stack.pop();
            this._currentIndex--;
        }
    },

    _resetCascadingListItemAtIndex: {
        value: function (index) {
            var cascadingListItem = this.cascadingListItemAtIndex(index);

            if (cascadingListItem) {
                cascadingListItem.resetSelection();
            }
        }
    },

    pop: {
        value: function () {
            this._pop();
            this.needsDraw = true;
        }
    },

    popAll: {
        value: function () {
            while (this._stack.length) {
                this._pop();
            }
        }
    },

    exitDocument: {
        value: function () {
            this._resetCascadingListItemAtIndex(0);

            if (this._currentIndex > 0) {
                this.popAtIndex(1);
            }
        }
    },

    popAtIndex: {
        value: function (index) {
            if (index <= this._currentIndex && this._currentIndex !== -1) {
                this._pop();

                // the value of the property _currentIndex changed when _pop() has been called.
                if (index <= this._currentIndex) {
                    this.popAtIndex(index);
                }
            }
        }
    },

    expand: {
        value: function (object, columnIndex) {
            columnIndex = columnIndex || 0;

            if (columnIndex) {
                for (var i = this._stack.length - columnIndex; i > 0; i--) {
                    this._pop();
                }
            } else {
                this.popAll();
            }

            this._populateColumnWithObjectAndIndex(object, columnIndex);
            this._currentIndex = columnIndex;
        }
    },


    cascadingListItemAtIndex: {
        value: function (index) {
            if (index <= this._currentIndex) {
                return this.repetition.childComponents[index];
            }

            return null;
        }
    },


    _populateColumnWithObjectAndIndex: {
        value: function (object, columnIndex) {
            var self = this;

            this.application.delegate.userInterfaceDescriptorForObject(object).then(function (userInterfaceDescriptor) {
                self._push({
                    object: object,
                    userInterfaceDescriptor: userInterfaceDescriptor,
                    columnIndex: columnIndex
                });
            });
        }
    }

}, {


    findCascadingListItemContextWithComponent: {
        value: function (component) {
            var parentComponent = component.parentComponent;

            if (parentComponent) {
                if (parentComponent instanceof CascadingListItem) {
                    return parentComponent;
                }

                return this.findCascadingListItemContextWithComponent(parentComponent);
            }

            return null;
        }
    },

    findPreviousCascadingListItemContextWithComponent: {
        value: function (component) {
            var cascadingListItem = this.findCascadingListItemContextWithComponent(component),
                previousCascadingListItem = null;

            if (cascadingListItem && cascadingListItem.data.columnIndex > 0) {
                previousCascadingListItem = cascadingListItem.cascadingList.cascadingListItemAtIndex(cascadingListItem.data.columnIndex -1);
            }

            return previousCascadingListItem;
        }
    },

    findPreviousContextWithComponent: {
        value: function (component) {
            var previousCascadingListItem = this.findPreviousCascadingListItemContextWithComponent(component);

            return previousCascadingListItem ? previousCascadingListItem.data : null;
        }
    }


});
