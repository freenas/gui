// CONFIRMATION DIALOG
// ===================

"use strict";

import React from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmationDialog = ( props ) => (
  <Modal
    show = { props.show }
    onHide = { props.onCancel }
  >
    { props.title ? (
      <Modal.Header closebutton>
        <Modal.Title>
          { props.title }
        </Modal.Title>
      </Modal.Header>
    ) : null }

    { props.body ? (
      <Modal.Body>
        <p>{ props.body }</p>
      </Modal.Body>
    ) : null }

    <Modal.Footer>
      <Button onClick={ props.onCancel }>
        { props.cancel }
      </Button>
      <Button
        bsStyle = { props.confirmStyle }
        onClick = { props.onConfirm }
      >
        { props.confirm }
      </Button>
    </Modal.Footer>

  </Modal>
);

ConfirmationDialog.propTypes =
  { show: React.PropTypes.bool.isRequired
  , onConfirm: React.PropTypes.func.isRequired
  , onCancel: React.PropTypes.func.isRequired
  , confirmStyle: React.PropTypes.oneOf([ "primary", "danger" ])

  // TEXT CONTENT
  , title: React.PropTypes.node
  , body: React.PropTypes.node
  , confirm: React.PropTypes.node
  , cancel: React.PropTypes.node
  };

ConfirmationDialog.defaultProps =
  { confirmStyle: "primary"
  , confirm: "Confirm"
  , cancel: "Cancel"
  }

export default ConfirmationDialog;
