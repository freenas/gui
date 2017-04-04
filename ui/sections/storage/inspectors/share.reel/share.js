var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    ShareService = require("core/service/share-service").ShareService,
    ModelEventName = require('core/model-event-name').ModelEventName,
    _ = require('lodash');

exports.Share = AbstractInspector.specialize({
    EMPTY_STRING: {
        value: ''
    },

    LINE_START: {
        value: '^'
    },

    filesystemService: {
        value: null
    },

    _loadingPromise: {
        value: null
    },

    folders: {
        value: null
    },

    pathConverter: {
        value: null
    },

    service: {
        value: null
    },

    serviceEnabled: {
        value: null
    },

    _object: {
        value: null
    },

    object: {
        get: function() {
            return this._object;
        },
        set: function(object) {
            if (this._object !== object) {
                if (object) {

                    if (this._shareService) {
                        this._shareService.populateShareObjectIfNeeded(object);
                    }

                    var shareServiceConstructor = this.application.shareService.constructor;
                    if (!object.target_type) {
                        object.target_type = object.type === shareServiceConstructor.SHARE_TYPES.ISCSI ?
                            shareServiceConstructor.TARGET_TYPES.ZVOL :
                            shareServiceConstructor.TARGET_TYPES.DATASET;
                    }

                    object._selected_path = object.target_path;

                    this.isPathReadOnly = !object._isNew &&
                                            (object.target_type == shareServiceConstructor.TARGET_TYPES.DATASET ||
                                             object.target_type == shareServiceConstructor.TARGET_TYPES.ZVOL);

                }

                this._object = object;

                this.dispatchOwnPropertyChange("possibleTargetTypes", this.possibleTargetTypes);
            }
        }
    },

    _targetType: {
        value: null
    },

    targetType: {
        set: function (targetType) {
            if (this._object && this._inDocument && this._targetType !== targetType) {
                this._targetType = targetType;

                if (this._object.target_type !== targetType) {
                    this._object.target_type = targetType;
                    this._openTreeController();
                }

                this.dispatchOwnPropertyChange("iconModuleId", this.iconModuleId);
            }
        },
        get: function () {
            return this._targetType;
        }
    },

    possibleTargetTypes: {
        get: function () {
            //not using the global object ShareService in order to avoid to create a closure.
            return !this.object || this.object.type !== this.application.shareService.constructor.SHARE_TYPES.ISCSI ?
                this.constructor.POSSIBLE_TARGET_TYPES.DEFAULT : this.constructor.POSSIBLE_TARGET_TYPES.ISCSI;
        }
    },

    _inspectorTemplateDidLoad: {
        value: function() {
            this._shareService = this.application.shareService;
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            this.super(isFirstTime);
            var self = this;

            if (this.object) {
                this.targetType = this.object.target_type;

                this.isDataLoading = true;
                this._shareService.populateShareObjectIfNeeded(this.object).then(function() {
                    if (self._object._isNew) {
                        self.object.target_path = self.object._volume.id;
                        self._openTreeController();
                    }
                    self.isDataLoading = false;
                });
                this._getService(this.object).then(function (service) {
                    self.service = service;
                    self.serviceEnabled = service.state === 'RUNNING';
                });

                if (this.targetType === 'DATASET') {
                    this.extraDeleteFlags = [{
                        "label": "Delete associated dataset?",
                        "value": "delete_dataset",
                        "checked": false
                    }];
                    this.extraDeleteMessage = "I am sure that I wish to delete this share and its associated dataset";
                } else if (this.targetType === 'ZVOL') {
                    this.extraDeleteFlags = [{
                        "label": "Delete associated ZVOL?",
                        "value": "delete_dataset",
                        "checked": false
                    }];
                    this.extraDeleteMessage = "I am sure that I wish to delete this share and its associated ZVOL";
                } else {
                    this.extraDeleteFlags = [];
                }
            }
        }
    },

    exitDocument: {
        value: function() {
            this.extraDeleteFlags = null;
            this.extraDeleteMessage = null;
        }
    },

    save: {
        value: function() {
            var self = this,
                share = this.object,
                servicePromise = self.serviceEnabled ? self._startService() : self._stopService();

            share.target_path = this.targetTreeview.pathInput.value;
            if (share._isNew) {
                this.isPathReadOnly = true;
            }

            if (share.properties) {
                var properties = share.properties;
                properties.groups_allow = this._mapAccountCollection(this.context.groupsAllow, 'name');
                properties.groups_deny = this._mapAccountCollection(this.context.groupsDeny, 'name');
                properties.users_allow = this._mapAccountCollection(this.context.usersAllow, 'username');
                properties.users_deny = this._mapAccountCollection(this.context.usersDeny, 'username');
            }

            if (servicePromise) {
                return servicePromise.then(function() {
                    return self._shareService.save(share);
                });
            } else {
                return self._shareService.save(share);
            }
        }
    },

    _mapAccountCollection: {
        value: function (collection, propertyPath) {
            var mappedArray;

            if (collection) {
                mappedArray = collection.map(function (value) {
                    return value[propertyPath];
                }, this);
            }

            return mappedArray;
        }
    },

    delete: {
        value: function() {
            return this._shareService.delete(
                this.object, 
                this.extraDeleteFlags.length > 0 ? [this.extraDeleteFlags[0].checked] : void 0
            );
        }
    },

    _openTreeController: {
        value: function() {
            if (this.targetType && this._inDocument) {
                var self = this,
                    treeController = this.treeControllers[this.targetType];

                treeController.open().then(function() {
                    self._object._selected_path = treeController.selectedPath;
                });
            }
        }
    },

    revert: {
        value: function() {
            var self = this,
                shareService = this.application.shareService,
                promise;
            if (!this.object._isNew) {
                return this.inspector.revert();
            } else {
                switch (this._object.type) {
                    case this.application.shareService.constructor.SHARE_TYPES.SMB:
                        promise = shareService.createSmbShare(this._object._volume);
                        break;
                    case this.application.shareService.constructor.SHARE_TYPES.NFS:
                        promise = shareService.createNfsShare(this._object._volume);
                        break;
                    case this.application.shareService.constructor.SHARE_TYPES.AFP:
                        promise = shareService.createAfpShare(this._object._volume);
                        break;
                    case this.application.shareService.constructor.SHARE_TYPES.ISCSI:
                        promise = shareService.createIscsiShare(this._object._volume);
                        break;
                }
                return promise.then(function(share) {
                    return shareService.populateShareObjectIfNeeded(share);
                }).then(function(share) {
                    self._deepCopy(share, self.object);
                    self.object.target_type = self.targetType;
                    self._openTreeController();
                });
            }
        }
    },

    _deepCopy: {
        value: function(source, target) {
            var keys = Object.keys(target),
                key, property;
            for (var i = 0, length = keys.length; i < length; i++) {
                key = keys[i];
                if (key.indexOf('_') == 0 && typeof target[key.substr(1)] !== 'undefined') {
                    key = key.substr(1);
                }
                property = source[key];
                if (property && typeof property === 'object' && !Array.isArray(property)) {
                    this._deepCopy(property, target[key]);
                } else if (typeof target[key] === 'boolean') {
                    target[key] = !!property;
                } else {
                    target[key] = property;
                }
            }
        }
    },

    _getService: {
        value: function(object) {
            var self = this;
            this.isServiceLoading = true;
            return this._sectionService.listServices().then(function(services) {
                self.isServiceLoading = false;
                var service = _.find(services, {config: {type: 'service-' + object.type}});
                if (self._serviceListener && self.service) {
                    self.eventDispatcherService.removeEventListener(ModelEventName.Service.change(self.service.id), self._serviceListener);
                    self._serviceListener = null;
                }
                if (service) {
                    self._serviceListener = self.eventDispatcherService.addEventListener(ModelEventName.Service.change(service.id), self._handleServiceChange.bind(self));
                }
                return service;
            });
        }
    },

    _handleServiceChange: {
        value: function(state) {
            this.serviceEnabled = state.get('state') === 'RUNNING';
        }
    },

    _startService: {
        value: function() {
            if (this.service && this.service.config && !this.service.config.enable) {
                this.service.config.enable = true;
                return this.application.dataService.saveDataObject(this.service);
            }

            return Promise.resolve();
        }
    },

    _stopService: {
        value: function() {
            if (this.service && this.service.config && this.service.config.enable) {
                this.service.config.enable = false;
                return this.application.dataService.saveDataObject(this.service);
            }

            return Promise.resolve();
        }
    }
},{
    POSSIBLE_TARGET_TYPES: {
        value: {
            DEFAULT: [ShareService.TARGET_TYPES.DATASET, ShareService.TARGET_TYPES.DIRECTORY],
            ISCSI: [ShareService.TARGET_TYPES.ZVOL, ShareService.TARGET_TYPES.FILE]
        }
    }
});
