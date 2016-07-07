/**
 * @module ui/serial-console.reel
 */
var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model

/**
 * @class SerialConsole
 * @extends Component
 */
exports.SerialConsole = Component.specialize(/** @lends SerialConsole# */ {
    constructor: {
        value: function SerialConsole() {
            this.super();
        }
    },

    PORT_SPEED_OPTIONS: {
        value: [
            "9600",
            "19200",
            "38400",
            "57600",
            "115200"
        ]
    },


    _getSerialPort: {
        value: function(){
            var self = this;
            return Model.populateObjectPrototypeForType(Model.SystemAdvanced).then(function(SystemAdvanced){
                return SystemAdvanced.constructor.services.serialPorts();
            }).then(function(serialPorts) {
                self.serialPortOptions = self.serialPorts = serialPorts;
            });
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            this._getSerialPort();
        }
    }
});
