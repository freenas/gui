var TextField = require("montage/ui/text-field.reel").TextField,
    Translator = require("core/translator").Translator;

exports.TextField = TextField.specialize({

    hasTemplate: {
        value: true
    },

    _placeholder: {
        value: void 0
    },

    placeholder: {
        get: function() {
            return this._placeholder;
        },
        set: function(placeholder) {
            var self = this;
            Translator.translate(placeholder).then(function(translated) {
                self._placeholder = self.element.placeholder = translated;
            });
        }
    },

    value: {
        get: function () {
            return this._value;
        },
        set: function (value, fromInput) {
            if (value !== this._value) {
                var shouldAcceptValue;
                if (!this.delegate ||  (shouldAcceptValue = this.callDelegateMethod("shouldAcceptValue", this, value) ) === undefined ? true : shouldAcceptValue ){
                    if (this.converter) {
                        var convertedValue;
                        try {
                            //Where is the matching convert?
                            convertedValue = this.converter.revert(value);
                            this.error = null;
                            this._value = convertedValue;
                        } catch (e) {
                            // unable to convert - maybe error
                            this._value = value;
                            //FIXME: we don't handle required field.
                            this.error = value !== "" && value !== void 0 && value !== null ? e : null;
                        }
                    } else {
                        this._value = value;
                        this.error = null;
                    }

                    this.callDelegateMethod("didChange", this);
                    this._elementAttributeValues["value"] = value;
                    this.needsDraw = true;
                }
            }
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            this.super(isFirstTime);
            this.element.placeholder = this.placeholder || '';
        }
    },

    handleChange: {
        enumerable: false,
        value: function(event) {
            this.takeValueFromElement();
            this._hasFocus = false;
        }
    },

    handleBlur: {
        enumerable: false,
        value: function (event) {
            this.error = null;
            if (this.isMandatory && (!this.value || this.value.length === 0)) {
                this.error = new Error('Value is mandatory');
            }
            if (!this.error && this.validator && typeof this.validator.validate === "function") {
                try {
                    this.validator.validate(this.value);
                }
                catch (e) {
                    this.error = e;
                }
            }
            this.hasFocus = false;
            this.callDelegateMethod("didEndEditing", this);
        }
    }

});
