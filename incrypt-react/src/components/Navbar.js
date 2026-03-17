import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoMenu, IoPencilOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { useMyContext } from "../store/ContextApi";
import Button from "./ui/Button";

const Navbar = () => {
  // Mobile navigation toggle
  const [headerToggle, setHeaderToggle] = useState(false);
  const pathName = useLocation().pathname;
  const navigate = useNavigate();

  // Access auth state from ContextProvider
  const { token, setToken, setCurrentUser, isAdmin, setIsAdmin } =
    useMyContext();

  const handleLogout = () => {
    localStorage.removeItem("JWT_TOKEN");
    localStorage.removeItem("USER");
    localStorage.removeItem("CSRF_TOKEN");
    localStorage.removeItem("IS_ADMIN");
    setToken(null);
    setCurrentUser(null);
    setIsAdmin(false);
    navigate("/login");
  };

  const isActive = (to) => pathName === to || pathName.startsWith(to);

  return (
    <header className="sticky top-0 z-50 bg-bg-surface border-b border-border-subtle">
      <nav className="flex h-headerHeight items-center justify-between px-4 sm:px-8 lg:px-10">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white">
            <IoPencilOutline className="text-lg" />
          </div>
          <div className="flex flex-col">
            <span className="text-h3 font-semibold text-text-main leading-none">
              Incrypt
            </span>
            <span className="text-[11px] text-text-muted leading-none mt-0.5">
              Secure notes made simple
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-6 lg:flex text-body">
          {token && (
            <>
              <li>
                <Link
                  to="/notes"
                  className={`${
                    isActive("/notes")
                      ? "text-text-main font-semibold"
                      : "text-text-muted"
                  } hover:text-text-main`}
                >
                  My Notes
                </Link>
              </li>
              <li>
                <Link
                  to="/create-note"
                  className={`${
                    isActive("/create-note")
                      ? "text-text-main font-semibold"
                      : "text-text-muted"
                  } hover:text-text-main`}
                >
                  Create Note
                </Link>
              </li>
            </>
          )}
          <li>
            <Link
              to="/contact"
              className={`${
                isActive("/contact")
                  ? "text-text-main font-semibold"
                  : "text-text-muted"
              } hover:text-text-main`}
            >
              Contact
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={`${
                isActive("/about")
                  ? "text-text-main font-semibold"
                  : "text-text-muted"
              } hover:text-text-main`}
            >
              About
            </Link>
          </li>
          {token ? (
            <>
              <li>
                <Link
                  to="/profile"
                  className={`${
                    isActive("/profile")
                      ? "text-text-main font-semibold"
                      : "text-text-muted"
                  } hover:text-text-main`}
                >
                  Profile
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link
                    to="/admin/users"
                    className={`uppercase ${
                      pathName.startsWith("/admin")
                        ? "text-primary font-semibold"
                        : "text-text-muted"
                    } hover:text-primary`}
                  >
                    Admin
                  </Link>
                </li>
              )}
              <li>
                <Button
                  size="sm"
                  onClick={handleLogout}
                  className="w-full justify-center">
                  Log out
                </Button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/signup">
                <Button size="sm">Sign up</Button>
              </Link>
            </li>
          )}
        </ul>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 lg:hidden">
          {!token && (
            <Link to="/signup">
              <Button size="sm" className="hidden sm:inline-flex">
                Sign up
              </Button>
            </Link>
          )}
          <button
            onClick={() => setHeaderToggle(!headerToggle)}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border-subtle text-text-main shadow-sm hover:bg-bg-subtle"
          >
            {headerToggle ? (
              <RxCross2 className="text-xl" />
            ) : (
              <IoMenu className="text-xl" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile nav sheet */}
      <div
        className={`lg:hidden border-b border-border-subtle bg-bg-surface transition-[max-height] duration-200 ease-out ${
          headerToggle ? "max-h-80" : "max-h-0 overflow-hidden"
        }`}
      >
        <ul className="flex flex-col gap-1 px-4 pb-4 pt-2 text-body">
          {token && (
            <>
              <li>
                <Link
                  to="/notes"
                  className={`block rounded-md px-2 py-2 ${
                    isActive("/notes")
                      ? "bg-bg-subtle text-text-main font-semibold"
                      : "text-text-muted hover:bg-bg-subtle hover:text-text-main"
                  }`}
                  onClick={() => setHeaderToggle(false)}
                >
                  My Notes
                </Link>
              </li>
              <li>
                <Link
                  to="/create-note"
                  className={`block rounded-md px-2 py-2 ${
                    isActive("/create-note")
                      ? "bg-bg-subtle text-text-main font-semibold"
                      : "text-text-muted hover:bg-bg-subtle hover:text-text-main"
                  }`}
                  onClick={() => setHeaderToggle(false)}
                >
                  Create Note
                </Link>
              </li>
            </>
          )}
          <li>
            <Link
              to="/contact"
              className={`block rounded-md px-2 py-2 ${
                isActive("/contact")
                  ? "bg-bg-subtle text-text-main font-semibold"
                  : "text-text-muted hover:bg-bg-subtle hover:text-text-main"
              }`}
              onClick={() => setHeaderToggle(false)}
            >
              Contact
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={`block rounded-md px-2 py-2 ${
                isActive("/about")
                  ? "bg-bg-subtle text-text-main font-semibold"
                  : "text-text-muted hover:bg-bg-subtle hover:text-text-main"
              }`}
              onClick={() => setHeaderToggle(false)}
            >
              About
            </Link>
          </li>
          {token ? (
            <>
              <li>
                <Link
                  to="/profile"
                  className={`block rounded-md px-2 py-2 ${
                    isActive("/profile")
                      ? "bg-bg-subtle text-text-main font-semibold"
                      : "text-text-muted hover:bg-bg-subtle hover:text-text-main"
                  }`}
                  onClick={() => setHeaderToggle(false)}
                >
                  Profile
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link
                    to="/admin/users"
                    className={`block rounded-md px-2 py-2 uppercase ${
                      pathName.startsWith("/admin")
                        ? "bg-bg-subtle text-primary font-semibold"
                        : "text-text-muted hover:bg-bg-subtle hover:text-primary"
                    }`}
                    onClick={() => setHeaderToggle(false)}
                  >
                    Admin
                  </Link>
                </li>
              )}
              <li className="mt-1">
                <Button
                  variant="ghost"
                  size="md"
                  className="w-full justify-start text-text-muted hover:text-text-main"
                  onClick={() => {
                    setHeaderToggle(false);
                    handleLogout();
                  }}
                >
                  Log out
                </Button>
              </li>
            </>
          ) : (
            <li className="mt-1">
              <Link
                to="/signup"
                onClick={() => setHeaderToggle(false)}
                className="block"
              >
                <Button size="md" className="w-full justify-center">
                  Sign up
                </Button>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
