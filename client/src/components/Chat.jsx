import io from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io("/");

function useMessages() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("server:message", receiveMessage);

    return () => socket.off("server:message", receiveMessage);
  }, []);

  const receiveMessage = (message) =>
    setMessages((state) => [...state, message]);

  return { messages, receiveMessage };
}

export function Chat() {
  const [message, setMessage] = useState("");
  const { messages, receiveMessage } = useMessages();

  const handleChange = (e) => setMessage(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newMessage = {
      body: message,
      from: "Me",
    };

    receiveMessage(newMessage);
    socket.emit("client:message", message);
  };

  return (
    <main className="h-screen bg-zinc-800 text-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-zinc-900 p-10">
        <h1 className="text-2xl font-bold my-2">Chat React</h1>
        <input
          type="text"
          placeholder="Write your message..."
          className="border-2 border-zinc-500 p-2 w-full text-black"
          onChange={handleChange}
        />
        <ul>
          {messages.map((message, index) => (
            <li
              key={index}
              className={`my-2 p-2 table rounded-md ${
                message.from === "Me"
                  ? "bg-sky-700 ml-auto"
                  : "bg-black mr-auto"
              } `}
            >
              <b>{message.from}</b>: {message.body}
            </li>
          ))}
        </ul>
      </form>
    </main>
  );
}
