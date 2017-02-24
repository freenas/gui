var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    TunableType = require("core/model/enumerations/TunableType").TunableType;

exports.Tunable = AbstractInspector.specialize({
    typeOptions: {
        value: null
    },

    _inspectorTemplateDidLoad: {
        value: function() {
            this.typeOptions = TunableType.members;
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            this.super();
            if (!!this.object._isNew && !this.object.type) {
                this.object.type = "LOADER";
            }
        }
    }
});
