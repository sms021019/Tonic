import React, { useState } from 'react';
import Context from './Context'
import {theme} from '../utils/utils'

export default function ContextWrapper(props) {
  return (
    <Context.Provider value={{theme}}>
      {[props.children]}
    </Context.Provider>
  )
}