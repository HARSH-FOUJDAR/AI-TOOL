import { useState } from "react"
import "./App.css"
import { FaUser, FaRobot, FaPaperPlane, FaTrashAlt } from "react-icons/fa"
import harshLogo from "./assets/WhatsApp Image 2025-08-12 at 21.43.23_567d0a46.jpg"
import { URL } from "./constent"

function App() {
  // States
  const [question, setQuestion] = useState("") // user ke input ke liye
  const [messages, setMessages] = useState([]) // chat history store karega
  const [loading, setLoading] = useState(false) // loading indicator

  // Question bhejne ka function
  const askQuestion = async () => {
    const text = question.trim()
    if (!text) return

    // User ka message chat me add kar do
    const userMessage = { role: "user", text }
    setMessages((prev) => [...prev, userMessage])
    setQuestion("")
    setLoading(true)

    // Request body
    const payload = {
      contents: [{ parts: [{ text }] }],
    }

    try {
      // API call
      const res = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received."

      // Bot ka message chat me add kar do
      const botMessage = { role: "bot", text: reply }
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      // Agar kuch galat hua to
      const errorMessage = {
        role: "bot",
        text: "⚠️ Something went wrong. Please try again!",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  // Chat clear karne ka function
  const clearChat = () => setMessages([])

  return (
    <div className="h-screen bg-zinc-900 text-white flex flex-col">
      {/* Top Header */}
      <header className="bg-blue-600 p-3 text-center font-semibold">
        <h1 className="flex justify-center items-center gap-2">
          <FaRobot /> Harsh choudhary AI Chat
        </h1>
      </header>

      {/* Sidebar (Left Image) */}
      <div className="flex flex-1">
        <aside className="w-1/4 bg-zinc-800 flex flex-col items-center justify-center p-4">
          <img
            src={harshLogo}
            alt="Harsh"
            className="w-24 h-24 rounded-full border-2 border-blue-400 mb-3"
          />
          <h2 className="text-lg font-semibold mb-1">Harsh Choudhary</h2>
          <p className="text-sm text-zinc-400 mb-4 text-center">
            AI enthusiast. Always learning and exploring new technologies.
          </p>
          
          <button
            onClick={clearChat}
            className="flex items-center gap-2 bg-red-600 px-3 py-2 rounded-lg hover:bg-red-700"
          >
            <FaTrashAlt /> Clear
          </button>
        </aside>

        {/* Chat Section */}
        <main className="flex-1 flex flex-col justify-between bg-zinc-900">
          <div className="p-4 overflow-y-auto space-y-4">
            {/* Jab chat khali ho */}
            {messages.length === 0 && (
              <p className="text-center text-zinc-400 mt-10">
                💬 Start chatting with Harsh AI...
              </p>
            )}

            {/* Messages list */}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-3 rounded-xl max-w-[70%] ${
                    msg.role === "user"
                      ? "bg-blue-600 text-right"
                      : "bg-zinc-800 text-left"
                  }`}
                >
                  {msg.role === "user" ? (
                    <FaUser className="inline mr-2" />
                  ) : (
                    <FaRobot className="inline mr-2 text-blue-400" />
                  )}
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <p className="text-zinc-400 text-sm mt-2">🤔 Thinking...</p>
            )}
          </div>

          {/* Input area */}
          <div className="p-3 bg-zinc-800 flex items-center gap-2 border-t border-zinc-700">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && askQuestion()}
              placeholder="Type your question..."
              className="flex-1 bg-transparent border border-zinc-600 rounded-lg p-2 text-white outline-none"
            />
            <button
              onClick={askQuestion}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
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
