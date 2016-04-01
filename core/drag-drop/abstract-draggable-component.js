var Component = require("montage/ui/component").Component,
    DragDropComponentManager = require('core/drag-drop/drag-drop-component-manager').defaultDragDropComponentManager,
    TranslateComposer = require("montage/composer/translate-composer").TranslateComposer,
    UUID = require("montage/core/uuid").Uuid,
    Dict = require("collections/dict").Dict;

/**
 * @class AbstractDraggableComponent
 * @extends Component
 */
var AbstractDraggableComponent = exports.AbstractDraggableComponent = Component.specialize(/** @lends AbstractDraggableComponent# */ {


    parentContainer: {
        value: null
    },


    isOutsideParentContainer: {
        get: function () {
            return this._isOutsideParentContainer;
        }
    },


    zIndexDragElement: {
        value: 999999
    },


    _placeHolderStrategy: {
        value: null
    },


    placeHolderStrategy: {
        set: function (value) {
            if (typeof value === "string" && typeof AbstractDraggableComponent.PLACE_HOLDER_STRATEGY[value]) {
                this._placeHolderStrategy = AbstractDraggableComponent.PLACE_HOLDER_STRATEGY[value];
            }
        },
        get: function () {
            if (!this._placeHolderStrategy) {
                this._placeHolderStrategy = AbstractDraggableComponent.PLACE_HOLDER_STRATEGY.copy;
            }

            return this._placeHolderStrategy;
        }
    },

    _detail: {
        value: null
    },


    detail: {
        get: function () {
            if (!this._detail) {
                this._detail = new Dict();
            }

            return this._detail;
        }
    },


    _enabled: {
        value: true
    },


    enabled: {
        set: function (boolean) {
            boolean = !!boolean;

            if (this._enabled !== boolean) {
                this._enabled = boolean;
                
                if (boolean && this._inDocument) {
                    this._load();
                } else {
                    this._unload();
                }
            }
        },
        get: function () {
            return this._enabled;
        }
    },


    isGhostImageCenter: {
        value: true
    },


    ghostImageElement: {
        value: null
    },


    dropZoneDropped: {
        value: null
    },


    hasBeenDropped: {
        value: false
    },


    shouldCancelDrop: {
        value: false
    },


    _isOutsideParentContainer: {
        value: false
    },


    _isDragging: {
        value: false
    },


    _previousDisplayRule: {
        value: null
    },


    _translateX: {
        value: null
    },


    _translateY: {
        value: null
    },


    _startPositionX: {
        value: null
    },


    _startPositionY: {
        value: null
    },


    _translateComposer: {
        value: null
    },


    _cloneElement: {
        value: null
    },


    _boundingRect: {
        value: null
    },


    _containerBoundingRect: {
        value: null
    },

    _uuid: {
        value: null
    },


    uuid: {
        get: function () {
            return this._uuid || (this._uuid = UUID.generate());
        }
    },


    enterDocument: {
        value: function (firstTime) {
            if (firstTime) {
                this.classList.add("montage--Draggable");

                if (!AbstractDraggableComponent.cssTransform) {// check for transform support
                    if("webkitTransform" in this._element.style) {
                        AbstractDraggableComponent.cssTransform = "webkitTransform";
                    } else if("MozTransform" in this._element.style) {
                        AbstractDraggableComponent.cssTransform = "MozTransform";
                    } else if("oTransform" in this._element.style) {
                        AbstractDraggableComponent.cssTransform= "oTransform";
                    } else {
                        AbstractDraggableComponent.cssTransform = "transform";
                    }
                }
            }
        }
    },


    exitDocument: {
        value: function () {
            this._resetIfNeeded();

            //if (this._enabled) {
            //    this._unload();
            //}
        }
    },


    prepareForActivationEvents: {
        value: function() {
            this._load();
        }
    },


    handleTranslateStart: {
        value: function (event) {
            var startPosition = this._translateComposer.pointerStartEventPosition;
            this._startPositionX = startPosition.pageX;
            this._startPositionY = startPosition.pageY;

            if (typeof this.shouldAcceptDrag === "function" && !this.shouldAcceptDrag(event)) {
                return void 0;
            }

            if (DragDropComponentManager.registerDraggableComponent(this)) {
                this._translateComposer.addEventListener('translate', this, false);
                this._translateComposer.addEventListener('translateEnd', this, false);
                this._translateComposer.addEventListener('translateCancel', this, false);

                if (typeof this.didDragStart === "function") {
                    this.didDragStart(event);
                }

                DragDropComponentManager.dispatchComponentDragStart(this, event);
            }
        }
    },


    handleTranslate: {
        value: function (event) {
            this._translateX = event.translateX;
            this._translateY = event.translateY;

            //fixme: could be passed by translate composer.
            event.startPositionX = this._startPositionX;
            event.startPositionY = this._startPositionY;

            this._isDragging = true;

            if (typeof this.handleDrag === "function") {
                this.handleDrag(event);
            }

            DragDropComponentManager.dispatchComponentDrag(this, event);

            this.needsDraw = true;
        }
    },


    handleTranslateEnd: {
        value: function (event) {
            this._isDragging = false;
            this._translateX = 0;
            this._translateY = 0;
            this._translateComposer.translateX = 0;
            this._translateComposer.translateY = 0;

            DragDropComponentManager.dispatchComponentDragEnd(this, event);

            if (typeof this.didDragEnd === "function") {
                this.didDragEnd(event);
            }

            if (this._detail) {
                this._detail.clear();
            }

            this.hasBeenDropped = false;
            this.dropZoneDropped = null;
            this.shouldCancelDrop = false;

            DragDropComponentManager.releaseDraggableComponentWithUUID(this.uuid);

            this._translateComposer.removeEventListener('translate', this, false);
            this._translateComposer.removeEventListener('translateEnd', this, false);
            this._translateComposer.removeEventListener('translateCancel', this, false);

            this.needsDraw = true;
        }
    },


    handleTranslateCancel: {
        value: function (event) {

            //todo
            this.needsDraw = true;
        }
    },


    _load: {
        value: function () {
            if (this._enabled) {
                if (!this._translateComposer) {
                    this._translateComposer = new TranslateComposer();
                    this._translateComposer.hasMomentum = false;

                    this.addComposer(this._translateComposer);
                }

                this._translateComposer.addEventListener('translateStart', this, false);
            }
        }
    },


    _unload: {
        value: function () {
            if (this._translateComposer) {
                this._translateComposer.removeEventListener('translateStart', this, false);
            }
        }
    },


    _applyStyleToCloneElement: {
        value: function (positionTop, positionLeft) {
            this._cloneElement.style.zIndex = this.zIndexDragElement;
            this._cloneElement.style.visibility = "visible";
            this._cloneElement.style.position = "absolute";
            this._cloneElement.style.margin = "0px";
            this._cloneElement.style.top = positionTop + "px";
            this._cloneElement.style.left = positionLeft + "px";
        }
    },


    _resetIfNeeded: {
        value: function () {
            if (this._cloneElement && !this._isDragging) {
                document.body.removeChild(this._cloneElement);

                if (this._placeHolderStrategy === AbstractDraggableComponent.PLACE_HOLDER_STRATEGY.hidden) {
                    this._element.style.visibility = this._previousDisplayRule;
                } else if (this.placeHolderStrategy === AbstractDraggableComponent.PLACE_HOLDER_STRATEGY.remove) {
                    this._element.style.display = this._previousDisplayRule;
                }

                this._boundingRect = null;
                this._containerBoundingRect = null;
                this._cloneElement = null;
            }
        }
    },


    willDraw: {
        value: function () {
            if (this._isDragging) {
                if (!this._boundingRect) {
                    if (this.ghostImageElement instanceof HTMLElement) {
                        var shouldRemoveGhostImageElement = false;

                        if (!this.ghostImageElement.parentNode) {
                            this.ghostImageElement.style.position = "absolute";
                            this.ghostImageElement.style.zIndex = "-1";

                            document.body.appendChild(this.ghostImageElement);
                            shouldRemoveGhostImageElement = true;
                        }

                        this._boundingRect = this.ghostImageElement.getBoundingClientRect();

                        if (shouldRemoveGhostImageElement) {
                            document.body.removeChild(this.ghostImageElement);
                        }
                    } else {
                        this._boundingRect = this._element.getBoundingClientRect();
                    }
                }

                if (this.parentContainer && !this._containerBoundingRect) {
                    this._containerBoundingRect = this.parentContainer._element.getBoundingClientRect();
                }
            }
        }
    },


    draw: {
        value: function () {
            if (!this._enabled && !this.classList.contains("disabled")) {
                this._element.classList.add("disabled");
            } else if (this._enabled && this._element.classList.contains("disabled")) {
                this._element.classList.remove("disabled");
            }

            if (this._isDragging) {
                if (!this._cloneElement) {
                    var positionTop,
                        positionLeft;

                    if (this.isGhostImageCenter) {
                        positionTop = this._startPositionY - this._boundingRect.height/2;
                        positionLeft = this._startPositionX - this._boundingRect.width/2;
                    } else {
                        positionTop = this._boundingRect.top;
                        positionLeft = this._boundingRect.left;
                    }

                    this._cloneElement = this.ghostImageElement instanceof HTMLElement ?
                        this.ghostImageElement.cloneNode(true) : this._element.cloneNode(true);

                    this._cloneElement.classList.add("isDragging");

                    // Needs to call the placeHolderStrategy's getter at least once.
                    if (this.placeHolderStrategy === AbstractDraggableComponent.PLACE_HOLDER_STRATEGY.hidden) {
                        this._previousDisplayRule = this._element.style.visibility;
                        this._element.style.visibility = "hidden";
                    } else if (this.placeHolderStrategy === AbstractDraggableComponent.PLACE_HOLDER_STRATEGY.remove) {
                        this._previousDisplayRule = this._element.style.display;
                        this._element.style.display = "none";
                    }

                    this._applyStyleToCloneElement(positionTop, positionLeft);
                }

                if (this.parentContainer && this._containerBoundingRect) {
                    var newPositionY = this._startPositionY + this._translateY,
                        newPositionX = this._startPositionX + this._translateX;

                    if (newPositionY < this._containerBoundingRect.top || // top
                        newPositionY > this._containerBoundingRect.top + this._containerBoundingRect.height || // bottom,
                        newPositionX < this._containerBoundingRect.left || // left
                        newPositionX > this._containerBoundingRect.left + this._containerBoundingRect.width // right
                    ) {
                        this._isOutsideParentContainer = true;
                        this._cloneElement.classList.add("isOutside");
                    } else {
                        this._cloneElement.classList.remove("isOutside");
                        this._isOutsideParentContainer = false;
                    }
                }

                if (!this._cloneElement.parentNode) {
                    document.body.appendChild(this._cloneElement);
                }

                this._cloneElement.style[AbstractDraggableComponent.cssTransform] = "translate3d(" + this._translateX + "px," + this._translateY + "px,0)";
            }

            this._resetIfNeeded();
        }
    }


}, {

    PLACE_HOLDER_STRATEGY: {
        value: {
            remove: "remove",
            copy: "copy",
            hidden: "hidden"
        }
    }

});
