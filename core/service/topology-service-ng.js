"use strict";
var TopologyService = (function () {
    function TopologyService() {
    }
    TopologyService.getInstance = function () {
        if (!TopologyService.instance) {
            TopologyService.instance = new TopologyService();
        }
        return TopologyService.instance;
    };
    TopologyService.prototype.generateTopology = function (disks, constraints) {
    };
    return TopologyService;
}());
exports.TopologyService = TopologyService;
