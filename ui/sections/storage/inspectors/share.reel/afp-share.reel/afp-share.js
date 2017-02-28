var AbstractShareInspector = require("../abstract-share-inspector").AbstractShareInspector,
    AccountService = require("core/service/account-service").AccountService,
    Model = require("core/model").Model;

 var SearchController = function SearchController(service, model) {
    this.service = AccountService.getInstance();
    this.model = model
 };

 SearchController.prototype.search = function (value) {
    if (this.model === Model.User) {
        return this.service.searchUser(value).then(function (results) {
            return results.map(function (result) {
                return result.username;
            });
        });
    }

    return this.service.searchGroup(value).then(function (results) {
        return results.map(function (result) {
            return result.name;
        });
    });
 };

exports.AfpShare = AbstractShareInspector.specialize({

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                var self = this;

                this.groupsSearchController = new SearchController(Model.Group);
                this.usersSearchController = new SearchController(Model.User);
                this.accountService = AccountService.getInstance();

                this.isLoading = true;

                Promise.all([
                    this.accountService.listLocalUsers(),
                    this.accountService.listLocalGroups()
                ]).spread(function (users, groups) {
                    self.initialUserOptions = users.map(function (user) {
                        return user.username;
                    });

                    self.initialGroupOptions = groups.map(function (group) {
                        return group.name;
                    });
                }).finally(function () {
                    self.isLoading = false;
                });
            }
        }
    }

});
