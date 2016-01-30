/*global require, exports, Error*/
var Montage = require("montage").Montage,
    FreeNASService = require("./service/freenas-service").FreeNASService;

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
            app.service = FreeNASService.instance;
        }
    }


});
