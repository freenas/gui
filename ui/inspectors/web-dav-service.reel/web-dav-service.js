var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model,
    Converter = require("montage/core/converter/converter").Converter,
    Validator = require("montage/core/converter/converter").Validator;

/**
 * @class WebDavService
 * @extends Component
 */
exports.WebDavService = Component.specialize({

    //document for web-dav sharing:
    //http://doc.freenas.org/9.10/freenas_services.html#webdav
    //


    // PROTOCOL_OPTIONS: {
    //     value: [
    //         "HTTP",
    //         "HTTPS"
    //     ]
    // },



    //HTTP Authentication List
    AUTHENTICATIONS: {
        value: [
            "BASIC",
            "DIGEST"
        ]
    },

    enterDocument: {
        value: function(isFirstTime){
            if(isFirstTime){
                // this is a workaround for Bug #15877
                this.object.protocol = ["HTTP"];
            }
        }
    }
});
