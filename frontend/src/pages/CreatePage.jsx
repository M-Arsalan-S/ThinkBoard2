import { ArrowLeftIcon, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router';
import api from '../lib/axios';
import Navbar from '../components/Navbar';

const CreatePage = () => {
  const [title,setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!title.trim() || !content.trim()){
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      await api.post("/notes", {
        title,
        content
      });
      toast.success("Note created successfully");
      navigate("/");
    } catch (error) {
      console.log("Error creating note:", error);
      if(error.response?.status === 429){
        toast.error("Slow down! You're creating notes too fast", {
          duration: 4000,
          icon: "💀",
        });
      }else{
        toast.error("Failed to create note");
      }
    }finally{
      setLoading(false);
    }
  }

  return ( 
    <div className='flex flex-col min-h-screen relative z-10'>
      <Navbar />
      <div className='container mx-auto px-4 py-8 flex-1 flex flex-col'>
        <div className='max-w-3xl mx-auto w-full'>
          <Link to={"/"} className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group">
            <ArrowLeftIcon className='w-5 h-5 group-hover:-translate-x-1 transition-transform' />
            Back to Notes
          </Link>

          <div className='bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.3)]'>
            <h2 className='text-3xl font-bold text-white mb-8 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent'>Create New Note</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className='space-y-2'>
                <label className="text-sm font-medium text-gray-300 ml-1">Title</label>
                <input 
                  type='text' 
                  placeholder='Enter a catchy title...' 
                  className='w-full bg-black/40 border border-white/10 rounded-xl py-4 px-4 text-white text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00FF9D]/50 focus:border-transparent transition-all'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className='space-y-2'>
                <label className="text-sm font-medium text-gray-300 ml-1">Content</label>
                <textarea 
                  placeholder='What is on your mind?' 
                  className='w-full bg-black/40 border border-white/10 rounded-xl py-4 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00FF9D]/50 focus:border-transparent transition-all min-h-[200px] resize-y'
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  type='submit' 
                  disabled={loading}
                  className='bg-[#00FF9D] text-black font-bold py-3 px-8 rounded-xl hover:bg-[#00cc7d] transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,255,157,0.3)] hover:shadow-[0_0_30px_rgba(0,255,157,0.5)] disabled:opacity-70 disabled:hover:shadow-[0_0_20px_rgba(0,255,157,0.3)]'
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin"/>
                      Saving...
                    </>
                  ) : "Create Note"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePage