import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

const UnauthorizedPage = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-50  px-4">
      
      <div className="flex flex-col items-center text-center max-w-md">
        
        <div className="p-4 bg-red-100  rounded-full mb-4">
          <Lock className="w-10 h-10 text-red-600 " />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 ">
          Unauthorized Access
        </h1>

        <p className="mt-2 text-gray-600 ">
          You don’t have permission to view this page.  
          Please contact your administrator if you believe this is a mistake.
        </p>

        <Link
          to="/login"
          className="mt-6 px-6 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Go Back Home
        </Link>
      </div>

    </div>
  );
};

export default UnauthorizedPage;
