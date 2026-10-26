import { CheckCircle, Clock, XCircle } from "lucide-react";

export const getStatusBadge = (status) => {
  switch (status) {
    case "Valid":
      return (
        <div className="flex items-center gap-1 px-2 py-1 rounded-full border border-green-500 text-green-600 bg-green-50 text-xs font-medium">
          <CheckCircle size={14} />
          <span>Valid</span>
        </div>
      );

    case "Expiring Soon":
      return (
        <div className="flex items-center gap-1 px-2 py-1 rounded-full border border-yellow-500 text-yellow-600 bg-yellow-50 text-xs font-medium">
          <Clock size={14} />
          <span>Expiring Soon</span>
        </div>
      );

    case "Expired":
      return (
        <div className="flex items-center gap-1 px-2 py-1 rounded-full border border-red-500 text-red-600 bg-red-50 text-xs font-medium">
          <XCircle size={14} />
          <span>Expired</span>
        </div>
      );

    default:
      return (
        <div className="flex items-center gap-1 px-2 py-1 rounded-full border border-gray-400 text-gray-500 bg-gray-50 text-xs">
          <span>Unknown</span>
        </div>
      );
  }
};