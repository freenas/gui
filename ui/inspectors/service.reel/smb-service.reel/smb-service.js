var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

exports.SmbService = AbstractInspector.specialize({

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
            this._sectionService.listNetworkInterfaces().then(function(networkInterfaces) {
                self.networkInterfacesAliases = networkInterfaces;
            });
        }
    },

    enterDocument: {
        value: function () {
            if (this.object.filemask) {
                this.filemaskModes = {
                    user: this.object.filemask.user,
                    group: this.object.filemask.group,
                    others: this.object.filemask.others
                };
                delete this.object.filemask.value;
            } else {
                this.filemaskModes = {
                    user: {
                        read: false,
                        write: false,
                        execute: false
                    },
                    group: {
                        read: false,
                        write: false,
                        execute: false
                    },
                    others: {
                        read: false,
                        write: false,
                        execute: false
                    }
                };
            }
            if (this.object.dirmask) {
                this.dirmaskModes = {
                    user: this.object.dirmask.user,
                    group: this.object.dirmask.group,
                    others: this.object.dirmask.others
                };
                delete this.object.dirmask.value;
            } else {
                this.dirmaskModes = {
                    user: {
                        read: false,
                        write: false,
                        execute: false
                    },
                    group: {
                        read: false,
                        write: false,
                        execute: false
                    },
                    others: {
                        read: false,
                        write: false,
                        execute: false
                    }
                };
            }
        }
    },

    save: {
        value: function() {
            this.object.filemask = this.filemaskModes;
            this.object.dirmask = this.dirmaskModes;
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
