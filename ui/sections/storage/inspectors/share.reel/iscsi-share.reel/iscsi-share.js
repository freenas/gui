var AbstractShareInspector = require("../abstract-share-inspector").AbstractShareInspector,
    ShareIscsiRpm = require("core/model/enumerations/share-iscsi-rpm").ShareIscsiRpm,
    ShareIscsiBlocksize = require("core/model/enumerations/ShareIscsiBlocksize").ShareIscsiBlocksize,
    Units = require('core/Units'),
    _ = require("lodash");

exports.IscsiShare = AbstractShareInspector.specialize({
    sizeUnits: {
        value: null
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
            return this._iscsiBlocksize || (this._iscsiBlocksize = _.map(ShareIscsiBlocksize, function(value) {
                return {
                    value: +value,
                    label: value
                }
            }));
        }
    },

    templateDidLoad: {
        value: function () {
            var self = this;
            this.isLoading = true;
            this.sizeUnits = Units.BYTE_SIZES;
            this._sectionService.listNetworkInterfaces().then(function(networkInterfaces) {
                self.networkInterfacesAliases = networkInterfaces;
            });
            this._targetName = { label: null, value: null };

            this.targetNames = [];

            this._findServiceIscsi().then(function (serviceIscsi) {
                self.isLoading = false;
                self.serviceIscsi = serviceIscsi;
            });
        }
    },

    _targetName: {
        value: null
    },

    targetNames: {
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
                this._object = object;
                this._object.__extent = this._object.__extent || {};
                if (!this._object._isNew && !this._isTargetNameSelected) {
                    this._populateIscsiTargets();
                }
            }
        }
    },

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                this.addPathChangeListener("object.name", this, "handleNameChange");
            }

            if (this.object._isNew) {
                this._resetTargetName();
            }
        }
    },

    exitDocument: {
        value: function () {
            this._resetTargetName();
            this.targetNames.length = 0;
        }
    },

    handleNameChange: {
        value: function () {
            if (this.object._isNew) {
                var index = this.targetNames.indexOf(this._targetName),
                    shareName = this.object.name;

                if (shareName) {
                    var concatString = this.serviceIscsi.base_name + "." + shareName;
                    this._targetName.value = this._targetName.label = concatString;
                    this.targetIscsiNameSelectComponent.selectedValue = this._targetName.value;

                    if (index === -1) {
                        this.targetNames.push(this._targetName);
                    }
                } else {
                    this.targetNames.splice(index, 1);
                }
            }
        }
    },

    _findServiceIscsi: {
        value: function() {
            return this._sectionService.listServices().then(function (services) {
                return Promise.resolve(_.find(services, {name: 'iscsi'}).config);
            });
        }
    },

    _resetTargetName: {
        value: function () {
            this._targetName.label = null;
            this._targetName.value = null;

            return this._targetName;
        }
    },

    _isTargetNameSelected: {
        get: function () {
            return !!this._targetName && !!this._targetName.label && !!this._targetName.value;
        }
    },

    _populateIscsiTargets: {
        value: function () {
            var self = this;

            this.application.shareService.fetchShareIscsiTarget().then(function (shareIscsiTargetCollection) {
                var shareIscsiTarget, shareIscsiTargetExtent,  ii, ll;

                for (var i = 0, l = shareIscsiTargetCollection.length; i < l; i++) {
                    shareIscsiTarget = shareIscsiTargetCollection[i];

                    if (shareIscsiTarget.extents.length) {
                        if (!this._isTargetNameSelected) {
                            for (ii = 0, ll = shareIscsiTarget.extents.length; ii < ll; ii++) {
                                shareIscsiTargetExtent = shareIscsiTarget.extents[ii];

                                //TODO: support more than one extent?
                                if (shareIscsiTargetExtent.name === self.object.name) {
                                    // Populate __extent property of the share object.
                                    // Not the best place for doing that.
                                    self.object.__extent.id = shareIscsiTarget.id;
                                    self.object.__extent.lun = shareIscsiTargetExtent.number;

                                    self._targetName.value = self._targetName.label = shareIscsiTarget.id;
                                    self.targetNames.push(self._targetName);
                                    break;
                                }
                            }
                        }
                    } else { //push "free" target iscsi.
                        self.targetNames.push({ label: shareIscsiTarget.name, value: shareIscsiTarget.name });
                    }
                }
            });
        }
    }

});
