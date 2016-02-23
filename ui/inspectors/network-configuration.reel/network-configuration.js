/**
 * @module ui/network-configuration.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class NetworkConfiguration
 * @extends Component
 */
exports.NetworkConfiguration = Component.specialize(/** @lends NetworkConfiguration# */ {
    _object: {
        value: {
            "autoconfigure": false,
            "dns": {
                "addresses": [],
                "search": []
            },
            "netwait": {
                "addresses": [],
                "enabled": false
            },
            "http_proxy": null,
            "dhcp": {
                "assign_gateway": true,
                "assign_dns": true
            },
            "gateway": {
                "ipv4": null,
                "ipv6": null
            }
        }
    },

    object: {
        set: function (networkConfig) {
            // TODO
        },
        get: function () {
            return this._object;
        }
    }
});
