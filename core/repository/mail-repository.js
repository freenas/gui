"use strict";
var mail_dao_1 = require("../dao/mail-dao");
var MailRepository = (function () {
    function MailRepository(mailDao) {
        this.mailDao = mailDao;
    }
    MailRepository.getInstance = function () {
        if (!MailRepository.instance) {
            MailRepository.instance = new MailRepository(mail_dao_1.MailDao.getInstance());
        }
        return MailRepository.instance;
    };
    MailRepository.prototype.getConfig = function () {
        return this.mailDao.get();
    };
    MailRepository.prototype.saveConfig = function (config) {
        return this.mailDao.save(config);
    };
    return MailRepository;
}());
exports.MailRepository = MailRepository;
