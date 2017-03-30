var Component = require("montage/ui/component").Component,
    AccountService = require("core/service/account-service").AccountService,
    _ = require("lodash");

exports.AbstractSearchAccount = Component.specialize({

    constructor: {
        value: function () {
            this.service = AccountService.getInstance();
            this._isLoading = { loadingLabel: false, loadingOptions: false };
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
        value: null
    },

    isLoading: {
        get: function () {
            return !!_.find(this._isLoading, function (prop) { return prop === true });
        }
    },

    value: {
        value: null
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
