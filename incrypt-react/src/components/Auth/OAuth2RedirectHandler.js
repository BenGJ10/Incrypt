import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useMyContext } from "../../store/ContextApi";
import Card from "../ui/Card";

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken, setIsAdmin } = useMyContext();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);

        localStorage.setItem("JWT_TOKEN", token);

        const user = {
          username: decodedToken.sub,
          roles: decodedToken.roles.split(","),
        };
        localStorage.setItem("USER", JSON.stringify(user));

        // Update context state
        setToken(token);
        setIsAdmin(user.roles.includes("ADMIN"));

        // Delay navigation to ensure local storage operations complete
        setTimeout(() => {
          navigate("/notes");
        }, 100); // 100ms delay
      } catch (error) {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [location, navigate, setToken, setIsAdmin]);

  return (
    <div className="flex min-h-[calc(100vh-74px)] items-center justify-center bg-bg-subtle px-4 py-8">
      <Card className="w-full max-w-md rounded-2xl px-6 py-7 text-center sm:px-8">
        <h2 className="text-h3 font-semibold text-text-main">Signing you in</h2>
        <p className="mt-2 text-body text-text-muted">
          Please wait while we complete your secure sign-in.
        </p>
      </Card>
    </div>
  );
};

export default OAuth2RedirectHandler;
