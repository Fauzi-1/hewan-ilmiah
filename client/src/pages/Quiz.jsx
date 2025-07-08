import React, { useEffect, useState } from 'react';
import axios from '../api/api';
import bgHero from '../assets/hero_bg.jpg'; // Import background gambar lokal

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      const res = await axios.get('/quizzes');
      const shuffled = [...res.data].sort(() => 0.5 - Math.random());
      setQuestions(shuffled);
      setCurrent(0);
      setAnswers({});
      setScore(0);
      setIsFinished(false);
    } catch (error) {
      console.error('Gagal mengambil kuis:', error);
    }
  };

  const handleSelect = (value) => {
    setAnswers((prev) => ({
      ...prev,
      [current]: value,
    }));
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const handleFinish = () => {
    let newScore = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) {
        newScore += 1;
      }
    });
    setScore(newScore);
    setIsFinished(true);
  };

  const handleRestart = () => {
    fetchQuiz();
  };

  if (questions.length === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-gray-600 text-lg"
        style={{ backgroundImage: `url(${bgHero})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        Memuat kuis...
      </div>
    );
  }

  return (
    <div
      className="flex justify-center items-center min-h-screen px-4"
      style={{ backgroundImage: `url(${bgHero})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="w-full max-w-2xl p-6 bg-white/50 backdrop-blur-md rounded-xl shadow border border-gray-300">
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">Kuis</h2>

        {!isFinished ? (
          <div>
            <h3 className="text-lg font-medium mb-4">{questions[current].question}</h3>
            <ul className="space-y-3 mb-6">
              {questions[current].options.map((opt, idx) => (
                <li key={idx}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`answer-${current}`}
                      value={opt}
                      checked={answers[current] === opt}
                      onChange={() => handleSelect(opt)}
                      className="accent-green-600"
                    />
                    <span>{opt}</span>
                  </label>
                </li>
              ))}
            </ul>

            <div className="flex justify-between mt-6">
              <button
                onClick={handlePrev}
                disabled={current === 0}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
              >
                Sebelumnya
              </button>

              {current === questions.length - 1 ? (
                <button
                  onClick={handleFinish}
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
                >
                  Selesai
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
                >
                  Selanjutnya
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold text-green-700">Kuis Selesai!</h3>
            <p className="text-lg">
              Skor kamu: <span className="font-bold">{score}</span> dari {questions.length}
            </p>
            <button
              onClick={handleRestart}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
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
