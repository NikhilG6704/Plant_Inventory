import { useEffect, useState } from "react";
import ProductForm from "../components/ProductForm";
import ProductTable from "../components/ProductTable";
import { isAdmin } from "../utils/auth";
import { getAssets, createAssets } from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const groupAssetsByPR = (assets) => {
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

        prNo: asset.pr_no,
        poNo: asset.po_no,

        name: asset.item_name,
        itemCode: asset.item_code,
        description: asset.description,
        serialNumber: asset.serial_number,

        quantity: asset.quantity || 1,
        availableQuantity: asset.available_quantity || 0,
        issuedQuantity: asset.issued_quantity || 0,

        dateAdded: asset.date_added,
        isILMS: asset.is_ilms ? "Yes" : "No",
        status: asset.status,
      });
    });

    return Object.values(grouped);
  };

  const loadAssets = async () => {
    try {
      setLoading(true);

      const data = await getAssets();

      console.log("Assets received:", data);

      setProducts(groupAssetsByPR(data));
    } catch (error) {
      console.error("Failed to load assets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const addProduct = async (productData) => {
    try {
      await createAssets(productData);

      await loadAssets();
    } catch (error) {
      console.error(error);
      alert("Failed to save assets");
    }
  };

  if (loading) {
    return <div className="p-8 text-lg">Loading inventory...</div>;
  }

  return (
    <div className="p-6">
      {isAdmin() && <ProductForm addProduct={addProduct} />}

      <ProductTable
        products={products}
        title="Inventory Assets"
        refreshProducts={loadAssets}
      />
    </div>
  );
}

export default Products;
