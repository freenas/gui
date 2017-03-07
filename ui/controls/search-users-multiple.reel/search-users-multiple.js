var AbstractSearchAccountMultiple = require("ui/abstract/abstract-search-account-multiple").AbstractSearchAccountMultiple;

exports.SearchUsersMultiple = AbstractSearchAccountMultiple.specialize(/** @lends SearchGroups# */ {

    search: {
        value: function (value) {
             return this.service.searchUser(value, {
                 labelPath: this.labelPath,
                 valuePath: this.valuePath
             });
        }
    },

    loadInitialOptions: {
        value: function () {
            return this.service.listLocalUsers({
                labelPath: this.labelPath,
                valuePath: this.valuePath
            });
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
