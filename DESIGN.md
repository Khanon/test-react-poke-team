# PokéTeam — React Practice Design Document (3-hour plan)

> A practice project for reviewing React fundamentals before a technical interview. A single screen with no styling that takes about 3 hours to build and covers the React concepts that come up most often. Anything that doesn't fit is in section 7, as reading material.

---

## 1. The 3-hour plan

| Block | Time | What you build | Concepts |
|---|---|---|---|
| 1 | 45 min | Setup and list with real data | components, props, `key`, `useState`, `useEffect` with cleanup, `StrictMode`, custom hook |
| 2 | 30 min | Search and performance | controlled input, `useDebounce`, `useMemo`, `memo`, `useCallback` |
| 3 | 40 min | Team with `useReducer` + Context | pure reducer, immutability, Context, lazy initialization |
| 4 | 20 min | Modal with portal and uncontrolled input | `createPortal`, `useRef`, listeners with cleanup |
| 5 | 40 min | Classes: timer and Error Boundary | lifecycle, `setState` and its callback, callback props, `this` and `bind`, `PureComponent`, `getDerivedStateFromError`, `componentDidCatch` |
| 6 | 5 min | Buffer for getting stuck | — |

- If you're short on time, block 4 is the first to go.
- **No styling.** Not a single minute on looks.
- **Plain React only**: no Redux, TanStack Query, component libraries or React Router.
- Each block comes with tasks, **gotchas** (the things most likely to show up in a quiz) and acceptance criteria to tick off.
- What's left out (routing, lazy loading, React 19 forms, `useOptimistic`, tests) is in section 7 with its gotchas, for reading. Section 8 is a cheat sheet to review in ten minutes before the interview.

---

## 2. Stack

| Piece | Choice | Note |
|---|---|---|
| Runtime | Node.js 22.12 or later | required by Vite |
| Project | Vite, `react-ts` template | `npm create vite@latest poketeam -- --template react-ts` (npm: Node Package Manager) |
| Framework | React 19.2 + TypeScript | current stable version |
| Data | PokéAPI | public, no key |
| Debugging | React Developer Tools extension | Components tab and the "Highlight updates when components render" option |

### 2.1 Endpoints

The API (Application Programming Interface) returns JSON (JavaScript Object Notation). The 3-hour plan only needs two URLs (Uniform Resource Locators):

| Use | URL | What matters |
|---|---|---|
| List | `https://pokeapi.co/api/v2/pokemon?limit={n}` | `results[]` with `name` and `url`. The number (id) comes from the end of the URL: `.../pokemon/25/` → 25 |
| Image | `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png` | no request needed: built from the id |

---

## 3. Features (a single screen)

- **Header**: title and a "Team 3/6" counter.
- **Main column (list)**:
  - Generation selector: 151, 386 or 1025 Pokémon.
  - Name search with a delay (*debounce*) and a sort selector (number / name).
  - "Add by number" field for the team.
  - Two dev buttons: "Break render" and "Error in handler".
  - Card grid: image, number, name, favorite star and an "Add to team" button.
  - Loading, error and "No results" states.
- **"My team" side panel**: up to 6 members with a "Remove" button, plus "Clear team" with a confirmation modal.
- **Footer**: session timer with its own "Reset" button, "Pause / Resume" and "Show / Hide" buttons, and an "n minutes so far" notice that the timer reports to the footer.

---

## 4. Concept map

