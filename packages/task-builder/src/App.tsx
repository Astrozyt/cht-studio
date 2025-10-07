import { useState } from 'react'
import './App.css'
import { Card } from './components/ui/card'
import TaskForm from './Form'


function App() {
  const [count, setCount] = useState(0)

  return (
    <Card className="App">
      <h1 className="text-3xl font-bold underline">Tasks</h1>
      {/* Data table shadcn */}

      {/* Form to add tasks */}
      <TaskForm contactTypes={["case", "contact"]} formIds={["f1", "f2", "f3"]} onSubmit={(data) => console.log(data)} />
    </Card>

  )
}



export default App
