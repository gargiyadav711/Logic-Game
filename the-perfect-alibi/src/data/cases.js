export const cases = [
  {
    id: "001",
    title: "The Perfect Alibi",
    difficulty: "Easy",
    description: "A suspicious timeline, conflicting statements, and one alibi that cannot survive a verified physical clue.",
    victim: "Arthur Bell, owner of Bell House",
    crimeTime: "8:30 PM–8:45 PM",
    scenario: "Arthur Bell was found unconscious in his locked study at 8:45 PM. The display clock stopped at 8:40 PM. Nothing was stolen, but a brass paperweight is missing from the desk.",
    briefing: "Determine who entered the study during the critical window. Use the verified kitchen clock record and the wet footprints to test each alibi.",
    suspects: [
      { id: "s001", name: "Clara Bell", role: "Niece", motive: "Arthur planned to change his will.", alibi: "I was in the conservatory from 8:15 to 8:50 PM.", statement: "I never went near the study after dinner." },
      { id: "s002", name: "Henry Moss", role: "Butler", motive: "Arthur accused him of losing a valuable watch.", alibi: "I was in the kitchen from 8:20 to 8:45 PM.", statement: "The kitchen clock was working, and I checked it at 8:35 PM." },
      { id: "s003", name: "Evelyn Reed", role: "Guest", motive: "Arthur held a letter that could damage her reputation.", alibi: "I was on the east veranda from 8:25 to 8:45 PM.", statement: "I entered the study at 8:10 PM, before the incident, and left immediately." }
    ],
    evidence: [
      { id: "e001", title: "Wet Footprints", detail: "A trail of damp shoeprints leads from the east veranda to the study. Rain began at 8:20 PM.", supports: ["s003"], contradictsClaims: ["c003"], tags: ["veranda", "study", "rain"] },
      { id: "e002", title: "Kitchen Clock Log", detail: "A reliable mechanical kitchen clock was checked against the hall clock at 8:35 PM and was accurate.", supports: ["s002"], contradictsClaims: [], tags: ["kitchen", "clock", "time"] },
      { id: "e003", title: "Study Display Clock", detail: "The decorative clock stopped at 8:40 PM after its battery connection came loose; it is not a reliable timestamp.", supports: [], contradictsClaims: [], tags: ["clock", "study"] },
      { id: "e004", title: "Veranda Guestbook", detail: "The guestbook was signed by Evelyn at 8:27 PM, but the book was left unattended and does not prove she stayed there.", supports: [], contradictsClaims: [], tags: ["veranda", "Evelyn"] }
    ],
    statements: [
      { id: "c001", suspectId: "s001", text: "Clara says she stayed in the conservatory throughout the incident.", relatedEvidenceIds: ["e004"], expectedResult: "unresolved" },
      { id: "c002", suspectId: "s002", text: "Henry says the kitchen clock was accurate at 8:35 PM.", relatedEvidenceIds: ["e002"], expectedResult: "supported" },
      { id: "c003", suspectId: "s003", text: "Evelyn says she remained on the east veranda from 8:25 to 8:45 PM.", relatedEvidenceIds: ["e001"], expectedResult: "contradicted" }
    ],
    timeline: [
      { id: "t001", time: "8:10 PM", description: "Evelyn says she briefly entered the study.", order: 1 },
      { id: "t002", time: "8:20 PM", description: "Rain begins outside.", order: 2 },
      { id: "t003", time: "8:27 PM", description: "Evelyn signs the veranda guestbook.", order: 3 },
      { id: "t004", time: "8:30–8:45 PM", description: "Critical incident window.", order: 4 },
      { id: "t005", time: "8:45 PM", description: "Arthur is discovered in the study.", order: 5 }
    ],
    correctSuspectId: "s003",
    decisiveEvidenceIds: ["e001"],
    solutionExplanation: "The wet footprints connect the east veranda to the study after rain began at 8:20 PM. Evelyn's claim that she remained on the veranda for the entire period is contradicted by the physical trail. The guestbook only proves she signed it at 8:27 PM, not that she stayed there. The stopped display clock is explicitly unreliable and must not be treated as proof.",
    scoring: { culprit: 40, contradictions: 20, connections: 20, timeline: 10, explanation: 10 }
  },
  {
    id: "002",
    title: "The Missing Evidence",
    difficulty: "Medium",
    description: "A sealed archive has been disturbed. Conflicting witness accounts and a missing ledger reveal the likely culprit.",
    victim: "Dr. Miriam Vale, museum archivist",
    crimeTime: "6:00 PM–6:30 PM",
    scenario: "A sealed archive cabinet was opened and the original shipping ledger disappeared. The cabinet's paper seal was broken from the inside edge, and dust was wiped from a narrow shelf.",
    briefing: "Compare the key register, dust trace, and witness statements. No single clue is enough; connect access with the physical trace.",
    suspects: [
      { id: "s101", name: "Jonas Pike", role: "Security Guard", motive: "He was reprimanded for a security breach.", alibi: "I was at the front entrance from 5:50 to 6:30 PM.", statement: "I signed the entrance patrol sheet at 6:10 PM." },
      { id: "s102", name: "Nadia Cole", role: "Researcher", motive: "The ledger could disprove her published provenance claim.", alibi: "I was in the reading room from 6:00 to 6:25 PM.", statement: "I never had the archive cabinet key." },
      { id: "s103", name: "Peter Shaw", role: "Restoration Assistant", motive: "He wanted to sell a document to cover debts.", alibi: "I was in the restoration lab from 5:55 to 6:25 PM.", statement: "I returned the cabinet key to the hook at 5:45 PM." }
    ],
    evidence: [
      { id: "e101", title: "Key Register", detail: "The cabinet key was signed out by Nadia at 5:52 PM and not signed back in until 6:32 PM.", supports: ["s102"], contradictsClaims: ["c102"], tags: ["key", "Nadia", "archive"] },
      { id: "e102", title: "Blue Restoration Dust", detail: "Blue pigment dust matching the restoration lab's open pigment tray was found on the cabinet's inner shelf and on Peter's gloves.", supports: ["s103"], contradictsClaims: [], tags: ["dust", "lab", "gloves"] },
      { id: "e103", title: "Patrol Sheet", detail: "Jonas signed the front entrance patrol sheet at 6:10 PM. It confirms one checkpoint only, not continuous presence.", supports: ["s101"], contradictsClaims: [], tags: ["patrol", "entrance"] },
      { id: "e104", title: "Shelf Dust Pattern", detail: "A clean rectangular gap in the dust shows that a ledger-sized object was removed recently.", supports: [], contradictsClaims: [], tags: ["shelf", "ledger", "dust"] },
      { id: "e105", title: "Reading Room Witness", detail: "A librarian recalls Nadia in the reading room at 6:18 PM, but cannot confirm she stayed there before or after.", supports: ["s102"], contradictsClaims: [], tags: ["reading room", "Nadia"] }
    ],
    statements: [
      { id: "c101", suspectId: "s101", text: "Jonas says he was continuously at the entrance from 5:50 to 6:30 PM.", relatedEvidenceIds: ["e103"], expectedResult: "unresolved" },
      { id: "c102", suspectId: "s102", text: "Nadia says she never had the archive cabinet key.", relatedEvidenceIds: ["e101"], expectedResult: "contradicted" },
      { id: "c103", suspectId: "s103", text: "Peter says he returned the cabinet key at 5:45 PM.", relatedEvidenceIds: ["e101"], expectedResult: "contradicted" }
    ],
    timeline: [
      { id: "t101", time: "5:45 PM", description: "Peter says he returned the key.", order: 1 },
      { id: "t102", time: "5:52 PM", description: "Nadia signs out the archive key.", order: 2 },
      { id: "t103", time: "6:10 PM", description: "Jonas records one entrance checkpoint.", order: 3 },
      { id: "t104", time: "6:18 PM", description: "Librarian sees Nadia in the reading room.", order: 4 },
      { id: "t105", time: "6:32 PM", description: "Nadia signs the key back in.", order: 5 }
    ],
    correctSuspectId: "s102",
    decisiveEvidenceIds: ["e101", "e104", "e105"],
    solutionExplanation: "The key register directly contradicts Nadia's claim that she never had the key: she signed it out at 5:52 PM and returned it at 6:32 PM. The missing ledger-sized dust gap establishes that an object was removed. A witness saw Nadia in the reading room at 6:18 PM, but only at that moment; it does not establish a continuous alibi. The blue dust is suggestive but not conclusive by itself.",
    scoring: { culprit: 40, contradictions: 20, connections: 20, timeline: 10, explanation: 10 }
  },
  {
    id: "003",
    title: "The Final Suspect",
    difficulty: "Hard",
    description: "Three linked timestamps, a manipulated record, and a misleading statement must be reconciled.",
    victim: "Victor Hale, private collector",
    crimeTime: "9:10 PM–9:25 PM",
    scenario: "A rare miniature vanished from a locked gallery during a short power interruption. The gallery sensor log, service lift record, and a witness's statement appear to disagree.",
    briefing: "Build the sequence before accusing anyone. Distinguish a device timestamp from the verified master clock and use multiple clues together.",
    suspects: [
      { id: "s201", name: "Mara Quinn", role: "Curator", motive: "Victor intended to dismiss her.", alibi: "I was in the west office from 9:00 to 9:30 PM.", statement: "The gallery sensor was already offline before 9:10 PM." },
      { id: "s202", name: "Felix Ward", role: "Technician", motive: "He owed money to a private buyer.", alibi: "I was repairing the basement panel from 9:05 to 9:25 PM.", statement: "The service lift did not move during the outage." },
      { id: "s203", name: "Iris Bell", role: "Donor", motive: "She believed the miniature belonged to her family.", alibi: "I was in the south lounge from 9:00 to 9:30 PM.", statement: "I left the gallery before the lights failed." }
    ],
    evidence: [
      { id: "e201", title: "Master Clock Sync", detail: "The building master clock was verified at 9:00 PM. The gallery sensor runs four minutes fast.", supports: [], contradictsClaims: ["c201"], tags: ["clock", "sensor", "time"] },
      { id: "e202", title: "Sensor Event Log", detail: "The sensor recorded a door-open event at 9:14 PM device time, equivalent to 9:10 PM master time.", supports: [], contradictsClaims: ["c201"], tags: ["sensor", "door", "time"] },
      { id: "e203", title: "Service Lift Counter", detail: "The lift counter recorded a basement-to-gallery trip at 9:16 PM master time during the outage.", supports: ["s202"], contradictsClaims: ["c202"], tags: ["lift", "outage", "time"] },
      { id: "e204", title: "Panel Maintenance Sheet", detail: "The basement panel repair was signed off at 9:04 PM, six minutes before the critical event window.", supports: [], contradictsClaims: ["c202"], tags: ["panel", "repair", "time"] },
      { id: "e205", title: "South Lounge Receipt", detail: "Iris's lounge receipt is timestamped 9:22 PM master time. It proves a purchase then, but not her location throughout the earlier window.", supports: ["s203"], contradictsClaims: [], tags: ["lounge", "receipt", "time"] },
      { id: "e206", title: "Gallery Display Case", detail: "The display case was opened with a service override key; the override log shows a technician credential.", supports: ["s202"], contradictsClaims: [], tags: ["override", "key", "technician"] }
    ],
    statements: [
      { id: "c201", suspectId: "s201", text: "Mara says the sensor was offline before 9:10 PM master time.", relatedEvidenceIds: ["e201", "e202"], expectedResult: "contradicted" },
      { id: "c202", suspectId: "s202", text: "Felix says the service lift did not move during the outage and that he was repairing the panel until 9:25 PM.", relatedEvidenceIds: ["e203", "e204"], expectedResult: "contradicted" },
      { id: "c203", suspectId: "s203", text: "Iris says she left the gallery before the lights failed.", relatedEvidenceIds: ["e205"], expectedResult: "unresolved" }
    ],
    timeline: [
      { id: "t201", time: "9:00 PM", description: "Building master clock verified.", order: 1 },
      { id: "t202", time: "9:04 PM", description: "Basement panel repair signed off.", order: 2 },
      { id: "t203", time: "9:10 PM", description: "Gallery door opens according to corrected sensor time.", order: 3 },
      { id: "t204", time: "9:16 PM", description: "Service lift travels from basement to gallery.", order: 4 },
      { id: "t205", time: "9:22 PM", description: "Iris's south lounge receipt is recorded.", order: 5 },
      { id: "t206", time: "9:25 PM", description: "End of the critical incident window.", order: 6 }
    ],
    correctSuspectId: "s202",
    decisiveEvidenceIds: ["e201", "e202", "e203", "e204", "e206"],
    solutionExplanation: "Correcting the sensor's four-minute fast clock places the gallery door event at 9:10 PM master time. The lift moved from the basement to the gallery at 9:16 PM, while the panel repair had already been signed off at 9:04 PM. Felix's claim that the lift did not move and that he was still repairing the panel is contradicted. The technician credential on the display override connects access to him. Iris's later receipt does not prove where she was earlier, so it should not be treated as a complete alibi.",
    scoring: { culprit: 40, contradictions: 20, connections: 20, timeline: 10, explanation: 10 }
  }
];

export const getCaseById = (id) => cases.find((item) => item.id === String(id));