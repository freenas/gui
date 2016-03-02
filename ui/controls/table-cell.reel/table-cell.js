var Component = require("montage/ui/component").Component;

/**
 * @class TableCell
 * @extends Component
 */
exports.TableCell = Component.specialize({

    _value: {
        value: null
    },

    value: {
        get: function () {
            return this._value;
        },
        set: function (value) {
            this._value = value;
            this.needsDraw = true;
        }
    },

    _type: {
        value: null
    },

    type: {
        get: function () {
            return this._type;
        },
        set: function (value) {
            this._type = value;
            this.needsDraw = true;
        }
    },

    _typeClass: {
        value: null
    },

    draw: {
        value: function () {
            if (this._type === "boolean") {
                if (this._value) {
                    if (this._typeClass !== "TableCell-true") {
                        this._typeClass = "TableCell-true";
                        this._element.classList.add(this._typeClass);
                        this._element.textContent = "";
                        this.title = "";
                    }
                } else {
                    if (this._typeClass !== "TableCell-false") {
                        this._typeClass = "TableCell-false";
                        this._element.classList.add(this._typeClass);
                        this._element.textContent = "";
                        this.title = "";
                    }
                }
            } else {
                if (this._typeClass !== null) {
                    this._element.classList.remove(this._typeClass);
                    this._typeClass = null;
                }
                this._element.textContent = this._value;
                this.title = this._value;
            }
        }
    }

});
