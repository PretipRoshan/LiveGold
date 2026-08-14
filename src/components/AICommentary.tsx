import React, { useState, useRef, useEffect } from 'react';

// 1. We define the Message type right here so TypeScript knows what it is!
export interface Message {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: Date;
}

interface AICommentaryProps {
  commentary: string;
  onRefreshCommentary: () => void;
  isGenerating: boolean;
  hasApiKey: boolean;
}

export default function AICommentary({ 
  commentary, 
  onRefreshCommentary, 
  isGenerating, 
  hasApiKey 
}: AICommentaryProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // 2. We tell the state to use the Message type instead of "any[]"
  const [messages, setMessages] = useState<Message[]>([]);

  // Auto-scroll to the bottom of the chat when a new message arrives
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessageText = input.trim();
    setInput('');
    
    // 1. Add User Message to Chat
    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: 'user',
      text: userMessageText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // 2. Fetch API Key from your .env file
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: 'ai',
          text: "Error: API Key missing. Please check your .env file.",
          timestamp: new Date(),
        },
      ]);
      setIsLoading(false);
      return;
    }

    try {
      // 3. Build the payload including a system prompt to keep it focused on gold
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `You are an expert gold market analyst dashboard assistant. Answer the user's question accurately regarding gold, trading, or finance. Use PLAIN TEXT ONLY. Do not use asterisks, bolding, or markdown formatting. User question: ${userMessageText}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't process that request.";
const aiResponseText = rawText.replace(/\*/g, '');
      // 4. Add AI Message to Chat
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: 'ai',
          text: aiResponseText,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: 'ai',
          text: "Sorry, I'm having trouble connecting to the server right now.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '500px', border: '1px solid #333', borderRadius: '8px', background: '#1e1e1e', color: '#fff' }}>
      {/* Chat Messages Box */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.sender === 'user' ? '#007acc' : '#333',
              padding: '10px 14px',
              borderRadius: '12px',
              maxWidth: '75%',
              wordBreak: 'break-word',
            }}
          >
            <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>{msg.text}</p>
          </div>
        ))}
        {isLoading && (
          <div style={{ alignSelf: 'flex-start', backgroundColor: '#333', padding: '10px 14px', borderRadius: '12px', opacity: 0.7 }}>
            AI is thinking...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSendMessage} style={{ display: 'flex', borderTop: '1px solid #333', padding: '10px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about gold trends..."
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #444',
            background: '#2d2d2d',
            color: '#fff',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={isLoading}
          style={{
            marginLeft: '8px',
            padding: '0 16px',
            background: '#007acc',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}