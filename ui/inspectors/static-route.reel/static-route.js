var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

/**
 * @class StaticRoute
 * @extends Component
 */
exports.StaticRoute = AbstractInspector.specialize({
    "object": {
        "value": {
            "netmask": 16,
            "gateway": "10.5.0.1",
            "network": "10.5.0.0",
            "type": "INET",
            "id": "exampleRoute"
        }
    },
    "protocolOptions": {
        value: [{"label": "IPv4", "value": "INET"},
               { "label": "IPv6", "value": "INET6"}]
    }
});
