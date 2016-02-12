var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class Network
 * @extends Component
 */
exports.Network = Component.specialize({

    enterDocument: {
        value: function () {
            var self = this;

            this.listInterfaces().then(function (interfaces) {
                 self.interfaces = interfaces;
            });
        }
    },


    listInterfaces: {
        value: function () {
            return this.application.dataService.fetchData(Model.NetworkInterface).then(function (networkInterfaces) {
                //FIXME temporary metadata set on the model object, waiting for the ui-descriptors.
                networkInterfaces.inspector = "ui/controls/viewer.reel";
                networkInterfaces.name = "Interfaces";

                var networkInterface;

                for (var i = 0, length = networkInterfaces.length; i < length; i++) {
                    networkInterface = networkInterfaces[i];

                    //FIXME: Bug in FreeNAS the name property is not populated.
                    networkInterface.name = networkInterface.id;

                    //FIXME: need to update montage
                    // add the defaultValue property to Property-blueprint.
                    // Ask to @ben what are the others types, do we need some other components here?
                    if (networkInterface.type === "VLAN") {
                        networkInterface.inspector = "ui/inspectors/vlan.reel";
                        networkInterface.icon = "ui/icons/vlan.reel";

                    } else if (networkInterface.type === "LAGG") {
                        networkInterface.inspector = "ui/inspectors/lagg.reel";
                        networkInterface.icon = "ui/icons/lagg.reel";

                    } else {
                        networkInterface.inspector = "ui/inspectors/interface.reel";
                        networkInterface.icon = "ui/icons/interface.reel";
                    }
                }

                return networkInterfaces;
            });
        }
    }

});
