import React, { createContext, useContext } from 'react';
import { SatRec } from 'satellite.js';

const satrecContext = createContext<SatRec>({} as SatRec);

export function useMyContext() {
  return useContext(satrecContext);
}

export default satrecContext;