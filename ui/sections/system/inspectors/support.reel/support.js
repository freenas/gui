var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Model = require("core/model/model").Model,
    SupportService = require("core/service/support-service").SupportService;

exports.Support = AbstractInspector.specialize({
  
    categoryOptions: {
        value: null
    },

    save: {
        value: function() {
            this.object.id = null; // cheap dirty hack to make save work
            if (!this.object.attachments) {
                this.object.attachments = []; // fixme when attachments are implemented
            }
            return this._supportService.saveSupportTicket(this.object);
        }
    },

    _supportService: {
        value: null
    },

    enterDocument: {
        value: function(isFirstTime) {
//            this.super();
            var self = this;
            if (!this.object) {
                this._supportService.getSupportTicket().then(function(supportTicket) {
                    self.object = supportTicket;
                    self.object._isNew = true;
                    self.object.type = "bug";
                    self.validationController.load(self, self.object);
                });
            }
        }
    },

    typeOptions: {
        value: null
    },

    _inspectorTemplateDidLoad: {
        value: function() {
            var self = this;
            this._supportService = SupportService.instance;
            this.typeOptions = this._supportService.supportTicketTypes;
            return this._supportService.listCategories().then(function(categories) {
                self.categoryOptions = Object.keys(categories).map(function(x) {
                    return {label: x, value: categories[x]};
                });
            });
        }
    }
});
