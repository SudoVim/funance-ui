import type { ElementType, ReactElement, ReactNode } from "react";

const REACT_ELEMENT = Symbol.for("react.element");
const REACT_TRANSITIONAL_ELEMENT = Symbol.for("react.transitional.element");

function isReactElement(node: ReactNode): node is ReactElement {
  if (node == null || typeof node !== "object") {
    return false;
  }
  const typeOf = (node as { $$typeof?: symbol }).$$typeof;
  return typeOf === REACT_ELEMENT || typeOf === REACT_TRANSITIONAL_ELEMENT;
}

type Slot =
  | { kind: "state"; value: unknown }
  | { kind: "ref"; ref: { current: unknown } }
  | { kind: "memo"; value: unknown; deps: readonly unknown[] | undefined }
  | { kind: "id"; value: string };

type Renderer = {
  slots: Slot[];
  index: number;
  element: ReactElement;
  output: ReactNode;
  rendering: boolean;
  queued: boolean;
  rerender: () => void;
};

let active: Renderer | null = null;

function depsChanged(
  prev: readonly unknown[] | undefined,
  next: readonly unknown[] | undefined,
): boolean {
  if (prev === next) {
    return false;
  }
  if (!prev || !next || prev.length !== next.length) {
    return true;
  }
  return prev.some((value, i) => !Object.is(value, next[i]));
}

function readContext(context: { _currentValue: unknown }): unknown {
  return context._currentValue;
}

const dispatcher = {
  readContext,
  use: (usable: unknown) => {
    if (
      usable !== null &&
      typeof usable === "object" &&
      "_currentValue" in usable
    ) {
      return (usable as { _currentValue: unknown })._currentValue;
    }
    throw new Error("The shallow renderer can only pass a context to use()");
  },
  useCallback<T extends (...args: never[]) => unknown>(
    callback: T,
    deps: readonly unknown[] | undefined,
  ): T {
    return dispatcher.useMemo(() => callback, deps);
  },
  useContext: readContext,
  useDebugValue() {},
  useDeferredValue<T>(value: T): T {
    return value;
  },
  useEffect() {},
  useEffectEvent<T extends (...args: never[]) => unknown>(fn: T): T {
    return fn;
  },
  useInsertionEffect() {},
  useLayoutEffect() {},
  useImperativeHandle() {},
  useMemo<T>(factory: () => T, deps: readonly unknown[] | undefined): T {
    const renderer = rendererOrThrow();
    const slotIndex = renderer.index++;
    const previous = renderer.slots[slotIndex];
    if (
      previous &&
      previous.kind === "memo" &&
      !depsChanged(previous.deps, deps)
    ) {
      return previous.value as T;
    }
    const value = factory();
    renderer.slots[slotIndex] = { kind: "memo", value, deps };
    return value;
  },
  useReducer<S, A>(
    reducer: (state: S, action: A) => S,
    initialArg: S,
    init?: (arg: S) => S,
  ): [S, (action: A) => void] {
    const renderer = rendererOrThrow();
    const slotIndex = renderer.index++;
    if (!renderer.slots[slotIndex]) {
      const value = init ? init(initialArg) : initialArg;
      renderer.slots[slotIndex] = { kind: "state", value };
    }
    const slot = renderer.slots[slotIndex];
    if (slot.kind !== "state") {
      throw new Error("Hook order changed between shallow renders");
    }
    const dispatch = (action: A) => {
      const next = reducer(slot.value as S, action);
      if (Object.is(next, slot.value)) {
        return;
      }
      slot.value = next;
      renderer.rerender();
    };
    return [slot.value as S, dispatch];
  },
  useRef<T>(initial: T): { current: T } {
    const renderer = rendererOrThrow();
    const slotIndex = renderer.index++;
    if (!renderer.slots[slotIndex]) {
      renderer.slots[slotIndex] = { kind: "ref", ref: { current: initial } };
    }
    const slot = renderer.slots[slotIndex];
    if (slot.kind !== "ref") {
      throw new Error("Hook order changed between shallow renders");
    }
    return slot.ref as { current: T };
  },
  useState<S>(
    initial: S | (() => S),
  ): [S, (action: S | ((prev: S) => S)) => void] {
    return dispatcher.useReducer(
      (state: S, action: S | ((prev: S) => S)) =>
        typeof action === "function"
          ? (action as (prev: S) => S)(state)
          : action,
      initial as S,
      (arg) =>
        typeof arg === "function" ? (arg as unknown as () => S)() : arg,
    );
  },
  useSyncExternalStore<T>(
    subscribe: (onStoreChange: () => void) => () => void,
    getSnapshot: () => T,
  ): T {
    const renderer = rendererOrThrow();
    const slotIndex = renderer.index++;
    const value = getSnapshot();
    if (!renderer.slots[slotIndex]) {
      renderer.slots[slotIndex] = { kind: "state", value };
      subscribe(() => {
        const next = getSnapshot();
        const slot = renderer.slots[slotIndex];
        if (slot.kind === "state" && !Object.is(slot.value, next)) {
          slot.value = next;
          renderer.rerender();
        }
      });
    } else {
      const slot = renderer.slots[slotIndex];
      if (slot.kind === "state") {
        slot.value = value;
      }
    }
    const slot = renderer.slots[slotIndex];
    return (slot.kind === "state" ? slot.value : value) as T;
  },
  useId(): string {
    const renderer = rendererOrThrow();
    const slotIndex = renderer.index++;
    if (!renderer.slots[slotIndex]) {
      renderer.slots[slotIndex] = { kind: "id", value: `:s${slotIndex}:` };
    }
    const slot = renderer.slots[slotIndex];
    if (slot.kind !== "id") {
      throw new Error("Hook order changed between shallow renders");
    }
    return slot.value;
  },
  useTransition(): [boolean, (callback: () => void) => void] {
    return [false, (callback) => callback()];
  },
  useOptimistic<S>(state: S): [S, (next: S) => void] {
    return [state, () => {}];
  },
  useActionState<S>(
    action: (...args: unknown[]) => unknown,
    initial: S,
  ): [S, (...args: unknown[]) => unknown, boolean] {
    return [initial, action, false];
  },
  useFormState<S>(
    action: (...args: unknown[]) => unknown,
    initial: S,
  ): [S, (...args: unknown[]) => unknown, boolean] {
    return [initial, action, false];
  },
  useMemoCache(size: number): unknown[] {
    return dispatcher.useMemo(() => new Array(size), [size]);
  },
  useCacheRefresh(): () => void {
    return () => {};
  },
  useHostTransitionStatus(): string {
    return "hidden";
  },
};

