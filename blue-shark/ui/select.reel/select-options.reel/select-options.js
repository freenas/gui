/**
 * @module ui/select-options.reel
 */
var Overlay = require("montage/ui/overlay.reel").Overlay,
    KeyComposer = require("montage/composer/key-composer").KeyComposer,
    Composer = require("montage/composer/composer").Composer;

/**
 * @class SelectOptions
 * @extends Overlay
 */
var SelectOptions = exports.SelectOptions = Overlay.specialize(/** @lends SelectOptions# */ {

    optionsRepetition: {
        value: null
    },

    _optionsHeight: {
        value: null
    },

    __optionsHeight: {
        get: function () {
            return this._optionsHeight;
        },
        set: function (height) {
            this._optionsHeight = height;
            return this._optionsHeight;
        }
    },

    __optionsMaxHeight: {
        value: null
    },

    _optionsMaxHeight: {
        get: function () {
            return this.__optionsMaxHeight;
        },
        set: function (maxHeight) {
            this.__optionsMaxHeight = maxHeight;
            this.element.style.maxHeight = maxHeight - 16 + "px";
        }
    },

    optionsMaxHeight: {
        get: function () {
            return this._optionsMaxHeight;
        },
        set: function (value) {
            if (this._optionsMaxHeight !== value) {
                this._optionsMaxHeight = value;
                this.needsDraw = true;
            }
        }
    },

    _needsComputeBoundaries: {
        value: false
    },

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                this.addPathChangeListener("selectedValue", this, "handleSelectedValueChange");

                var keyIdentifiers = this.constructor.KEY_IDENTIFIERS;

                this._keyComposerMap = new Map();

                this._keyComposerMap.set(
                    keyIdentifiers.escape,
                    KeyComposer.createKey(this, keyIdentifiers.escape, keyIdentifiers.escape)
                );
            }

            Overlay.prototype.enterDocument.call(this, isFirstTime);
        }
    },

    exitDocument: {
        value: function () {
            Overlay.prototype.exitDocument.call(this);
        }
    },

    show: {
        value: function () {
            if (!this.isShown) {
                this._keyComposerMap.get(this.constructor.KEY_IDENTIFIERS.escape).addEventListener("keyPress", this);
                this.element.ownerDocument.defaultView.addEventListener("wheel", this, true);
                this._saveInitialCenterPosition();
                // remove class each time to calculate position from same spot
                this.classList.remove("is-below-middle");
                this._needsComputeBoundaries = true;

            }

            Overlay.prototype.show.call(this);
        }
    },

    hide: {
        value: function () {
            if (this.isShown) {
                this._keyComposerMap.get(this.constructor.KEY_IDENTIFIERS.escape).removeEventListener("keyPress", this);
                this.element.ownerDocument.defaultView.removeEventListener("wheel", this, true);
            }

            Overlay.prototype.hide.call(this);
        }
    },

    captureWheel: {
        value: function (event) {
            if (!this.element.contains(event.target) && this._isPositionChanged(event)) {
                this.hide();
            }
        }
    },

    _saveInitialCenterPosition: {
        value: function () {
            if (this.anchor instanceof HTMLElement) {
                var boundingClientRect = this.anchor.getBoundingClientRect();

                this._initialCenterPositionX = boundingClientRect.left + (boundingClientRect.width / 2);
                this._initialCenterPositionY = boundingClientRect.top + (boundingClientRect.height / 2);
            }
        }
    },

    _isPositionChanged: {
        value: function (event) {
            // debugger;
            if (this.anchor instanceof HTMLElement) {
                var boundingClientRect = this.anchor.getBoundingClientRect(),
                    newCenterPositionX = boundingClientRect.left + (boundingClientRect.width / 2),
                    newCenterPositionY = boundingClientRect.top + (boundingClientRect.height / 2);

                if (this._initialCenterPositionX !== newCenterPositionX || this._initialCenterPositionY !== newCenterPositionY) {
                    var deltaX = Math.abs(this._initialCenterPositionX - newCenterPositionX),
                        deltaY = Math.abs(this._initialCenterPositionY - newCenterPositionY),
                        radius = 1; // todo implement touchmove + pointermove

                    return Composer.isCoordinateOutsideRadius(deltaX, deltaY, radius);
                }
            }

            return false;
        }
    },

    willDraw: {
        value: function () {
            Overlay.prototype.willDraw.call(this);

            if (this.isShown) {
                var optionsRepetitionBoundingClientRect = this.optionsRepetition.element.getBoundingClientRect();

                this.__optionsHeight = optionsRepetitionBoundingClientRect.height;
                this._anchorRect = this.anchor.getBoundingClientRect();
                this._anchorWidth = this._anchorRect.width;

                if (!this._needsComputeBoundaries) {

                    var documentHeight = this.element.ownerDocument.documentElement.clientHeight;
                    this._optionsMaxHeight = 100;
                    this._optionsMaxHeight = documentHeight - optionsRepetitionBoundingClientRect.top;

                    // check if the options would go outside the viewport
                    // if the bottom of the options is greater than document height
                    if (optionsRepetitionBoundingClientRect.bottom > documentHeight) {

                        // will the options fit above select?
                        if (this._anchorRect.top - this.__optionsHeight < 0) {
                            // is there more room above or below?
                            // check the middle point of the anchor to see if it's above or below the middle of documentHeight
                            if(documentHeight - (this._anchorRect.top - this._anchorRect.height / 2) > (documentHeight / 2)) {
                                // more room below
                                this._optionsMaxHeight = documentHeight - optionsRepetitionBoundingClientRect.top;
                            } else {
                                // more room above
                                this._optionsMaxHeight = this._anchorRect.top;
                                this.classList.add("is-below-middle");
                            }
                        } else {
                            // the options fit
                            this.classList.add("is-below-middle");
                        }

                    }

                }
            }
        }
    },

    //@override super draw overlay method.
    draw: {
        value: function () {
            var overlayElementStyle = this.element.style;

            if (this.isShown) {
                var position = this._drawPosition;

                overlayElementStyle.top = position.top + "px";
                overlayElementStyle.left = position.left + "px";

                // set options minWidth
                overlayElementStyle.minWidth = this._anchorWidth + "px";
                overlayElementStyle.maxWidth = this._anchorWidth > 600 ? this._anchorWidth + "px" : 600 + "px";

                if (this._needsComputeBoundaries) {
                    this._needsComputeBoundaries = false;
                    this.needsDraw = true;
                }
            }
        }
    }

}, {

    STYLE_VISIBILITY: {
        value: {
            hidden: "hidden",
            visible: "visible"
        }
    },

    KEY_IDENTIFIERS: {
        value: {
            escape: "escape"
        }
    }

});


SelectOptions.prototype.handleEscapeKeyPress = SelectOptions.prototype.hide;
SelectOptions.prototype.handleSelectedValueChange = SelectOptions.prototype.hide;
SelectOptions.prototype.handleResize = SelectOptions.prototype.hide;
