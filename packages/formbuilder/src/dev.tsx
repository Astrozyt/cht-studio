import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { FormEditor } from './Formbuilder'
import exampleSchema from './bp_confirm_selftransformed.json'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    This is it:
    <p className='bg-red-400'>My Form</p>
    <FormEditor formModel={exampleSchema} />
  </StrictMode>,
)
