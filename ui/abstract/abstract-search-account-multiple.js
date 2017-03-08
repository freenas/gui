var AbstractSearchAccount = require("ui/abstract/abstract-search-account").AbstractSearchAccount,
    AccountService = require("core/service/account-service").AccountService,
    _ = require("lodash");

exports.AbstractSearchAccountMultiple = AbstractSearchAccount.specialize({

    enterDocument: {
        value: function (firstTime) {
            if (firstTime) {
                this.addRangeAtPathChangeListener('entries', this, 'handleEntriesChange');
            }
            this._loadInitialOptions();
        }
    },

    //Override properties from AbstractSearchAccount
    _value: {
        value: null
    },

    value: {
        value: null
    },

    _findLabelForValue: {
        value: null
    },

    _values: {
        value: null
    },

    values: {
        set: function (values) {
            if (this._values !== values) {
                this._values = values;

                if (values && (!this.entries || values.length !== this.entries.length)) {
                    this._findLabelsForValues(values);
                }
            }
        },
        get: function () {
            return this._values;
        }
    },

    handleEntriesChange: {
        value: function () {
            if (this.entries) {
                var self = this;
                this._values = this.entries.map(function (entry) {
                    var value = entry[self.valuePath];
                    return self.valuePath !== 'id' && entry.origin && entry.origin.domain && entry.origin.domain !== 'local' ?
                        value + '@' + entry.origin.domain : value;
                });
                this.dispatchOwnPropertyChange("values", this.values);
            }

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
                    if (self.valuePath !== 'id' && value.indexOf('@') > -1) {
                        var data = value.split('@');
                        criteria[self.valuePath] = data[0];
                        criteria.origin = {
                            domain: data[1]
                        };
                    } else {
                        criteria[self.valuePath] = value;
                    }

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
    }

});
