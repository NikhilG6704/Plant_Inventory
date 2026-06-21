import { useEffect, useState } from "react";
import { getReturnedAssets } from "../services/api";

function ReturnedProducts() {
  const [returnedAssets, setReturnedAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReturnedAssets();
  }, []);

  const loadReturnedAssets = async () => {
    try {
      const data = await getReturnedAssets();

      setReturnedAssets(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-xl mt-10">
        Loading Returned Assets...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-2xl font-bold">Returned Assets History</h2>
        </div>

        {returnedAssets.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No returned assets found.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="p-4 text-left">Asset</th>
                <th className="p-4 text-left">Item Code</th>
                <th className="p-4 text-left">Serial Number</th>
                <th className="p-4 text-left">Issued To</th>
                <th className="p-4 text-left">Department</th>
                <th className="p-4 text-left">Issue Date</th>
                <th className="p-4 text-left">Return Date</th>
                <th className="p-4 text-left">Remark</th>
              </tr>
            </thead>

            <tbody>
              {returnedAssets.map((asset) => (
                <tr key={asset.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{asset.item_name}</td>

                  <td className="p-4">{asset.item_code}</td>

                  <td className="p-4">{asset.serial_number}</td>

                  <td className="p-4">{asset.issued_to}</td>

                  <td className="p-4">{asset.department}</td>

                  <td className="p-4">{asset.issue_date}</td>

                  <td className="p-4 text-green-600 font-medium">
                    {asset.actual_return_date}
                  </td>

                  <td className="p-4">{asset.issue_remark || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ReturnedProducts;
