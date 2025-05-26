import React, { useState } from "react";
import { useQuery } from "react-query";
import { BarChart2, Download, FileText, ShoppingCart } from "lucide-react";
import apiService from "../../services/api";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import Input from "../../components/ui/Input";

const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState("combined");
  const [filterType, setFilterType] = useState("this_month");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [title, setTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);

      const data = {
        filterType,
        startDate: filterType === "custom" ? startDate : undefined,
        endDate: filterType === "custom" ? endDate : undefined,
        title: title || undefined,
      };

      let response;

      switch (reportType) {
        case "combined":
          response = await apiService.generateCombinedReport(data);
          break;
        case "purchases":
          response = await apiService.generatePurchasesReport(data);
          break;
        case "quotations":
          response = await apiService.generateQuotationsReport(data);
          break;
        default:
          throw new Error("Invalid report type");
      }

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${reportType}-report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Failed to generate report:", error);
      alert("Failed to generate report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const getReportDescription = () => {
    switch (reportType) {
      case "combined":
        return "Combined reports include summary data for both purchases and quotations, giving you a complete overview of your business transactions.";
      case "purchases":
        return "Purchase reports provide detailed information about all purchase transactions, including suppliers, products, and payment status.";
      case "quotations":
        return "Quotation reports provide detailed information about all quotations created for customers, including their status and conversion rates.";
      default:
        return "";
    }
  };

  const getReportIcon = () => {
    switch (reportType) {
      case "combined":
        return (
          <BarChart2 className="h-16 w-16 mx-auto mb-4 text-primary-500 dark:text-primary-400" />
        );
      case "purchases":
        return (
          <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-primary-500 dark:text-primary-400" />
        );
      case "quotations":
        return (
          <FileText className="h-16 w-16 mx-auto mb-4 text-primary-500 dark:text-primary-400" />
        );
      default:
        return (
          <BarChart2 className="h-16 w-16 mx-auto mb-4 text-primary-500 dark:text-primary-400" />
        );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <BarChart2 className="mr-2" />
          Reports
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Generator */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Generate Report
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Report Type
              </label>
              <Select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                fullWidth
              >
                <option value="combined">Combined Report</option>
                <option value="purchases">Purchases Report</option>
                <option value="quotations">Quotations Report</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Time Period
              </label>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                fullWidth
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="this_week">This Week</option>
                <option value="last_week">Last Week</option>
                <option value="this_month">This Month</option>
                <option value="last_month">Last Month</option>
                <option value="this_year">This Year</option>
                <option value="last_year">Last Year</option>
                <option value="custom">Custom Range</option>
              </Select>
            </div>

            {filterType === "custom" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    fullWidth
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Date
                  </label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    fullWidth
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Report Title (Optional)
              </label>
              <Input
                type="text"
                placeholder="Enter custom report title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
              />
            </div>

            <div className="pt-4">
              <Button
                variant="primary"
                onClick={handleGenerateReport}
                isLoading={isGenerating}
                leftIcon={<Download size={16} />}
                fullWidth
              >
                Generate PDF Report
              </Button>
            </div>
          </div>
        </div>

        {/* Report Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="text-center">
            {getReportIcon()}
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              {reportType === "combined"
                ? "Combined Report"
                : reportType === "purchases"
                ? "Purchases Report"
                : "Quotations Report"}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {getReportDescription()}
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-md text-left">
              <h3 className="text-md font-medium text-blue-700 dark:text-blue-300 mb-2">
                Report Includes:
              </h3>
              <ul className="text-sm text-blue-700 dark:text-blue-300 list-disc list-inside space-y-1">
                {reportType === "combined" || reportType === "purchases" ? (
                  <>
                    <li>Purchase summary by supplier</li>
                    <li>Purchase summary by product</li>
                    <li>Purchase trends over time</li>
                  </>
                ) : null}
                {reportType === "combined" || reportType === "quotations" ? (
                  <>
                    <li>Quotation summary by customer</li>
                    <li>Quotation conversion rates</li>
                    <li>Quotation trends over time</li>
                  </>
                ) : null}
                <li>Comprehensive data tables</li>
                <li>Visual charts and graphs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
