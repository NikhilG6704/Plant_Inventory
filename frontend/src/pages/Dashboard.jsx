import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAssets } from "../services/api";
import ProductTable from "../components/ProductTable";
import { exportToExcel } from "../utils/exportToExcel";
import DashboardHeader from "../components/DashboardHelper/DashboardHeader";
import InventoryStats from "../components/DashboardHelper/InventoryStats";
import ProductFilterCard from "../components/DashboardHelper/ProductFilterCard";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [prSearch, setPrSearch] = useState("");
  const [nameSearch, setNameSearch] = useState("");
  const [itemCodeSearch, setItemCodeSearch] = useState("");
  const [descriptionSearch, setDescriptionSearch] = useState("");

  const [selectedProduct, setSelectedProduct] = useState("");

  const [showExportModal, setShowExportModal] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    loadAssets();
  }, []);

  const handleExportInventory = () => {
    if (!fromDate || !toDate) {
      toast.error("Please select a date range");
      return;
    }

    const exportData = products.flatMap((product) =>
      product.items
        .filter((item) => {
          if (!item.dateAdded) return false;

          const itemDate = new Date(item.dateAdded);
          const startDate = new Date(fromDate);
          const endDate = new Date(toDate);

          endDate.setHours(23, 59, 59, 999);

          return itemDate >= startDate && itemDate <= endDate;
        })
        .map((item) => ({
          PR_Number: product.prNo,
          PO_Number: product.poNo,

          Product_Name: item.name,
          Item_Code: item.itemCode,

          Total_Quantity:
            (item.availableQuantity || 0) + (item.issuedQuantity || 0),

          Available_Quantity: item.availableQuantity || 0,
          Issued_Quantity: item.issuedQuantity || 0,

          Description: item.description || "",

          Serial_Number: item.serialNumber || "N/A",

          Date_Added: item.dateAdded,

          ILMS: item.isILMS,

          Status: item.status,
        })),
    );

    if (exportData.length === 0) {
      toast.error("No records found for selected date range");
      return;
    }

    exportToExcel(exportData, "Inventory_Assets");
    setShowExportModal(false);
  };

  const loadAssets = async () => {
    try {
      const assets = await getAssets();

      const grouped = {};

      assets.forEach((asset) => {
        if (!grouped[asset.pr_no]) {
          grouped[asset.pr_no] = {
            prNo: asset.pr_no,
            poNo: asset.po_no,
            items: [],
          };
        }

        grouped[asset.pr_no].items.push({
          id: asset.id,

          name: asset.item_name,
          itemCode: asset.item_code,
          description: asset.description,

          serialNumber: asset.serial_number,
          dateAdded: asset.date_added,

          isILMS: asset.is_ilms ? "Yes" : "No",
          status: asset.status,

          quantity: asset.quantity || 0,
          availableQuantity: asset.available_quantity || 0,
          issuedQuantity: asset.issued_quantity || 0,
        });
      });

      setProducts(Object.values(grouped));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const productNames = [
    ...new Set(
      products.flatMap((product) => product.items.map((item) => item.name)),
    ),
  ];

  const filteredProducts = products
    .map((product) => ({
      ...product,
      items: product.items.filter((item) => {
        const matchesPR =
          prSearch === "" ||
          product.prNo
            .toString()
            .toLowerCase()
            .includes(prSearch.toLowerCase());

        const matchesName =
          nameSearch === "" ||
          item.name.toLowerCase().includes(nameSearch.toLowerCase());

        const matchesItemCode =
          itemCodeSearch === "" ||
          item.itemCode.toLowerCase().includes(itemCodeSearch.toLowerCase());

        const matchesDescription =
          descriptionSearch === "" ||
          item.description
            ?.toLowerCase()
            .includes(descriptionSearch.toLowerCase());

        const matchesProductType =
          selectedProduct === "" || item.name === selectedProduct;

        return (
          matchesPR &&
          matchesName &&
          matchesItemCode &&
          matchesDescription &&
          matchesProductType
        );
      }),
    }))
    .filter((product) => product.items.length > 0);

  const totalProducts = products.reduce(
    (count, product) => count + product.items.length,
    0,
  );

  const totalIssuedProducts = products.reduce(
    (count, product) =>
      count + product.items.filter((item) => item.status === "Issued").length,
    0,
  );

  const totalDamagedProducts = products.reduce(
    (count, product) =>
      count + product.items.filter((item) => item.status === "Damaged").length,
    0,
  );

  const selectedProductCount = filteredProducts.reduce(
    (count, product) => count + product.items.length,
    0,
  );

  if (loading) {
    return (
      <div className="text-center text-xl mt-10">Loading Dashboard...</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <DashboardHeader
        prSearch={prSearch}
        setPrSearch={setPrSearch}
        nameSearch={nameSearch}
        setNameSearch={setNameSearch}
        itemCodeSearch={itemCodeSearch}
        setItemCodeSearch={setItemCodeSearch}
        descriptionSearch={descriptionSearch}
        setDescriptionSearch={setDescriptionSearch}
        handleExportInventory={() => setShowExportModal(true)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <InventoryStats
          totalProducts={totalProducts}
          totalIssuedProducts={totalIssuedProducts}
          totalDamagedProducts={totalDamagedProducts}
        />

        <ProductFilterCard
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          productNames={productNames}
          selectedProductCount={selectedProductCount}
        />
      </div>

      <ProductTable
        products={filteredProducts}
        title="Inventory Assets"
        refreshProducts={loadAssets}
        isSearching={
          prSearch !== "" ||
          nameSearch !== "" ||
          itemCodeSearch !== "" ||
          descriptionSearch !== "" ||
          selectedProduct !== ""
        }
      />

      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Export Inventory Assets</h3>

            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">From Date</label>

                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">To Date</label>

                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>

                <button
                  onClick={handleExportInventory}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
