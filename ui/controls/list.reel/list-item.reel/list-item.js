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
        get: function() {
            return this._object;
        },
        set: function(object) {
            if (this._object !== object) {
                this._object = object;
                if (object) {
                    this._loadUserInterfaceDescriptor();
                }
            }
        }
    },

    enterDocument: {
        value: function() {
            if (this.object) {
                var self = this;
                this._canDrawGate.setField(this.constructor.CAN_DRAW_FIELD, false);
                this._loadUserInterfaceDescriptor().then(function() {
                    self._canDrawGate.setField(self.constructor.CAN_DRAW_FIELD, true);
                });   
            }
        }
    },

    _loadUserInterfaceDescriptor: {
        value: function() {
            var self = this;
            this.isCollection = Array.isArray(this.object);

            var hasType = this.object.Type || this.isCollection && this.object._meta_data;
            if (!hasType && this.objectType) {
                if (this.isCollection) {
                    this.object._meta_data = {
                        collectionModelType: this.objectType
                    };
                } else {
                    this.object.Type = this.objectType;
                }
                hasType = true;
            }
            if (hasType) {
                return this.application.delegate.userInterfaceDescriptorForObject(this.object).then(function (userInterfaceDescriptor) {
                    self.userInterfaceDescriptor = userInterfaceDescriptor;
                });
            }
        }
    }
}, {
    CAN_DRAW_FIELD: {
        value: 'userInterfaceDescriptorLoaded'
    }
});
