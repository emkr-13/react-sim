import React, { useState } from "react";
import { useQuery } from "react-query";
import { ArrowLeftRight, Search, SlidersHorizontal } from "lucide-react";
import apiService from "../../services/api";
import { StockMovement } from "../../types";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";

const StockMovementsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [movementType, setMovementType] = useState<"in" | "out" | "">("");
  const pageSize = 10;

  // Fetch stock movements data
  const {
    data: stockMovementsData,
    isLoading,
    isError,
  } = useQuery(
    ["stockMovements", currentPage, searchTerm, movementType],
    () =>
      apiService.getStockMovements({
        page: currentPage,
        limit: pageSize,
        search: searchTerm,
        movementType: movementType as "in" | "out" | undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
      }),
    {
      keepPreviousData: true,
    }
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Formatting date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <ArrowLeftRight className="mr-2" />
          Stock Movements
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
              <Input
                type="text"
                placeholder="Search by product name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="h-5 w-5 text-gray-400" />}
                fullWidth
              />
            </div>
            <div className="w-full sm:w-48">
              <Select
                value={movementType}
                onChange={(e) =>
                  setMovementType(e.target.value as "in" | "out" | "")
                }
                fullWidth
              >
                <option value="">All Movements</option>
                <option value="in">Stock In</option>
                <option value="out">Stock Out</option>
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
          <div className="p-8 text-center">Loading...</div>
        ) : isError ? (
          <div className="p-8 text-center text-danger-600 dark:text-danger-400">
            Error loading stock movements. Please try again.
          </div>
        ) : stockMovementsData?.data.data.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No stock movements found. Try adjusting your search criteria.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Store
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Note
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {stockMovementsData?.data.data.map(
                    (movement: StockMovement) => (
                      <tr
                        key={movement.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(movement.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {movement.productName}
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            SKU: {movement.productSku}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              movement.movementType === "in"
                                ? "bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400"
                                : "bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-400"
                            }`}
                          >
                            {movement.movementType === "in"
                              ? "Stock In"
                              : "Stock Out"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {movement.quantity} {movement.productSatuan}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {movement.storeName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                          {movement.note || "-"}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {stockMovementsData?.data.pagination && (
              <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * pageSize + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      currentPage * pageSize,
                      stockMovementsData.data.pagination.total_data
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">
                    {stockMovementsData.data.pagination.total_data}
                  </span>{" "}
                  results
                </div>
                <nav className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  {Array.from(
                    { length: stockMovementsData.data.pagination.total_page },
                    (_, i) => i + 1
                  ).map((page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "primary" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={
                      currentPage ===
                      stockMovementsData.data.pagination.total_page
                    }
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </Button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StockMovementsPage;
