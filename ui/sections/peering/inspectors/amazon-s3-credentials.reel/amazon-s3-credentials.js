/**
 * @module ui/inspectors/amazon-s3-credentials.reel/amazon-s3-credentials.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class AmazonS3Credentials
 * @extends Component
 */
exports.AmazonS3Credentials = Component.specialize(/** @lends AmazonS3Credentials# */ {
    enterDocument: {
        value: function() {
            this.object.credentials = {};
            this.object.credentials['%type'] = this.object.type + '-credentials';
        }
    },

    exitDocument: {
        value: function() {
            this.object.credentials.password = null;
        }
    }
});
