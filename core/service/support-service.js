var Montage = require("montage").Montage,
    Model = require("core/model/model").Model,
    NotificationCenterModule = require("core/backend/notification-center"),
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
            var self = this;
            return this._supportTicketDao.save(ticketData).then(function(response) {
                var taskId = response;
                return new Promise(function(resolve, reject) {
                    self._notificationCenter.addEventListener("taskDone", function(event) {
                        if (event.detail && event.detail.jobId === taskId) {
                            if (event.detail.state === 'FINISHED') {
                                resolve();
                            } else if (event.detail.state === 'FAILED') {
                                reject();
                            }
                        }
                    });
                });
            });
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
                this._instance._notificationCenter = NotificationCenterModule.defaultNotificationCenter;
            }
            return this._instance;
        }
	  }
});
