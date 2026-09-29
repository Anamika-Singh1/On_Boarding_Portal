import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from '../Modal';
import Button from './Button';

// Replaces the browser's native confirm() used for destructive actions elsewhere
// in the app (unstyled, blocks the render thread, can't be keyboard/theme tested
// consistently with the rest of the UI).
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'destructive',
  loading = false,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
    <div className="flex gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10">
        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" aria-hidden="true" />
      </div>
      <p className="pt-2 text-sm text-slate-600 dark:text-slate-300">{description}</p>
    </div>
    <div className="mt-6 flex justify-end gap-3">
      <Button variant="outline" onClick={onClose} disabled={loading}>
        {cancelLabel}
      </Button>
      <Button variant={variant} onClick={onConfirm} loading={loading}>
        {confirmLabel}
      </Button>
    </div>
  </Modal>
);

export default ConfirmDialog;
