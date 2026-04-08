import { u as useParams, a as useNavigate, r as reactExports, j as jsxRuntimeExports, L as Link } from "./index-DYWh7W97.js";
import { c as createLucideIcon, a as getAllAttempts, L as Layout, B as Button, i as getExamConfig, C as Card, b as getBadge, f as formatTime, h as ChevronRight, e as Separator, m as saveAttempt } from "./examUtils-B-u_nfMy.js";
import { B as Badge, R as RefreshCw } from "./badge-DnH4m7rw.js";
import { D as Dialog, f as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-BTw10gMG.js";
import { C as Clock, P as Progress } from "./progress-ygDwT6nd.js";
import { T as Target } from "./target-BiF3Wh2O.js";
import { A as ArrowLeft } from "./arrow-left-BCI3dROA.js";
import { T as Trophy } from "./trophy-DX-BZJ6Q.js";
import { C as CircleCheck } from "./circle-check-kmf7AXd1.js";
import { C as CircleX } from "./circle-x-Cg24WDdO.js";
import { B as BookOpen } from "./book-open-B_P9PVh9.js";
import { T as Trash2 } from "./trash-2-DYRvSmm0.js";
import "./index-BGdKQbc3.js";
import "./index-BA89lCzQ.js";
import "./index-k2dx6gjD.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "M8 14h.01", key: "6423bh" }],
  ["path", { d: "M12 14h.01", key: "1etili" }],
  ["path", { d: "M16 14h.01", key: "1gbofw" }],
  ["path", { d: "M8 18h.01", key: "lrp35t" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }],
  ["path", { d: "M16 18h.01", key: "kzsmim" }]
];
const CalendarDays = createLucideIcon("calendar-days", __iconNode);
const BADGE_STYLE = {
  "Top Candidate": "bg-accent/20 text-accent border border-accent/40",
  "Academy Bound": "bg-primary/20 text-primary border border-primary/30",
  Ready: "bg-secondary text-secondary-foreground border border-border",
  Rookie: "bg-muted text-muted-foreground border border-border"
};
const BADGE_EMOJI = {
  "Top Candidate": "🏆",
  "Academy Bound": "🎖️",
  Ready: "⭐",
  Rookie: "🔰"
};
function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
}
function StatPill({
  icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/70", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label })
  ] });
}
function HistoryPage() {
  const { examId } = useParams({ from: "/history/$examId" });
  const examIdNum = Number.parseInt(examId, 10);
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = reactExports.useState(false);
  const [allAttempts, setAllAttempts] = reactExports.useState(
    () => getAllAttempts()
  );
  const validIds = [1, 2, 3, 4];
  if (!validIds.includes(examIdNum)) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-24 space-y-4",
        "data-ocid": "history-invalid-exam",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "w-12 h-12 text-muted-foreground mx-auto opacity-40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-lg", children: "Exam Not Found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-2", children: "Back to Home" }) })
        ]
      }
    ) });
  }
  const config = getExamConfig(examIdNum);
  const attempts = allAttempts.filter((a) => a.examId === examIdNum).sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );
  const bestAttempt = attempts.length > 0 ? attempts.reduce(
    (best, a) => a.percentage > best.percentage ? a : best,
    attempts[0]
  ) : null;
  const avgPercentage = attempts.length > 0 ? Math.round(
    attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length
  ) : 0;
  const passCount = attempts.filter((a) => a.passed).length;
  function clearThisExamHistory() {
    const remaining = getAllAttempts().filter((a) => a.examId !== examIdNum);
    localStorage.removeItem("police_exam_attempts");
    for (const a of remaining) {
      saveAttempt(a);
    }
    setAllAttempts(remaining);
    setConfirmOpen(false);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", "aria-label": "Back to home", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-5 h-5" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-xl truncate", children: config.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Attempt History" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "shrink-0 text-xs", children: [
        attempts.length,
        " ",
        attempts.length === 1 ? "attempt" : "attempts"
      ] })
    ] }),
    attempts.length > 0 && bestAttempt && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "grid grid-cols-3 gap-3 mb-5",
        "data-ocid": "history-stats-grid",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 border border-border text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-5 h-5 text-accent mx-auto mb-1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display font-bold text-xl", children: [
              bestAttempt.percentage,
              "%"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Best Score" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 border border-border text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "w-5 h-5 text-primary mx-auto mb-1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display font-bold text-xl", children: [
              avgPercentage,
              "%"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Avg Score" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 border border-border text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-5 h-5 text-accent mx-auto mb-1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display font-bold text-xl", children: [
              passCount,
              "/",
              attempts.length
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Passes" })
          ] })
        ]
      }
    ),
    bestAttempt && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-accent/10 border border-accent/30 rounded-xl p-4 mb-5 flex items-center justify-between gap-3",
        "data-ocid": "best-score-banner",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-xl shrink-0", children: BADGE_EMOJI[getBadge(bestAttempt.percentage)] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Personal Best" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display font-bold text-lg", children: [
                bestAttempt.percentage,
                "%"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                bestAttempt.score,
                "/",
                bestAttempt.totalQuestions,
                " correct"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `text-xs px-3 py-1.5 rounded-full font-semibold shrink-0 ${BADGE_STYLE[getBadge(bestAttempt.percentage)]}`,
              children: getBadge(bestAttempt.percentage)
            }
          )
        ]
      }
    ),
    attempts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        className: "p-12 text-center border border-dashed border-border",
        "data-ocid": "no-attempts",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-lg mb-1", children: "No Attempts Yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-5", children: "Take the exam to start building your history." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/exam/$examId", params: { examId }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { "data-ocid": "start-exam-cta", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "w-4 h-4 mr-2" }),
            " Start Exam"
          ] }) })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "attempt-list", children: attempts.map((attempt, idx) => {
      const badge = getBadge(attempt.percentage);
      const isBest = attempt.id === (bestAttempt == null ? void 0 : bestAttempt.id);
      const attemptNumber = attempts.length - idx;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        Card,
        {
          className: `border transition-smooth hover:border-primary/30 ${isBest ? "border-accent/40 bg-accent/5" : "border-border"}`,
          "data-ocid": `attempt-row-${idx}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold flex items-center gap-2 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "Attempt #",
                    attemptNumber
                  ] }),
                  isBest && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-accent font-bold bg-accent/15 px-1.5 py-0.5 rounded", children: "🏆 Best" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1 mt-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "w-3 h-3 shrink-0" }),
                  formatDate(attempt.completedAt)
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: `text-xs px-2.5 py-1 rounded-full font-semibold shrink-0 ${BADGE_STYLE[badge]}`,
                  children: [
                    BADGE_EMOJI[badge],
                    " ",
                    badge
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-x-4 gap-y-1 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-2xl text-primary", children: [
                attempt.percentage,
                "%"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatPill,
                {
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "w-3 h-3" }),
                  value: `${attempt.score}/${attempt.totalQuestions}`,
                  label: "correct"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatPill,
                {
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
                  value: formatTime(attempt.timeSpentSeconds),
                  label: "time"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                attempt.passed ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5 text-accent" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3.5 h-3.5 text-destructive" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `text-xs font-bold ${attempt.passed ? "text-accent" : "text-destructive"}`,
                    children: attempt.passed ? "PASS" : "FAIL"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Progress,
              {
                value: attempt.percentage,
                className: "h-1.5 progress-gold mb-3"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/results/$attemptId",
                  params: { attemptId: attempt.id },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      variant: "ghost",
                      size: "sm",
                      className: "gap-1 text-xs h-8",
                      "data-ocid": `view-results-${idx}`,
                      children: [
                        "Results",
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3.5 h-3.5" })
                      ]
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/review/$attemptId",
                  params: { attemptId: attempt.id },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      variant: "ghost",
                      size: "sm",
                      className: "gap-1 text-xs h-8",
                      "data-ocid": `review-${idx}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-3.5 h-3.5" }),
                        " Review"
                      ]
                    }
                  )
                }
              )
            ] })
          ] })
        },
        attempt.id
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "my-6" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            className: "gap-2",
            "data-ocid": "retake-from-history",
            onClick: () => void navigate({
              to: "/exam/$examId",
              params: { examId }
            }),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4" }),
              " Retake Exam"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", "data-ocid": "dashboard-from-history", children: "View Dashboard" }) })
      ] }),
      attempts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: confirmOpen, onOpenChange: setConfirmOpen, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "ghost",
            size: "sm",
            className: "gap-2 text-destructive hover:text-destructive hover:bg-destructive/10",
            "data-ocid": "clear-history-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }),
              " Clear History"
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "clear-history-dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Clear Attempt History?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
              "This will permanently delete all ",
              attempts.length,
              " attempt",
              attempts.length !== 1 ? "s" : "",
              " for ",
              config.title,
              ". History from other exams will not be affected."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "flex gap-2 sm:gap-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => setConfirmOpen(false),
                "data-ocid": "clear-history-cancel",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "destructive",
                onClick: clearThisExamHistory,
                "data-ocid": "clear-history-confirm",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4 mr-2" }),
                  " Delete All"
                ]
              }
            )
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  HistoryPage
};
