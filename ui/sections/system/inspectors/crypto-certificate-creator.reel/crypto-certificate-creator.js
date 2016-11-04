/**
 * @module ui/inspectors/crypto-certificate-creator.reel
 */
var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class CryptoCertificateCreator
 * @extends Component
 */
exports.CryptoCertificateCreator = Component.specialize(/** @lends CryptoCertificateCreator# */ {

    newImportCert: {
        value: null
    },

    newCreateCertInternal: {
        value: null
    },

    newCertCSR: {
        value: null
    },

    newCaImport: {
        value: null
    },

    newCaInternal:{
        value: null
    },

    newCaIntermediate: {
        value: null
    },

    parentCascadingListItem: {
        get: function () {
            return CascadingList.findCascadingListItemContextWithComponent(this);
        }
    },

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                this._selectionService = this.application.selectionService;
                this._cryptoService = this.application.cryptoCertificateService;
            }

            this._populateNewCryptoObjectList();
        }
    },

    _getCurrentVolume: {
        value: function() {
            var currentSelection = this._selectionService.getCurrentSelection();

            for (var i = currentSelection.length - 1; i >= 0; i--) {
                if (currentSelection[i].constructor.Type == Model.Volume) {
                    return currentSelection[i];
                }
            }
        }
    },

    _populateNewCryptoObjectList: {
        value: function () {
            var volume = this._getCurrentVolume(),
                cryptoService = this._cryptoService;

            Promise.all([
                cryptoService.populateObjectCertExisting(),
                cryptoService.populateObjectCertInternal(),
                cryptoService.populateObjectCertCSR(),
                cryptoService.populateObjectCaExisting(),
                cryptoService.populateObjectCaInternal(),
                cryptoService.populateObjectCaIntermediate()
            ]).bind(this).then(function (cryptoCertificates) {
                this.newImportCert = cryptoCertificates[0];
                this.newCreateCertInternal = cryptoCertificates[1];
                this.newCertCSR = cryptoCertificates[2];
                this.newCaImport = cryptoCertificates[3];
                this.newCaInternal = cryptoCertificates[4];
                this.newCaIntermediate = cryptoCertificates[5];
            });
        }
    }
});
