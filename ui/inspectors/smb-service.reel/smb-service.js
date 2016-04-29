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

    templateDidLoad: {
        value: function () {
            this.networkInterfacesAliases = this.application.networkInterfacesSevice.networkInterfacesAliases;
            this._fetchUsers();
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            if (isFirstTime) {
                if (!this.object.filemask) {
                    this.object.filemask = '666';
                }
                if (!this.object.dirmask) {
                    this.object.dirmask = '777';
                }
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
            return this.networkInterfacesAliases.indexOf(value) > -1;
        }
    }

});
