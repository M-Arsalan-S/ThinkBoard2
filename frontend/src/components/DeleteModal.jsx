import React from 'react';
import { createPortal } from 'react-dom';

const DeleteModal = ({ isOpen, onClose, onConfirm, loading }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      ></div>

      {/* Modal Box */}
      <div className="relative bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
        <h3 className="font-bold text-2xl text-white mb-2">Confirm Delete</h3>
        <p className="py-4 text-gray-400 text-lg">
          Are you sure you want to delete this note? This action cannot be undone.
        </p>
        
        <div className="flex gap-4 mt-8">
          <button 
            className="flex-1 bg-white/5 hover:bg-white/10 text-white text-lg font-semibold py-4 rounded-2xl transition-all border border-white/5" 
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            className="flex-1 bg-red-600 hover:bg-red-700 text-white text-lg font-semibold py-4 rounded-2xl transition-all shadow-lg shadow-red-600/20" 
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? <span className="loading loading-spinner"></span> : "Confirm"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeleteModal;
