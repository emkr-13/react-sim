import React, { useState } from "react";
import { useQuery } from "react-query";
import {
  Wallet,
  Plus,
  Search,
  SlidersHorizontal,
  Mail,
  Phone,
} from "lucide-react";
import apiService from "../../services/api";
import { Akun } from "../../types";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import EmptyState from "../../components/ui/EmptyState";
import LoadingState from "../../components/ui/LoadingState";
import Pagination from "../../components/ui/Pagination";
import AkunModal from "./AkunModal";

const AkunsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<"supplier" | "customer" | "">(
    ""
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAkun, setSelectedAkun] = useState<Akun | null>(null);
  const pageSize = 10;

  // Fetch akuns data
  const {
    data: akunsData,
    isLoading,
    isError,
    refetch,
  } = useQuery(
    ["akuns", currentPage, searchTerm, typeFilter],
    () =>
      apiService.getAkuns({
        page: currentPage,
        limit: pageSize,
        search: searchTerm,
        type: typeFilter || undefined,
        sortBy: "name",
        sortOrder: "asc",
      }),
    {
      keepPreviousData: true,
    }
  );

  const handleAddAkun = () => {
    setSelectedAkun(null);
    setIsModalOpen(true);
  };

  const handleEditAkun = (akun: Akun) => {
    setSelectedAkun(akun);
    setIsModalOpen(true);
  };

  const handleDeleteAkun = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await apiService.deleteAkun(id);
        refetch();
      } catch (error) {
        console.error("Failed to delete akun:", error);
      }
    }
  };

  const handleModalClose = (refetchData: boolean = false) => {
    setIsModalOpen(false);
    if (refetchData) {
      refetch();
    }
  };

  const getTypeLabel = (type: string) => {
    return type === "supplier" ? "Supplier" : "Customer";
  };

  const getTypeBadgeClass = (type: string) => {
    return type === "supplier"
      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Wallet className="mr-2" />
          Akuns
        </h1>
        <Button
          variant="primary"
          size="sm"
          onClick={handleAddAkun}
          leftIcon={<Plus size={16} />}
        >
          Add New
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
              <Input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="h-5 w-5 text-gray-400" />}
                fullWidth
              />
            </div>
            <div className="w-full sm:w-48">
              <Select
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(e.target.value as "supplier" | "customer" | "")
                }
                fullWidth
              >
                <option value="">All Types</option>
                <option value="supplier">Suppliers</option>
                <option value="customer">Customers</option>
              </Select>
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
            title="Error loading data"
            description="There was an error loading the data. Please try again."
            icon={<Wallet className="h-10 w-10" />}
          />
        ) : akunsData?.data.data.length === 0 ? (
          <EmptyState
            title="No records found"
            description="No suppliers or customers match your search criteria. Try adjusting your search or add a new one."
            icon={<Wallet className="h-10 w-10" />}
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
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {akunsData?.data.data.map((akun: Akun) => (
                    <tr
                      key={akun.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {akun.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadgeClass(
                            akun.type
                          )}`}
                        >
                          {getTypeLabel(akun.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-1 text-gray-400" />
                          {akun.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1 text-gray-400" />
                          {akun.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                        {akun.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditAkun(akun)}
                          className="text-primary-600 dark:text-primary-400 mr-2"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAkun(akun.id)}
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

            {akunsData?.data.pagination && (
              <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700">
                <Pagination
                  currentPage={currentPage}
                  totalPages={akunsData.data.pagination.total_page}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>

      {isModalOpen && (
        <AkunModal
          akun={selectedAkun}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default AkunsPage;
