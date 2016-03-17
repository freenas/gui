var Component = require("montage/ui/component").Component;

/**
 * @class InterfaceOverview
 * @extends Component
 */
exports.InterfaceOverview = Component.specialize(/** @lends InterfaceOverview# */ {

    _object: {
        value: null
    },


    object: {
        set: function (object) {
            if (object !== this._object) {
                this._object = object;

                if (object) {
                    var self = this;

                    this.isCollection = Array.isArray(object);

                    this.application.delegate.userInterfaceDescriptorForObject(object).then(function (userInterfaceDescriptor) {
                        self.userInterfaceDescriptor = userInterfaceDescriptor;
                    });
                }
            }
        },
        get: function () {
            return this._object;
        }
    }


});
