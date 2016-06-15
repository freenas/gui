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

    _object: {
        value: null
    },

    object: {
        get: function() {
            return this._object;
        },
        set: function(object) {
            if (this._object !== object) {
                this._object = object;

                if (object) {
                    this._ensureDefaultPermissionsAreSet(object);
                }
            }
        }
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
            this._loadUsersIfNeeded();
            this._loadGroupsIfNeeded();
        }
    },

    _ensureDefaultPermissionsAreSet: {
        value: function (object) {
            if (!object.permissions || !object.permissions.user || !object.permissions.group) {
                var permissionsPromise = object.permissions ?
                    Promise.resolve(object.permissions) : this.application.dataService.getNewInstanceForType(Model.Permissions);

                permissionsPromise.then(function (permissions) {
                    if (!permissions.user) {
                        permissions.user = 'root';
                    }
                    if (!permissions.group) {
                        permissions.group = 'wheel';
                    }

                    object.permissions = permissions;
                });
            }
        }
    },

    _loadUsersIfNeeded: {
        value: function() {
            if ((!this._fetchGroupsPromise && !this.users) || this.users.length === 0) {
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
            if ((!this._fetchGroupsPromise && !this.groups) || this.groups.length === 0) {
                var self = this;

                this._fetchGroupsPromise = this.application.dataService.fetchData(Model.Group).then(function (groups) {
                    self.groups = groups;
                    self._fetchGroupsPromise = null;
                });
            }
        }
    }

});
