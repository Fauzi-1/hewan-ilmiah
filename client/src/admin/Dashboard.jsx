import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimalForm from './forms/AnimalForm';
import QuizForm from './forms/QuizForm';
import ChatbotForm from './forms/ChatbotForm';
import axios from '../api/api';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('animal');
  const [animals, setAnimals] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [chatbots, setChatbots] = useState([]);
  const [selectedChatbot, setSelectedChatbot] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
    } else {
      fetchAnimals();
      fetchQuizzes();
      fetchChatbots();
    }
  }, []);

  const tokenHeader = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  };

  const fetchAnimals = async () => {
    try {
      const res = await axios.get('/animals', tokenHeader);
      setAnimals(res.data);
    } catch (error) {
      console.error('Gagal memuat data hewan:', error);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get('/quizzes', tokenHeader);
      setQuizzes(res.data);
    } catch (error) {
      console.error('Gagal memuat data kuis:', error);
    }
  };

  const fetchChatbots = async () => {
    try {
      const res = await axios.get('/chatbot', tokenHeader);
      setChatbots(res.data);
    } catch (error) {
      console.error('Gagal memuat data chatbot:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  const confirmAndDelete = async (url, refetchFunc, label) => {
    if (window.confirm(`Yakin ingin menghapus ${label} ini?`)) {
      try {
        await axios.delete(url, tokenHeader);
        refetchFunc();
      } catch (error) {
        console.error(`Gagal menghapus ${label}:`, error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
        <div>
          <button onClick={() => navigate('/')} className="mr-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            ← Home
          </button>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
            Logout
          </button>
        </div>
      </div>

      <div className="flex space-x-4 mb-6">
        {['animal', 'quiz', 'chatbot'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded font-semibold ${
              activeTab === tab ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Kelola {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded shadow">
        {/* Tab HEWAN */}
        {activeTab === 'animal' && (
          <>
            <h3 className="text-xl font-semibold mb-4">Data Hewan</h3>
            <AnimalForm
              selectedAnimal={selectedAnimal}
              fetchAnimals={fetchAnimals}
              onReset={() => setSelectedAnimal(null)}
            />
            <ul className="mt-4 space-y-2">
              {animals.map((a) => (
                <li key={a._id} className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded">
                  <span>{a.name}</span>
                  <div className="space-x-2">
                    <button onClick={() => setSelectedAnimal(a)} className="bg-yellow-400 px-3 py-1 rounded">Edit</button>
                    <button onClick={() => confirmAndDelete(`/animals/${a._id}`, fetchAnimals, 'hewan')} className="bg-red-500 text-white px-3 py-1 rounded">Hapus</button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Tab KUIS */}
          {activeTab === 'quiz' && (
            <>
              <h3 className="text-xl font-semibold mb-4">Data Kuis</h3>
              <QuizForm
                selectedQuiz={selectedQuiz}
                fetchQuizzes={fetchQuizzes}
                onReset={() => setSelectedQuiz(null)}
              />
              <ul className="mt-4 space-y-4">
                {quizzes.map((quiz) => (
                  <li key={quiz._id} className="border p-4 rounded shadow-sm bg-white">
                    <p className="font-semibold">{quiz.question}</p>
                    <ul className="list-disc pl-5 text-sm text-gray-700 mt-1">
                      {quiz.options.map((opt, idx) => (
                        <li key={idx}>{opt}</li>
                      ))}
                    </ul>
                    <p className="mt-1 italic text-green-700">
                      Jawaban Benar: {quiz.correctAnswer}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => setSelectedQuiz(quiz)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          confirmAndDelete(`/quiz/${quiz._id}`, fetchQuizzes, 'kuis')
                        }
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Hapus
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
  </>
)}

        {/* Tab CHATBOT */}
        {activeTab === 'chatbot' && (
          <>
            <h3 className="text-xl font-semibold mb-4">Data Chatbot</h3>
            <ChatbotForm
              selectedChatbot={selectedChatbot}
              fetchChatbots={fetchChatbots}
            />
            <ul className="mt-4 space-y-2">
              {chatbots.map((c) => (
                <li key={c._id} className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded">
                  <span><strong>{c.questionPattern}</strong> ➜ {c.response}</span>
                  <div className="space-x-2">
                    <button onClick={() => setSelectedChatbot(c)} className="bg-yellow-400 px-3 py-1 rounded">Edit</button>
                    <button onClick={() => confirmAndDelete(`/chatbot/${c._id}`, fetchChatbots, 'chatbot')} className="bg-red-500 text-white px-3 py-1 rounded">Hapus</button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
