var Component = require("montage/ui/component").Component,
    d3 = require("d3");

exports.RadialChart = Component.specialize(/** @lends Chart# */ {
    OPTIONS: {
        value: {
            showLegend: {
                defaultValue: false
            },
            showControls: {
                defaultValue: false
            },
            showTotalInTooltip: {
                defaultValue: false
            },
            useGuideline: {
                  defaultValue: false
            },
            transitionDuration: {
                defaultValue: 0
            },
            showMinMax: {
                defaultValue: false
            }
        }
    },

    _chart: {
        value: null
    },

    data: {
        value: []
    },

    _drawSunburst: {
        value: function() {
            // logic to draw d3 suburst to come here
        }
    },

    enterDocument: {
        value: function() {
            this._drawSunburst();
        }
    }


});
