var AbstractRepository = require("core/repository/abstract-repository").AbstractRepository,
    KerberosKeytabDao = require("core/dao/kerberos-keytab-dao").KerberosKeytabDao,
    KerberosRealmDao = require("core/dao/kerberos-realm-dao").KerberosRealmDao,
    NtpServerDao = require("core/dao/ntp-server-dao").NtpServerDao;

exports.AccountRepository = AbstractRepository.specialize({
    init: {
        value: function(kerberosRealmDao, kerberosKeytabDao, ntpServerDao) {
            this._kerberosRealmDao = kerberosRealmDao || KerberosRealmDao.instance;
            this._kerberosKeytabDao = kerberosKeytabDao || KerberosKeytabDao.instance;
            this._ntpServerDao = ntpServerDao || NtpServerDao.instance;
        }
    },

    getNewKerberosRealm: {
        value: function () {
            return this._kerberosRealmDao.getNewInstance();
        }
    },

    getKerberosRealmEmptyList: {
        value: function () {
            return this._kerberosRealmDao.getEmptyList();
        }
    },

    getKerberosKeytabEmptyList: {
        value: function () {
            return this._kerberosKeytabDao.getEmptyList();
        }
    },

    getNewKerberosKeytab: {
        value: function () {
            return this._kerberosKeytabDao.getNewInstance();
        }
    },

    listKerberosRealms: {
        value: function () {
            return this._kerberosRealmDao.list();
        }
    },

    saveKerberosRealm: {
        value: function (kerberosRealm) {
            return this._kerberosRealmDao.save(kerberosRealm);
        }
    },

    deleteKerberosRealm: {
        value: function (kerberosRealm) {
            return this._kerberosRealmDao.delete(kerberosRealm);
        }
    },

    saveKerberosKeytab: {
        value: function (kerberosKeytab) {
            return this._kerberosKeytabDao.save(kerberosKeytab);
        }
    },

    listNtpServers: {
        value: function (ntpServers) {
            return this._ntpServerDao.list();
        }
    }
});
