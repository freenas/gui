var optimize = require("../node_modules/mop");

optimize(process.cwd()).then(function () {
    console.log("Optimization done.");
});
