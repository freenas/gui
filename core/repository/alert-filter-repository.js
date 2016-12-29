var AbstractRepository = require("core/repository/abstract-repository").AbstractRepository,
    AlertFilterDao = require("core/dao/alert-filter-dao").AlertFilterDao,
    MailDao = require("core/dao/mail-dao").MailDao;

exports.AlertFilterRepository = AbstractRepository.specialize(/** @lends AlertRepository# */ {
    init: {
        value : function() {
            this._alertFilterDao = new AlertFilterDao();
            this._mailDao = new MailDao();
        }
    },

    getNewAlertFilter: {
        value: function() {
            return this._alertFilterDao.getNewInstance();
        }
    },

    listAlertFilters: {
        value: function () {
            return this._alertFilterDao.list();
        }
    },

    getMail: {
        value: function () {
            return this._mailDao.get();
        }
    }


});
