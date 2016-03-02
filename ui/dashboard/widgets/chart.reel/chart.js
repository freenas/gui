var Component = require("montage/ui/component").Component,
    c3 = require("./c3.min");

/**
 * @class Chart
 * @extends Component
 */
exports.Chart = Component.specialize({

    _needsRegenerate: {
        value: true
    },

    needsRegenerate: {
        get: function () {
            return this._needsRegenerate;
        },
        set: function (value) {
            this._needsRegenerate = !!value;
            if (this._needsRegenerate) {
                this.needsDraw = true;
            }
        }
    },

    _data: {
        value: null
    },

    data: {
        get: function () {
            return this._data;
        },
        set: function (value) {
            this._data = value;
            this.needsDraw = true;
        }
    },

    _axis: {
        value: null
    },

    axis: {
        get: function () {
            return this._axis;
        },
        set: function (value) {
            this._axis = value;
            this.needsRegenerate = true;
            this.needsDraw = true;
        }
    },

    _color: {
        value: {
            pattern: ["#0196D8", "#B8252F", "#7045B2", "#F5E923", "#0DC92E"]
        }
    },

    color: {
        get: function () {
            return this._color;
        },
        set: function (value) {
            this._color = value;
            this.needsRegenerate = true;
            this.needsDraw = true;
        }
    },

    _point: {
        value: null
    },

    point: {
        get: function () {
            return this._point;
        },
        set: function (value) {
            this._point = value;
            this.needsRegenerate = true;
            this.needsDraw = true;
        }
    },

    _tooltip: {
        value: null
    },

    tooltip: {
        get: function () {
            return this._tooltip;
        },
        set: function (value) {
            this._tooltip = value;
            this.needsRegenerate = true;
            this.needsDraw = true;
        }
    },

    unload: {
        value: function (data) {
            if (this._c3Instance) {
                this._c3Instance.unload(data);
            }
        }
    },

    hide: {
        value: function (data) {
            if (this._c3Instance) {
                this._c3Instance.hide(data);
            }
        }
    },

    show: {
        value: function (data) {
            if (this._c3Instance) {
                this._c3Instance.show(data);
            }
        }
    },

    flow: {
        value: function (data) {
            if (this._c3Instance) {
                this._c3Instance.flow(data);
            }
        }
    },

    __columns: {
        value: null
    },

    _columns: {
        get: function () {
            return this.__columns;
        },
        set: function (value) {
            if (!this.__columns) {
                this.needsRegenerate = true;
            }
            this.__columns = value;
            this.needsDraw = true;
        }
    },

    exitDocument: {
        value: function () {
            this.needsRegenerate = true;
        }
    },

    _c3Instance: {
        value: null
    },

    draw: {
        value: function () {
            if (this._data && this.__columns) {
                if (this._needsRegenerate || !this._c3Instance) {
                    this._c3Instance = c3.generate({
                        bindto: this._element,
                        color: this._color,
                        data: this._data,
                        axis: this._axis,
                        point: this._point,
                        tooltip: this._tooltip
                    });
                    this._needsRegenerate = false;
                } else {
                    this._c3Instance.load(this._data);
                }
            }
        }
    }

});
