import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import CASE1 from "./CASE1.jpeg";
import magnifierImage from "./detective-magnifier.jpg";
import detectiveBackground from "./backdrop.jpg";
import SidebarImage from "./sidebar.jpg";
import { LayoutDashboard, Search, Users, Folder, Clock, Scale, User, ArrowRight, AlertCircle, RefreshCw, } from "lucide-react";
const NAVIGATION = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Investigation", path: "/invesigate", icon: Search },
    { label: "Suspects", path: "/suspects", icon: Users },
    { label: "Evidence Board", path: "/evidence", icon: Folder },
    { label: "Timeline", path: "/timeline", icon: Clock },
    { label: "Final Deduction", path: "/deduction", icon: Scale },
];

const DEFAULT_IMAGE = CASE1;
function normalizeCase(parsed) {
    const victim =
        typeof parsed.victim === "object" ? parsed.victim?.name : parsed.victim;
    return {
        id: parsed.id || "001",
        title: parsed.title || "The Mystery File",
        difficulty: String(parsed.difficulty || "EASY").toUpperCase(),
        synopsis:
            parsed.synopsis ||
            parsed.briefing ||
            parsed.incident ||
            "No case synopsis is available.",
        quote: parsed.quote || "Every clue leaves a trace.",
        image: parsed.image || DEFAULT_IMAGE,
        victim: victim || "Unknown Victim",
        victimRole:
            parsed.victimRole ||
            parsed.victim?.description ||
            "Person involved in the case",
        crimeTime:
            parsed.crimeTime ||
            parsed.crime_time ||
            parsed.timeline?.[0]?.time ||
            parsed.clues?.[0]?.timestamp ||
            "Time unknown",
    };
}

