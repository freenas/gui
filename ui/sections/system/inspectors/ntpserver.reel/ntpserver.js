var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Units = require('core/Units');

exports.Ntpserver = AbstractInspector.specialize({
    _inspectorTemplateDidLoad: {
        value: function() {
            this.pollUnits = Units.SECONDS;
            this._ntpServerService = this.application.ntpServerService;
        }
    },

    enterDocument: {
        value: function() {
            this.force = false;
            if (this.object._isNew) {
                this.object.minpoll = 6;
                this.object.maxpoll = 10;
            }
        }
    },

    save: {
        value: function() {
            return this._sectionService.saveNtpServer(this.object, this.force);
        }
    },

    handleSyncNowAction: {
        value: function() {
            return this._ntpServerService.ntpSyncNow(this.object.address);
        }
    }
});
