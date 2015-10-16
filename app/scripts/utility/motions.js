// MOTIONS
// =======
// Re-usable presets for react-motion

"use strict";

import { spring } from "react-motion";


export const ghost =
  { in : { y: spring( 0 ), opacity: spring( 1 ), marginTop: spring( 0 ) }
  , out : { y: spring( -100 ), opacity: spring( 0 ), marginTop: spring( -100 ) }
  , defaultIn : { y: 0, opacity: 1, marginTop: 0 }
  , defaultOut : { y: -100, opacity: 0, marginTop: -100 }
  };
