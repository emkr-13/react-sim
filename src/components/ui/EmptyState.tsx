import React from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
}) => {
  return (
    <div className="py-12 flex flex-col items-center justify-center text-center p-6">
      <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
        {description}
      </p>
    </div>
  );
};

export default EmptyState;
