/*global require, exports, Error*/
require("./extras/string");

var Montage = require("montage").Montage,
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
            app.dataService = FreeNASService.instance;
        }
    }


});
