/**
 * @module ui/volume-dataset-permissions.reel
 */
var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Model = require("core/model/model").Model;

/**
 * @class SharePermissions
 * @extends Component
 */
exports.SharePermissions = AbstractInspector.specialize(/** @lends SharePermissions# */ {

    users: {
        value: null
    },

    groups: {
        value: null
    },

    _fetchUsersPromise: {
        value: null
    },

    _fetchGroupsPromise: {
        value: null
    },

    templateDidLoad: {
        value: function () {
            //Preload data before entering in the dom, in order to avoid graphic glitches
            this._loadUsersIfNeeded();
            this._loadGroupsIfNeeded();
        }
    },

    enterDocument: {
        value: function () {
            if (this.object._isNew) {
                this.object.permissions = {
                    modes: {}
                }
            }
            this._loadUsersIfNeeded();
            this._loadGroupsIfNeeded();
        }
    },

    _loadUsersIfNeeded: {
        value: function() {
            if ((!this._fetchGroupsPromise && !this.users) || (this.users && this.users.length === 0)) {
                var self = this;

                this._fetchUsersPromise = this.application.dataService.fetchData(Model.User).then(function (users) {
                    self.users = users;
                    self._fetchUsersPromise = null;
                });
            }
        }
    },

    _loadGroupsIfNeeded: {
        value: function() {
            if ((!this._fetchGroupsPromise && !this.groups) || (this.groups && this.groups.length === 0)) {
                var self = this;

                this._fetchGroupsPromise = this.application.dataService.fetchData(Model.Group).then(function (groups) {
                    self.groups = groups;
                    self._fetchGroupsPromise = null;
                });
            }
        }
    }

});