| Concept | Where you practice it | Block | Rough Angular equivalent |
|---|---|---|---|
| JSX (JavaScript XML, where XML is Extensible Markup Language), function components, props | `PokemonCard` | 1 | template + `@Input` |
| Composition with `children` | `Card` | 1 | `ng-content` |
| Callbacks as props (child → parent) | `onToggleFavorite` | 1 | `@Output` + `EventEmitter` |
| Conditional rendering, `Fragment` | loading / error / empty | 1 | `*ngIf`, `ng-container` |
| Lists and `key` | grid | 1 | `*ngFor` + `trackBy` |
| `useState` and functional updates | favorites, generation | 1 | component properties |
| `useEffect`, dependencies, cleanup | `useFetch` with `AbortController` | 1 | `ngOnInit` / `ngOnChanges` / `ngOnDestroy` + `unsubscribe` |
| `StrictMode` | `main.tsx` | 1 | — |
| Custom hooks | `useFetch`, `useDebounce`, `useKeyDown` | 1, 2, 4 | services |
| Controlled input | search box | 2 | Reactive Forms |
| `useMemo`, `useCallback`, `React.memo` | filtering and cards | 2 | pure pipes, `OnPush` |
| `useReducer` | team | 3 | NgRx reducers |
| Context (Provider, consuming, splitting state / dispatch) | team | 3 | services with dependency injection |
| `useRef` on a DOM (Document Object Model) node | modal focus | 4 | `@ViewChild` + `ElementRef` |
| Uncontrolled input | "Add by number" | 4 | `@ViewChild` |
| `createPortal` | `Modal` | 4 | CDK (Component Dev Kit) Portal / Overlay |
| Class components and lifecycle | `SessionTimer` | 5 | lifecycle hooks |
| `this.setState` (functional form and callback), callback props, `bind`, `PureComponent` | `SessionTimer` | 5 | `@Output`; Angular components are already classes |
| Error Boundary | around the list | 5 | `ErrorHandler` |

---

## 5. Architecture

### 5.1 Folder structure

```
src/
├── main.tsx                  StrictMode + TeamProvider + App
├── App.tsx                   Header, ErrorBoundary + PokemonList, TeamPanel, Footer
├── types.ts                  PokemonSummary, TeamMember, TeamAction
├── api/
│   └── pokeApi.ts            list URL and mapping function (pure)
├── state/
│   └── teamReducer.ts
├── context/
│   └── TeamContext.tsx       TeamProvider, useTeam, useTeamDispatch
├── hooks/
│   ├── useFetch.ts
│   ├── useDebounce.ts
│   ├── useKeyDown.ts
│   └── useInterval.ts        optional (hooks version of the timer)
└── components/
    ├── Header.tsx
    ├── PokemonList.tsx       generation, search, sort, grid, error buttons
    ├── Card.tsx              generic container with children
    ├── PokemonCard.tsx       wrapped in memo
    ├── TeamPanel.tsx
    ├── Modal.tsx             createPortal
    ├── ErrorBoundary.tsx     class
    ├── SessionTimer.tsx      class
    └── Footer.tsx
```

### 5.2 Component tree

```
StrictMode
└── TeamProvider
    └── App
        ├── Header (team counter)
        ├── ErrorBoundary
        │   └── PokemonList
        │       └── PokemonCard × n
        ├── TeamPanel
        │   └── Modal (rendered into <body> through a portal)
        └── Footer
            └── SessionTimer
```

The `ErrorBoundary` wraps only the list: if the list fails, the header and the panel keep working. That granularity is an interview question too.

### 5.3 Where each piece of state lives

This table is an interview question in itself: "how do you decide where state goes?"

| Data | Where | Why |
|---|---|---|
| Pokémon list | `useFetch` in `PokemonList` | server state, only the list uses it |
| Generation (151 / 386 / 1025) | `useState` in `PokemonList` | local (with routing it would live in the URL, see 7.1) |
| Search text | `useState` (controlled input) | local |
| Debounced text | `useDebounce` | avoids filtering on every keystroke |
| Filtered and sorted list | `useMemo` | **computed, not stored** |
| Favorites | `useState` with a list of ids in `PokemonList` | local |
| Team | Context + `useReducer` + localStorage | used by the header, the cards and the panel |
| Modal open | `useState` in `TeamPanel` | local |
| Timer seconds | `SessionTimer` class state | local |
| Paused / visible | `useState` in `Footer` | the parent controls the child: `paused` through props and `visible` through conditional rendering |
| Minutes reported | `useState` in `Footer`, updated from the `onMinute` callback | the child informs the parent |
| Interval id | `this.intervalId` instance field in `SessionTimer` | not rendered, so it doesn't belong in state (with hooks it would be a `useRef`) |

### 5.4 Data model

| Type | Fields |
|---|---|
| `PokemonSummary` | `id` (number), `name` (string), `imageUrl` (string) |
| `TeamMember` | `id`, `name` |
| `TeamState` | `members` (list of `TeamMember`, 6 at most) |

`TeamAction` is a union discriminated by the `type` field:

