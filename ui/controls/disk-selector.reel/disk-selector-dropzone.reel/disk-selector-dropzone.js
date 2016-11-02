var AbstractDropZoneComponent = require("blue-shark/core/drag-drop/abstract-dropzone-component").AbstractDropZoneComponent;

exports.DiskSelectorDropzone = AbstractDropZoneComponent.specialize({

    shouldAcceptComponent: {
        value: function (component) {
            return !this.controller.hasDisk(component.disk);
        }
    },

    handleComponentDrop: {
        value: function (component) {
            this.controller.addDisk(component.object);
        }
    }
});
