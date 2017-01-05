var Component = require("montage/ui/component").Component,
    ModelDescriptorService = require("core/service/model-descriptor-service").ModelDescriptorService;

exports.InterfaceOverviewItem = Component.specialize({
    isExpanded: {
        value: false
    },

    userInterfaceDescriptor: {
        value: null
    },

    templateDidLoad: {
        value: function() {
            this._modelDescriptorService = ModelDescriptorService.getInstance();
        }
    },

    enterDocument: {
        value: function () {
            var self = this;

            this._modelDescriptorService.getUiDescriptorForObject(this.object).then(function (userInterfaceDescriptor) {
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
