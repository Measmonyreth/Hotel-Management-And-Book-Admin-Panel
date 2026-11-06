import { deleteFloor } from "@/hooks/floor_api";

interface DeleteFloorDialogProps {
  open: boolean;
  floorId: string | number;
  onClose: () => void;
}

export const DeleteFloorDialog = ({
  floorId,
  onClose,
  open,
}: DeleteFloorDialogProps) => {
  const handleDelete = async () => {
    try {
      await deleteFloor(floorId);
      open = false;
      onClose();
    } catch (error) {
      console.error("Error deleting floor:", error);
    }
  };
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5  items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete this floor?
            </p>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
