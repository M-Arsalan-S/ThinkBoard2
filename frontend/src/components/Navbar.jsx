import {Link} from "react-router";
import {PlusIcon, LogOutIcon, UserIcon} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { logout, authUser } = useAuth();

  return (
    <header className="bg-black/50 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl p-4">
            <div className="flex items-center justify-between">
                <Link to="/" className="text-3xl font-bold text-white font-mono tracking-tight flex items-center gap-2">
                    <span className="text-[#00FF9D]">Think</span>Board
                </Link>
                {authUser && (
                  <div className="flex items-center gap-4">
                      <div className="hidden sm:flex items-center gap-2 text-gray-300 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                        <UserIcon className="w-4 h-4 text-[#00FF9D]" />
                        <span className="text-sm font-medium">{authUser.name}</span>
                      </div>
                      <Link to={"/create"} className="bg-[#00FF9D]/10 text-[#00FF9D] hover:bg-[#00FF9D]/20 border border-[#00FF9D]/30 transition-all font-medium px-4 py-2 rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,157,0.1)] hover:shadow-[0_0_25px_rgba(0,255,157,0.2)]">
                        <PlusIcon className="w-5 h-5"/>
                        <span className="hidden sm:inline">New Note</span>
                      </Link>
                      <button onClick={logout} className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/30 transition-all font-medium p-2 rounded-xl flex items-center justify-center" aria-label="Logout">
                        <LogOutIcon className="w-5 h-5" />
                      </button>
                  </div>
                )}
            </div>
        </div>
    </header>
  )
}

export default Navbar;