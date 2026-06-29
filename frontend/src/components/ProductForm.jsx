import { useState } from "react";
import toast from "react-hot-toast";
import ProductItemForm from "./ProductFormHelper/ProductItemForm";
import { validateProductForm } from "../utils/productValidation";
function ProductForm({ addProduct }) {
  const [prNo, setPrNo] = useState("");
  const [poNo, setPoNo] = useState("");
  const [itemCount, setItemCount] = useState("");
  const [items, setItems] = useState([]);

  const handleItemCountChange = (count) => {
    const numCount = Number(count);

    if (numCount > 20) {
      toast.error("Maximum 20 products can be added at a time");
      return;
    }

    setItemCount(count);

    const newItems = Array.from({ length: numCount || 0 }, (_, index) => ({
      id: index + 1,
      name: "",
      itemCode: "",
      description: "",
      serialNumber: "",
      quantity: 1,
      dateAdded: new Date().toISOString().split("T")[0],
      isILMS: "No",
    }));

    setItems(newItems);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateProductForm(prNo, itemCount, items)) {
      return;
    }

    // Convert blank serial numbers to N/A
    const processedItems = items.map((item) => ({
      ...item,
      serialNumber:
        item.serialNumber?.trim() === "" ? "N/A" : item.serialNumber.trim(),
    }));

    addProduct({
      prNo,
      poNo,
      items: processedItems,
    });

    toast.success("Products added successfully");

    setPrNo("");
    setPoNo("");
    setItemCount("");
    setItems([]);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-2">Add Products</h2>

      <p className="text-sm text-gray-500 mb-6">
        Fields marked with <span className="text-red-500 font-bold">*</span> are
        required.
      </p>

      <form onSubmit={handleSubmit}>
        {/* Top Section */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {/* PR Number */}
          <div>
            <label className="block mb-2 font-medium">
              PR Number <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              maxLength={10}
              value={prNo}
              onChange={(e) => setPrNo(e.target.value)}
              placeholder="10 Digit PR Number"
              className={`w-full rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                prNo === ""
                  ? "border-2 border-red-300"
                  : "border border-gray-300"
              }`}
            />
          </div>

          {/* PO Number */}
          <div>
            <label className="block mb-2 font-medium">PO Number</label>

            <input
              type="text"
              value={poNo}
              onChange={(e) => setPoNo(e.target.value)}
              placeholder="Optional"
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Number Of Items */}
          <div>
            <label className="block mb-2 font-medium">
              Number of Items <span className="text-red-500">*</span>
            </label>

            <input
              type="number"
              min="1"
              value={itemCount}
              max="20"
              onChange={(e) => handleItemCountChange(e.target.value)}
              className={`w-full rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                itemCount === ""
                  ? "border-2 border-red-300"
                  : "border border-gray-300"
              }`}
            />
          </div>
        </div>

        {/* Dynamic Items */}
        {items.map((item, index) => (
          <ProductItemForm
            key={index}
            item={item}
            index={index}
            handleItemChange={handleItemChange}
          />
        ))}
        {items.length > 0 && (
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-xl font-medium"
          >
            Save Products
          </button>
        )}
      </form>
    </div>
  );
}

export default ProductForm;
