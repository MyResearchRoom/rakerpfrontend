export default function getStatusStyle(status){
  const normalizedStatus = status?.toLowerCase();

  switch (normalizedStatus) {
    case "paid":
      return "text-green-700 bg-green-100 border border-green-200 font-medium";

    case "pending":
      return "text-yellow-500 bg-yellow-50 border border-yellow-200 font-medium";

    case "partially paid":
      return "text-orange-700 bg-orange-100 border border-orange-200 font-medium";

    case "overdue":
      return "text-red-700 bg-red-100 border border-red-200 font-medium";

    default:
      return "text-gray-600 bg-gray-100 border border-gray-200 font-medium";
  }
};

