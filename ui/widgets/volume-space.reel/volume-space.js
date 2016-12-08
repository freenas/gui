var Component = require("montage/ui/component").Component,
    DashboardSectionService = require("core/service/section/dashboard-section-service").DashboardSectionService,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService;

exports.VolumeSpace = Component.specialize({

    datasets: {
        value: null
    },

    _handleVolumeDatasetUpdate: {
        value: function() {
            // this is where one would convert the volume dataset's object
            // into json which is favored by d3 and friends
            // PS: I do not like that I have to do this myself (i.e the conversion to json)
        }
    },

    templateDidLoad: {
        value: function () {
            var self = this;
            this._eventDispatcherService = EventDispatcherService.getInstance();
            this._eventDispatcherService.addEventListener(
                "volumeDatasetUpdated",
                this._handleVolumeDatasetUpdate.bind(this)
            );
            DashboardSectionService.instance.then(function(sectionService) {
                self._sectionService = sectionService;
            });
        }
    },

    enterDocument: {
        value: function () {
            if (!this.datasets) {
                this.datasets = this._sectionService.loadDatasets();
                // call the function below to make the initial json representation of
                // the volume datasets obj
                this._handleVolumeDatasetUpdate();
            }
        }
    }

});
