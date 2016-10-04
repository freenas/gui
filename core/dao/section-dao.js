var AbstractDao = require("core/dao/abstract-dao").AbstractDao,
    Model = require("core/model/model").Model;

exports.SectionDao = AbstractDao.specialize({
    init: {
        value: function() {
            this._model = Model.Section;
        }
    }
});

