import { PenSquareIcon,Trash2Icon } from "lucide-react";
import { Link } from "react-router";
import { formatDate } from "../lib/utils";
import api from "../lib/axios";
import toast from "react-hot-toast";

const NoteCard = ({note,setNotes}) => {

    const handleDelete = async (e,id) => {
        e.preventDefault(); // get rid of the naviagtion behaviour

        if(!window.confirm("Are you sure you want to delete this note?"))
            return;
        try {
            await api.delete(`/notes/${id}`);
            setNotes((prev) => prev.filter(note => note._id !== id)); //update ui by removing card
            toast.success("Note deleted successfully");
        } catch (error) {
            console.log("Error in handleDelete:",error);
            toast.error("Failed to delete note");
        }

    }

  return <Link to={`/note/${note._id}`} 
  className="bg-white/5 backdrop-blur-md hover:bg-white/10 border border-white/10 hover:border-[#00FF9D]/50 transition-all duration-300 rounded-2xl p-6 group flex flex-col hover:-translate-y-1 shadow-lg hover:shadow-[0_8px_30px_rgba(0,255,157,0.15)] overflow-hidden relative"
  >
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00FF9D]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="flex-1">
        <h3 className="text-xl font-bold text-white mb-2">{note.title}</h3>
        <p className="text-gray-400 line-clamp-3 mb-4">{note.content}</p>
    </div>
    <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
        <span className="text-xs text-gray-500 font-medium">
            {formatDate(new Date(note.createdAt))}
        </span>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors">
                <PenSquareIcon className="w-4 h-4" />
            </div>
            <button className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" onClick={(e) => handleDelete(e, note._id)}>
                <Trash2Icon className="w-4 h-4" />
            </button>
        </div>
    </div>
  </Link>
}
export default NoteCard;