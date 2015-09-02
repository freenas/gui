// Update
// ======
// Handles FreeNAS updates and Boot Environment management.

"use strict";

import React from "react";

const Update = React.createClass(
  { getDefaultProps () {
    return { boot_scrub_internal: null // from system.advanced

           };
  }

  , render () {
    return <h2>Update FreeNAS</h2>;
  }
});

export default Update;
