var AbstractSearchAccountMultiple = require("ui/abstract/abstract-search-account-multiple").AbstractSearchAccountMultiple;

exports.SearchGroupsMultiple = AbstractSearchAccountMultiple.specialize(/** @lends SearchGroups# */ {

    search: {
        value: function (value) {
             return this.service.searchGroup(value, {
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

