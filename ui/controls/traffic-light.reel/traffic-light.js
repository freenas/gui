/**
 * @module ui/controls/traffic-light.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class TrafficLight
 * @extends Component
 */
exports.TrafficLight = Component.specialize(/** @lends TrafficLight# */ {

    enterDocument: {
        value: function(isFirstTime) {
            if (isFirstTime) {
                this.addPathChangeListener("lightClass", this, "_handleLightClassChange");
            }
        }
    },

    _handleLightClassChange: {
        value: function() {
            if (this._currentLightClass) {
                this.classList.remove('is-' + this._currentLightClass);
            }
            this._currentLightClass = this.lightClass;
            if (this.lightClass) {
                this.classList.add('is-' + this.lightClass);
            }
        }
    }
});
