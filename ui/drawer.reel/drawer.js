/**
 * @module ui/drawer.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Drawer
 * @extends Component
 */
exports.Drawer = Component.specialize(/** @lends Drawer# */ {
    items: {
        value: [
            {
                title: "Widget 1",
                imgPreview: "imageUrl",
                description: "this is the description of widget 1"
            },
            {
                title: "Widget 2",
                imgPreview: "imageUrl",
                description: "this is the description of widget 2"
            }
        ]
    }
});
