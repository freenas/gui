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
                var accountCategoryModelType = Model.AccountCategory,
                    dataService = this.application.dataService,
                    accountCategories,
                    self = this;

                this.addRangeAtPathChangeListener("groups", this, "_handleAccountChange");
                this.addRangeAtPathChangeListener("users", this, "_handleAccountChange");

                //Fixme: getDataObject needs to return a promise
                return Model.populateObjectPrototypeForType(accountCategoryModelType).then(function () {
                    accountCategories = self.accountCategories = dataService.getDataObject(accountCategoryModelType);
                    accountCategories.standardUser = dataService.getEmptyCollectionForType(Model.User);
                    accountCategories.systemUser = dataService.getEmptyCollectionForType(Model.User);
                    accountCategories.standardGroup = dataService.getEmptyCollectionForType(Model.Group);
                    accountCategories.systemGroup = dataService.getEmptyCollectionForType(Model.Group);

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

                if (isGroup) {
                    if (entity.builtin) {
                        accountCategories.systemGroup.push(entity);
                    } else {
                        accountCategories.standardGroup.push(entity);
                    }
                } else {
                    if (entity.builtin) {
                        accountCategories.systemUser.push(entity);
                    } else {
                        accountCategories.standardUser.push(entity);
                    }
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

                if (isGroup) {
                    if (entity.builtin) {
                        accountCategories.systemGroup.splice(accountCategories.systemGroup.indexOf(entity), 1);
                    } else {
                        accountCategories.standardGroup.splice(accountCategories.standardGroup.indexOf(entity), 1);
                    }
                } else {
                    if (entity.builtin) {
                        accountCategories.systemUser.splice(accountCategories.systemUser.indexOf(entity), 1);
                    } else {
                        accountCategories.standardUser.splice(accountCategories.standardUser.indexOf(entity), 1);
                    }
                }
            }
        }
    }

});
