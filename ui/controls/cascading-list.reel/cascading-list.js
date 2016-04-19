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
            this._stack.pop();
            this._currentIndex--;
            this.needsDraw = true;
        }
    },


    _popAll: {
        value: function () {
            while (this._stack.length) {
                this._stack.pop();
                this._currentIndex = -1;
            }
        }
    },

    popAtIndex: {
        value: function (index) {
            if (index <= this._currentIndex && this._currentIndex !== -1) {
                this._stack.pop();

                if (index <= --this._currentIndex) {
                    this.popAtIndex(index);
                } else {
                    this.needsDraw = true;
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
                this._popAll();
            }

            this._populateColumnWithObjectAndIndex(object, columnIndex);
            this._currentIndex = columnIndex;
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
    }


});
