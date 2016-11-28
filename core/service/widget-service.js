var Montage = require("montage").Montage,
    Promise = require("montage/core/promise").Promise;


// FIXME: demo purpose
// Need help from the middleware.
var WIDGETS = [
    {
        title: "alerts",
        description: null,
        imgPreview: null,
        moduleId: "ui/widgets/alerts.reel",
        allowMultiple: false
    },
    {
        title: "arc-demand-data",
        description: null,
        imgPreview: null,
        moduleId: "ui/widgets/arc-demand-data.reel",
        allowMultiple: false
    },
    {
        title: "cpu-usage",
        description: null,
        imgPreview: null,
        moduleId: "ui/widgets/cpu-usage.reel",
        allowMultiple: false
    },
    {
        title: "load-average",
        description: null,
        imgPreview: null,
        moduleId: "ui/widgets/load-average.reel",
        allowMultiple: false
    },
    {
        title: "memory-allocation",
        description: null,
        imgPreview: null,
        moduleId: "ui/widgets/memory-allocation.reel",
        allowMultiple: false
    },
    {
        title: "network-traffic",
        description: null,
        imgPreview: null,
        moduleId: "ui/widgets/network-traffic.reel",
        allowMultiple: true
    },
    {
        title: "system-info",
        description: null,
        imgPreview: null,
        moduleId: "ui/widgets/system-info.reel",
        allowMultiple: false
    },
    {
        title: "tasks",
        description: null,
        imgPreview: null,
        moduleId: "ui/widgets/tasks.reel",
        allowMultiple: false
    },
    {
        title: "disk-traffic",
        description: null,
        imgPreview: null,
        moduleId: "ui/widgets/disk-traffic.reel",
        allowMultiple: false
    },
    {
        title: "cpu-temperature",
        description: null,
        imgPreview: null,
        moduleId: "ui/widgets/cpu-temperature.reel",
        allowMultiple: false
    }
];


exports.WidgetService = Montage.specialize({

    _widgetsMap: {
        value: null
    },

    getAvailableWidgets: {
        value: function () {
            var promise;

            if (this._widgetsMap) {
                promise = Promise.resolve(this._widgetsMap);
            } else if (this._getAvailableWidgetsPromise) {
                promise = this._getAvailableWidgetsPromise;
            } else {
                var self = this;

                promise = this._getAvailableWidgetsPromise = new Promise(function (resolve, reject) {
                    //todo: connection with the middleware.
                    var widgets = WIDGETS,
                        widgetsMap = new Map(),
                        widget;

                    for (var i = 0, length = widgets.length; i < length; i++) {
                        widget = widgets[i];

                        widgetsMap.set(widget.moduleId, widget);
                    }

                    self._widgetsMap = widgetsMap;

                    resolve(widgetsMap);
                });
            }

            return promise;
        }
    }

}, {

    instance: {
        get: function() {
            if (!this._instance) {
                this._instance = new this();
            }

            return this._instance;
        }
    }

});
