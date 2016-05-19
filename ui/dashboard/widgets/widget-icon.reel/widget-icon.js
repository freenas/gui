/**
 * @module ui/widget-icon.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class WidgetIcon
 * @extends Component
 */
exports.WidgetIcon = Component.specialize(/** @lends WidgetIcon# */ {

    _setLevels: {
        value: function () {
            if(this._data) {
                for(var i = 0; i < this._data.length; i++) {
                    if (this._data[i].data.severity == 'CRITICAL') {
                        this.hasCritical = true;
                        return;
                    }
                    if (this._data[i].state == 'FAILED') {
                        this.hasError = true;
                        return;
                    }
                    if (this._data[i].data.severity == 'WARNING') {
                        this.hasWarning = true;
                    }
                    if (this._data[i].data.severity == 'INFO') {
                        this.hasInfo = true;
                    }
                }
            } else {
                console.log("no data");
            }
        }
    },

    _data: {
        value: null
    },

    data: {
        set: function (arr) {
            if(arr) {
                this._data = arr;
            }

        },
        get: function () {
            this._setLevels();
            return this._data;
        }
    },

    enterDocument: {
        value: function (isFirstTime) {
            if(isFirstTime) {
                this.svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                this.svgIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', "#" + this.icon);
                this.iconElement.appendChild(this.svgIcon);
            }
        }
    }
});
