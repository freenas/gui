var Text = require("montage/ui/text.reel").Text;
var TableCellText = exports.TableCellText = Text.specialize();

Object.defineProperties(TableCellText.prototype, {

    object: {
        set: function (object) {
            this.value = object;

            if (object === this._value) {
                if (typeof object === "boolean") {
                    if (object) {
                        this.classList.add("TableCell-true");
                        this.classList.remove("TableCell-false");
                    } else {
                        this.classList.remove("TableCell-true");
                        this.classList.add("TableCell-false");
                    }
                } else {
                    this.classList.remove("TableCell-true");
                    this.classList.remove("TableCell-false");
                }
            }
        },
        get: function () {
            return this.value;
        }
    }
});
