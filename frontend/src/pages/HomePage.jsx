import Navbar from "../components/Navbar"
import RateLimitedUI from "../components/RateLimitedUI";
import NotesNotFound from "../components/NotesNotFound";
import { useState,useEffect } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";
import NoteCard from "../components/NoteCard";
import { Loader2 } from "lucide-react";

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async() => {
      try {
        const res = await api.get("/notes");
        console.log(res.data);
        setNotes(res.data);
        setIsRateLimited(false);
      } catch (error) {
        console.log("Error fetching notes");
        console.log(error);
        if(error.response?.status === 429){
          setIsRateLimited(true);
        }else{
          toast.error("Failed to load notes");
        }
      }finally{
        setLoading(false);
      }
    }
    fetchNotes();
  }, []) // Fix: added dependency array so the effect runs only once

  return (
    <div className="flex flex-col min-h-screen relative z-10">
      <Navbar/>

      {isRateLimited && <RateLimitedUI/>}

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 mt-4">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#00FF9D] animate-spin" />
          </div>
        )}

        {notes.length === 0 && !isRateLimited && !loading && <NotesNotFound/>}

        {notes.length > 0 && !isRateLimited && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {notes.map((note) => {
              return(
                <NoteCard key={note._id} note={note} setNotes={setNotes}/>
              );
            })}
          </div>
        )}
      </main>
    </div>
  )
}

export default HomePage;