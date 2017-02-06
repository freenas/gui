var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Units = require('core/Units');

exports.Ntpserver = AbstractInspector.specialize({
    _inspectorTemplateDidLoad: {
        value: function() {
            this.pollUnits = Units.SECONDS;
            this._ntpServerService = this.application.ntpServerService;
        }
    },

    save: {
        value: function() {
            return this._sectionService.saveNtpServer(this.object);
        }
    },

    handleSyncNowAction: {
        value: function() {
            return this._ntpServerService.ntpSyncNow(this.object.address);
        }
    }
});
