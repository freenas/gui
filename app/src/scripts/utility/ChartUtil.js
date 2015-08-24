// WIDGET UTILITIES
// ================

"use strict";

class WidgetUtil {
  static rand ( min, max, num ) {
    let rtn = [];
    while ( rtn.length < num ) {
      rtn.push( ( Math.random() * ( max - min ) ) + min );
    }
    return rtn;
  }
}

export default WidgetUtil;
