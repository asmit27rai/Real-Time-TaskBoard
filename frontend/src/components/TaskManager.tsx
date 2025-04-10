import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Task, createTask, updateTask, deleteTask, getTasks } from '../services/api'
import { Edit2, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router'

type Props = {
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
}

export default function TaskManager({ tasks = [], setTasks }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [completed, setCompleted] = useState(false)
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(()=>{
    getTasks();
  }, [tasks])

  const clearForm = () => {
    setTitle('')
    setDescription('')
    setCompleted(false)
    setEditingId(null)
  }

  const handleAdd = async () => {
    if (!title.trim()) return toast.error('Title is required')
    try {
      const { data } = await createTask({ title, description, completed })
      setTasks(prev => [...prev, data])
      clearForm()
      toast.success('Task added')
    } catch {
      toast.error('Failed to add task')
    }
  }

  const handleUpdate = async () => {
    if (!editingId) return
    try {
      const { data } = await updateTask(editingId, { title, description, completed })
      setTasks(prev => prev.map(t => (t.id === editingId ? data : t)))
      clearForm()
      toast.success('Task updated')
    } catch {
      toast.error('Failed to update')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id)
      setTasks(prev => prev.filter(t => t.id !== id))
      toast('Task deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  const startEdit = (t: Task) => {
    setEditingId(t.id)
    setTitle(t.title)
    setDescription(t.description)
    setCompleted(t.completed)
  }

  const filtered = (tasks || [])
    .filter(t =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => Number(a.completed) - Number(b.completed))


  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={completed}
            onChange={e => setCompleted(e.target.checked)}
            className="w-5 h-5"
          />
          <span className="text-gray-700">Show Completed</span>
        </label>
        <Link to={'/dashboard'} target="_blank">
          <button className='px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700'>Database Watcher</button>
        </Link>
      </div>

      {/* Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">
          {editingId ? 'Edit Task' : 'New Task'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <input
            className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={completed}
                onChange={e => setCompleted(e.target.checked)}
                className="w-5 h-5"
              />
              <span>Completed</span>
            </label>
            {editingId ? (
              <div className='flex flex-col gap-2'>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
                >
                  Update
                </button>
                <button
                  onClick={clearForm}
                  className="px-4 py-2 bg-gray-400 text-white rounded shadow hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700"
              >
                Add Task
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Task List */}
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {filtered.map(task => (
            <motion.li
              key={task.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-4 rounded-lg shadow flex flex-col justify-between"
            >
              <div>
                <h3
                  className={`text-xl font-bold ${task.completed ? 'line-through text-gray-500' : ''
                    }`}
                >
                  {task.title}
                </h3>
                <p className="mt-2 text-gray-700">{task.description}</p>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => startEdit(task)}
                  className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  aria-label="Edit"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                  aria-label="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  )
}
