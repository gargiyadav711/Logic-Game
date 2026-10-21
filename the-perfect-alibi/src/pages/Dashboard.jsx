import { useState } from "react";
import { useNavigate } from "react-router-dom";
import magnifierImage from "./detective-magnifier.jpg";
import DashboardImage from "./dashboard.jpeg";
import WhoImage from "./who.jpeg";
import navbarVintage from "./navbar-vintage.jpg";
import CASE1 from "./CASE1.jpeg";
import CASE2 from "./CASE2.jpeg";
import CASE3 from "./CASE3.jpeg";
import CaseButton from "../components/CaseButton";
import { createMysteryCase } from "../services/aiCaseService";
import {
  Search,
  FileText,
  Fingerprint,
  LockKeyhole,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
const cases = [
  {
    id: "001",
    title: "The Perfect Alibi",
    difficulty: "EASY",
    description:
      "A suspicious timeline, conflicting statements, and one alibi that may not hold up.",
    icon: Search,
    image: CASE1,
  },
  {
    id: "002",
    title: "The Missing Evidence",
    difficulty: "MEDIUM",
    description:
      "Evidence has disappeared. Examine the details and discover what someone is hiding.",
    icon: FileText,
    image: CASE2,
  },
  {
    id: "003",
    title: "The Final Suspect",
    difficulty: "HARD",
    description:
      "Every suspect has a story. Find the contradiction that reveals the truth.",
    icon: Fingerprint,
    image: CASE3,
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeCase, setActiveCase] = useState(0);
  const [loadingId, setLoadingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const previousCase = () => {
    setActiveCase(
      (current) => (current - 1 + cases.length) % cases.length
    );
  };
  const nextCase = () => {
    setActiveCase((current) => (current + 1) % cases.length);
  };
  const getPosition = (index) => {
    if (index === activeCase) return "center";
    if (index === (activeCase + 1) % cases.length) return "right";
    return "left";
  };
  const positionClasses = {
    center:
      "left-1/2 z-20 -translate-x-1/2 scale-100 opacity-100",
    left:
      "left-1/2 z-10 -translate-x-[145%] scale-90 opacity-40",
    right:
      "left-1/2 z-10 translate-x-[45%] scale-90 opacity-40",
  };

  const handleLaunchCase = async (selectedCase) => {
    if (loadingId !== null) return;

    try {
      setLoadingId(selectedCase.id);
      setErrorMessage("");

      const difficulty =
        selectedCase.difficulty.charAt(0) +
        selectedCase.difficulty.slice(1).toLowerCase();

      const caseData = await createMysteryCase(difficulty);

      const savedCase = {
        ...caseData,
        selectedCaseId: selectedCase.id,
        archiveTitle: selectedCase.title,
        archiveDifficulty: selectedCase.difficulty,
      };

      localStorage.setItem(
        "current_active_case",
        JSON.stringify(savedCase)
      );

      localStorage.setItem(
        `perfect-alibi-generated-case-${caseData.id}`,
        JSON.stringify(savedCase)
      );

      localStorage.setItem(
        "perfect-alibi-current-case",
        caseData.id
      );

      navigate("/investigation");
    } catch (error) {
      console.error("Failed to generate mystery case:", error);

      setErrorMessage(
        error.message || "Unable to generate the case. Please try again."
      );
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#100b07] bg-cover bg-center bg-no-repeat text-white"
      style={{
        backgroundImage: `url(${DashboardImage})`,
        backgroundAttachment: "fixed",
      }}
    >
      {/* Full-page black overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-black/55"
        aria-hidden="true"
      />

      <div className="relative z-10">
        {/* NAVBAR */}
        <nav className="relative flex h-[90px] w-full items-center bg-[#080604]/85">
          {/* Magnifying-glass image */}
          <div className="relative h-full w-[105px] shrink-0 overflow-hidden sm:w-[135px]">
            <img
              src={magnifierImage}
              alt="Detective magnifying glass"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>

          {/* Branding */}
          <div className="flex min-w-0 flex-1 items-center justify-between gap-3 px-4 sm:px-7 lg:px-10">
            <div className="min-w-0">
              <h1 className="font-serif text-lg font-bold tracking-wide text-[#f5ead8] sm:text-2xl lg:text-[30px]">
                The Deduction Matrix
              </h1>
              <p className="mt-1 text-[9px] tracking-[0.25em] text-[#c9c0b2] sm:text-xs sm:tracking-[0.35em]">
                THE ART OF INVESTIGATION
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3 sm:gap-7">
              <span className="hidden text-[11px] tracking-[0.2em] text-[#d1c8bb] lg:block xl:text-xs">
                DETECTIVE DASHBOARD
              </span>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="flex h-10 items-center justify-center gap-2 border border-white/40 px-3 text-[10px] tracking-widest text-white transition duration-300 hover:border-[#e8ce8b] hover:bg-[#e8ce8b]/10 sm:min-w-[115px] sm:px-5 sm:text-xs"
              >
                <LogOut size={15} />
                EXIT
              </button>
            </div>
          </div>
        </nav>

        {/* INTRODUCTION PANEL */}


        <section className="mx-auto w-full max-w-[1300px] px-200 pt-[100px] pb-[70px] sm:px-5 sm:pt-[50px] sm:pb-12 lg:pt-[30px] lg:pb-[85px]">
          <div className="grid w-full grid-cols-2 overflow-hidden border border-[#a28b64]/60 shadow-2xl">

            <div className="relative min-h-[420px] overflow-hidden md:min-h-510px]">
              <img
                src={WhoImage}
                alt="Detective investigation"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/35" />
            </div>
            {/* Right parchment panel */}
            <div
              className="relative flex min-w-0 items-center overflow-hidden px-3 py-6 sm:px-6 sm:py-10 lg:px-[70px]"
              style={{
                backgroundImage: `url(${navbarVintage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-[#5a3b19]/55" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#76532d]/30 via-[#533719]/25 to-[#302012]/40" />

              <div className="relative z-10 w-full">
                <h2 className="font-sans text-lg font-normal leading-tight text-[#fffaf2] sm:text-3xl lg:text-[58px]">
                  Every detail tells a story.
                </h2>

                <p className="mt-3 text-xs leading-6 text-[#f4eee5]/90 sm:mt-6 sm:text-base sm:leading-8 lg:text-[20px] lg:leading-[1.95]">
                  Examine the evidence, question the alibis, and uncover the truth
                  hidden beneath every suspicious detail. Every witness has a story,
                  every suspect has a secret, and every clue brings you one step
                  closer to solving the mystery. Observe carefully, connect the
                  missing pieces, and challenge everything that seems certain.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* INVESTIGATION ARCHIVE HEADING */}
        <section className="mx-auto max-w-[1450px] px-5 pt-8 sm:px-8 sm:pt-10">
          <div className="border-b border-white/20 pb-5 text-center">
            <h2 className="font-['Bodoni_Moda',Georgia,serif] text-4xl font-normal tracking-wide text-[#f0dfad] sm:text-5xl lg:text-[58px]">
              Investigation Archive
            </h2>
          </div>
        </section>

        {/* CASE CAROUSEL */}
        <section className="mx-auto max-w-[1450px] px-5 pb-8 pt-8 sm:px-8 sm:pt-10">
          <div className="relative">
            {/* Previous */}
            <button
              type="button"
              onClick={previousCase}
              aria-label="Previous case"
              disabled={loadingId !== null}
              className="absolute left-0 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/40 bg-black/65 text-white transition hover:border-[#e8ce8b] hover:text-[#f0dfad] disabled:opacity-50 sm:left-2 sm:h-14 sm:w-14"
            >
              <ChevronLeft size={25} />
            </button>

            {/* Next */}
            <button
              type="button"
              onClick={nextCase}
              aria-label="Next case"
              disabled={loadingId !== null}
              className="absolute right-0 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/40 bg-black/65 text-white transition hover:border-[#e8ce8b] hover:text-[#f0dfad] disabled:opacity-50 sm:right-2 sm:h-14 sm:w-14"
            >
              <ChevronRight size={25} />
            </button>

            <div className="relative mx-auto h-[390px] max-w-[1000px] overflow-hidden sm:h-[405px]">
              {cases.map((item, index) => {
                const position = getPosition(index);
                const isActive = index === activeCase;
                const Icon = item.icon;

                return (
                 <article
  key={item.id}
  className={`absolute top-0 h-full w-[82%] max-w-[630px] transition-all duration-500 ease-in-out sm:w-[80%] ${positionClasses[position]}`}
>
  <div className="relative flex h-full flex-col overflow-hidden border border-[#b7a17a]/50 bg-[#100d0a] shadow-2xl">

    {/* Full-card background image */}
    <div className="absolute inset-0">
      <img
        src={item.image}
        alt=""
        className="h-full w-full object-cover opacity-75"
      />
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/35 to-black/75" />
    </div>

    {/* Card content */}
    <div className="relative z-10 flex h-full flex-col p-5 sm:p-7 lg:p-8">

      {/* Case metadata */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] tracking-[0.3em] text-[#e8cf7b] sm:text-xs">
            CLASSIFIED FILE
          </p>

          <p className="mt-4 font-serif text-3xl text-white/45">
            {item.id}
          </p>
        </div>

        <span className="border border-white/25 bg-black/20 px-3 py-3 text-[10px] tracking-[0.2em] text-white">
          {item.difficulty}
        </span>
      </div>

      {/* Case details */}
      <div className="my-auto py-5">
        <div className="mb-6 flex h-[60px] w-[60px] items-center justify-center border border-[#c7a75b]/50 bg-black/25 text-white">
          <Icon size={29} strokeWidth={1.5} />
        </div>

        <h3 className="font-['Bodoni_Moda',Georgia,serif] text-3xl leading-tight text-[#fffaf0] sm:text-4xl lg:text-5xl">
          {item.title}
        </h3>

        <p className="mt-5 max-w-xl text-sm leading-7 text-white/85 sm:text-base">
          {item.description}
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-white/20 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-4">

          {/* Confidential label */}
          <div className="flex items-center gap-2 text-[10px] tracking-widest text-white/55 sm:text-xs">
            <LockKeyhole size={16} />
            <span>CONFIDENTIAL</span>
          </div>

          {/* Open case button */}
          <CaseButton
            onClick={() => handleLaunchCase(item)}
            isActive={isActive}
            isLoading={loadingId === item.id}
          />
        </div>
      </div>

    </div>
  </div>
</article>
                );
              })}
            </div>
            {/* Carousel indicators */}
            <div className="mt-5 flex items-center justify-center gap-3">
              {cases.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveCase(index)}
                  disabled={loadingId !== null}
                  aria-label={`Show ${item.title}`}
                  className={`h-1.5 transition-all duration-500 ease-in-out ${index === activeCase
                      ? "w-12 bg-amber-200 shadow-[0_0_10px_rgba(253,230,138,0.35)]"
                      : "w-5 bg-white/30 hover:bg-amber-100/60"
                    }`}
                />
              ))}
            </div>
            {errorMessage && (
              <p
                role="alert"
                className="mt-5 text-center text-sm text-red-300"
              >
                {errorMessage}
              </p>
            )}

            {loadingId !== null && (
              <p
                role="status"
                className="mt-5 text-center text-sm text-[#f0dfad]"
              >
                Generating your mystery case. Please wait...
              </p>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-white/20 bg-black/65 px-5 py-6 sm:px-8">
          <div className="mx-auto flex max-w-[1450px] flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="font-serif text-sm tracking-wider text-[#e0c796]">
              THE DEDUCTION MATRIX
            </p>

            <p className="text-center text-[9px] tracking-[0.16em] text-white/45 sm:text-right sm:text-[10px] sm:tracking-[0.2em]">
              THINK CRITICALLY. FOLLOW THE EVIDENCE. FIND THE TRUTH.
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
