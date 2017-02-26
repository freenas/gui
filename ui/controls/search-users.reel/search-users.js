var Component = require("montage/ui/component").Component,
    AccountService = require("core/service/account-service").AccountService;


exports.SearchUsers = Component.specialize(/** @lends SearchUsers# */ {

    enterDocument: {
        value: function (firstTime) {
            if (firstTime) {
                this.service = AccountService.getInstance();
            }
        }
    },

    search: {
        value: function (value) {
             return this.service.searchUser(value);
        }
    },

    listDefaultOptions: {
        value: function () {
            //TODO
        }
    }

});
