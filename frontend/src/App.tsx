import { useEffect, useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { connectSocket, ChangeEvent } from './services/socket'
import { getTasks, Task } from './services/api'
import TaskManager from './components/TaskManager'

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    getTasks()
      .then(res => setTasks(res.data))
      .catch(() => toast.error('Failed to load tasks'))

    const ws = connectSocket((evt: ChangeEvent) => {
      setTasks(prev => {
        switch (evt.type) {
          case 'insert':
            toast.success(`New task: ${evt.task.title}`)
            return [...prev, evt.task]
          case 'update':
            toast(`Task updated: ${evt.task.title}`)
            return prev.map(t => (t.id === evt.task.id ? evt.task : t))
          case 'delete':
            toast(`Task deleted`)
            return prev.filter(t => t.id !== evt.task.id)
        }
      })
    })
    return () => ws.close()
  }, [])

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
        <header className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-5xl font-extrabold text-blue-800">Real-Time Task Board</h1>
          <p className="mt-2 text-gray-600">Collaborate live—no refresh needed.</p>
        </header>
        <TaskManager tasks={tasks} setTasks={setTasks} />
      </div>
    </>
  )
}
