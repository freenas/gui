var Component = require('montage/ui/component').Component;

exports.IpAliases = Component.specialize({
    tableWillUseNewEntry: {
        value: function() {
            return {
                type: 'INET',
                address: null,
                netmask: null
            };
        }
    }
});
