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

    enterDocument: {
        value: function(isFirstTime) {
            var self = this,
                loadingPromises = [],
                speed = SystemAdvancedSerialspeed;
            if (isFirstTime){
                this.isLoading = true;
                this.serialSpeedOptions = [];
                for(var i=0; i<speed.members.length; i++){
                    this.serialSpeedOptions.push({label: speed.members[i], value: speed[speed.members[i]]})
                }
                this.serialSpeedOptions.unshift({label: "---", value: "none"});
                loadingPromises.push(
                    this.application.systemAdvancedService.getSerialConsoleData().then(function(consoleData) {
                        self.consoleData = consoleData;
                        self.object = consoleData.systemAdvanced;
                    }),
                    Model.populateObjectPrototypeForType(Model.SystemAdvanced).then(function(SystemAdvanced) {
                        return SystemAdvanced.constructor.services.serialPorts();
                    }).then(function(serialPorts) {
                        // self.serialPortOptions = serialPorts;
                        self.serialPortOptions = [];
                        for(var i=0; i<serialPorts.length; i++) {
                            self.serialPortOptions.push({label: serialPorts[i].name, value: serialPorts[i].name});
                        }
                        self.serialPortOptions.unshift({label:"---", value: "none"});
                    })
                );
                Promise.all(loadingPromises).then(function() {
                    self.isLoading = false;
                });
            }
        }
    }
});
