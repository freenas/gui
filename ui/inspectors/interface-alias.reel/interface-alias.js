var Component = require("montage/ui/component").Component;

// These are what real aliases look like as of this writing. This implementation
// depends on an unimplemented feature labelling each alias with the source of
// its configuration.
/* "aliases": [
    {
        "address": "00:0c:29:a8:72:a7",
        "type": "LINK"
    },
    {
        "netmask": 24,
        "address": "10.0.1.169",
        "broadcast": "10.0.1.255",
        "type": "INET"
    },
    {
        "netmask": 64,
        "address": "fe80::20c:29ff:fea8:72a7",
        "type": "INET6"
    },
    {
        "netmask": 64,
        "address": "2601:647:4900:41f0:20c:29ff:fea8:72a7",
        "type": "INET6"
    }
]*/

/**
 * @class InterfaceAlias
 * @extends Component
 */
exports.InterfaceAlias = Component.specialize({
    "object": {
        "value": {
            "netmask": 24,
            "address": "10.0.1.169",
            "broadcast": "10.0.1.255",
            "type": "INET",
            "source": "manual"
        }
    }
});
