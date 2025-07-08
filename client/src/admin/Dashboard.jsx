import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/api';
import AnimalForm from './forms/AnimalForm';
import QuizForm from './forms/QuizForm';
import ChatbotForm from './forms/ChatbotForm';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('animal');
  const [animals, setAnimals] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [chatbots, setChatbots] = useState([]);
  const [selectedChatbot, setSelectedChatbot] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const tokenHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const handleAuthError = (err) => {
    if (err.response && err.response.status === 401) {
      alert('Sesi Anda telah habis. Silakan login kembali.');
      localStorage.removeItem('token');
      navigate('/admin/login');
    } else {
      console.error('Error:', err);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
    } else {
      fetchAnimals();
      fetchQuizzes();
      fetchChatbots();
    }
  }, []);

  const fetchAnimals = async () => {
    try {
      const res = await axios.get('/animals', tokenHeader);
      setAnimals(res.data);
    } catch (err) {
      handleAuthError(err);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get('/quizzes', tokenHeader);
      setQuizzes(res.data);
    } catch (err) {
      handleAuthError(err);
    }
  };

  const fetchChatbots = async () => {
    try {
      const res = await axios.get('/chatbot', tokenHeader);
      setChatbots(res.data);
    } catch (err) {
      handleAuthError(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  const confirmAndDelete = async (url, refetch, label) => {
    if (window.confirm(`Yakin ingin menghapus ${label}?`)) {
      try {
        await axios.delete(url, tokenHeader);
        refetch();
      } catch (err) {
        handleAuthError(err);
      }
    }
  };

  const tabList = [
    { key: 'animal', label: 'Kelola Hewan' },
    { key: 'quiz', label: 'Kelola Kuis' },
    { key: 'chatbot', label: 'Kelola Chatbot' },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className={`fixed z-30 inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out bg-white w-64 shadow-md p-4`}>
        <div className="text-xl font-bold mb-4">Dashboard</div>
        <div className="space-y-2">
          {tabList.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => {
                setActiveTab(key);
                setSidebarOpen(false);
              }}
              className={`w-full text-left px-4 py-2 rounded ${
                activeTab === key ? 'bg-green-600 text-white' : 'hover:bg-green-100'
              }`}
            >
              {label}
            </button>
          ))}
          <button onClick={() => navigate('/')} className="w-full text-left px-4 py-2 rounded hover:bg-blue-100">
            ← Kembali ke Home
          </button>
          <button onClick={handleLogout} className="w-full text-left px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600">
            Logout
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 md:ml-64">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden mb-4 text-xl"
        >
          ☰
        </button>

        {activeTab === 'animal' && (
          <>
            <h2 className="text-2xl font-semibold mb-4">Data Hewan</h2>
            <AnimalForm selectedAnimal={selectedAnimal} fetchAnimals={fetchAnimals} onReset={() => setSelectedAnimal(null)} />
            <ul className="mt-4 space-y-2">
              {animals.map((a) => (
                <li key={a._id} className="bg-white p-4 rounded shadow flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <span>{a.name}</span>
                  <div className="mt-2 sm:mt-0 flex gap-2">
                    <button onClick={() => setSelectedAnimal(a)} className="bg-yellow-400 px-3 py-1 rounded">Edit</button>
                    <button onClick={() => confirmAndDelete(`/animals/${a._id}`, fetchAnimals, 'hewan')} className="bg-red-500 text-white px-3 py-1 rounded">Hapus</button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {activeTab === 'quiz' && (
          <>
            <h2 className="text-2xl font-semibold mb-4">Data Kuis</h2>
            <QuizForm selectedQuiz={selectedQuiz} fetchQuizzes={fetchQuizzes} onReset={() => setSelectedQuiz(null)} />
            <ul className="mt-4 space-y-2">
              {quizzes.map((quiz) => (
                <li key={quiz._id} className="bg-white p-4 rounded shadow">
                  <p className="font-semibold">{quiz.question}</p>
                  <ul className="list-disc pl-5 text-sm text-gray-700 mt-1">
                    {quiz.options.map((opt, idx) => (
                      <li key={idx}>{opt}</li>
                    ))}
                  </ul>
                  <p className="mt-1 text-green-700 italic">Jawaban: {quiz.correctAnswer}</p>
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => setSelectedQuiz(quiz)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                    <button onClick={() => confirmAndDelete(`/quiz/${quiz._id}`, fetchQuizzes, 'kuis')} className="bg-red-500 text-white px-3 py-1 rounded">Hapus</button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {activeTab === 'chatbot' && (
          <>
            <h2 className="text-2xl font-semibold mb-4">Data Chatbot</h2>
            <ChatbotForm selectedChatbot={selectedChatbot} fetchChatbots={fetchChatbots} onReset={() => setSelectedChatbot(null)} />
            <ul className="mt-4 space-y-2">
              {chatbots.map((c) => (
                <li
                  key={c._id}
                  className="bg-white p-4 rounded shadow flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
                >
                  <div className="w-full sm:w-auto max-w-full sm:max-w-md break-words overflow-hidden">
                    <span className="block text-gray-800 font-medium break-words text-sm leading-snug">
                      {c.questionPattern}
                    </span>
                  </div>
                  <div className="flex flex-row gap-2 sm:flex-row sm:gap-3 sm:items-center sm:justify-end w-fit">
                    <button
                      onClick={() => setSelectedChatbot(c)}
                      className="bg-yellow-400 px-4 py-1.5 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmAndDelete(`/chatbot/${c._id}`, fetchChatbots, 'chatbot')}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Hapus
                    </button>
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
