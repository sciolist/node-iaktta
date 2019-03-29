import { clearObserver, observe } from "../observer";

export function autorun(fn: () => void) {
  const o = () => {
    clearObserver(o);
    observe(o, fn);
  };
  observe(o, fn);
  return o;
}
