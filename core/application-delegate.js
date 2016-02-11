/*global require, exports, Error*/
var Montage = require("montage").Montage;

require("./extras/string");

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
            //todo
        }
    }


});
