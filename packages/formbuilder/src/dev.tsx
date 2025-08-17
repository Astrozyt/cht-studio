import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { FormEditor } from './Formbuilder'

function App() {

  const onSave = async (data: any) => {
    // TODO: Implement Tauri-independent save logic here
    console.log("Data to save:", data);
  }

  const body = [{ "uid": "h1TnqteWmZIPPcZqSoJB_", "ref": "un", "labels": [], "hints": [], "items": [], "tag": "input", "bind": { "required": false, "readonly": false, "constraint": "", "constraintMsg": "", "calculate": "", "preload": "", "preloadParams": "", "type": "string" } }];


  const cancelFn = () => {
    console.log("Cancel function called");
  }


  return (
    <StrictMode>
      This is it:
      <p className='bg-red-400'>My Form</p>

      <FormEditor onSave={onSave} cancelFn={cancelFn} formInput={{ title: 'asdf', body }} />
    </StrictMode>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
