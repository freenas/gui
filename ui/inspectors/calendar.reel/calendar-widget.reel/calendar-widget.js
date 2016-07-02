var Component = require("montage/ui/component").Component;

exports.CalendarWidget = Component.specialize({
    _currentWidget: {
        value: null
    },

    _currentView: {
        value: null
    },

    currentView: {
        get: function() {
            return this._currentView;
        },
        set: function(currentView) {
            if (this._currentView !== currentView) {
                this._currentView = currentView;
                this._currentWidget = this.widgets[currentView];
            }
        }
    },

    enterDocument: {
        value: function() {
            this.currentView = "month";
        }
    },

    handlePreviousAction: {
        value: function () {
            if (this._currentWidget && typeof this._currentWidget.gotoPrevious == "function") {
                this._currentWidget.gotoPrevious();
            }
        }
    },

    handleTodayAction: {
        value: function () {
            if (this._currentWidget && typeof this._currentWidget.gotoToday == "function") {
                this._currentWidget.gotoToday();
            }
        }
    },

    handleNextAction: {
        value: function () {
            if (this._currentWidget && typeof this._currentWidget.gotoNext == "function") {
                this._currentWidget.gotoNext();
            }
        }
    }

});
