// System Settings
// ===============
// Display and Modify FreeNAS GUI and OS settings.

"use strict";

import React from "react";
import TWBS from "react-bootstrap";

const languageChoices =
  [ "English"
  , "Afrikaans"
  , "Azerbaijani"
  , "Belarusian"
  , "Bengali"
  , "Breton"
  , "Bosnian"
  , "Catalan"
  , "Czech"
  , "Welsh"
  , "Danish"
  , "German"
  , "Greek"
  , "British English"
  , "Esperanto"
  , "Spanish"
  , "Argentinian Spanish"
  , "Mexican Spanish"
  , "Nicaraguan Spanish"
  , "Venezuelan Spanish"
  , "Estonian"
  , "Basque"
  , "Persian"
  , "Finnish"
  , "French"
  , "Frisian"
  , "Irish"
  , "Galician"
  , "Hebrew"
  , "Hindi"
  , "Croatian"
  , "Hungarian"
  , "Interlingua"
  , "Indonesian"
  , "Icelandic"
  , "Italian"
  , "Japanese"
  , "Georgian"
  , "Kazach"
  , "Khmer"
  , "Kannada"
  , "Korean"
  , "Luxembourish"
  , "Lithuanian"
  , "Latvian"
  , "Macedonian"
  , "Malayan"
  , "Mongolian"
  , "Burmese"
  , "Norwegian Bokmal"
  , "Nepali"
  , "Dutch"
  , "Norwegian Nyorsk"
  , "Ossetic"
  , "Punjabi"
  , "Polish"
  , "Portuguese"
  , "Brazilian Portuguese"
  , "Romanian"
  , "Russian"
  , "Slovak"
  , "Slovenian"
  , "Albanian"
  , "Serbian"
  , "Serbian Latin"
  , "Swedish"
  , "Swahili"
  , "Tamil"
  , "Telugu"
  , "Thai"
  , "Turkish"
  , "Tatar"
  , "Udmurt"
  , "Urdu"
  , "Vietnamese"
  , "Simplified Chinese"
  , "Traditional Chinese"
  ]

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
  { getDefaultProps () {
    return { localizationSettings:
             { language: "English"
             , timezone: "America/Los_Angeles"
             , console_keymap: "us.iso"
             }
           };
  }

  , render () {
    var language = null;
    var languageValue = this.props.localizationSettings[ "language" ];
    var timezone = null;
    var timezoneValue = this.props.localizationSettings[ "timezone" ];
    var console_keymap = null;
    var console_keymapValue = this.props.localizationSettings[ "console_keymap" ];
    return (
      <TWBS.Panel>
        <h4>Localization</h4>
        <form>
          <TWBS.Input
            type = "select"
            value = { language }>
            { languageChoices }
          </TWBS.Input>
          <TWBS.Input
            type = "select"
            value = { timezone }>
          </TWBS.Input>
          <TWBS.Input
            type = "select"
            value = { console_keymap }>
          </TWBS.Input>
        </form>
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
  { getDefaultProps () {
    return { systemUIConfig:
             { webui_protocol: "HTTP"
             , webui_http_port: 80
             , webui_http_redirect_https: false
             , webui_https_certificate: null
             , webui_listen: [ "0.0.0.0"
                             , "::"
                             ]
             , webui_https_port: null
             }
           };
  }

  , render () {
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
