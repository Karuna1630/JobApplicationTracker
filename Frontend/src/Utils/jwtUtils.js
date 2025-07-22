import jwt_decode from "jwt-decode";

export const decodeToken = (token) => {
  try {
    const decoded = jwt_decode(token);
    console.log("Decoded JWT token:", decoded); // Debug
    return decoded;
  } catch (error) {
    console.error("Token decode error:", error);
    return null;
  }
};

export const getUserIdFromToken = (token) => {
  const decoded = decodeToken(token);
  // Ensure string or number support
  return decoded?.userId || decoded?.userid || decoded?.UserID || decoded?.UserId || null;
};
