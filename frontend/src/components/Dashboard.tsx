import React, { useEffect, useState } from 'react';

interface Task {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]); // State to store tasks

  useEffect(() => {
    // WebSocket connection to backend
    const socket = new WebSocket('ws://localhost:8080'); // Make sure this is the correct WebSocket endpoint

    // When a message is received
    socket.onmessage = (event) => {
      try {
        const taskData = JSON.parse(event.data); // Parse the incoming task data
        const task: Task = taskData.task; // Assuming the incoming message has a task object

        // Update state based on operation type (insert, update, delete)
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

    // Cleanup WebSocket connection on component unmount
    return () => {
      socket.close();
    };
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <small>Created at: {task.createdAt}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
