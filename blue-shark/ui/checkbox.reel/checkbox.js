/**
 * @module ui/checkbox.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Checkbox
 * @extends Component
 * 
 * @fixme: need to be refactored
 * Kind of hacky with the label.
 * could be just a subclass of checkbox.
 * 
 */
exports.Checkbox = Component.specialize({
    
    _uid: {
        value: null
    },

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                this._uid = this.constructor.generateUID();
                this.checkboxComponent.element.setAttribute("id", this._uid);
                this.labelComponent.element.setAttribute("for", this._uid);
            }
        }
    }
}, {

    _lastUID: {
        value: Date.now()
    },

    generateUID: {
        value: function () {
            return "checkbox-" + ++this._lastUID;
        }
    }

});
