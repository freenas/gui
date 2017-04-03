var Component = require("montage/ui/component").Component,
    TranslateComposer = require("montage/composer/translate-composer").TranslateComposer;

exports.Scrollbar = Component.specialize({

    _type: {
        value: "vertical"
    },

    type: {
        get: function () {
            return this._type;
        },
        set: function (value) {
            value = value === "horizontal" ? "horizontal" : "vertical";

            if (this._type !== value) {
                this._translateComposer.axis = this._type = value;
                this.needsDraw = true;
            }
        }
    },

    _animationTimeout: {
        value: null
    },

    _length: {
        value: 1
    },

    length: {
        get: function () {
            return this._length;
        },
        set: function (value) {
            if (this._length !== value) {
                this._length = value;
                this.needsDraw = true;
            }
        }
    },

    _drag: {
        value: 0
    },

    drag: {
        get: function () {
            return this._drag;
        },
        set: function (value) {
            if (this._type === "horizontal") {
                this._drag = this.dragX = value;

            } else if (this._type === "vertical") {
                this._drag = this.dragY = value;
            }
        }
    },

    _dragX: {
        value: 0
    },

    dragX: {
        get: function () {
            return this._dragX;
        },
        set: function (value) {
            if (this.isRounding) {
                value = Math.round(value);
            }

            if (this._dragX !== value) {
                if (value < this.minDragX) {
                    value = this.minDragX;
                } else if (value > this.maxDragX) {
                    value = this.maxDragX;
                }

                this._dragX = value;

                if (this._isOwnUpdate) {//changes that has occurred by its own translateComposer
                    //need to dispatch changes for the scrollView
                    this.drag = this._dragX;
                    this._isOwnUpdate = false;
                } else {
                    this._translateComposer.translateX = this._dragX / this.dragYMultiplier;
                }

                this.needsDraw = true;
            }
        }
    },

    _dragY: {
        value: 0
    },

    dragY: {
        get: function () {
            return this._dragY;
        },
        set: function (value) {
            if (this.isRounding) {
                value = Math.round(value);
            }

            if (this._dragY !== value) {
                if (value < this.minDragY) {
                    value = this.minDragY;
                } else if (value > this.maxDragY) {
                    value = this.maxDragY;
                }

                this._dragY = value;

                if (this._isOwnUpdate) {//changes that has occurred by its own translateComposer
                    //need to dispatch changes for the scrollView
                    this.drag = this._dragY;
                    this._isOwnUpdate = false;
                } else {
                    this._translateComposer.translateY = this._dragY / this.dragYMultiplier;
                }

                this.needsDraw = true;
            }
        }
    },

    dragYMultiplier: {
        value: 1
    },

    dragXMultiplier: {
        value: 1
    },

    _minDragX: {
        value: 0
    },

    minDragX: {
        get: function () {
            return this._minDragX;
        },
        set: function (value) {
            if (this._minDragX !== value) {
                this._minDragX = value;
                this._translateComposer.minTranslateX = this._minDragX/this.dragXMultiplier;
            }
        }
    },

    _maxDragX: {
        value: 0
    },

    maxDragX: {
        get: function () {
            return this._maxDragX;
        },
        set: function (value) {
            if (this._maxDragX !== value) {
                this._maxDragX = value;
                this._translateComposer.maxTranslateX = this._maxDragX/this.dragXMultiplier;
            }
        }
    },

    _minDragY: {
        value: 0
    },

    minDragY: {
        get: function () {
            return this._minDragY;
        },
        set: function (value) {
            this._minDragY = value;
            this._translateComposer.minTranslateY = this._minDragY/this.dragYMultiplier;
        }
    },

    _maxDragY: {
        value: 0
    },

    maxDragY: {
        get: function () {
            return this._maxDragY;
        },
        set: function (value) {
            this._maxDragY = value;
            this._translateComposer.maxTranslateY = this._maxDragY/this.dragYMultiplier;
        }
    },

    isRounding: {
        value: true
    },

    __translateComposer: {
        value: null
    },


    _translateComposer: {
        get: function () {
            if (!this.__translateComposer) {
                this.__translateComposer = new TranslateComposer();
                this.__translateComposer.hasMomentum = false;
                this.__translateComposer.axis = this.type;
                this.__translateComposer.minTranslateX = this._minDragX;
                this.__translateComposer.minTranslateY = this._minDragY;
            }

            return this.__translateComposer;
        }
    },


    _handleLength: {
        value: 1
    },

    handleLength: {
        get: function () {
            return this._handleLength;
        },
        set: function (value) {
            var self = this;

            if (this._handleLength !== value) {
                this._handleLength = value;
                this.classList.add("isAnimating");

                if (this._animationTimeout) {
                    clearTimeout(this._animationTimeout);
                }

                this._animationTimeout = setTimeout(function () {
                    self.classList.remove("isAnimating");
                }, 330);
            }
        }
    },

    handleResize: {
        value: function () {
            this.needsDraw = true;
        }
    },

    minHandlePixelSize: {
        value: 16
    },

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime && !this.constructor.transform) {
                if("webkitTransform" in this.element.style) {
                    this.constructor.transform = "webkitTransform";
                } else if("MozTransform" in this.element.style) {
                    this.constructor.transform = "MozTransform";
                } else if("msTransform" in this.element.style) {
                    this.constructor.transform = "msTransform";
                } else if("OTransform" in this.element.style) {
                    this.constructor.transform = "OTransform";
                } else {
                    this.constructor.transform = "transform";
                }
            }

            window.addEventListener("resize", this, false);
            this._addEventListenerIfNeeded();
        }
    },

    prepareForActivationEvents: {
        value: function () {
            this.addComposerForElement(this._translateComposer, this._handleElement);
            this._addEventListener();
        }
    },

    exitDocument: {
        value: function () {
            window.removeEventListener("resize", this, false);
            this._removeEventListenerIfNeeded();
        }
    },

    _enterScrollbar: {
        value: function () {
            this.classList.add("isAnimating");
        }
    },

    _leaveScrollbar: {
        value: function (event) {
            if (event.target === this.element && !this._isDragging) {
                this.classList.remove("isAnimating");
            }
        }
    },

    handleMouseenter: {
        value: function () {
            this._enterScrollbar();
        }
    },

    handlePointerenter: {
        value: function () {
            this.classList.add("isAnimating");
        }
    },

    handlePointerleave: {
        value: function (event) {
            this._leaveScrollbar(event);
        }
    },

    handleMouseleave: {
        value: function (event) {
            this._leaveScrollbar(event);
        }
    },

    handleTranslateStart: {
        value: function () {
            this._isDragging = true;
            this.classList.add("isAnimating");
        }
    },

    handleTranslate: {
        value: function (event) {
            this._isOwnUpdate = true;

            if (this.type === "horizontal") {
                this.dragX = event.translateX * this.dragXMultiplier;
            } else if (this.type === "vertical") {
                this.dragY = event.translateY * this.dragYMultiplier;
            }
        }
    },

    handleTranslateEnd: {
        value: function () {
            this._isDragging = false;
            this.classList.remove("isAnimating");
        }
    },

    _addEventListenerIfNeeded: {
        value: function () {
            if (this.preparedForActivationEvents) {
                this._addEventListener();
            }
        }
    },

    _addEventListener: {
        value: function () {
            this._translateComposer.addEventListener("translateStart", this, false);
            this._translateComposer.addEventListener("translate", this, false);
            this._translateComposer.addEventListener("translateEnd", this, false);

            if (window.PointerEvent) {
                this._element.addEventListener("pointerenter", this, false);
                this._element.addEventListener("pointerleave", this, false);

            } else if (window.MSPointerEvent && window.navigator.msPointerEnabled) {
                this._element.addEventListener("MSPointerEnter", this, false);
                this._element.addEventListener("MSPointerLeave", this, false);

            } else {
                this._element.addEventListener("mouseenter", this, false);
                this._element.addEventListener("mouseleave", this, false);
            }
        }
    },

    _removeEventListenerIfNeeded: {
        value: function () {
            if (this.preparedForActivationEvents) {
                this._translateComposer.removeEventListener("translateStart", this, false);
                this._translateComposer.removeEventListener("translate", this, false);
                this._translateComposer.removeEventListener("translateEnd", this, false);

                if (window.PointerEvent) {
                    this._element.removeEventListener("pointerenter", this, false);
                    this._element.removeEventListener("pointerleave", this, false);

                } else if (window.MSPointerEvent && window.navigator.msPointerEnabled) {
                    this._element.removeEventListener("MSPointerEnter", this, false);
                    this._element.removeEventListener("MSPointerLeave", this, false);

                } else {
                    this._element.removeEventListener("mouseenter", this, false);
                    this._element.removeEventListener("mouseleave", this, false);
                }
            }
        }
    },


    willDraw: {
        value: function () {
            this._width = this._element.offsetWidth;
            this._height = this._element.offsetHeight;

            if (this.type === "horizontal") {
                this.maxDragX = this._length - this._handleLength;
                this.dragXMultiplier = this._length / (this._width - this.minHandlePixelSize);
            } else {
                this.maxDragY = this._length - this._handleLength;
                this.dragYMultiplier = this._length / (this._height - this.minHandlePixelSize);
            }
        }
    },

    draw: {
        value: function () {
            if (this._length <= this._handleLength) {
                this._handleElement.style.opacity = 0;

            } else {
                this._handleElement.style.opacity = 1;

                if (this._type === "horizontal") {
                    var handlePixelWidth = this.minHandlePixelSize +
                        Math.floor((this._width - this.minHandlePixelSize) * this._handleLength / this._length);

                    if (handlePixelWidth > this._width) {
                        handlePixelWidth = this._width;
                    }

                    this._handleElement.style.width = handlePixelWidth + "px";
                    this._handleElement.style[this.constructor.transform] = "translate3d(" + (this._dragX/this.dragXMultiplier) + "px,0,0)";

                } else {
                    var handlePixelHeight = this.minHandlePixelSize +
                        Math.floor((this._height - this.minHandlePixelSize) * this._handleLength / this._length);

                    if (handlePixelHeight > this._height) {
                        handlePixelHeight = this._height;
                    }

                    this._handleElement.style.height = handlePixelHeight + "px";
                    this._handleElement.style[this.constructor.transform] = "translate3d(0," + (this._dragY/this.dragYMultiplier) + "px,0)";
                }
            }
        }
    }

});
