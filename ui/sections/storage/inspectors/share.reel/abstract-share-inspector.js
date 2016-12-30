var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

exports.AbstractShareInspector = AbstractInspector.specialize({

    _object: {
        value: null
    },

    object: {
        set: function (object) {
            if (this._object !== object){
                this._object = object;
                this.properties = object ? object.properties : null;
            }
        },
        get: function () {
            return this._object;
        }
    },

    properties: {
        value: null
    }

});
