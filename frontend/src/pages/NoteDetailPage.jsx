import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { ArrowLeftIcon, Trash2Icon, Loader2, SaveIcon } from 'lucide-react';
import Navbar from '../components/Navbar';

const NoteDetailPage = () => {
  const [note,setNote] = useState(null);
  const [loading,setLoading] = useState(true);
  const [saving,setSaving] = useState(false);

  const navigate = useNavigate();
  const {id} = useParams();

  useEffect(() => {
    const fetchNote = async() => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
      } catch (error) {
        console.log("Error in fetching note:",error);
        toast.error("Failed to fetch the note");
      } finally{
        setLoading(false);
      }
    }

    fetchNote();
  },[id]);

  const handleDelete = async() => {
    if(!window.confirm("Are you sure you want to delete this note?"))
      return;
    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted successfully");
      navigate("/");
    } catch (error) {
      console.log("Error in handleDelete:",error);
      toast.error("Failed to delete note");
    }
  };

  const handleSave = async () => {
    if(!note.title.trim() || !note.content.trim()){
      toast.error("Please add a title and content");
      return;
    }

    setSaving(true);

    try {
      await api.put(`/notes/${id}`,note);
      toast.success("Note updated successfully");
      navigate("/");
    } catch (error) {
      console.log("Error saving the note:",error);
      toast.error("Failed to update note");
    } finally{
      setSaving(false);
    }
  };

  if(loading){
    return (
      <div className='min-h-screen flex flex-col relative z-10'>
        <Navbar />
        <div className='flex-1 flex items-center justify-center'>
            <Loader2 className='w-10 h-10 text-[#00FF9D] animate-spin' />
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col min-h-screen relative z-10'>
      <Navbar />
      <div className='container mx-auto px-4 py-8 flex-1 flex flex-col'>
        <div className='max-w-3xl mx-auto w-full'>
          <div className='flex justify-between items-center mb-8'>
              <Link to={"/"} className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
                <ArrowLeftIcon className='w-5 h-5 group-hover:-translate-x-1 transition-transform' />
                Back to Notes
              </Link>
              <button 
                onClick={handleDelete} 
                className='inline-flex items-center gap-2 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-4 py-2 rounded-xl transition-all'
              >
                <Trash2Icon className='w-4 h-4' />
                <span className="text-sm font-medium">Delete</span>
              </button>
          </div>

          <div className='bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.3)]'>
            <div className='space-y-6'>
              <div className='space-y-2'>
                <input 
                  type='text' 
                  placeholder='Note Title' 
                  className='w-full bg-transparent border-b border-white/10 py-4 text-white text-3xl font-bold placeholder-gray-600 focus:outline-none focus:border-[#00FF9D]/50 transition-colors'
                  value={note.title}
                  onChange={(e) => setNote({ ...note, title: e.target.value})}
                />
              </div>             
              
              <div className='space-y-2'>
                <textarea 
                  placeholder='Write your note here...' 
                  className='w-full bg-black/20 border border-white/10 rounded-xl py-4 px-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00FF9D]/50 focus:border-transparent transition-all min-h-[300px] resize-y text-lg leading-relaxed'
                  value={note.content}
                  onChange={(e) => setNote({...note, content: e.target.value})}
                />
              </div>

              <div className='pt-4 flex justify-end'>
                <button 
                  className='bg-[#00FF9D] text-black font-bold py-3 px-8 rounded-xl hover:bg-[#00cc7d] transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,255,157,0.3)] hover:shadow-[0_0_30px_rgba(0,255,157,0.5)] disabled:opacity-70 disabled:hover:shadow-[0_0_20px_rgba(0,255,157,0.3)]' 
                  disabled={saving} 
                  onClick={handleSave}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <SaveIcon className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoteDetailPage