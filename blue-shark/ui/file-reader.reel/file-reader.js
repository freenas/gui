var Component = require("montage/ui/component").Component,
    UUID = require("montage/core/uuid");

exports.FileReader = Component.specialize({

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                this._id = UUID.generate();
                this.addPathChangeListener('file', this, '_handleFileChange');
            }

            this._reset();
        }
    },

    status: {
        value: null
    },

    resultType: {
        value: null
    },

    data: {
        value: null
    },

    progress: {
        value: 0
    },

    filename: {
        value: null
    },

    _handleFileChange: {
        value: function (file) {
            this._reset();
            if (file) {
                var reader = new FileReader(),
                    self = this;

                reader.onload = function () {
                    self.data = self.resultType === self.constructor.TYPES.binary ?
                        reader.result.split(',')[1] : reader.result;
                };

                reader.onprogress = function (event) {
                    self.progress = event.lengthComputable ? event.loaded / event.total * 100 : -1;
                    if (self.progress > 0 && self.progress !== 100) {
                        self.status = "active";
                    } else if (self.progress == 100 ) {
                        self.status = "success"
                    } else {
                        self.status = null
                    }
                };

                reader.onerror = function () {
                    self.errorValue = "Error reading file: {error}";
                    self.errorArgs = {error: reader.error};
                    self.status = "error";
                };

                if (this.resultType === this.constructor.TYPES.base64) {
                    reader.readAsDataURL(file);
                } else if (this.resultType === this.constructor.TYPES.arrayBuffer) {
                    reader.readAsArrayBuffer(file);
                } else {
                    reader.readAsText(file);
                }
            }
        }
    },

    _reset: {
        value: function () {
            this.data = null;
            this.status = null;
            this.progress = 0;
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
