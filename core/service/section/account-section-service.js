var AbstractSectionService = require("core/service/section/abstract-section-service").AbstractSectionService,
    AccountRepository = require("core/repository/account-repository").AccountRepository;

exports.AccountSectionService = AbstractSectionService.specialize({

    init: {
        value: function (accountRepository) {
            this._accountRepository = accountRepository || AccountRepository.instance;
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

    listKerberosRealms: {
        value: function () {
            return this._accountRepository.listKerberosRealms();
        }
    },

    saveKerberosRealm: {
        value: function (object) {
            return this._accountRepository.saveKerberosRealm(object);
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
