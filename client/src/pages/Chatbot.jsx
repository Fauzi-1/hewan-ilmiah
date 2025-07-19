import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = ({ onOpenModal }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);

  const updateMessages = (newMessages) => {
    setMessages(newMessages);
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

      // Jika format jawaban "Image:Nama Hewan"
      if (reply.startsWith("Image:")) {
        const animalName = reply.replace("Image:", "").trim();
        try {
          const detailRes = await axios.get(`/animals?name=${encodeURIComponent(animalName)}`);
          const animal = detailRes.data;

          if (animal) {
            const botText = {
              sender: 'bot',
              text: `Ini ${animal.name}. ${animal.description || ''}`,
            };
            const botImage = {
              sender: 'bot',
              image: animal.image,
              name: animal.name,
            };

            setTimeout(() => {
              updateMessages([...tempMessages, botText, botImage]);
              setTyping(false);
            }, 600);
            return;
          }
        } catch (err) {
          console.error('Gagal mengambil data hewan:', err);
        }
      }

      // Default: Balasan teks biasa
      const botMessage = { sender: 'bot', text: reply };
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md p-4">
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs px-3 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
              {msg.image ? (
                <img
                  src={msg.image}
                  alt={msg.name || 'gambar'}
                  className="w-48 h-auto cursor-pointer rounded"
                  onClick={() => onOpenModal && onOpenModal(msg.name)}
                />
              ) : (
                <p>{msg.text}</p>
              )}
            </div>
          </div>
        ))}
        {typing && <div className="text-sm text-gray-500">Bot sedang mengetik...</div>}
      </div>
      <div className="flex">
        <input
          className="flex-1 border border-gray-300 rounded-l px-3 py-2 focus:outline-none"
          type="text"
          placeholder="Ketik pertanyaanmu..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
          onClick={handleSend}
        >
          Kirim
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
