/**
 * @module core/repository/alert-repository
 */
var AbstractRepository = require("core/repository/abstract-repository").AbstractRepository,
    AlertFilterDao = require("core/dao/alert-filter-dao").AlertFilterDao,
    MailDao = require("core/dao/mail-dao").MailDao;
/**
 * @class AlertRepository
 * @extends AbstractRepository
 */
exports.AlertRepository = AbstractRepository.specialize(/** @lends AlertRepository# */ {
    init: {
        value : function (alertFilterDao, mailDao) {
            this._alertFilterDao = alertFilterDao || AlertFilterDao.instance;
            this._mailDao = mailDao || MailDao.instance;
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
