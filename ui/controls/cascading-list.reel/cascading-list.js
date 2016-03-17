var Component = require("montage/ui/component").Component;


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
            this.needsDraw = true;
        }
    },


    _popAll: {
        value: function () {
            while (this._stack.length) {
                this._stack.pop();
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
    },

    _findObjectPropertyNameWithChildValue: {
        value: function (parentObject, childValue) {
            var objectPropertyKeys = Object.keys(parentObject),
                objectPropertyKey;

            for (var i = 0, length = objectPropertyKeys.length; i < length; i++) {
                if (objectPropertyKeys[i] === childValue) {
                    objectPropertyKey = i;
                    break;
                }
            }

            return objectPropertyKey;
        }
    }

});