| `type` | Payload | Rule |
|---|---|---|
| `add` | `id`, `name` | does nothing if already there or if there are 6 |
| `remove` | `id` | — |
| `clear` | — | — |

### 5.5 Custom hooks

| Signature | What it does | Key concept |
|---|---|---|
| `useFetch<T>(url \| null, transform?)` → `{ data, error, loading }` | Creates an `AbortController` per URL, aborts in the cleanup and ignores the `AbortError`. With `null` it fetches nothing, so you never need to call the hook inside an `if` | effects, cleanup, race conditions, rules of hooks |
| `useDebounce(value, delay)` → delayed value | `setTimeout` in the effect, `clearTimeout` in the cleanup | cleanup (like `debounceTime` in RxJS, Reactive Extensions for JavaScript) |
| `useKeyDown(key, handler, enabled)` | Listener on `window`, removed in the cleanup | global listeners |
| `useTeam()` / `useTeamDispatch()` | Read their context and throw if there's no Provider | Context |
| `useInterval(callback, delay \| null)` (optional) | `null` pauses. Keeps the latest callback in a ref | refs, stale closures |

---

## 6. Implementation blocks

### Block 1 — Setup and list with real data (45 min)

**Tasks**
- Create the project with Vite and clean up the template. `main.tsx`: `StrictMode` → `App`.
- `types.ts` and `api/pokeApi.ts`: a function that builds the list URL for a given limit, and a pure mapper from each result to `PokemonSummary` (it extracts the id from the URL and builds `imageUrl`). All of it outside components.
- Implement `useFetch` (section 5.5).
- `Card`: generic container that just draws a frame and its `children`.
- `PokemonCard`: props `pokemon`, `isFavorite`, `onToggleFavorite(id)`. Uses `Card` inside. The "Add to team" button stays unwired until block 3. Put `loading="lazy"` on the `<img>` so you don't download 1025 images at once.
- `PokemonList`: generation `<select>` (state, 151 by default), `useFetch`, loading / error / empty states and the grid with `key={p.id}`.
- Favorites: `useState` with a list of ids and a functional update: `setFavorites(prev => …)`.
- Add a `console.log` in the effect body and another in the cleanup to see the `StrictMode` double mount.

**Gotchas**
- The effect function can't be `async` (it would return a promise instead of a cleanup): declare the async function inside and call it.
- If `transform` is in the dependencies and you pass an inline arrow, a new function is created on every render → **infinite request loop**. Fix: the mapper lives outside the component.
- Missing dependencies: the effect works with stale values.
- Race condition: without `abort`, a slow old response can overwrite a newer one.
- `onClick={fn(id)}` runs the function during render; the right form is `onClick={() => fn(id)}`.
- Props are read-only.
- (If you have 5 minutes to spare) Use the index as `key`, add local state to the card, reverse the order and watch the state "jump" to another card.

**Acceptance criteria**
- [ ] 151 real cards render with no `key` warnings in the console.
- [ ] With network throttling (Network tab), quickly switching 151 → 1025 → 151 leaves the 151 list, and the earlier requests show as canceled.
- [ ] Offline, an error message appears instead of a blank screen.
- [ ] The console shows mount → cleanup → mount (development only). Because of that, the first request may show as canceled in Network on load: that's expected.
- [ ] The star marks and unmarks favorites.

---

### Block 2 — Search and performance (30 min)

**Tasks**
- Controlled search input (`value` + `onChange`) and a 300-millisecond `useDebounce`.
- Sort selector (number / name).
- `filtered = useMemo(filter + sort, [list, debouncedQuery, sortBy])`.
- `PokemonCard` wrapped in `memo`; `toggleFavorite` with `useCallback` and a functional update, so its dependency array stays empty.
- Turn on "Highlight updates when components render" in React DevTools and check what re-renders.

**Gotchas**
- `memo` without `useCallback` on the callbacks is useless: a new function on every render breaks the shallow prop comparison.
- `sort` sorts the array in place: sorting the `useFetch` data directly mutates state. Always sort a copy (`[...list].sort(…)`).
- Storing the filtered list in `useState` and syncing it with an effect: the classic anti-pattern ("You Might Not Need an Effect"). Derived data is computed during render.
- Memoizing everything "just in case" has a cost. With the React Compiler on, most manual memoization is unnecessary (a good interview answer).

