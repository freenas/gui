var Component = require("montage/ui/component").Component;

exports.User = Component.specialize({

     templateDidLoad: {
        value: function () {
            this._sectionService = this.context.sectionService;
        }
    },

    enterDocument: {
        value: function (isFirstTime) {
            if (this.object._isNew) {
                if (this._usersTable.values) {
                    this._usersTable.values.clear();
                }
                // this object won't be saved,
                // only the object in object.__users.
                this.object._isNew = false;
            }
        }
    }

});
