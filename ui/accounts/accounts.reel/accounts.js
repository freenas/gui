var Component = require("montage/ui/component").Component,
    Promise = require("montage/core/promise").Promise,
    Model = require("core/model/model").Model,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService;

exports.Accounts = Component.specialize({

    _loadDataPromise: {
        value: null
    },

    templateDidLoad: {
        value: function() {
            this._eventDispatcherService = EventDispatcherService.getInstance();
            this._accountsService = this.application.accountsService;
            this._loadDataIfNeeded();
            this.users = [];
            this.groups = [];
            this._eventDispatcherService.addEventListener('modelChange.User', this._handleUserChange.bind(this));
            this._eventDispatcherService.addEventListener('modelChange.Group', this._handleGroupChange.bind(this));
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
                    accountCategories.userType = Model.User;
                    accountCategories.groupType = Model.Group;
                    accountCategories.systemType = Model.AccountSystem;
                    accountCategories.users = dataService.getEmptyCollectionForType(Model.User);
                    accountCategories.groups = dataService.getEmptyCollectionForType(Model.Group);

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
            return this._accountsService.listUsers();
        }
    },

    _listGroups: {
        value: function() {
            return this.application.dataService.fetchData(Model.Group);
        }
    },

    _handleUserChange: {
        value: function(users) {
            this.accountCategories.users = users;
        }
    },

    _handleGroupChange: {
        value: function(groups) {
            this.accountCategories.groups = groups;
        }
    }

});
