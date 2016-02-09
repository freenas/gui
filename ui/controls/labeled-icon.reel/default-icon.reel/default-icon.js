var Component = require("montage/ui/component").Component;

/**
 * @class DefaultIcon
 * @extends Component
 */
exports.DefaultIcon = Component.specialize({

    _needsResize: {
        value: false
    },

    size: {
        get: function () {
            return this._size;
        },
        set: function (value) {
            if (value) {
                this._size = value;
                this._needsResize = true;
                this.needsDraw = true;
            }
        }
    },

    _getInitials: {
        value: function (string) {
            var words = string.toString().trim().split(" ");

            if (words.length) {
                return (words[0].charAt(0) + (
                    words.length > 1 ?
                    words[words.length - 1].charAt(0) :
                    words[0].charAt(words[0].length - 1)
                )).toUpperCase();
            }
            return null;
        }
    },

    _hash: {
        value: function (str) {
            var FNV1_32A_INIT = 0x811c9dc5;
            var hval = FNV1_32A_INIT;
            for ( var i = str.length; i >= 0; i--)
            {
                hval ^= str.charCodeAt(i) * 23;
                hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
            }
            return hval >>> 0;
        }
    },

    _getPastelColor: {
        value: function (string) {
            var seed = this._hash(string.toString()) % 360;

            return "hsl(" + seed + ",32%,57%)";
        }
    },

    draw: {
        value: function () {
            var minSize;

            if (this._needsResize) {
                minSize = Math.min(this.size.width, this.size.height);
                this._element.style.width = minSize + "px";
                this._element.style.height = minSize + "px";
                this._element.style.lineHeight = (minSize * 1.02) + "px";
                this._element.style.fontSize = (minSize * .3) + "px";
                this._needsResize = false;
            }
            console.log("draw");
            this._element.textContent = this._getInitials(this.object.name);
            this._element.style.backgroundColor = this._getPastelColor(this.object.name);
        }
    }

});
