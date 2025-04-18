import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getTasks } from '../services/api';

interface Task {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]); // State to store tasks

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080/ws');

    socket.onmessage = (event) => {
      try {
        const taskData = JSON.parse(event.data);
        const task: Task = taskData.task;

        if (taskData.type === 'insert') {
          setTasks((prevTasks) => [...prevTasks, task]);
        } else if (taskData.type === 'update') {
          setTasks((prevTasks) =>
            prevTasks.map((t) => (t._id === task._id ? task : t))
          );
        } else if (taskData.type === 'delete') {
          setTasks((prevTasks) => prevTasks.filter((t) => t._id !== task._id));
        }
      } catch (err) {
        console.error('Error parsing task data:', err);
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-4xl font-bold text-center text-gray-800">📋 Database Watcher</h1>

      <ul className="grid gap-6 sm:grid-cols-2">
        {tasks.map((task) => (
          <motion.li
            key={task._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white shadow-lg rounded-lg p-5 border-l-4 border-blue-500 hover:shadow-xl transition"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {task.title}
            </h3>
            <p className="text-gray-600 mb-2">{task.description}</p>
            <small className="text-gray-400">
              Created: {new Date(task.createdAt).toLocaleString()}
            </small>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
