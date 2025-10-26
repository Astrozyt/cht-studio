import './App.css'
import { Card } from './components/ui/card'
// import TaskForm from './components/Form'
import { type TaskSchema as TaskValues } from "./types";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table';
import { Badge } from './components/ui/badge';
import { useState } from 'react';
import TaskForm from './components/Form';
import { Button } from './components/ui/button';
import { MinusCircleIcon } from 'lucide-react';

export const App = ({
  contactTypes,
  formIds,
  onSubmit,
  existingTasks
}: {
  contactTypes: string[];
  formIds: string[];
  onSubmit: (v: TaskValues[]) => void;
  existingTasks: TaskValues[];
}) => {

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<TaskValues | null>(null);
  const [taskList, setTaskList] = useState<TaskValues[]>(existingTasks);

  return (
    <Card className="App">
      <h1 className="text-3xl font-bold underline">Tasks</h1>
      {/* Data table shadcn */}

      {/* Form to add tasks */}
      {/* <TaskForm contactTypes={["case", "contact"]} formIds={["f1", "f2", "f3"]} onSubmit={(data) => console.log(data)} /> */}
      <Table>
        <TableCaption>Project tasks</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead >Name</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Icon</TableHead>
            <TableHead >AppliesTo</TableHead>
            <TableHead >AppliesToType</TableHead>
            <TableHead >AppliesIf</TableHead>
            <TableHead >Contact Label</TableHead>
            <TableHead >Events</TableHead>
            <TableHead >Actions</TableHead>
            <TableHead >Priority</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {taskList.map((task) => {
            console.log("jjj appliesIf: ", task.appliesIf);
            return <TableRow key={task.name}>
              <TableCell className="font-medium">{task.name}</TableCell>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.icon}</TableCell>
              <TableCell>{task.appliesTo}</TableCell>
              <TableCell>{String(task.appliesToType)}</TableCell>
              <TableCell><Badge>{task.appliesIf?.rules?.length || "-"}</Badge></TableCell>
              <TableCell>{task.contactLabel}</TableCell>
              <TableCell><Badge>{task.events.length}</Badge></TableCell>
              <TableCell><Badge>{task.actions.length}</Badge></TableCell>
              <TableCell><Badge>{task.priority ? task.priority.level : 'N/A'}</Badge></TableCell>
              <TableCell>
                <Button onClick={() => {
                  setTaskToEdit(task);
                  setIsDialogOpen(true);
                }}>Edit</Button>
              </TableCell>
            </TableRow>
          })}
        </TableBody>
      </Table>
      <Button className='size-fit ml-auto mr-auto' onClick={() => {
        setTaskToEdit(null);
        setIsDialogOpen(true);
      }}>
        Add New Task
      </Button>
      <TaskForm
        contactTypes={contactTypes}
        formIds={formIds}
        onSubmit={(data) => { setTaskList([...taskList, data]); onSubmit([...taskList, data]); setIsDialogOpen(false); }}
        existingTask={taskToEdit}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
    </Card>

  )
}



export default App
