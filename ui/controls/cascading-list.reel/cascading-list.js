var Component = require("montage/ui/component").Component;

exports.CascadingList = Component.specialize({

    constructor: {
        value: function () {
            this._stack = [];
        }
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
            this.expand(value);
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
            var i;

            if (columnIndex) {
                for (i = this._stack.length - columnIndex; i > 0; i--) {
                    this._pop();
                }
                this._push({
                    object: object,
                    inspector: object.inspector,
                    columnIndex: columnIndex
                });
            } else {
                this._popAll();
                this._push({
                    object: object,
                    inspector: object.inspector,
                    columnIndex: 0
                });
            }
        }
    }

});
