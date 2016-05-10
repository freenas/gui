var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class SmbService
 * @extends Component
 */
exports.SmbService = Component.specialize({

    //Fixme: should probably an enum from the middleware.
    LOG_LEVELS: {
        get: function() {
            return [
                "NONE",
                "MINIMUM",
                "NORMAL",
                "FULL",
                "DEBUG"
            ];
        }
    },

    //Fixme: should probably an enum from the middleware.
    PROTOCOLS: {
        get: function() {
            return [
                "CORE",
                "COREPLUS",
                "LANMAN1",
                "LANMAN2",
                "NT1",
                "SMB2",
                "SMB2_02",
                "SMB2_10",
                "SMB2_22",
                "SMB2_24",
                "SMB3",
                "SMB3_00"
            ];
        }
    },

    //Fixme: This isn't from the middleware at all. It's a copy paste of options
    //from FreeNAS 9, because otherwise this field makes little sense. However,
    //as of the completion of Ticket #15045, this will no longer be the case.
    UNIX_CHARSETS: {
        get: function() {
            return [
                "UTF-8",
                "iso-8859-1",
                "iso-8859-15",
                "gb2312",
                "EUC-JP",
                "ASCII"
            ];
        }
    },

    //Fixme: This isn't from the middleware at all. It's a copy paste of options
    //from FreeNAS 9, because otherwise this field makes little sense. However,
    //as of the completion of Ticket #15045, this will no longer be the case.
    DOS_CHARSETS: {
        get: function() {
            return [
                "CP437",
                "CP850",
                "CP852",
                "CP866",
                "CP932",
                "CP949",
                "CP950",
                "CP1029",
                "CP1251",
                "ASCII"
            ];
        }
    },

    users: {
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
            if (this._object != object) {
                this._object = object;
                if (this._object.filemask) {
                    this.filemaskModes = {
                        user: this._object.filemask.user,
                        group: this._object.filemask.group,
                        others: this._object.filemask.others
                    };
                    delete this._object.filemask.value;
                }
                if (this._object.dirmask) {
                    this.dirmaskModes = {
                        user: this._object.dirmask.user,
                        group: this._object.dirmask.group,
                        others: this._object.dirmask.others
                    };
                    delete this._object.dirmask.value;
                }
            }
        }
    },

    templateDidLoad: {
        value: function () {
            this.networkInterfacesAliases = this.application.networkInterfacesSevice.networkInterfacesAliases;
            this._fetchUsers();
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            if (this._object) {
                this.filemaskModes = {
                    user: this._object.filemask.user,
                    group: this._object.filemask.group,
                    others: this._object.filemask.others
                };
                this.dirmaskModes = {
                    user: this._object.dirmask.user,
                    group: this._object.dirmask.group,
                    others: this._object.dirmask.others
                };
            }
        }
    },

    _fetchUsers: {
        value: function () {
            var self = this;

            return this.application.dataService.fetchData(Model.User).then(function (users) {
                self.users = users;
            });
        }
    },

    shouldMultipleSelectAcceptValue: {
        value: function (multipleSelect, value) {
            var interfacesAliases = this.networkInterfacesAliases,
                response = false;

            for (var i = 0, length = interfacesAliases.length; i < length && !response; i++) {
                response = interfacesAliases[i].address === value;
            }

            return response;
        }
    }

});
