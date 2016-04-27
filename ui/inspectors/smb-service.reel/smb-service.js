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

    users: {
        value: null
    },

    enterDocument: {
        value: function(isFirstTime) {
            if (isFirstTime) {
                var self = this;
                if (!this.object.filemask) {
                    this.object.filemask = '666';
                }
                if (!this.object.dirmask) {
                    this.object.dirmask = '777';
                }
                this.application.dataService.fetchData(Model.User).then(function(users) {
                    self.users = users;
                });
            }
        }
    }
});
