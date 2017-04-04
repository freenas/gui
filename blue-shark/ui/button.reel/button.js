var Button = require("montage/ui/button.reel").Button;

/**
 * @class Button
 * @extends Component
 */
var Button = exports.Button = Button.specialize({
    hasTemplate: {
        value: true
    },
    handleKeyPress: {
        value: function (mutableEvent) {
            // when focused action event on spacebar & enter
            // FIXME - property identifier is not set on the mutable event
            if (mutableEvent.identifier === "space" ||
                mutableEvent.identifier === "enter") {
                this.active = false;
                this._dispatchActionEvent();
            }
        }
    }
});


