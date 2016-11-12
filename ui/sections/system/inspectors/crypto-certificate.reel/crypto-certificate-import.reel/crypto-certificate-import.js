/**
 * @module ui/inspectors/crypto-certificate.reel/crypto-certificate-import.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class CryptoCertificateImport
 * @extends Component
 */
exports.CryptoCertificateImport = Component.specialize(/** @lends CryptoCertificateImport# */ {
    save: {
        value: function() {
            this._saveWithFileUpload()
        }
    },

    _saveWithFileUpload: {
        value: function () {
            this.object.certificate = this.certificateFile;
            this.object.privatekey = this.privateKeyFile;
        }
    }
});
