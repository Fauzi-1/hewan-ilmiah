import React, { useState, useRef, useEffect } from 'react';
import axios from '../api/api';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatRef = useRef(null);

  // Ambil riwayat dari localStorage saat pertama kali load
  useEffect(() => {
    const stored = localStorage.getItem('chatbotHistory');
    if (stored) {
      setMessages(JSON.parse(stored));
    } else {
      const initial = [{ sender: 'bot', text: 'Halo! Aku chatbot edukasi. Tanyakan tentang hewan langka!' }];
      setMessages(initial);
      localStorage.setItem('chatbotHistory', JSON.stringify(initial));
    }
  }, []);

  // Auto scroll ke bawah jika ada pesan baru
  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const updateMessages = (newMessages) => {
    setMessages(newMessages);
    localStorage.setItem('chatbotHistory', JSON.stringify(newMessages));
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    const tempMessages = [...messages, userMessage];
    updateMessages(tempMessages);

    try {
      const res = await axios.post('/chatbot/ask', { message: input });
      const reply = res?.data?.response?.trim() || 'Maaf, saya tidak mengerti pertanyaanmu.';
      const botMessage = { sender: 'bot', text: reply };
      updateMessages([...tempMessages, botMessage]);
    } catch (error) {
      console.error('Error chatbot:', error);
      const botMessage = { sender: 'bot', text: 'Terjadi kesalahan. Silakan coba lagi nanti.' };
      updateMessages([...tempMessages, botMessage]);
    }

    setInput('');
  };

  const handleClearChat = () => {
    const initial = [{ sender: 'bot', text: 'Halo! Aku chatbot edukasi. Tanyakan tentang hewan langka!' }];
    setMessages(initial);
    localStorage.setItem('chatbotHistory', JSON.stringify(initial));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-green-50 to-white px-4">
      <div className="w-full max-w-3xl p-6 bg-white shadow-lg rounded-lg border border-gray-200 flex flex-col h-[80vh]">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-4">Chatbot Edukasi</h2>

        <div className="flex-1 overflow-y-auto bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-2 p-2 rounded-md w-fit max-w-xs ${
                msg.sender === 'user'
                  ? 'ml-auto bg-green-200 text-right'
                  : 'mr-auto bg-gray-200'
              }`}
            >
              {msg.text}
            </div>
          ))}
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
          <button
            onClick={handleClearChat}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Hapus Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
