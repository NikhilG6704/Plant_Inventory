function ProductItemForm({ item, index, handleItemChange }) {
  return (
    <div className="border rounded-xl p-6 mb-6 bg-gray-50">
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
            onChange={(e) => handleItemChange(index, "name", e.target.value)}
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

        {/* Quantity */}
        <div>
          <label className="block mb-2 font-medium">
            Quantity <span className="text-red-500">*</span>
          </label>

          <input
            type="number"
            min="1"
            value={item.quantity || 1}
            onChange={(e) =>
              handleItemChange(index, "quantity", e.target.value)
            }
            placeholder="Enter Quantity"
            className={`w-full rounded-lg p-3 ${
              !item.quantity || Number(item.quantity) < 1
                ? "border-2 border-red-300"
                : "border border-gray-300"
            }`}
          />
        </div>

        {/* Serial Number */}
        <div>
          <label className="block mb-2 font-medium">Serial Number</label>

          <input
            type="text"
            value={item.serialNumber}
            onChange={(e) =>
              handleItemChange(index, "serialNumber", e.target.value)
            }
            placeholder="Leave blank for N/A"
            className="w-full border rounded-lg p-3"
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
            onChange={(e) => handleItemChange(index, "isILMS", e.target.value)}
            className="w-full border rounded-lg p-3"
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default ProductItemForm;
