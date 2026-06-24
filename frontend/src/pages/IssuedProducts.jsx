import { useEffect, useState } from "react";
import { isAdmin } from "../utils/auth";
import IssueForm from "../components/IssueForm";
import toast from "react-hot-toast";
import { getIssuedAssets, returnAsset } from "../services/api";
import { exportToExcel } from "../utils/exportToExcel";
import { FileSpreadsheet } from "lucide-react";

function IssuedProducts() {
  const [issuedAssets, setIssuedAssets] = useState([]);

  const [showExportModal, setShowExportModal] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    loadIssuedAssets();
  }, []);

  const loadIssuedAssets = async () => {
    try {
      const data = await getIssuedAssets();
      setIssuedAssets(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleReturn = async (issueId) => {
    if (!isAdmin()) {
      toast.error("Access denied");
      return;
    }

    try {
      await returnAsset(issueId);

      toast.success("Asset returned successfully");
      loadIssuedAssets();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleExportIssued = () => {
    if (!fromDate || !toDate) {
      toast.error("Please select a date range");
      return;
    }

    const filteredData = issuedAssets.filter((item) => {
      if (!item.issue_date) return false;

      const issueDate = new Date(item.issue_date);
      const startDate = new Date(fromDate);
      const endDate = new Date(toDate);

      endDate.setHours(23, 59, 59, 999);

      return issueDate >= startDate && issueDate <= endDate;
    });

    if (filteredData.length === 0) {
      toast.error("No records found for selected date range");
      return;
    }

    const exportData = filteredData.map((item) => ({
      Asset: item.item_name,
      Item_Code: item.item_code,
      Serial_Number: item.serial_number,
      Issued_To: item.issued_to,
      Department: item.department,
      Issue_Date: item.issue_date,
      Remark: item.issue_remark,
    }));

    exportToExcel(exportData, "Issued_Assets");
    setShowExportModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {isAdmin() && <IssueForm refreshIssuedAssets={loadIssuedAssets} />}

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-2xl font-bold">Issued Assets</h2>

          <button
            onClick={() => setShowExportModal(true)}
            className="
              flex items-center gap-2
              bg-green-600 hover:bg-green-700
              hover:scale-105
              text-white
              px-5 py-2.5
              rounded-xl
              shadow-md
              transition-all duration-200
            "
          >
            <FileSpreadsheet size={20} />
            Export Excel
          </button>
        </div>

        {issuedAssets.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No issued assets.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="p-4 text-left">Asset</th>
                <th className="p-4 text-left">Item Code</th>
                <th className="p-4 text-left">Serial Number</th>
                <th className="p-4 text-left">Issued To</th>
                <th className="p-4 text-left">Department</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Remark</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {issuedAssets.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{item.item_name}</td>
                  <td className="p-4">{item.item_code}</td>
                  <td className="p-4">{item.serial_number}</td>
                  <td className="p-4">{item.issued_to}</td>
                  <td className="p-4">{item.department}</td>
                  <td className="p-4">{item.issue_date}</td>
                  <td className="p-4">{item.issue_remark}</td>

                  <td className="p-4">
                    {isAdmin() ? (
                      <button
                        onClick={() => handleReturn(item.id)}
                        className="
                          bg-red-500 hover:bg-red-600
                          hover:scale-105
                          text-white
                          px-4 py-2
                          rounded-lg
                          transition-all duration-200
                        "
                      >
                        Return
                      </button>
                    ) : (
                      <span className="text-gray-400">View Only</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Export Issued Assets</h3>

            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">From Date</label>

                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">To Date</label>

                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>

                <button
                  onClick={handleExportIssued}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default IssuedProducts;
