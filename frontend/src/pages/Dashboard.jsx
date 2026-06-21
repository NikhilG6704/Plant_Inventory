import { useEffect, useState } from "react";
import { getAssets } from "../services/api";
import ProductTable from "../components/ProductTable";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [prSearch, setPrSearch] = useState("");
  const [nameSearch, setNameSearch] = useState("");
  const [itemCodeSearch, setItemCodeSearch] = useState("");
  const [descriptionSearch, setDescriptionSearch] = useState("");

  const [selectedProduct, setSelectedProduct] = useState("");

  useEffect(() => {
    loadAssets();
  }, []);

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
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Inventory Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="PR Number"
            value={prSearch}
            onChange={(e) => setPrSearch(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-3"
          />

          <input
            type="text"
            placeholder="Product Name"
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-3"
          />

          <input
            type="text"
            placeholder="Item Code"
            value={itemCodeSearch}
            onChange={(e) => setItemCodeSearch(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-3"
          />

          <input
            type="text"
            placeholder="Description"
            value={descriptionSearch}
            onChange={(e) => setDescriptionSearch(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-3"
          />
        </div>
      </div>

      {/* Statistics & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Statistics */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Inventory Statistics
          </h3>

          <div className="space-y-6">
            <div className="flex justify-between border-b pb-3">
              <span className="text-gray-600">Total Products</span>

              <span className="text-4xl font-bold text-blue-600">
                {totalProducts}
              </span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <span className="text-gray-600">Issued Products</span>

              <span className="text-4xl font-bold text-yellow-600">
                {totalIssuedProducts}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Damaged Products</span>

              <span className="text-4xl font-bold text-red-600">
                {totalDamagedProducts}
              </span>
            </div>
          </div>
        </div>

        {/* Product Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Product Filter
          </h3>

          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3"
          >
            <option value="">All Products</option>

            {productNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          <div className="mt-8">
            <p className="text-gray-500 text-sm">Total Matching Assets</p>

            <h2 className="text-5xl font-bold text-green-600 mt-2">
              {selectedProductCount}
            </h2>
          </div>
        </div>
      </div>

      {/* Table */}
      <ProductTable products={filteredProducts} title="Inventory Assets" />
    </div>
  );
}

export default Dashboard;
