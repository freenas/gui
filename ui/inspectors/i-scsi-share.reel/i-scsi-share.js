var AbstractShareInspector = require("ui/inspectors/share.reel/abstract-share-inspector").AbstractShareInspector,
    ShareIscsiRpm = require("core/model/enumerations/share-iscsi-rpm").ShareIscsiRpm,
    ShareIscsiBlocksize = require("core/model/enumerations/share-iscsi-blocksize").ShareIscsiBlocksize;

/**
 * @class IScsiShare
 * @extends Component
 */
exports.IScsiShare = AbstractShareInspector.specialize({

    templateDidLoad: {
        value: function () {
            this.networkInterfacesAliases = this.application.networkInterfacesSevice.networkInterfacesAliases;
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
    }

});
