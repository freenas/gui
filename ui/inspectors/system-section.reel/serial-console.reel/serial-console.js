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
                this.isLoading = true;
                this.serialSpeedOptions = [];
                for(var i=0; i<speed.members.length; i++){
                    this.serialSpeedOptions.push({label: speed.members[i], value: speed[speed.members[i]]})
                }
                this.serialSpeedOptions.unshift({label: "---", value: "none"});
                this.application.systemAdvancedService.getSerialConsoleData().then(function(consoleData) {
                    self.consoleData = consoleData;
                    self.object = consoleData.systemAdvanced;
                    self.serialPortOptions = [];
                    for(var i=0; i<consoleData.serialPorts.length; i++) {
                        self.serialPortOptions.push({label: consoleData.serialPorts[i].name, value: consoleData.serialPorts[i].name});
                    }
                    self.serialPortOptions.unshift({label:"---", value: "none"});
                    self.isLoading = false;
                });
                this.application.systemGeneralService.getKeymapsData().then(function(keymapsData) {
                    self.keymapsData = keymapsData;
                    self.keymapsOptions = [];
                    for(var i=0; i<keymapsData.keymapsOptions.length; i++) {
                        self.keymapsOptions.push({label: keymapsData.keymapsOptions[i][1], value: keymapsData.keymapsOptions[i][0]});
                    }
                    self.isLoading = false;
                })
            }
        }
    }
});
