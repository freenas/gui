var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

exports.Settings = AbstractInspector.specialize({
    
    _inspectorTemplateDidLoad: {
        value: function() {
            var self = this;

            return Promise.all([
                this._sectionService.listDockerHosts(),
                this._sectionService.listDockerCollections()
            ]).then(function (responses) {
                self._availablesDockers = responses[0];
                self._availablesDockerCollections = responses[1];
            });
        }
    },

    save: {
        value: function() {
            return this._sectionService.saveSettings(this.object.settings)
        }
    }
});
