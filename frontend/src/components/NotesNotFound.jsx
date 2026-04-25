import { NotebookIcon } from "lucide-react";
import { Link } from "react-router";

const NotesNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-6 max-w-md mx-auto text-center">
        <div className="bg-[#00FF9D]/10 rounded-full p-8 border border-[#00FF9D]/20">
            <NotebookIcon className="w-10 h-10 text-[#00FF9D]"/>
        </div>
        <h3 className="text-2xl font-bold text-white">No notes yet</h3>
        <p className="text-gray-400">
            Ready to organize your thoughts? Create your first note to get started on your journey.
        </p>
        <Link to={"/create"} className="bg-[#00FF9D] text-black font-semibold py-3 px-6 rounded-xl hover:bg-[#00cc7d] transition-all shadow-[0_0_20px_rgba(0,255,157,0.3)] hover:shadow-[0_0_30px_rgba(0,255,157,0.5)]">
            Create Your First Note
        </Link>
    </div>
  );
};

export default NotesNotFound;