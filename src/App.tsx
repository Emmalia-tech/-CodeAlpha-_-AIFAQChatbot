import { useState, useRef } from "react";

const faqs = [
  { question: "What is Artificial Intelligence?", answer: "Artificial Intelligence (AI) is the ability of computers to perform tasks that normally require human intelligence, such as learning, reasoning, and problem-solving." },
  { question: "What is Machine Learning?", answer: "Machine Learning is a type of AI that allows computers to learn from data and improve their performance without being explicitly programmed." },
  { question: "What is Deep Learning?", answer: "Deep Learning is a subset of Machine Learning that uses neural networks with many layers to analyze and learn from large amounts of data." },
  { question: "What is a Neural Network?", answer: "A Neural Network is a system of algorithms modeled after the human brain that helps computers recognize patterns and solve complex problems." },
  { question: "What is Natural Language Processing?", answer: "Natural Language Processing (NLP) is a branch of AI that helps computers understand, interpret, and generate human language." },
  { question: "What is Computer Vision?", answer: "Computer Vision is a field of AI that enables computers to interpret and understand visual information from the world, like images and videos." },
  { question: "What is ChatGPT?", answer: "ChatGPT is an AI chatbot developed by OpenAI that can understand and generate human-like text conversations." },
  { question: "What is a Large Language Model?", answer: "A Large Language Model (LLM) is a type of AI trained on massive amounts of text data to understand and generate human language." },
  { question: "What is the difference between AI and ML?", answer: "AI is the broad concept of machines performing smart tasks, while Machine Learning is a specific technique used to achieve AI by learning from data." },
  { question: "Is AI dangerous?", answer: "AI has both benefits and risks. While it can solve many problems, experts emphasize the importance of responsible development and ethical guidelines to ensure AI is safe and beneficial." },
  { question: "What are the types of AI?", answer: "There are three types of AI: Narrow AI (designed for specific tasks), General AI (human-level intelligence), and Super AI (surpasses human intelligence). Currently only Narrow AI exists." },
  { question: "What is robotics?", answer: "Robotics is a field that combines AI and engineering to design and build robots that can perform tasks automatically or semi-automatically." },
  { question: "What is data science?", answer: "Data Science is a field that uses scientific methods, algorithms, and AI to extract knowledge and insights from structured and unstructured data." },
  { question: "What is a chatbot?", answer: "A chatbot is a computer program that simulates human conversation using AI and Natural Language Processing to answer questions automatically." },
  { question: "What is reinforcement learning?", answer: "Reinforcement Learning is a type of Machine Learning where an AI agent learns by interacting with its environment and receiving rewards or penalties for its actions." },
  { question: "What is supervised learning?", answer: "Supervised Learning is a type of Machine Learning where the model is trained on labeled data — meaning the correct answers are provided during training." },
  { question: "What is unsupervised learning?", answer: "Unsupervised Learning is a type of Machine Learning where the model finds patterns in data without being given labeled examples." },
  { question: "What is an algorithm?", answer: "An algorithm is a set of step-by-step instructions that a computer follows to solve a problem or complete a task." },
  { question: "What is big data?", answer: "Big Data refers to extremely large datasets that cannot be processed by traditional methods. AI and Machine Learning are often used to analyze big data." },
  { question: "What is automation?", answer: "Automation is the use of technology and AI to perform tasks with minimal human intervention, increasing efficiency and reducing errors." },
  { question: "What is a recommendation system?", answer: "A recommendation system is an AI system that suggests products, movies, music, or content based on a user's past behavior and preferences — like Netflix or Spotify recommendations." },
  { question: "What is image recognition?", answer: "Image recognition is an AI technology that identifies and classifies objects, people, or scenes in images and videos." },
  { question: "What is speech recognition?", answer: "Speech recognition is an AI technology that converts spoken words into text — used in virtual assistants like Siri and Google Assistant." },
  { question: "What is a virtual assistant?", answer: "A virtual assistant is an AI-powered software that can understand voice commands and help with tasks like setting reminders, answering questions, and controlling smart devices." },
  { question: "What is autonomous driving?", answer: "Autonomous driving is the use of AI, sensors, and cameras to enable vehicles to navigate and drive without human input." },
  { question: "What is AI ethics?", answer: "AI ethics is a set of guidelines and principles that ensure AI systems are developed and used in a fair, transparent, and responsible way that benefits humanity." },
  { question: "What is generative AI?", answer: "Generative AI is a type of AI that can create new content such as text, images, music, and videos — examples include ChatGPT and DALL-E." },
  { question: "What is transfer learning?", answer: "Transfer Learning is a Machine Learning technique where a model trained on one task is reused and fine-tuned for a different but related task." },
  { question: "What is bias in AI?", answer: "Bias in AI occurs when an AI system produces unfair or discriminatory results due to biased training data or flawed algorithms." },
  { question: "What is the future of AI?", answer: "The future of AI includes advances in healthcare, education, climate change solutions, and more. Experts believe AI will transform every industry while emphasizing the need for ethical development." },
];

