import { useState } from "react";
import { isAdmin } from "../utils/auth";

import DamageModal from "./ProductTableHelper/DamageModal";
import DeleteModal from "./ProductTableHelper/DeleteModal";
import AssetRow from "./ProductTableHelper/AssetRow";

function ProductTable({
  products,
  refreshProducts,
  title = "Inventory Assets",
  isSearching = false,
}) {
  const [showDamageModal, setShowDamageModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState(null);

  const allItems = products.flatMap((product) =>
    product.items.map((item) => ({
      ...item,
      prNo: product.prNo,
      poNo: product.poNo,
    })),
  );

  // Latest assets first
  const sortedItems = [...allItems].sort(
    (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded),
  );

  // Show only latest 20 when not searching
  const displayItems = isSearching ? sortedItems : sortedItems.slice(0, 20);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>

          <p className="text-gray-500 mt-1">
            Showing {displayItems.length} of {allItems.length} Assets
          </p>
        </div>

        {displayItems.length === 0 ? (
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
                  <th className="p-4 text-left whitespace-nowrap">
                    Date Added
                  </th>
                  <th className="p-4 text-left">ILMS</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {displayItems.map((item, index) => (
                  <AssetRow
                    key={`${item.serialNumber}-${index}`}
                    item={item}
                    index={index}
                    isAdminUser={isAdmin()}
                    activeMenu={activeMenu}
                    setActiveMenu={setActiveMenu}
                    onDamage={() => {
                      setSelectedItem(item);
                      setShowDamageModal(true);
                    }}
                    onDelete={() => {
                      setAssetToDelete(item);
                      setShowDeleteModal(true);
                    }}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DamageModal
        showDamageModal={showDamageModal}
        setShowDamageModal={setShowDamageModal}
        selectedItem={selectedItem}
        refreshProducts={refreshProducts}
      />

      <DeleteModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        assetToDelete={assetToDelete}
        setAssetToDelete={setAssetToDelete}
        refreshProducts={refreshProducts}
      />
    </>
  );
}

export default ProductTable;
