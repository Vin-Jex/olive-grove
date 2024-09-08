import { useEffect } from "react";
import { useRouter } from "next/router";
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

    useEffect(() => {
      const authToken = Cookies.get("jwt");
      const userRole = Cookies.get("role");

      if (!authToken || userRole !== role) {
        router.push("/auth/path");
        Cookies.remove("jwt");
        Cookies.remove("role");
        Cookies.remove("userId");
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  // Set the display name for the WithAuth component
  WithAuth.displayName = `withAuth(${role})`;

  return WithAuth;
};

export default withAuth;
