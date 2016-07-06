var AbstractShareInspector = require("ui/inspectors/share.reel/abstract-share-inspector").AbstractShareInspector,
    ShareIscsiRpm = require("core/model/enumerations/share-iscsi-rpm").ShareIscsiRpm,
    ShareIscsiBlocksize = require("core/model/enumerations/share-iscsi-blocksize").ShareIscsiBlocksize,
    Model = require("core/model/model").Model;

/**
 * @class IscsiShare
 * @extends Component
 */
exports.IscsiShare = AbstractShareInspector.specialize({


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

    templateDidLoad: {
        value: function () {
            this.networkInterfacesAliases = this.application.networkInterfacesSevice.networkInterfacesAliases;

            var self = this;
            this._findServiceIscsi().then(function (serviceIscsi) {
                self.serviceIscsi = serviceIscsi;
            });

            //Todo: get targetNames...
            this.targetNames = [];

            this._targetName = {
                label: null,
                value: null
            };
        }
    },

    _targetName: {
        value: null
    },

    enterDocument: {
        value: function () {
            if (this.object._isNew && !this._cancelPathChangeListener) {
                this._cancelPathChangeListener = this.addPathChangeListener("object.name", this, "handleNameChange");
            }
        }
    },

    exitDocument: {
        value: function () {
            if (this.object._isNew && this._cancelPathChangeListener) {
                //FIXME: bug in collections?
                //this._cancelPathChangeListener();
                //this._cancelPathChangeListener = null;

                var index = this.targetNames.indexOf(this._targetName);

                if (index > -1) {
                    this.targetNames.splice(index, 1);
                }
            }
        }
    },

    handleNameChange: {
        value: function () {
            var index = this.targetNames.indexOf(this._targetName);

            if (this.object.name) {
                var concatString = this.serviceIscsi.base_name + "." + this.object.name;
                this._targetName.value = this._targetName.label = concatString;

                if (index === -1) {
                    this.targetNames.push(this._targetName);
                }
            } else {
                this.targetNames.splice(index, 1);
            }
        }
    },

    _findServiceIscsi: {
        value: function() {
            return this.application.dataService.fetchData(Model.ServiceIscsi).then(function (serviceIscsiCollection) {
                return serviceIscsiCollection[0];
            });
        }
    }

});