export default function InvestigationView() {
    const navigate = useNavigate();
    const [caseData, setCaseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => {
        try {
            const activeCase = localStorage.getItem("current_active_case");
            if (activeCase) {
                const parsed = JSON.parse(activeCase);
                setCaseData(normalizeCase(parsed));
                return;
            }
            const currentCaseId = localStorage.getItem(
                "perfect-alibi-current-case"
            );
            if (currentCaseId) {
                const generatedCase = localStorage.getItem(`perfect-alibi-generated-case-${currentCaseId}`);
                if (generatedCase) {
                    const parsed = JSON.parse(generatedCase);
                    setCaseData(normalizeCase(parsed));
                    return;
                }
            }
            setError("No active mystery case was found.");
        } catch (err) {
            console.error("Failed to load investigation case:", err);
            setError("The saved case could not be read.");
        } finally {
            setLoading(false);
        }
    }, []);
    const startInvestigation = () => {
        if (!caseData) return;
        navigate("/suspects");
    };
    return (
        <div className="flex min-h-screen bg-[#15100c] font-cormorant text-[#f0dfbd]">
            <aside
                className="relative hidden w-64 shrink-0 flex-col justify-between overflow-hidden border-r border-[#8d6538]/40 p-5 lg:flex"
                style={{
                    backgroundImage: `url(${SidebarImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}>
                <div className="pointer-events-none absolute inset-0 bg-[#100b07]/45" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/55" />
                <div className="relative z-10">
                    <div className="mb-10 -mx-2 flex items-center gap-3">
                        <img src={magnifierImage}
                            alt="Detective magnifying glass"
                            className="h-12 w-12 shrink-0 object-cover drop-shadow-lg" />
                        <span className="font-bodoni text-lg font-semibold tracking-wide text-[#f0dfbd]">
                            The Deduction Matrix
                        </span>
                    </div>
                    <nav className="space-y-2">
                        {NAVIGATION.map(({ label, path, icon: Icon }) => (
                            <NavLink key={path} to={path}
                                className={({ isActive }) =>
                                    `flex w-full items-center gap-3 rounded-lg border-l-2 px-3 py-3 transition-all duration-200 ${isActive
                                        ? "border-[#e0a94b] bg-[#d49a3c] font-semibold text-[#21150b] shadow-md shadow-black/20"
                                        : "border-transparent text-[#dfcdb0] hover:hover:bg-[#6b4b2b]/50 hover:text-[#fff0d0]"}`}>
                                <Icon className="h-5 w-5 shrink-0" />
                                <span className="text-base">{label}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>
            </aside>
            <main
                className="relative min-w-0 flex-1 overflow-y-auto bg-[#1b1712] p-5 sm:p-8"
                style={{
                    backgroundImage: `url(${detectiveBackground})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundAttachment: "fixed",
                }}>
                <div className="relative mx-auto max-w-6xl">
                    {loading ? (
                        <div className="flex min-h-[60vh] items-center justify-center">
                            <div className="text-center">
                                <RefreshCw className="mx-auto h-9 w-9 animate-spin text-[#d9a34d]" />
                                <p className="mt-4 font-cormorant text-xl font-medium tracking-wide text-[#f0dfbd]">
                                    Loading your case files...
                                </p>
                                <div className="mx-auto mt-4 h-1 w-36 overflow-hidden rounded-full bg-[#4a3320]">
                                    <div className="h-full w-1/2 animate-pulse rounded-full bg-[#d9a34d]" />
                                </div>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="mx-auto mt-16 max-w-lg rounded-xl border border-[#947044] bg-[#e4cfaa] p-8 text-center shadow-2xl shadow-black/50">
                            <AlertCircle className="mx-auto h-10 w-10 text-[#7c2924]" />
                            <h1 className="mt-4 font-bodoni text-2xl font-bold text-[#302015]">
                                No active investigation
                            </h1>
                            <p className="mt-3 font-cormorant text-lg leading-6 text-[#59412c]">
                                {error} Return to the dashboard to select or generate a case.
                            </p>
                            <button
                                onClick={() => navigate("/dashboard")}
                                className="mt-6 rounded-md border border-[#772923] bg-[#812b25] px-6 py-3 font-cormorant text-lg font-semibold text-[#f6e4c5] shadow-md transition hover:bg-[#9a352d] focus:outline-none focus:ring-2 focus:ring-[#c6a56b]"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="mb-7 flex flex-wrap items-center gap-4">
                                <div className="min-w-0 flex-1">
                                    <p className="mb-2 font-cormorant text-sm font-semibold uppercase tracking-[3px] text-[#e0ad59]">
                                        Investigation File
                                    </p>
                                    <h1 className="break-words font-bodoni text-3xl font-bold tracking-wide text-[#f4e4c6] drop-shadow-lg sm:text-4xl">
                                        {caseData.title}
                                    </h1>
                                </div>
                                <span className="border border-[#bd9252] bg-[#d5b77e] px-4 py-2 font-cormorant text-sm font-bold uppercase tracking-widest text-[#342214] shadow-md">
                                    {caseData.difficulty}
                                </span>
                            </div>
                            <section className="flex flex-col gap-4 rounded-xl border border-[#80603d] bg-[#cdb58d] p-3 shadow-2xl shadow-black/50 sm:p-3 md:flex-row md:p-4">
                                <div className="flex min-w-0 flex-1 flex-col">
                                    <div className="relative h-[310px] overflow-hidden border-[6px] border-[#46301e] bg-[#1a130c] shadow-lg sm:h-[430px]">
                                        <img
                                            src={caseData.image}
                                            alt={caseData.title}
                                            className="h-full w-full object-cover"
                                            onError={(event) => { event.currentTarget.onerror = null;
                                                event.currentTarget.src = DEFAULT_IMAGE;
                                            }}/>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
                                    </div>
                                    <div className="relative mt-5 border border-[#9e8156] bg-[#e6d3ae] p-5 text-center shadow-md sm:p-6">
                                        <div className="pointer-events-none absolute inset-2 border border-dashed border-[#9f8158]/50" />
                                        <p className="relative font-cormorant text-xl italic leading-relaxed text-[#48301f] sm:text-2xl">
                                            “{caseData.quote}”
                                        </p>
                                    </div>
                                </div>
                                <div className="flex w-full flex-col justify-between gap-7 border border-[#a58a61] bg-[#e7d5b3] p-5 shadow-inner sm:p-6 md:w-110 md:shrink-0">
                                    <div>
                                        <h2 className="font-bodoni text-2xl font-bold text-[#382317]">
                                            Case Brief
                                        </h2>
                                        <div className="mb-4 mt-2 h-[3px] w-3/4 bg-[#812d26]" />
                                        <p className="font-cormorant text-lg leading-7 text-[#4e3826]">
                                            {caseData.synopsis}
                                        </p>
                                        <div className="my-6 border-t border-[#aa8d61]" />
                                        <div className="space-y-6">
                                            <DetailRow icon={User} label="Victim" value={caseData.victim} secondary={caseData.victimRole}/>
                                            <div className="border-t border-[#b9a078]/70" />
                                            <DetailRow icon={Clock}label="Crime Time" value={caseData.crimeTime}/>
                                        </div>
                                    </div>
                                    <button
                                        onClick={startInvestigation}
                                        className="flex w-full items-center justify-center gap-3 border border-[#a44b3e] bg-[#842b25] px-4 py-3.5 font-cormorant text-lg font-bold tracking-wide text-[#f5e4c6] shadow-md transition duration-200 hover:bg-[#9c362d] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#c6a56b] focus:ring-offset-2 focus:ring-offset-[#e7d5b3]">
                                        <Search className="h-5 w-5" />
                                        <span>View Suspects</span>
                                        <ArrowRight className="h-5 w-5" />
                                    </button>
                                </div>
                            </section>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
function DetailRow({ icon: Icon, label, value, secondary }) {
    return (
        <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#8e7048] bg-[#342419] shadow-md">
                <Icon className="h-5 w-5 text-[#e4bd76]" />
            </div>

            <div className="min-w-0">
                <p className="mb-1 inline-block bg-[#d1b58a] px-2 font-cormorant text-sm font-bold uppercase tracking-wide text-[#63452b]">
                    {label}
                </p>

                <p className="break-words font-cormorant text-lg font-bold text-[#302015]">
                    {value}
                </p>

                {secondary && (
                    <p className="mt-0.5 font-cormorant text-base text-[#6b5138]">
                        {secondary}
                    </p>
                )}
            </div>
        </div>
    );
}

function ProgressCard() {
    const [completedCount, setCompletedCount] = useState(0);

    useEffect(() => {
        try {
            const game = JSON.parse(
                localStorage.getItem("perfect-alibi-game") || "{}"
            );
            const completed = Array.isArray(game.completedCases) ? game.completedCases.length : 0;
            setCompletedCount(completed);
        }
        catch {
            setCompletedCount(0);
        }
    }, []);

    const progress = Math.min(100, (completedCount / 5) * 100);

    return (
        <div className="border border-[#80603d]/80 bg-[#211810]/85 p-4 shadow-lg">
            <div className="mb-3 font-cormorant text-base italic text-[#d6bd96]">
                Your Progress
            </div>

            <div className="mb-2 h-2.5 w-full overflow-hidden rounded-full border border-[#80603d] bg-[#110d09]">
                <div
                    className="h-full rounded-full bg-[#d6a24d] transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="text-right font-cormorant text-sm font-semibold text-[#e3cba3]">
                {completedCount}/5 cases
            </div>
        </div>
    );
}