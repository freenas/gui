var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    _ = require('lodash');

exports.DockerNetwork = AbstractInspector.specialize({

    enterDocument: {
        value: function(isFirstTime) {
            this.super(isFirstTime);
            var parts = _.split(this.object.subnet, '/');
            this.object._subnet = [
                {
                    type: 'INET',
                    address: parts[0],
                    netmask: parts[1] ? _.toNumber(parts[1]) : null
                }
            ];
        }
    },

    save: {
        value: function () {
            if (this.object._subnet && this.object._subnet.length > 0 && this.object._subnet[0].address && this.object._subnet[0].netmask) {
                this.object.subnet = this.object._subnet[0].address + '/' + this.object._subnet[0].netmask;
            } else {
                this.object.subnet = null;
            }
            return this._sectionService.saveDockerNetwork(this.object);
        }
    }

});
