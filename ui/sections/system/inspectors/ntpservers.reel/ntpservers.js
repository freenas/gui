var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Model = require("core/model/model").Model;


exports.Ntpservers = AbstractInspector.specialize({
    _inspectorTemplateDidLoad: {
        value: function (){
            var self = this;
            return this.application.dataService.fetchData(Model.NtpServer).then(function (ntpservers) {
                self.ntpservers = ntpservers;
            });
        }
    },

    enterDocument: {
        value: function(isFirsttime) {
            this.super();
            if (isFirsttime) {
                this.addPathChangeListener("viewer.selectedObject", this, "_handleSelectedEntryChange");
            }
        }
    },

    exitDocument: {
        value: function() {
            this.viewer.selectedObject = null;
        }
    },

    _handleSelectedEntryChange: {
        value: function(value) {
            this.selectedObject = value;
        }
    }
});
