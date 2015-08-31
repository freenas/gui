// System Settings
// ===============
// Display and Modify FreeNAS GUI and OS settings.

"use strict";

import React from "react";
import TWBS from "react-bootstrap";

const HardwareSettings = React.createClass(
  { render () {
    return (
      <TWBS.Panel>
        <h4>Hardware</h4>
      </TWBS.Panel>
    );
  }
});

const LocalizationSettings = React.createClass(
  { render () {
    return (
      <TWBS.Panel>
        <h4>Localization</h4>
      </TWBS.Panel>
    );
  }
});

const OSSettings = React.createClass(
  { render () {
    return (
      <TWBS.Panel>
        <h4>Operating System </h4>
      </TWBS.Panel>
    );
  }
});

const Tuneables = React.createClass(
  { render () {
    return (
      <TWBS.Panel>
        <h4>Tuneables</h4>
      </TWBS.Panel>
    );
  }
});

const UISettings = React.createClass(
  { render () {
    return (
      <TWBS.Panel>
        <h4>Webapp</h4>
      </TWBS.Panel>
    );
  }
});

const System = React.createClass(
  { render () {
    return (
      <TWBS.Grid>
        <TWBS.Row>
          <TWBS.Col xs = {4}>
            <UISettings/>
          </TWBS.Col>
          <TWBS.Col xs = {4}>
            <OSSettings/>
          </TWBS.Col>
          <TWBS.Col xs = {4}>
            <LocalizationSettings/>
          </TWBS.Col>
        </TWBS.Row>
        <TWBS.Row>
          <TWBS.Col xs = {4}>
            <HardwareSettings/>
          </TWBS.Col>
          <TWBS.Col xs = {8}>
            <Tuneables/>
          </TWBS.Col>
        </TWBS.Row>
      </TWBS.Grid>
    );
  }
});

export default System;
