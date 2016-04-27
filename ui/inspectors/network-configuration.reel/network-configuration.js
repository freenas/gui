/**
 * @module ui/network-configuration.reel
 */
var Component = require("montage/ui/component").Component,
    Promise = require("montage/core/promise").Promise;

/**
 * @class NetworkConfiguration
 * @extends Component
 */
exports.NetworkConfiguration = Component.specialize(/** @lends NetworkConfiguration# */ {
    _isGatewayDhcpAssigned: {
        value: null
    },

    isGatewayDhcpAssigned: {
        get: function() {
            return this._isGatewayDhcpAssigned;
        },
        set: function(isGatewayDhcpAssigned) {
            if (!isGatewayDhcpAssigned) {
                this.object.gateway.ipv4 = this.object.status.gateway.ipv4;
                this.object.gateway.ipv6 = this.object.status.gateway.ipv6;
            }
            this._isGatewayDhcpAssigned = isGatewayDhcpAssigned;
        }
    },

    save: {
        value: function() {
            var self = this,
                dhcpLeaseRenewalPromise;
            if (this.isGatewayDhcpAssigned && (this.object.gateway.ipv4 || this.object.gateway.ipv6)) {
                this.object.gateway.ipv4 = this.object.gateway.ipv6 = null;
                dhcpLeaseRenewalPromise = this.application.networkInterfacesSevice.getNetworkInterfaces().then(function(networkInterfaces) {
                    var defaultInterface = networkInterfaces.filter(function(x) { return x.dhcp; })[0];
                    return defaultInterface.renew(defaultInterface.id);
                });
            } else {
                dhcpLeaseRenewalPromise = Promise.resolve();
            }

            return dhcpLeaseRenewalPromise.then(function() {
                self.application.dataService.saveDataObject(self.object);
                self.application.dataService.saveDataObject(self.object.general);
            });
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            if (isFirstTime) {
                if (this.object) {
                    if (!this.object.gateway.ipv4) {
                        this.object.gateway.ipv4 = this.object.status.gateway.ipv4;
                    }
                    if (!this.object.gateway.ipv6) {
                        this.object.gateway.ipv6 = this.object.status.gateway.ipv6;
                    }
                }
            }
        }
    }
});
