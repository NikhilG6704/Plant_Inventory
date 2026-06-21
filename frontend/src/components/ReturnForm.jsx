function ReturnForm({ returnedProducts }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6">Returned Products</h2>

      {returnedProducts.length === 0 ? (
        <p className="text-gray-500">No returned products yet.</p>
      ) : (
        returnedProducts.map((item) => (
          <div key={item.id} className="border-b py-3">
            <p>
              <strong>{item.issuedTo}</strong>
            </p>

            <p>Quantity: {item.qty}</p>

            <p>Remark: {item.remark}</p>

            <p>Date: {item.date}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default ReturnForm;
