var Component = require("montage/ui/component").Component;

/**
 * @class Vlan
 * @extends Component
 */

// This should be an array of all the interfaces of type "ETHER", provided by
// the middleware.
var _interfaces = [
    {
        "type": "ETHER",
        "rtadv": false,
        "dhcp": true,
        "enabled": true,
        "updated_at": {
            "$date": "2016-01-28 17:37:59.284000"
        },
        "created_at": {
            "$date": "2016-01-28 17:37:50.691000"
        },
        "media": null,
        "mtu": null,
        "id": "em0",
        "status": {
            "flags": [
                "DRV_RUNNING",
                "UP",
                "BROADCAST",
                "SIMPLEX",
                "MULTICAST",
                "CANTCONFIG",
                "PPROMISC",
                "MONITOR",
                "STATICARP",
                "DYING",
                "RENAMING"
            ],
            "nd6_flags": [
                "AUTO_LINKLOCAL",
                "PERFORMNUD"
            ],
            "aliases": [
                {
                    "type": "LINK",
                    "address": "00:0c:29:a8:72:a7"
                },
                {
                    "type": "INET",
                    "netmask": 24,
                    "address": "10.0.1.169",
                    "broadcast": "10.0.1.255"
                },
                {
                    "type": "INET6",
                    "netmask": 64,
                    "address": "fe80::20c:29ff:fea8:72a7"
                }
            ],
            "media_subtype": "autoselect",
            "capabilities": [
                "VLAN_MTU",
                "RXCSUM",
                "TXCSUM",
                "VLAN_HWTAGGING",
                "VLAN_HWCSUM"
            ],
            "link_state": "LINK_STATE_UP",
            "name": "em0",
            "mtu": 1500,
            "link_address": "00:0c:29:a8:72:a7",
            "media_type": "Ethernet",
            "cloned": false,
            "media_options": []
        },
        "noipv6": false,
        "aliases": []
    },
    {
        "type": "ETHER",
        "aliases": [],
        "enabled": false,
        "updated_at": {
            "$date": "2016-01-28 17:37:50.732000"
        },
        "rtadv": false,
        "media": null,
        "mtu": null,
        "id": "em1",
        "status": {
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
            "nd6_flags": [
                "PERFORMNUD"
            ],
            "aliases": [
                {
                    "type": "LINK",
                    "address": "00:0c:29:a8:72:b1"
                }
            ],
            "media_subtype": "autoselect",
            "capabilities": [
                "VLAN_MTU",
                "RXCSUM",
                "TXCSUM",
                "VLAN_HWTAGGING",
                "VLAN_HWCSUM"
            ],
            "link_state": "LINK_STATE_DOWN",
            "name": "em1",
            "mtu": 1500,
            "link_address": "00:0c:29:a8:72:b1",
            "media_type": "Ethernet",
            "cloned": false,
            "media_options": []
        },
        "dhcp": false,
        "created_at": {
            "$date": "2016-01-28 17:37:50.732000"
        },
        "noipv6": false
    }
];

var _parent_options = _interfaces.map( function (interfaceInstance) {
    return {"label": interfaceInstance.id, "value": interfaceInstance.id}
});

exports.Vlan = Component.specialize({
    "object": {
        "value": {
            "aliases": [],
            "created_at": "2016-01-28 17:37:50.732000",
            "dhcp": true,
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
    },
    "parent_options": {
        value: _parent_options
    }
});
