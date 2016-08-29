/**
 * @requires montage/core/converter/converter
 */
var Validator = require("montage/core/converter/converter").Validator;

exports.DockerContainerEnvValidator = Validator.specialize({

    errorMessage: {
        value: null
    },

    _regexEnvironmentVariable: {
        value: /^(:?\w+=\w+;)*(:?\w+=\w+;?)?$/
    },

    _isValidEnvironmentVariableString: {
        value: function (string) {
            return typeof string === "string" && this._regexEnvironmentVariable.test(string);
        }
    },

    validate: {
        value: function (value) {
            if (!this._isValidEnvironmentVariableString(value)) {
                throw new Error(this.errorMessage);
            }
        }
    }

});
