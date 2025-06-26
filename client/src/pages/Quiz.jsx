import React, { useEffect, useState } from 'react';
import axios from '../api/api';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState('');
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      const res = await axios.get('/quizzes');
      setQuestions(res.data);
      setCurrent(0);
      setSelected('');
      setScore(0);
      setIsFinished(false);
    } catch (error) {
      console.error('Gagal mengambil kuis:', error);
    }
  };

  const handleAnswer = () => {
    if (!selected) return;

    if (selected === questions[current].correctAnswer) {
      setScore(score + 1);
    }

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setSelected('');
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    fetchQuiz();
  };

  if (questions.length === 0) {
    return <p className="text-center mt-10">Memuat kuis...</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-green-50 to-white px-4">
      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow border border-gray-300">
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">Kuis Hewan Langka</h2>

        {!isFinished ? (
          <div>
            <h3 className="text-lg font-medium mb-4">{questions[current].question}</h3>
            <ul className="space-y-3 mb-6">
              {questions[current].options.map((opt, idx) => (
                <li key={idx}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="answer"
                      value={opt}
                      checked={selected === opt}
                      onChange={() => setSelected(opt)}
                      className="accent-green-600"
                    />
                    <span>{opt}</span>
                  </label>
                </li>
              ))}
            </ul>
            <button
              onClick={handleAnswer}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            >
              {current + 1 < questions.length ? 'Selanjutnya' : 'Selesai'}
            </button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold text-green-700">Kuis Selesai!</h3>
            <p className="text-lg">
              Skor kamu: <span className="font-bold">{score}</span> dari {questions.length}
            </p>
            <button
              onClick={handleRestart}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Ulangi Kuis
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
