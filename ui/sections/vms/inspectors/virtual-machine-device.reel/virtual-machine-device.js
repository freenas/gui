var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Model = require("core/model").Model;

exports.VirtualMachineDevice = AbstractInspector.specialize({

    _object: {
        value: null
    },

    object: {
        get: function() {
            return this._object;
        },
        set: function(object) {
            if (this._object !== object) {
                this._object = object;
                if (object) {
                    if (object._objectType === Model.VmVolume) {
                        object.type = 'VOLUME'
                    }
                    if (!object.properties) {
                        object.properties = {};
                    }
                    object.properties._vm = object._vm;
                }
            }
        }
    },

    enterDocument: {
        value: function() {
            this.super();
            if (this.object._isNew) {
                this._sectionService.initializeNewDevice(this.object);
            }
        }
    },

    save: {
        value: function() {
            this._sectionService.addNewDeviceToVm(this.object._vm, this.object);
        }
    },

    delete: {
        value: function() {
            this._sectionService.removeDeviceFromVm(this.object._vm, this.object);
        }
    }
});
