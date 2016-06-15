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
                newShare.enabled = true;
                newShare.description = '';
                newShare.volume = self._getCurrentVolume();
                return self.application.dataService.getNewInstanceForType(propertiesModel);
            }).then(function(properties) {
                newShare.properties = properties;
                newShare.properties.type = 'share-' + shareType;
                return self.application.dataService.getNewInstanceForType(Model.Permissions);
            }).then(function(permissions) {
                newShare.permissions = permissions;
                return newShare;
            });
        }
    },

    _getCurrentVolume: {
        value: function() {
            var currentSelection = this._selectionService.getCurrentSelection();
            for (var i = this.context.columnIndex - 1; i >= 0; i--) {
                if (Object.getPrototypeOf(currentSelection.path[i]).Type == Model.Volume) {
                    return currentSelection.path[i];
                }
            }
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            if (isFirstTime) {
                this._selectionService = this.application.selectionService;
            }

            //Todo: improve how the new object are created, should be done lazily.
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

            var newIscsiShare;

            this._createNewShare('iscsi', Model.ShareIscsiTarget).then(function (shareIscsiTarget) {
                newIscsiShare = shareIscsiTarget;

                return self.application.dataService.getNewInstanceForType(Model.ShareIscsi);
            }).then(function (extent) {
                newIscsiShare.__extent = extent;

                return self.application.dataService.getNewInstanceForType(Model.ShareIscsiPortal);
            }).then(function (portal) {
                portal.discovery_auth_group = "NONE";
                portal.discovery_auth_method = "NONE";
                portal.listen = {
                    port: 3260,
                    address: "0.0.0.0"
                };
                newIscsiShare.__portal = portal;

                return self.application.dataService.getNewInstanceForType(Model.ShareIscsiAuth);
            }).then(function (iscsiAuth) {
                newIscsiShare.__auth = iscsiAuth;

                return self.application.dataService.getNewInstanceForType(Model.ShareIscsiUser);
            }).then(function (iscsiUser) {
                newIscsiShare._user = iscsiUser;

                self.newIscsiShare = newIscsiShare;
            });
        }
    }
});
