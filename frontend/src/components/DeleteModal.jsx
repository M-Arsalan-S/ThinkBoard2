import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const DeleteModal = ({ isOpen, onClose, onConfirm, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-500/10 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">Delete Note?</h3>
          <p className="text-gray-400 mb-6">
            This action cannot be undone. This will permanently delete your note from our servers.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={onConfirm}
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <span className="loading loading-spinner loading-sm"></span> : "Delete Note"}
            </button>
            <button
              onClick={onClose}
              disabled={loading}
              className="w-full bg-white/5 hover:bg-white/10 text-white font-semibold py-3 rounded-xl transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