function rendererOrThrow(): Renderer {
  if (!active) {
    throw new Error("Hooks were called outside of a shallow render");
  }
  return active;
}

function reactInternals(): { H: object | null } {
  const captured = (
    globalThis as {
      __FUNANCE_REACT_INTERNALS__?: { H: object | null };
    }
  ).__FUNANCE_REACT_INTERNALS__;
  if (!captured) {
    throw new Error("React internals were not captured in src/setupTests.ts");
  }
  return captured;
}

function renderElement(renderer: Renderer): ReactNode {
  const internals = reactInternals();
  const previousDispatcher = internals.H;
  const previous = active;
  active = renderer;
  renderer.index = 0;
  internals.H = dispatcher;
  try {
    const type = renderer.element.type as {
      (props: unknown): ReactNode;
      render?: (props: unknown, ref: unknown) => ReactNode;
      type?: unknown;
      prototype?: { isReactComponent?: boolean };
    };
    if (typeof type === "function") {
      return type(renderer.element.props);
    }
    if (type && typeof type.render === "function") {
      return type.render(renderer.element.props, null);
    }
    if (type && type.type) {
      return renderElement({
        ...renderer,
        element: {
          ...renderer.element,
          type: type.type as ReactElement["type"],
        },
      });
    }
    return renderer.element;
  } finally {
    internals.H = previousDispatcher;
    active = previous;
  }
}

function commit(renderer: Renderer) {
  if (renderer.rendering) {
    renderer.queued = true;
    return;
  }
  do {
    renderer.queued = false;
    renderer.rendering = true;
    renderer.output = renderElement(renderer);
    renderer.rendering = false;
  } while (renderer.queued);
}

