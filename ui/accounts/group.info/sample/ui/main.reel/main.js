var Component = require("montage/ui/component").Component;

exports.Main = Component.specialize({
    data: {
        value: [
            {
                "name": "group1",
                "id": 11,
                "sudo": false
            },
            {
                "name": "Group 2",
                "id": 111,
                "sudo": true
            },
            {
                "name": "group3",
                "id": 1113,
                "sudo": false
            }
        ]
    }
});
