import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import Cookies from "js-cookie";

interface WithAuthProps {
  role: "Admin" | "Student" | "Teacher";
}

const withAuth = <P extends WithAuthProps>(
  role: WithAuthProps["role"],
  WrappedComponent: React.ComponentType<P>
) => {
  const WithAuth: React.FC<P> = (props) => {
    const router = useRouter();
    const { user, loggedIn } = useAuth();
    const userRole = user?.role;

    useEffect(() => {
      if (!loggedIn || userRole !== role) {
        router.push("/auth/path");
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        Cookies.remove("role");
        Cookies.remove("userId");
      }
    }, [loggedIn, router, userRole]);

    return <WrappedComponent {...props} />;
  };

  // Set the display name for the WithAuth component
  WithAuth.displayName = `withAuth(${role})`;

  return WithAuth;
};

export default withAuth;
