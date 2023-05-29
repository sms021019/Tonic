import React from 'react'
import { theme } from '../utils/utils.js'

const GlobalContext = React.createContext({
  theme,
});

export default GlobalContext;