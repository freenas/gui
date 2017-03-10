var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    UnixPermissionsConverter = require("core/converter/unix-permissions-converter").UnixPermissionsConverter,
    VolumeDatasetPermissionstype = require('core/model/enumerations/volume-dataset-permissionstype').VolumeDatasetPermissionstype;

exports.VolumeDatasetPermissions = AbstractInspector.specialize(/** @lends VolumeDatasetPermissions# */ {

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

    _inspectorTemplateDidLoad: {
        value: function () {
            this._permissionsTypeOptions = VolumeDatasetPermissionstype.members.map(function(type) {
                return {
                    label: type,
                    value: type
                };
            });
        }
    }

});
