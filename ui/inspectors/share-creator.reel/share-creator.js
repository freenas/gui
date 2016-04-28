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
        value: function (shareType, propertiesModel) {
            var newShare = this.application.dataService.getDataObject(Model.Share);
            newShare.type = shareType;
            newShare._isNewObject = true;
            newShare.description = '';
            newShare.properties = this.application.dataService.getDataObject(propertiesModel);
            newShare.permissions = this.application.dataService.getDataObject(Model.Permissions);
            newShare.volume = this.application.selectedVolume;
            return newShare;
        }
    },

    enterDocument: {
        value: function() {
            this.newSmbShare = this._createNewShare('smb', Model.ShareSmb);
            this.newSmbShare.properties._browseable = true;
            this.newNfsShare = this._createNewShare('nfs', Model.ShareNfs);
        }
    }
});
