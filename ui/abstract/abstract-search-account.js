var Component = require("montage/ui/component").Component,
    AccountService = require("core/service/account-service").AccountService,
    _ = require("lodash");

exports.AbstractSearchAccount = Component.specialize({

    constructor: {
        value: function () {
            this.service = AccountService.getInstance();
        }
    },

    _labelPath: {
        value: null
    },

    labelPath: {
        set: function (path) {
            if (this._labelPath !== path) {
                if (typeof path === "string" && path.length) {
                    this._labelPath = path;
                } else {
                    this._labelPath = null;
                }
            }
        },
        get: function () {
            return this._labelPath || this.constructor.labelPath;
        }
    },

    _valuePath: {
        value: null
    },

    valuePath: {
        set: function (path) {
            if (this._valuePath !== path) {
                if (typeof path === "string" && path.length) {
                    this._valuePath = path;
                } else {
                    this._valuePath = null;
                }
            }
        },
        get: function () {
            return this._valuePath || this.constructor.valuePath;
        }
    },

    _isLoading: {
        value: { loadingLabel: false, loadingOptions: false }
    },

    isLoading: {
        get: function () {
            return _.every(this._isLoading);
        }
    },

    _value: {
        value: null
    },

    value: {
        set: function (value) {
            if (this._value !== value) {
                this._value = value;

                if (value) {
                    this._findLabelForValue();
                } else {
                    this.displayedValue = null;
                }
            }
        },
        get: function () {
            return this._value;
        }
    },

    _setLoadingStep: {
        value: function (step, value) {
            this._isLoading[step] = !!value;
            this.dispatchOwnPropertyChange('isLoading', this.isLoading);
        }
    },

    enterDocument: {
        value: function () {
            this._loadInitialOptions();
        }
    },

    _findLabelForValue: {
        value: function () {
            if (typeof this.findLabelForValue === 'function') {
                var criteria = {},
                    self = this;

                criteria[this.valuePath] = this.value;
                this._setLoadingStep('loadingLabel', true);

                this.findLabelForValue(criteria).then(function (entries) {
                    self.displayedValue = entries && entries.length ?
                        entries[0][self.labelPath] : self.value;
                }).finally(function () {
                    self._setLoadingStep('loadingLabel', false);
                });
            }
        }
    },

    _loadInitialOptions: {
        value: function () {
            if (typeof this.loadInitialOptions === 'function') {
                var self = this;
                this._setLoadingStep('loadingOptions', true);

                this.loadInitialOptions().then(function (options) {
                    self.initialOptions = options;
                }).finally(function () {
                    self._setLoadingStep('loadingOptions', false);
                });
            }
        }
    }

});
