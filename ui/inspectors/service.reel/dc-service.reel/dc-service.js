var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;
/**
 * @class DcService
 * @extends Component
 */
exports.DcService = Component.specialize({
    handleDcUrlAction: {
        value: function() {
            var self = this;
            Model.populateObjectPrototypeForType(Model.ServiceDc).then(function(ServiceDc){
                ServiceDc.constructor.services.provideDcUrl().then(function (url) {
                   window.open(url[0], '_blank'); 
                });
        });
        }
    }
});