var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.ContainerSection = AbstractModel.specialize({
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
    },
    _docker: {
        value: null
    },
    docker: {
        set: function (value) {
            if (this._docker !== value) {
                this._docker = value;
            }
        },
        get: function () {
            return this._docker;
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
        }, {
            mandatory: false,
            name: "docker"
        }]
    },
    userInterfaceDescriptor: {
        value: {
            inspectorComponentModule: {
                id: 'ui/inspectors/container-section.reel'
            },
            nameExpression: "'Containers'"
        }
    }
});
