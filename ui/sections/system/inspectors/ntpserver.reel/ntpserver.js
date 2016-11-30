var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Model = require("core/model/model").Model;

exports.Ntpserver = AbstractInspector.specialize({
    handleSyncNowAction: {
        value: function() {
            return this._sectionService.ntpSyncNow(this.object.address);
        }
    }
});
