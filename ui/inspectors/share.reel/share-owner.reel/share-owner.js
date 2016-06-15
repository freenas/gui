/**
 * @module ui/share-owner.reel
 */
var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;


/**
 * @class ShareOwner
 * @extends Component
 */
exports.ShareOwner = Component.specialize(/** @lends ShareOwner# */ {

    users: {
        value: null
    },

    groups: {
        value: null
    },

    enterDocument: {
        value: function () {
            this._loadUsersIfNeeded();
            this._loadGroupsIfNeeded();
        }
    },

    _loadUsersIfNeeded: {
        value: function() {
            if (!this.users || this.users.length === 0) {
                var self = this;

                this.application.dataService.fetchData(Model.User).then(function (users) {
                    self.users = users;
                });
            }
        }
    },

    _loadGroupsIfNeeded: {
        value: function() {
            if (!this.groups || this.groups.length === 0) {
                var self = this;

                this.application.dataService.fetchData(Model.Group).then(function (groups) {
                    self.groups = groups;
                });
            }
        }
    }

});
