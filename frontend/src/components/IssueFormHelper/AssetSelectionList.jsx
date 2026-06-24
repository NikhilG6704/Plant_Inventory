function AssetSelectionList({
  filteredAssets,
  selectedAsset,
  setSelectedAsset,
  setAssetId,
}) {
  return (
    <div className="border rounded-lg">
      {filteredAssets.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          Search for an asset to view results
        </div>
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
              selectedAsset?.id === asset.id ? "bg-blue-50 border-blue-300" : ""
            }`}
          >
            <div className="font-semibold text-gray-800">{asset.item_name}</div>

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
  );
}

export default AssetSelectionList;
