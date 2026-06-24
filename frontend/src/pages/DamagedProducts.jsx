import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FileSpreadsheet } from "lucide-react";
import { getDamagedAssets } from "../services/api";
import { exportToExcel } from "../utils/exportToExcel";

function DamagedProducts() {
  const [damagedAssets, setDamagedAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showExportModal, setShowExportModal] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    loadDamagedAssets();
  }, []);

  const loadDamagedAssets = async () => {
    try {
      const data = await getDamagedAssets();
      setDamagedAssets(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load damaged assets");
    } finally {
      setLoading(false);
    }
  };

  const handleExportDamaged = () => {
    if (!fromDate || !toDate) {
      toast.error("Please select a date range");
      return;
    }

    const filteredData = damagedAssets.filter((item) => {
      if (!item.damaged_date) return false;

      const damagedDate = new Date(item.damaged_date);
      const startDate = new Date(fromDate);
      const endDate = new Date(toDate);

      endDate.setHours(23, 59, 59, 999);

      return damagedDate >= startDate && damagedDate <= endDate;
    });

    if (filteredData.length === 0) {
      toast.error("No records found for selected date range");
      return;
    }

    const exportData = filteredData.map((item) => ({
      Asset: item.item_name,
      Item_Code: item.item_code,
      Serial_Number: item.serial_number,
      Damaged_By: item.damaged_by,
      Department: item.department,
      Damage_Date: item.damaged_date,
      Remark: item.damage_remark,
    }));

    exportToExcel(exportData, "Damaged_Assets");
    setShowExportModal(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-xl text-gray-500">Loading damaged assets...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Damaged Assets History
            </h2>

            <p className="text-gray-500 mt-1">
              Total Damaged Assets: {damagedAssets.length}
            </p>
          </div>

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

        {damagedAssets.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No damaged assets found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800 text-white">
                <tr>
                  <th className="p-4 text-left">Asset</th>
                  <th className="p-4 text-left">Item Code</th>
                  <th className="p-4 text-left">Serial Number</th>
                  <th className="p-4 text-left">Department</th>
                  <th className="p-4 text-left">Damaged By</th>
                  <th className="p-4 text-left">Damaged Date</th>
                  <th className="p-4 text-left">Remark</th>
                </tr>
              </thead>

              <tbody>
                {damagedAssets.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-4 font-medium">{item.item_name}</td>

                    <td className="p-4">{item.item_code}</td>

                    <td className="p-4 font-mono">{item.serial_number}</td>

                    <td className="p-4">{item.department}</td>

                    <td className="p-4">{item.damaged_by}</td>

                    <td className="p-4">
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                        {item.damaged_date}
                      </span>
                    </td>

                    <td
                      className="p-4 max-w-[300px] truncate"
                      title={item.damage_remark}
                    >
                      {item.damage_remark || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Export Damaged Assets</h3>

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
                  onClick={handleExportDamaged}
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

export default DamagedProducts;
