var Component = require("montage/ui/component").Component,
	marked = require('marked');

exports.VirtualMachineReadme = Component.specialize({
	enterDocument: {
		value: function() {
			this.parsedHtml = marked(this.object.text);
		}
	}
});
