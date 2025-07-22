import { jwtDecode } from "jwt-decode"; // ✅ Named import

export const decodeToken = (token) => {
  try {
    return jwtDecode(token); // ✅ Use named function
  } catch (error) {
    console.error("Token decode error:", error);
    return null;
  }
};

export const getUserIdFromToken = (token) => {
  const decoded = decodeToken(token);
  return decoded?.userId || null;
};