**Acceptance criteria**
- [ ] When you mark a favorite, that is the only card that re-renders (`PokemonList` does too, because its state changes).
- [ ] Typing in the search box doesn't filter on every keystroke.

---

### Block 3 — Team with `useReducer` and Context (40 min)

**Tasks**
- Pure `teamReducer` with `add`, `remove` and `clear` (section 5.4).
- `TeamProvider` with `useReducer(teamReducer, undefined, init)`, where `init` reads localStorage (third argument = lazy initialization). An effect saves the state whenever it changes.
- Two contexts, one for the state and one for `dispatch`, with the `useTeam` and `useTeamDispatch` hooks. In React 19 you can write `<TeamStateContext value={state}>` without `.Provider`.
- `PokemonCard` uses `useTeamDispatch` for the "Add to team" button. Since it only consumes `dispatch`, which is stable, it doesn't re-render when the team changes.
- `Header` with the "Team n/6" counter and `TeamPanel` with the list and "Remove".

**Gotchas**
- Mutating state in the reducer (`state.members.push(…)`): the reference doesn't change and React doesn't re-render. Always new objects and arrays.
- A context `value` created as a new object on every render makes **all** consumers re-render: memoize it with `useMemo` or split contexts (as done here).
- Side effects inside the reducer (localStorage, fetch): the reducer must be pure.
- Using `useTeam` outside the Provider: that's why the hook throws a clear error.

**Acceptance criteria**
- [ ] The team survives a page reload.
- [ ] A seventh member is ignored.
- [ ] With "Highlight updates" on, adding a member doesn't re-render the cards.

---

### Block 4 — Modal with portal and uncontrolled input (20 min)

**Tasks**
- `Modal` with `createPortal(…, document.body)`; props `open`, `title`, `children`, `onConfirm`, `onClose`; returns `null` when closed. "Clear team" opens it and confirming dispatches `clear`.
- On open, focus "Cancel" with `useRef` + `useEffect`.
- Close with Escape (`useKeyDown`, active only while the modal is open) and by clicking the backdrop (only if `e.target === e.currentTarget`).
- "Add by number" in `PokemonList`: an **uncontrolled** input with `useRef`, inside a `<form>`. In `onSubmit`, call `e.preventDefault()` (otherwise the page reloads), read `ref.current.value`, find the Pokémon in the list already loaded and dispatch `add`.

**Gotchas**
- Reading or writing `ref.current` during render (except to initialize it).
- Expecting a ref change to update the screen: it doesn't trigger a render.
- Forgetting to remove the `keydown` listener: one more piles up every time the modal opens.
- If `handler` is in the dependencies of `useKeyDown` and you pass an inline arrow, the listener is removed and re-added on every render. It works, but the cleaner approach is to keep the handler in a ref, as in `useInterval`.

**Acceptance criteria**
- [ ] The inspector shows the modal as a child of `<body>`, yet an `onClick` on the `TeamPanel` container receives clicks from the modal: events bubble through the React tree, not the DOM tree.
- [ ] After closing the modal, Escape does nothing.
- [ ] "Add by number" with 25 adds Pikachu.

---

### Block 5 — Class components, lifecycle and Error Boundary (40 min)

