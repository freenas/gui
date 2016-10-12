/**
 * @requires montage/core/converter/converter
 */
var Validator = require("montage/core/converter/converter").Validator;

exports.DockerContainerEnvVariableValidator = Validator.specialize({

    errorMessage: {
        value: null
    },

    _regexEnvironmentVariable: {
        value: /^[a-zA-Z][a-zA-Z0-9_-]*$/
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

            return true;
        }
    }

});
