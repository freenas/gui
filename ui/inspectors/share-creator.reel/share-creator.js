var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class ShareCreator
 * @extends Component
 */
exports.ShareCreator = Component.specialize({
    newSmbShare: {
        value: null
    },

    newNfsShare: {
        value: null
    },

    _createNewShare: {
        value: function (shareType) {
            var newShare = this.application.dataService.getDataObject(Model.Share);
            newShare.type = shareType;
            newShare._isNewObject = true;
            newShare.description = '';
            newShare.properties = {};
            newShare.volume = this.application.selectedVolume;
            return newShare;
        }
    },

    enterDocument: {
        value: function() {
            this.newSmbShare = this._createNewShare('smb');
            this.newNfsShare = this._createNewShare('nfs');
        }
    }
});
