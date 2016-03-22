var Component = require("montage/ui/component").Component;

exports.Main = Component.specialize({
    options: {
        value: [
            {
                "value": "option1",
                "label": "Option 1"
            },
            {
                "value": "optimal",
                "label": "Optimal"
            },
            {
                "value": "virtualization",
                "label": "Virtualization"
            },
            {
                "value": "backups",
                "label": "Backups"
            },
            {
                "value": "media",
                "label": "Media"
            }
        ]
    },

    selected: {
        value: [
            "optimal", "backups"
        ]
    }
});
