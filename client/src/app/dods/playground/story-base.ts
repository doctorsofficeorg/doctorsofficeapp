import { signal } from '@angular/core';
import { DodsControlDef } from './playground.types';

export function createStoryState(controls: DodsControlDef[]) {
  const defaults: Record<string, unknown> = {};
  for (const c of controls) defaults[c.key] = c.defaultValue;

  const state = signal<Record<string, unknown>>({ ...defaults });

  return {
    state,
    onChange: (change: { key: string; value: unknown }) =>
      state.update(s => ({ ...s, [change.key]: change.value })),
    onReset: () => state.set({ ...defaults }),
    prop: <T>(key: string) => state()[key] as T,
  };
}
