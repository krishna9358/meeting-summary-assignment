interface ProgressStepsProps {
  activeStep: number;
  onStepChange: (step: number) => void;
}

export const ProgressSteps = ({ activeStep, onStepChange }: ProgressStepsProps) => {
  return (
    <>
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold cursor-pointer transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                  activeStep >= step
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
                onClick={() => onStepChange(step)}
              >
                {step}
              </div>
              {step < 3 && (
                <div className={`w-12 h-0.5 transition-all duration-500 ${activeStep > step ? 'bg-blue-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Labels */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-16 text-sm text-gray-600">
          <span className={`transition-all duration-300 ${activeStep === 1 ? 'text-blue-600 font-semibold scale-105' : ''}`}>Input</span>
          <span className={`transition-all duration-300 ${activeStep === 2 ? 'text-blue-600 font-semibold scale-105' : ''}`}>Review</span>
          <span className={`transition-all duration-300 ${activeStep === 3 ? 'text-blue-600 font-semibold scale-105' : ''}`}>Share</span>
        </div>
      </div>
    </>
  );
};
