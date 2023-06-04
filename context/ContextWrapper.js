import React, { useState } from 'react';
import Context from './Context'
import {theme} from '../utils/utils'

export default function ContextWrapper(props) {
  const [user, setUser] = useState(null);
  return (
    <Context.Provider value={{theme, user, setUser}}>
      {[props.children]}
    </Context.Provider>
  )
}