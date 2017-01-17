var Montage = require("montage").Montage,
    ShareTargettype = require("core/model/enumerations/share-targettype").ShareTargettype,
    application = require("montage/core/application").application,
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    ShareRepository = require("core/repository/share-repository").ShareRepository,
    VolumeRepository = require("core/repository/volume-repository").VolumeRepository,
    Promise = require("montage/core/promise").Promise,
    Model = require("core/model/model").Model,
    bytes = require("bytes"),
    _ = require("lodash");

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

    createWebdavShare: {
        value: function (volume) {
            return this._createNewShare(this.constructor.SHARE_TYPES.WEBDAV, volume);
        }
    },

    populateShareObjectIfNeeded: {
        value: function (shareObject) {
            var self = this,
                populatedSharePromise;
            if (!shareObject.properties) {
                var shareTypes = this.constructor.SHARE_TYPES;

                shareObject.properties = {};
                shareObject.properties["%type"] = 'share-' + shareObject.type;
                populatedSharePromise = Promise.all([
                    this.shareRepository.getNewPermissions(),
                    this.shareRepository.getNewUnixPermissions()
                ]).spread(function(permissions, unixPermissions) {
                    shareObject.permissions = _.cloneDeep(permissions);

                    if (shareTypes.SMB === shareObject.type) {
                        shareObject.properties.vfs_objects = [];
                        shareObject.properties.browseable = true;
                        shareObject.properties.hosts_allow = [];
                        shareObject.properties.hosts_deny = [];
                        shareObject.properties.previous_versions = true;
                    } else if (shareTypes.NFS === shareObject.type) {
                        shareObject.properties.hosts = [];
                        shareObject.properties.security = [];
                    } else if (shareTypes.ISCSI === shareObject.type) {
                        shareObject.properties.block_size = 512;
                        shareObject.properties.size = 0;
                        shareObject.properties.refreservation = true;

                        return (shareObject.__extent = {
                            id: null,
                            lun: 0
                        });
                    } else if (shareTypes.AFP === shareObject.type) {
                        shareObject.properties.default_file_perms = _.cloneDeep(unixPermissions);
                        shareObject.properties.default_directory_perms = _.cloneDeep(unixPermissions);
                        shareObject.properties.default_umask = _.cloneDeep(unixPermissions);
                    }

                    return shareObject;
                });

            } else {
                populatedSharePromise = Promise.resolve(shareObject);
            }

            return populatedSharePromise.then(function(populatedShareObject) {
                return self.ensureDefaultPermissionsAreSet(populatedShareObject);
            });
        }
    },

    ensureDefaultPermissionsAreSet: {
        value: function(share) {
            if (!share.permissions || !share.permissions.user || !share.permissions.group) {
                var permissionsPromise = share.permissions ?
                    Promise.resolve(share.permissions) : this.shareRepository.getNewPermissions();

                return permissionsPromise.then(function (permissions) {
                    if (!permissions.user) {
                        permissions.user = 'root';
                    }
                    if (!permissions.group) {
                        permissions.group = 'wheel';
                    }

                    share.permissions = permissions;
                    return share;
                });
            }
            return Promise.resolve(share);
        }
    },

    save: {
        value: function (shareObject, isServiceEnabled) {
            var saveSharePromise;
            //FIXME: workaround for the SELECT component. Future dead code.
            if (shareObject.type === this.constructor.SHARE_TYPES.NFS) {
                saveSharePromise = this._saveNfsShareObject(shareObject, isServiceEnabled);
            } else if (shareObject.type === this.constructor.SHARE_TYPES.ISCSI) {
                saveSharePromise = this._saveIscsiShareObject(shareObject, isServiceEnabled);
            } else if (shareObject.type === this.constructor.SHARE_TYPES.AFP) {
                saveSharePromise = this._saveAfpShareObject(shareObject, isServiceEnabled);
            } else {
                saveSharePromise = this.shareRepository.saveShare(shareObject, isServiceEnabled);
            }
            return saveSharePromise;
        }
    },

    _saveNfsShareObject: {
        value: function(shareObject, isServiceEnabled) {
            var properties = shareObject.properties;
            properties.maproot_user = properties.maproot_user != ' - ' ? properties.maproot_user : null;
            properties.maproot_group = properties.maproot_group != ' - ' ? properties.maproot_group : null;
            properties.mapall_user = properties.mapall_user != ' - ' ? properties.mapall_user : null;
            properties.mapall_group = properties.mapall_group != ' - ' ? properties.mapall_group : null;

            return this.shareRepository.saveShare(shareObject, isServiceEnabled);
        }
    },

    _saveAfpShareObject: {
        value: function(shareObject, isServiceEnabled) {
            if (shareObject._isNew) {
                shareObject.properties.default_file_perms = this._isPermissionsDefined(shareObject.properties.default_file_perms) ?
                    shareObject.properties.default_file_perms : null;
                shareObject.properties.default_directory_perms = this._isPermissionsDefined(shareObject.properties.default_directory_perms) ?
                    shareObject.properties.default_directory_perms : null;
                shareObject.properties.default_umask = this._isPermissionsDefined(shareObject.properties.default_umask) ?
                    shareObject.properties.default_umask : null;
            }
            return this.shareRepository.saveShare(shareObject, isServiceEnabled);
        }
    },

    _isPermissionsDefined: {
        value: function(permissions) {
            return _.some(
                _.map(
                    _.at(permissions, ['user', 'group', 'others']),
                    function(scope) {
                        return _.some(_.at(scope, ['read', 'write', 'execute']));
                    }
                )
            );
        }
    },

    _saveIscsiShareObject: {
        value: function (shareObject, isServiceEnabled) {
            var self = this,
                isNewShareObject = shareObject._isNew,
                blockSize = shareObject.properties.block_size,
                size = shareObject.properties.size,
                targetId = shareObject.__extent && shareObject.__extent.id,
                datasetProperties = null;

            if (typeof blockSize === "string") {
                shareObject.properties.block_size = bytes.parse(blockSize);
            }

            if (typeof size === "string") {
                shareObject.properties.size = bytes.parse(size);
            }

            if (isNewShareObject && shareObject.target_type === 'ZVOL' && !shareObject.properties.refreservation) {
                datasetProperties = {
                    refreservation: {
                        parsed: 0
                    }
                };
            }
            delete shareObject.properties.refreservation;

            return this.shareRepository.saveShare(shareObject, datasetProperties, isServiceEnabled)
                .then(function() {
                    if (isNewShareObject) {
                        return self._dataService.getNewInstanceForType(Model.ShareIscsiTarget).then(function(target) {
                            var extentObject = {
                                name: shareObject.name,
                                number: shareObject.__extent.lun
                            };

                            target.id = targetId;

                            if (Array.isArray(target.extents)) {
                                target.extents.push(extentObject);
                            } else {
                                target.extents = [extentObject];
                            }

                            return self._dataService.saveDataObject(target);
                        });
                    }
                });
        }
    },

    _createNewShare: {
        value: function (shareType, volume) {
            return this.shareRepository.getNewShare(volume, shareType);
        }
    },

    fetchShareIscsiTarget: {
        value: function () {
            var self = this;

            return this._dataService.fetchData(Model.ShareIscsiTarget).then(function (shareIscsiTargetCollection) {
                return (self.shareIscsiTargetCollection = shareIscsiTargetCollection);
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
            ISCSI: "iscsi",
            WEBDAV: "webdav"
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
                this._instance.shareRepository = ShareRepository.getInstance();
                this._instance.volumeRepository = VolumeRepository.getInstance();
            }

            return this._instance;
        }
    }
});
