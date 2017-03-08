var AbstractSearchAccount = require("ui/abstract/abstract-search-account").AbstractSearchAccount;

exports.SearchGroups = AbstractSearchAccount.specialize(/** @lends SearchGroups# */ {

    search: {
        value: function (value) {
             return this.service.searchGroup(value);
        }
    },

    labelExpression: {
        value: "origin && origin.domain != 'local' ? name  + '@' + origin.domain : name"
    },

    loadInitialOptions: {
        value: function () {
            return this.service.listLocalGroups();
        }
    },

    findLabelForValue: {
        value: function (criteria) {
            return this.service.searchGroupWithCriteria(criteria);
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
