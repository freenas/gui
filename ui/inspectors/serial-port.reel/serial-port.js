var Component = require("montage/ui/component").Component;

/**
 * @class SerialPort
 * @extends Component
 */
exports.SerialPort = Component.specialize({

    PORT_SPEED_OPTIONS: {
        value: [
            9600,
            19200,
            38400,
            57600,
            115200
        ]
    }
});
