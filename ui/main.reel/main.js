
var Component = require("montage/ui/component").Component,
    DataService = require("montage-data/logic/service/data-service").DataService,
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    application = require("montage/core/application").application;

/**
 * @class Main
 * @extends Component
 */
exports.Main = Component.specialize({
    constructor: {
        value: function MainConstructor() {
            //application.delegate = this;
            this.application.dataService = new DataService();
            DataService.mainService.addChildService(new FreeNASService());
            return this;
        }
    },
    dataService: {
        value: null
    },
    enterDocument: {
        value: function() {
            this.application.section = 'dashboard';
            this.application.applicationModal.enterDocument(true);
            // this.element.ownerDocument.body.appendChild(this.application.applicationModal.element);
            // this.application.applicationModal.attachToParentComponent();
        }
    }
});

// FIXME: Selection needs to be managed by a selection controller
