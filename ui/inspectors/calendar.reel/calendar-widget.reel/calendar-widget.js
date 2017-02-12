var Component = require("montage/ui/component").Component;

exports.CalendarWidget = Component.specialize({
    currentWidget: {
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
                this.currentWidget = this.widgets[currentView];
                if (this.object) {
                    this.object.view = currentView;
                }
            }
        }
    },

    enterDocument: {
        value: function() {
            this.currentView = "day";
        }
    },

    handlePreviousAction: {
        value: function () {
            if (this.currentWidget && typeof this.currentWidget.gotoPrevious == "function") {
                this.currentWidget.gotoPrevious();
            }
        }
    },

    handleTodayAction: {
        value: function () {
            if (this.currentWidget && typeof this.currentWidget.gotoToday == "function") {
                this.currentWidget.gotoToday();
            }
        }
    },

    handleNextAction: {
        value: function () {
            if (this.currentWidget && typeof this.currentWidget.gotoNext == "function") {
                this.currentWidget.gotoNext();
            }
        }
    }

});
