var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    SystemAdvancedSerialspeed = require("core/model/enumerations/SystemAdvancedSerialspeed").SystemAdvancedSerialspeed,
    _ = require("lodash");

exports.SerialConsole = AbstractInspector.specialize({

    consoleData: {
        value: null
    },

    generalData: {
        value: null
    },

    serialPortOptions: {
        value: null
    },


    serialSpeedOptions: {
        value: null
    },

    keymapsOptions: {
        value: null
    },

    _inspectorTemplateDidLoad: {
        value: function() {
            var self = this;
            this.serialSpeedOptions = _.concat(
                [{label: "---", value: null}],
                _.map(SystemAdvancedSerialspeed.members, function(speed) { return { label: speed, value: _.toInteger(speed) }; })
            );
            return Promise.all([
                this._sectionService.getSystemAdvanced(),
                this._sectionService.getSystemGeneral(),
                this._sectionService.listDevicesWithClass('serial_port'),
                this._sectionService.getKeymapOptions()
            ]).spread(function(systemAdvanced, systemGeneral, serialPorts, keymaps) {
                self.object = systemAdvanced;
                self.generalData = systemGeneral;
                self.serialPortOptions = _.concat(
                    [{label:"---", value: "none"}],
                    _.map(serialPorts, function(port) { return {label: port.name, value: port.name}; })
                );
                self.keymapsOptions = _.map(keymaps, function(keymap) { return {label: keymap[1], value: keymap[0]}; });
                self._snapshotDataObjectsIfNecessary();
            });
        }
    },

    save: {
        value: function() {
            var savingPromises = [];
            savingPromises.push(
                this._sectionService.saveSystemGeneral(this.generalData),
                this._sectionService.saveSystemAdvanced(this.object)
            );
            return Promise.all(savingPromises);
        }
    },

    revert: {
        value: function() {
            this.object.console_cli = this._object.console_cli;
            this.object.serial_port = this._object.serial_port;
            this.object.serial_speed = this._object.serial_speed;
            this.object.console_screensaver = this._object.console_screensaver;
            this.generalData.console_keymap = this._generalData.console_keymap;
        }
    },

    _snapshotDataObjectsIfNecessary: {
        value: function() {
            if (!this._generalData) {
                this._generalData = _.cloneDeep(this.generalData);
            }
            if (!this._object) {
                this._object = _.cloneDeep(this.object);
            }
        }
    }
});
