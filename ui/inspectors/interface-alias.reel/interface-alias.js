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

/* The current example alias. */
var _exampleAlias = {
    "netmask": 24,
    "address": "10.0.1.169",
    "broadcast": "10.0.1.255",
    "type": "INET",
    "source": "dhcp"
};

/* Based on the source of the alias, return whether or not to display the input
 * field for modifying the alias. All the auto-generated fields return false,
 * to make it easier to use them with a single Condition component.
 */
function displayAliasInputField ( source ) {
    var shouldDisplay;

    switch ( source ) {

        case "manual":
            shouldDisplay = true;
            break;

        case "dhcp":
        case "link-local":
        case "rtadv":
        default:
            shouldDisplay = false;
            break;
    }
    return shouldDisplay;
}

/* Based on the source of the alias, return "auto" or "manual". Collapses
 * all the auto-generated cases into one for use with a Substitution. */
function collapseAutomaticAliasSources ( source ) {
    var sourceType;

    switch ( source ) {

        case "manual":
            sourceType = "manual";
            break;

        case "dhcp":
        case "link-local":
        case "rtadv":
        default:
            sourceType = "auto";
            break;
    }

    return sourceType;
}

// This is hardcoded. There will never be any other options.
var _ALIAS_TYPE_OPTIONS = [
    {"label": "IPv4", "value": "INET"},
    {"label": "IPv6", "value": "INET6"}
];

/**
 * @class InterfaceAlias
 * @extends Component
 */
exports.InterfaceAlias = Component.specialize({
    "object": {
        "value": _exampleAlias
    },
    "aliasTypeOptions": {
        "value": _ALIAS_TYPE_OPTIONS
    },
    "displayInput": {
        "value": displayAliasInputField( _exampleAlias.source )
    },
    "sourceType": {
        "value": collapseAutomaticAliasSources( _exampleAlias.source )
    },
    "displayBroadcast": {
        "value": _exampleAlias.type === "INET"
    }
});
