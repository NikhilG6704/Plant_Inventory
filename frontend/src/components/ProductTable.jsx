import { useState } from "react";
import { isAdmin } from "../utils/auth";

import DamageModal from "./ProductTableHelper/DamageModal";
import DeleteModal from "./ProductTableHelper/DeleteModal";
import AssetRow from "./ProductTableHelper/AssetRow";
import EditModal from "./ProductTableHelper/EditModal";

function ProductTable({
  products,
  refreshProducts,
  title = "Inventory Assets",
  isSearching = false,
}) {
  const [showDamageModal, setShowDamageModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState(null);

  const allItems = products.flatMap((product) =>
    product.items.map((item) => ({
      ...item,
      prNo: product.prNo,
      poNo: product.poNo,
    })),
  );

  const sortedItems = [...allItems].sort(
    (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded),
  );

  const displayItems = isSearching ? sortedItems : sortedItems.slice(0, 20);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200">
        <div className="px-6 py-5 border-b bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>

          <p className="text-gray-500 mt-1">
            Showing {displayItems.length} of {allItems.length} Assets
          </p>
        </div>

        {displayItems.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No assets found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-base">
              <thead className="bg-slate-900 text-white sticky top-0 z-10">
                <tr>
                  <th className="px-3 py-3 text-left">PR No</th>
                  <th className="px-3 py-3 text-left">PO No</th>
                  <th className="px-3 py-3 text-left">Name</th>
                  <th className="px-3 py-3 text-left">Item Code</th>

                  <th className="px-3 py-3 text-center">Available</th>
                  <th className="px-3 py-3 text-center">Issued</th>

                  <th className="px-3 py-3 text-left">Description</th>
                  <th className="px-3 py-3 text-left">Serial Number</th>

                  <th className="px-3 py-3 text-left whitespace-nowrap">
                    Date Added
                  </th>

                  <th className="px-3 py-3 text-center">ILMS</th>
                  <th className="px-3 py-3 text-center">Status</th>
                  <th className="px-3 py-3 text-center">⋮</th>
                </tr>
              </thead>

              <tbody>
                {displayItems.map((item, index) => (
                  <AssetRow
                    key={`${item.id}-${index}`}
                    item={item}
                    isAdminUser={isAdmin()}
                    activeMenu={activeMenu}
                    setActiveMenu={setActiveMenu}
                    onEdit={() => {
                      setSelectedItem(item);
                      setShowEditModal(true);
                    }}
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

      <EditModal
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
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
