/**
 * @module ui/view-select.reel
 */
var Component = require("montage/ui/component").Component,
    PressComposer = require("montage/composer/press-composer").PressComposer;



/**
 * @class ViewSelect
 * @extends Component
 */
exports.ViewSelect = Component.specialize({

    handleSelectedValueChange: {
        value: function () {
            this.needsDraw = true;
        }
    },

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                this.addOwnPropertyChangeListener('selectedValue', this, false);
            }
        }
    },

    draw: {
        value: function () {
            this.currentSelectedIcon.setAttributeNS('http://www.w3.org/1999/xlink','href', ("#i-" + this.selectedValue + "View"));
        }
    }

});
