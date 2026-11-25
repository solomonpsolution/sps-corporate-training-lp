// One entry per course. The page reads ?course=<key> and shows that course.
// Only facts published on solomonpeoplesolutions.com or in SPS's own past ads.
export type Course = {
  key: string;
  name: string; // shown in the form and the lead email
  headline: string;
  intro: string;
  points: readonly string[];
  badge?: string;
};

export const COURSES: readonly Course[] = [
  {
    key: "pmp",
    name: "PMP Certification",
    headline: "PMP certification training in Dubai",
    intro: "Prepare for the PMI Project Management Professional exam with structured, PMBOK based training led by experienced trainers.",
    points: ["PMBOK based exam preparation", "Covers the 180 question, 230 minute PMP exam", "Online or classroom sessions in Dubai"],
    badge: "Exam prep for PMI's PMP",
  },
  {
    key: "cisa",
    name: "CISA Certification",
    headline: "CISA certification training in Dubai",
    intro: "Prepare for ISACA's Certified Information Systems Auditor exam with focused training for audit, control and assurance professionals.",
    points: ["Exam focused preparation for ISACA's CISA", "Built for IT audit and assurance roles", "Online or classroom sessions in Dubai"],
    badge: "Exam prep for ISACA's CISA",
  },
  {
    key: "cism",
    name: "CISM Certification",
    headline: "CISM certification training in Dubai",
    intro: "Prepare for ISACA's Certified Information Security Manager exam with training for security managers and leads.",
    points: ["Exam focused preparation for ISACA's CISM", "Built for information security managers", "Online or classroom sessions in Dubai"],
    badge: "Exam prep for ISACA's CISM",
  },
  {
    key: "cissp",
    name: "CISSP Certification",
    headline: "CISSP certification training in Dubai",
    intro: "Prepare for the ISC2 Certified Information Systems Security Professional exam with structured training across all CISSP domains.",
    points: ["Exam focused preparation for ISC2's CISSP", "Built for experienced security professionals", "Online or classroom sessions in Dubai"],
    badge: "Exam prep for ISC2's CISSP",
  },
  {
    key: "ttt",
    name: "Train the Trainer",
    headline: "CPD accredited Train the Trainer course in Dubai",
    intro: "Learn to design and deliver training that people remember. Also available: Certified Training Function Manager, a CPD course designed by SPS.",
    points: ["CPD UK accredited certificate", "Design and deliver engaging sessions", "Present with confidence and handle difficult participants"],
    badge: "CPD UK accredited",
  },
  {
    key: "cfps",
    name: "CFPS (NFPA)",
    headline: "NFPA CFPS certification training in Dubai",
    intro: "Prepare for the NFPA Certified Fire Protection Specialist exam. Also available: NFPA Certified Fire Inspector 1 (CFI-1).",
    points: ["Exam preparation for NFPA's CFPS", "For fire protection and safety professionals", "Online or classroom sessions in Dubai"],
    badge: "Exam prep for NFPA's CFPS",
  },
  {
    key: "communication",
    name: "Communication Skills",
    headline: "Communication skills course in Dubai",
    intro: "Improve how you speak, write and present at work, in a practical 16 hour course.",
    points: ["Verbal, non verbal and written communication", "Presentation and meeting skills", "Practical, interactive sessions"],
  },
  {
    key: "management",
    name: "Management Development",
    headline: "Management development course in Dubai",
    intro: "Build the skills to lead a team, delegate and communicate clearly as a manager. Ideal for new and growing managers.",
    points: ["Lead and motivate a team", "Delegate, give feedback and coach", "Make decisions and manage priorities"],
  },
];

export const COURSE_OPTIONS = [...COURSES.map((c) => c.name), "Certified Training Function Manager", "Other / not sure yet"];
export const DEFAULT_COURSE_HEADLINE = "Professional certification courses in Dubai";

export function courseFor(key: string | null | undefined): Course | undefined {
  return key ? COURSES.find((c) => c.key === key.toLowerCase()) : undefined;
}

