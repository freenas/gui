var Montage = require("montage").Montage,
    WidgetService = require("core/service/widget-service").WidgetService;


exports.ApplicationContext = Montage.specialize({

    _sideBarContext: {
        value: null
    },

    sideBarContext: {
        get: function () {
            return this._sideBarContext || (this._sideBarContext = new SideBarContext());
        }
    },

    _dashboardContext: {
        value: null
    },

    dashboardContext: {
        get: function () {
            return this._dashboardContext || (this._dashboardContext = new DashboardContext());
        }
    }

}, {

    FromJSON: {
        value: function (applicationContextJson) {
            var self = this;

            return WidgetService.instance.getAvailableWidgets().then(function (widgets) {
                var applicationContextTmp;

                try {
                    applicationContextTmp = JSON.parse(applicationContextJson);
                } catch (error) {
                    throw error;
                }

                var applicationContext = new self();

                if (applicationContextTmp._dashboardContext && applicationContextTmp._dashboardContext._widgets) {
                    applicationContext.dashboardContext._widgets =
                        self._findWidgetsFromAvailableWidgets(applicationContextTmp._dashboardContext._widgets, widgets);
                }

                if (applicationContextTmp._sideBarContext && applicationContextTmp._sideBarContext._widgets) {
                    applicationContext.sideBarContext._widgets =
                        self._findWidgetsFromAvailableWidgets(applicationContextTmp._sideBarContext._widgets, widgets);
                }

                return applicationContext;
            });
        }
    },

    _findWidgetsFromAvailableWidgets: {
        value: function (rawWidgets, availableWidgets) {
            var widget;

            for (var i = 0, length = rawWidgets.length; i < length; i++) {
                widget = this._findWidgetFromAvailableWidgetsWithTitle(availableWidgets, rawWidgets[i].title);

                if (widget) {
                    rawWidgets.splice(i, 1, widget);
                } else {
                    console.warn("no widget found for: " + rawWidgets[i].title);
                }
            }

            return rawWidgets;
        }
    },

    _findWidgetFromAvailableWidgetsWithTitle: {
        value: function (availableWidgets, title) {
            var mapIterator = availableWidgets.keys(),
                key;

            while ((key = mapIterator.next().value)) {
                if (key === title) {
                    return availableWidgets.get(key);
                }
            }
        }
    }

});


var _commonDescriptors  = {

    _widgets: {
        value: null
    },

    widgets: {
        get: function () {
            return this._widgets || (this._widgets = []);
        }
    }

};


var DashboardContext = Montage.specialize(_commonDescriptors);


var SideBarContext = Montage.specialize(_commonDescriptors);
