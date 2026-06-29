function AssetRow({
  item,
  isAdminUser,
  activeMenu,
  setActiveMenu,
  menuRef,
  onEdit,
  onDamage,
  onDelete,
}) {
  return (
    <tr className="border-b hover:bg-slate-50 transition">
      <td className="px-4 py-4 font-medium text-base">{item.prNo}</td>

      <td className="px-4 py-4 text-base">{item.poNo || "-"}</td>

      <td className="px-4 py-4 font-medium text-base">{item.name}</td>

      <td className="px-4 py-4 text-base">{item.itemCode}</td>

      {/* Available */}
      <td className="px-4 py-4 text-center">
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
          {item.availableQuantity || 0}
        </span>
      </td>

      {/* Issued */}
      <td className="px-4 py-4 text-center">
        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
          {item.issuedQuantity || 0}
        </span>
      </td>

      <td
        className="px-4 py-4 max-w-[250px] truncate text-base"
        title={item.description}
      >
        {item.description || "-"}
      </td>

      <td className="px-4 py-4 font-mono text-base">
        {item.serialNumber || "N/A"}
      </td>

      <td className="px-4 py-4 whitespace-nowrap text-base">
        {item.dateAdded}
      </td>

      <td className="px-4 py-4 text-center">
        {item.isILMS === "Yes" ? (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
            Yes
          </span>
        ) : (
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
            No
          </span>
        )}
      </td>

      <td className="px-4 py-4 text-center">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            item.status === "Available"
              ? "bg-green-100 text-green-700"
              : item.status === "Issued"
                ? "bg-yellow-100 text-yellow-700"
                : item.status === "Damaged"
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-700"
          }`}
        >
          {item.status}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-4 text-center relative">
        {isAdminUser ? (
          <div ref={menuRef} className="relative inline-block">
            <button
              onClick={() =>
                setActiveMenu(activeMenu === item.id ? null : item.id)
              }
              className="
                w-10
                h-10
                flex
                items-center
                justify-center
                rounded-full
                hover:bg-gray-100
                text-gray-700
                text-2xl
                font-bold
                transition
              "
            >
              ⋮
            </button>

            {activeMenu === item.id && (
              <div
                className="
                  absolute
                  right-0
                  top-11
                  w-56
                  bg-white
                  border
                  border-gray-200
                  rounded-2xl
                  shadow-2xl
                  overflow-hidden
                  z-[9999]
                "
              >
                <button
                  onClick={() => {
                    setActiveMenu(null);
                    onEdit();
                  }}
                  className="
                    w-full
                    text-left
                    px-5
                    py-3
                    text-blue-600
                    hover:bg-blue-50
                    text-base
                    transition
                  "
                >
                  Edit Asset
                </button>

                {item.status === "Available" && (
                  <button
                    onClick={() => {
                      setActiveMenu(null);
                      onDamage();
                    }}
                    className="
                      w-full
                      text-left
                      px-5
                      py-3
                      text-red-600
                      hover:bg-red-50
                      text-base
                      transition
                    "
                  >
                    Mark Damaged
                  </button>
                )}

                <button
                  onClick={() => {
                    setActiveMenu(null);
                    onDelete();
                  }}
                  className="
                    w-full
                    text-left
                    px-5
                    py-3
                    text-gray-700
                    hover:bg-gray-100
                    text-base
                    transition
                  "
                >
                  Delete Asset
                </button>
              </div>
            )}
          </div>
        ) : (
          <span className="text-gray-400">View Only</span>
        )}
      </td>
    </tr>
  );
}

export default AssetRow;
