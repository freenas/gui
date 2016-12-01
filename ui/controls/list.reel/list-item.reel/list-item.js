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
            var self = this,
                promise;
            this.isCollection = Array.isArray(this.object);

            if (this.objectType) {
                this.object._objectType = this.objectType.typeName || this.objectType;
            }

            promise = this.application.modelDescriptorService.getUiDescriptorForObject(this.object);

            if (promise) {
                return promise.then(function(uiDescriptor) {
                    self.userInterfaceDescriptor = uiDescriptor;
                });
            }
        }
    }
}, {
    CAN_DRAW_FIELD: {
        value: 'userInterfaceDescriptorLoaded'
    }
});
