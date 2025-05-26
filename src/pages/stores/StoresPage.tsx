import React, { useState } from "react";
import { useQuery } from "react-query";
import { Building2, Plus, Search, SlidersHorizontal } from "lucide-react";
import apiService from "../../services/api";
import { Store } from "../../types";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Pagination from "../../components/ui/Pagination";
import EmptyState from "../../components/ui/EmptyState";
import LoadingState from "../../components/ui/LoadingState";
import StoreModal from "./StoreModal";

const StoresPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const pageSize = 10;

  // Fetch stores data
  const {
    data: storesData,
    isLoading,
    isError,
    refetch,
  } = useQuery(
    ["stores", currentPage, searchTerm],
    () =>
      apiService.getStores({
        page: currentPage,
        limit: pageSize,
        search: searchTerm,
        sortBy: "name",
        sortOrder: "asc",
      }),
    {
      keepPreviousData: true,
    }
  );

  const handleAddStore = () => {
    setSelectedStore(null);
    setIsModalOpen(true);
  };

  const handleEditStore = (store: Store) => {
    setSelectedStore(store);
    setIsModalOpen(true);
  };

  const handleDeleteStore = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this store?")) {
      try {
        await apiService.deleteStore(id);
        refetch();
      } catch (error) {
        console.error("Failed to delete store:", error);
      }
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
          <Building2 className="mr-2" />
          Stores
        </h1>
        <Button
          variant="primary"
          size="sm"
          onClick={handleAddStore}
          leftIcon={<Plus size={16} />}
        >
          Add Store
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
              <Input
                type="text"
                placeholder="Search stores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="h-5 w-5 text-gray-400" />}
                fullWidth
              />
            </div>
            <Button
              variant="outline"
              leftIcon={<SlidersHorizontal size={16} />}
            >
              Filters
            </Button>
          </div>
        </div>

        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <EmptyState
            title="Error loading stores"
            description="There was an error loading the stores data. Please try again."
            icon={<Building2 className="h-10 w-10" />}
          />
        ) : storesData?.data.data.length === 0 ? (
          <EmptyState
            title="No stores found"
            description="No stores match your search criteria. Try adjusting your search or add a new store."
            icon={<Building2 className="h-10 w-10" />}
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
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Manager
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {storesData?.data.data.map((store: Store) => (
                    <tr
                      key={store.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {store.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {store.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {store.manager}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {store.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="text"
                          size="sm"
                          onClick={() => handleEditStore(store)}
                          className="text-primary-600 dark:text-primary-400 mr-2"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="text"
                          size="sm"
                          onClick={() => handleDeleteStore(store.id)}
                          className="text-danger-600 dark:text-danger-400"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {storesData?.data.pagination && (
              <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700">
                <Pagination
                  currentPage={currentPage}
                  totalPages={storesData.data.pagination.total_page}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>

      {isModalOpen && (
        <StoreModal
          store={selectedStore}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default StoresPage;
