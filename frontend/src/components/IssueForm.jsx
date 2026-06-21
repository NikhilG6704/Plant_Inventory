import { useEffect, useState } from "react";
import { getAssets, issueAsset } from "../services/api";
import toast from "react-hot-toast";
function IssueForm({ refreshIssuedAssets }) {
  const [assets, setAssets] = useState([]);

  const [assetId, setAssetId] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(null);

  const [nameFilter, setNameFilter] = useState("");
  const [itemCodeFilter, setItemCodeFilter] = useState("");
  const [serialFilter, setSerialFilter] = useState("");
  const [descriptionFilter, setDescriptionFilter] = useState("");

  const [issuedTo, setIssuedTo] = useState("");
  const [department, setDepartment] = useState("");
  const [remark, setRemark] = useState("");

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      const data = await getAssets();

      const availableAssets = data.filter(
        (asset) => asset.status === "Available",
      );

      setAssets(availableAssets);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredAssets = assets.filter((asset) => {
    return (
      (nameFilter === "" ||
        asset.item_name?.toLowerCase().includes(nameFilter.toLowerCase())) &&
      (itemCodeFilter === "" ||
        asset.item_code
          ?.toLowerCase()
          .includes(itemCodeFilter.toLowerCase())) &&
      (serialFilter === "" ||
        asset.serial_number
          ?.toLowerCase()
          .includes(serialFilter.toLowerCase())) &&
      (descriptionFilter === "" ||
        asset.description
          ?.toLowerCase()
          .includes(descriptionFilter.toLowerCase()))
    );
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!assetId) {
      toast.error("Please select an asset");
      return;
    }

    try {
      await issueAsset({
        assetId,
        issuedTo,
        department,
        remark,
      });

      toast.success("Asset issued successfully");

      setAssetId("");
      setSelectedAsset(null);

      setNameFilter("");
      setItemCodeFilter("");
      setSerialFilter("");
      setDescriptionFilter("");

      setIssuedTo("");
      setDepartment("");
      setRemark("");

      await loadAssets();
      refreshIssuedAssets();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-2">Issue Asset</h2>

      <p className="text-sm text-gray-500 mb-6">
        Fields marked with <span className="text-red-500 font-semibold">*</span>{" "}
        are required.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Search Filters */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search Name"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="border rounded-lg p-3"
          />

          <input
            type="text"
            placeholder="Search Item Code"
            value={itemCodeFilter}
            onChange={(e) => setItemCodeFilter(e.target.value)}
            className="border rounded-lg p-3"
          />

          <input
            type="text"
            placeholder="Search Serial Number"
            value={serialFilter}
            onChange={(e) => setSerialFilter(e.target.value)}
            className="border rounded-lg p-3"
          />

          <input
            type="text"
            placeholder="Search Description"
            value={descriptionFilter}
            onChange={(e) => setDescriptionFilter(e.target.value)}
            className="border rounded-lg p-3"
          />
        </div>

        {/* Asset Results */}
        <div className="border rounded-lg max-h-80 overflow-y-auto">
          {filteredAssets.length === 0 ? (
            <div className="p-4 text-gray-500">No matching assets found</div>
          ) : (
            filteredAssets.map((asset) => (
              <button
                key={asset.id}
                type="button"
                onClick={() => {
                  setAssetId(asset.id);
                  setSelectedAsset(asset);
                }}
                className={`w-full text-left p-4 border-b hover:bg-gray-50 transition ${
                  selectedAsset?.id === asset.id
                    ? "bg-blue-50 border-blue-300"
                    : ""
                }`}
              >
                <div className="font-semibold text-gray-800">
                  {asset.item_name}
                </div>

                <div className="text-blue-600 text-sm">
                  {asset.item_code} • {asset.serial_number}
                </div>

                <div className="text-gray-500 text-sm mt-1">
                  {asset.description || "No description available"}
                </div>

                <div className="mt-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      asset.is_ilms
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    ILMS: {asset.is_ilms ? "Yes" : "No"}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Selected Asset */}
        {selectedAsset && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-3">Selected Asset</h3>

            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div>
                <strong>Name:</strong> {selectedAsset.item_name}
              </div>

              <div>
                <strong>Item Code:</strong> {selectedAsset.item_code}
              </div>

              <div>
                <strong>Serial Number:</strong> {selectedAsset.serial_number}
              </div>

              <div>
                <strong>ILMS:</strong> {selectedAsset.is_ilms ? "Yes" : "No"}
              </div>

              <div className="md:col-span-2">
                <strong>Description:</strong>{" "}
                {selectedAsset.description || "N/A"}
              </div>
            </div>
          </div>
        )}

        {/* Issued To */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Issued To <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            value={issuedTo}
            onChange={(e) => setIssuedTo(e.target.value)}
            className="w-full border rounded-lg p-3"
            placeholder="Enter employee name"
            required
          />
        </div>

        {/* Department */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Department <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full border rounded-lg p-3"
            placeholder="Enter department"
            required
          />
        </div>

        {/* Remark */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Remark</label>

          <textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            rows="4"
            className="w-full border rounded-lg p-3"
            placeholder="Optional remarks"
          />
        </div>

        <button
          type="submit"
          disabled={!assetId}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition"
        >
          Issue Asset
        </button>
      </form>
    </div>
  );
}

export default IssueForm;
