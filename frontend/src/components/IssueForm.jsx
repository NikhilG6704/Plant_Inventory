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

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      const data = await getAssets();

      const availableAssets = data.filter(
        (asset) => asset.available_quantity > 0,
      );

      setAssets(availableAssets);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load assets");
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

    if (!issuedTo.trim()) {
      toast.error("Please enter Issued To");
      return;
    }

    if (!department.trim()) {
      toast.error("Please enter Department");
      return;
    }

    if (quantity < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }

    if (selectedAsset && quantity > selectedAsset.available_quantity) {
      toast.error(`Only ${selectedAsset.available_quantity} item(s) available`);
      return;
    }

    try {
      await issueAsset({
        assetId,
        issuedTo,
        department,
        remark,
        quantity,
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

      setQuantity(1);

      await loadAssets();

      if (refreshIssuedAssets) {
        refreshIssuedAssets();
      }
    } catch (error) {
      toast.error(error.message || "Failed to issue asset");
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

        <AssetSelectionList
          filteredAssets={filteredAssets}
          selectedAsset={selectedAsset}
          setSelectedAsset={setSelectedAsset}
          setAssetId={setAssetId}
        />

        <SelectedAssetCard selectedAsset={selectedAsset} />

        {selectedAsset && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <h3 className="font-semibold text-lg mb-4">Quantity Details</h3>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Total Quantity
                </label>

                <input
                  value={selectedAsset.quantity || 0}
                  readOnly
                  className="w-full border rounded-lg p-3 bg-gray-100"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Available Quantity
                </label>

                <input
                  value={selectedAsset.available_quantity || 0}
                  readOnly
                  className="w-full border rounded-lg p-3 bg-green-50"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Issue Quantity *
                </label>

                <input
                  type="number"
                  min="1"
                  max={selectedAsset.available_quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

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
          className="
            bg-blue-600
            hover:bg-blue-700
            disabled:bg-gray-400
            disabled:cursor-not-allowed
            text-white
            px-6
            py-3
            rounded-lg
            transition
            font-medium
          "
        >
          Issue Asset
        </button>
      </form>
    </div>
  );
}

export default IssueForm;
