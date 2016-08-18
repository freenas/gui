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
    TYPES: {
        value: Rule.TYPES
    },

    constructor: {
        value: function() {
            this.addPathChangeListener("rule.type", this, "_handleTypeChange");
        }
    },

    enterDocument: {
        value: function () {
            this._initializeOptionsIfNecessary();
            this.addRangeAtPathChangeListener("usedFields", this, "_buildAvailableUnitOptions");
            if (this.rule) {
                this._currentType = this.rule.type;
            }
        }
    },

    exitDocument: {
        value: function() {
            this.rule.field = null;
            this.rule = null;
        }
    },

    _buildAvailableUnitOptions: {
        value: function() {
            if (this.rule && this.usedFields) {
                var self = this,
                    myField = this.rule.field;
                this.availableUnitOptions = this.unitOptions.filter(function(x) {
                    var result = x.value === myField;
                    if (!result) {
                        result = self.usedFields.indexOf(x.value.name) == -1;
                    }
                    return result;
                });
                this.rule.field = myField;
            }
        }
    },

    _handleTypeChange: {
        value: function() {
            if (this._inDocument && this.rule && this._currentType !== this.rule.type) {
                this._currentType = this.rule.type;
                if (this._currentType === this.TYPES.EVERY) {
                    this.rule.values = [1];
                } else {
                    this.rule.values = [];
                }
            }
        }
    },

    _initializeOptionsIfNecessary: {
        value: function() {
            var self = this;
            if (!this.typeOptions) {
                this.typeOptions = [{ label: '-', value: null }].concat(
                    Object.keys(this.TYPES).map(function(x) {
                        return {
                            label: self.TYPES[x].toLowerCase().toCapitalized(),
                            value: self.TYPES[x]
                        }
                    })
                );
            }

            if (!this.unitOptions) {
                this.unitOptions = Object.keys(Rule.CRON_FIELDS).map(function(x) {
                    return {
                        label: Rule.CRON_FIELDS[x].label,
                        value: Rule.CRON_FIELDS[x]
                    }
                });
                this._buildAvailableUnitOptions();
            }
            
            if (!this.onValues) {
                var unit;
                this.onValues = {};
                for (var i = 0, length = this.unitOptions.length; i < length; i++) {
                    unit = this.unitOptions[i].value;
                    this.onValues[unit.name] = Rule.FIELD_VALUES[unit.index];
                }
            }
        }
    },

    handleRemoveRuleButtonAction: {
        value: function() {
            this.rulesController.removeRule(this.rule);
        }
    }
});

