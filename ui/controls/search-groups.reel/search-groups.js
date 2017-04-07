var AbstractSearchAccount = require("ui/abstract/abstract-search-account").AbstractSearchAccount;

exports.SearchGroups = AbstractSearchAccount.specialize(/** @lends SearchGroups# */ {

    search: {
        value: function (value) {
            var self = this;

            return this.service.searchGroup(value).then(function (groups) {
                return groups.map(function (group) {
                    group.name = self.service.formatAccountName(group, self.labelPath);
                    return group;
                });
            });
        }
    },

    loadInitialOptions: {
        value: function () {
            return this.service.listLocalGroups();
        }
    }
    
}, {

    labelPath: {
        value: 'name'
    }

});
