// Localization Settings
// ===========
// Display and modify Localization settings settings

"use strict";

import React from "react";
import { Input, Panel, Button, ButtonToolbar } from "react-bootstrap";

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
  ];

function createSimpleOptions ( optionArray ) {
  var options =
    optionArray.map(
      function mapOptions ( option, index ) {
        return (
          <option
            value = { option }
            key = { index }
          >
           { option }
          </option>
        );
      }
   );
  return options;
}

const LocalizationSettings = (props) => {
  const languageValue = typeof props.localizationForm.language !== "undefined"
                      ? props.localizationForm.language
                      : props.general.language;
  const timezoneValue = typeof props.localizationForm.timezone !== "undefined"
                      ? props.localizationForm.timezone
                      : props.general.timezone;

  const language =
    <Input
      type = "select"
      label = "Language"
      value = { languageValue }
      onChange = { ( e ) => props.updateLocalizationForm( "language"
                                                        , e.target.value
                                                        )
                 }
    >
      { createSimpleOptions( languageChoices ) }
    </Input>;

  const timezone =
    <Input
      type = "select"
      label = "Timezone"
      value = { timezoneValue }
      onChange = { ( e ) => props.updateLocalizationForm( "timezone"
                                                        , e.target.value
                                                        )
                 }
    >
      { createSimpleOptions( props.general.timezones ) }
    </Input>;

  const formControlButtons =
    <ButtonToolbar className = "pull-right">
      <Button
        bsStyle = "default"
        onClick = { props.resetLocalizationForm }
        // disabled = {/* need test for this*/ }
      >
        { "Reset" }
      </Button>
      <Button
        bsStyle = "primary"
        onClick = { props.submitLocalizationTask  }
        // disabled = {/* need test for this*/ }
      >
        { "Apply" }
      </Button>
    </ButtonToolbar>;

  return (
    <Panel>
      <h4>Localization</h4>
      <form className = "settings-config-form">
        { language }
        { timezone }
        { formControlButtons }
      </form>
    </Panel>
  );
};

LocalizationSettings.propTypes =
  { general: React.PropTypes.shape(
    { language: React.PropTypes.string
    , timezone: React.PropTypes.string
    , timezones: React.PropTypes.arrayOf( React.PropTypes.string )
    }
  )
  , localizationForm: React.PropTypes.shape(
    { language: React.PropTypes.string
    , timezone: React.PropTypes.string
    }
  )
  , updateLocalizationForm: React.PropTypes.func
  , resetLocalizationForm: React.PropTypes.func
  , submitLocalizationTask: React.PropTypes.func
  };

export default LocalizationSettings;
