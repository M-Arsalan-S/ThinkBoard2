import React, { useEffect } from 'react'
import { Route, Routes, Navigate } from 'react-router';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import NoteDetailPage from './pages/NoteDetailPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import { useAuth } from './context/AuthContext';
import { Loader2 } from 'lucide-react';

const App = () => {

  const { authUser, isCheckingAuth } = useAuth();
  
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#00FF9D] animate-spin" />
      </div>
    );
  }

  return (
    <div className='relative min-h-screen w-full font-sans text-gray-200'>
      <div className='fixed inset-0 -z-10 h-full w-full bg-[#050a07] [background:radial-gradient(ellipse_80%_60%_at_50%_-10%,#00FF9D18_0%,#00663f20_40%,#050a07_70%)]'/>
      <Routes>
        <Route path='/' element={authUser ? <HomePage/> : <Navigate to="/login" />} />
        <Route path='/create' element={authUser ? <CreatePage/> : <Navigate to="/login" />} />
        <Route path='/note/:id' element={authUser ? <NoteDetailPage/> : <Navigate to="/login" />} />
        <Route path='/login' element={!authUser ? <LoginPage/> : <Navigate to="/" />} />
        <Route path='/signup' element={!authUser ? <SignUpPage/> : <Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App;