import React, { useEffect, useRef } from 'react';

const Modal = React.forwardRef(({ isOpen, onClose, children }, ref) => {
  const modalRef = useRef();

  useEffect(() => {
    // Function to close modal when clicked outside
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    // Add event listener when modal is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Remove event listener when modal is closed
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // If the modal is not open, return null
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div ref={ref || modalRef} className="bg-white p-6 md:p-10 rounded-lg shadow-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-black text-lg">X</button>
        {children}
      </div>
    </div>
  );
});

export default Modal;