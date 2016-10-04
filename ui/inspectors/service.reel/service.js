var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Model = require("core/model/model").Model;

/**
 * @class Service
 * @extends Component
 */
exports.Service = AbstractInspector.specialize({
    systemGeneral: {
        value: null
    },


    enterDocument: {
        value: function(isFirstTime) {
            this.super();
            if (isFirstTime) {
                var self = this;
                return this.application.dataService.fetchData(Model.SystemGeneral).then(function(systemGeneral) {
                    self.systemGeneral = systemGeneral[0];
                });
            }
        }
    },

    save: {
        value: function() {
            if (this.configComponent && typeof this.configComponent.save === 'function') {
                this.configComponent.save();
            }
            this.inspector.save();
        }
    }
});
