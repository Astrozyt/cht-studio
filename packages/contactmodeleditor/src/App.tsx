import './App.css'
import { Card } from './components/ui/card'
import { ContactModelEditor } from './components/ContactModelEditor'

function App() {

  return (
    <Card className="App">
      <h1 className="text-3xl font-bold underline">Base Settings Editor</h1>
      <ContactModelEditor saveFn={async (data) => console.log("Saving...", data)} />
    </Card>
  )
}

export default App
