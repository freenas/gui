// Alerts
// ======
// Configuration for FreeNAS alerts

"use strict";

import React from "react";

const Alerts = React.createClass(
  { getDefaultProps () {
    return { periodic_notify_user: null // from system.advanced

           };
  }

  , render () {
    return <h2>Alerts</h2>;
  }
});

export default Alerts;
