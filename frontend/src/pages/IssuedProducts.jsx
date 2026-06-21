import { useEffect, useState } from "react";

import IssueForm from "../components/IssueForm";
import toast from "react-hot-toast";
import { getIssuedAssets, returnAsset } from "../services/api";

function IssuedProducts() {
  const [issuedAssets, setIssuedAssets] = useState([]);

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
    try {
      await returnAsset(issueId);

      toast.success("Asset returned successfully");

      loadIssuedAssets();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <IssueForm refreshIssuedAssets={loadIssuedAssets} />

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-2xl font-bold">Issued Assets</h2>
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
                    <button
                      onClick={() => handleReturn(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                      Return
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default IssuedProducts;
