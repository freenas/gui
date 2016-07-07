var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.VirtualMachineSection = AbstractModel.specialize({
    _virtualMachines: {
        value: null
    },
    virtualMachines: {
        set: function (value) {
            if (this._virtualMachines !== value) {
                this._virtualMachines = value;
            }
        },
        get: function () {
            return this._virtualMachines;
        }
    },
    _templates: {
        value: null
    },
    templates: {
        set: function (value) {
            if (this._templates !== value) {
                this._templates = value;
            }
        },
        get: function () {
            return this._templates;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "virtualMachines"
        }, {
            mandatory: false,
            name: "templates"
        }]
    },
    userInterfaceDescriptor: {
        value: {
            inspectorComponentModule: {
                id: 'ui/inspectors/virtual-machine-section.reel'
            },
            nameExpression: "'Virtualization'"
        }
    }
});
