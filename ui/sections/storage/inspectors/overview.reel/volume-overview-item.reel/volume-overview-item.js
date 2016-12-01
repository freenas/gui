var Component = require("montage/ui/component").Component,
    EventDispatcherService = require('core/service/event-dispatcher-service').EventDispatcherService,
    Model = require("core/model/model").Model;

exports.VolumeOverviewItem = Component.specialize(/** @lends VolumeOverviewItem# */ {
    isExpanded: {
        value: false
    },

    userInterfaceDescriptor: {
        value: null
    },

    templateDidLoad: {
        value: function() {
            this._eventDispatcherService = EventDispatcherService.getInstance();
        }
    },

    enterDocument: {
        value: function () {
            var self = this;
            this._eventDispatcherService.addEventListener('volumeChange.' + this.object.id, this._handleVolumeChange.bind(this));

            this.application.delegate.userInterfaceDescriptorForObject(this.object).then(function (userInterfaceDescriptor) {
                self.userInterfaceDescriptor = userInterfaceDescriptor;
            });
        }
    },

    exitDocument: {
        value: function() {
            this._eventDispatcherService.removeEventListener('volumeChange.' + this.object.id, this._handleVolumeChange.bind(this));
        }
    },

    handleToggleAction: {
        value: function () {
            this.isExpanded = !this.isExpanded;
        }
    },

    _handleVolumeChange: {
        value: function(volume) {
            this.object = volume.toJS();
        }
    }

});
