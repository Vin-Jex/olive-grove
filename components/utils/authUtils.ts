import Cookies from "js-cookie";
import { parse } from "cookie";
import { TRole } from "@/contexts/AuthContext";

export const checkLoginStatus = (req?: any) => {
  if (typeof window === "undefined") {
    // Server-side
    const cookies = parse(req?.headers.cookie || "");
    const accessToken = cookies.accessToken;
    const refreshToken = cookies.refreshToken;
    const userId = cookies.userId;
    const role = cookies.role as TRole | null;

    if (!accessToken || !refreshToken || !userId || !role) {
      return { loggedIn: false, message: "Required cookies are missing" };
    }

    const validRoles = ["Teacher", "Student", "Admin"];
    if (!validRoles.includes(role)) {
      return { loggedIn: false, message: "Invalid role" };
    }

    return {
      loggedIn: true,
      user: { id: userId, role },
      message: "User is logged in",
    };
  } else {
    // Client-side
    const accessToken = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken");
    const userId = Cookies.get("userId");
    const role = Cookies.get("role") as TRole | null;

    if (!accessToken || !refreshToken || !userId || !role) {
      return { loggedIn: false, message: "Required cookies are missing" };
    }

    const validRoles = ["Teacher", "Student", "Admin"];
    if (!validRoles.includes(role)) {
      return { loggedIn: false, message: "Invalid role" };
    }

    return {
      loggedIn: true,
      user: { id: userId, role },
      message: "User is logged in",
    };
  }
};
