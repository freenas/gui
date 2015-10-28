// CREATE STORAGE
// ==============
// Shown when it is possible for the user to create a new storage pool

"use strict";

import React from "react";
import { Panel, Button } from "react-bootstrap";

const CreateStorage = ( props ) => {
  const { onClick, ...rest } = props;

  return (
    <Panel
      { ...rest }
      className = { "volume awaiting-init text-center" }
    >
      <Button
        bsStyle = "primary"
        onClick = { props.onClick }
      >
        { "Create new storage pool" }
      </Button>
    </Panel>
  );
}

CreateStorage.propTypes =
  { onClick: React.PropTypes.func.isRequired
  };

export default CreateStorage;
