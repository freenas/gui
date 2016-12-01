var Component = require("montage/ui/component").Component,
    TranslateComposer = require("montage/composer/translate-composer").TranslateComposer;

/**
 * @class Topologizer
 * @extends Component
 */
exports.Topologizer = Component.specialize({

    priorities: {
        value: []
    },

    _barycentricValues: {
        value: []
    },

    _profile: {
        value: null
    },

    profile: {
        get: function() {
            return this._profile
        },
        set: function(profile) {
            if (this._profile != profile) {
                this._profile = profile;
                this._setProfile();
            }
        }
    },

    _barycentricRoundedValues: {
        value: null
    },

    barycentricValues: {
        get: function() {
            if (!this._barycentricRoundedValues) {
                this._barycentricRoundedValues = [];

                for (var i = 0, length = this._barycentricValues.length; i < length; i++) {
                    this._barycentricRoundedValues.push(Math.round(this._barycentricValues[i] * 10));
                }
            }

            return this._barycentricRoundedValues;
        },
        set: function (barycentricValues) {
            if (this._barycentricValues !== barycentricValues) {
                this._barycentricValues = barycentricValues;
                this._barycentricRoundedValues = null;
            }
        }
    },

    __translateComposer: {
        value: null
    },

    _translateComposer: {
        get: function () {
            if (!this.__translateComposer) {
                this.__translateComposer = new TranslateComposer();
                this.__translateComposer.hasMomentum = false;
                this.addComposerForElement(this.__translateComposer, this.triangleElement);
            }

            return this.__translateComposer;
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            if (isFirstTime) {

                if (!this.constructor.cssTransform) {// check for transform support
                    if("webkitTransform" in this._element.style) {
                        this.constructor.cssTransform = "webkitTransform";
                    } else if("MozTransform" in this._element.style) {
                        this.constructor.cssTransform = "MozTransform";
                    } else if("oTransform" in this._element.style) {
                        this.constructor.cssTransform= "oTransform";
                    } else {
                        this.constructor.cssTransform = "transform";
                    }
                }
            }
            this.profile = "";
        }
    },

    prepareForActivationEvents: {
        value: function () {
            this._translateComposer.addEventListener("translateStart", this, false);
        }
    },

    reset: {
        value:function() {
            this.handlePosition = {
                x: 55,
                y: 47.5
            };
            this.barycentricValues = [];
            this._positionHandle();
        }
    },

    _computeBarycentricValues: {
        value: function (x, y) {
            if (this._width && this._height) {
                this.barycentricValues = [
                    1 - ((x * Math.sin(Math.PI / 3) - (y - this._height) * Math.cos(Math.PI / 3)) / this._height),
                    1 - (y / this._height),
                    1- (((this._width - x) * Math.sin(Math.PI / 3) - (y - this._height) * Math.cos(Math.PI / 3)) / this._height)
                ];
            } else {
                this.barycentricValues = [1/3, 1/3, 1/3];
            }
        }
    },

    _handlePosition: {
        value: null
    },

    _valuesInRange: {
        value: function (barycentricValues) {
            barycentricValues = barycentricValues || this._barycentricValues;
            return (barycentricValues[0] >= 0 &&
                    barycentricValues[0] <= 1 &&
                    barycentricValues[1] >= 0 &&
                    barycentricValues[1] <= 1 &&
                    barycentricValues[2] >= 0 &&
                    barycentricValues[2] <= 1);
        }
    },

    handlePosition: {
        get: function () {
            return this._handlePosition;
        },
        set: function (value) {
            var x, y, best;

            if (value) {
                this._computeBarycentricValues(value.x, value.y);
                if (this._valuesInRange()) {
                    this._handlePosition = value;
                } else {
                    best = {x: 0, distance: Infinity};
                    y = value.y;
                    if (y < 1) {
                        y = 1;
                    }

                    if (y >= this._height) {
                        y = this._height - 1;
                    }

                    // TODO: This should be optimised by line/line intersection
                    for (x = 0; x < this._width; x++) {
                        if (this._valuesInRange(this._computeBarycentricValues(x, y))) {
                            var squaredDistance = (x - value.x) * (x - value.x);
                            if (squaredDistance < best.distance) {
                                best.distance = squaredDistance;
                                best.x = x;
                            }
                        }
                    }
                    this._handlePosition = {x: best.x, y: y};
                    this._computeBarycentricValues(
                        this._handlePosition.x,
                        this._handlePosition.y
                    );
                }
                this.application.preventAnimation = true;

            } else {
                this.barycentricValues = [1/3, 1/3, 1/3];
            }
        }
    },

    handleTranslateStart: {
        value: function () {
            var startPosition = this._translateComposer.pointerStartEventPosition,
                triangleElementBoundingRect = this.triangleElement.getBoundingClientRect();

            this._targePosition = {
                x: startPosition.pageX - triangleElementBoundingRect.left,
                y: startPosition.pageY - triangleElementBoundingRect.top
            };

            this._translateComposer.translateX = this._targePosition.x;
            this._translateComposer.translateY = this._targePosition.y;

            this._translateComposer.addEventListener("translate", this, false);
            this._translateComposer.addEventListener("translateEnd", this, false);

            this.controller.clearReservedDisks(true);
            this.profile = "";
            this.needsDraw = true;

        }
    },

    handleTranslate: {
        value: function (event) {
            this._targePosition.x = event.translateX;
            this._targePosition.y = event.translateY;

            this._isMoving = true;
            this.needsDraw = true;
        }
    },

    handleTranslateEnd: {
        value: function (event) {
            this._isMoving = false;

            this.needsDraw = true;

            this._translateComposer.removeEventListener("translate", this, false);
            this._translateComposer.removeEventListener("translateEnd", this, false);
        }
    },

    willDraw: {
        value: function () {
            if (!this._isMoving) {
                this._width = this.triangleElement.clientWidth;
                this._height = this.triangleElement.clientHeight;
            }
        }
    },

    draw: {
        value: function () {
            if (this._targePosition) {
                if (this._isMoving || this.profileHasChanged) {
                    //fixme: @joshua hacky
                    if (!this.handleElement.style.left) {
                        this.handleElement.style.left = "0px";
                        this.handleElement.style.top = "0px";
                    }

                    this.profileHasChanged = false;
                    this.handlePosition = this._targePosition;
                    this._positionHandle();
                }
                if (!this._isMoving) {
                    var previousBarycentricValues = this._previousBarycentricValues,
                        barycentricValues = this.barycentricValues;

                    if (!previousBarycentricValues ||
                        !this._areBarycentricValuesEqual(previousBarycentricValues, barycentricValues)) {
                            var self = this;
                            this.lockDisks = true;
                            self.priorities = this.controller.generateTopology(
                                this.topology,
                                this.disks,
                                barycentricValues[0],
                                barycentricValues[1],
                                barycentricValues[2]
                            );
                        }

                    this._previousBarycentricValues = barycentricValues;
                }

            }
        }
    },

    _areBarycentricValuesEqual: {
        value: function (a, b) {
            if (a === b) return true;
            if ((!a || !b) || (a.length !== b.length )) return false;

            for (var i = 0, length = a.length; i < length; i++) {
                if (a[i] !== b[i]) return false;
            }

            return true;
        }
    },

    didDraw: {
        value: function () {
            this.application.preventAnimation = false;
        }
    },

    _positionHandle: {
        value: function() {
            this.handleElement.style[this.constructor.cssTransform] = "translate3d(" + this._handlePosition.x + "px," + this._handlePosition.y + "px,0)";
        }
    },

    _setProfile: {
        value: function() {
            switch (this._profile) {
                case 'MEDIA':
                    this._targePosition = {
                        x: 110,
                        y: 95
                    };
                    break;
                case 'VIRTUALIZATION':
                    this._targePosition = {
                        x: 55,
                        y: 0
                    };
                    break;
                case 'BACKUP':
                    this._targePosition = {
                        x: 0,
                        y: 95
                    };
                    break;
                case 'OPTIMAL':
                    this._targePosition = {
                        x: 55,
                        y: 62.5
                    };
                    break;
            }

            this.profileHasChanged = true;
            this.needsDraw = true;
        }
    }
});
