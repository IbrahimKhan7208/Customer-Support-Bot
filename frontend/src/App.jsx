import React, { useState } from "react";
import { LuBotMessageSquare } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa";
import { GoArrowUp } from "react-icons/go";
import axios from "axios";
import Markdown from "react-markdown";

const App = () => {
  const [text, setText] = useState("");
  const [message, setMessage] = useState([]);
  const [loading, setLoading] = useState(false)

  const submitHandler = async () => {
    try {
      setMessage((prev) => [...prev, { role: "user", contentUser: text }]);
      setText("");
      setLoading(true)
      setMessage((prev)=> [...prev, {role: "assistant", contentBot: "Fetching", isLoading: true}])

      let res = await axios.post("https://customer-support-bot-backend-r3c4.onrender.com/llm", { text });

      setMessage((prev) => {
        const newMessage = [...prev]
        newMessage[newMessage.length - 1] = { role: "assistant", contentBot: res.data, isLoading: false }
        return newMessage
      });

      setLoading(false)
      
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitHandler();
    }
  };

  return (
    <div className="w-full h-screen bg-zinc-300 flex flex-col items-center pt-5 font-semibold">
      <div className="title flex flex-col items-center">
        <p className="flex items-center gap-1 text-2xl bg-blue-300 p-2 rounded-2xl tracking-tight ring-2 ring-blue-800">
          <LuBotMessageSquare className="text-blue-800 text-3xl" />
          CareChat
        </p>
        <p className="text-xl tracking-tighter mt-1 text-zinc-700">
          ShopVerse - Customer Support Assistant - Updated with the latest company manuals and FAQs.
        </p>
      </div>

      <div className="chatbox relative bg-zinc-200 w-2/3 h-10/12 mt-4 rounded-xl shadow-xl py-4 overflow-y-auto">

        {message.map((msg, index) => {
          return (
            <div key={index} className="chat pl-5 pr-5 mb-12">
              {msg.role === "user" ? (
                <div className="user flex justify-end gap-2 m-1">
                  <p className="bg-blue-400 w-fit p-2 rounded-2xl">
                    {msg.contentUser}
                  </p>
                  <FaRegUser className="border-2 border-black rounded-full text-3xl p-1" />
                </div>
              ) : (
                <p className="assistant flex gap-2">
                  <LuBotMessageSquare className="text-blue-200 bg-blue-700 rounded-full text-4xl p-1.5 w-fit" />
                  <p className="w-fit">
                    {msg.isLoading ? <p className="animate-pulse">Fetching...</p> : <Markdown>{msg.contentBot}</Markdown>}
                  </p>
                </p>
              )}
            </div>
          );
        })}

        <div className="input fixed bottom-7 left-1/2 -translate-x-1/2 w-1/3">
          <div className="relative">
            <input
              name="text"
              id="text"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
              }}
              onKeyUp={handleKeyPress}
              type="text"
              placeholder="Type a message"
              className="w-full h-12 rounded-2xl shadow-lg bg-white border-2 border-zinc-300 focus:ring-2 focus:ring-blue-500 pl-4 pr-12 text-black font-normal outline-none"
            />

            <button
              onClick={submitHandler}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xl p-2 bg-zinc-700 text-white rounded-full hover:bg-zinc-800"
            >
              <GoArrowUp />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
