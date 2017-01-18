var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

exports.NetworkInterface = AbstractInspector.specialize({
    isAddressSourceDhcp: {
        value: null
    },

    dhcpAlias: {
        value: null
    },

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
            }
        }
    },

    _inspectorTemplateDidLoad: {
        value: function() {
            this.interfaces = this._sectionService.entries;
        }
    },

    enterDocument: {
        value: function() {
            this.super();
            this._sectionService.initializeInterface(this.object);
            this.addPathChangeListener('object.dhcp', this, '_handleDhcpChange');
        }
    },

    exitDocument: {
        value: function() {
            this.super();
        }
    },

    _handleDhcpChange: {
        value: function() {
            this._sectionService.handleDhcpChangeOnInterface(this.object);
        }
    },

    save: {
        value: function() {
            return this._sectionService.saveInterface(this.object);
        }
    },

    revert: {
        value: function() {
            var self = this;
            return this.inspector.revert().then(function() {
                self.object.type = self.interfaceType;
            });
        }
    },

    handleAction: {
        value: function () {
            console.log("this probably doesn't work");
        }
    },

    _handleInspectorExit: {
        value: function() {
            var defaults = [['name', '']],
                ignored = ['media', 'vlan'];

            // assuming we don't want to have to make a confirmation modal component for every inspector...
            // how do I send a unique command to the true button for each inspector
            // should I pass an object for the information of the modal
            // when and how should I clear the confirmationModal object

            if (this.hasObjectChanged(defaults, ignored)) {
                var resolve, reject,
                    promise = new Promise(function(_resolve, _reject) {
                        resolve = _resolve;
                        reject = _reject;
                    });
                this.application.confirmationModal = {
                    isShown: true,
                    message: 'Would you like to save your recent changes?',
                    title: 'You have unsaved changes!',
                    falseButtonLabel: 'Undo Changes',
                    trueButtonLabel: 'Save Changes',
                    deferred: {
                        resolve: resolve,
                        reject: reject,
                        promise: promise
                    }
                };
                return promise;
            }
        }
    }
});
