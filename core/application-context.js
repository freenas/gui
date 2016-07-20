var Montage = require("montage").Montage;


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
            var applicationContextTmp;

            try {
                applicationContextTmp = JSON.parse(applicationContextJson);
            } catch (error) {
                throw error;
            }

            var applicationContext = new this();

            if (applicationContextTmp.dashboardContext) {
                applicationContext.dashboardContext._widgets = applicationContextTmp.dashboardContext.widgets;
            }

            if (applicationContextTmp.sideBarContext) {
                applicationContext.sideBarContext._widgets = applicationContextTmp.sideBarContext.widgets;
            }

            return applicationContext;
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
