var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;


exports.Tunables = AbstractInspector.specialize({

    _inspectorTemplateDidLoad: {
        value: function (){
            var self = this;
            return this._sectionService.listTunables().then(function (tunables) {
                self.tunables = tunables;
            });
        }
    }
});
