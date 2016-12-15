var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    SystemAdvancedSerialspeed = require("core/model/enumerations/system-advanced-serialspeed").SystemAdvancedSerialspeed,
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

    enterDocument: {
        value: function(isFirstTime) {
            var self = this,
                speed = SystemAdvancedSerialspeed,
                loadingPromises = [];
            if (isFirstTime){
                this._dataService = this.application.dataService;
                this.isLoading = true;
                this.serialSpeedOptions = [];
                for(var i=0; i<speed.members.length; i++){
                    this.serialSpeedOptions.push({label: speed.members[i], value: speed[speed.members[i]]});
                }
                this.serialSpeedOptions.unshift({label: "---", value: "none"});
                loadingPromises.push(
                    this.application.systemService.getAdvanced().then(function(systemAdvanced) {
                        self.object = systemAdvanced;
                    }),
                    this.application.systemService.getGeneral().then(function(generalData) {
                        self.generalData = generalData;
                    }),
                    this.application.systemService.getDevices('serial_port').then(function(serialPorts) {
                        self.serialPortOptions = [];
                        for(var i=0; i<serialPorts.length; i++) {
                            self.serialPortOptions.push({label: serialPorts[i].name, value: serialPorts[i].name});
                        }
                        self.serialPortOptions.unshift({label:"---", value: "none"});
                    }),
                    this._sectionService.getKeymapOptions().then(function(keymapsData) {
                        self.keymapsOptions = [];
                        for(var i=0; i<keymapsData.length; i++) {
                            self.keymapsOptions.push({label: keymapsData[i][1], value: keymapsData[i][0]});
                        }
                    })
                );
                Promise.all(loadingPromises).then(function() {
                    self._snapshotDataObjectsIfNecessary();
                    self.isLoading = false;
                });
            }
        }
    },

    save: {
        value: function() {
            var savingPromises = [];
            savingPromises.push(
                this.application.systemService.saveGeneral(this.generalData),
                this.application.systemService.saveAdvanced(this.object)
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
