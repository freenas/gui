var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Model = require("core/model/model").Model;


exports.Certificates = AbstractInspector.specialize({

    _inspectorTemplateDidLoad: {
        value: function (){
            var self = this;
            return this.application.dataService.fetchData(Model.CryptoCertificate).then(function (certificates) {
                self.certificates = certificates;
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
