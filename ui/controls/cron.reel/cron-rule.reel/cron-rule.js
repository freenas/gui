/**
 * @module ui/cron-rule.reel
 */
var Component = require("montage/ui/component").Component,
    Rule = require("ui/controls/cron.reel/rule").Rule;

/**
 * @class CronRule
 * @extends Component
 */
var CronRule = exports.CronRule = Component.specialize(/** @lends CronRule# */ {

    rulesController: {
        value: null
    },

    rule: {
        value: null
    },

    values: {
        value: null
    },

    selectedType: {
        value: null
    },

    enterDocument: {
        value: function () {
            this._cancelSelectedTypeChangeListener = this.addPathChangeListener("selectedType", this, "handleSelectedTypeChange");
        }
    },

    exitDocument: {
       value: function () {
           this._cancelSelectedTypeChangeListener();
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
            } else {
                if (this.mode === CronRule.MODES.EDITOR) {
                    this.value = this.selectedType === this.rule.type && this.rule.values.length === 1
                        ? this.rule.values[0]: 0;

                } else {
                    this.value = 0;
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

