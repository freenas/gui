/**
 * @module ui/widget-icon.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class WidgetIcon
 * @extends Component
 */
exports.WidgetIcon = Component.specialize(/** @lends WidgetIcon# */ {
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
