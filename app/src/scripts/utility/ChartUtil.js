// WIDGET UTILITIES
// ================

"use strict";

import GLOBAL_STYLES from "../static/ChartjsDefaults";

const FREENAS_STYLES =
  {
  };

const COMMON_STYLES =
  { pointStrokeColor: "#fff"
  , pointHighlightFill: "#fff"
  };

const SERIES_STYLES =
  [ { fillColor: "rgba(220,220,220,0.2)"
    , strokeColor: "rgba(220,220,220,1)"
    , pointColor: "rgba(220,220,220,1)"
    , pointHighlightStroke: "rgba(220,220,220,1)"
    }
  , { fillColor: "rgba(151,187,205,0.2)"
    , strokeColor: "rgba(151,187,205,1)"
    , pointColor: "rgba(151,187,205,1)"
    , pointHighlightStroke: "rgba(151,187,205,1)"
    }
  ];

class WidgetUtil {
  static rand ( min, max, num ) {
    let rtn = [];
    while ( rtn.length < num ) {
      rtn.push( ( Math.random() * ( max - min ) ) + min );
    }
    return rtn;
  }

  static styleDatasets ( datasets ) {
    return datasets.map( ( dataset, index ) => {
      return Object.assign( {}
                          , COMMON_STYLES
                          , SERIES_STYLES[ index ]
                          , dataset
                          );
    });
  }

  static getGlobalChartStyles () {
    return Object.assign( {}
                        , GLOBAL_STYLES
                        , FREENAS_STYLES
                        );
  }
}

export default WidgetUtil;
