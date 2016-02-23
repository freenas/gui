var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model,
    NetworkInterfaceType = require("core/model/enumerations/network-interface-type").NetworkInterfaceType;

/**
 * @class Network
 * @extends Component
 */
exports.Network = Component.specialize({

    enterDocument: {
        value: function (isFirstTime) {
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

                    //FIXME: @Javier we need here a way to specify the key for the label/name of an object.
                    networkInterface.name = networkInterface.id;

                    // Ask to @ben what are the others types, do we need some other components here?
                    if (networkInterface.type === NetworkInterfaceType.VLAN) {
                        networkInterface.inspector = "ui/inspectors/vlan.reel";
                        networkInterface.icon = "ui/icons/vlan.reel";

                    } else if (networkInterface.type === NetworkInterfaceType.LAGG) {
                        networkInterface.inspector = "ui/inspectors/lagg.reel";
                        networkInterface.icon = "ui/icons/lagg.reel";

                    } else if (networkInterface.type === NetworkInterfaceType.BRIDGE) {
                        networkInterface.inspector = "ui/inspectors/bridge.reel";
                        networkInterface.icon = "ui/icons/bridge.reel";

                    } else {
                        networkInterface.inspector = "ui/inspectors/interface.reel";
                        networkInterface.icon = "ui/icons/interface.reel";
                    }
                }

                return networkInterfaces;
            });
        }
    },

    overview: {
        get: function () {
            var overview = {
                    name: "Overview",
                    inspector: "ui/network/configuration.reel",
                    summary: {
                        interfaces: [
                            {name: "em0", ipv4: "192.168.0.15/24", ipv6: "foo"},
                            {name: "em1", ipv4: "0.0.0.0/8", ipv6: "foo"},
                            {name: "vlan1", ipv4: "0.0.0.0/8", ipv6: "bar"}
                        ],
                        nameservers: ["209.18.47.61", "209.18.47.62"],
                        defaultRoute: "192.168.0.1"
                    },
                    staticRoutes: [
                        {name: "staticRoute1", inspector: "ui/inspectors/static-route.reel"},
                        {name: "staticRoute2", inspector: "ui/inspectors/static-route.reel"},
                        {name: "staticRoute3", inspector: "ui/inspectors/static-route.reel"}
                    ],
                    ipmi: {
                        name: "Ipmi",
                        inspector: "ui/inspectors/ipmi.reel"
                    },
                    networkConfiguration: {
                        name: "Network Configuration",
                        inspector: "ui/inspectors/network-configuration.reel"
                    },

                };
            overview.staticRoutes.name = "Static Routes";
            overview.staticRoutes.inspector = "ui/controls/viewer.reel";
            return overview;
        }
    }

});







