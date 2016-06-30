var Montage = require("montage").Montage,
    ShareTargettype = require("core/model/enumerations/share-targettype").ShareTargettype,
    application = require("montage/core/application").application,
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    Promise = require("montage/core/promise").Promise,
    Model = require("core/model/model").Model;

var ShareService = exports.ShareService = Montage.specialize({

    _instance: {
        value: null
    },

    _dataService: {
        value: null
    },

    createSmbShare: {
        value: function (volume) {
            return this._createNewShare(this.constructor.SHARE_TYPES.SMB, volume);
        }
    },

    createAfpShare: {
        value: function (volume) {
            return this._createNewShare(this.constructor.SHARE_TYPES.AFP, volume);
        }
    },

    createNfsShare: {
        value: function (volume) {
            return this._createNewShare(this.constructor.SHARE_TYPES.NFS, volume);
        }
    },

    createIscsiShare: {
        value: function (volume) {
            return this._createNewShare(this.constructor.SHARE_TYPES.ISCSI, volume);
        }
    },

    populateShareObjectIfNeeded: {
        value: function (shareObject) {
            if (!shareObject.properties) {
                var shareTypes = this.constructor.SHARE_TYPES,
                    propertiesModel,
                    self = this;

                //Don't use a switch because there are slower.
                if (shareTypes.AFP === shareObject.type) {
                    propertiesModel = Model.ShareAfp;
                } else if (shareTypes.NFS === shareObject.type) {
                    propertiesModel = Model.ShareNfs;
                } else if (shareTypes.SMB === shareObject.type) {
                    propertiesModel = Model.ShareSmb;
                } else if (shareTypes.ISCSI === shareObject.type) {
                    propertiesModel = Model.ShareIscsiTarget;
                } else {
                    return Promise.reject("unknown share type");
                }

                return this._dataService.getNewInstanceForType(propertiesModel).then(function(properties) {
                    shareObject.properties = properties;
                    shareObject.properties.type = 'share-' + shareObject.type;
                    return self._dataService.getNewInstanceForType(Model.Permissions);

                }).then(function(permissions) {
                    shareObject.permissions = permissions;

                    if (shareTypes.SMB === shareObject.type) {
                        shareObject.properties.vfs_objects = [];
                        shareObject.properties._browseable = true;
                    } else if (shareTypes.ISCSI === shareObject.type) {
                        return self._populateShareIscsiObject(shareObject);
                    }

                    return shareObject;
                });

            }

            return Promise.resolve(shareObject);
        }
    },

    save: {
        value: function (shareObject) {
            //FIXME: workaround for the SELECT component. Future dead code.
            if (shareObject.type === this.constructor.SHARE_TYPES.NFS) {
                var properties = shareObject.properties;

                properties.maproot_user = properties.maproot_user != ' - ' ? properties.maproot_user : null;
                properties.maproot_group = properties.maproot_group != ' - ' ? properties.maproot_group : null;
                properties.mapall_user = properties.mapall_user != ' - ' ? properties.mapall_user : null;
                properties.mapall_group = properties.mapall_group != ' - ' ? properties.mapall_group : null;
            }

            if (shareObject._isNewObject && shareObject.target_type == 'DATASET') {
                shareObject.target_path += '/' + shareObject.name;
            }

            return this._dataService.saveDataObject(shareObject)
        }
    },

    _createNewShare: {
        value: function (shareType, volume) {
            return this._dataService.getNewInstanceForType(Model.Share).then(function(share) {
                share._isNewObject = true;
                share.type = shareType;
                share.enabled = true;
                share.description = '';
                share.volume = volume;

                return share;
            });
        }
    },

    _populateShareIscsiObject: {
        value: function (shareIscsiObject) {
            var self = this;

            return this._dataService.getNewInstanceForType(Model.ShareIscsi).then(function (extent) {
                shareIscsiObject.__extent = extent;
                return self._dataService.getNewInstanceForType(Model.ShareIscsiPortal);

            }).then(function (portal) {
                portal.discovery_auth_group = "NONE";
                portal.discovery_auth_method = "NONE";
                portal.listen = {
                    port: 3260,
                    address: "0.0.0.0"
                };

                shareIscsiObject.__portal = portal;

                return self._dataService.getNewInstanceForType(Model.ShareIscsiAuth);

            }).then(function (iscsiAuth) {
                shareIscsiObject.__auth = iscsiAuth;
                return self._dataService.getNewInstanceForType(Model.ShareIscsiUser);

            }).then(function (iscsiUser) {
                shareIscsiObject._user = iscsiUser;
                return shareIscsiObject;
            });
        }
    }

}, {

    //FIXME: could probably be an enum
    SHARE_TYPES: {
        value: {
            AFP: "afp",
            SMB: "smb",
            NFS: "nfs",
            ISCSI: "iscsi"
        }
    },

    TARGET_TYPES: {
        get: function () {
            return ShareTargettype;
        }
    },

    instance: {
        get: function() {
            if (!this._instance) {
                this._instance = new ShareService();
                this._instance._dataService = FreeNASService.instance;

            }
            return this._instance;
        }
    }
});
