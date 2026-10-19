import { useState } from "react";
import { useNavigate } from "react-router-dom";
import navbarVintage from "./navbar-vintage.jpg";
import magnifierImage from "./detective-magnifier.jpg";
import DashboardImage from "./dashboard.jpeg";
import WhoImage from "./who.jpeg";
import CASE1 from "./CASE1.jpeg";
import CASE2 from "./CASE2.jpeg";
import CASE3 from "./CASE3.jpeg";
import CaseButton from "../components/CaseButton";
import { createMysteryCase } from "../services/aiCaseService";
import {Search,FileText,Fingerprint,LockKeyhole,LogOut,ChevronLeft,ChevronRight,} from "lucide-react";

const cases = [
    {
        id: "001",
        title: "The Perfect Alibi",
        difficulty: "EASY",
        description:"A suspicious timeline, conflicting statements, and one alibi that may not hold up.",
        icon: Search,
        image: CASE1,
        color: "text-white",
        level: "01",
    },
    {
        id: "002",
        title: "The Missing Evidence",
        difficulty: "MEDIUM",
        description:"Evidence has disappeared. Examine the details and discover what someone is hiding.",
        icon: FileText,
        image: CASE2,
        color: "text-white",
        level: "02",
    },
    {
        id: "003",
        title: "The Final Suspect",
        difficulty: "HARD",
        description:"Every suspect has a story. Find the contradiction that reveals the truth.",
        icon: Fingerprint,
        image: CASE3,
        color: "text-white",
        level: "03",
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

    const handleLaunchCase = async (selectedCase) => {
        if (loadingId) return;
        try {
            setLoadingId(selectedCase.id);
            setErrorMessage("");
            const difficulty =
                selectedCase.difficulty.charAt(0) +
                selectedCase.difficulty.slice(1).toLowerCase();
            // Generate a new mystery using Gemini.
            const caseData = await createMysteryCase(difficulty);
            const savedCase = {
                ...caseData,
                selectedCaseId: selectedCase.id,
                archiveTitle: selectedCase.title,
                archiveDifficulty: selectedCase.difficulty,
            };
            localStorage.setItem("current_active_case",JSON.stringify(savedCase));
            localStorage.setItem(`perfect-alibi-generated-case-${caseData.id}`,
                JSON.stringify(savedCase)
            );

            localStorage.setItem("perfect-alibi-current-case",
                caseData.id
            );
            navigate("/investigate");
        }
        catch (error)
        {
            console.error("Failed to generate mystery case:", error);
            setErrorMessage(
                error.message ||"Unable to generate the case. Please try again."
            );
        }
        finally{
            setLoadingId(null);
        }
    };
    const positionClasses = {
        center:"left-1/2 z-20 translate-x-[-50%] scale-100 opacity-100",
        left:"left-1/2 z-10 translate-x-[-145%] scale-90 opacity-35",
        right:"left-1/2 z-10 translate-x-[45%] scale-90 opacity-35",
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-cover bg-center bg-fixed text-white"
            style={{ backgroundImage: `url(${DashboardImage})` }}>
            <div className="absolute inset-0 z-0 bg-black/65" />
            <div className="relative z-10">
                <nav className="relative flex h-24 w-full items-center overflow-hidden border-b border-white/20 bg-transparent">
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="relative z-10 h-full w-24 shrink-0 overflow-hidden sm:w-28">
                        <img
                            src={magnifierImage}
                            alt="Detective magnifying glass"
                            className="block h-full w-full object-cover object-center"/>
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-black" />
                        <div className="pointer-events-none absolute inset-0 bg-black/20" />
                    </div>
                    <div className="relative z-10 flex min-w-0 flex-1 items-center justify-between gap-3 px-4 sm:px-8">
                        <div className="min-w-0">
                            <h1 className="font-serif text-lg font-bold tracking-wide text-white sm:text-2xl">
                                The Deduction Matrix
                            </h1>
                            <p className="mt-1 text-[9px] tracking-[0.25em] text-white/70 sm:text-xs sm:tracking-[0.35em]">
                                THE ART OF INVESTIGATION
                            </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-3 sm:gap-6">
                            <span className="hidden text-xs tracking-[0.2em] text-white/70 lg:block">
                                DETECTIVE DASHBOARD
                            </span>
                            <button
                                type="button"
                                onClick={() => navigate("/")}
                                className="flex items-center gap-2 border border-white/40 px-3 py-2 text-xs tracking-widest transition hover:border-amber-300 hover:bg-white/10 sm:px-5"
                            >
                                <LogOut size={15} />
                                EXIT
                            </button>
                        </div>
                    </div>
                </nav>
                <section className="mx-auto flex min-h-[580px] max-w-7xl items-center justify-center px-5 py-16 sm:px-8">
                    <div className="grid w-full max-w-6xl grid-cols-1 items-stretch overflow-hidden border border-amber-100/30 bg-[#171411]/90 shadow-2xl md:grid-cols-[0.85fr_1.5fr]">
                        <div className="relative min-h-[260px] overflow-hidden md:min-h-[400px]">
                            <img
                                src={WhoImage}
                                alt="Detective investigation"
                                className="absolute inset-0 h-full w-full object-cover"/>
                            <div className="absolute inset-0 bg-black/35" />
                        </div>
                        <div className="relative flex h-full flex-col justify-center overflow-hidden bg-cover bg-center p-7 sm:p-10 lg:p-14"
                            style={{ backgroundImage: `url(${navbarVintage})` }}>
                            <div className="absolute inset-0 bg-black/70" />
                            <div className="relative z-10 font-google-sans">
                                <h2 className="font-google-sans text-3xl leading-tight text-[#FAF9F6] sm:text-4xl lg:text-5xl">
                                    Every detail tells a story.
                                </h2>
                                <br />
                                <p className="max-w-xl text-base leading-8 text-[#FAF9F6]/75 sm:text-lg">
                                    Examine the evidence, question the alibis,
                                    and uncover the truth hidden beneath every
                                    suspicious detail. Every witness has a
                                    story, every suspect has a secret, and
                                    every clue brings you one step closer to
                                    solving the mystery. Observe carefully,
                                    connect the missing pieces, and challenge
                                    everything that seems certain.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="mx-auto max-w-7xl px-5 pt-7 sm:px-8">
                    <div className="flex justify-center border-b border-white/20 pb-5 text-center">
                        <h3 className="mt-2 font-['Bodoni_Moda'] text-4xl font-medium tracking-wide text-amber-100 sm:text-5xl">
                            Investigation Archive
                        </h3>
                    </div>
                </section>
                <section className="mx-auto max-w-7xl px-5 pb-10 pt-8 sm:px-8">
                    <div className="relative">
                        <button
                            type="button"
                            onClick={previousCase}
                            aria-label="Previous case"
                            disabled={loadingId !== null}
                            className="absolute left-0 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/30 bg-black/70 transition hover:border-amber-300 hover:text-amber-200 disabled:cursor-not-allowed disabled:opacity-50 sm:left-2 sm:h-12 sm:w-12"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            type="button"
                            onClick={nextCase}
                            aria-label="Next case"
                            disabled={loadingId !== null}
                            className="absolute right-0 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/30 bg-black/70 transition hover:border-amber-300 hover:text-amber-200 disabled:cursor-not-allowed disabled:opacity-50 sm:right-2 sm:h-12 sm:w-12"
                        >
                            <ChevronRight size={24} />
                        </button>
                        <div className="relative mx-auto h-[430px] max-w-5xl overflow-hidden sm:h-[390px]">
                            {cases.map((item, index) => {
                                const position = getPosition(index);
                                const isActive = index === activeCase;
                                const Icon = item.icon;
                                return (
                                    <article
                                        key={item.id}
                                        className={`absolute top-0 h-full w-[82%] max-w-[540px] transition-all duration-500 ease-in-out sm:w-[72%] ${positionClasses[position]}`}
                                    >
                                        <div className="relative flex h-full flex-col overflow-hidden border border-white/20 bg-[#17120e]/95 shadow-lg shadow-black/20">
                                            <div className="absolute inset-0">
                                                <img
                                                    src={item.image}
                                                    alt=""
                                                    className="h-full w-full object-cover opacity-55"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/45 to-black/65" />
                                            </div>
                                            <div className="relative z-10 flex h-full flex-col p-6 sm:p-9">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <p className="text-[10px] tracking-[0.3em] text-amber-200/80">
                                                            CLASSIFIED FILE
                                                        </p>
                                                        <p className="mt-2 font-serif text-3xl text-white/30">
                                                            {item.id}
                                                        </p>
                                                    </div>
                                                    <span
                                                        className={`border border-white/20 bg-black/30 px-3 py-2 text-[10px] tracking-[0.2em] ${item.color}`}
                                                    >
                                                        {item.difficulty}
                                                    </span>
                                                </div>
                                                <div className="my-auto">
                                                    <div
                                                        className={`mb-5 flex h-12 w-12 items-center justify-center border border-amber-200/40 bg-black/30 ${item.color}`}
                                                    >
                                                        <Icon
                                                            size={25}
                                                            strokeWidth={1.5}
                                                        />
                                                    </div>
                                                    <h4 className="mt-3 font-['Bodoni_Moda'] text-3xl leading-tight sm:text-4xl">
                                                        {item.title}
                                                    </h4>
                                                    <p className="mt-4 max-w-md text-sm leading-6 text-white/70">
                                                        {item.description}
                                                    </p>
                                                </div>
                                                <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/20 pt-5">
                                                    <div className="flex items-center gap-2 text-[10px] tracking-widest text-white/50">
                                                        <LockKeyhole size={14} />
                                                        CONFIDENTIAL
                                                    </div>
                                                    <CaseButton
                                                        onClick={() =>handleLaunchCase(item)}
                                                        isActive={isActive}
                                                        isLoading={loadingId === item.id}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                        <div className="mt-6 flex items-center justify-center gap-3">
                            {cases.map((item, index) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setActiveCase(index)}
                                    disabled={loadingId !== null}
                                    aria-label={`Show ${item.title}`}
                                    className={`h-1.5 transition-all duration-300 disabled:cursor-not-allowed ${
                                        index === activeCase? "w-10 bg-amber-200" : "w-4 bg-white/30 hover:bg-white/60"
                                    }`}
                                />
                            ))}
                        </div>

                        {errorMessage && (
                            <p role="alert" className="mt-5 text-center text-sm text-red-400">
                                {errorMessage}
                            </p>
                        )}

                        {loadingId !== null && (
                            <p role="status" className="mt-5 text-center text-sm text-amber-200">
                                Generating your mystery case. Please wait...
                            </p>
                        )}
                    </div>
                </section>
                <footer className="border-t border-white/15 bg-black/35 px-5 py-6 sm:px-8">
                    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
                        <p className="font-serif text-sm tracking-wider text-white/70">
                            THE DEDUCTION MATRIX
                        </p>
                        <p className="text-[10px] tracking-[0.2em] text-white/40">
                            THINK CRITICALLY. FOLLOW THE EVIDENCE. FIND THE TRUTH.
                        </p>
                    </div>
                </footer>
            </div>
        </main>
    );
}
