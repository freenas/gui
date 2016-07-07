var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.Docker = AbstractModel.specialize({
    _image: {
        value: null
    },
    image: {
        set: function (value) {
            if (this._image !== value) {
                this._image = value;
            }
        },
        get: function () {
            return this._image;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "image",
            valueType: "String"
        }]
    }
});
