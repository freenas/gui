var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;
/**
 * @class DcService
 * @extends Component
 */
exports.DcService = Component.specialize({

    dcIp: {
        value: null
    },
    dcUrl: {
        value: null
    },
    _updateIp: {
        value: function() {
           var self = this;
            Model.populateObjectPrototypeForType(Model.ServiceDc).then(function(ServiceDc){
                ServiceDc.constructor.services.provideDcIp().then(function (ip) {
                   return self.dcIp = ip ? ip[0]: "" ;
                });
            });
        },
    },
    _updateUrl: {
        value: function() {
           var self = this;
            Model.populateObjectPrototypeForType(Model.ServiceDc).then(function(ServiceDc){
                ServiceDc.constructor.services.provideDcUrl().then(function (url) {
                   return self.dcUrl = url[0];
                });
            });
        }
    },

    volumeOptions: {
        value: []
    },

    save: {
        value: function() {
            delete this.object.vm_id;
        },
    },
    handleDcUrlAction: {
        value: function() {
            // just updating these before clicking to get latest values
            this._updateIp();
            this._updateUrl();
            window.open(this.dcUrl, '_blank');
        }
    },
    enterDocument: {
        value: function() {
            var self = this;
            this._updateIp();
            this._updateUrl();
            this.application.storageService.listVolumes().then(function(volumesList) {
                self.volumeOptions = volumesList;
            });
        }
    }
});
