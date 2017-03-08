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
            return !!_.find(this._isLoading, function (prop) { return prop === true });
        }
    },

    _value: {
        value: null
    },

    value: {
        set: function (value) {
            if (this._value !== value) {
                this._value = value;

                if (value && typeof value === "string" &&
                    (!this.entry || (this.entry && typeof this.entry === "object" && this.entry[this.valuePath] !== value))) {
                    this._findLabelForValue(value);
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

    handleEntryChange: {
        value: function () {
            if (this.entry) {
                this.value = this.entry[this.valuePath];
            }
        }
    },

    enterDocument: {
        value: function (firstTime) {
            if (firstTime) {
                this.addPathChangeListener('entry', this, 'handleEntryChange');
            }
            this._loadInitialOptions();
        }
    },

    _findLabelForValue: {
        value: function (value) {
            if (typeof this.findLabelForValue === 'function') {
                var criteria = {},
                    self = this;

                criteria[this.valuePath] = value;
                this._setLoadingStep('loadingLabel', true);

                this.findLabelForValue(criteria).then(function (entries) {
                    self.entry = entries && entries.length ?
                        entries[0] : self.value;
                }).finally(function () {
                    self._setLoadingStep('loadingLabel', false);
                });
            }
        }
    },

    _loadInitialOptions: {
        value: function () {
            if (!this._loadInitialOptionsPromise && typeof this.loadInitialOptions === 'function') {
                var self = this;
                this._setLoadingStep('loadingOptions', true);

                this._loadInitialOptionsPromise = this.loadInitialOptions().then(function (options) {
                    self.initialOptions = options;
                }).finally(function () {
                    self._setLoadingStep('loadingOptions', false);
                    self._loadInitialOptionsPromise = null;
                });
            }
        }
    }

});
