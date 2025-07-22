import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { FormEditor } from './Formbuilder'
import exampleSchema from './bp_confirm_selftransformed.json'
import { useState } from 'react'

function App() {
  const [useEmptyModel, setUseEmptyModel] = useState(true)

  return (
    <StrictMode>
      This is it:
      <p className='bg-red-400'>My Form</p>

      <FormEditor formModel={useEmptyModel ? exampleSchema : []} />
    </StrictMode>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
