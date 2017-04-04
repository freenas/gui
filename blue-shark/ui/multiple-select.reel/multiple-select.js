/**
 * @module ui/multiple-select.reel
 */
var AbstractDropZoneComponent = require("core/drag-drop/abstract-dropzone-component").AbstractDropZoneComponent,
    MultipleSelectValue = require("./multiple-select-value.reel").MultipleSelectValue,
    KeyComposer = require("montage/composer/key-composer").KeyComposer;

/**
 * @class MultipleSelect
 * @extends Component
 */
exports.MultipleSelect = AbstractDropZoneComponent.specialize(/** @lends MultipleSelect# */ {

    enabled: {
        value:  true
    },

    values: {
        value: null
    },

    options: {
        value: null
    },

    converter: {
        value: null
    },

    isDraggable: {
        value: false
    },

    __inputError: {
        value: null
    },


    _inputError: {
        get: function() {
            return this.__inputError;
        },
        set: function(inputError) {
            if (!inputError) {
                this.invalidValue = null;
            }
            this.__inputError = inputError;
        }
    },

    __selectedOption: {
        value: null
    },

    invalidValue: {
        value: null
    },

    _selectedOption: {
        get: function() {
            return this.__selectedOption;
        },
        set: function(option) {
            if (option && this.__selectedOption != option) {
                this.__selectedOption = option;
                this._selectOption(option);
            }
        }
    },

    _addOption: {
        value: function(value) {
            if (value) {
                this._addValueToContent(value, true);
                this._clearInput();
                this._stopScrollingOptions();
                this._blurInputField();
            }
        }
    },

    handleMultipleOptionSelected: {
        value: function (option) {
            this._addOption(option.detail);
        }
    },

    enterDocument: {
        value: function (firstTime) {
            AbstractDropZoneComponent.prototype.enterDocument.call(this, firstTime);

            if (!this.values) {
                this.values = [];
            }
            if (!this.options) {
                this.options = [];
            }

            if (isFinite(this.valuesHeight)) {
                this.valuesContainer.style.height = this.valuesHeight + 'rem';
            }
        }
    },

    prepareForActivationEvents: {
        value: function() {
            this._inputField.delegate = {
                shouldAcceptValue: function() {
                    return true;
                }
            };
            KeyComposer.createKey(this._inputField, "down", "down").addEventListener("keyPress", this);
            KeyComposer.createKey(this._inputField, "up", "up").addEventListener("keyPress", this);
        }
    },

    _shouldAcceptComponent: {
        value: function (draggableComponent) {
            return this.element.contains(draggableComponent.element);
        }
    },

    handleComponentDragOver: {
        value: function (draggableComponent, dragEvent) {
            var pointerPositionX = dragEvent.startPositionX + dragEvent.translateX,
                pointerPositionY = dragEvent.startPositionY + dragEvent.translateY,
                multipleSelectValue = this._findMultipleSelectValueComponentFromPoint(pointerPositionX, pointerPositionY);

            if (multipleSelectValue) {
                if (draggableComponent !== multipleSelectValue && multipleSelectValue !== this._previousOverMultipleSelectValue) {
                    this._clearPreviousOverMultipleSelectValueIfNeeded();
                    this._previousOverMultipleSelectValue = multipleSelectValue;
                    multipleSelectValue.classList.add("dragOver");
                }
            } else if (this._previousOverMultipleSelectValue) {
                this._clearPreviousOverMultipleSelectValueIfNeeded();
            }
        }
    },

    didComponentDrop: {
        value: function (draggableComponent) {
            var draggedObject;

            if (this._previousOverMultipleSelectValue) {
                draggedObject = this.valuesController.content[draggableComponent.index];
                this.valuesController.splice(this._previousOverMultipleSelectValue.index, 0, draggedObject);
                this.valuesController.splice(draggableComponent.index, 1);
            } else {
                this.valuesController.push(this.valuesController.splice(draggableComponent.index, 1)[0]);
            }
        }
    },

    didComponentDragEnd: {
        value: function () {
            this._clearPreviousOverMultipleSelectValueIfNeeded();
        }
    },

    handleClearButtonAction: {
        value: function () {
            this._clearInput();
        }
    },

    _clearPreviousOverMultipleSelectValueIfNeeded: {
        value: function () {
            if (this._previousOverMultipleSelectValue) {
                this._previousOverMultipleSelectValue.classList.remove("dragOver");
                this._previousOverMultipleSelectValue = null;
            }
        }
    },

    _findMultipleSelectValueComponentFromPoint: {
        value: function (pointerPositionX, pointerPositionY) {
            var element = document.elementFromPoint(pointerPositionX, pointerPositionY);
            return element ? this._findMultipleSelectValueComponentFromElement(element) : null;
        }
    },


    _findMultipleSelectValueComponentFromElement: {
        value: function (element) {
            var component = this._findCloserComponentFromElement(element),
                multipleSelectValueComponent;

            while (component && !multipleSelectValueComponent && component !== this) {
                if (component instanceof MultipleSelectValue) {
                    multipleSelectValueComponent = component;
                } else {
                    component = component.parentComponent;
                }
            }

            return multipleSelectValueComponent;
        }
    },

    _findCloserComponentFromElement: {
        value: function _findCloserComponentFromElement (element) {
            var component;

            while (element && !(component = element.component) && element !== this.element) {
                element = element.parentNode;
            }

            return component;
        }
    },

    _blurInputField: {
        value: function () {
            this._inputField.blur();
        }
    },

    handleInputAction: {
        value: function (event) {
            if (this._inputField.value) {
                if (this._addValueToContent(this._inputField.value)) {
                    this._blurInputField();
                    this._clearInput();
                }
            } else {
                this._addOption(this._selectedOption);
                this._blurInputField();
            }
        }
    },

    handleDownKeyPress: {
        value: function(event) {
            switch (event.target.component) {
                case this._inputField:
                    if (this.options && this.options.length > 0) {
                        this._navigateInOptions(1)
                    }
                    break;
            }
        }
    },

    handleUpKeyPress: {
        value: function(event) {
            switch (event.target.component) {
                case this._inputField:
                    if (this.options && this.options.length > 0) {
                        this._navigateInOptions(-1);
                    }
                    break;
            }
        }
    },

    _selectOption: {
        value: function (option) {
            if (!this._typedValue) {
                this._typedValue = this._inputField.value;
            }
            this.optionsController.select(option);
            this._inputField.value = this.optionsController.selection[0].label;
            this._selectedOption = option;
        }
    },

    _stopScrollingOptions: {
        value: function () {
            this.optionsController.clearSelection();
            this._selectedOption = null;
            this._inputField.value = this._typedValue;
            this._typedValue = null;
        }
    },

    _navigateInOptions: {
        value: function(distance) {
            var currentIndex = this.optionsController.organizedContent.indexOf(this.optionsController.selection[0]),
                newIndex = currentIndex + distance,
                contentLength = this.optionsController.organizedContent.length;
            if (newIndex < -1) {
                newIndex = contentLength -1;
            }
            if (newIndex == -1 || newIndex == contentLength) {
                this._inputField.value = this._typedValue;
                this._stopScrollingOptions();
            } else {
                this._selectOption(this.optionsController.organizedContent[newIndex % contentLength]);
            }
        }
    },

    _clearInput: {
        value: function() {
            this._typedValue = null;
            this._inputField.value = null;
        }
    },

    _addValueToContent: {
        value: function(value, isFromOptions) {
            var shouldMultipleSelectAcceptValue = this.callDelegateMethod("shouldMultipleSelectAcceptValue", this, value),
                isValid = typeof shouldMultipleSelectAcceptValue === "boolean" ? shouldMultipleSelectAcceptValue : true;

            if (isValid && this.converter) {
                if (!isFromOptions && this.converter.validator && typeof this.converter.validator.validate === 'function') {
                    isValid = this.converter.validator.validate(value);
                }

                if (isValid && !isFromOptions && typeof this.converter.revert === 'function') {
                    value = this.converter.revert(value);
                }
            }

            if (isValid && value !== null && value !== void 0) {
                this.invalidValue = null;

                if (this.values.indexOf(value) === -1) {
                    this.values.unshift(value);
                    this._inputField.focus();
                }

            } else {
                this.invalidValue = value;
            }

            return isValid;
        }
    },

    handleAddButtonAction: {
        value: function (event) {
            if (this.controller && typeof this.controller.handleMultipleSelectAddAction === "function") {
                this.controller.handleMultipleSelectAddAction(this, this._inputField.value);
            } else if (this._inputField.value) {
                if (this._addValueToContent(this._inputField.value)) {
                    this._blurInputField();
                    this._clearInput();
                }
            }
        }
    },

    handleDeleteButtonAction: {
        value: function (event) {
            var element = event.target ? event.target.element : null;

            if (element) {
                var multipleSelectComponent = this._findMultipleSelectValueComponentFromElement(element);

                if (multipleSelectComponent) {
                    if (this.controller && typeof this.controller.handleMultipleSelectDeleteAction === "function") {
                        this.controller.handleMultipleSelectDeleteAction(this, multipleSelectComponent, multipleSelectComponent.object);
                    } else {
                        this.valuesController.delete(multipleSelectComponent.object);
                    }
                }
            }
        }
    }
});
