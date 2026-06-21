import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getDamagedAssets } from "../services/api";

function DamagedProducts() {
  const [damagedAssets, setDamagedAssets] = useState([]);
  const [loading, setLoading] = useState(true);

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
        <div className="px-6 py-4 border-b">
          <h2 className="text-3xl font-bold text-gray-800">
            Damaged Assets History
          </h2>

          <p className="text-gray-500 mt-1">
            Total Damaged Assets: {damagedAssets.length}
          </p>
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
    </div>
  );
}

export default DamagedProducts;
