// import React, { useEffect, useId, useRef } from 'react';
// import { X } from 'lucide-react';

// const FOCUSABLE_SELECTOR =
//   'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

// const SIZES = {
//   sm: 'max-w-sm',
//   md: 'max-w-md',
//   lg: 'max-w-lg',
//   xl: 'max-w-xl',
// };

// // Handles the a11y basics the original hand-rolled overlay divs across the app were
// // missing: Escape to close, focus trapped inside while open, and focus restored to
// // whatever triggered the modal once it closes.
// const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
//   const dialogRef = useRef(null);
//   const triggerRef = useRef(null);
//   const titleId = useId();

//   useEffect(() => {
//     if (!isOpen) return;
//     triggerRef.current = document.activeElement;

//     const node = dialogRef.current;
//     const focusable = node?.querySelectorAll(FOCUSABLE_SELECTOR);
//     focusable?.[0]?.focus();

//     const handleKeyDown = (e) => {
//       if (e.key === 'Escape') {
//         onClose();
//         return;
//       }
//       if (e.key !== 'Tab' || !node) return;

//       const items = Array.from(node.querySelectorAll(FOCUSABLE_SELECTOR));
//       if (items.length === 0) return;
//       const first = items[0];
//       const last = items[items.length - 1];

//       if (e.shiftKey && document.activeElement === first) {
//         e.preventDefault();
//         last.focus();
//       } else if (!e.shiftKey && document.activeElement === last) {
//         e.preventDefault();
//         first.focus();
//       }
//     };

//     document.addEventListener('keydown', handleKeyDown);
//     return () => {
//       document.removeEventListener('keydown', handleKeyDown);
//       triggerRef.current?.focus?.();
//     };
//   }, [isOpen, onClose]);

//   if (!isOpen) return null;

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[2px]"
//       onMouseDown={(e) => {
//         if (e.target === e.currentTarget) onClose();
//       }}
//     >
//       <div
//         ref={dialogRef}
//         role="dialog"
//         aria-modal="true"
//         aria-labelledby={titleId}
//         className={`w-full ${SIZES[size] || SIZES.md} max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900`}
//       >
//         <div className="mb-4 flex items-center justify-between">
//           <h2 id={titleId} className="text-lg font-semibold text-slate-900 dark:text-white">
//             {title}
//           </h2>
//           <button
//             type="button"
//             onClick={onClose}
//             aria-label="Close dialog"
//             className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
//           >
//             <X className="h-5 w-5" aria-hidden="true" />
//           </button>
//         </div>
//         {children}
//       </div>
//     </div>
//   );
// };

// export default Modal;
import React, { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

const SIZES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();

  // Always keep the latest onClose without causing
  // the focus-management effect to restart on every render.
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Store the element that opened the modal.
    triggerRef.current = document.activeElement;

    const node = dialogRef.current;

    // Move focus into the modal only when it actually opens.
    const focusable = node?.querySelectorAll(FOCUSABLE_SELECTOR);
    focusable?.[0]?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current?.();
        return;
      }

      if (e.key !== 'Tab' || !node) return;

      const items = Array.from(
        node.querySelectorAll(FOCUSABLE_SELECTOR)
      );

      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Restore focus only when the modal is actually closed.
  useEffect(() => {
    if (isOpen) return;

    triggerRef.current?.focus?.();
    triggerRef.current = null;
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[2px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onCloseRef.current?.();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`w-full ${
          SIZES[size] || SIZES.md
        } max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2
            id={titleId}
            className="text-lg font-semibold text-slate-900 dark:text-white"
          >
            {title}
          </h2>

          <button
            type="button"
            onClick={() => onCloseRef.current?.()}
            aria-label="Close dialog"
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};

export default Modal;
