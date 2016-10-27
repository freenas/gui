var Montage = require("montage").Montage,
    Model = require("core/model/model").Model,
    SupportCategoryDao = require("core/dao/support-category-dao").SupportCategoryDao,
    SupportTicketDao = require("core/dao/support-ticket-dao").SupportTicketDao;
    
var SupportService = exports.SupportService = Montage.specialize({
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
		    value: function() {
			      return this._supportCategoryDao.list();
		    }
	  },

    saveSupportTicket: {
        value: function(ticketData) {
            return this._supportTicketDao.save(ticketData);
        }
    },
    
    getSupportTicket: {
        value: function() {
            return this._supportTicketDao.getNewInstance();
        }
    },

    supportTicketTypes: {
        value: ["bug", "feature"]
    }
},
{
	  instance: {
        get: function() {
            if(!this._instance) {
                this._instance = new this();
                this._instance._supportCategoryDao = SupportCategoryDao.instance;
                this._instance._supportTicketDao = SupportTicketDao.instance;
            }
            return this._instance;
        }
	  }
});
