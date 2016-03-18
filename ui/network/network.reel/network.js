var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class Network
 * @extends Component
 */
exports.Network = Component.specialize({


    overview: {
        value: null
    },


    enterDocument: {
        value: function (firstTime) {
            if (firstTime) {
                var self = this;

                this.getNetworkOverview().then(function (networkOverview) {
                    self.overview = networkOverview;
                });
            }
        }
    },


    getNetworkOverview: {
        value: function () {
            var self = this;

            //Fixme:
            return Model.getPrototypeForType(Model.NetworkOverview).then(function () {
                //Fixme: need to add clever getter/setter on descriptors, defaultValue?
                var networkOverview = self.application.dataService.getDataObject(Model.NetworkOverview);
                networkOverview.summary = {};

                return Model.getPrototypeForType(Model.Ipmi).then(function () {
                    networkOverview.ipmi = self.application.dataService.getDataObject(Model.Ipmi);

                }).then(function () {
                    return self._populateNetworkConfig(networkOverview);
                }).then(function () {
                    return self._populateNetworkStatus(networkOverview);
                }).then(function () {
                    return self._populateNetworkInterfaces(networkOverview);
                }).then(function () {
                    return self.getSystemGeneralConfig().then(function (systemGeneral) {
                        networkOverview.summary.hostname = systemGeneral.hostname;
                        networkOverview.networkConfiguration.general = systemGeneral;
                    });
                }).then(function () {
                    return self._populateStaticRoutes(networkOverview).then(function () {
                        return networkOverview;
                    });
                });
            });
        }
    },


    _populateNetworkConfig: {
        value: function (networkOverview) {
            return this.application.dataService.fetchData(Model.NetworkConfig).then(function (networkConfig) {
                return (networkOverview.networkConfiguration = networkConfig[0]);
            });
        }
    },


    _populateNetworkStatus: {
        value: function (networkOverview) {
            return Model.getPrototypeForType(Model.NetworkConfig).then(function(NetworkConfig) {
                return NetworkConfig.constructor.getStatus().then(function (networkStatus) {
                    networkOverview.summary.nameservers = networkStatus.dns.addresses;
                    networkOverview.summary.defaultRoute = {
                        ipv4: networkStatus.gateway.ipv4,
                        ipv6: networkStatus.gateway.ipv6
                    };

                    return (networkOverview.networkConfiguration.status = networkStatus);
                });
            });
        }
    },


    _populateNetworkInterfaces: {
        value: function (networkOverview) {
            var self = this;

            return this.application.dataService.fetchData(Model.NetworkInterface).then(function (networkInterfaces) {
                networkOverview.summary.interfaces = self._getInterfacesSummaries(networkInterfaces);

                return (networkOverview.interfaces = networkInterfaces);
            });
        }
    },


    _populateStaticRoutes: {
        value: function (networkOverview) {
            return this.application.dataService.fetchData(Model.NetworkRoute).then(function (staticRoutes) {
                var staticRoute;

                for (var i = 0, length = staticRoutes.length; i < length; i++) {
                    staticRoute = staticRoutes[i];
                    staticRoute.name = 'staticRoute' + i;
                }

                return (networkOverview.staticRoutes = staticRoutes);
            });
        }
    },


    _getInterfacesSummaries: {
        value: function (networkInterfaces) {
            var networkInterface,
                interfaceSummary,
                aliases,
                alias,
                interfacesSummaries = [];

            for (var i = 0, length = networkInterfaces.length; i < length; i++) {
                networkInterface = networkInterfaces[i];
                interfaceSummary = {name: networkInterface.name};
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


    getSystemGeneralConfig: {
        value: function () {
            return this.application.dataService.fetchData(Model.SystemGeneral).then(function (systemGeneral) {
                return systemGeneral[0];
            })
        }
    }

});
