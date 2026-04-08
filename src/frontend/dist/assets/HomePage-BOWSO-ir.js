import { r as reactExports, j as jsxRuntimeExports, L as Link } from "./index-DYWh7W97.js";
import { c as createLucideIcon, g as getSettings, a as getAllAttempts, b as getBadge, L as Layout, S as Shield, d as getResumeState, C as Card, f as formatTime, e as Separator, B as Button, h as ChevronRight, s as saveSettings } from "./examUtils-B-u_nfMy.js";
import { L as Label } from "./label-DLW0_l6j.js";
import { C as Clock, P as Progress } from "./progress-ygDwT6nd.js";
import { S as Star, C as ChartColumn, a as Switch } from "./switch-GWhS9JBp.js";
import { E as EXAM_CONFIGS } from "./examData-BshUSf5y.js";
import { B as BookOpen } from "./book-open-B_P9PVh9.js";
import { T as Trophy } from "./trophy-DX-BZJ6Q.js";
import { A as Award } from "./award-B-vqlRX1.js";
import "./index-BA89lCzQ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  [
    "path",
    {
      d: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",
      key: "96xj49"
    }
  ]
];
const Flame = createLucideIcon("flame", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [["polygon", { points: "6 3 20 12 6 21 6 3", key: "1oa8hb" }]];
const Play = createLucideIcon("play", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
];
const RotateCcw = createLucideIcon("rotate-ccw", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M20 7h-9", key: "3s1dr2" }],
  ["path", { d: "M14 17H5", key: "gfn3mx" }],
  ["circle", { cx: "17", cy: "17", r: "3", key: "18b49y" }],
  ["circle", { cx: "7", cy: "7", r: "3", key: "dfmy0x" }]
];
const Settings2 = createLucideIcon("settings-2", __iconNode);
const BADGE_TIERS = [
  {
    name: "Rookie",
    icon: "🔰",
    range: "0 – 64%",
    min: 0,
    max: 64,
    cls: "bg-muted text-muted-foreground border border-border",
    glow: ""
  },
  {
    name: "Ready",
    icon: "⭐",
    range: "65 – 79%",
    min: 65,
    max: 79,
    cls: "bg-secondary text-secondary-foreground border border-primary/30",
    glow: "shadow-[0_0_12px_oklch(var(--primary)/0.25)]"
  },
  {
    name: "Academy Bound",
    icon: "🎖️",
    range: "80 – 89%",
    min: 80,
    max: 89,
    cls: "bg-primary/20 text-primary border border-primary/40",
    glow: "shadow-[0_0_16px_oklch(var(--primary)/0.35)]"
  },
  {
    name: "Top Candidate",
    icon: "🏆",
    range: "90 – 100%",
    min: 90,
    max: 100,
    cls: "bg-accent/20 text-accent-foreground border border-accent/50",
    glow: "shadow-[0_0_20px_oklch(var(--accent)/0.45)]"
  }
];
const DIFFICULTY_VARIANTS = {
  Easy: {
    cls: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    label: "Easy"
  },
  "Easy / Medium": {
    cls: "bg-accent/15 text-accent-foreground border border-accent/30",
    label: "Easy–Med"
  },
  "Medium / Hard": {
    cls: "bg-primary/15 text-primary border border-primary/30",
    label: "Med–Hard"
  },
  "Hard / Elite": {
    cls: "bg-destructive/20 text-destructive border border-destructive/40",
    label: "Elite"
  }
};
const BADGE_SCORE_CLS = {
  "Top Candidate": "bg-accent/20 text-accent-foreground border border-accent/40",
  "Academy Bound": "bg-primary/20 text-primary border border-primary/30",
  Ready: "bg-secondary text-secondary-foreground border border-border",
  Rookie: "bg-muted text-muted-foreground border border-border"
};
function getStudyStreak(attempts) {
  if (!attempts.length) return 0;
  const days = new Set(
    attempts.map((a) => new Date(a.completedAt).toDateString())
  );
  const sorted = [...days].sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );
  let streak = 0;
  let cursor = /* @__PURE__ */ new Date();
  cursor.setHours(0, 0, 0, 0);
  for (const day of sorted) {
    const d = new Date(day);
    d.setHours(0, 0, 0, 0);
    const diff = Math.round(
      (cursor.getTime() - d.getTime()) / (1e3 * 60 * 60 * 24)
    );
    if (diff <= 1) {
      streak++;
      cursor = d;
    } else break;
  }
  return streak;
}
function HomePage() {
  const [settings, setSettings] = reactExports.useState(() => getSettings());
  const [attempts, setAttempts] = reactExports.useState([]);
  const [badgesOpen, setBadgesOpen] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setAttempts(getAllAttempts());
  }, []);
  const updateSetting = (key, val) => {
    const next = { ...settings, [key]: val };
    setSettings(next);
    saveSettings(next);
  };
  const getBestAttempt = (examId) => attempts.filter((a) => a.examId === examId).sort((a, b) => b.percentage - a.percentage)[0] ?? null;
  const getLastAttempt = (examId) => attempts.filter((a) => a.examId === examId).sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  )[0] ?? null;
  const totalAttempts = attempts.length;
  const avgScore = totalAttempts > 0 ? Math.round(
    attempts.reduce((s, a) => s + a.percentage, 0) / totalAttempts
  ) : 0;
  const passRate = totalAttempts > 0 ? Math.round(
    attempts.filter((a) => a.passed).length / totalAttempts * 100
  ) : 0;
  const bestBadge = totalAttempts > 0 ? getBadge(Math.max(...attempts.map((a) => a.percentage))) : null;
  const streak = getStudyStreak(attempts);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative text-center py-10 md:py-14 mb-6 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.04]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-72 h-72 text-primary", strokeWidth: 0.8 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 mb-5 shadow-[0_0_32px_oklch(var(--primary)/0.3)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-10 h-10 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Star,
          {
            className: "w-3 h-3 text-accent-foreground",
            fill: "currentColor"
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl md:text-5xl font-bold mb-3 tracking-tight", children: "RecruitIQ" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-base md:text-lg max-w-lg mx-auto leading-relaxed mb-5", children: "Train hard. Score high. Serve with distinction." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center justify-center gap-2", children: [
        { icon: BookOpen, text: "400+ Questions" },
        { icon: Shield, text: "4 Exams" },
        { icon: ChartColumn, text: "16 Categories" }
      ].map(({ icon: Icon, text }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "span",
        {
          className: "inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-card border border-border text-muted-foreground",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-3.5 h-3.5 text-primary" }),
            text
          ]
        },
        text
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-border rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-center justify-between",
        "data-ocid": "settings-strip",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold text-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Settings2, { className: "w-4 h-4 text-primary" }),
            "Exam Options"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-6 items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Switch,
                {
                  id: "randomize-questions",
                  checked: settings.randomizeQuestions,
                  onCheckedChange: (v) => updateSetting("randomizeQuestions", v),
                  "data-ocid": "toggle-randomize-questions"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "randomize-questions",
                  className: "text-sm cursor-pointer",
                  children: "Randomize Questions"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Switch,
                {
                  id: "randomize-answers",
                  checked: settings.randomizeAnswers,
                  onCheckedChange: (v) => updateSetting("randomizeAnswers", v),
                  "data-ocid": "toggle-randomize-answers"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "randomize-answers",
                  className: "text-sm cursor-pointer",
                  children: "Randomize Answers"
                }
              )
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 mb-6", "data-ocid": "exam-list", children: EXAM_CONFIGS.map((config) => {
      const best = getBestAttempt(config.id);
      const last = getLastAttempt(config.id);
      const resume = getResumeState(config.id);
      const attemptCount = attempts.filter(
        (a) => a.examId === config.id
      ).length;
      const diffVariant = DIFFICULTY_VARIANTS[config.difficulty] ?? {
        cls: "bg-muted text-muted-foreground border border-border",
        label: config.difficulty
      };
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: "relative flex flex-col gap-0 border border-border hover:border-primary/50 transition-smooth overflow-hidden group",
          "data-ocid": `exam-card-${config.id}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-0.5 w-full bg-gradient-to-r from-primary/60 via-accent/60 to-transparent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 flex flex-col gap-4 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold font-mono", children: config.id }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-base leading-tight truncate", children: config.title })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: config.description })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `text-xs px-2 py-0.5 rounded-full font-semibold whitespace-nowrap ${diffVariant.cls}`,
                    children: diffVariant.label
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5 text-primary/70" }),
                  config.timeLimitMinutes,
                  " min"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-3.5 h-3.5 text-primary/70" }),
                  config.questionCount,
                  " questions"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-3.5 h-3.5 text-accent/80" }),
                  "Pass: ",
                  config.passThreshold,
                  "%"
                ] }),
                attemptCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-3.5 h-3.5 text-muted-foreground" }),
                  attemptCount,
                  " attempt",
                  attemptCount !== 1 ? "s" : ""
                ] })
              ] }),
              best ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Best score" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: `font-semibold px-2 py-0.5 rounded-full text-xs ${BADGE_SCORE_CLS[getBadge(best.percentage)]}`,
                      children: [
                        best.percentage,
                        "% — ",
                        getBadge(best.percentage)
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Progress,
                  {
                    value: best.percentage,
                    className: "h-2 progress-gold"
                  }
                )
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted/40 border border-dashed border-border/60 p-3 text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No attempts yet" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/60 mt-0.5", children: "Start to track your progress" })
              ] }),
              last && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Last: ",
                  last.percentage,
                  "% •",
                  " ",
                  new Date(last.completedAt).toLocaleDateString(),
                  " •",
                  " ",
                  formatTime(last.timeSpentSeconds)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `px-2 py-0.5 rounded-full font-medium ${last.passed ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-destructive/15 text-destructive border border-destructive/30"}`,
                    children: last.passed ? "Pass" : "Fail"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                resume && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: "/exam/$examId",
                    params: { examId: String(config.id) },
                    className: "flex-1",
                    "data-ocid": `resume-exam-${config.id}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        variant: "outline",
                        size: "sm",
                        className: "w-full gap-1.5 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-3.5 h-3.5" }),
                          "Resume"
                        ]
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: "/exam/$examId",
                    params: { examId: String(config.id) },
                    className: "flex-1",
                    "data-ocid": `start-exam-${config.id}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "w-full gap-1.5 font-semibold", children: [
                      attemptCount > 0 ? "Retake Exam" : "Start Exam",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
                    ] })
                  }
                )
              ] }),
              attemptCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/history/$examId",
                  params: { examId: String(config.id) },
                  className: "text-xs text-primary hover:underline text-center -mt-2",
                  "data-ocid": `view-history-${config.id}`,
                  children: "View attempt history →"
                }
              )
            ] })
          ]
        },
        config.id
      );
    }) }),
    totalAttempts > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "mb-6 rounded-xl border border-border bg-card overflow-hidden",
        "data-ocid": "stats-strip",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3 border-b border-border bg-muted/30 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "w-4 h-4 text-primary" }),
              "Your Progress"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard", "data-ocid": "view-dashboard-btn", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "gap-1 text-xs h-7 text-primary",
                children: [
                  "Full Dashboard ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3.5 h-3.5" })
                ]
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-border", children: [
            {
              icon: BookOpen,
              label: "Total Attempts",
              value: String(totalAttempts)
            },
            {
              icon: ChartColumn,
              label: "Avg Score",
              value: `${avgScore}%`
            },
            {
              icon: Trophy,
              label: "Pass Rate",
              value: `${passRate}%`
            },
            {
              icon: Flame,
              label: "Study Streak",
              value: `${streak} ${streak === 1 ? "day" : "days"}`
            }
          ].map(({ icon: Icon, label, value }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-4 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4 text-primary mx-auto mb-1.5 opacity-70" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-xl", children: value }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: label })
          ] }, label)) }),
          bestBadge && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-2.5 border-t border-border bg-muted/20 flex items-center gap-2 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "w-3.5 h-3.5 text-accent" }),
            "Best badge earned:",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `font-semibold px-2 py-0.5 rounded-full ${BADGE_SCORE_CLS[bestBadge]}`,
                children: bestBadge
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-border bg-card overflow-hidden",
        "data-ocid": "badge-explainer",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setBadgesOpen((o) => !o),
              className: "w-full px-5 py-3.5 flex items-center justify-between text-sm font-semibold hover:bg-muted/30 transition-colors",
              "data-ocid": "toggle-badge-explainer",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-4 h-4 text-accent" }),
                  "Achievement Badges"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ChevronRight,
                  {
                    className: `w-4 h-4 text-muted-foreground transition-transform duration-200 ${badgesOpen ? "rotate-90" : ""}`
                  }
                )
              ]
            }
          ),
          badgesOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-0 divide-x divide-y sm:divide-y-0 divide-border", children: BADGE_TIERS.map((tier) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "p-4 flex flex-col items-center text-center gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: `w-12 h-12 rounded-full flex items-center justify-center text-2xl ${tier.glow}`,
                      children: tier.icon
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: `text-xs font-bold px-2 py-0.5 rounded-full ${tier.cls}`,
                        children: tier.name
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: tier.range })
                  ] })
                ]
              },
              tier.name
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3 border-t border-border bg-muted/20 text-xs text-muted-foreground", children: [
              "Earn",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-medium", children: "Academy Bound" }),
              " or higher to demonstrate exam readiness. Pass threshold is",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent font-medium", children: "80%" }),
              " on all exams."
            ] })
          ] })
        ]
      }
    )
  ] });
}
export {
  HomePage,
  HomePage as default
};
