var Component = require("montage/ui/component").Component,
    AccountService = require("core/service/account-service").AccountService;

exports.SearchGroups = Component.specialize(/** @lends SearchGroups# */ {

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

    enterDocument: {
        value: function (firstTime) {
            if (firstTime) {
                this.service = AccountService.getInstance();
            }

            var criteria = {},
                self = this;

            criteria[this.valuePath] = this.value;
            this.isLoading = true;

            this.service.searchGroupWithCriteria(criteria).then(function (entries) {
                if (entries && entries.length) {
                    self.displayedValue = entries[0][self.labelPath];
                }
            }).finally(function () {
                self.isLoading = false;
            });
        }
    },

    search: {
        value: function (value) {
             return this.service.searchGroup(value, {
                 labelPath: this.labelPath,
                 valuePath: this.valuePath
             });
        }
    },

    listDefaultOptions: {
        value: function () {
            //TODO
        }
    }
}, {

    labelPath: {
        value: 'name'
    },

    valuePath: {
        value: 'id'
    }

});
