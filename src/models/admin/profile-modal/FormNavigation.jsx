import React, { useContext } from 'react';
import { Check } from 'lucide-react';
import FPOProfileFormContext from './FPOProfileFormContext';

const FormNavigation = ({ currentStep, totalSteps, onBack ,isComplete,loading,isEditMode,setIsEditMode}) => {
  const { saveDraft, isSubmitting } = useContext(FPOProfileFormContext);
  return (
    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
      <button
        type="button"
        onClick={onBack}
        disabled={currentStep === 1 || isSubmitting}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md
          ${currentStep === 1 
            ? 'text-gray-400 cursor-not-allowed' 
            : 'text-gray-700 hover:bg-gray-100'
          }`}
      >
        <span className="text-lg">&lt;</span> Back
      </button>

      <div className="flex space-x-4 ">
        {isComplete && !isEditMode ? (
            <button
              type="button"
              onClick={() => setIsEditMode(true)}  
              disabled={isSubmitting}
              className="px-4 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Edit Profile
            </button>
          ) : isEditMode ? (
            <button
              type="button"
              onClick={() => setIsEditMode(false)}  
              disabled={isSubmitting}
              className="px-4 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancle Edit
            </button>
          ) : (
            <button
              type="button"
              onClick={saveDraft}
              disabled={isSubmitting}
              className="px-4 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save Draft
            </button>
        )}
        
        <button
          // type={isComplete && !isEditMode ? "button" : "submit"}
          type='submit'
          disabled={ loading || (isComplete && !isEditMode && currentStep === totalSteps)}
          className={`flex items-center justify-center gap-2 px-5 py-1 text-sm font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-70 disabled:cursor-not-allowed transition-colors
            ${currentStep === totalSteps 
              ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' 
              : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'}`}
        >
          {currentStep === totalSteps ? (
            <>
              <Check size={16} className="stroke-[3]" />
              {
                isComplete ? (isEditMode ? "Update Profile" : "View Profile") : (loading ? "Adding Profile..." : "Complete Profile")
              }
            </>
          ) : (
            <>
              Next Step <span className="text-lg">&gt;</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default FormNavigation;
