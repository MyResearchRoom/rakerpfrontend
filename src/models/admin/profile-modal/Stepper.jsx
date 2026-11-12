import React from 'react';
import { Check } from 'lucide-react';

const stepsConfig = [
  { step: 1, label: 'Company Profile' },
  { step: 2, label: 'Company Identification' },
  { step: 3, label: 'Financial & Compliance' },
  { step: 4, label: 'Company Officials' },
  { step: 5, label: 'Membership Details' },
  { step: 6, label: 'Share Capital' },
  { step: 7, label: 'Infrastructure & Assets' },
  { step: 8, label: 'Business Activities' },
  { step: 9, label: 'Licenses & Registrations' },
  { step: 10, label: 'Equipments' },
  { step: 11, label: 'Statutory Auditors' },
  { step: 12, label: 'Document Uploads' },
];

const Stepper = ({ currentStep, onStepClick, isStepComplete }) => {
  return (
    <div className="w-full py-4 overflow-x-auto border-b border-gray-200 custom-scrollbar">
      <div className="flex items-center min-w-max px-4">
        {stepsConfig.map((item, index) => {
          const isCompleted = typeof isStepComplete === 'function'
            ? isStepComplete(item.step)
            : currentStep > item.step;
          const isActive = currentStep === item.step;
          const isPending = currentStep < item.step;
          const isLineActive = isCompleted;

          return (
            <div key={item.step} className="flex items-center relative">
              <div className="flex flex-col items-center justify-center w-24">
                <button 
                  type="button"
                  onClick={() => onStepClick && onStepClick(item.step)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium z-10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400
                    ${isActive ? 'bg-blue-600 text-white border-2 border-blue-200' : ''}
                    ${isCompleted ? 'bg-green-500 text-white' : ''}
                    ${isPending ? 'bg-gray-100 text-gray-400 border border-gray-200 hover:bg-gray-200 hover:text-gray-600' : ''}
                    cursor-pointer
                  `}
                >
                  {isCompleted ? <Check size={16} /> : item.step}
                </button>
                <div 
                  className={`text-[12px] mt-2 text-center whitespace-normal leading-tight font-medium
                    ${isActive ? 'text-blue-700' : ''}
                    ${isCompleted ? 'text-gray-800' : ''}
                    ${isPending ? 'text-gray-400' : ''}
                  `}
                >
                  {item.label}
                </div>
              </div>

              {/* Progress Line connecting steps */}
              {index < stepsConfig.length - 1 && (
                <div 
                  className={`h-[2px] w-16 -mt-6 transition-colors duration-200
                    ${isLineActive ? 'bg-green-500' : 'bg-gray-200'}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
