var Component = require("montage/ui/component").Component,
    UUID = require("montage/core/uuid"),
    numeral = require('numeral');

exports.FileInput = Component.specialize({

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                this._id = UUID.generate();
                this._fileInput.addEventListener('change', this);
            }

            this._fileInput.value = "";
            this._reset();
        }
    },

    supportedExtensions: {
        value: null
    },

    supportedFileTypes: {
        value: null
    },

    maxFileSize: {
        value: null
    },

    file: {
        value: null
    },

    errorValue: {
        value: null
    },

    errorArgs: {
        value: null
    },

    _getFilenameExtension: {
        value: function (filename) {
            var data = /\.+([a-zA-Z0-9]+)$/.exec(filename);
            return data && data.length === 2 ? data[1] : null;
        }
    },

    _isExtensionValid: {
        value: function (extenstionFilename) {
            var isValid = true,
                supportedExtensions = this.supportedExtensions;

            if (typeof supportedExtensions === "string") {
                isValid = extenstionFilename === supportedExtensions;
            } else if (Array.isArray(supportedExtensions) && supportedExtensions.length) {
                isValid = supportedExtensions.indexOf(extenstionFilename) !== -1;
            }

            return isValid;
        }
    },

    _isFileMimeTypeValid: {
        value: function (mimeType) {
            var isValid = true,
                supportedFileTypes = this.supportedFileTypes;

            if (typeof supportedFileTypes === "string") {
                isValid = mimeType === supportedFileTypes;
            } else if (Array.isArray(supportedFileTypes) && supportedFileTypes.length) {
                isValid = supportedFileTypes.indexOf(mimeType) !== -1;
            }

            return isValid;
        }
    },

    handleChange: {
        value: function () {
            this._reset();
            var file = this._fileInput.files[0];

            if (file) {
                var extension = this._getFilenameExtension(file.name),
                    mimetype = file.type,
                    size = file.size,
                    shouldAcceptFile;

                if ((shouldAcceptFile = this._isExtensionValid(extension)) === false)  {
                    this.errorValue = "Extension not supported: {extension}";
                    this.errorArgs = {extension: extension};
                }

                if (shouldAcceptFile && this.maxFileSize !== void 0 && this.maxFileSize !== null && size > this.maxFileSize) {
                    shouldAcceptFile = false;
                    this.errorValue = "File too big ({actual} > {max})";
                    this.errorArgs = {
                        actual: numeral(size).format('0[.00]b'),
                        max: numeral(this.maxFileSize).format('0[.00]b')
                    };
                }

                if (shouldAcceptFile && (shouldAcceptFile = this._isFileMimeTypeValid(mimetype)) === false)  {
                    this.errorValue = "Wrong type of file: {mimetype}";
                    this.errorArgs = {mimetype: mimetype};
                }

                if (shouldAcceptFile) {
                    this.file = this._fileInput.files[0];
                }
            }
        }
    },

    _reset: {
        value: function () {
            this.file = null;
            this.error = null;
        }
    }

}, {

    TYPES: {
        value: {
            text: "text",
            base64: "base64",
            arrayBuffer: "arrayBuffer"
        }
    }

});
