/*global require, exports, document, Error*/

var Component = require("montage/ui/component").Component,
    UUID = require("montage/core/uuid").Uuid,
    DragDropComponentManager = require('core/drag-drop/drag-drop-component-manager').defaultDragDropComponentManager;
/**
 * @class AbstractDropZoneComponent
 * @abstract
 *
 * @extends Component
 *
 */
exports.AbstractDropZoneComponent = Component.specialize( /** @lends AbstractDropZoneComponent# */ {


    _acceptDrop: {
        value: false
    },


    acceptDrop: {
        set: function (value) {
            if (typeof value === "boolean" && this._acceptDrop !== value) {
                this._acceptDrop = value;

                this.needsDraw = true;
            }
        },
        get: function () {
            return this._acceptDrop;
        }
    },


    priorityDrop: {
        value: 0 //todo: nested drop-zones should always have the higher priority?
    },


    _uuid: {
        value: null
    },


    uuid: {
        get: function () {
            return this._uuid || (this._uuid = UUID.generate());
        }
    },


    _willAcceptDrop: {
        value: false
    },


    willAcceptDrop: {
        set: function (value) {
            if (typeof value === "boolean" && this._willAcceptDrop !== value) {
                this._willAcceptDrop = value;

                this.needsDraw = true;
            }
        },
        get: function () {
            return this._willAcceptDrop;
        }
    },


    _boundingRect: {
        value: null
    },


    enterDocument: {
        value: function (firstime) {
            if (firstime) {
                this.classList.add("montage--DropZone");
            }

            DragDropComponentManager.registerDropZoneComponent(this);
        }
    },


    exitDocument: {
        value: function () {
            DragDropComponentManager.releaseDropZoneComponent(this);
        }
    },


    handleComponentDragStart: {
        value: function (draggableComponent, dragStartEvent) {
            this.willAcceptDrop = this._shouldAcceptComponent(draggableComponent, dragStartEvent);
        }
    },


    handleComponentDrag: {
        value: function (draggableComponent, dragEvent) {
            // Doesn't need to compute the position of the DraggableComponent
            // if this DropZoneComponent doesn't accept a drop for this component.
            if (this._willAcceptDrop) {
                var isDraggableComponentOver = this._isDraggableComponentOver(dragEvent);

                if (isDraggableComponentOver && !this.acceptDrop && typeof draggableComponent.didEnterDropZone === "function") {
                    draggableComponent.didEnterDropZone(this);
                } else if (!isDraggableComponentOver && this.acceptDrop && typeof draggableComponent.didLeaveDropZone === "function") {
                    draggableComponent.didLeaveDropZone(this);
                }

                if (isDraggableComponentOver && typeof draggableComponent.didOverDropZone === "function") {
                    draggableComponent.didOverDropZone(this);
                }

                this.acceptDrop = isDraggableComponentOver;
            }
        }
    },


    handleComponentDrop: {
        value: function (draggableComponent) {
            if (this._acceptDrop) {
                draggableComponent.hasBeenDropped = true;
                draggableComponent.dropZoneDropped = this;

                if (typeof this.didComponentDrop === "function") {
                    this.didComponentDrop(draggableComponent);
                }
            }
        }
    },


    handleComponentDragEnd: {
        value: function (draggableComponent, dragEndEvent) {
            if (this._willAcceptDrop || this._acceptDrop) {
                if (typeof this.didComponentDragEnd === "function") {
                    this.didComponentDragEnd(draggableComponent, dragEndEvent);
                }

                this.willAcceptDrop = false;
                this.acceptDrop = false;
                this._boundingRect = null;
            }
        }
    },


    handleFilesDragStart: {
        value: function (dragStartEvent) {
            this.willAcceptDrop = this._shouldAcceptFiles(dragStartEvent);

            if (this._willAcceptDrop) {
                this._element.addEventListener("dragover", this, false);
            }
        }
    },


    handleDragover: {
        value: function (event) {
            var dataTransfer = event.dataTransfer;

            if (!this._acceptDrop) {
                if (this._willAcceptDrop) {
                    event.preventDefault();

                    dataTransfer.dropEffect = dataTransfer.effectAllowed;
                    this.acceptDrop = true;

                    this._element.addEventListener("dragleave", this, false);
                    this._element.addEventListener("drop", this, false);

                } else {
                    dataTransfer.dropEffect = "none";
                }
            } else { // Component is already accepting drop.
                event.preventDefault();
            }
        }
    },


    handleDrop: {
        value: function (event) {
            var dataTransfer = event.dataTransfer;

            if (this._acceptDrop) {
                if (dataTransfer && dataTransfer.types && dataTransfer.types.has("Files")) {
                    event.preventDefault();

                    if (typeof this.didFilesDrop === "function") {
                        this.didFilesDrop(dataTransfer.files, event);
                    }
                }

                this.acceptDrop = false;
                this.willAcceptDrop = false;

                this._element.removeEventListener("dragover", this, false);
                this._removeFileListeners();
            }
        }
    },


    handleDragleave: {
        value: function (event) {
            if (typeof this.didDragFileLeave === "function") {
                this.didDragFileLeave(event);
            }

            this.acceptDrop = false;
            this._removeFileListeners();
        }
    },


    handleFilesDragEnd: {
        value: function (event) {
            if (this._willAcceptDrop || this._acceptDrop) {
                if (typeof this.didDragFileEnd === "function") {
                    this.didDragFileEnd(event);
                }

                this.willAcceptDrop = false;
                this.acceptDrop = false;
                this._boundingRect = null;

                this._element.removeEventListener("dragover", this, false);
            }
        }
    },


    _removeFileListeners: {
        value: function () {
            this._element.removeEventListener("dragleave", this, false);
            this._element.removeEventListener("drop", this, false);
        }
    },


    _shouldAcceptComponent: {
        value: function (component, event) {
            var shouldAcceptComponent = true;

            if (typeof this.shouldAcceptComponent === "function") {
                shouldAcceptComponent = this.shouldAcceptComponent(component, event);
            }

            return shouldAcceptComponent;
        }
    },


    _shouldAcceptFiles: {
        value: function (event) {
            var dataTransfer = event.dataTransfer,
                shouldAcceptFile = false;

            if (dataTransfer) {
                var mimeTypes = dataTransfer.types;

                if (mimeTypes && mimeTypes.has("Files") && typeof this.shouldAcceptFiles === "function") {
                    shouldAcceptFile = this.shouldAcceptFiles(event);
                }
            }

            return shouldAcceptFile;
        }
    },


    _isDraggableComponentOver: {
        value: function (dragEvent) {
            var response = false;

            if (this._willAcceptDrop) {
                if (this._boundingRect !== null) {
                    var pointerPositionX = dragEvent.startPositionX + dragEvent.translateX,
                        pointerPositionY = dragEvent.startPositionY + dragEvent.translateY,
                        dropZoneTop = this._boundingRect.top,
                        dropZoneLeft = this._boundingRect.left;

                    response = pointerPositionY > dropZoneTop && pointerPositionY < dropZoneTop + this._boundingRect.height && // top && bottom
                    pointerPositionX > dropZoneLeft && pointerPositionX < dropZoneLeft + this._boundingRect.width; // left && right

                } else {
                    this.needsDraw = true;
                }
            }

            return response;
        }
    },


    willDraw: {
        value: function () {
            if (this._willAcceptDrop && !this._boundingRect) {
                this._boundingRect = this._element.getBoundingClientRect();
            }
        }
    },


    draw: {
        value: function () {
            if (this._willAcceptDrop && this._acceptDrop) {
                this._element.classList.remove("willAcceptDrop");
                this._element.classList.add("acceptDrop");

            } else if (this._willAcceptDrop) {
                this._element.classList.remove("acceptDrop");
                this._element.classList.add("willAcceptDrop");

            } else {
                this._element.classList.remove("acceptDrop");
                this._element.classList.remove("willAcceptDrop");
            }
        }
    }


});
