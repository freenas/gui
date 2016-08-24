/**
 * @module ui/serial-console.reel
 */
var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model,
    SystemAdvancedSerialspeed = require("core/model/enumerations/system-advanced-serialspeed").SystemAdvancedSerialspeed;

/**
 * @class SerialConsole
 * @extends Component
 */
exports.SerialConsole = Component.specialize(/** @lends SerialConsole# */ {

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

    enterDocument: {
        value: function(isFirstTime) {
            var self = this,
                speed = SystemAdvancedSerialspeed;
            if (isFirstTime){
                this._dataService = this.application.dataService;
                this._snapshotDataObjectsIfNecessary();
                this.isLoading = true;
                this.serialSpeedOptions = [];
                for(var i=0; i<speed.members.length; i++){
                    this.serialSpeedOptions.push({label: speed.members[i], value: speed[speed.members[i]]});
                }
                this.serialSpeedOptions.unshift({label: "---", value: "none"});
                this.application.systemAdvancedService.getSerialConsoleData().then(function(systemAdvanced) {
                    self.object = systemAdvanced;
                });
                this.application.systemDeviceService.getSerialPorts().then(function(serialPorts) {
                    self.serialPortOptions = [];
                    for(var i=0; i<serialPorts.length; i++) {
                        self.serialPortOptions.push({label: serialPorts[i].name, value: serialPorts[i].name});
                    }
                    self.serialPortOptions.unshift({label:"---", value: "none"});
                });
                this.application.systemGeneralService.getKeymapOptions().then(function(keymapsData) {
                    self.keymapsOptions = [];
                    for(var i=0; i<keymapsData.length; i++) {
                        self.keymapsOptions.push({label: keymapsData[i][1], value: keymapsData[i][0]});
                    }
                });
                this.application.systemGeneralService.getConsoleKeymap().then(function(generalData) {
                    self.generalData = generalData;
                });
                self.isLoading = false;
            }
        }
    },

    save: {
        value: function() {
            var savingPromises = [];
            savingPromises.push(
                this.application.systemGeneralService.saveGeneralData(this.generalData),
                this.application.systemAdvancedService.saveAdvanceData(this.object)
            );
            return Promise.all(savingPromises);
        }
    },
    revert: {
        value: function() {
            this.object.console_cli = this._originalConsoleData.console_cli;
            this.object.serial_port = this._originalConsoleData.serial_port;
            this.object.serial_speed = this._originalConsoleData.serial_speed;
            this.object.console_screensaver = this._originalConsoleData.console_screensaver;
            this.keymapsData.console_keymap = this._originalConsoleData.console_keymap;
        }
    },

    _snapshotDataObjectsIfNecessary: {
        value: function() {
            if (!this._originalConsoleData) {
                this._originalConsoleData = this._dataService.clone(this.consoleData);
            }
            if (!this._originalKeymapsData) {
                this._originalKeymapsData = this._dataService.clone(this.keymapsData);
            }
        }
    }
});
