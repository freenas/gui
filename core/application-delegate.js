/*global require, exports, Error*/
require("./extras/string");

var Montage = require("montage").Montage,
    DataService = require("montage-data/logic/service/data-service").DataService,
    FreeNASService = require("core/service/freenas-service").FreeNASService;


exports.ApplicationDelegate = Montage.specialize({


    /**
     * @function
     * @public
     *
     * @description todo
     *
     */
    willFinishLoading: {
        value: function (app) {
            app.dataService = new DataService();

            DataService.mainService.addChildService(new FreeNASService());
        }
    }


});
