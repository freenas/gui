var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    RsyncdModuleMode = require("core/model/enumerations/rsyncd-module-mode").RsyncdModuleMode;


exports.RsyncdModule = AbstractInspector.specialize({
    templateDidLoad: {
        value: function() {
            this.rsyncdModeOptions = RsyncdModuleMode.members.map(function(x) {
               return {
                    value: x,
                    label: x
                };
          });
        }
    }
});
