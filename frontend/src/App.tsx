import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

type CustomData = {
  id: string,
  title: string,
  description: string,
  completed: boolean,
}

function App() {

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io('http://localhost:3000');
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log("ws connected");
      socket.on('data', ()=>{
        console.log(data);
      })
    });

    return () => {
      socket.disconnect();
      console.log("ws disconnected");
    };

  }, [])

  const [data, setData] = useState<CustomData[] | null>(null);

  return (
    <>
      <div className="w-full h-full text-black flex flex-col">
        <div>

        </div>
      </div>
    </>
  )
}

export default App
