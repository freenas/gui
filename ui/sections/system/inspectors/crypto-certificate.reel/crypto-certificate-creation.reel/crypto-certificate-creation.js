var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService,
    DataObjectChangeService = require("core/service/data-object-change-service").DataObjectChangeService,
    ModelEventName = require("core/model-event-name").ModelEventName,
    CryptoCertificateDigestalgorithm = require("core/model/enumerations/CryptoCertificateDigestalgorithm").CryptoCertificateDigestalgorithm,
    _ = require("lodash");

exports.CryptoCertificateCreation = AbstractInspector.specialize({
    keyLenghtOptions: {
        value: [
            {label: 1024, value: 1024},
            {label: 2048, value: 2048},
            {label: 4096, value: 4096}
        ]
    },

    signing_ca_id: {
        value: null
    },

    _handleChange: {
        value: function(state) {
            this._dataObjectChangeService.handleDataChange(this.certificates, state);
            // DTM
            this.dispatchOwnPropertyChange('certificates', this.certificates);
        }
    },

    _inspectorTemplateDidLoad: {
        value: function () {
            var self = this;
            this._eventDispatcherService = EventDispatcherService.getInstance()
            this._dataObjectChangeService = new DataObjectChangeService();
            this.SELF_SIGNED = this._sectionService.SELF_SIGNED;
            this.algorithmOptions = _.map(this.cleanupEnumeration(CryptoCertificateDigestalgorithm), function(x) {
                return {
                    label: x,
                    value: x
                };
            });
            return Promise.all([
                this._sectionService.listCertificates(),
                this._sectionService.listCountryCodes()
            ]).spread(function(certificates, countryCodes) {
                self.certificates = certificates;
                self.countryCodes = _.chain(countryCodes)
                    .toPairs()
                    .sortBy(0)
                    .map(function(x) {
                        return {
                            label: _.capitalize(_.toLower(x[0])),
                            value: x[1]
                        }
                    })
                    .value();
            });
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            this.super(isFirstTime);
            if (this.object._isNew) {
                this.object.key_length = 4096;
                this.object.country = "US";
                this.object.lifetime = 3000;
                var self = this;
                this._sectionService.listCertificates().then(function (certificates) {
                    self.certificates = certificates;
                });
                this.availableCertsEventListener = this._eventDispatcherService.addEventListener(ModelEventName.CryptoCertificate.listChange, this._handleChange.bind(this));
            }
        }
    },

    exitDocument: {
        value: function() {
            this.context = null;
            this._eventDispatcherService.removeEventListener(ModelEventName.CryptoCertificate.listChange, this.availableCertsEventListener);
        }
    }
});
