import toast from "react-hot-toast";

export const validateProductForm = (prNo, itemCount, items) => {
  if (Number(itemCount) > 20) {
    toast.error("You can add a maximum of 20 products");
    return false;
  }

  if (!/^\d{10}$/.test(prNo)) {
    toast.error("PR Number must be exactly 10 digits");
    return false;
  }

  if (!itemCount || Number(itemCount) < 1) {
    toast.error("Please enter number of items");
    return false;
  }

  for (const item of items) {
    if (!item.name?.trim()) {
      toast.error("Item Name is required");
      return false;
    }

    if (!item.itemCode?.trim()) {
      toast.error("Item Code is required");
      return false;
    }

    if (!item.dateAdded) {
      toast.error("Date Added is required");
      return false;
    }

    const quantity = Number(item.quantity);

    if (!quantity || quantity < 1) {
      toast.error(`Quantity for "${item.name || "Item"}" must be at least 1`);
      return false;
    }
  }

  return true;
};
