import { useState } from "react"
import "./App.css"
import { FaUser, FaRobot, FaPaperPlane, FaTrashAlt } from "react-icons/fa"
import harshLogo from "./assets/WhatsApp Image 2025-08-12 at 21.43.23_567d0a46.jpg"
import { URL } from "./constent"

function App() {
  const [question, setQuestion] = useState("")
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const askQuestion = async () => {
    const text = question.trim()
    if (!text) return

    const userMessage = { role: "user", text }
    setMessages((prev) => [...prev, userMessage])
    setQuestion("")
    setLoading(true)

    const payload = { contents: [{ parts: [{ text }] }] }

    try {
      const res = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response received."
      const botMessage = { role: "bot", text: reply }
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Something went wrong. Please try again!" },
      ])
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => setMessages([])

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col">
      {/* 🔹 Header */}
      <header className="bg-blue-600 p-3 text-center font-semibold text-lg sm:text-xl">
        <h1 className="flex justify-center items-center gap-2 flex-wrap">
          <FaRobot className="text-white" /> Harsh Choudhary AI Chat
        </h1>
      </header>

      {/* 🔹 Main Layout */}
      <div className="flex flex-1 flex-col sm:flex-row">
        {/* Sidebar (Hidden on small screens) */}
        <aside className="w-full sm:w-1/4 bg-zinc-800 flex flex-col items-center justify-center p-4 border-b sm:border-b-0 sm:border-r border-zinc-700">
          <img
            src={harshLogo}
            alt="Harsh"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-blue-400 mb-3"
          />
          <h2 className="text-lg font-semibold mb-1 text-center">
            Harsh Choudhary
          </h2>
          <p className="text-sm text-zinc-400 mb-4 text-center px-2">
            AI enthusiast. Always learning and exploring new technologies.
          </p>

          <button
            onClick={clearChat}
            className="flex items-center justify-center gap-2 bg-red-600 px-3 py-2 rounded-lg hover:bg-red-700 text-sm sm:text-base"
          >
            <FaTrashAlt /> Clear
          </button>
        </aside>

        {/* 🔹 Chat Section */}
        <main className="flex-1 flex flex-col justify-between bg-zinc-900">
          {/* Messages area */}
          <div className="p-4 overflow-y-auto space-y-4 flex-1">
            {messages.length === 0 && (
              <p className="text-center text-zinc-400 mt-10 text-sm sm:text-base">
                💬 Start chatting with Harsh AI...
              </p>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`p-3 rounded-xl max-w-[85%] sm:max-w-[70%] break-words ${msg.role === "user"
                      ? "bg-blue-600 text-right"
                      : "bg-zinc-800 text-left"
                    }`}
                >
                  {msg.role === "user" ? (
                    <FaUser className="inline mr-2" />
                  ) : (
                    <FaRobot className="inline mr-2 text-blue-400" />
                  )}
                  <span className="text-sm sm:text-base">{msg.text}</span>
                </div>
              </div>
            ))}

            {loading && (
              <p className="text-zinc-400 text-sm mt-2">🤔 Thinking...</p>
            )}
          </div>

          {/* 🔹 Input area */}
          <div className="p-3 bg-zinc-800 flex flex-col sm:flex-row items-center gap-2 border-t border-zinc-700 mb-5">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && askQuestion()}
              placeholder="Type your question..."
              className="w-full sm:flex-1 bg-transparent border border-zinc-600 rounded-lg p-2 text-white outline-none text-sm sm:text-base"
            />
            <button
              onClick={askQuestion}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-blue-600 w-full sm:w-auto px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm sm:text-base"
            >
              <FaPaperPlane /> Send
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
