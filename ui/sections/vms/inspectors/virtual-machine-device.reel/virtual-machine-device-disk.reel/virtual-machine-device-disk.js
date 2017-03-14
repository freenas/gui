var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Units = require('core/Units'),
    _ = require('lodash'),
    numeral = require('numeral');

exports.VirtualMachineDeviceDisk = AbstractInspector.specialize({
    sizeUnits: {
        value: null
    },

    blockModeOptions: {
        value: null
    },

    targetTypeOptions: {
        value: null
    },

    treeController: {
        value: null
    },

    _inspectorTemplateDidLoad: {
        value: function() {
            this.sizeUnits = Units.BYTE_SIZES;
            this.blockModeOptions = this._sectionService.DISK_MODES;
            this.targetTypeOptions = this._sectionService.TARGET_TYPES;
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            this.super(isFirstTime);
            var self = this;
            this.object._isLoading = true;
            var promise = this.isFromTemplate ?
                Promise.resolve() :
                Promise.all([
                    this._sectionService.listDisks(),
                    this._sectionService.listFilesInDatastore(this.object._vm.target),
                    this.treeControllers.BLOCK.open()
                ]).spread(function(disks, files) {
                    self.diskOptions = _.concat(
                        [{label: '-', value: null}],
                        _.sortBy(
                            _.map(disks, function (disk) {
                                return {
                                    label: disk.description + ' (' + numeral(disk.size).format('0 b') + ')',
                                    value: disk
                                };
                            }),
                            'label'
                        )
                    );
                    self.fileOptions = _.sortBy(
                        _.map(files, function (file) {
                            return {
                                name: file.path + ' ' + file.description,
                                path: file.path,
                                children: []
                            };
                        }),
                        'name'
                    );
                });
            promise.then(function() {
                if (isFirstTime) {
                    var target_path = self.object.target_path,
                        size = self.object.size;
                    self.addPathChangeListener('object._disk', self, '_handleTargetChange');
                    self.addPathChangeListener('object._target_path', self, '_handleTargetChange');
                    self.addPathChangeListener('object.target_type', self, '_handleTypeChange');
                    self.object._target_path = target_path;
                    self.object.size = self.object.size || size;
                }
                if (self.object.type === 'DISK') {
                    self.object._disk = self.object.target_path;
                } else {
                    self.object._target_path = self.object.target_path;
                }
                if (self.treeController) {
                    self.treeController.open(self.object.target_path);
                }
                if (self.isNew) {
                    self.object.target_type = 'BLOCK';
                    self.object.size = self.object.size || 8 * Math.pow(1024, 3);
                }
                self.object._isLoading = false;
            });
        }
    },

    save: {
        value: function() {
            if (!this.object.target_path) {
                delete this.object.target_path;
            }
            if (!this.object.size) {
                delete this.object.size;
            }
        }
    },

    _handleTypeChange: {
        value: function() {
            if (this.treeController) {
                this.treeController.open('/');
            }
            this.object._target_path = null;
            this.object._disk = null;
        }
    },

    _handleTargetChange: {
        value: function(target) {
            if (this._inDocument && !this.isFromTemplate) {
                if (!target) {
                    this.object.target_path = null;
                    this.object.size = null;
                } else {
                    switch (this.object.target_type) {
                        case 'DISK':
                            this.object.target_path = target.path;
                            this.object.size = target.size;
                            break;
                        case 'BLOCK':
                        case 'FILE':
                            this.object.target_path = target;
                            var selectedTarget = this.treeController.entry.children && _.find(this.treeController.entry.children, {path: target});
                            this.object.size = (selectedTarget && selectedTarget.type === this.object.target_type) ? selectedTarget.original.size : 0;
                            break;
                    }
                }
            }
        }
    }
});
