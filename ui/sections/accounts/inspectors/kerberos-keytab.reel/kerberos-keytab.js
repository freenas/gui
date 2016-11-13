var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    AccountSectionService = require("core/service/section/account-section-service").AccountSectionService;

/**
 * @class KerberosKeytab
 * @extends Component
 */
exports.KerberosKeytab = AbstractInspector.specialize({

    //TODO: remove when account will have been migrated to the new architecture.
    _sectionService: {
        get: function () {
            return AccountSectionService.instance;
        }
    },

    save: {
        value: function () {
            return this._sectionService.saveKerberosKeytabWithKeytabStringBase64(this.object, this.keytab);
        }
    }

});
