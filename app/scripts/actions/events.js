// EVENTS - ACTION CREATORS
// ========================

"use strict";

import { SYSTEM_EVENT } from "./actionTypes";

export function systemEvent ( data, timestamp ) {
  return { types: SYSTEM_EVENT
         , payload: { data, timestamp }
         };
}
