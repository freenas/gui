/**
 * @module ui/account-category.reel
 */
var Component = require("montage/ui/component").Component,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService;

/**
 * @class AccountCategory
 * @extends Component
 */
exports.AccountCategory = Component.specialize({
    templateDidLoad: {
        value: function() {
            this._eventDispatcherService = EventDispatcherService.getInstance();
            this._eventDispatcherService.addEventListener("userLoaded", this._handleUserLoaded.bind(this))
        }
    },

    _handleUserLoaded: {
        value: function() {
            this.object.dispatchOwnPropertyChange('users', this.object.users);
            this.object.dispatchOwnPropertyChange('groups', this.object.groups);
        }
    }
});
