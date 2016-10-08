/**
 * @module ui/docker-image.reel
 */
var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

/**
 * @class DockerImage
 * @extends Component
 */
exports.DockerImage = AbstractInspector.specialize({

    object: {
        set: function (object) {
            if (this._object !== object) {
                this._object = object;
                this.dispatchOwnPropertyChange("createdAtDate", this.createdAtDate);
            }
        },
        get: function () {
            return this._object;
        }
    },

    createdAtDate: {
        get: function () {
            return this.object ? this.object.created_at["$date"] : null;
        }
    }

});
