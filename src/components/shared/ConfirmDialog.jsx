export default function ConfirmDialog({
  open,
  title = 'Are you sure?',
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm = () => {},
  onCancel = () => {},
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50">
      <div className="w-[92vw] max-w-md rounded-xl bg-white p-5 shadow-xl border border-black/10">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        {message && <p className="text-gray-600 mb-4">{message}</p>}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="px-3 py-2 rounded-md border border-black/20"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className="px-3 py-2 rounded-md bg-red-600 text-white"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

