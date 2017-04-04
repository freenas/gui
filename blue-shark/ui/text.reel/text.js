var Component = require("montage/ui/component").Component,
    Translator = require("core/translator").Translator;

exports.Text = Component.specialize({
    hasTemplate: {
        value: false
    },

    result: {
        value: void 0
    },

    _value: {
        value: void 0
    },

    value: {
        get: function() {
            return this._value;
        }, set: function(value) {
            if (this._value !== value) {
                this._value = value;
                this._refreshResult();
            }
        }
    },

    _args: {
        value: void 0
    },

    args: {
        get: function() {
            return this._args;
        }, set: function(args) {
            if (this._args !== args) {
                this._args = args;
                this._refreshResult();
            }
        }
    },

    _refreshResult: {
        value: function() {
            var self = this,
                promise = this.disableTranslation ? Promise.resolve(this._value) : Translator.translate(this._value, this._args);
            promise.then(function(result) {
                self.result = result;
                self.needsDraw = true;
            });
        }
    },

    draw: {
        value: function() {
            this.element.innerHTML = (this.converter ? this.converter.convert(this.result) : this.result) || '';
        }
    }
});