function childList(children: ReactNode): ReactNode[] {
  if (children == null || typeof children === "boolean") {
    return [];
  }
  if (Array.isArray(children)) {
    return children.flatMap((child) => childList(child));
  }
  return [children];
}

function textOf(node: ReactNode): string {
  if (node == null || typeof node === "boolean") {
    return "";
  }
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map((child) => textOf(child)).join("");
  }
  if (isReactElement(node)) {
    // Enzyme prints a function component as `<Name />` instead of its children.
    if (typeof node.type === "function") {
      return `<${typeName(node.type) || "Component"} />`;
    }
    return textOf((node.props as { children?: ReactNode }).children);
  }
  return "";
}

function typeName(type: unknown): string {
  if (typeof type === "string") {
    return type;
  }
  if (typeof type === "function") {
    return type.displayName || type.name || "";
  }
  if (type && typeof type === "object") {
    const component = type as {
      displayName?: string;
      name?: string;
      render?: { displayName?: string; name?: string };
    };
    return (
      component.displayName ||
      component.render?.displayName ||
      component.render?.name ||
      component.name ||
      ""
    );
  }
  return "";
}

function matches(node: ReactElement, selector: string | ElementType) {
  if (typeof selector === "string") {
    return typeName(node.type) === selector;
  }
  if (node.type === selector) {
    return true;
  }
  const type = node.type as { render?: unknown; type?: unknown };
  return type?.render === selector || type?.type === selector;
}

function collect(nodes: ReactNode[], selector: string | ElementType) {
  const matchesFound: ReactElement[] = [];
  const visit = (node: ReactNode) => {
    if (node == null || typeof node === "boolean") {
      return;
    }
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (!isReactElement(node)) {
      return;
    }
    if (matches(node, selector)) {
      matchesFound.push(node);
    }
    visit((node.props as { children?: ReactNode }).children);
  };
  nodes.forEach(visit);
  return matchesFound;
}

function eventProps<T extends object>(props: T): T {
  const wrapped = { ...props } as Record<string, unknown>;
  for (const key of Object.keys(wrapped)) {
    const value = wrapped[key];
    if (typeof value === "function" && key.startsWith("on")) {
      wrapped[key] = (...args: unknown[]) =>
        (value as (...inner: unknown[]) => unknown)(...args);
    }
  }
  return wrapped as T;
}

class ShallowWrapper {
  constructor(private readonly getNodes: () => ReactNode[]) {}

  get length(): number {
    return this.getNodes().length;
  }

  at(index: number): ShallowWrapper {
    return new ShallowWrapper(() => {
      const node = this.getNodes()[index];
      return node === undefined ? [] : [node];
    });
  }

  find(selector: string | ElementType): ShallowWrapper {
    return new ShallowWrapper(() => collect(this.getNodes(), selector));
  }

  props(): Record<string, unknown> {
    const node = this.getNodes()[0];
    if (!isReactElement(node)) {
      return {};
    }
    return eventProps(node.props as Record<string, unknown>);
  }

  type(): unknown {
    const node = this.getNodes()[0];
    return isReactElement(node) ? node.type : null;
  }

  text(): string {
    return this.getNodes()
      .map((node) => textOf(node))
      .join("");
  }

  children(): ShallowWrapper {
    return new ShallowWrapper(() => {
      const node = this.getNodes()[0];
      if (!isReactElement(node)) {
        return [];
      }
      return childList((node.props as { children?: ReactNode }).children);
    });
  }

  childAt(index: number): ShallowWrapper {
    return this.children().at(index);
  }

  key(): string | null {
    const node = this.getNodes()[0];
    if (!isReactElement(node)) {
      return null;
    }
    return node.key == null ? null : String(node.key);
  }

  name(): string {
    const node = this.getNodes()[0];
    return isReactElement(node) ? typeName(node.type) : "";
  }
}

export function shallow(element: ReactElement): ShallowWrapper {
  const renderer: Renderer = {
    slots: [],
    index: 0,
    element,
    output: null,
    rendering: false,
    queued: false,
    rerender: () => {},
  };
  renderer.rerender = () => commit(renderer);
  commit(renderer);
  return new ShallowWrapper(() =>
    renderer.output == null || renderer.output === false
      ? []
      : [renderer.output],
  );
}
