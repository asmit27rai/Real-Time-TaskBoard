import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

type Tasks = {
    _id : number;
    title : string;
    description : string;
    status : string;
}

const TaskManager = () => {
    const [tasks, setTasks] = useState<Tasks[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("Pending");
    const [search, setSearch] = useState("");
    // const [filterPriority, setFilterPriority] = useState("All");
    const [filterStatus, setFilterStatus] = useState("All");
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null)

    const token = localStorage.getItem("token");

    const fetchTasks = async () => {
        try {
            const res = await axios.get("http://localhost:3000/tasks");
            setTasks(res.data);
        } catch (error) {
            console.error("Error fetching tasks", error);
        }
    };

    useEffect(()=>{
        fetchTasks();
    }, )

    const addTask = async () => {
        if (!title.trim())
            return alert("Enter a valid title and deadline!");
        const newTask = { title, description, status };

        try {
            const res = await axios.post(
                "http://localhost:8080/tasks",
                newTask
            );
            setTasks([...tasks, res.data]);
            clearForm();
        } catch (error) {
            console.error("Error adding task", error);
        }
    };

    const updateTask = async () => {
        if (!title.trim()) {
            return toast("Title and deadline are required!");
        }

        try {
            const res = await axios.put(
                `http://localhost:8080/tasks/${editingTaskId}`,
                { title, description, status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setTasks(tasks.map(task =>
                task._id === editingTaskId ? res.data : task
            ));
            cancelEdit();
        } catch (error : any) {
            console.error("Update failed:", error.response?.data || error.message);
            alert("Failed to update task: " + (error.response?.data?.message || error.message));
        }
    };

    const deleteTask = async (id : number) => {
        try {
            await axios.delete(`http://localhost:8080/tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(tasks.filter((task) => task._id !== id));
        } catch (error) {
            console.error("Error deleting task", error);
        }
    };

    const startEdit = (task : Tasks) => {
        setEditingTaskId(task._id);
        setTitle(task.title);
        setDescription(task.description);
        setStatus(task.status);
    };

    const cancelEdit = () => {
        setEditingTaskId(null);
        clearForm();
    };

    const clearForm = () => {
        setTitle("");
        setDescription("");
        setStatus("Pending");
    };

    const filteredTasks = tasks.filter(
        (task) =>
            (filterStatus === "All" || task.status === filterStatus) &&
            task.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-4">Task Management System</h1>

            {/* Form */}
            <div className="flex flex-wrap gap-3 mb-4">
                <input
                    className="p-2 border rounded"
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    className="p-2 border rounded"
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <select
                    className="p-2 border rounded"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option>Pending</option>
                    <option>Completed</option>
                </select>

                {editingTaskId ? (
                    <>
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                            onClick={updateTask}
                        >
                            Update Task
                        </button>
                        <button
                            className="px-4 py-2 bg-gray-500 text-white rounded"
                            onClick={cancelEdit}
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <button
                        className="px-4 py-2 bg-green-500 text-white rounded"
                        onClick={addTask}
                    >
                        Add Task
                    </button>
                )}
            </div>

            {/* Task Table */}
            <table className="w-full max-w-4xl bg-white shadow-md rounded border border-gray-200">
                <thead>
                    <tr className="bg-gray-800 text-white">
                        <th className="p-2">Title</th>
                        <th className="p-2">Description</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTasks.map((task) => (
                        <tr key={task._id} className="text-center border-b">
                            <td className="p-2">{task.title}</td>
                            <td className="p-2">{task.description}</td>
                            <td className="p-2">{task.status}</td>
                            <td className="p-2 flex justify-center gap-2">
                                <button
                                    className="px-2 py-1 bg-blue-500 text-white rounded"
                                    onClick={() => startEdit(task)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="px-2 py-1 bg-red-500 text-white rounded"
                                    onClick={() => deleteTask(task._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TaskManager;