// REDUCER UTILITY FUNCTIONS
// =========================

export function recordUUID( UUID, state, setName ) {
  let updated = new Set( state[ setName ] );

  updated.add( UUID );

  return { [ setName ]: updated }
}

export function resolveUUID( UUID, state, setName ) {
  let updated = new Set( state[ setName ] );

  updated.delete( UUID );

  return { [ setName ]: updated }
}
