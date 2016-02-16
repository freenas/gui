var Component = require("montage/ui/component").Component;

/**
 * @class Lagg
 * @extends Component
 */

// These will never change, but should be taken from the middleware.
var _LAGG_PROTOCOLS = [
    "NONE",
    "ROUNDROBIN",
    "FAILOVER",
    "LOADBALANCE",
    "LACP",
    "ETHERCHANNEL"
]

var _lagg_protocol_options = _LAGG_PROTOCOLS.map( function (protocol) {
    return {"label": protocol, "value": protocol};
});

// This should be an array of all the interfaces provided by the middleware.
var _interfaces = [
    {
        "status": {
            "capabilities": [
                "VLAN_MTU",
                "RXCSUM",
                "TXCSUM",
                "VLAN_HWTAGGING",
                "VLAN_HWCSUM"
            ],
            "link_address": "00:0c:29:a8:72:a7",
            "media_type": "Ethernet",
            "link_state": "LINK_STATE_UP",
            "aliases": [
                {
                    "type": "LINK",
                    "address": "00:0c:29:a8:72:a7"
                },
                {
                    "netmask": 64,
                    "type": "INET6",
                    "address": "fe80::20c:29ff:fea8:72a7"
                },
                {
                    "netmask": 24,
                    "broadcast": "10.0.1.255",
                    "type": "INET",
                    "address": "10.0.1.169"
                }
            ],
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
            "media_subtype": "autoselect",
            "media_options": [],
            "cloned": false,
            "mtu": 1500,
            "nd6_flags": [
                "AUTO_LINKLOCAL",
                "PERFORMNUD"
            ],
            "name": "em0"
        },
        "enabled": true,
        "dhcp": true,
        "updated_at": {
            "$date": "2016-02-10 01:02:28.288000"
        },
        "aliases": [],
        "type": "ETHER",
        "media": null,
        "rtadv": false,
        "noipv6": false,
        "created_at": {
            "$date": "2016-02-10 01:02:23.270000"
        },
        "mtu": null,
        "id": "em0"
    },
    {
        "status": {
            "capabilities": [
                "VLAN_MTU",
                "RXCSUM",
                "TXCSUM",
                "VLAN_HWTAGGING",
                "VLAN_HWCSUM"
            ],
            "link_address": "00:0c:29:a8:72:b1",
            "media_type": "Ethernet",
            "link_state": "LINK_STATE_DOWN",
            "aliases": [
                {
                    "type": "LINK",
                    "address": "00:0c:29:a8:72:b1"
                }
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
            "media_subtype": "autoselect",
            "media_options": [],
            "cloned": false,
            "mtu": 1500,
            "nd6_flags": [
                "PERFORMNUD"
            ],
            "name": "em1"
        },
        "enabled": false,
        "dhcp": false,
        "updated_at": {
            "$date": "2016-02-10 01:02:23.275000"
        },
        "aliases": [],
        "type": "ETHER",
        "media": null,
        "rtadv": false,
        "noipv6": false,
        "created_at": {
            "$date": "2016-02-10 01:02:23.275000"
        },
        "mtu": null,
        "id": "em1"
    },
    {
        "status": {
            "capabilities": [
                "HWSTATS"
            ],
            "link_address": "00:00:00:00:00:00",
            "media_type": "Ethernet",
            "link_state": "LINK_STATE_DOWN",
            "aliases": [
                {
                    "type": "LINK",
                    "address": "00:00:00:00:00:00"
                },
                {
                    "netmask": 64,
                    "type": "INET6",
                    "address": "fe80::20c:29ff:fea8:72a7"
                }
            ],
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
            "media_subtype": "autoselect",
            "media_options": [],
            "protocol": "FAILOVER",
            "nd6_flags": [
                "AUTO_LINKLOCAL",
                "PERFORMNUD"
            ],
            "cloned": false,
            "mtu": 1500,
            "ports": "<generator object at 0x8097c0058>",
            "name": "lagg0"
        },
        "enabled": true,
        "dhcp": false,
        "updated_at": {
            "$date": "2016-02-13 19:26:23.788000"
        },
        "aliases": [],
        "type": "LAGG",
        "lagg": {
            "ports": [],
            "protocol": "FAILOVER"
        },
        "media": null,
        "noipv6": false,
        "rtadv": false,
        "cloned": true,
        "mtu": null,
        "created_at": {
            "$date": "2016-02-13 19:26:23.788000"
        },
        "id": "lagg0"
    },
    {
        "status": {
            "capabilities": [],
            "link_address": "00:00:00:00:00:00",
            "media_type": null,
            "link_state": "LINK_STATE_UNKNOWN",
            "parent": "b''",
            "flags": [
                "MULTICAST",
                "UP",
                "BROADCAST",
                "CANTCONFIG",
                "PPROMISC",
                "MONITOR",
                "STATICARP",
                "DYING",
                "RENAMING"
            ],
            "media_subtype": null,
            "media_options": [],
            "aliases": [
                {
                    "type": "LINK",
                    "address": "00:00:00:00:00:00"
                },
                {
                    "netmask": 64,
                    "type": "INET6",
                    "address": "fe80::20c:29ff:fea8:72a7"
                }
            ],
            "tag": 0,
            "cloned": true,
            "mtu": 1500,
            "nd6_flags": [
                "AUTO_LINKLOCAL",
                "PERFORMNUD"
            ],
            "name": "vlan0"
        },
        "enabled": true,
        "dhcp": false,
        "updated_at": {
            "$date": "2016-02-13 19:36:49.833000"
        },
        "aliases": [],
        "type": "VLAN",
        "media": null,
        "noipv6": false,
        "rtadv": false,
        "cloned": true,
        "mtu": null,
        "vlan": {
            "parent": null,
            "tag": null
        },
        "created_at": {
            "$date": "2016-02-13 19:36:49.833000"
        },
        "id": "vlan0"
    }
];

var _port_options = _interfaces.map( function (interfaceInstance) {
    return {"label": interfaceInstance.id, "value": interfaceInstance.id}
})

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
    },
    "lagg_protocol_options": {
        value: _lagg_protocol_options
    },
    "port_options": {
        value: _port_options
    }
});
