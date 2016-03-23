/**
 * @module ui/network-configuration.reel
 */
var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model,
    Converter = require("montage/core/converter/converter").Converter;

/**
 * @class NetworkConfiguration
 * @extends Component
 */
exports.NetworkConfiguration = Component.specialize(/** @lends NetworkConfiguration# */ {
    _object: {
        value: null
    },

    _status: {
        value: null
    },

    // These properties control the behavior of the gateway settings.
    // When DHCP set gateway is enabled, we want to show the DHCP-set value.
    // However, the only way to be sure the values in status were set by DHCP is
    // if we record whether DHCP owned those settings when they arrived.

    serverDhcpAssignGateway: {
        value: null
    },

    serverDhcpAssignedGatewayValues: {
        value: null
    },

    save: {
        value: function() {
            this.application.dataService.saveDataObject(this.object);
            this.application.dataService.saveDataObject(this.object.general);
        }
    },

    object: {
        set: function (networkConfig) {
            if (networkConfig) {
                this._object = networkConfig;
                this._status = networkConfig.status;
                if (networkConfig.dhcp.assign_gateway) {
                    this.serverDhcpAssignGateway = true;
                    this.serverDhcpAssignedGatewayValues = networkConfig.status.gateway;
                } else {
                    this.serverDhcpAssignGateway = false;
                    this.serverDhcpAssignedGatewayValues = {ipv4: "", ipv6: ""};
                }
            } else {
                this._object = null;
                this._status = null;
            }
        },
        get: function () {
            return this._object;
        }
    }
});