function findAnswer(question: string): string {
  const q = question.toLowerCase();
  const match = faqs.find(faq =>
    faq.question.toLowerCase().split(" ").some(word => word.length > 3 && q.includes(word))
  );
  return match ? match.answer : "I'm sorry, I don't have an answer for that. Try asking about AI, Machine Learning, Deep Learning, ChatGPT, Neural Networks, NLP, Computer Vision, or the Future of AI!";
}

interface Message {
  text: string;
  sender: "user" | "bot";
}

const initialMessages: Message[] = [
  { text: "Hi! I'm Emefa Emerald AI Bot 🤖 Ask me anything about Artificial Intelligence! You can type or use the 🎤 mic button to speak!", sender: "bot" }
];

export default function App() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const sendMessage = (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;
    const userMessage: Message = { text: msg, sender: "user" };
    const answer = findAnswer(msg);
    const botMessage: Message = { text: answer, sender: "bot" };
    setMessages(prev => [...prev, userMessage, botMessage]);
    setInput("");
    speak(answer);
  };

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser. Please use Chrome!");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      sendMessage(transcript);
    };
    recognition.start();
    recognitionRef.current = recognition;
  };

  const clearChat = () => {
    setMessages(initialMessages);
    window.speechSynthesis.cancel();
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f0c29", display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 16px", fontFamily: "sans-serif" }}>
      <h1 style={{ color: "#fff", fontSize: "28px", marginBottom: "4px" }}>🤖 Emefa Emerald AI Bot</h1>
      <p style={{ color: "#94a3b8", marginBottom: "24px" }}>Your AI FAQ Chatbot — Type or Speak your question!</p>

      <div style={{ width: "100%", maxWidth: "680px", background: "rgba(255,255,255,0.07)", borderRadius: "20px", padding: "20px", display: "flex", flexDirection: "column", height: "500px" }}>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
          <button onClick={clearChat} style={{ padding: "6px 14px", background: "#dc2626", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", cursor: "pointer" }}>
            ✕ Clear Chat
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", marginBottom: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", justifyContent: msg.sender === "user" ? "flex-end" : "flex-start" }}>
              <div style={{
                maxWidth: "75%",
                padding: "12px 16px",
                borderRadius: msg.sender === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                background: msg.sender === "user" ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "rgba(255,255,255,0.1)",
                color: "#fff",
                fontSize: "14px",
                lineHeight: "1.5"
              }}>
                {msg.sender === "bot" && <span style={{ marginRight: "6px" }}>🤖</span>}
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask me about AI..."
            style={{ flex: 1, padding: "12px 16px", borderRadius: "10px", background: "#1e1b4b", color: "#fff", border: "1px solid #3730a3", fontSize: "14px", outline: "none" }}
          />
          <button onClick={startListening} style={{ padding: "12px 16px", background: listening ? "#dc2626" : "#059669", color: "#fff", border: "none", borderRadius: "10px", fontSize: "18px", cursor: "pointer" }} title="Click to speak">
            {listening ? "⏹" : "🎤"}
          </button>
          <button onClick={() => sendMessage()} style={{ padding: "12px 20px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", border: "none", borderRadius: "10px", fontSize: "16px", cursor: "pointer" }}>
            ➤
          </button>
        </div>
      </div>

      <div style={{ marginTop: "20px", width: "100%", maxWidth: "680px" }}>
        <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "10px" }}>💡 Try asking:</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {["What is AI?", "What is Machine Learning?", "What is ChatGPT?", "Is AI dangerous?", "What is generative AI?", "What is the future of AI?"].map(q => (
            <button key={q} onClick={() => sendMessage(q)} style={{ padding: "6px 14px", background: "rgba(99,102,241,0.2)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "20px", fontSize: "13px", cursor: "pointer" }}>
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}