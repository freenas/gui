/**
 * @module ui/container-readme.reel
 */
var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;
	marked = require('marked');

/**
 * @class ContainerReadme
 * @extends Component
 */
exports.ContainerReadme = AbstractInspector.specialize({
    enterDocument: {
        value: function (firstTime) {
            if (firstTime) {
                this.addPathChangeListener("context.parentContext.object.image", this, "handleImageChange");
            }

            if (this.object && this.object.text) {
                this.parsedHtml = marked(this.object.text);
            } else {
                this.parsedHtml = marked('# Please select a template');
            }
        }
    },

    handleImageChange: {
        value: function () {
            if (this._inDocument && this.context && this.context.parentContext && this.object &&
                this.context.parentContext.object && this.context.parentContext.object.image &&
                this.context.parentContext.object.image !== this.object.imageName) {
                    var self = this,
                        imageName = this.context.parentContext.object.image;

                    this._sectionService.getReadmeforDockerImage(this.context.parentContext.object.image).then(function (object) {
                        if (imageName === self.context.parentContext.object.image) {
                            self.object.text = object;
                            self.object.imageName = object;
                            self.parsedHtml = marked(self.object.text);
                        }
                    });
            }
        }
    }
});
