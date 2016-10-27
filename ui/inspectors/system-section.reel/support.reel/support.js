/**
 * @module ui/support.reel
 */
var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model,
    SupportService = require("core/service/support-service").SupportService;

/**
 * @class Support
 * @extends Component
 */
exports.Support = Component.specialize(/** @lends Support# */ {
  
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
            var self = this;
            if (!self.object) {
                this._supportService.getSupportTicket().then(function(supportTicket) {
                    self.object = supportTicket;
                    self.object.type = "bug";
                });
            }
        }
    },

    typeOptions: {
        value: null
    },

    templateDidLoad: {
        value: function() {
            var self = this;
            this._supportService = SupportService.instance;
            this._supportService.listCategories().then(function(categories) {
                self.categoryOptions = Object.keys(categories).map(function(x) {
                    return {label: x, value: categories[x]};
                });
            });
            this.typeOptions = this._supportService.supportTicketTypes;
        }
    }
});
