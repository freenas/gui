var AbstractSearchAccount = require("ui/abstract/abstract-search-account").AbstractSearchAccount;

exports.AbstractSearchAccountMultiple = AbstractSearchAccount.specialize({

    //Override properties from AbstractSearchAccount
    _value: {
        value: void 0
    },

    value: {
        value: void 0
    },

    _findLabelForValue: {
        value: void 0
    },

    values: {
        value: null
    }

});
