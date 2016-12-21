var Component = require("montage/ui/component").Component,
    ModelDescriptorService = require("core/service/model-descriptor-service").ModelDescriptorService,
    CascadingListItem = require("ui/controls/cascading-list.reel/cascading-list-item.reel").CascadingListItem,
    RoutingService = require("core/service/routing-service").RoutingService,
    _ = require("lodash");


exports.CascadingList = Component.specialize({

    constructor: {
        value: function() {
            this._stack = [];
        }
    },

    _stack: {
        value: null
    },

    _root: {
        value: null
    },

    root: {
        get: function () {
            return this._root;
        },
        set: function (root) {
            var self = this;
            if (this._root !== root) {
                this._root = root;
                this._stack.clear();
                if (root) {
                    this._populateColumnAtIndexWithObjectAndTypeAndSelectionKey(0, root, this._modelDescriptorService.getObjectType(root)).then(function(context) {
                        self.rootPromise = null;
                        return context;
                    });
                }
            }
        }
    },

    templateDidLoad: {
        value: function() {
            this._routingService = RoutingService.getInstance();
            this._modelDescriptorService = ModelDescriptorService.getInstance();
            this._selectionService = this.application.selectionService;
        }
    },

    enterDocument: {
        value: function() {
            this._pathListener = this._routingService.subscribe('path', this._handlePathChange.bind(this));
            this._sectionListener = this._routingService.subscribe('section', this._handleSectionChange.bind(this));
        }
    },

    exitDocument: {
        value: function () {
            this._routingService.unsubscribe('path', this._pathListener);
            this._routingService.unsubscribe('path', this._sectionListener);
        }
    },

    _handleSectionChange: {
        value: function() {
            this._stack.clear();
        }
    },

    _isSameList: {
        value: function (value, stackEntry) {
            var valueParts = _.split(value, '|'),
                type = _.replace(valueParts[0], 'list_', ''),
                params = eval('(' + valueParts[1] + ')');
            return type &&
                stackEntry &&
                stackEntry.object &&
                this._isSameType(stackEntry.object._objectType, type) &&
                (
                    !params ||
                    (
                        _.isEqual(stackEntry.object._filter, params.filter) &&
                        _.isEqual(stackEntry.object._sorted, params.sorted)
                    )
                );
        }
    },

    _isSameObject: {
        value: function (value, stackEntry) {
            var valueParts = _.split(value, '|'),
                type = valueParts[0],
                id = valueParts[1];
            return type && id &&
                stackEntry &&
                stackEntry.object &&
                this._isSameType(stackEntry.object._objectType, type) &&
                stackEntry.object.id === id;
        }
    },

    _isSameNew: {
        value: function (value, stackEntry) {
            var type = _.replace(value, 'new_', '');
            return type &&
                stackEntry &&
                stackEntry.object &&
                this._isSameType(stackEntry.object._objectType, type) &&
                stackEntry.object._isNew;
        }
    },

    _getCommonPart: {
        value: function (pathElements, stack) {
            return _.takeWhile(pathElements, function (value, index) {
                var stackEntry = stack[index + 1];
                return stackEntry && stackEntry.selectionKey === value;
            });
        }
    },

    _handlePathChange: {
        value: function(path) {
            if (path.length > 0) {
                var self = this,
                    pathElements = _.split(path, RoutingService.SEPARATOR),
                    stack = self._stack,
                    common = this._getCommonPart(pathElements, stack);
                while (this._stack.length > common.length+1) {
                    this._stack.pop();
                }
                this._currentIndex = common.length+1;
                var previousObject = this._stack.slice(-1)[0] && this._stack.slice(-1)[0].object;
console.log(common, previousObject);
                Promise.mapSeries(_.slice(pathElements, common.length), function(key) {
                    var promise,
                        isRelative = false;
                    if (_.startsWith(key, 'list_')) {
                        promise = self._getListForKey(key);
                    } else if (_.startsWith(key, 'new_')) {
                        promise = self._getNewInstanceForKey(key);
                    } else if (_.indexOf(key, '|') !== -1) {
                        promise = self._getObjectFromKey(key);
                    } else {
                        isRelative = true;
                        promise = self._getPropertyForObjectAndKey(previousObject, key);
                    }
                    return promise.spread(function(object, objectType) {
                        previousObject = object;
                        return self._populateColumnAtIndexWithObjectAndTypeAndSelectionKey(self._currentIndex++, object, objectType, key, isRelative);
                    });
                }).then(function() {
                    self._selectionService.saveSelection(self.application.section, self._stack);
                });
            }
        }
    },

    _isSameType: {
        value: function(typeA, typeB) {
            return  typeA === typeB ||
                (Array.isArray(typeA) && typeA.length === 1 && typeA[0] === typeB) ||
                (Array.isArray(typeB) && typeB.length === 1 && typeB[0] === typeA);
        }
    },

    _getPropertyForObjectAndKey: {
        value: function (previousObject, key) {
            var keyParts = _.split(key, '['),
                propertyName = keyParts[0],
                propertyType = keyParts[1],
                object = previousObject[propertyName],
                promise;

            if (propertyType) {
                promise = Promise.resolve(propertyType);
            } else if (object._objectType) {
                promise = Promise.resolve(object._objectType);
            } else {
                promise = this._modelDescriptorService.getPropertyType(this._modelDescriptorService.getObjectType(previousObject), key);
            }
            return promise.then(function (propertyType) {
                object._objectType = propertyType;
                return [object, propertyType];
            });
        }
    },

    _getListForKey: {
        value: function(key) {
            var self = this,
                keyParts = _.split(key, '|'),
                types = _.split(_.replace(keyParts[0], 'list_', ''), ','),
                params = eval('('+keyParts[1]+')');
            return Promise.mapSeries(types, function(type) {
                return self._modelDescriptorService.getDaoForType(type).then(function(dao) {
                    return dao.list();
                }).then(function(entries) {
                    var results = entries;
                    if (params) {
                        if (params.filter) {
                            results = _.filter(results, params.filter);
                        }
                    }
                    results._objectType = type;
                    return results;
                });
            }).then(function(entries) {
                var results = _.flatten(entries);
                if (params && params.sorted) {
                    results = _.sortBy(results, params.sorted);
                }
                // results._objectType = types[0];
                results._objectType = types;
                if (params) {
                    results._filter = params.filter;
                    results._sorted = params.sorted;
                }
                return [results, types];
            });
        }
    },

    _getNewInstanceForKey: {
        value: function(key) {
            var type = _.replace(key, 'new_', '');
            return this._modelDescriptorService.getDaoForType(type).then(function(dao) {
                return dao.getNewInstance();
            }).then(function(instance) {
                return [instance, type];
            });
        }
    },

    _getObjectFromKey: {
        value: function(key) {
            var self = this,
                type = _.split(key, '|')[0],
                id = _.split(key, '|')[1];
            return this._modelDescriptorService.getDaoForType(type).then(function(dao) {
                return dao.list();
            }).then(function(entries) {
                var result = _.find(entries, {id: id});
                return [
                    result,
                    self._modelDescriptorService.getObjectType(result)
                ];
            });
        }
    },

    pop: {
        value: function () {
            this._pop();
            this.needsDraw = true;
        }
    },

    popAtIndex: {
        value: function (index, isSelectionSaved) {
            if (index < this._currentIndex && this._currentIndex !== -1) {
                this._pop(isSelectionSaved);

                // the value of the property _currentIndex changed when _pop() has been called.
                if (index <= this._currentIndex) {
                    this.popAtIndex(index);
                }
            }
        }
    },

    cascadingListItemAtIndex: {
        value: function (index) {
            if (index <= this._currentIndex) {
                return this.repetition.childComponents[index];
            }

            return null;
        }
    },

    _pop: {
        value: function (isSelectionSaved) {
            this._resetCascadingListItemAtIndex(this._currentIndex);
            this._stack.pop();
            if (!isSelectionSaved) {
                this._selectionService.saveSelection(this.application.section, this._stack);
            }
            this._currentIndex--;
        }
    },

    _resetCascadingListItemAtIndex: {
        value: function (index) {
            var cascadingListItem = this.cascadingListItemAtIndex(index);

            if (cascadingListItem) {
                cascadingListItem.resetSelection();
            }
        }
    },

    _populateColumnAtIndexWithObjectAndTypeAndSelectionKey: {
        value: function (columnIndex, object, objectType, selectionKey, isRelative) {
            var self = this,
                currentStackLength = self._stack.length,
                promise = this._populatePromise || Promise.resolve();

            return promise.then(function() {
                return self._populatePromise = self.application.delegate.userInterfaceDescriptorForObject(object).then(function (userInterfaceDescriptor) {
                    columnIndex = Math.min(currentStackLength, columnIndex);
                    var context = {
                        object: object,
                        userInterfaceDescriptor: userInterfaceDescriptor,
                        columnIndex: columnIndex,
                        objectType: objectType,
                        selectionKey: selectionKey,
                        isRelative: !!isRelative
                    };
                    if (currentStackLength > 0) {
                        context.parentContext = self._stack[currentStackLength - 1];
                    }
                    self._stack.push(context);
                    self._populatePromise = null;
                    self.needsDraw = true;
                    return context;
                });
            });
        }
    }

}, {
    findCascadingListItemContextWithComponent: {
        value: function (component) {
            var parentComponent = component.parentComponent;

            if (parentComponent) {
                if (parentComponent instanceof CascadingListItem) {
                    return parentComponent;
                }

                return this.findCascadingListItemContextWithComponent(parentComponent);
            }

            return null;
        }
    },

    findPreviousCascadingListItemContextWithComponent: {
        value: function (component) {
            var cascadingListItem = this.findCascadingListItemContextWithComponent(component),
                previousCascadingListItem = null;

            if (cascadingListItem && cascadingListItem.data.columnIndex > 0) {
                previousCascadingListItem = cascadingListItem.cascadingList.cascadingListItemAtIndex(cascadingListItem.data.columnIndex -1);
            }

            return previousCascadingListItem;
        }
    },

    findPreviousContextWithComponent: {
        value: function (component) {
            var previousCascadingListItem = this.findPreviousCascadingListItemContextWithComponent(component);

            return previousCascadingListItem ? previousCascadingListItem.data : null;
        }
    }
});
