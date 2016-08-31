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

    fieldOnValues: {
        get: function() {
            return this.onValues[fieldName] || [];
        }
    },   

    _type: {
        value: null
    },

    type: {
        get: function() {
            return this._type;
        },
        set: function(type) {
            if (this._type !== type) {
                this._type = type;
                if (this._inDocument && this._fieldName) {
                    this._refreshRuleValue();
                }
            }
        }
    },

    _everyValue: {
        value: null
    },

    everyValue: {
        get: function() {
            return this._everyValue;
        },
        set: function(everyValue) {
            if (this._everyValue !== everyValue) {
                this._everyValue = everyValue;
                if (this._inDocument && this._fieldName) {
                    this._refreshRuleValue();
                }
            }
        }
    },

    _onValue: {
        value: null
    },

    onValue: {
        get: function() {
            return this._onValue;
        },
        set: function(onValue) {
            if (this._onValue !== onValue) {
                this._onValue = onValue;
                if (this._inDocument && this._fieldName) {
                    this._refreshRuleValue();
                }
            }
        }
    },

    _fieldName: {
        value: null
    },

    fieldName: {
        get: function() {
            return this._fieldName;
        },
        set: function(fieldName) {
            if (this._fieldName !== fieldName) {
                if (this._inDocument && !this._isExiting && !this._isEntering) {
                    if (this._fieldName) {
                        this.rulesController.removeField(this._fieldName);
                    }
                    if (fieldName) {
                        this.rulesController.updateField(fieldName, this.type, this._values);
                    }
                }
                this._fieldName = fieldName;
            }
        }
    },

    _values: {
        get: function() {
            return this.type === this.TYPES.ON ? this.onValue : [this.everyValue];
        }
    },

    enterDocument: {
        value: function () {
            this._isEntering = true;
            this._initializeOptionsIfNecessary();
            this.type = this.rule.type;
            this.onValue = this.type === this.TYPES.ON ? this.rule.values.slice() : [];
            this.everyValue =  this.type === this.TYPES.EVERY ? this.rule.values[0] : 1;
            this.fieldName = this.rule.field.name;
            this._isEntering = false;
        }
    },

    exitDocument: {
        value: function() {
            this._isExiting = true;
            this.fieldName = null;
            this.type = null;
            this.onValue = null;
            this.everyValue = null;
            this._isexiting = false;
        }
    },

    _refreshRuleValue: {
        value: function() {
            this.rulesController.updateField(this.fieldName, this.type, this._values);
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
                        value: Rule.CRON_FIELDS[x].name
                    }
                });
                this.availableUnitOptions = this.unitOptions;
            }
            
            if (!this.onValues) {
                var unit;
                this.onValues = {};
                for (var i = 0, length = this.unitOptions.length; i < length; i++) {
                    unit = this.unitOptions[i].value;
                    this.onValues[unit] = Rule.FIELD_VALUES[Rule.CRON_FIELDS[unit].index];
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

