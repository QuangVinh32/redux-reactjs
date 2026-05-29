import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

export const getErrorMessage = (
  err: FetchBaseQueryError | SerializedError | undefined
): string => {
  if (!err) return "";
  if ("status" in err) {
    const data = err.data as { message?: string; errors?: Record<string, string> } | undefined;
    if (data?.message) return data.message;
    if (data?.errors) {
      return Object.values(data.errors).join(", ");
    }
    if (err.status === "FETCH_ERROR") return "Không thể kết nối tới server";
    return `HTTP ${err.status}`;
  }
  return err.message ?? "Đã có lỗi xảy ra";
};
