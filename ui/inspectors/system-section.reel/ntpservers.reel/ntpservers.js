/**
 * @module ui/ntpservers.reel
 */
var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;


/**
 * @class ntpServers
 * @extends Component
 */
exports.Ntpservers = Component.specialize(/** @lends ntpServers# */ {

    templateDidLoad: {
        value: function (){
            var self = this;
            this.application.dataService.fetchData(Model.NtpServer).then(function (ntpservers) {
                self.ntpservers = ntpservers;
            });
        }
    }
});
