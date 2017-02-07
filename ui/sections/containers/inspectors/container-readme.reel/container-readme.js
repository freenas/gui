/**
 * @module ui/container-readme.reel
 */
var Component = require("montage/ui/component").Component,
	marked = require('marked');

/**
 * @class ContainerReadme
 * @extends Component
 */
exports.ContainerReadme = Component.specialize({
    enterDocument: {
        value: function() {
            if (this.object && this.object.text) {
                this.parsedHtml = marked(this.object.text);
            } else {
                this.parsedHtml = marked('# Please select a template');
            }
        }
    }	
});
