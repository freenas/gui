var Montage = require("montage").Montage,
    SupportCategoryDao = require("core/dao/support-category-dao").SupportCategoryDao,
    SupportTicketDao = require("core/dao/support-ticket-dao").SupportTicketDao;

exports.SupportService = Montage.specialize({
    _instance: {
        value: null
    },

    _supportCategoryDao: {
        value: null
    },

    _supportTicketDao: {
        value: null
    },

    listCategories: {
        value: function () {
            return this._supportCategoryDao.get();
        }
    },

    saveSupportTicket: {
        value: function (ticketData) {
            return this._supportTicketDao.save(ticketData).then(function (response) {
                return response.taskPromise;
            });
        }
    },

    getSupportTicket: {
        value: function () {
            return this._supportTicketDao.getNewInstance();
        }
    },

    supportTicketTypes: {
        value: ["bug", "feature"]
    }
},
{
    instance: {
        get: function () {
            if (!this._instance) {
                this._instance = new this();
                this._instance._supportCategoryDao = new SupportCategoryDao();
                this._instance._supportTicketDao = new SupportTicketDao();
            }
            return this._instance;
        }
    }
});
