/**
 * @module ui/volume-dataset-permissions.reel
 */
var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Model = require("core/model/model").Model,
    UnixPermissionsConverter = require("core/converter/unix-permissions-converter").UnixPermissionsConverter;

/**
 * @class VolumeDatasetPermissions
 * @extends Component
 */
exports.VolumeDatasetPermissions = AbstractInspector.specialize(/** @lends VolumeDatasetPermissions# */ {

    users: {
        value: null
    },

    groups: {
        value: null
    },

    _permissionsConverter: {
        value: null
    },

    permissionsConverter: {
        get: function() {
            if (!this._permissionsConverter) {
                this._permissionsConverter = new UnixPermissionsConverter();
            }
            return this._permissionsConverter;
        }
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
                    this._sectionService.ensureDefaultPermissionsAreSetOnDataset(this._object);
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
