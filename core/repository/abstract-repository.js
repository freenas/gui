var Montage = require("montage/core/core").Montage;

exports.AbstractRepository = Montage.specialize({
    _instance: {
        value: null
    },

    init: {
        value: function() {
        }
    }
}, {
    instance: {
        get: function() {
            if (!this._instance) {
                this._instance = new this();
                this._instance.init();
             }
            return this._instance;
         }
    }
});
