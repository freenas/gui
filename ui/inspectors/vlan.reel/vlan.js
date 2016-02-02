var Component = require("montage/ui/component").Component;

/**
 * @class Vlan
 * @extends Component
 */
exports.Vlan = Component.specialize({
    "exampleVlan": {
        "value": {
            "aliases": [],
            "created_at": "2016-01-28 17:37:50.732000",
            "dhcp": false,
            "enabled": false,
            "id": "vlan0",
            "media": null,
            "mtu": null,
            "noipv6": false,
            "rtadv": false,
            "status": {
                "name": "vlan0",
                "capabilities": [
                    "VLAN_MTU",
                    "RXCSUM",
                    "TXCSUM",
                    "VLAN_HWTAGGING",
                    "VLAN_HWCSUM"
                ],
                "flags": [
                    "SIMPLEX",
                    "MULTICAST",
                    "BROADCAST",
                    "CANTCONFIG",
                    "PPROMISC",
                    "MONITOR",
                    "STATICARP",
                    "DYING",
                    "RENAMING"
                ],
                "cloned": false,
                "nd6_flags": [
                    "PERFORMNUD"
                ],
                "mtu": 1500,
                "media_subtype": "autoselect",
                "aliases": [],
                "media_options": [],
                "link_state": "LINK_STATE_DOWN"
            },
            "type": "VLAN",
            "updated_at": "2016-01-28 17:37:50.732000",
            "vlan": {
                "tag": 1,
                "parent": "em1"
            }
        }
    }
});
