interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-200"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-lg shadow-xl p-4 sm:p-6 max-w-md w-full animate-slideUp">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">タスクを削除しますか？</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
          この操作は取り消せません。本当に削除してもよろしいですか？
        </p>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 active:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            キャンセル
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 active:bg-red-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
}
