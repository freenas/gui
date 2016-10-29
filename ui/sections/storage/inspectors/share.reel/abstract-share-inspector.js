var Component = require("montage/ui/component").Component;

/**
 * @class Share
 * @extends Component
 */
exports.AbstractShareInspector = Component.specialize({

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
