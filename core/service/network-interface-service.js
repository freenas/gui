var Montage = require("montage").Montage,
    Model = require("core/model/model").Model,
    FreeNASService = require("core/service/freenas-service").FreeNASService;


var NetworkInterfaceService = exports.NetworkInterfaceService = Montage.specialize({

    _networkInterfacesAliases: {
        value: null
    },

    networkInterfacesAliases: {
        get: function () {
            if (!this._networkInterfacesAliases) { //lazy fetching.
                this._networkInterfacesAliases = [];
                this._networkInterfacesAliasesListeners = new WeakMap();
                this.addRangeAtPathChangeListener("_networkInterfaces", this, "handleNetworkInterfacesChange");
                this.getNetworkInterfaces();
            }

            //return pointer on array (might be populated later)
            return this._networkInterfacesAliases;
        }
    },

    handleNetworkInterfacesChange: {
        value: function (plus, minus) {
            var networkInterface,
                length, i;

            if (minus && minus.length) {
                for (i = 0, length = minus.length; i < length; i++) {
                    networkInterface = minus[i];

                    if (this._networkInterfacesAliasesListeners.has(networkInterface)) {
                        //cancel listener on networkInterface's aliases
                        this._networkInterfacesAliasesListeners.get(networkInterface)();
                        this._networkInterfacesAliasesListeners.delete(networkInterface);

                        //remove networkInterface's aliases from networkInterfacesAliases
                        this.handleNetworkInterfaceAliasesChange(null, networkInterface.aliases);
                    }
                }
            }

            if (plus && plus.length) {
                for (i = 0, length = plus.length; i < length; i++) {
                    networkInterface = plus[i];

                    this._networkInterfacesAliasesListeners.set(
                        networkInterface,
                        Montage.addRangeAtPathChangeListener.call(networkInterface, "aliases", this, "handleNetworkInterfaceAliasesChange")
                    );
                }
            }
        }
    },

    handleNetworkInterfaceAliasesChange: {
        value: function (plus, minus) {
            var networkInterfaceAlias, length, i;

            if (minus && minus.length) {
                var index;

                for (i = 0, length = minus.length; i < length; i++) {
                    networkInterfaceAlias = minus[i];

                    if ((index = this.networkInterfacesAliases.indexOf(networkInterfaceAlias)) > -1) {
                        this.networkInterfacesAliases.splice(index, 1);
                    }
                }
            }

            if (plus && plus.length) {
                for (i = 0, length = plus.length; i < length; i++) {
                    networkInterfaceAlias = plus[i];

                    this.networkInterfacesAliases.push(networkInterfaceAlias);
                }
            }
        }
    },

    getNetworkInterfaces: {
        value: function () {
            var promise;

            if (this._networkInterfaces) {
                promise = Promise.resolve(this._networkInterfaces);
            } else if (this._fetchNetworkInterfacesPromise) {
                promise = this._fetchNetworkInterfacesPromise;

            } else {
                var self = this;

                promise = this._fetchNetworkInterfacesPromise = FreeNASService.instance.fetchData(Model.NetworkInterface).then(function (networkInterfaces) {
                    self._networkInterfaces = networkInterfaces;
                    self._fetchNetworkInterfacesPromise = null;

                    return networkInterfaces;
                });
            }

            return promise;
        }
    }

}, {
    instance: {
        get: function() {
            if (!this._instance) {
                this._instance = new NetworkInterfaceService();
            }
            return this._instance;
        }
    }
});
