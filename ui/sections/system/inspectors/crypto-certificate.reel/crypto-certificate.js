var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Model = require("core/model/model").Model,
    CryptoCertificateType = require("core/model/enumerations/crypto-certificate-type").CryptoCertificateType,
    CryptoCertificateDigestalgorithm = require("core/model/enumerations/crypto-certificate-digestalgorithm").CryptoCertificateDigestalgorithm;

exports.CryptoCertificate = AbstractInspector.specialize({
    enterDocument: {
        value: function () {
            this.super();
            if (!this.object._action && !this.object._isNew) {
                this.object._action = 'creation';
            }
        }
    },
    save: {
        value: function () {
            if (this.certificateComponent && typeof this.certificateComponent.save === 'function') {
                this.certificateComponent.save();
            }
            if (this.object._action === 'import') {
                this.application.cryptoCertificateService.import(this.object);
            } else {
                this.inspector.save();
            }
        }
    }
});
