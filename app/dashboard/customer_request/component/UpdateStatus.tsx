import { updateStatusRequest } from "@/hooks/customer_request_api";
import { FormEvent, useEffect, useState } from "react";

interface UpdateSattusProp {
  open: boolean;
  id: number;
  status: string;
  onClose: () => void;
}

type UpdateStatusFormData = {
  status: string;
};
export default function UpdateStatus({
  id,
  onClose,
  open,
  status,
}: UpdateSattusProp) {
  const [formdata, Setformdata] = useState<UpdateStatusFormData>({
    status: "",
  });
  const [error, Seterror] = useState<string | null>(null);

  useEffect(() => {
    Setformdata({ status });
  }, [status]);

  const updateStatus = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    Seterror(null);
    try {
      await updateStatusRequest(id, formdata.status);
      onClose();
    } catch (error) {
      Seterror(
        error instanceof Error ? error.message : "Failed to update status",
      );
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-fit max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex justify-between space-x-50">
          <div>
            <b>UPDATE STATUS</b>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-gray-200 px-2.5 py-1.5 text-sm text-gray-500 hover:bg-gray-100"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <section>
          <form onSubmit={updateStatus}>
            <label htmlFor="status">
              <select
                id="status"
                name="status"
                value={formdata.status}
                required
                onChange={(e) =>
                  Setformdata({ ...formdata, status: e.target.value })
                }
                className="mt-1 w-fit rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select</option>
                <option value="REQUESTED">Requested</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="PROCESSING">Processing</option>
              </select>
            </label>
            {error && (
              <p role="alert" className="mt-2 text-sm text-red-600">
                {error}
              </p>
            )}
            <div className=" mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>{" "}
              <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60">
                Update
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
