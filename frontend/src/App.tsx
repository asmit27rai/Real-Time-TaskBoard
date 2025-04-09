import { useEffect } from "react";
import TaskManager from "./components/TaskManager";

// type CustomData = {
//   id: string,
//   title: string,
//   description: string,
//   completed: boolean,
// }

function App() {


  useEffect(() => {

    const socket = new WebSocket('ws://localhost:8080/ws');

    socket.onopen = () => {
      console.log('ws connected');
    }
    socket.onmessage = (event) => {
      console.log(event.data);
    }

    return socket.close = () => {
      console.log('ws disconnected');
    }

  }, [])

  // const [data, setData] = useState<CustomData[] | null>(null);

  return (
    <>
      <div className="w-full h-full text-black flex flex-col">
        <div>
          <TaskManager/>
        </div>
      </div>
    </>
  )
}

export default App
