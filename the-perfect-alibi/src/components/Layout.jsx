import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  Users,
  Folder,
  Clock,
  Scale,
  RotateCcw,
} from "lucide-react";

import { resetProgress } from "../services/storageService.js";
import { useGame } from "../context/GameContext.jsx";

import navbarVintage from "../pages/navbar-vintage.jpg";
import magnifierImage from "../pages/detective-magnifier.jpg";

const links = [
  ["/dashboard", "Dashboard", LayoutDashboard],
  ["/investigation", "Investigation", Search],
  ["/suspects", "Suspects", Users],
  ["/evidence", "Evidence Board", Folder],
  ["/timeline", "Timeline", Clock],
  ["/deduction", "Final Deduction", Scale],
];

export default function Layout() {
  const navigate = useNavigate();
  const { refreshProgress } = useGame();

  const handleReset = () => {
    if (
      window.confirm(
        "Reset all Perfect Alibi progress and saved history? This cannot be undone."
      )
    ) {
      resetProgress();
      refreshProgress();
      navigate("/dashboard");
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-[#100c08] text-[#f5e8ca] md:flex">
      {/* Sidebar */}
      <aside
        className="relative flex min-h-screen w-full shrink-0 flex-col overflow-hidden border-r border-[#a88b58]/20 bg-cover bg-center md:w-[315px]"
        style={{
          backgroundImage: `url(${navbarVintage})`,
        }}
      >
        {/* Dark vintage overlay */}
        <div className="absolute inset-0 bg-[#100a04]/85" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

        {/* Sidebar content */}
        <div className="relative z-10 flex min-h-screen flex-col px-5 py-7 sm:px-6">
          {/* Logo and brand */}
          <Link
            to="/"
            className="mb-12 flex items-start gap-4"
          >
            <img
              src={magnifierImage}
              alt="Detective magnifying glass"
              className="h-[60px] w-[60px] shrink-0 border border-[#b49a65]/40 object-cover"
            />

            <div className="min-w-0 pt-0.5">
              <h2 className="font-serif text-xl font-semibold leading-8 tracking-wide text-[#fff0d0] sm:text-2xl">
                The Deduction
                <br />
                Matrix
              </h2>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            {links.map(([to, label, Icon]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `group flex min-h-[60px] items-center gap-4 rounded-xl px-4 py-3 transition-all duration-300 sm:px-5 ${
                    isActive
                      ? "bg-[#49351f]/90 text-[#fff1d3] shadow-lg shadow-black/10"
                      : "text-[#e5d4b2] hover:bg-[#49351f]/50 hover:text-[#fff3d9]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={25}
                      strokeWidth={1.9}
                      className={`shrink-0 transition-colors ${
                        isActive
                          ? "text-[#fff0d0]"
                          : "text-[#d9c6a1] group-hover:text-[#fff0d0]"
                      }`}
                    />

                    <span className="text-base font-normal tracking-wide sm:text-lg">
                      {label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Bottom actions */}
          <div className="mt-auto pt-8">
            <button
              type="button"
              onClick={handleReset}
              className="flex w-full items-center gap-3 rounded-lg border border-[#c2a777]/20 px-4 py-3 text-sm text-[#cbb58f]/70 transition hover:border-red-300/30 hover:bg-red-950/30 hover:text-red-200"
            >
              <RotateCcw size={17} />
              Reset Progress
            </button>

            <p className="mt-5 text-center text-[9px] tracking-[0.25em] text-[#cbb58f]/35">
              CONFIDENTIAL CASE FILES
            </p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="min-w-0 flex-1">
        <header className="border-b border-[#b49a65]/20 bg-[#17110b]/80 px-5 py-5 sm:px-8">
          <p className="text-[10px] tracking-[0.3em] text-[#c9ad72]/70">
            CONFIDENTIAL INVESTIGATION RECORD
          </p>

          <h1 className="mt-2 font-serif text-xl text-[#f5e8ca] sm:text-2xl">
            Think critically. Follow the evidence.
          </h1>
        </header>

        <div className="mx-auto max-w-6xl p-5 sm:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}