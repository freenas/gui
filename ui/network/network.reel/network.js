var Component = require("montage/ui/component").Component,
    Promise = require("montage/core/promise").Promise,
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

            //Fixme: getDataObject needs to retrun a promise
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
                interfacesSummaries = [];

            for (var i = 0, length = networkInterfaces.length; i < length; i++) {
                networkInterface = networkInterfaces[i];
                interfaceSummary = {name: networkInterface.name};
                this._populateNetworkInterfaceStatus(networkInterface, interfaceSummary);
                interfacesSummaries.push(interfaceSummary);
            }

            return interfacesSummaries;
        }
    },


    _populateNetworkInterfaceStatus: {
        value: function (networkInterface, interfaceSummary) {
            // Fixme: Given that the property status of a networkInterface Object is a reference to another Model type
            // that could have never been require before, we need to require its descriptor in order to instantiate this type.
            // But knowing that montage-data doesn't return a promise when we are mapping an object from rawData,
            // so it's not possible at the moment to get a "safe" populated model object.
            // In order to fix temporally this issue (hacky), the property status here could be a promise that will be
            // resolved once the NetworkInterfaceStatus will have been instantiated.
            if (Promise.is(networkInterface.status)) {
                var self = this;

                networkInterface.status.then(function () {
                    self._populateNetworkInterfaceSummary(networkInterface, interfaceSummary);
                });
            } else {
                this._populateNetworkInterfaceSummary(networkInterface, interfaceSummary);
            }
        }
    },


    _populateNetworkInterfaceSummary: {
        value: function (networkInterface, interfaceSummary) {
            var aliases = networkInterface.status.aliases,
                alias;

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
        }
    },


    getSystemGeneralConfig: {
        value: function () {
            return this.application.dataService.fetchData(Model.SystemGeneral).then(function (systemGeneral) {
                return systemGeneral[0];
            });
        }
    }

});
