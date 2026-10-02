// Loose stand-ins for react/next types, ONLY for checking this project's own code
// in an environment without node_modules. The real build uses the real types.
declare module "react" {
  export type ReactNode = any;
  export type KeyboardEvent<T = any> = any;
  export type PointerEvent<T = any> = any;
  export type AnchorHTMLAttributes<T = any> = { [k: string]: any; className?: string; href?: string };
  export function useState<S>(init: S | (() => S)): [S, (v: S | ((p: S) => S)) => void];
  export function useEffect(fn: () => void | (() => void), deps?: unknown[]): void;
  export function useRef<T>(init: T): { current: T };
  export function useRef<T>(init: T | null): { current: T | null };
  export function useMemo<T>(fn: () => T, deps: unknown[]): T;
  export function useCallback<T extends (...a: any[]) => any>(fn: T, deps: unknown[]): T;
  export function useId(): string;
  export function useSyncExternalStore<T>(sub: (cb: () => void) => () => void, get: () => T, getServer?: () => T): T;
}
declare module "react/jsx-runtime" { export const jsx: any; export const jsxs: any; export const Fragment: any; }
declare module "react-dom/client" { export const hydrateRoot: any; }
declare module "react-dom/server" { export const renderToString: any; }
declare module "next" {
  export type Metadata = Record<string, any>;
  export type Viewport = Record<string, any>;
  export namespace MetadataRoute { type Sitemap = Array<Record<string, any>>; type Robots = Record<string, any>; }
}
declare module "*.css";
declare namespace JSX {
  interface IntrinsicElements { [k: string]: any }
  interface IntrinsicAttributes { key?: any }
  type Element = any;
}
declare var process: { env: Record<string, string | undefined> };
