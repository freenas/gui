// WIDGET UTILITIES
// ================

"use strict";

import _ from "lodash";
import GLOBAL_STYLES from "../static/ChartjsDefaults";

const FREENAS_STYLES =
  { responsive: true
  };

const COMMON_STYLES =
  { pointStrokeColor: "#fff"
  , pointHighlightFill: "#fff"
  };

const SERIES_STYLES =
  [ { fillColor            : "rgba( 1, 150, 216, 0.2 )"
    , strokeColor          : "rgba( 1, 150, 216, 1 )"
    , pointColor           : "rgba( 1, 150, 216, 1 )"
    , pointHighlightStroke : "rgba( 1, 150, 216, 1 )"
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
      return _.assign( {}
                     , COMMON_STYLES
                     , SERIES_STYLES[ index ]
                     , dataset
                     );
    });
  }

  static getChartStyles ( customStyles ) {
    return _.assign( {}
                   , GLOBAL_STYLES
                   , FREENAS_STYLES
                   , customStyles || {}
                   );
  }
}

export default WidgetUtil;
