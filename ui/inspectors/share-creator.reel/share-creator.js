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

    newAfpShare: {
        value: null
    },

    _createNewShare: {
        value: function (shareType, propertiesModel) {
            var self = this,
                newShare;
            return this.application.dataService.getNewInstanceForType(Model.Share).then(function(share) {
                newShare = share;
                newShare._isNewObject = true;
                newShare.type = shareType;
                newShare.description = '';
                newShare.volume = self.application.selectedVolume;
                return self.application.dataService.getNewInstanceForType(propertiesModel);
            }).then(function(properties) {
                newShare.properties = properties;
                return self.application.dataService.getNewInstanceForType(Model.Permissions);
            }).then(function(permissions) {
                newShare.permissions = permissions;
                return newShare;
            });
        }
    },

    enterDocument: {
        value: function() {
            var self = this;
            this._createNewShare('smb', Model.ShareSmb).then(function(smbShare) {
                self.newSmbShare = smbShare;
                self.newSmbShare.properties.vfs_objects = [];
                self.newSmbShare.properties._browseable = true;
            });
            this._createNewShare('nfs', Model.ShareNfs).then(function(nfsShare) {
                self.newNfsShare = nfsShare;
            });
            this._createNewShare('afp', Model.ShareAfp).then(function(afpShare) {
                self.newAfpShare = afpShare;
            });
        }
    }
});
