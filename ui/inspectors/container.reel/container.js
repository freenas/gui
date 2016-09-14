/**
 * @module ui/container.reel
 */
var AbstractComponentActionDelegate = require("ui/abstract/abstract-component-action-delegate").AbstractComponentActionDelegate;

/**
 * @class Container
 * @extends Component
 */
exports.Container = AbstractComponentActionDelegate.specialize({

    enterDocument: {
        value: function (firstTime) {
            AbstractComponentActionDelegate.prototype.enterDocument.call(this, firstTime);

            if (this.object.memory_limit) {
                this.object.memory_limit = this.application.bytesService.convertMemsizeToString(this.object.memory_limit);
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
