var Component = require("montage/ui/component").Component;

/**
 * @class ListItem
 * @extends Component
 */
exports.ListItem = Component.specialize({

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
    },


    userInterfaceDescriptor: {
        value: null
    }


});
