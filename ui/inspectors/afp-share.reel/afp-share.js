var Component = require("montage/ui/component").Component;

/**
 * @class AfpShare
 * @extends Component
 */
exports.AfpShare = Component.specialize({

    _object: {
        value: null
    },

    object: {
        get: function() {
            return this._object;
        },
        set: function(object) {
            if (this._object != object) {
                this._object = object;
                if (this._object.default_file_perms) {
                    this.default_file_perms_modes = {
                        user: this._object.default_file_perms.user,
                        group: this._object.default_file_perms.group,
                        others: this._object.default_file_perms.others
                    };
                    delete this._object.default_file_perms.value;
                }
                if (this._object.default_directory_perms) {
                    this.default_directory_perms_modes = {
                        user: this._object.default_directory_perms.user,
                        group: this._object.default_directory_perms.group,
                        others: this._object.default_directory_perms.others
                    };
                    delete this._object.default_directory_perms.value;
                }
                if (this._object.default_file_perms) {
                    this.default_file_perms_modes = {
                        user: this._object.default_file_perms.user,
                        group: this._object.default_file_perms.group,
                        others: this._object.default_file_perms.others
                    };
                    delete this._object.default_file_perms.value;
                }
            }
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            if (this._object) {
                if (this._object.default_file_perms) {
                    this.default_file_perms_modes = {
                        user: this._object.default_file_perms.user,
                        group: this._object.default_file_perms.group,
                        others: this._object.default_file_perms.others
                    };
                    delete this._object.default_file_perms.value;
                }
                if (this._object.default_directory_perms) {
                    this.default_directory_perms_modes = {
                        user: this._object.default_directory_perms.user,
                        group: this._object.default_directory_perms.group,
                        others: this._object.default_directory_perms.others
                    };
                    delete this._object.default_directory_perms.value;
                }
                if (this._object.default_umask) {
                    this.default_umask_modes = {
                        user: this._object.default_umask.user,
                        group: this._object.default_umask.group,
                        others: this._object.default_umask.others
                    };
                    delete this._object.default_umask.value;
                }
            }
        }
    },
});
