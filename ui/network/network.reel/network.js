var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model,
    Promise = require("montage/core/promise").Promise,
    NetworkInterfaceType = require("core/model/enumerations/network-interface-type").NetworkInterfaceType;

/**
 * @class Network
 * @extends Component
 */
exports.Network = Component.specialize({

    enterDocument: {
        value: function (isFirstTime) {
            var self = this;

            this.overview = {
                name: "Overview",
                inspector: "ui/network/configuration.reel",
                summary: {
                    interfaces: [],
                    nameservers: [],
                    defaultRoute: ""
                },
                staticRoutes: [],
                ipmi: {
                    name: "Ipmi",
                    inspector: "ui/inspectors/ipmi.reel"
                },
                networkConfiguration: {
                    name: "Network Configuration",
                    inspector: "ui/inspectors/network-configuration.reel"
                }
            };

            this.listInterfaces().then(function (interfaces) {
                self.interfaces = interfaces;
                self.overview.summary.interfaces = self.getInterfacesSummaries();
            });


            this.listStaticRoutes().then(function(staticRoutes) {
                staticRoutes.name = "Static Routes";
                staticRoutes.inspector = "ui/controls/viewer.reel";
                self.overview.staticRoutes = staticRoutes;
            });

            this.getNetworkConfig().then(function(networkConfig) {
                self.overview.summary.nameservers = networkConfig.dns.addresses;
                self.overview.summary.defaultRoute = networkConfig.gateway.ipv4;
            });
        }
    },

    getInterfacesSummaries: {
        value: function() {
            var self = this,
                networkInterface,
                interfaceSummary,
                aliases,
                alias,
                interfacesSummaries = [];
            for (var i = 0, length = self.interfaces.length; i < length; i++) {
                networkInterface = self.interfaces[i];
                interfaceSummary = {
                    name: networkInterface.name
                };
                aliases = networkInterface.status.aliases;
                for (var j = 0, aliasesLength = aliases.length; j < aliasesLength; j++) {
                    alias = aliases[j];
                    switch (alias.type) {
                        case "INET":
                            if (!interfaceSummary.ipv4) {
                                interfaceSummary.ipv4 = alias.address;
                            }
                            break;
                        case "INET6":
                            if (!interfaceSummary.ipv6) {
                                interfaceSummary.ipv6 = alias.address;
                            }
                            break;
                    }
                }
                interfacesSummaries.push(interfaceSummary);
            }
            return interfacesSummaries;
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

    listStaticRoutes: {
        value: function () {
            return this.application.dataService.fetchData(Model.NetworkRoute).then(function (staticRoutes) {
                var staticRoute;
                for (var i = 0, length = staticRoutes.length; i < length; i++) {
                    staticRoute = staticRoutes[i];
                    staticRoute.name = 'staticRoute' + i;
                    staticRoute.inspector = "ui/inspectors/static-route.reel";
                }
                return staticRoutes;
            });
        }
    },

    getNetworkConfig: {
        value: function() {
            //FIXME: Switch as soon as NetworkConfig is query-able
            // return this.application.dataService.fetchData(Model.NetworkConfig);
            return Promise.resolve({dns: {}, gateway: {}});
        }
    }
});







