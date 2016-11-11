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
        value: function () {
            return this._saveWithFileUpload(this.object, this.certificateFile, this.privateKeyFile);
        }
    },

    _saveWithFileUpload: {
        value: function (object, certKey, privKey) {
            object.certificate = { "$binary": certKey };
            object.privatekey = {"$binary": privKey};
            console.log(this.certificate);
            // return this._dataService.saveDataObject.apply(this.object);
        }
    }
});
