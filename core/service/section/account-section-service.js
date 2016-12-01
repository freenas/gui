var AbstractSectionService = require("core/service/section/abstract-section-service").AbstractSectionService,
    UserRepository = require("core/repository/user-repository").UserRepository,
    AccountRepository = require("core/repository/account-repository").AccountRepository;

exports.AccountSectionService = AbstractSectionService.specialize({

    init: {
        value: function (accountRepository, userRepository) {
            this._accountRepository = accountRepository || AccountRepository.instance;
            this._userRepository = userRepository || UserRepository.instance;
        }
    },

    getNewUser: {
        value: function () {
            return this._userRepository.getNewUser();
        }
    },

    getNewKerberosRealm: {
        value: function () {
            return this._accountRepository.getNewKerberosRealm();
        }
    },

    getNewKerberosKeytab: {
        value: function () {
            return this._accountRepository.getNewKerberosKeytab();
        }
    },

    getKerberosRealmEmptyList: {
        value: function () {
            return this._accountRepository.getKerberosRealmEmptyList();
        }
    },

    getKerberosKeytabEmptyList: {
        value: function () {
            return this._accountRepository.getKerberosKeytabEmptyList();
        }
    },

    listKerberosRealms: {
        value: function () {
            return this._accountRepository.listKerberosRealms();
        }
    },

    saveKerberosRealm: {
        value: function (object) {
            return this._accountRepository.saveKerberosRealm(object);
        }
    },

    saveKerberosKeytabWithKeytabStringBase64: {
        value: function (kerberosKeytab, keytabStringBase64) {
            kerberosKeytab.keytab = { "$binary": keytabStringBase64 };
            return this._accountRepository.saveKerberosKeytab(kerberosKeytab);
        }
    },

    listNtpServers: {
        value: function() {
            return this._accountRepository.listNtpServers();
        }
    },

    getNewDirectoryForType: {
        value: function (type) {
            return this._accountRepository.getNewDirectoryForType(type);
        }
    }

},
//TODO: remove when account will have been migrated to the new architecture.
{
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
