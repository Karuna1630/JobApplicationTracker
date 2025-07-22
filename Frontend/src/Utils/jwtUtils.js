import { jwtDecode } from "jwt-decode"; 

export const decodeToken = (token) => {
  try {
    return jwtDecode(token); 
  } catch (error) {
    console.error("Token decode error:", error);
    return null;
  }
};

export const getUserIdFromToken = (token) => {
  const decoded = decodeToken(token);
  return decoded?.userId || null;
};
