import { useState } from "react";
import toast from "react-hot-toast";
import { markAssetDamaged } from "../services/api";

function ProductTable({ products, title = "Inventory Assets" }) {
  const [showDamageModal, setShowDamageModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [damagedBy, setDamagedBy] = useState("");
  const [department, setDepartment] = useState("");
  const [damageRemark, setDamageRemark] = useState("");

  const allItems = products.flatMap((product) =>
    product.items.map((item) => ({
      ...item,
      prNo: product.prNo,
      poNo: product.poNo,
    })),
  );

  const handleDamageSubmit = async () => {
    if (!damagedBy.trim()) {
      toast.error("Please enter Damaged By");
      return;
    }

    if (!department.trim()) {
      toast.error("Please enter Department");
      return;
    }

    try {
      await markAssetDamaged({
        assetId: selectedItem.id,
        damagedBy,
        department,
        damageRemark,
      });

      toast.success("Asset marked as damaged");

      setShowDamageModal(false);

      setDamagedBy("");
      setDepartment("");
      setDamageRemark("");

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error(error.message || "Failed to mark asset as damaged");
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>

          <p className="text-gray-500 mt-1">Total Assets: {allItems.length}</p>
        </div>

        {allItems.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No assets found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800 text-white">
                <tr>
                  <th className="p-4 text-left">PR No</th>
                  <th className="p-4 text-left">PO No</th>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Item Code</th>
                  <th className="p-4 text-left">Description</th>
                  <th className="p-4 text-left">Serial Number</th>
                  <th className="p-4 text-left">Date Added</th>
                  <th className="p-4 text-left">ILMS</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {allItems.map((item, index) => (
                  <tr
                    key={`${item.serialNumber}-${index}`}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-4 font-medium">{item.prNo}</td>

                    <td className="p-4">{item.poNo || "-"}</td>

                    <td className="p-4">{item.name}</td>

                    <td className="p-4">{item.itemCode}</td>

                    <td
                      className="p-4 max-w-[250px] truncate"
                      title={item.description}
                    >
                      {item.description || "-"}
                    </td>

                    <td className="p-4 font-mono">{item.serialNumber}</td>

                    <td className="p-4">{item.dateAdded}</td>

                    <td className="p-4">
                      {item.isILMS === "Yes" ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                          Yes
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                          No
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          item.status === "Available"
                            ? "bg-green-100 text-green-700"
                            : item.status === "Issued"
                              ? "bg-yellow-100 text-yellow-700"
                              : item.status === "Damaged"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="p-4">
                      {item.status === "Available" ? (
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setShowDamageModal(true);
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm"
                        >
                          Mark Damaged
                        </button>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Damage Modal */}
      {showDamageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              Mark Asset Damaged
            </h2>

            <div className="mb-6 p-3 bg-gray-50 rounded-lg border">
              <p className="font-semibold text-lg">{selectedItem?.name}</p>

              <p className="text-sm text-gray-600">
                {selectedItem?.itemCode} • {selectedItem?.serialNumber}
              </p>
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">
                Damaged By <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                value={damagedBy}
                onChange={(e) => setDamagedBy(e.target.value)}
                placeholder="Enter employee name"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">
                Department <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Enter department"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium">Damage Remark</label>

              <textarea
                value={damageRemark}
                onChange={(e) => setDamageRemark(e.target.value)}
                rows="4"
                placeholder="Describe the damage"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDamageModal(false);
                  setDamagedBy("");
                  setDepartment("");
                  setDamageRemark("");
                }}
                className="px-5 py-2 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleDamageSubmit}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
              >
                Mark Damaged
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductTable;
