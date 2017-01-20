var Button = require("montage/ui/button.reel").Button,
    RoutingService = require("core/service/routing-service").RoutingService,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService,
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
            this.eventDispatcherService.addEventListener('hashChange', this.handleHashChange.bind(this));
        }
    },

    handlePress: {
        value: function() {
            this.routingService.navigate(this.path);
        }
    },

    handleHashChange: {
        value: function(newHash) {
            this.isSelected = _.startsWith(newHash, this.path);
        }
    }
});
