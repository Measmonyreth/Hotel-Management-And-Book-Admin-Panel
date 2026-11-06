import { deleteCustomerRequest } from "@/hooks/customer_request_api";

type DeleteRequestProp = {
    requestId: number;
  open: boolean;
  onClose: () => void;
};

export default function DeleteRequestPage({
    requestId,
  open,
  onClose,
}: DeleteRequestProp) {
  if (!open) return null;

  const handleDelete = async  ()=> {

    const response = await deleteCustomerRequest(requestId);
    if(!response){
        console.error("Failed to delete request");
    }

    console.log("Request deleted");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5  items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6">Are you sure you want to delete this request booking?</p>
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
}
