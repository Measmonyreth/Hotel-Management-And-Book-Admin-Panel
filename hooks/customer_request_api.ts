import { CustomerRequest, CustomerRequestByID } from "@/app/types/customer_request";
import { api, useApiAuthenticated } from "./useApi";

export type CustomerRequestUpdatePayload = {
    bookId: string;
    reason: string;
    calculatedPenaltyFee: number;
    calculatedRefundAmount: number;
    status: string;
    rejectionReason: string;
};

export function useGetAllCustomerRequests() {
    return useApiAuthenticated<CustomerRequest>("/cancel-requests/all")
}

export function useGetCustomerRequestsById(id: string) {
    return useApiAuthenticated<CustomerRequestByID>(`/cancel-requests/getbyid/${id}`)
}

export function createCustomerRequest(bookId: string, reason: string) {
    return api<unknown>(
        '/cancel-requests/create', {
            method: 'POST',
            body : JSON.stringify({ bookId, reason })
        }
    );
}

export function updateCustomerRequest(
    id: number,
    payload: CustomerRequestUpdatePayload,
) {
    return api<unknown>(
        `/cancel-requests/update/${encodeURIComponent(String(id))}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        }
    );
}

export function deleteCustomerRequest(req_id: number) {
    return api<unknown>(
        `/cancel-requests/delete/${req_id}`, {
            method: 'DELETE',
        }
    );
}

export function updateStatusRequest(
    id: number,
    status: string,
) {
    return api<unknown>(
        `/cancel-requests/update-status/${encodeURIComponent(String(id))}`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        }
    );
}