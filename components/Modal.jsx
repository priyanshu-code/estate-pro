"use client"
import { useEffect, useRef, useState } from 'react';

export default function Modal({ children, className, isOpen, closeModal }) {
  const currentRef = useRef(null);
  const [open, setOpen] = useState(isOpen)
  useEffect(() => {
    setOpen(isOpen)
  }, [isOpen])

  useEffect(() => {
    const handleModalState = () => {
      if (open) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    };
    handleModalState();
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  // useEffect(() => {
  //   function handleClickOutside(event) {
  //     if (currentRef.current && !currentRef.current.contains(event.target)) {
  //       closeModal()
  //     }
  //   }
  //   // Set the event listener
  //   document.addEventListener("mousedown", handleClickOutside);
  //   // Cleanup
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [currentRef]);


  if (!open) {
    return null;
  }

  return (
    <div className='fixed z-50 inset-0 flex items-center justify-center bg-gray-500/30'>
      <div className={className} ref={currentRef}>{children}</div>
    </div >
  );
}
