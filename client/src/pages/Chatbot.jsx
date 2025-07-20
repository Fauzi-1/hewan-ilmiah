import React, { useState, useRef, useEffect } from 'react';
import axios from '../api/api';
import backgroundImage from '../assets/hero_bg.jpg';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('chatbotHistory');
    if (stored) {
      setMessages(JSON.parse(stored));
    } else {
      const initial = [{ sender: 'bot', text: 'Halo! Aku chatbot website ini. Kamu bisa tanya sesuatu tentang hewan langka ke aku!' }];
      setMessages(initial);
      localStorage.setItem('chatbotHistory', JSON.stringify(initial));
    }
  }, []);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const updateMessages = (newMessages) => {
    setMessages(newMessages);
    localStorage.setItem('chatbotHistory', JSON.stringify(newMessages));
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    const tempMessages = [...messages, userMessage];
    updateMessages(tempMessages);
    setInput('');
    setTyping(true);

    try {
      const res = await axios.post('/chatbot/ask', { message: input });
      const reply = res?.data?.response?.trim() || 'Maaf, saya tidak mengerti pertanyaanmu.';
      const botMessage = {
        sender: 'bot',
        text: reply,
        image: res?.data?.image || null,
        name: res?.data?.name || null,
      };

      setTimeout(() => {
        updateMessages([...tempMessages, botMessage]);
        setTyping(false);
      }, 600);
    } catch (error) {
      console.error('Chatbot error:', error);
      const botMessage = { sender: 'bot', text: 'Terjadi kesalahan. Coba lagi nanti.' };
      setTimeout(() => {
        updateMessages([...tempMessages, botMessage]);
        setTyping(false);
      }, 600);
    }
  };

  const handleClearChat = () => {
    const initial = [{ sender: 'bot', text: 'Halo! Aku chatbot website ini. Kamu bisa tanya sesuatu tentang hewan langka ke aku!' }];
    updateMessages(initial);
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat px-4"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="w-full max-w-3xl p-6 bg-white/90 backdrop-blur-sm shadow-lg rounded-lg border border-gray-200 flex flex-col h-[80vh]">
        <h2 className="text-2xl font-bold text-center text-green-700">Chatbot</h2>

        <div className="flex justify-end mb-2">
          <button
          className="text-red-500 hover:text-red-700 text-xl sm:text-2xl"
          title="Hapus Chat"
          onClick={handleClearChat}
          >
            🗑️
          </button>
        </div>
            <div className="flex-1 overflow-y-auto bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4 space-y-3">
              {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`px-4 py-2 rounded-xl text-sm w-fit max-w-[80%] break-words ${
                  msg.sender === 'user'
                    ? 'ml-auto bg-green-200 text-right'
                    : 'mr-auto bg-gray-200 text-left'
                }`}
              >
                {/* Tampilkan gambar jika ada */}
                {msg.image ? (
                  <div className="space-y-2">
                    <p className="font-semibold">{msg.text}</p>
                    <img
                      src={msg.image}
                      alt={msg.name || 'Gambar Hewan'}
                      className="rounded max-w-xs"
                    />
                    {msg.description && (
                      <p className="text-xs text-gray-600">{msg.description}</p>
                    )}
                  </div>
                ) : (
                  <p>{msg.text}</p>
                )}
              </div>
            ))}
          {typing && (
            <div className="text-sm text-gray-500 italic animate-pulse">Bot sedang mengetik...</div>
          )}

          <div ref={chatRef} />
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Tanya sesuatu..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleSend}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Kirim
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
