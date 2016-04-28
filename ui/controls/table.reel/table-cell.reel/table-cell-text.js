var Text = require("montage/ui/text.reel").Text;

exports.TableCellText = Text.specialize({

    constructor: {
        value: function () {
            this.defineBinding("value", {
                "<-": "object.path(context.expression)"
            });
        }
    }
});
