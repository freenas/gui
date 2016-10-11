var Component = require("montage/ui/component").Component,
    Promise = require("montage/core/promise").Promise,
    Model = require("core/model/model").Model;

/**
 * @class Accounts
 * @extends Component
 */
exports.Accounts = Component.specialize({


    _loadDataPromise: {
        value: null
    },

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                //TODO: Could probably be set after getting the data (performance improvement)
                this.addRangeAtPathChangeListener("groups", this, "_handleAccountChange");
                this.addRangeAtPathChangeListener("users", this, "_handleAccountChange");
            }

            this._loadDataIfNeeded();
        }
    },


    _loadDataIfNeeded: {
        value: function () {
            if (!this._loadDataPromise && !this.accountCategories) {
                var dataService = this.application.dataService,
                    accountCategories,
                    self = this;

                return this._loadDataPromise = dataService.getNewInstanceForType(Model.AccountCategory).then(function (accountCategory) {
                    accountCategory._isNew = false;
                    accountCategories = self.accountCategories = accountCategory;
                    accountCategories.isLoading = true;
                    accountCategories.user = dataService.getEmptyCollectionForType(Model.User);
                    accountCategories.group = dataService.getEmptyCollectionForType(Model.Group);
                    accountCategories.system = dataService.getEmptyCollectionForType(Model.AccountSystem);

                    return dataService.getNewInstanceForType(Model.DirectoryServices).then(function (directoryServices) {
                        return (accountCategories.directoryServices = directoryServices);
                    }).then(Promise.all([self._listUsers(), self._listGroups()])).then(function() {
                        self.accountCategories.isLoading = false;
                        self._loadDataPromise = null;
                    });
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
                    this._addAccounts(plus, plus[0].constructor.Type);
                }

                if (minus && minus.length) {
                    this._removeAccounts(minus, minus[0].constructor.Type);
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
