/**
 * @module ui/table-editable.reel
 */
var Component = require("montage/ui/component").Component,
    Checkbox = require("montage/ui/checkbox.reel").Checkbox,
    KeyComposer = require("montage/composer/key-composer").KeyComposer,
    Composer = require("montage/composer/composer").Composer,
    _ = require("lodash");

function RowEntry(object) {
    this.object = object;
    this.selected = false;
}


function findRowElement(el) {
    while (el) {
        if (el.getAttribute("data-montage-id") == 'rowEntry') {
            break;
        }
        el = el.parentElement;
    }
    return el;
}

/**
 * @class TableEditable
 * @extends Component
 */
var TableEditable = exports.TableEditable = Component.specialize({

    showRowActions: {
        value: true
    },

    canAddWithError: {
        value: true
    },

    isMultiSelectionEnabled: {
        value: true
    },

    rows: {
        set: function (rows) {
            this._rows = rows;
        },
        get: function () {
            if (!this._rows) {
                this._rows = []
            }

            return this._rows;
        }
    },

    templateDidLoad: {
        value: function () {
            this.addRangeAtPathChangeListener("rows", this, "handleRowsChange");
        }
    },

    _shouldShowNewEntryRow: {
        set: function (shouldShowNewEntryRow) {
            shouldShowNewEntryRow = !!shouldShowNewEntryRow;

            if (this.__shouldShowNewEntryRow !== shouldShowNewEntryRow) {
                document.addEventListener("wheel", this, true);
                this.__shouldShowNewEntryRow = shouldShowNewEntryRow;
                this._canShowNewEntryRow = true;
                this.needsDraw = true;
            }
        },
        get: function () {
            return this.__shouldShowNewEntryRow;
        }
    },

    _shouldHideNewEntryRow: {
        set: function (shouldHideNewEntryRow) {
            shouldHideNewEntryRow = !!shouldHideNewEntryRow;

            if (this.__shouldHideNewEntryRow !== shouldHideNewEntryRow) {
                this.__shouldHideNewEntryRow = shouldHideNewEntryRow;
                this._canShowNewEntryRow = false;
                this.needsDraw = true;
            }
        },
        get: function () {
            return this.__shouldHideNewEntryRow;
        }
    },

    //Public API

    isAddingNewEntry: {
        get: function () {
            return !!this._canShowNewEntryRow;
        }
    },

    currentNewEntry: {
        get: function () {
            if (!this.isAddingNewEntry) {
                this._currentNewEntry = null;
            }

            return this._currentNewEntry;
        }
    },

    hideNewEntryRow: {
        value: function () {
            this._cancelAddingNewEntry();
        }
    },

    showNewEntryRow: {
        value: function () {
            this._shouldShowNewEntryRow = true;
        }
    },

    deleteSelectedRows: {
        value: function () {
            var rowEntry,
                index;

            while (this.selectedRows.length) {
                rowEntry = this.selectedRows[0];

                if ((index = this.rows.indexOf(rowEntry.object)) > -1) {
                    this.callDelegateMethod(
                        "tableWillDeleteEntry",
                        rowEntry.object
                    );
                    this.rows.splice(index, 1);
                }
            }
        }
    },

    findRowIterationContainingElement: {
        value: function (element) {
            return this._rowRepetitionComponent._findIterationContainingElement(element);
        }
    },

    //END Public API

    prepareForActivationEvents: {
        value: function () {
            this.addEventListener("action", this);
            this.element.addEventListener("focusin", this);

            var keyboardIdentifiers = this.constructor.KEY_IDENTIFIERS,
                keyboardIdentifiersKeys = Object.keys(keyboardIdentifiers),
                keyboardIdentifier;

            this._keyComposerMap = new Map();

            for (var i = 0, length = keyboardIdentifiersKeys.length; i < length; i++) {
                keyboardIdentifier = keyboardIdentifiers[keyboardIdentifiersKeys[i]];

                this._keyComposerMap.set(
                    keyboardIdentifier,
                    KeyComposer.createKey(this, keyboardIdentifier, keyboardIdentifier)
                );

                this._keyComposerMap.get(keyboardIdentifier).addEventListener("keyPress", this);
            }
            if (this.showRowActions) {
                this._rowRepetitionComponent.element.addEventListener("click", this);
            }
        }
    },

    handleFocusin: {
        value: function(e) {
            this.handleClick(e);
        }
    },

    exitDocument: {
        value: function() {
            this._cancelAddingNewEntry();
            if(this.showRowActions) {
                this._rowRepetitionComponent.element.removeEventListener("click", this);
            }
        }
    },

    handleKeyPress: {
        value: function (event) {
            var keyIdentifiers = this.constructor.KEY_IDENTIFIERS;
        }
    },

    _activeRow: {
        value: null
    },

    _activeRowEntry: {
        value: null
    },

    _showControls: {
        value: function() {
            if (this._activeRow) {
                this._activeRow.classList.add('is-active');
                this._activeRow.appendChild(this.rowControls);
            } else {
                this._tableBodyTopElement.appendChild(this.rowControls);
            }
            this._rowRepetitionComponent.element.classList.add('is-active');
            this.rowControls.classList.add('is-active');
        }
    },

    _hideControls: {
        value: function() {
            if(this._activeRow) {
                this._activeRow.classList.remove('is-active');
                this._activeRow = this._activeRowEntry = null;
            }
            this.rowControls.classList.remove('is-active');
            this._rowRepetitionComponent.element.classList.remove('is-active');
        }
    },

    handleClick: {
        value: function(e) {
            if(this.showRowActions) {
                var element = findRowElement(e.target);
                if (element && element.component !== this._activeRowEntry) {
                    if (this._activeRow) {
                        this._activeRow.classList.remove('is-active');
                    }
                    this._activeRow = this.findRowIterationContainingElement(element).firstElement;
                    this._activeRowEntry = element.component;
                    this._activeRowOriginalObject = _.cloneDeep(this._activeRowEntry.object);
                    this._showControls();

                // if the event target is not in the row or the row controls
                } else if(this._activeRow && !this._activeRow.contains(e.target) && !this.rowControls.contains(e.target)) {
                    this.handleCancelAction();
                }
            }
        }
    },

    handleRowsChange: {
        value: function () {
            if (this._inDocument) {
                this._toggleAllComponent.checked = this.rows.length > 0 && this.selectedRows &&
                    this.selectedRows.length === this.rows.length;
            }
        }
    },

    handleCancelAction: {
        value: function () {
            if(this._activeRow) {
                this._activeRowEntry.object = this._activeRowOriginalObject;
            }
            document.activeElement.blur();
            this._cancelAddingNewEntry();
            this._hideControls();
        }
    },

    handleDoneAction: {
        value: function () {
            if (this._stopAddingNewEntry()) {
                document.activeElement.blur();
                this._hideControls();
            }
        }
    },

    handleAction: {
        value: function (event) {
            var target = event.target;
            if (this._toggleAllComponent.element.contains(target.element)) {
                this._handleToggleAllAction(event);
            } else if (target instanceof Checkbox && this._rowRepetitionComponent.element.contains(target.element)) {
                this._toggleAllComponent.checked = this.selectedRows && this.selectedRows.length === this.rows.length;
            }
        }
    },

    _getNewEntry: {
        value: function () {
            var defaultNewEntry = {};

            defaultNewEntry = this.callDelegateMethod(
                "tableWillUseNewEntry",
                this,
                defaultNewEntry
            ) || defaultNewEntry;

            if (Promise.is(defaultNewEntry)) {
                return defaultNewEntry.then(function (NewEntry) {
                    return new RowEntry(NewEntry);
                });
            }

            return Promise.resolve(new RowEntry(defaultNewEntry));
        }
    },

    _handleToggleAllAction: {
        value: function() {
            var self = this;

            this._rowEntries.forEach(function (rowEntry) {
                rowEntry.selected = !!self._toggleAllComponent.checked;
            });
        }
    },

    _cancelAddingNewEntry: {
        value: function () {
            if (this.isAddingNewEntry) {
                this.callDelegateMethod(
                    "tableDidCancelEditingNewEntry",
                    this,
                    this.currentNewEntry.object,
                    this.contentController
                );

                this._shouldHideNewEntryRow = true;
            }

        }
    },

    _stopAddingNewEntry: {
        value: function () {
            var isValid = true;
            if (!this.canAddWithError &&
                this._activeRowEntry &&
                this._activeRowEntry.templateObjects.errorController &&
                typeof this._activeRowEntry.templateObjects.errorController.checkIsValid === 'function') {
                isValid = this._activeRowEntry.templateObjects.errorController.checkIsValid();
            }
            if (isValid && this.isAddingNewEntry) {
                this._activeRowEntry = null;
                var shouldAddNewEntry = this.callDelegateMethod(
                    "tableWillAddNewEntry",
                    this,
                    this.currentNewEntry.object,
                    this.contentController
                );

                if (shouldAddNewEntry !== void 0 ? !!shouldAddNewEntry : true) {
                    this.contentController.add(this.currentNewEntry.object);
                    this.callDelegateMethod(
                        "tableDidAddNewEntry",
                        this,
                        this.currentNewEntry.object,
                        this.contentController
                    );
                }

                this._shouldHideNewEntryRow = true;
            }
            return isValid;
        }
    },

    _startAddingNewEntry: {
        value: function () {
            var self = this;

            return this._getNewEntry().then(function (newEntry) {
                self._currentNewEntry = newEntry;
                self._activeRowEntry = self.element.querySelector('[data-montage-id=newEntry]').component;

                self.callDelegateMethod(
                    "tableWillStartEditingNewEntry",
                    self,
                    self.currentNewEntry.object,
                    self.contentController
                );
                self._showControls();

                self.dispatchOwnPropertyChange("isAddingNewEntry", self.isAddingNewEntry);
                self.dispatchOwnPropertyChange("currentNewEntry", self.currentNewEntry);
            });
        }
    },

    draw: {
        value: function () {
            if (this._shouldShowNewEntryRow) {
                this.__shouldShowNewEntryRow = false;
                this._startAddingNewEntry();

            } else if (this._shouldHideNewEntryRow) {
                this._shouldHideNewEntryRow = false;
                this.dispatchOwnPropertyChange("isAddingNewEntry", this.isAddingNewEntry);
                this.dispatchOwnPropertyChange("currentNewEntry", this.currentNewEntry);
                this._hideControls();
            }
        }
    }

}, {

    KEY_IDENTIFIERS: {
        value: {
            enter: "enter",
            escape: "escape"
        }
    }
});

TableEditable.prototype.handleEnterKeyPress = TableEditable.prototype.handleDoneAction;
TableEditable.prototype.handleEscapeKeyPress = TableEditable.prototype.handleCancelAction;

