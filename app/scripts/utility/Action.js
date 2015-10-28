// ACTION CREATOR UTILITIES
// ========================

export function watchRequest( UUID, type ) {
  return { type
         , payload: { UUID }
         };
}
