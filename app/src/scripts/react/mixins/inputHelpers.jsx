// INPUT HELPER MIXIN
// ==================
// Provides utility functions for generating common parts of input fields and
// maintaining proper local and remote state.

"use strict";

import _ from "lodash";
import React from "react";

module.exports = {

  // Takes an array of objects and turns it into an array of options suitable
  // for use in a select box or multi-select box.
  generateOptionsList: function ( options, selectionKey, displayKey ) {
    let optionList = [];

    _.forEach( options
             , function ( opt ) {
               let element = ( <option value = { opt[ selectionKey ] }
                                       label = { opt[ displayKey
                                                    ? displayKey
                                                    : selectionKey
                                                    ]
                                               }
                               />
                             );
               optionList.push( element );
             }
             , this
             );

    return optionList;
  }

  // Takes an array of simple values and turns it into an array of options for
  // a select or multi-select box.
  , createSimpleOptions: function ( optionsArray ) {
    var options =
      _.map( optionsArray
           , function mapOptions ( optionValue, index ) {
             return (
               <option
                 value = { optionValue }
                 key = { index }>
                 { optionValue }
               </option>
               );
           }
           );
    return options;
  }

  // Deals with input from different kinds of input fields.
  // TODO: Extend with other input fields and refine existing ones as necessary.
  , processFormInput: function ( event, value, dataKey ) {
    let inputValue;

    switch ( event.target.type ) {

      case "checkbox" :
        inputValue = event.target.checked;
        break;

      case "select":
      case "text":
      case "textarea":
      case "array":
      default:
        inputValue = this.parseInputType( event.target.value, value, dataKey );
        break;
    }

    return inputValue;
  }

  // Different handling for different types of data types
  , parseInputType: function ( input, value, dataKey ) {
    let output;

    switch ( dataKey.type ) {
      case "string":
        output = input;
        break;

      case "array":
        output = value;
        break;

      case "integer":
      case "number":
        // at this time all the numbers we actually edit are integers.
        // FIXME: Correct handling if we ever need to parse non-integer
        // numbers
        // FIXME: Make sure numbers that must be integers are labeled as such
        // in the schema
        output = _.parseInt( input );
        break;

      default:
        output = input;
        break;
    }

    return output;
  }
};
