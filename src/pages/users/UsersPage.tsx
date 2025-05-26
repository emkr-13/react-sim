import React, { useState } from "react";
import { useQuery } from "react-query";
import { Users, Plus, Mail, UserCircle, Shield } from "lucide-react";
import apiService from "../../services/api";
import { User } from "../../types";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import LoadingState from "../../components/ui/LoadingState";
import UserModal from "./UserModal";

const UsersPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const {
    data: userData,
    isLoading,
    isError,
    refetch,
  } = useQuery(["users"], () => apiService.getUserProfile(), {
    keepPreviousData: true,
  });

  const handleEditProfile = () => {
    if (userData?.data) {
      setSelectedUser(userData.data);
      setIsModalOpen(true);
    }
  };

  const handleModalClose = (refetchData: boolean = false) => {
    setIsModalOpen(false);
    if (refetchData) {
      refetch();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <UserCircle className="mr-2" />
          User Profile
        </h1>
        <Button
          variant="primary"
          size="sm"
          onClick={handleEditProfile}
          leftIcon={<Plus size={16} />}
        >
          Edit Profile
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <EmptyState
            title="Error loading profile"
            description="There was an error loading your profile data. Please try again."
            icon={<Users className="h-10 w-10" />}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      <div className="flex items-center">
                        <UserCircle className="h-5 w-5 mr-2 text-gray-400" />
                        {userData?.data.fullname}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1 text-gray-400" />
                        {userData?.data.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-1 text-primary-500" />
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400">
                          Admin
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEditProfile}
                        className="text-primary-600 dark:text-primary-400"
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">
                Account Information
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-sm">
                  <p className="text-gray-500 dark:text-gray-400">User ID:</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {userData?.data.id}
                  </p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-500 dark:text-gray-400">
                    Account Created:
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(userData?.data.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {isModalOpen && (
        <UserModal
          user={selectedUser}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default UsersPage;
