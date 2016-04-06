/**
 * @module ui/group.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Group
 * @extends Component
 */
exports.Group = Component.specialize(/** @lends Group# */ {

    _deleteActivated: {
        value: false
    },

    _menuOpen: {
        value: false
    },

    _toggleMenu: {
        value: function () {
            this.classList.toggle('menu-is-open');

            if (!this._menuOpen) {
                this._menuOpen = true;
            } else {
                var self = this;
                this.classList.remove('is-editing');
                this.nameInput.enabled = false;
                this._deleteActivated = false;
                // hack to not set text to delete until transition is done
                setTimeout(function(){
                    self.deleteButton.label = "Delete";
                },250)
                this._menuOpen = false;
            }

        }
    },

    handleMenuButtonAction: {
        value: function () {
            this._toggleMenu();
        }
    },

    handleEditButtonAction: {
        value: function () {
            this.classList.add('is-editing');
            this.nameInput.enabled = true;
        }
    },

    handleDeleteButtonAction: {
        value: function () {
            if (this._deleteActivated) {
                alert("deleted");
                this._toggleMenu();
            } else {
                this.deleteButton.label = "Sure?";
                this._deleteActivated = true;
            }
        }
    },

    handleSaveButtonAction: {
        value: function () {
            alert("saved");
            this._toggleMenu();
        }
    }
});
