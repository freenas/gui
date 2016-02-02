var Component = require("montage/ui/component").Component;

/**
 * @class Interface
 * @extends Component
 */
exports.Interface = Component.specialize({
    "object": {
        "value": {
            "aliases": [],
            "created_at": "2016-01-28 17:37:50.732000",
            "dhcp": false,
            "enabled": false,
            "id": "em1",
            "media": null,
            "mtu": null,
            "noipv6": false,
            "rtadv": false,
            "status": {
                "name": "em1",
                "media_type": "Ethernet",
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
                "aliases": [
                    {
                        "address": "00:0c:29:a8:72:b1",
                        "type": "LINK"
                    }
                ],
                "media_options": [],
                "link_address": "00:0c:29:a8:72:b1",
                "link_state": "LINK_STATE_DOWN"
            },
            "type": "ETHER",
            "updated_at": "2016-01-28 17:37:50.732000"
        }
    }
});
