var AbstractSearchAccountMultiple = require("ui/abstract/abstract-search-account-multiple").AbstractSearchAccountMultiple;

exports.SearchUsersMultiple = AbstractSearchAccountMultiple.specialize(/** @lends SearchGroups# */ {

    search: {
        value: function (value) {
             return this.service.searchUser(value);
        }
    },

    labelExpression: {
        value: "origin && origin.domain != 'local' ? username  + '@' + origin.domain : username"
    },

    loadInitialOptions: {
        value: function () {
            return this.service.listLocalUsers();
        }
    },

    findLabelForValue: {
        value: function (criteria) {
            return this.service.searchUserWithCriteria(criteria);
        }
    }

}, {

    labelPath: {
        value: 'username'
    },

    valuePath: {
        value: 'id'
    }

});