**Tasks**
- **`SessionTimer` (class)**: state `{ seconds }`, props `paused` and `onMinute(minutes)`.
  - **Lifecycle**
    - Keep the interval id in an instance field (`this.intervalId`), not in state: it isn't rendered, so it shouldn't trigger renders (it's the equivalent of `useRef`).
    - `componentDidMount`: starts the interval unless paused.
    - `componentDidUpdate(prevProps)`: if `paused` changed, stops or starts it.
    - `componentWillUnmount`: clears the interval.
  - **`setState` and its callback**: `tick` adds a second using the functional form, `this.setState(prev => ({ seconds: prev.seconds + 1 }), callback)`. In the second-argument callback, which runs once the state has been applied, check whether `this.state.seconds` is a multiple of 60 and, if so, call `this.props.onMinute(minutes)`. While testing, use multiples of 10 seconds so you don't have to wait.
  - **Binding `this`**: `tick` as a class arrow function (it's the one passed to `setInterval`); a "Reset" button (sets `seconds` to 0) with a regular method bound with `bind` in the constructor. Remove the `bind` for a moment and click: you'll see that `this` is `undefined`.
  - **Avoiding renders**: `shouldComponentUpdate(nextProps, nextState)` returning `false` if neither `seconds` nor `paused` changed. Then delete it and change `extends Component` to `extends PureComponent`, which does that shallow comparison for you.
- **`Footer`** (function): "Pause / Resume", "Show / Hide" (forces unmounting) and "n minutes so far", backed by state that the `onMinute` callback updates. Pass `setMinutes` directly (it's stable) or memoize the callback with `useCallback`.
- **`ErrorBoundary` (class)**: state `{ error }`; `static getDerivedStateFromError` stores the error; `componentDidCatch(error, info)` logs it; the fallback has a "Retry" button that clears the state. In `App` it wraps only `PokemonList`.
- In `PokemonList`:
  - "Break render": sets a `broken` state to `true` and, while it's on, the component throws during render.
  - "Error in handler": throws inside the `onClick`.
- (Optional) `useInterval` and a hooks version of the timer, to compare the two.

**Gotchas**
- In classes, `setState` merges the object into the previous state (only the keys you pass change); `useState` replaces it entirely.
- `setState` doesn't update `this.state` right away: reading it on the next line gives the old value. Use the functional form to depend on the previous state, and the callback (or `componentDidUpdate`) to act afterwards.
- Calling `setState` in `componentDidUpdate` without a condition causes an infinite loop.
- Class methods aren't bound automatically: `onClick={this.reset}` without `bind` or an arrow function loses `this`.
- An inline `onMinute={() => …}` in `Footer` makes `PureComponent` pointless: the prop is a new function on every render.
- Error Boundaries do **not** catch errors in event handlers, async code (`setTimeout`, promises), server-side rendering or the boundary itself. For a fetch error to be caught, you have to rethrow it during render.
- There's no hook equivalent of an Error Boundary: you need a class (or the `react-error-boundary` library, which wraps one).
- In development the error still shows up in the console even when the boundary catches it: that's expected and doesn't mean it failed.
- If you forget to clean up in `componentWillUnmount`, you'll notice right away in development: `StrictMode` also mounts, unmounts and remounts classes, and the timer will count by twos.

**Lifecycle: classes vs hooks**

| Class | When | With hooks |
|---|---|---|
| `constructor` | before the first render | `useState` / `useReducer` initializer, `useRef` |
| `static getDerivedStateFromProps` | before every render | compute during render (rarely needed) |
| `render` | on every render | the function body |
| `componentDidMount` | after the first commit | `useEffect(fn, [])` |
| `shouldComponentUpdate` | before re-rendering | `React.memo` (careful: its comparator returns `true` to **skip** the render, the opposite of `shouldComponentUpdate`) |
| `getSnapshotBeforeUpdate` | right before changes are applied to the DOM | no direct equivalent |
| `componentDidUpdate(prevProps, prevState)` | after every update | `useEffect` with dependencies |
| `componentWillUnmount` | before unmounting | the effect's cleanup function |
| `getDerivedStateFromError` / `componentDidCatch` | error in a descendant | no equivalent: a class is required |

The callback in `this.setState(…, callback)` is roughly equivalent to a `useEffect` that depends on that state; the `useState` setter has no second argument.

Legacy (`UNSAFE_` prefix): `componentWillMount`, `componentWillReceiveProps`, `componentWillUpdate`.

**Acceptance criteria**
- [ ] "Break render" replaces the list with the fallback; the header and the panel keep working.
- [ ] "Retry" brings the list back (the child mounts again with clean state).
- [ ] "Error in handler" only leaves the error in the console: the boundary doesn't catch it.
- [ ] Hiding the timer stops the interval (check with a `console.log` in the tick).
- [ ] When shown again it starts from 0: unmounting destroys the state.
- [ ] "n minutes so far" updates in the footer thanks to `onMinute`.
- [ ] Without the `bind`, "Reset" fails because `this` is undefined; with the `bind`, it works.

---

### Block 6 — Buffer (5 min)

For getting stuck. If there's time left, finish the unchecked criteria or read section 7.

---

## 7. Outside the plan: for reading (or building if you have time left)

### 7.1 Routing and lazy loading (React Router v8)
- Install it with `npm i react-router`; in v8 `react-router-dom` no longer exists and Node.js 22 or later is required. Declarative mode: `BrowserRouter`, `Routes`, `Route`, `Outlet`, `Link`, `NavLink`.
- `useParams` (returns strings), `useNavigate`, `useSearchParams` (the generation would move to `?limit=386`: shareable, survives a reload and the back button works).
- `React.lazy` + `Suspense` to load pages on demand (equivalent to `loadChildren` / `loadComponent` in Angular).
- **Gotchas**: `React.lazy` expects a module with a default export; `Suspense` must sit above the lazy component; when navigating between two detail pages React **reuses** the component and keeps its state, so a form would show the previous page's data: reset it with `key={id}`. For the same reason, an Error Boundary is reset on navigation with `key={location.pathname}`.

### 7.2 Concurrency
- `useDeferredValue(value)`: a "lagging" version of a value that React updates when it has time; an alternative to debouncing without timers.
- `useTransition`: `startTransition(() => setX(…))` marks the update as non-urgent and gives you `isPending` to show that something is in progress.

### 7.3 React 19 forms
- **Actions**: `<form action={fn}>`, where `fn` receives a `FormData` and can be async.
- **`useActionState(action, initialState)`** → `[state, formAction, isPending]`; the action receives `(prevState, formData)` and returns the new state.
- **`useFormStatus`**: the parent form's `pending`. **It only works in a child component of the `<form>`**, not in the component that renders it.
- After a successful action, React resets the form's uncontrolled fields.
- **`useOptimistic(state, updateFn)`**: shows an optimistic value while an action or transition is in progress. When it ends, it always goes back to the real state: if everything went well, you'll have updated it already; if it failed, the optimistic change simply disappears. The function that applies the optimistic change is called inside a transition or action.
- **`use(promise | context)`**: reads a promise (suspending) or a context; unlike other hooks, it can be called inside an `if`.
- **`useId`**: a unique, stable id to link a `label` and an input (`htmlFor`, `aria-describedby`).

### 7.4 More on refs and effects
- In React 19, `ref` is a regular prop in function components; `forwardRef` is no longer needed.
- `useLayoutEffect`: runs after the DOM is mutated and before paint. Useful for measuring (`getBoundingClientRect`) and positioning something without flicker; it blocks paint, so use it only when needed.

### 7.5 Theme with Context
- `ThemeContext` with `{ theme, toggleTheme }`, applied through a `data-theme` attribute on `document.documentElement` from an effect. Memoize the `value` with `useMemo`.

### 7.6 Tests with Vitest and React Testing Library
Useful if a coding exercise is validated against tests: it helps you quickly read what each test expects.
- `getBy` throws if nothing matches; `queryBy` returns `null` (to assert absence); `findBy` is async and waits.
- Prefer queries by role and accessible text: `getByRole('button', { name: /favorite/i })`.
- `await userEvent.click(…)` / `await userEvent.type(…)` to simulate the user (they're async); `vi.fn()` for callbacks; `vi.stubGlobal('fetch', …)` to mock requests; `renderHook` to test hooks; `vi.useFakeTimers` for the debounce.
- A reducer is tested without React: it's a pure function.

### 7.7 React 19.2
- `<Activity mode="hidden">` (or `"visible"`): hides part of the interface while keeping its state (with conditional rendering it would be lost).
- `useEffectEvent`: always reads the latest values from inside an effect without adding them to its dependencies; it replaces the ref pattern in `useInterval`.
- React Compiler: memoizes automatically at build time.

---

## 8. Cheat sheet

**Rendering and state**
- A component re-renders when its state changes, when its parent renders (even if the props are equal, unless it uses `memo`) or when a context it consumes changes.
- `setState` doesn't change the variable in the current render: the new value shows up in the next one. To chain updates: `setCount(c => c + 1)`.
- Since React 18 there's automatic *batching*: several updates in the same event, timeout or promise produce a single render.
- With `useState` and `useReducer`, if the new state equals the previous one (`Object.is`), React can skip the render.
- State is immutable: create new arrays and objects (spread, `map`, `filter`), never `push` or `splice`.
- Whatever can be computed from props or state doesn't go in state.
- `useState(() => expensiveComputation())` runs the function only on the first render.
- State is tied to the position in the tree; changing the `key` unmounts and mounts again (clean state).
- Render phase (pure, can be repeated or discarded) vs commit phase (applies to the DOM and then runs effects).

**Effects**
- `useEffect` usually runs after paint; `useLayoutEffect` runs after the DOM is mutated and before paint (it blocks paint).
- No array: after every render. `[]`: on mount (cleanup on unmount). `[a, b]`: when `a` or `b` changes (compared with `Object.is`).
- The cleanup runs before the next run of the effect and on unmount.
- `StrictMode`, development only: runs component bodies twice and mounts → unmounts → mounts to expose effects without cleanup.
- The effect function can't be `async`.
- *Stale closure*: an effect or callback sees the values from the render it was created in.

**Rules of hooks**
- Only at the top level (never inside conditions, loops or after an early `return`) and only from components or custom hooks. Exception: `use()` can be called conditionally.
- Custom hooks start with `use` and share **logic**, not state: each call has its own state.

**Memoization**
- `useMemo` memoizes a value; `useCallback` memoizes a function. `useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`.
- `React.memo` compares props shallowly; without stable references in the props, it's useless.
- The React Compiler applies memoization automatically at build time.

**Refs**
- Changing `ref.current` doesn't trigger a render. Don't read or write refs during render.
- In React 19, `ref` is a regular prop in function components; `forwardRef` is no longer needed.

**Context**
- Avoids *prop drilling*; it's a transport mechanism, not a state manager.
- All consumers re-render when the `value` changes (by reference): memoize the value or split contexts.

**Lists**
- `key` must be unique and stable among siblings. The index is only fine if the list never reorders. `key` doesn't reach the child as a prop.

**Events and forms**
- Synthetic events (`SyntheticEvent`), camelCase names, `onClick={handler}` and not `onClick={handler()}`.
- Controlled: `value` + `onChange`, React is the source of truth. Uncontrolled: `defaultValue` + a ref or `FormData`.
- Switching `value` from `undefined` to a value turns an uncontrolled input into a controlled one and triggers a warning.

**Class components**
- `this.setState` shallow-merges into the previous state (`useState` replaces it) and is batched with other updates; to depend on the previous state, use `this.setState(prev => …)`.
- The second argument of `setState` is a callback that runs once the update has been applied.
- Methods aren't bound automatically: `this` is `undefined` if you pass `this.handler` without `bind` in the constructor or without defining it as a class arrow function.
- `PureComponent` is `Component` with a `shouldComponentUpdate` that compares props and state shallowly.
- `this.setState` triggers a render even if the values don't change, unless `shouldComponentUpdate` or `PureComponent` prevents it (that's what they're for).
- A class child calls the parent's callbacks with `this.props.onX(…)`.
- `defaultProps` still works in classes; React 19 only removed it for function components.
- Refs in classes with `createRef()`; context with `static contextType` or `<Context.Consumer>`.

**Errors and portals**
- Error Boundaries only exist as classes (`getDerivedStateFromError`, `componentDidCatch`). They don't catch errors in event handlers, async code, server-side rendering or their own errors.
- `createPortal` renders into another DOM node, but events bubble according to the React tree.

**React 18–19.2**
- Concurrency: `useTransition` (marks an update as non-urgent and provides `isPending`), `useDeferredValue` (a lagging version of a value), `Suspense` (fallback while something loads).
- React 19: Actions (`<form action={fn}>`), `useActionState`, `useFormStatus` (only in children of the form), `useOptimistic`, `use(promise | context)`, `ref` as a prop, `<Context value>` as a provider, `<title>` and metadata inside components.
- React 19 ignores `propTypes` in all components; drops `defaultProps` for function components (use default values in destructuring instead); and removes string refs, legacy context, `ReactDOM.render` (now `createRoot`) and `findDOMNode`.
- React 19.2: `<Activity>` and `useEffectEvent`.

**Architecture**
- Virtual DOM and reconciliation: React compares the new tree with the previous one by type and `key` and applies the minimal changes to the DOM. Fiber lets it split, pause and prioritize that work.
- One-way data flow: data goes down through props and events go up through callbacks.
- Higher-order components (HOCs) and *render props*: older patterns that hooks have largely replaced.
