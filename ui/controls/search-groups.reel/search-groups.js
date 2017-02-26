var Component = require("montage/ui/component").Component,
    AccountService = require("core/service/account-service").AccountService;

exports.SearchGroups = Component.specialize(/** @lends SearchGroups# */ {

    enterDocument: {
        value: function (firstTime) {
            if (firstTime) {
                this.service = AccountService.getInstance();
            }
        }
    },

    search: {
        value: function (value) {
             return this.service.searchGroup(value);
        }
    },

    listDefaultOptions: {
        value: function () {
            //TODO
        }
    }
});
