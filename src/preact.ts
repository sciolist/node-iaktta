import { createObserver, activate } from './observer';
import { useMemo, useRef, useState } from 'preact/hooks';

export function useObserver<T>(render: () => T): T {
  const [update, setUpdate] = useState(null);

  const observer = useMemo(() => (
    createObserver({
      run: () => {
        observer.clear();
        setUpdate(Object.create(null));
      }
    })
  ), []);

  const previous = activate(observer);
  try {
    return render();
  } finally {
    activate(previous);
  }
}
