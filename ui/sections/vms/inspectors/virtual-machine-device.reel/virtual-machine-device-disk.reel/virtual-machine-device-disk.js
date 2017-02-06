var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
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
            var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            this.sizeUnits = _.map(
                _.range(0, units.length),
                function(i) {
                    return {
                        label: units[i],
                        value: Math.pow(1024, i)
                    };
                }
            );
            this.blockModeOptions = this._sectionService.DISK_MODES;
            this.targetTypeOptions = this._sectionService.TARGET_TYPES;
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            this.super(isFirstTime);
            var self = this;
            this.isLoading = true;
            Promise.all([
                this._sectionService.listDisks(),
                this._sectionService.listBlocksInDatastore(this.object._vm.target),
                this._sectionService.listFilesInDatastore(this.object._vm.target)
            ]).spread(function(disks, blocks, files) {
                self.diskOptions = _.concat(
                    [{label: '-', value: null}],
                    _.sortBy(
                        _.map(
                            disks,
                            function(disk) {
                                return {
                                    label: disk.description + ' (' + numeral(disk.size).format('0 b') + ')',
                                    value: disk
                                };
                            }
                        ),
                        'label'
                    )
                );
                self.blockOptions = _.sortBy(
                    _.map(
                        blocks,
                        function(block) {
                            return {
                                name: block.path + ' ' + block.description,
                                path: block.path,
                                children: []
                            };
                        }
                    ),
                    'name'
                );
                self.fileOptions = _.sortBy(
                    _.map(
                        files,
                        function(file) {
                            return {
                                name: file.path + ' ' + file.description,
                                path: file.path,
                                children: []
                            };
                        }
                    ),
                    'name'
                );
                if (isFirstTime) {
                    var target_path = self.object.target_path;
                    self.addPathChangeListener('object._disk', self, '_handleTargetChange');
                    self.addPathChangeListener('object._target_path', self, '_handleTargetChange');
                    self.addPathChangeListener('object.target_type', self, '_handleTypeChange');
                    self.object._target_path = target_path;
                }
                if (self.object.type === 'DISK') {
                    self.object._disk = self.object.target_path;
                } else {
                    self.object._target_path = self.object.target_path;
                }
                if (self.treeController) {
                    self.treeController.open(self.object.target_path);
                }
                self.isLoading = false;
            });
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
            if (this.object.target_type === 'DISK') {
                if (target) {
                    this.object.target_path = target.path;
                    this.object.size = target.size;
                } else {
                    this.object.target_path = null;
                    this.object.size = null;
                }
            } else {
                this.object.size = null;
                if (target) {
                    this.object.target_path = target;
                } else {
                    this.object.target_path = null;
                }
            }
        }
    }
});
