var Component = require("montage/ui/component").Component;

var paths =  [
                {
                    name: "root",
                    type: "DIRECTORY",
                    path: "root",
                    children: [
                        {
                            name: "bar",
                            type: "DIRECTORY",
                            path: "root/bar",
                            home: true
                        },
                        {
                            name: "baz",
                            type: "DATASET",
                            path: "root/baz"
                        }
                    ]
                },
                {
                    name: "bar",
                    type: "DIRECTORY",
                    path: "root/bar",
                    children: [
                        {
                            name: "quux",
                            type: "FILE"
                        },
                        {
                            name: "quuux",
                            type: "DATASET"
                        }
                    ]
                },
                {
                    name: "baz",
                    type: "DIRECTORY",
                    path: "root/baz",
                    children: [
                        {
                            name: "quuuux",
                            type: "FILE"
                        },
                        {
                            name: "quuuuux",
                            type: "DATASET"
                        }
                    ]
                },
                {
                    name: "no home",
                    type: "NONE",
                    path: "none"
                }
            ];

// var _findPath = function (array, path) {
//                     array.filter(function(e,i) {
//                         if (e.path == path) {
//                             console.log(array[i]);
//                             return array[i];
//                         }
//                     });
//                 }

exports.Main = Component.specialize({

    controller: {
        value: {
            open: function (path) {
                if (path) {
                    // this.entry = _findPath(paths, path);
                    this.type = paths[0].type;
                    this.entry = paths[0];
                } else {
                    this.type = paths[1].type;
                    this.entry = paths[1];
                }
            }
        }
    },

});
