import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import IssuedProducts from "./pages/IssuedProducts";
import DamagedProducts from "./pages/DamagedProducts";
import ReturnedProducts from "./pages/ReturnedProducts";

function App() {
  const [issuedProducts, setIssuedProducts] = useState([]);
  const [returnedProducts, setReturnedProducts] = useState([]);

  const issueProduct = (issue) => {
    setIssuedProducts((prev) => [...prev, issue]);
  };

  const returnProduct = (item) => {
    setReturnedProducts((prev) => [...prev, item]);

    setIssuedProducts((prev) => prev.filter((i) => i.id !== item.id));
  };

  return (
    <BrowserRouter>
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,

          success: {
            style: {
              background: "#16a34a",
              color: "#fff",
              borderRadius: "10px",
            },
          },

          error: {
            style: {
              background: "#dc2626",
              color: "#fff",
              borderRadius: "10px",
            },
          },
        }}
      />

      <div className="min-h-screen bg-gray-100">
        <Navbar />

        <main className="ml-64 p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />

            <Route path="/products" element={<Products />} />

            <Route
              path="/issued"
              element={
                <IssuedProducts
                  issuedProducts={issuedProducts}
                  issueProduct={issueProduct}
                  returnProduct={returnProduct}
                />
              }
            />

            <Route path="/returned" element={<ReturnedProducts />} />

            <Route path="/damaged" element={<DamagedProducts />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
