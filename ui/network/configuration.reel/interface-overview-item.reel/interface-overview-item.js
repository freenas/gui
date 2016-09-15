/**
 * @module ui/interface-overview-item.reel
 */
var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class InterfaceOverviewItem
 * @extends Component
 */
exports.InterfaceOverviewItem = Component.specialize(/** @lends InterfaceOverviewItem# */ {
    
    userInterfaceDescriptor: {
        value: null
    },

    enterDocument: {
        value: function () {
            var self = this;
            
            this.application.delegate.userInterfaceDescriptorForObject(Model.NetworkInterface).then(function (userInterfaceDescriptor) {
                self.userInterfaceDescriptor = userInterfaceDescriptor;
            });
        }
    }

});
