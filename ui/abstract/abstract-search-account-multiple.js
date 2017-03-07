var AbstractSearchAccount = require("ui/abstract/abstract-search-account").AbstractSearchAccount,
    AccountService = require("core/service/account-service").AccountService,
    _ = require("lodash");

exports.AbstractSearchAccountMultiple = AbstractSearchAccount.specialize({

    //Override properties from AbstractSearchAccount
    _value: {
        value: void 0
    },

    value: {
        value: void 0
    },

    _findLabelForValue: {
        value: void 0
    },

     _values: {
        value: null
    },

    values: {
        set: function (values) {
            if (this._values !== values) {
                this._values = values;

                if (values) {
                    this._findLabelsForValues(values);
                } else {
                    this.displayedValues = null;
                }
            }
        },
        get: function () {
            return this._values;
        }
    },

    _findLabelsForValues: {
        value: function (values) {
            if (typeof this.findLabelForValue === 'function') {
                var criteria = {},
                    promises = [],
                    self = this;

                this._setLoadingStep('loadingLabel', true);

                values.forEach(function (value) {
                    criteria[self.valuePath] = value;
                    promises.push(self.findLabelForValue(criteria));
                });

                Promise.all(promises).then(function (entries) {
                    entries = _.flatten(entries);
                    self.entries = entries && entries.length ? entries : self.values;
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
