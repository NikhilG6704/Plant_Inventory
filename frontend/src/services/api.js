const API_URL = "http://localhost:8000/api";

export const getAssets = async () => {
  const response = await fetch(`${API_URL}/assets`);

  if (!response.ok) {
    throw new Error("Failed to fetch assets");
  }

  return response.json();
};

export const createAssets = async (data) => {
  const response = await fetch(`${API_URL}/assets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create assets");
  }

  return response.json();
};

/* ---------------- ISSUES ---------------- */

export const getIssuedAssets = async () => {
  const response = await fetch(`${API_URL}/issues`);

  if (!response.ok) {
    throw new Error("Failed to fetch issued assets");
  }

  return response.json();
};

export const issueAsset = async (data) => {
  const response = await fetch(`${API_URL}/issues`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to issue asset");
  }

  return result;
};

export const returnAsset = async (issueId) => {
  const response = await fetch(`${API_URL}/issues/${issueId}/return`, {
    method: "PUT",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to return asset");
  }

  return result;
};

export const getReturnedAssets = async () => {
  const response = await fetch(`${API_URL}/issues/returned`);

  if (!response.ok) {
    throw new Error("Failed to fetch returned assets");
  }

  return response.json();
};

export const getDamagedAssets = async () => {
  const response = await fetch(`${API_URL}/damaged`);

  if (!response.ok) {
    throw new Error("Failed to fetch damaged assets");
  }

  return response.json();
};

export const markAssetDamaged = async (data) => {
  const response = await fetch(`${API_URL}/damaged`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to mark damaged");
  }

  return result;
};
