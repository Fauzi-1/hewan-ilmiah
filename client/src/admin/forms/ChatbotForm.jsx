import React, { useState, useEffect } from 'react';
import axios from '../../api/api';

const ChatbotForm = ({ selectedChatbot, fetchChatbots, onReset }) => {
  const [questionPattern, setQuestionPattern] = useState('');
  const [response, setResponse] = useState('');

  useEffect(() => {
    if (selectedChatbot) {
      setQuestionPattern(selectedChatbot.questionPattern);
      setResponse(selectedChatbot.response);
    } else {
      resetForm();
    }
  }, [selectedChatbot]);

  const resetForm = () => {
    setQuestionPattern('');
    setResponse('');
    if (onReset) onReset();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (selectedChatbot) {
        await axios.put(`/chatbot/${selectedChatbot._id}`, { questionPattern, response }, config);
        alert('Chatbot berhasil diperbarui!');
      } else {
        await axios.post('/chatbot', { questionPattern, response }, config);
        alert('Chatbot berhasil ditambahkan!');
      }

      fetchChatbots();
      resetForm();
    } catch (error) {
      console.error('Gagal menyimpan chatbot:', error);
      alert('Terjadi kesalahan saat menyimpan chatbot.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 space-y-4">
      <h3 className="text-xl font-semibold mb-2">
        {selectedChatbot ? 'Edit' : 'Tambah'} Pola Chatbot
      </h3>
      <div>
        <label className="block font-medium mb-1">Pola Pertanyaan (Regex atau Kata Kunci)</label>
        <input
          type="text"
          value={questionPattern}
          onChange={(e) => setQuestionPattern(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Respon Chatbot</label>
        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          required
          rows={3}
          className="w-full px-4 py-2 border rounded resize-none"
        />
      </div>

      <div className="flex space-x-2">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          {selectedChatbot ? 'Update' : 'Tambah'}
        </button>
        {selectedChatbot && (
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Batal
          </button>
        )}
      </div>
    </form>
  );
};

export default ChatbotForm;
