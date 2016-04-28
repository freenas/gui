var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class Accounts
 * @extends Component
 */
exports.Accounts = Component.specialize({

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                var dataService = this.application.dataService,
                    accountCategories,
                    self = this;

                this.addRangeAtPathChangeListener("groups", this, "_handleAccountChange");
                this.addRangeAtPathChangeListener("users", this, "_handleAccountChange");

                //Fixme: getDataObject needs to return a promise
                return dataService.getNewInstanceForType(Model.AccountCategory).then(function (accountCategory) {
                    accountCategories = self.accountCategories = accountCategory;
                    accountCategories.user = dataService.getEmptyCollectionForType(Model.User);
                    accountCategories.group = dataService.getEmptyCollectionForType(Model.Group);
                    accountCategories.system = dataService.getEmptyCollectionForType(Model.AccountSystem);

                    return Promise.all([self._listUsers(), self._listGroups()]);
                });
            }
        }
    },

    _listUsers: {
        value: function() {
            var self = this;

            return this.application.dataService.fetchData(Model.User).then(function (users) {
                self.users = users;
            });
        }
    },

    _listGroups: {
        value: function() {
            var self = this;
            return this.application.dataService.fetchData(Model.Group).then(function (groups) {
                self.groups = groups;
            });
        }
    },


    _handleAccountChange: {
        value: function (plus, minus) {
            if (this.accountCategories) {
                if (plus && plus.length) {
                    this._addAccounts(plus, Object.getPrototypeOf(plus[0]).Type);
                }

                if (minus && minus.length) {
                    this._removeAccounts(minus, Object.getPrototypeOf(minus[0]).Type);
                }
            }
        }
    },

    _addAccounts: {
        value: function (collection, modelType) {
            var accountCategories = this.accountCategories,
                isGroup = Model.Group === modelType,
                entity;

            for (var i = 0, length = collection.length; i < length; i++) {
                entity = collection[i];

                if (entity.builtin) {
                    accountCategories.system.push(entity);
                } else if (isGroup) {
                    accountCategories.group.push(entity);
                } else {
                    accountCategories.user.push(entity);
                }
            }
        }
    },

    _removeAccounts: {
        value: function (collection, modelType) {
            var accountCategories = this.accountCategories,
                isGroup = Model.Group === modelType,
                entity;

            for (var i = 0, length = collection.length; i < length; i++) {
                entity = collection[i];

                if (entity.builtin) {
                    accountCategories.system.splice(accountCategories.system.indexOf(entity), 1);
                } else if (isGroup) {
                    accountCategories.group.splice(accountCategories.group.indexOf(entity), 1);
                } else {
                    accountCategories.user.splice(accountCategories.user.indexOf(entity), 1);
                }
            }
        }
    }

});
