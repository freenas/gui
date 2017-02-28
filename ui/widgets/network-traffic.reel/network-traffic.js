var Component = require("montage/ui/component").Component,
    NetworkRepository = require('core/repository/network-repository').NetworkRepository;

exports.NetworkTraffic = Component.specialize({
    templateDidLoad: {
        value: function() {
            this.networkRepository = NetworkRepository.getInstance();
        }
    },

    _card: {
        value: null
    },

    card: {
        get: function() {
            return this._card;
        },
        set: function(card) {
            if (this._card !== card) {
                this._card = card;
                this.titleElement.args = { card: card };
            }
        }
    },

    enterDocument: {
        value: function () {
            var self = this;
            this.networkRepository.listNetworkInterfaces().then(function (interfaces) {
                self.interfaces = interfaces;
            });
        }
    },

    transformValue: {
        value: function(value) {
            return value * 8;
        }
    }

});
