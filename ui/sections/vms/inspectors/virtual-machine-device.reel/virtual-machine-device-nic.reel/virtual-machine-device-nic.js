var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

exports.VirtualMachineDeviceNic = AbstractInspector.specialize({
    templateDidLoad: {
        value: function() {
            var self = this;
            this._canDrawGate.setField(this.constructor.DRAW_GATE_FIELD, false);
            this.nicDeviceOptions = this._sectionService.NIC_DEVICES;
            this.nicModeOptions = this._sectionService.NIC_MODES;
            this._sectionService.listNetworkInterfaces().then(function(interfaces) {
                self.interfaces = interfaces;
                self._canDrawGate.setField(self.constructor.DRAW_GATE_FIELD, true);
            });
        }
    }
}, {
    DRAW_GATE_FIELD: {
        value: "interfacesLoaded"
    }
});
