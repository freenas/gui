var AbstractDropZoneComponent = require("core/drag-drop/abstract-dropzone-component").AbstractDropZoneComponent;

/**
 * @class TopologyDropzone
 * @extends Component
 */
exports.TopologyDropzone = AbstractDropZoneComponent.specialize(/** @lends TopologyDropzone# */ {

    vDevController: {
        value: null
    },

    shouldAcceptComponent: {
        value: function (diskGridItemComponent) {
            var response = this.ownerComponent.editable !== void 0 ? this.ownerComponent.editable : true,
                vDevControllerContent = this.vDevController.content;

            if (response && vDevControllerContent) {
                /* targetDisk can be vdev or disk here */
                var targetDisk = diskGridItemComponent.object,
                    vDev, vDevChildren, ll, ii;

                loop1:
                for (var i = 0, l = vDevControllerContent.length; i < l; i++) {
                    vDev = vDevControllerContent[i];
                    vDevChildren = vDev.children;

                    if (vDevChildren) {
                        for (ii = 0, ll = vDevChildren.length; ii < ll; ii++) {
                            if (targetDisk === vDevChildren[ii] && ll === 1) {
                                response = false;
                                break loop1;
                            }
                        }
                    } else if (targetDisk === vDev) {
                        response = false;
                        break;
                    }
                }
            }

            return response;
        }
    },

    handleComponentDrop: {
        value: function (diskGridItemComponent) {
            this.dispatchEventNamed("vDevCreated", true, true, {
                disk: diskGridItemComponent.object,
                sourceComponent: diskGridItemComponent.ownerComponent,
                dropZoneComponent: this
            });
        }
    }

});
