import { useState } from "react";
import toast from "react-hot-toast";

function ProductForm({ addProduct }) {
  const [prNo, setPrNo] = useState("");
  const [poNo, setPoNo] = useState("");
  const [itemCount, setItemCount] = useState("");
  const [items, setItems] = useState([]);

  const handleItemCountChange = (count) => {
    setItemCount(count);

    const newItems = Array.from({ length: Number(count) || 0 }, (_, index) => ({
      id: index + 1,
      name: "",
      itemCode: "",
      description: "",
      serialNumber: "",
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

    if (!/^\d{10}$/.test(prNo)) {
      toast.error("PR Number must be exactly 10 digits");
      return;
    }

    if (!itemCount || Number(itemCount) < 1) {
      toast.error("Please enter number of items");
      return;
    }

    for (const item of items) {
      if (
        !item.name ||
        !item.itemCode ||
        !item.serialNumber ||
        !item.dateAdded
      ) {
        toast.error("Please fill all required item fields");
        return;
      }
    }

    addProduct({
      prNo,
      poNo,
      items,
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
          <div key={index} className="border rounded-xl p-6 mb-6 bg-gray-50">
            <h3 className="font-bold text-lg mb-4">Item {index + 1}</h3>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Item Name */}
              <div>
                <label className="block mb-2 font-medium">
                  Item Name <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  value={item.name}
                  onChange={(e) =>
                    handleItemChange(index, "name", e.target.value)
                  }
                  placeholder="Enter Item Name"
                  className={`w-full rounded-lg p-3 ${
                    item.name === ""
                      ? "border-2 border-red-300"
                      : "border border-gray-300"
                  }`}
                />
              </div>

              {/* Item Code */}
              <div>
                <label className="block mb-2 font-medium">
                  Item Code <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  value={item.itemCode}
                  onChange={(e) =>
                    handleItemChange(index, "itemCode", e.target.value)
                  }
                  placeholder="Enter Item Code"
                  className={`w-full rounded-lg p-3 ${
                    item.itemCode === ""
                      ? "border-2 border-red-300"
                      : "border border-gray-300"
                  }`}
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block mb-2 font-medium">Description</label>

                <textarea
                  value={item.description}
                  onChange={(e) =>
                    handleItemChange(index, "description", e.target.value)
                  }
                  placeholder="Enter Description"
                  rows="3"
                  className="w-full border rounded-lg p-3"
                />
              </div>

              {/* Serial Number */}
              <div>
                <label className="block mb-2 font-medium">
                  Serial Number <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  value={item.serialNumber}
                  onChange={(e) =>
                    handleItemChange(index, "serialNumber", e.target.value)
                  }
                  placeholder="Enter Serial Number"
                  className={`w-full rounded-lg p-3 ${
                    item.serialNumber === ""
                      ? "border-2 border-red-300"
                      : "border border-gray-300"
                  }`}
                />
              </div>

              {/* Date Added */}
              <div>
                <label className="block mb-2 font-medium">
                  Date Added <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  value={item.dateAdded}
                  readOnly
                  className="w-full border rounded-lg p-3 bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* ILMS */}
              <div>
                <label className="block mb-2 font-medium">
                  ILMS Product? <span className="text-red-500">*</span>
                </label>

                <select
                  value={item.isILMS}
                  onChange={(e) =>
                    handleItemChange(index, "isILMS", e.target.value)
                  }
                  className="w-full border rounded-lg p-3"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          </div>
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
