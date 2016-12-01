"use strict";
var kerberos_keytab_dao_1 = require("../dao/kerberos-keytab-dao");
var kerberos_realm_dao_1 = require("../dao/kerberos-realm-dao");
var KerberosRepository = (function () {
    function KerberosRepository(kerberosKeytabDao, kerberosRealmDao) {
        this.kerberosKeytabDao = kerberosKeytabDao;
        this.kerberosRealmDao = kerberosRealmDao;
    }
    KerberosRepository.getInstance = function () {
        if (!KerberosRepository.instance) {
            KerberosRepository.instance = new KerberosRepository(kerberos_keytab_dao_1.KerberosKeytabDao.getInstance(), kerberos_realm_dao_1.KerberosRealmDao.getInstance());
        }
        return KerberosRepository.instance;
    };
    KerberosRepository.prototype.getNewKerberosRealm = function () {
        return this.kerberosRealmDao.getNewInstance();
    };
    KerberosRepository.prototype.getKerberosRealmEmptyList = function () {
        return this.kerberosRealmDao.getEmptyList();
    };
    KerberosRepository.prototype.getKerberosKeytabEmptyList = function () {
        return this.kerberosKeytabDao.getEmptyList();
    };
    KerberosRepository.prototype.getNewKerberosKeytab = function () {
        return this.kerberosKeytabDao.getNewInstance();
    };
    KerberosRepository.prototype.listKerberosRealms = function () {
        return this.kerberosRealmDao.list();
    };
    KerberosRepository.prototype.saveKerberosRealm = function (kerberosRealm) {
        return this.kerberosRealmDao.save(kerberosRealm);
    };
    KerberosRepository.prototype.deleteKerberosRealm = function (kerberosRealm) {
        return this.kerberosRealmDao.delete(kerberosRealm);
    };
    KerberosRepository.prototype.saveKerberosKeytab = function (kerberosKeytab) {
        return this.kerberosKeytabDao.save(kerberosKeytab);
    };
    KerberosRepository.prototype.listNtpServers = function () {
        return this.ntpServerDao.list();
    };
    return KerberosRepository;
}());
exports.KerberosRepository = KerberosRepository;
