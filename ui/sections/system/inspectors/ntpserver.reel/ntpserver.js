var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

exports.Ntpserver = AbstractInspector.specialize({
    templateDidLoad: {
        value: function() {
            this._ntpServerService = this.application.ntpServerService;
        }
    },
    handleSyncNowAction: {
        value: function() {
            return this._ntpServerService.ntpSyncNow(this.object.address);
        }
    }
});
