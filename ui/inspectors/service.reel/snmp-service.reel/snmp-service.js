var Component = require("montage/ui/component").Component,
    ServiceSnmpV3authtype = require("core/model/enumerations/service-snmp-v3authtype").ServiceSnmpV3authtype,
    ServiceSnmpV3privacyprotocol = require("core/model/enumerations/service-snmp-v3privacyprotocol").ServiceSnmpV3privacyprotocol;

/**
 * @class SnmpService
 * @extends Component
 */
exports.SnmpService = Component.specialize({
    templateDidLoad: {
        value: function() {
          this.v3AuthTypeOptions = ServiceSnmpV3authtype.members;
          this.v3PrivacyProtocolOptions = ServiceSnmpV3privacyprotocol.members;
        }
    }
});
