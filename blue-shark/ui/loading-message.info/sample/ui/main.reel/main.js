/**
 * @module ui/main.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Main
 * @extends Component
 */
exports.Main = Component.specialize(/** @lends Main# */ {

    options: {
        value: [
            {
                "value": "none",
                "label": "None"
            },
            {
                "value": "optimal",
                "label": "Optimal"
            },
            {
                "value": "virtualization",
                "label": "Virtualization"
            },
            {
                "value": "backups",
                "label": "Backups"
            },
            {
                "value": "media",
                "label": "Media"
            }
        ]
    }
});
