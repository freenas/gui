/*global require, exports, document, Error*/
var Component = require("montage/ui/component").Component, DragDropComponentManager = require('core/drag-drop/drag-drop-component-manager').defaultDragDropComponentManager;
/**
 * @class AbstractDropZoneComponent
 * @abstract
 *
 * @extends Component
 *
 */
exports.AbstractDropZoneComponent = Component.specialize(/** @lends AbstractDropZoneComponent# */ {
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
    _uid: {
        value: null
    },
    uid: {
        get: function () {
            return this._uid || (this._uid = DragDropComponentManager.constructor.generateUID());
        }
    },
    scrollThreshold: {
        value: 60
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
                this._spacerElementBoundingRect = null;
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
                }
                else {
                    dataTransfer.dropEffect = "none";
                }
            }
            else {
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
            var dataTransfer = event.dataTransfer, shouldAcceptFile = false;
            if (dataTransfer) {
                var mimeTypes = dataTransfer.types;
                if (mimeTypes && mimeTypes.has("Files") && typeof this.shouldAcceptFiles === "function") {
                    shouldAcceptFile = this.shouldAcceptFiles(event);
                }
            }
            return shouldAcceptFile;
        }
    },
    willDraw: {
        value: function () {
            if (this._willAcceptDrop && !this._boundingRect) {
                this._boundingRect = this._element.getBoundingClientRect();
            }
            if (this.acceptDrop && this.autoScrollView) {
                this._scrollviewElementBoundingRect = this.scrollView.element.getBoundingClientRect();
            }
        }
    },
    draw: {
        value: function () {
            if (this._willAcceptDrop && this._acceptDrop) {
                this._element.classList.remove("willAcceptDrop");
                this._element.classList.add("acceptDrop");
            }
            else if (this._willAcceptDrop) {
                this._element.classList.remove("acceptDrop");
                this._element.classList.add("willAcceptDrop");
            }
            else {
                this._element.classList.remove("acceptDrop");
                this._element.classList.remove("willAcceptDrop");
            }
            if (this.acceptDrop && this.scrollView) {
                var scrollViewBoundingRect = this._scrollviewElementBoundingRect, scrollThreshold = this.scrollThreshold, scrollViewElement = this.scrollView.element;
                if (this.autoScrollView) {
                    if (scrollViewElement.scrollHeight > scrollViewElement.offsetHeight) {
                        this.multiplierY = 0;
                        if (scrollViewBoundingRect.top <= this.scrollViewPointerPositionY &&
                            scrollViewBoundingRect.top + scrollThreshold > this.scrollViewPointerPositionY) {
                            this.multiplierY = scrollThreshold / (this.scrollViewPointerPositionY - scrollViewBoundingRect.top);
                        }
                        else if (scrollViewBoundingRect.bottom >= this.scrollViewPointerPositionY &&
                            this.scrollViewPointerPositionY >= scrollViewBoundingRect.bottom - scrollThreshold) {
                            this.multiplierY = scrollThreshold / (scrollViewBoundingRect.bottom - this.scrollViewPointerPositionY);
                        }
                        // Change the algorithm for speed scrolling.
                        this.multiplierY = this.multiplierY * 2;
                    }
                    if (scrollViewElement.scrollWidth > scrollViewElement.offsetWidth) {
                        this.multiplierX = 0;
                        if (scrollViewBoundingRect.left <= this.scrollViewPointerPositionX &&
                            scrollViewBoundingRect.left + scrollThreshold > this.scrollViewPointerPositionX) {
                            this.multiplierX = scrollThreshold / (this.scrollViewPointerPositionX - scrollViewBoundingRect.left);
                        }
                        else if (scrollViewBoundingRect.right >= this.scrollViewPointerPositionY &&
                            this.scrollViewPointerPositionX >= scrollViewBoundingRect.right - scrollThreshold) {
                            this.multiplierX = scrollThreshold / (scrollViewBoundingRect.right - this.scrollViewPointerPositionX);
                        }
                        this.multiplierX = this.multiplierX * 2;
                    }
                    this.autoScrollView = false;
                    this.needsUpdateScrollView = !!this.multiplierY || !!this.multiplierX;
                }
                if (this.needsUpdateScrollView) {
                    if (scrollViewElement.scrollHeight > scrollViewElement.offsetHeight) {
                        this.needsUpdateScrollView = false;
                        if (scrollViewBoundingRect.top + scrollThreshold > this.scrollViewPointerPositionY) {
                            scrollViewElement.scrollTop = scrollViewElement.scrollTop - (1 * this.multiplierY);
                            this.needsUpdateScrollView = scrollViewElement.scrollTop !== 0;
                        }
                        else if (this.scrollViewPointerPositionY >= scrollViewBoundingRect.bottom - scrollThreshold) {
                            scrollViewElement.scrollTop = scrollViewElement.scrollTop + (1 * this.multiplierY);
                            this.needsUpdateScrollView = (scrollViewElement.scrollTop + scrollViewElement.offsetHeight) < scrollViewElement.scrollHeight;
                        }
                    }
                    if (scrollViewElement.scrollWidth > scrollViewElement.offsetWidth) {
                        this.needsUpdateScrollView = this.needsUpdateScrollView || false;
                        if (spacerElementBoundingRect.left + scrollThreshold > this.scrollViewPointerPositionX) {
                            scrollViewElement.scrollLeft = scrollViewElement.scrollLeft - (1 * multiplier);
                            this.needsUpdateScrollView = scrollViewElement.scrollLeft !== 0;
                        }
                        else if (scrollViewElementPointerPositionX >= spacerElementBoundingRect.right - scrollThreshold) {
                            scrollViewElement.scrollLeft = scrollViewElement.scrollLeft + (1 * multiplier);
                            this.needsUpdateScrollView = (scrollViewElement.scrollLeft + scrollViewElement.offsetWidth) < scrollViewElement.scrollWidth;
                        }
                    }
                }
                if (this.needsUpdateScrollView) {
                    this.needsDraw = true;
                }
            }
        }
    }
});
