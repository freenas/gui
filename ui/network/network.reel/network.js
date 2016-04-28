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
                this._dataService = this.application.dataService;
                this.addPathChangeListener("overview.networkConfiguration.general.hostname", this, "_handleHostnameChange");
                this.addRangeAtPathChangeListener("overview.interfaces", this, "_handleNetworkInterfacesRangeChange");

                this.getNetworkOverview().then(function (networkOverview) {
                    self.overview = networkOverview;
                });
            }
        }
    },


    getNetworkOverview: {
        value: function () {
            var self = this,
                networkOverview;

            //Fixme: getDataObject needs to return a promise
            return this._dataService.getNewInstanceForType(Model.NetworkOverview).then(function (_networkOverview) {
                networkOverview = _networkOverview;
                //Fixme: need to add clever getter/setter on descriptors, defaultValue?
                networkOverview.summary = {};

                return self._dataService.getNewInstanceForType(Model.Ipmi);
            }).then(function (ipmi) {
                networkOverview.ipmi = ipmi;
                return self._populateNetworkConfig(networkOverview);
            }).then(function () {
                return self._populateNetworkStatus(networkOverview);
            }).then(function () {
                return self._populateNetworkInterfaces(networkOverview);
            }).then(function () {
                return self.getSystemGeneralConfig()
            }).then(function (systemGeneral) {
                networkOverview.networkConfiguration.general = systemGeneral;
                return self._populateStaticRoutes(networkOverview);
            }).then(function () {
                return networkOverview;
            });
        }
    },


    _populateNetworkConfig: {
        value: function (networkOverview) {
            return this.application.dataService.fetchData(Model.NetworkConfig).then(function (networkConfig) {
                networkOverview.networkConfiguration = networkConfig[0];
            });
        }
    },


    _populateNetworkStatus: {
        value: function (networkOverview) {
            return Model.populateObjectPrototypeForType(Model.NetworkConfig).then(function(NetworkConfig) {
                return NetworkConfig.constructor.getStatus().then(function (networkStatus) {
                    networkOverview.summary.nameservers = networkStatus.dns.addresses;
                    networkOverview.summary.defaultRoute = {
                        ipv4: networkStatus.gateway.ipv4,
                        ipv6: networkStatus.gateway.ipv6
                    };
                    networkOverview.networkConfiguration.status = networkStatus;
                });
            });
        }
    },


    _populateNetworkInterfaces: {
        value: function (networkOverview) {
            return this.application.networkInterfacesSevice.getNetworkInterfaces().then(function (networkInterfaces) {
                networkOverview.interfaces = networkInterfaces;
            });
        }
    },

    _handleNetworkInterfacesRangeChange: {
        value: function (plus, minus, index) {
            var overview = this.overview;

            if (overview && overview.summary) {
                var networkInterfacesSummary = overview.summary.interfaces || [];

                if (plus.length) {
                    this._getInterfacesSummaries(plus, networkInterfacesSummary);
                }

                if (minus.length) {
                    for (var i = 0, length = minus.length; i < length; i++) {
                        this._removeInterfaceFromInterfacesSummary(minus[i], networkInterfacesSummary);
                    }
                }

                overview.summary.interfaces = networkInterfacesSummary;
            }
        }
    },

    _handleHostnameChange: {
        value: function (hostname) {
            if (this.overview && this.overview.summary) {
                this.overview.summary.hostname = hostname;
            }
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

                networkOverview.staticRoutes = staticRoutes;
            });
        }
    },


    _getInterfacesSummaries: {
        value: function (networkInterfaces, interfacesSummaries) {
            var interfaceSummary;
            interfacesSummaries = interfacesSummaries || [];

            for (var i = 0, length = networkInterfaces.length; i < length; i++) {
                interfaceSummary = {};
                this._populateNetworkInterfaceStatus(networkInterfaces[i], interfaceSummary);
                interfacesSummaries.push(interfaceSummary);
            }

            return interfacesSummaries;
        }
    },

    _removeInterfaceFromInterfacesSummary: {
        value: function (networkInterface, networkInterfacesSummary) {
            // Fixme: @see _populateNetworkInterfaceStatus
            if (Promise.is(networkInterface.status)) {
                var self = this;

                networkInterface.status.then(function () {
                    self.__removeInterfaceFromInterfacesSummary(networkInterface, networkInterfacesSummary);
                });
            } else {
                this.__removeInterfaceFromInterfacesSummary(networkInterface, networkInterfacesSummary);
            }
        }
    },

    __removeInterfaceFromInterfacesSummary: {
        value: function (networkInterface, networkInterfacesSummary) {
            var networkInterfaceName = networkInterface.status.name,
                networkInterfaceSummary;

            for (var i = 0, length = networkInterfacesSummary.length; i < length; i++) {
                networkInterfaceSummary = networkInterfacesSummary[i];

                if (networkInterfaceSummary.name === networkInterfaceName) {
                    networkInterfacesSummary.splice(i, 1);
                    break;
                }
            }
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
            interfaceSummary.name = networkInterface.status.name;
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
