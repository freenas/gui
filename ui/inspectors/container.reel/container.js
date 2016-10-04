/**
 * @module ui/container.reel
 */
var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

/**
 * @class Container
 * @extends Component
 */
exports.Container = AbstractInspector.specialize({

    enterDocument: {
        value: function (isFirstTime) {
            this.super();

            if (this.object.memory_limit) {
                this.object.memory_limit = this.application.bytesService.convertSizeToString(this.object.memory_limit, this.application.bytesService.UNITS.M);
            }
        }
    },


    handleStartAction: {
        value: function() {
            this.object.services.start(this.object.id);
        }
    },

    handleStopAction: {
        value: function() {
            this.object.services.stop(this.object.id);
        }
    },

    handleSerialConsoleAction: {
        value: function() {
            var self = this;

            this.application.consoleService.getSerialToken(this.object.id).then(function(token) {
                window.open("/serial-console-app/#" + token, self.object.names[0] + " Serial Console");
            });
        }
    }

});
