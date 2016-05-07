var Component = require("montage/ui/component").Component,
    TopologyService = require("core/volumes/topology-service").TopologyService;

/**
 * @class Topologizer
 * @extends Component
 */
exports.Topologizer = Component.specialize({
    _topologyService: {
        value: null
    },

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

    barycentricValues: {
        get: function() {
            return this._barycentricValues.map(function(x) { return Math.round(x * 10)});
        },
        set: function(barycentricValues) {
            if (this._barycentricValues != barycentricValues) {
                this._barycentricValues = barycentricValues;
                this.priorities = this._topologyService.generateTopology(this.topology, this.disks, barycentricValues[0], barycentricValues[1], barycentricValues[2]);
                this.needsDraw = true;
            }
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            if (isFirstTime) {
                this._topologyService = TopologyService.instance;
            }
            this.profile = "";
        }
    },

    prepareForActivationEvents: {
        value: function () {
            this.triangleElement.addEventListener("mousedown", this, false);
        }
    },

    reset: {
        value:function() {
            this.handlePosition = {
                x: 55,
                y: 47.5
            };
            this.barycentricValues = [];
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
                            squaredDistance = (x - value.x) * (x - value.x);
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

    _getTriangleEmentPosition: {
        value: function() {
            var boundingRect = this.triangleElement.getBoundingClientRect();
            return {
                x: boundingRect.left,
                y: boundingRect.top
            };
        }
    },

    handleMousedown: {
        value: function (event) {
            var triangleElementPosition = this._getTriangleEmentPosition();
            this._targePosition = {
                x: event.pageX - triangleElementPosition.x,
                y: event.pageY - triangleElementPosition.y
            };
            this.handlePosition = this._targePosition;
            this._pointerPosition = {
                x: event.pageX,
                y: event.pageY
            };
            document.addEventListener("mousemove", this, false);
            document.addEventListener("mouseup", this, false);
            this.profile = "";
            event.preventDefault();
        }
    },

    handleMousemove: {
        value: function (event) {
            this._targePosition.x += event.pageX - this._pointerPosition.x;
            this._targePosition.y += event.pageY - this._pointerPosition.y;
            this.handlePosition = this._targePosition;
            this._pointerPosition = {
                x: event.pageX,
                y: event.pageY
            };
        }
    },

    handleMouseup: {
        value: function (event) {
            document.removeEventListener("mousemove", this, false);
            document.removeEventListener("mouseup", this, false);
        }
    },

    willDraw: {
        value: function () {
            this._width = this.triangleElement.clientWidth;
            this._height = this.triangleElement.clientHeight;
        }
    },

    draw: {
        value: function () {
            if (this._handlePosition) {
                this.handleElement.style.left = this._handlePosition.x + "px";
                this.handleElement.style.top = this._handlePosition.y + "px";
            }
        }
    },

    didDraw: {
        value: function () {
            this.application.preventAnimation = false;
        }
    },

    _setProfile: {
        value: function() {
            switch (this._profile) {
                case 'MEDIA':
                    this.handlePosition = {
                        x: 110,
                        y: 95
                    };
                    break;
                case 'VIRTUALIZATION':
                    this.handlePosition = {
                        x: 55,
                        y: 0
                    };
                    break;
                case 'BACKUP':
                    this.handlePosition = {
                        x: 0,
                        y: 95
                    };
                    break;
                case 'OPTIMAL':
                    this.handlePosition = {
                        x: 55,
                        y: 62.5
                    };
                    break;
            }
        }
    }

});
