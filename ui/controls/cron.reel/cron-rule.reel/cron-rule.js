/**
 * @module ui/cron-rule.reel
 */
var Component = require("montage/ui/component").Component,
    Rule = require("ui/controls/cron.reel/rule").Rule;

var EMPTY_STRING = "";
/**
 * @class CronRule
 * @extends Component
 */
var CronRule = exports.CronRule = Component.specialize(/** @lends CronRule# */ {

    selectedType: {
        value: null
    },

    enterDocument: {
        value: function () {
            if (!this.options) {
                if (typeof this.min === "number" && typeof this.max === "number") {
                    var options = [];
                    for (var i = this.min; i <= this.max; i++) {
                        options.push({value: i, label: i + EMPTY_STRING});
                    }
                    this.displayOptions = options;
                }
            } else {
                this.displayOptions = this.options.map(function(x) { return {value: x, label: x}; });
            }

            var parsedValue = parseInt(this.value);
            if (isNaN(parsedValue)) {
                var period = this.value.split('/')[1];
                this.every = period ? +period : 1;
                this.type = this.constructor.SELECTOR_TYPES.EVERY;
            } else {
                this.on = parsedValue;
                this.type = this.constructor.SELECTOR_TYPES.ON;
            }

//            this._cancelSelectedTypeChangeListener = this.addPathChangeListener("selectedType", this, "handleSelectedTypeChange");
        }
    },

    exitDocument: {
       value: function () {
//           this._cancelSelectedTypeChangeListener();
       }
    },

    handleSelectedTypeChange: {
        value: function () {
            if (this.selectedType === this.constructor.SELECTOR_TYPES.ON) {
                if (this.mode === CronRule.MODES.EDITOR) {
                    this.values = this.selectedType === this.rule.type ? this.rule.values.slice() : [];

                } else {
                    this.values = [];
                }
            }
        }
    }

}, {

    MODES: {
        value: {
            EDITOR: "EDITOR",
            CREATOR: "CREATOR"
        }
    },

    _SELECTOR_OPTIONS: {
        value: null
    },

    SELECTOR_OPTIONS: {
        get: function () {
            if (!this._SELECTOR_OPTIONS) {
                this._SELECTOR_OPTIONS = [
                    {"value": this.SELECTOR_TYPES.EVERY, "label": "Every"},
                    {"value": this.SELECTOR_TYPES.ON, "label": "On"}
                ];
            }

            return this._SELECTOR_OPTIONS;
        }
    }

});


CronRule.SELECTOR_TYPES = Rule.TYPES;
CronRule.FIELD_VALUES = Rule.FIELD_VALUES;

