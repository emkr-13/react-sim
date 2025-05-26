import React from "react";
import Spinner from "./Spinner";

const LoadingState: React.FC = () => {
  return (
    <div className="py-12 flex flex-col items-center justify-center text-center p-6">
      <Spinner
        className="text-primary-600 dark:text-primary-400 mb-4"
        size="lg"
      />
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
        Loading...
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Please wait while we fetch the data.
      </p>
    </div>
  );
};

export default LoadingState;
