var Component = require("montage/ui/component").Component,
    RoutingService = require('core/service/routing-service').RoutingService,
    _ = require('lodash');

exports.TableRowImage = Component.specialize({
    templateDidLoad: {
        value: function() {
            this.routingService = RoutingService.getInstance();
        }
    },

    prepareForActivationEvents: {
        value: function() {
            this.element.addEventListener('click', this._selectImage.bind(this));
        }
    },

    handleReadmeAction: {
        value: function() {
            this._selectImage();
            this.routingService.navigate(this.context.path + '/docker-image/' + encodeURIComponent(this.object.name) + '/readme');
        }
    },

    _selectImage: {
        value: function() {
            _.forEach(this.element.parentElement.parentElement.querySelectorAll('.Table-row'), function(row) {
                row.classList.remove('selected');
            });
            _.forEach(this.parentComponent.content, function(row) {
                row.selected = false;
            });
            this.parentComponent._findIterationContainingElement(this.element).object.selected = true;
            this.element.parentElement.classList.add('selected');
        }
    }
});
