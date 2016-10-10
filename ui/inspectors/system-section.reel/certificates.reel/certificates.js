/**
 * @module ui/certificates.reel
 */
var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;


/**
 * @class Certificates
 * @extends Component
 */
exports.Certificates = Component.specialize(/** @lends Certificates# */ {

    templateDidLoad: {
        value: function (){
            var self = this;
            this.application.dataService.fetchData(Model.CryptoCertificate).then(function (certificates) {
                self.certificates = certificates;
            });
        }
    }
});
