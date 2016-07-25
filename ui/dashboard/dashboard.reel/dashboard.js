var AbstractDropZoneComponent = require("blue-shark/core/drag-drop/abstract-dropzone-component").AbstractDropZoneComponent,
    WidgetWrapper = require("ui/dashboard/widgets/widget-wrapper.reel").WidgetWrapper,
    DrawerItem = require("ui/drawer.reel/drawer-item.reel").DrawerItem;

/**
 * @class Dashboard
 * @extends Component
 */
exports.Dashboard = AbstractDropZoneComponent.specialize({

    _widgetPlaceHolderElement: {
        value: null
    },

    userWidgets: {
        value: null
    },

    _placeHolderAnchor: {
        value: null
    },

    _placeHolderAnchorPosition: {
        value: null
    },

    _needsUpdatePlaceHolder: {
        value: null
    },

    _hasComponentDragging: {
        value: false
    },

    _shouldInsertBeforePlaceHolder: {
        value: false
    },

    enterDocument: {
        value: function (isFirstTime) {
            AbstractDropZoneComponent.prototype.enterDocument.call(this, isFirstTime);

            if (!this.userWidgets) {
                var self = this;

                this.application.applicationContextService.get().then(function (applicationContext) {
                    self.userWidgets = applicationContext.dashboardContext.widgets;
                });
            }
        }
    },

    exitDocument: {
        value: function () {
            this.application.isDrawerOpen = false;
        }
    },

    shouldAcceptComponent: {
        value: function (draggableComponent) {
            return this.userWidgets && (draggableComponent instanceof DrawerItem || draggableComponent instanceof WidgetWrapper);
        }
    },

    handleComponentDragStart: {
        value: function (draggableComponent, dragEvent) {
            AbstractDropZoneComponent.prototype.handleComponentDragStart.call(this, draggableComponent, dragEvent);

            if (this.willAcceptDrop) {
                if (draggableComponent instanceof DrawerItem) {
                    if (this.userWidgets.length > 0) {
                        this._placeHolderAnchor = this._widgetsRepetition._drawnIterations[this.userWidgets.length - 1].firstElement;
                        this._placeHolderAnchorPosition = this._findPositionFromTranslateEvent(dragEvent);
                    }

                    this._needsUpdatePlaceHolder = true;
                    this.needsDraw = true;
                }

                this._hasComponentDragging = true;
            }
        }
    },

    didComponentDrop: {
        value: function (draggableComponent) {
            var indexObjectAnchor, index,
                draggableObject = draggableComponent.object,
                previousIndex = this.userWidgets.indexOf(draggableComponent.object);

            if (draggableComponent instanceof DrawerItem && previousIndex === -1) {
                if (this._placeHolderAnchor) {
                    indexObjectAnchor = this.userWidgets.indexOf(this._placeHolderAnchor.component.object);
                    index = this._shouldInsertBeforePlaceHolder ? indexObjectAnchor : indexObjectAnchor + 1;

                    this.userWidgets.splice(index, 0, draggableObject);
                } else {
                    this.userWidgets.push(draggableComponent.object);
                }
            } else if (draggableComponent instanceof WidgetWrapper) {
                this.userWidgets.splice(previousIndex, 1);

                indexObjectAnchor = this.userWidgets.indexOf(this._placeHolderAnchor.component.object);
                index = this._shouldInsertBeforePlaceHolder ? indexObjectAnchor : indexObjectAnchor + 1;

                this.userWidgets.splice(index, 0, draggableObject);
            }
        }
    },

    handleComponentDragOver: {
        value: function (draggableComponent, dragEvent) {
            var pointerPosition = this._placeHolderAnchorPosition = this._findPositionFromTranslateEvent(dragEvent),
                widgetWrapperComponent = this._findWidgetWrapperComponentFromPoint(pointerPosition.x, pointerPosition.y);

            if (widgetWrapperComponent) {
                this._placeHolderAnchor = widgetWrapperComponent.element;
                this._needsUpdatePlaceHolder = true;
                this.needsDraw = true;
            }
        }
    },

    didComponentDragEnd: {
        value: function () {
            this._hasComponentDragging = false;
            this._placeHolderAnchor = null;
            this._placeHolderAnchorPosition = null;
            this.needsDraw = true;
        }
    },

    _findPositionFromTranslateEvent: {
        value: function (translateEvent) {
            return {
                x: translateEvent.startPositionX + translateEvent.translateX,
                y: translateEvent.startPositionY + translateEvent.translateY
            }
        }
    },

    _findWidgetWrapperComponentFromPoint: {
        value: function (pointerPositionX, pointerPositionY) {
            var element = document.elementFromPoint(pointerPositionX, pointerPositionY);
            return element ? this._findWidgetWrapperComponentFromElement(element) : null;
        }
    },

    _findWidgetWrapperComponentFromElement: {
        value: function (element) {
            var component = this._findCloserComponentFromElement(element),
                widgetWrapperComponent;

            while (component && !widgetWrapperComponent && component !== this) {
                if (component instanceof WidgetWrapper) {
                    widgetWrapperComponent = component;
                } else {
                    component = component.parentComponent;
                }
            }

            return widgetWrapperComponent;
        }
    },

    _findCloserComponentFromElement: {
        value: function (element) {
            var component;

            while (element && !(component = element.component) && element !== this.element) {
                element = element.parentNode;
            }

            return component;
        }
    },

    willDraw: {
        value: function () {
            AbstractDropZoneComponent.prototype.willDraw.call(this);

            if (this._placeHolderAnchor && this._needsUpdatePlaceHolder) {
                var placeHolder = this._placeHolderAnchor,
                    placeHolderAnchorBoundingClientRect = placeHolder.getBoundingClientRect();

                this._shouldInsertBeforePlaceHolder = this._placeHolderAnchorPosition.x <
                    placeHolderAnchorBoundingClientRect.left + (placeHolderAnchorBoundingClientRect.width/2);

                if (this._widgetPlaceHolderElement && this._widgetPlaceHolderElement.parentNode) {
                    if (this._shouldInsertBeforePlaceHolder) {
                        this._needsUpdatePlaceHolder = placeHolder.previousElementSibling !== this._widgetPlaceHolderElement;

                    } else {
                        this._needsUpdatePlaceHolder = placeHolder.nextElementSibling !== this._widgetPlaceHolderElement;
                    }
                }
            }
        }
    },

    draw: {
        value: function () {
            AbstractDropZoneComponent.prototype.draw.call(this);

            if (this._needsUpdatePlaceHolder) {
                if (!this._widgetPlaceHolderElement) {
                    this._widgetPlaceHolderElement = document.createElement("div");
                    this._widgetPlaceHolderElement.classList.add("Dashboard-widget");
                    this._widgetPlaceHolderElement.classList.add("placeholder");
                }

                if (this._placeHolderAnchor) {
                    this._widgetsRepetition.element.insertBefore(
                        this._widgetPlaceHolderElement,
                        this._shouldInsertBeforePlaceHolder ? this._placeHolderAnchor : this._placeHolderAnchor.nextSibling
                    );
                } else {
                    this._widgetsRepetition.element.appendChild(this._widgetPlaceHolderElement);
                }

                this._needsUpdatePlaceHolder = false;

            } else if (!this._hasComponentDragging && this._widgetPlaceHolderElement && this._widgetPlaceHolderElement.parentNode) {
                this._widgetPlaceHolderElement.parentNode.removeChild(this._widgetPlaceHolderElement);
            }
        }
    }

});
