import React, { useState, useEffect } from 'react';
import axios from '../../api/api';

const QuizForm = ({ selectedQuiz, fetchQuizzes, onReset }) => {
  const [formData, setFormData] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
  });

  useEffect(() => {
    if (selectedQuiz) {
      setFormData({
        question: selectedQuiz.question,
        options: selectedQuiz.options,
        correctAnswer: selectedQuiz.correctAnswer,
      });
    } else {
      resetForm();
    }
  }, [selectedQuiz]);

  const resetForm = () => {
    setFormData({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
    });
    onReset && onReset();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData((prev) => ({ ...prev, options: newOptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.question.trim() || formData.options.some(opt => !opt.trim()) || !formData.correctAnswer.trim()) {
      alert('Mohon lengkapi semua kolom.');
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };

      if (selectedQuiz) {
        await axios.put(`/quizzes/${selectedQuiz._id}`, formData, config);
      } else {
        await axios.post('/quizzes', formData, config);
      }

      resetForm();
      fetchQuizzes();
    } catch (error) {
      console.error('Gagal menyimpan kuis:', error);
    }
  };

  return (
    <div className="bg-white rounded shadow p-6">
      <h2 className="text-xl font-semibold mb-4">{selectedQuiz ? 'Edit Kuis' : 'Tambah Kuis'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Pertanyaan:</label>
          <input
            type="text"
            name="question"
            value={formData.question}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Opsi Jawaban:</label>
          {formData.options.map((opt, idx) => (
            <input
              key={idx}
              type="text"
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              className="w-full mb-2 px-4 py-2 border rounded"
              placeholder={`Opsi ${idx + 1}`}
              required
            />
          ))}
        </div>

        <div>
          <label className="block mb-1 font-medium">Jawaban Benar:</label>
          <input
            type="text"
            name="correctAnswer"
            value={formData.correctAnswer}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            {selectedQuiz ? 'Update' : 'Tambah'}
          </button>
          {selectedQuiz && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Batal
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default QuizForm;
