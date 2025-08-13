import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { FormEditor } from './Formbuilder'
import exampleSchema from './bp_confirm_selftransformed.json'
import { useState } from 'react'

function App() {
  const useEmptyModel = true

  const onSave = async (data: any) => {
    // TODO: Implement the save logic here
    console.log("Data to save:", data);
  }

  return (
    <StrictMode>
      This is it:
      <p className='bg-red-400'>My Form</p>

      <FormEditor onSave={onSave} formInput={{ title: 'asdf', body: [] }} />
    </StrictMode>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
