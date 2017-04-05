var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    _ = require("lodash");

exports.CryptoCertificate = AbstractInspector.specialize({
    enterDocument: {
        value: function () {
            this.super();
            if (!this.object._action && !this.object._isNew) {
                this.object._action = this._sectionService.CREATION;
            }
        }
    },

    save: {
        value: function () {
            if (_.isFunction(this.certificateComponent.save)) {
                this.certificateComponent.save();
            }
            return this._sectionService.saveCertificate(this.object);
        }
    },

    handleExportAction: {
        value: function () {
            var fileName = this.object.name + ".tar.gz";
            this.application.systemService.getCertificateFileAddress(this.object.id, fileName).then(function (certificateObject) {
                var downloadLink = document.createElement("a");
                    downloadLink.href = certificateObject.link;
                    downloadLink.download = fileName;
                    downloadLink.dispatchEvent(new MouseEvent('click'));
            })
        }
    }
});
