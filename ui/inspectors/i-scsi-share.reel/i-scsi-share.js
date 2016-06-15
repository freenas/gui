var Component = require("montage/ui/component").Component,
    ShareIscsiRpm = require("core/model/enumerations/share-iscsi-rpm").ShareIscsiRpm,
    ShareIscsiBlocksize = require("core/model/enumerations/share-iscsi-blocksize").ShareIscsiBlocksize,
    ShareIscsiAuthType = require("core/model/enumerations/share-iscsi-auth-type").ShareIscsiAuthType;

/**
 * @class IScsiShare
 * @extends Component
 */
exports.IScsiShare = Component.specialize({

    templateDidLoad: {
        value: function () {
            this.networkInterfacesAliases = this.application.networkInterfacesSevice.networkInterfacesAliases;
        }
    },

    _authType: {
        value: null
    },

    authType: {
        get: function () {
            return this._authType || (this._authType = ShareIscsiAuthType.members);
        }
    },

    _iscsiRpm: {
        value: null
    },

    iscsiRpm: {
        get: function () {
            return this._iscsiRpm || (this._iscsiRpm = ShareIscsiRpm.members);
        }
    },

    _iscsiBlocksize: {
        value: null
    },

    iscsiBlocksize: {
        get: function () {
            return this._iscsiBlocksize || (this._iscsiBlocksize = ShareIscsiBlocksize.members);
        }
    },

    extendTypes: {
        get: function () {
            return [
                {
                    label: "File",
                    value: "File"
                },
                {
                    label: "Device",
                    value: "Device"
                }
            ]
        }
    }

});
