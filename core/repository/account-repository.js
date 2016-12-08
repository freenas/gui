var AbstractRepository = require("core/repository/abstract-repository").AbstractRepository,
    KerberosKeytabDao = require("core/dao/kerberos-keytab-dao").KerberosKeytabDao,
    KerberosRealmDao = require("core/dao/kerberos-realm-dao").KerberosRealmDao,
    NtpServerDao = require("core/dao/ntp-server-dao").NtpServerDao,
    DirectoryDao = require("core/dao/directory-dao").DirectoryDao,
    KerberosRealmDao = require("core/dao/kerberos-realm-dao").KerberosRealmDao;


var DIRECTORY_TYPES_LABELS = {
        winbind: "Active Directory",
        freeipa: "FreeIPA",
        ldap: "LDAP",
        nis: "NIS"
    };


exports.AccountRepository = AbstractRepository.specialize({
    init: {
        value: function(kerberosRealmDao, kerberosKeytabDao, directoryDao, ntpServerDao) {
            this._kerberosRealmDao = kerberosRealmDao || KerberosRealmDao.instance;
            this._kerberosKeytabDao = kerberosKeytabDao || KerberosKeytabDao.instance;
            this._ntpServerDao = ntpServerDao || NtpServerDao.instance;
            this._directoryDao = directoryDao || DirectoryDao.instance;
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

    getNewDirectoryForType: {
        value: function (type) {
            return this._directoryDao.getNewInstance().then(function (directory) {
                directory.type = type;
                directory.parameters = {"%type": type + "-directory-params"};
                directory.label = DIRECTORY_TYPES_LABELS[type];

                return directory;
            });
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
