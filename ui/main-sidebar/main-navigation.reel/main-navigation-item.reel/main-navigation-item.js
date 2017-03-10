var Button = require("montage/ui/button.reel").Button,
    RoutingService = require("core/service/routing-service").RoutingService,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService,
    Events = require('core/Events').Events,
    _ = require("lodash");

exports.MainNavigationItem = Button.specialize({
    hasTemplate: {
        value: true
    },

    templateDidLoad: {
        value: function() {
            this.routingService = RoutingService.getInstance();
            this.eventDispatcherService = EventDispatcherService.getInstance();
        }
    },

    enterDocument: {
        value: function() {
            this.path = '/' + this.object.id;
            this.classList.add('MainNavigationItem-' + this.object.id);
            this.icon.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', "#i-" + this.object.icon);
            this.eventDispatcherService.addEventListener(Events.hashChange, this.handleHashChange.bind(this));
            this.eventDispatcherService.addEventListener(Events.userLoggedIn, this.handleUserLoggedIn.bind(this));
        }
    },

    handlePress: {
        value: function() {
            if(this.isSelected) {
                this.routingService.navigate(this.path, true);
            } else {
                this.routingService.navigate(this.path);
            }
        }
    },

    handleHashChange: {
        value: function(newHash) {
            this.isSelected = _.startsWith(newHash, this.path);
        }
    },

    handleUserLoggedIn: {
        value: function() {
            this.isSelected = this.path === '/dashboard';
        }
    }
});
