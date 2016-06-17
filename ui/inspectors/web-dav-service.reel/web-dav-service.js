var Component = require("montage/ui/component").Component;
/**
 * @class WebDavService
 * @extends Component
 */
exports.WebDavService = Component.specialize({

    //document for web-dav sharing:
    //http://doc.freenas.org/9.10/freenas_services.html#webdav
    //


    PROTOCOL_OPTIONS: {
        value: [
            "HTTP",
            "HTTPS"
        ]
    },



    //HTTP Authentication List
    AUTHENTICATIONS: {
        value: [
            "BASIC",
            "DIGEST"
        ]
    }
});
