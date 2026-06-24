import { useEffect, useState } from "react";
import { getAssets, issueAsset } from "../services/api";
import toast from "react-hot-toast";
import AssetSearchFilters from "./IssueFormHelper/AssetSearchFilters";
import AssetSelectionList from "./IssueFormHelper/AssetSelectionList";
import SelectedAssetCard from "./IssueFormHelper/SelectedAssetCard";
import IssueDetailsForm from "./IssueFormHelper/IssueDetailsForm";
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

  const hasSearch =
    nameFilter.trim() ||
    itemCodeFilter.trim() ||
    serialFilter.trim() ||
    descriptionFilter.trim();

  const filteredAssets = hasSearch
    ? assets
        .filter((asset) => {
          return (
            (nameFilter === "" ||
              asset.item_name
                ?.toLowerCase()
                .includes(nameFilter.toLowerCase())) &&
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
        })
        .slice(0, 50)
    : [];

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
        <AssetSearchFilters
          nameFilter={nameFilter}
          setNameFilter={setNameFilter}
          itemCodeFilter={itemCodeFilter}
          setItemCodeFilter={setItemCodeFilter}
          serialFilter={serialFilter}
          setSerialFilter={setSerialFilter}
          descriptionFilter={descriptionFilter}
          setDescriptionFilter={setDescriptionFilter}
        />

        {/* Asset Results */}
        <AssetSelectionList
          filteredAssets={filteredAssets}
          selectedAsset={selectedAsset}
          setSelectedAsset={setSelectedAsset}
          setAssetId={setAssetId}
        />

        {/* Selected Asset */}
        <SelectedAssetCard selectedAsset={selectedAsset} />
        {/* Issued Asset */}
        <IssueDetailsForm
          issuedTo={issuedTo}
          setIssuedTo={setIssuedTo}
          department={department}
          setDepartment={setDepartment}
          remark={remark}
          setRemark={setRemark}
        />

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
