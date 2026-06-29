function SelectedAssetCard({ selectedAsset }) {
  if (!selectedAsset) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 shadow-sm">
      <h3 className="font-semibold text-blue-900 text-lg mb-4">
        Selected Asset
      </h3>

      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-semibold">Name:</span> {selectedAsset.item_name}
        </div>

        <div>
          <span className="font-semibold">Item Code:</span>{" "}
          {selectedAsset.item_code}
        </div>

        <div>
          <span className="font-semibold">Serial Number:</span>{" "}
          {selectedAsset.serial_number || "N/A"}
        </div>

        <div>
          <span className="font-semibold">ILMS:</span>{" "}
          {selectedAsset.is_ilms ? "Yes" : "No"}
        </div>

        {/* Quantity Information */}

        <div className="bg-white rounded-lg p-3 border">
          <div className="text-gray-500 text-xs mb-1">Total Quantity</div>

          <div className="text-xl font-bold text-blue-700">
            {selectedAsset.quantity || 0}
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 border">
          <div className="text-gray-500 text-xs mb-1">Available Quantity</div>

          <div className="text-xl font-bold text-green-600">
            {selectedAsset.available_quantity || 0}
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 border">
          <div className="text-gray-500 text-xs mb-1">Issued Quantity</div>

          <div className="text-xl font-bold text-orange-600">
            {selectedAsset.issued_quantity || 0}
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 border">
          <div className="text-gray-500 text-xs mb-1">Status</div>

          <div
            className={`font-bold ${
              selectedAsset.status === "Available"
                ? "text-green-600"
                : "text-yellow-600"
            }`}
          >
            {selectedAsset.status}
          </div>
        </div>

        <div className="md:col-span-2">
          <span className="font-semibold">Description:</span>{" "}
          {selectedAsset.description || "N/A"}
        </div>
      </div>
    </div>
  );
}

export default SelectedAssetCard;
