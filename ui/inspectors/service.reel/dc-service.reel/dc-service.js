var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

exports.DcService = AbstractInspector.specialize({

    dcIp: {
        value: null
    },

    dcUrl: {
        value: null
    },

    _updateIp: {
        value: function() {
            var self = this;
            this.object.enable && this._sectionService.provideDcIp().then(function (ip) {
               return self.dcIp = ip ? ip[0]: "" ;
            });
        }
    },

    _updateUrl: {
        value: function() {
            var self = this;
            this.object.enable && this._sectionService.provideDcUrl().then(function (url) {
               return self.dcUrl = url[0];
            });
        }
    },

    volumeOptions: {
        value: []
    },

    save: {
        value: function() {
            delete this.object.vm_id;
        }
    },

    handleDcUrlAction: {
        value: function() {
            window.open(this.dcUrl, '_blank');
        }
    },

    _handleStateChange: {
        value: function(state) {
            this._updateIp();
            this._updateUrl();
        }
    },

    enterDocument: {
        value: function() {
            var self = this;
            this._sectionService.listVolumes().then(function(volumesList) {
                self.volumeOptions = volumesList;
            });
            this.addPathChangeListener("context.object.state", this, "_handleStateChange");
        }
    },

    exitDocument: {
        value: function() {
            if (this.getPathChangeDescriptor("context.object.state", this)) {
                this.removePathChangeListener("context.object.state", this);
            }
        }
    }
});
