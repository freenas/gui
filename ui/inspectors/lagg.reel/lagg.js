var Component = require("montage/ui/component").Component;

/**
 * @class Lagg
 * @extends Component
 */
exports.Lagg = Component.specialize({
    "object": {
        "value": {
            "aliases": [],
            "created_at": "2016-01-28 17:37:50.732000",
            "dhcp": false,
            "enabled": false,
            "id": "lagg0",
            "lagg": {
                "protocol": "LACP",
                "ports": [
                    "em0",
                    "em1"
                ]
            },
            "media": null,
            "mtu": null,
            "noipv6": false,
            "rtadv": false,
            "status": {
                "name": "lagg0",
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
            "type": "LAGG",
            "updated_at": "2016-01-28 17:37:50.732000"
        }
    }
});
