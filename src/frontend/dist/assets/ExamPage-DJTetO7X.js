import { r as reactExports, j as jsxRuntimeExports, c as cn, u as useParams, a as useNavigate } from "./index-DYWh7W97.js";
import { c as createLucideIcon, u as useComposedRefs, i as getExamConfig, d as getResumeState, j as clearResumeState, g as getSettings, k as calculateScore, l as generateAttemptId, m as saveAttempt, n as saveResumeState, L as Layout, f as formatTime, B as Button, S as Shield, C as Card, h as ChevronRight, o as shuffleArray } from "./examUtils-B-u_nfMy.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-B4Gfpwdk.js";
import { R as RefreshCw, B as Badge } from "./badge-DnH4m7rw.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-BTw10gMG.js";
import { L as Label } from "./label-DLW0_l6j.js";
import { C as Clock, P as Progress } from "./progress-ygDwT6nd.js";
import { P as Primitive, c as composeEventHandlers, a as createContextScope, u as useControllableState } from "./index-BA89lCzQ.js";
import { c as createCollection, u as useDirection, C as ChevronLeft } from "./index-Cbacj1jm.js";
import { u as useId, a as useCallbackRef } from "./index-k2dx6gjD.js";
import { u as usePrevious, a as useSize, b as EXAM_QUESTIONS } from "./examData-BshUSf5y.js";
import { P as Presence } from "./index-BGdKQbc3.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]];
const Circle = createLucideIcon("circle", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z", key: "i9b6wo" }],
  ["line", { x1: "4", x2: "4", y1: "22", y2: "15", key: "1cm3nv" }]
];
const Flag = createLucideIcon("flag", __iconNode);
var ENTRY_FOCUS = "rovingFocusGroup.onEntryFocus";
var EVENT_OPTIONS = { bubbles: false, cancelable: true };
var GROUP_NAME = "RovingFocusGroup";
var [Collection, useCollection, createCollectionScope] = createCollection(GROUP_NAME);
var [createRovingFocusGroupContext, createRovingFocusGroupScope] = createContextScope(
  GROUP_NAME,
  [createCollectionScope]
);
var [RovingFocusProvider, useRovingFocusContext] = createRovingFocusGroupContext(GROUP_NAME);
var RovingFocusGroup = reactExports.forwardRef(
  (props, forwardedRef) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Provider, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Slot, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RovingFocusGroupImpl, { ...props, ref: forwardedRef }) }) });
  }
);
RovingFocusGroup.displayName = GROUP_NAME;
var RovingFocusGroupImpl = reactExports.forwardRef((props, forwardedRef) => {
  const {
    __scopeRovingFocusGroup,
    orientation,
    loop = false,
    dir,
    currentTabStopId: currentTabStopIdProp,
    defaultCurrentTabStopId,
    onCurrentTabStopIdChange,
    onEntryFocus,
    preventScrollOnEntryFocus = false,
    ...groupProps
  } = props;
  const ref = reactExports.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const direction = useDirection(dir);
  const [currentTabStopId, setCurrentTabStopId] = useControllableState({
    prop: currentTabStopIdProp,
    defaultProp: defaultCurrentTabStopId ?? null,
    onChange: onCurrentTabStopIdChange,
    caller: GROUP_NAME
  });
  const [isTabbingBackOut, setIsTabbingBackOut] = reactExports.useState(false);
  const handleEntryFocus = useCallbackRef(onEntryFocus);
  const getItems = useCollection(__scopeRovingFocusGroup);
  const isClickFocusRef = reactExports.useRef(false);
  const [focusableItemsCount, setFocusableItemsCount] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener(ENTRY_FOCUS, handleEntryFocus);
      return () => node.removeEventListener(ENTRY_FOCUS, handleEntryFocus);
    }
  }, [handleEntryFocus]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    RovingFocusProvider,
    {
      scope: __scopeRovingFocusGroup,
      orientation,
      dir: direction,
      loop,
      currentTabStopId,
      onItemFocus: reactExports.useCallback(
        (tabStopId) => setCurrentTabStopId(tabStopId),
        [setCurrentTabStopId]
      ),
      onItemShiftTab: reactExports.useCallback(() => setIsTabbingBackOut(true), []),
      onFocusableItemAdd: reactExports.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount + 1),
        []
      ),
      onFocusableItemRemove: reactExports.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount - 1),
        []
      ),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          tabIndex: isTabbingBackOut || focusableItemsCount === 0 ? -1 : 0,
          "data-orientation": orientation,
          ...groupProps,
          ref: composedRefs,
          style: { outline: "none", ...props.style },
          onMouseDown: composeEventHandlers(props.onMouseDown, () => {
            isClickFocusRef.current = true;
          }),
          onFocus: composeEventHandlers(props.onFocus, (event) => {
            const isKeyboardFocus = !isClickFocusRef.current;
            if (event.target === event.currentTarget && isKeyboardFocus && !isTabbingBackOut) {
              const entryFocusEvent = new CustomEvent(ENTRY_FOCUS, EVENT_OPTIONS);
              event.currentTarget.dispatchEvent(entryFocusEvent);
              if (!entryFocusEvent.defaultPrevented) {
                const items = getItems().filter((item) => item.focusable);
                const activeItem = items.find((item) => item.active);
                const currentItem = items.find((item) => item.id === currentTabStopId);
                const candidateItems = [activeItem, currentItem, ...items].filter(
                  Boolean
                );
                const candidateNodes = candidateItems.map((item) => item.ref.current);
                focusFirst(candidateNodes, preventScrollOnEntryFocus);
              }
            }
            isClickFocusRef.current = false;
          }),
          onBlur: composeEventHandlers(props.onBlur, () => setIsTabbingBackOut(false))
        }
      )
    }
  );
});
var ITEM_NAME$1 = "RovingFocusGroupItem";
var RovingFocusGroupItem = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeRovingFocusGroup,
      focusable = true,
      active = false,
      tabStopId,
      children,
      ...itemProps
    } = props;
    const autoId = useId();
    const id = tabStopId || autoId;
    const context = useRovingFocusContext(ITEM_NAME$1, __scopeRovingFocusGroup);
    const isCurrentTabStop = context.currentTabStopId === id;
    const getItems = useCollection(__scopeRovingFocusGroup);
    const { onFocusableItemAdd, onFocusableItemRemove, currentTabStopId } = context;
    reactExports.useEffect(() => {
      if (focusable) {
        onFocusableItemAdd();
        return () => onFocusableItemRemove();
      }
    }, [focusable, onFocusableItemAdd, onFocusableItemRemove]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Collection.ItemSlot,
      {
        scope: __scopeRovingFocusGroup,
        id,
        focusable,
        active,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.span,
          {
            tabIndex: isCurrentTabStop ? 0 : -1,
            "data-orientation": context.orientation,
            ...itemProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!focusable) event.preventDefault();
              else context.onItemFocus(id);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => context.onItemFocus(id)),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if (event.key === "Tab" && event.shiftKey) {
                context.onItemShiftTab();
                return;
              }
              if (event.target !== event.currentTarget) return;
              const focusIntent = getFocusIntent(event, context.orientation, context.dir);
              if (focusIntent !== void 0) {
                if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
                event.preventDefault();
                const items = getItems().filter((item) => item.focusable);
                let candidateNodes = items.map((item) => item.ref.current);
                if (focusIntent === "last") candidateNodes.reverse();
                else if (focusIntent === "prev" || focusIntent === "next") {
                  if (focusIntent === "prev") candidateNodes.reverse();
                  const currentIndex = candidateNodes.indexOf(event.currentTarget);
                  candidateNodes = context.loop ? wrapArray(candidateNodes, currentIndex + 1) : candidateNodes.slice(currentIndex + 1);
                }
                setTimeout(() => focusFirst(candidateNodes));
              }
            }),
            children: typeof children === "function" ? children({ isCurrentTabStop, hasTabStop: currentTabStopId != null }) : children
          }
        )
      }
    );
  }
);
RovingFocusGroupItem.displayName = ITEM_NAME$1;
var MAP_KEY_TO_FOCUS_INTENT = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function getDirectionAwareKey(key, dir) {
  if (dir !== "rtl") return key;
  return key === "ArrowLeft" ? "ArrowRight" : key === "ArrowRight" ? "ArrowLeft" : key;
}
function getFocusIntent(event, orientation, dir) {
  const key = getDirectionAwareKey(event.key, dir);
  if (orientation === "vertical" && ["ArrowLeft", "ArrowRight"].includes(key)) return void 0;
  if (orientation === "horizontal" && ["ArrowUp", "ArrowDown"].includes(key)) return void 0;
  return MAP_KEY_TO_FOCUS_INTENT[key];
}
function focusFirst(candidates, preventScroll = false) {
  const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
  for (const candidate of candidates) {
    if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
    candidate.focus({ preventScroll });
    if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
  }
}
function wrapArray(array, startIndex) {
  return array.map((_, index) => array[(startIndex + index) % array.length]);
}
var Root = RovingFocusGroup;
var Item = RovingFocusGroupItem;
var RADIO_NAME = "Radio";
var [createRadioContext, createRadioScope] = createContextScope(RADIO_NAME);
var [RadioProvider, useRadioContext] = createRadioContext(RADIO_NAME);
var Radio = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeRadio,
      name,
      checked = false,
      required,
      disabled,
      value = "on",
      onCheck,
      form,
      ...radioProps
    } = props;
    const [button, setButton] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node));
    const hasConsumerStoppedPropagationRef = reactExports.useRef(false);
    const isFormControl = button ? form || !!button.closest("form") : true;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(RadioProvider, { scope: __scopeRadio, checked, disabled, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.button,
        {
          type: "button",
          role: "radio",
          "aria-checked": checked,
          "data-state": getState(checked),
          "data-disabled": disabled ? "" : void 0,
          disabled,
          value,
          ...radioProps,
          ref: composedRefs,
          onClick: composeEventHandlers(props.onClick, (event) => {
            if (!checked) onCheck == null ? void 0 : onCheck();
            if (isFormControl) {
              hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
              if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
            }
          })
        }
      ),
      isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
        RadioBubbleInput,
        {
          control: button,
          bubbles: !hasConsumerStoppedPropagationRef.current,
          name,
          value,
          checked,
          required,
          disabled,
          form,
          style: { transform: "translateX(-100%)" }
        }
      )
    ] });
  }
);
Radio.displayName = RADIO_NAME;
var INDICATOR_NAME = "RadioIndicator";
var RadioIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeRadio, forceMount, ...indicatorProps } = props;
    const context = useRadioContext(INDICATOR_NAME, __scopeRadio);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.checked, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        "data-state": getState(context.checked),
        "data-disabled": context.disabled ? "" : void 0,
        ...indicatorProps,
        ref: forwardedRef
      }
    ) });
  }
);
RadioIndicator.displayName = INDICATOR_NAME;
var BUBBLE_INPUT_NAME = "RadioBubbleInput";
var RadioBubbleInput = reactExports.forwardRef(
  ({
    __scopeRadio,
    control,
    checked,
    bubbles = true,
    ...props
  }, forwardedRef) => {
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(ref, forwardedRef);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    reactExports.useEffect(() => {
      const input = ref.current;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        setChecked.call(input, checked);
        input.dispatchEvent(event);
      }
    }, [prevChecked, checked, bubbles]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.input,
      {
        type: "radio",
        "aria-hidden": true,
        defaultChecked: checked,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0
        }
      }
    );
  }
);
RadioBubbleInput.displayName = BUBBLE_INPUT_NAME;
function getState(checked) {
  return checked ? "checked" : "unchecked";
}
var ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
var RADIO_GROUP_NAME = "RadioGroup";
var [createRadioGroupContext] = createContextScope(RADIO_GROUP_NAME, [
  createRovingFocusGroupScope,
  createRadioScope
]);
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var useRadioScope = createRadioScope();
var [RadioGroupProvider, useRadioGroupContext] = createRadioGroupContext(RADIO_GROUP_NAME);
var RadioGroup$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeRadioGroup,
      name,
      defaultValue,
      value: valueProp,
      required = false,
      disabled = false,
      orientation,
      dir,
      loop = true,
      onValueChange,
      ...groupProps
    } = props;
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeRadioGroup);
    const direction = useDirection(dir);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      defaultProp: defaultValue ?? null,
      onChange: onValueChange,
      caller: RADIO_GROUP_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      RadioGroupProvider,
      {
        scope: __scopeRadioGroup,
        name,
        required,
        disabled,
        value,
        onValueChange: setValue,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Root,
          {
            asChild: true,
            ...rovingFocusGroupScope,
            orientation,
            dir: direction,
            loop,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Primitive.div,
              {
                role: "radiogroup",
                "aria-required": required,
                "aria-orientation": orientation,
                "data-disabled": disabled ? "" : void 0,
                dir: direction,
                ...groupProps,
                ref: forwardedRef
              }
            )
          }
        )
      }
    );
  }
);
RadioGroup$1.displayName = RADIO_GROUP_NAME;
var ITEM_NAME = "RadioGroupItem";
var RadioGroupItem$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeRadioGroup, disabled, ...itemProps } = props;
    const context = useRadioGroupContext(ITEM_NAME, __scopeRadioGroup);
    const isDisabled = context.disabled || disabled;
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeRadioGroup);
    const radioScope = useRadioScope(__scopeRadioGroup);
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const checked = context.value === itemProps.value;
    const isArrowKeyPressedRef = reactExports.useRef(false);
    reactExports.useEffect(() => {
      const handleKeyDown = (event) => {
        if (ARROW_KEYS.includes(event.key)) {
          isArrowKeyPressedRef.current = true;
        }
      };
      const handleKeyUp = () => isArrowKeyPressedRef.current = false;
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("keyup", handleKeyUp);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("keyup", handleKeyUp);
      };
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Item,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        focusable: !isDisabled,
        active: checked,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Radio,
          {
            disabled: isDisabled,
            required: context.required,
            checked,
            ...radioScope,
            ...itemProps,
            name: context.name,
            ref: composedRefs,
            onCheck: () => context.onValueChange(itemProps.value),
            onKeyDown: composeEventHandlers((event) => {
              if (event.key === "Enter") event.preventDefault();
            }),
            onFocus: composeEventHandlers(itemProps.onFocus, () => {
              var _a;
              if (isArrowKeyPressedRef.current) (_a = ref.current) == null ? void 0 : _a.click();
            })
          }
        )
      }
    );
  }
);
RadioGroupItem$1.displayName = ITEM_NAME;
var INDICATOR_NAME2 = "RadioGroupIndicator";
var RadioGroupIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeRadioGroup, ...indicatorProps } = props;
    const radioScope = useRadioScope(__scopeRadioGroup);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(RadioIndicator, { ...radioScope, ...indicatorProps, ref: forwardedRef });
  }
);
RadioGroupIndicator.displayName = INDICATOR_NAME2;
var Root2 = RadioGroup$1;
var Item2 = RadioGroupItem$1;
var Indicator = RadioGroupIndicator;
function RadioGroup({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root2,
    {
      "data-slot": "radio-group",
      className: cn("grid gap-3", className),
      ...props
    }
  );
}
function RadioGroupItem({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Item2,
    {
      "data-slot": "radio-group-item",
      className: cn(
        "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Indicator,
        {
          "data-slot": "radio-group-indicator",
          className: "relative flex items-center justify-center",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" })
        }
      )
    }
  );
}
function buildFreshState(examIdNum, allQuestions) {
  const settings = getSettings();
  const allIds = allQuestions.map((q) => q.id);
  const order = settings.randomizeQuestions ? shuffleArray(allIds) : allIds;
  const orders = {};
  for (const qId of order) {
    const q = allQuestions.find((x) => x.id === qId);
    if (!q) continue;
    const pairs = Object.entries(q.options);
    orders[qId] = settings.randomizeAnswers ? shuffleArray(pairs) : pairs;
  }
  const config = getExamConfig(examIdNum);
  return {
    questionOrder: order,
    answerOrders: orders,
    currentIndex: 0,
    answers: {},
    timeRemaining: config.timeLimitMinutes * 60,
    initialized: true
  };
}
function buildResumedState(resume) {
  return {
    questionOrder: resume.questionOrder,
    answerOrders: resume.answerOrders,
    currentIndex: resume.currentQuestion,
    answers: resume.answers,
    timeRemaining: resume.timeRemainingSeconds,
    initialized: true
  };
}
function ExamPage() {
  const { examId } = useParams({ from: "/exam/$examId" });
  const navigate = useNavigate();
  const examIdNum = Number.parseInt(examId, 10);
  const isValidExam = [1, 2, 3, 4].includes(examIdNum);
  const config = isValidExam ? getExamConfig(examIdNum) : null;
  const questions = isValidExam ? EXAM_QUESTIONS[examIdNum] ?? [] : [];
  const [initMode, setInitMode] = reactExports.useState("idle");
  const [pendingResume, setPendingResume] = reactExports.useState(null);
  const [state, setState] = reactExports.useState({
    questionOrder: [],
    answerOrders: {},
    currentIndex: 0,
    answers: {},
    timeRemaining: 0,
    initialized: false
  });
  const [showSubmitDialog, setShowSubmitDialog] = reactExports.useState(false);
  const startedAtRef = reactExports.useRef((/* @__PURE__ */ new Date()).toISOString());
  const startTimeRef = reactExports.useRef(Date.now());
  const timerRef = reactExports.useRef(null);
  const submittedRef = reactExports.useRef(false);
  const stateRef = reactExports.useRef(state);
  reactExports.useEffect(() => {
    stateRef.current = state;
  }, [state]);
  reactExports.useEffect(() => {
    if (!isValidExam) {
      void navigate({ to: "/" });
    }
  }, [isValidExam, navigate]);
  reactExports.useEffect(() => {
    if (!isValidExam) return;
    const resume = getResumeState(examIdNum);
    if (resume && resume.questionOrder.length > 0) {
      setPendingResume(resume);
      setInitMode("resume-prompt");
    } else {
      const fresh = buildFreshState(examIdNum, questions);
      setState(fresh);
      setInitMode("running");
    }
  }, [examIdNum, isValidExam, questions]);
  const startFresh = reactExports.useCallback(() => {
    clearResumeState(examIdNum);
    startedAtRef.current = (/* @__PURE__ */ new Date()).toISOString();
    startTimeRef.current = Date.now();
    submittedRef.current = false;
    const fresh = buildFreshState(examIdNum, questions);
    setState(fresh);
    setPendingResume(null);
    setInitMode("running");
  }, [examIdNum, questions]);
  const resumeExam = reactExports.useCallback(() => {
    if (!pendingResume) return;
    startedAtRef.current = pendingResume.startedAt;
    startTimeRef.current = Date.now();
    submittedRef.current = false;
    const resumed = buildResumedState(pendingResume);
    setState(resumed);
    setPendingResume(null);
    setInitMode("running");
  }, [pendingResume]);
  const doSubmit = reactExports.useCallback(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    clearResumeState(examIdNum);
    const settings = getSettings();
    const currentState = stateRef.current;
    const activeQuestions = currentState.questionOrder.map((id) => questions.find((q) => q.id === id)).filter(Boolean);
    const result = calculateScore(currentState.answers, activeQuestions);
    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1e3);
    const attempt = {
      id: generateAttemptId(),
      examId: examIdNum,
      examTitle: (config == null ? void 0 : config.title) ?? "",
      startedAt: startedAtRef.current,
      completedAt: (/* @__PURE__ */ new Date()).toISOString(),
      timeSpentSeconds: timeSpent,
      answers: currentState.answers,
      score: result.score,
      totalQuestions: result.total,
      percentage: result.percentage,
      passed: result.passed,
      badge: result.badge,
      categoryScores: result.categoryScores,
      settings: {
        randomizeQuestions: settings.randomizeQuestions,
        randomizeAnswers: settings.randomizeAnswers
      }
    };
    saveAttempt(attempt);
    void navigate({
      to: "/results/$attemptId",
      params: { attemptId: attempt.id }
    });
  }, [examIdNum, config, navigate, questions]);
  reactExports.useEffect(() => {
    if (initMode !== "running" || !state.initialized) return;
    timerRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.timeRemaining <= 1) {
          clearInterval(timerRef.current);
          setTimeout(() => doSubmit(), 0);
          return { ...prev, timeRemaining: 0 };
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1e3);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [initMode, state.initialized, doSubmit]);
  reactExports.useEffect(() => {
    if (initMode !== "running" || !state.initialized || state.questionOrder.length === 0)
      return;
    const settings = getSettings();
    const resume = {
      examId: examIdNum,
      currentQuestion: state.currentIndex,
      answers: state.answers,
      startedAt: startedAtRef.current,
      timeRemainingSeconds: state.timeRemaining,
      questionOrder: state.questionOrder,
      answerOrders: state.answerOrders,
      settings: {
        randomizeQuestions: settings.randomizeQuestions,
        randomizeAnswers: settings.randomizeAnswers
      }
    };
    saveResumeState(resume);
  }, [
    initMode,
    state.initialized,
    state.answers,
    state.currentIndex,
    state.questionOrder,
    state.answerOrders,
    state.timeRemaining,
    examIdNum
  ]);
  reactExports.useEffect(() => {
    const handler = () => {
      if (submittedRef.current || initMode !== "running") return;
      const s = stateRef.current;
      if (s.questionOrder.length === 0) return;
      const settings = getSettings();
      const resume = {
        examId: examIdNum,
        currentQuestion: s.currentIndex,
        answers: s.answers,
        startedAt: startedAtRef.current,
        timeRemainingSeconds: s.timeRemaining,
        questionOrder: s.questionOrder,
        answerOrders: s.answerOrders,
        settings: {
          randomizeQuestions: settings.randomizeQuestions,
          randomizeAnswers: settings.randomizeAnswers
        }
      };
      saveResumeState(resume);
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [examIdNum, initMode]);
  reactExports.useEffect(() => {
    if (initMode !== "running") return;
    const handler = (e) => {
      const tag = e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      switch (e.key) {
        case "ArrowLeft":
          setState((prev) => ({
            ...prev,
            currentIndex: Math.max(0, prev.currentIndex - 1)
          }));
          break;
        case "ArrowRight":
          setState((prev) => {
            const totalQ2 = Math.min(
              prev.questionOrder.length,
              (config == null ? void 0 : config.questionCount) ?? 0
            );
            return {
              ...prev,
              currentIndex: Math.min(totalQ2 - 1, prev.currentIndex + 1)
            };
          });
          break;
        case "a":
        case "A":
          setAnswerByKey("A");
          break;
        case "b":
        case "B":
          setAnswerByKey("B");
          break;
        case "c":
        case "C":
          setAnswerByKey("C");
          break;
        case "d":
        case "D":
          setAnswerByKey("D");
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [initMode, config]);
  if (!isValidExam || !config) return null;
  const {
    questionOrder,
    answerOrders,
    currentIndex,
    answers,
    timeRemaining,
    initialized
  } = state;
  if (initMode === "resume-prompt" && pendingResume) {
    const resumeQ = pendingResume.currentQuestion + 1;
    const resumeTotal = pendingResume.questionOrder.length;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm mx-auto", "data-ocid": "resume-dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-5 h-5 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-lg", children: [
            "Resume ",
            config.title,
            "?"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { className: "text-sm space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "block", children: [
            "You left off at question",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-foreground", children: [
              resumeQ,
              " of ",
              resumeTotal
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "block text-muted-foreground", children: [
            "Time remaining:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground font-mono", children: formatTime(pendingResume.timeRemainingSeconds) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "block text-muted-foreground", children: [
            "Answers saved:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: Object.keys(pendingResume.answers).length })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "flex gap-2 mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            className: "flex-1",
            onClick: startFresh,
            "data-ocid": "start-fresh-btn",
            children: "Start Fresh"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: "flex-1",
            onClick: resumeExam,
            "data-ocid": "resume-btn",
            children: "Resume Exam"
          }
        )
      ] })
    ] }) }) });
  }
  if (!initialized || questionOrder.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-[40vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-12 h-12 text-primary mx-auto animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Loading exam..." })
    ] }) }) });
  }
  const currentQId = questionOrder[currentIndex];
  const currentQ = questions.find((q) => q.id === currentQId);
  const currentAnswerOrder = answerOrders[currentQId] ?? [];
  const totalQ = Math.min(questionOrder.length, config.questionCount);
  const answered = Object.keys(answers).length;
  const progress = Math.round(answered / totalQ * 100);
  const isLowTime = timeRemaining < 300;
  const unanswered = totalQ - answered;
  if (!currentQ) return null;
  function setAnswerByKey(key) {
    const qId = stateRef.current.questionOrder[stateRef.current.currentIndex];
    if (!qId) return;
    const order = stateRef.current.answerOrders[qId] ?? [];
    const valid = order.some(([k]) => k === key);
    if (!valid) return;
    setState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [qId]: key }
    }));
  }
  const setAnswer = (key) => {
    setState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [currentQId]: key }
    }));
  };
  const goTo = (idx) => setState((prev) => ({ ...prev, currentIndex: idx }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "sticky top-16 z-40 bg-background/95 backdrop-blur border-b border-border pb-3 mb-6 -mx-4 px-4 pt-3",
        "data-ocid": "exam-header",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Badge,
                {
                  variant: "secondary",
                  className: "text-xs font-mono whitespace-nowrap shrink-0",
                  children: [
                    currentIndex + 1,
                    " / ",
                    totalQ
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground truncate hidden sm:block", children: config.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: "text-xs whitespace-nowrap hidden md:inline-flex",
                  children: config.difficulty
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `flex items-center gap-1.5 font-mono font-bold text-sm px-3 py-1.5 rounded-full transition-colors ${isLowTime ? "bg-destructive/20 text-destructive border border-destructive/40 animate-pulse" : "bg-card border border-border text-foreground"}`,
                "data-ocid": "timer",
                "aria-label": `Time remaining: ${formatTime(timeRemaining)}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5 shrink-0" }),
                  formatTime(timeRemaining)
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Progress,
            {
              value: progress,
              className: "h-1.5 progress-gold",
              "aria-label": "Exam progress"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
            answered,
            " of ",
            totalQ,
            " answered"
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pb-6", children: [
      currentQ.passage && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: "p-4 bg-muted/30 border border-border text-sm leading-relaxed italic",
          "data-ocid": "question-passage",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-primary uppercase tracking-wide mb-2 not-italic", children: "Read the following passage:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: currentQ.passage })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 border border-border", "data-ocid": "question-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: currentQ.category }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: `text-xs ${currentQ.difficulty === "Hard" ? "border-destructive/60 text-destructive" : currentQ.difficulty === "Medium" ? "border-accent/60 text-accent-foreground" : "border-primary/60 text-primary"}`,
                children: currentQ.difficulty
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground shrink-0", children: [
            "Q",
            currentIndex + 1
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "font-medium text-base leading-relaxed mb-5",
            "data-ocid": "question-text",
            children: currentQ.text
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          RadioGroup,
          {
            value: answers[currentQId] ?? "",
            onValueChange: setAnswer,
            className: "space-y-2.5",
            "data-ocid": "answer-options",
            children: currentAnswerOrder.map(([key, text]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Label,
              {
                htmlFor: `opt-${key}`,
                className: `flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-smooth min-h-[48px] ${answers[currentQId] === key ? "border-primary bg-primary/10" : "border-border hover:border-primary/40 hover:bg-muted/50"}`,
                "data-ocid": `answer-option-${key}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    RadioGroupItem,
                    {
                      value: key,
                      id: `opt-${key}`,
                      className: "mt-0.5 shrink-0"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "leading-snug flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold mr-2", children: [
                      key,
                      "."
                    ] }),
                    text
                  ] })
                ]
              },
              key
            ))
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => goTo(Math.max(0, currentIndex - 1)),
            disabled: currentIndex === 0,
            className: "gap-1",
            "data-ocid": "prev-question",
            "aria-label": "Previous question",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" }),
              " Prev"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "destructive",
            size: "sm",
            className: "gap-1.5",
            onClick: () => setShowSubmitDialog(true),
            "data-ocid": "submit-exam-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "w-4 h-4" }),
              " Submit"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => goTo(Math.min(totalQ - 1, currentIndex + 1)),
            disabled: currentIndex >= totalQ - 1,
            className: "gap-1",
            "data-ocid": "next-question",
            "aria-label": "Next question",
            children: [
              "Next ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: showSubmitDialog, onOpenChange: setShowSubmitDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "submit-confirm-dialog", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Submit Exam?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
            "You have answered ",
            answered,
            " of ",
            totalQ,
            " questions.",
            " ",
            unanswered > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              unanswered,
              " ",
              unanswered === 1 ? "question" : "questions",
              " ",
              "will be left unanswered.",
              " "
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "All questions answered. " }),
            "This action cannot be undone."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "cancel-submit-btn", children: "Continue Exam" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            AlertDialogAction,
            {
              onClick: doSubmit,
              "data-ocid": "confirm-submit-btn",
              children: "Submit Now"
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: "p-4 border border-border",
          "data-ocid": "question-grid-nav",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium", children: "Jump to question" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-3 h-3 rounded-sm bg-primary/80 mr-1 align-middle" }),
                "Current",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-3 h-3 rounded-sm bg-accent/80 ml-3 mr-1 align-middle" }),
                "Answered"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex flex-wrap gap-1.5",
                "aria-label": "Question navigation",
                children: questionOrder.slice(0, totalQ).map((qId, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => goTo(idx),
                    className: `w-8 h-8 rounded text-xs font-medium transition-smooth ${idx === currentIndex ? "bg-primary text-primary-foreground" : answers[qId] ? "bg-accent/80 text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`,
                    "aria-label": `Go to question ${idx + 1}${answers[qId] ? ", answered" : ""}`,
                    "aria-current": idx === currentIndex ? "true" : void 0,
                    "data-ocid": `jump-q-${idx + 1}`,
                    children: idx + 1
                  },
                  qId
                ))
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-muted-foreground/60 hidden sm:block", children: "Keyboard: A/B/C/D to select answer — Arrow keys to navigate" })
    ] })
  ] });
}
export {
  ExamPage,
  ExamPage as default
};
