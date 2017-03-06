var AbstractSearchAccount = require("ui/abstract/abstract-search-account").AbstractSearchAccount;

exports.SearchGroups = AbstractSearchAccount.specialize(/** @lends SearchGroups# */ {

    search: {
        value: function (value) {
             return this.service.searchGroup({
                 labelPath: this.labelPath,
                 valuePath: this.valuePath
             });
        }
    },

    loadInitialOptions: {
        value: function () {
            return this.service.listLocalGroups({
                labelPath: this.labelPath,
                valuePath: this.valuePath
            });
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
