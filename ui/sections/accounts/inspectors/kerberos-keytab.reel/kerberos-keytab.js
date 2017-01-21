var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

exports.KerberosKeytab = AbstractInspector.specialize({
    save: {
        value: function () {
            return this._sectionService.saveKerberosKeytabWithKeytabStringBase64(this.object, this.keytab);
        }
    }
});
