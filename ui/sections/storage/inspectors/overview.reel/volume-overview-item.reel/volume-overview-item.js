/**
 * @module ui/interface-overview-item.reel
 */
var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class VolumeOverviewItem
 * @extends Component
 */
exports.VolumeOverviewItem = Component.specialize(/** @lends VolumeOverviewItem# */ {
    isExpanded: {
        value: false
    },

    userInterfaceDescriptor: {
        value: null
    },

    enterDocument: {
        value: function () {
            var self = this;

            this.application.delegate.userInterfaceDescriptorForObject(this.object).then(function (userInterfaceDescriptor) {
                self.userInterfaceDescriptor = userInterfaceDescriptor;
            });
        }
    },

    handleToggleAction: {
        value: function () {
            this.isExpanded = !this.isExpanded;
        }
    }

});
