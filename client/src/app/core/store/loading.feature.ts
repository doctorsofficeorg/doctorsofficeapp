import { computed } from '@angular/core';
import { signalStoreFeature, withComputed, withState } from '@ngrx/signals';

export interface LoadingState {
  loading: boolean;
  error: string | null;
}

export function withLoadingState() {
  return signalStoreFeature(
    withState<LoadingState>({ loading: false, error: null }),
    withComputed(({ loading, error }) => ({
      hasError: computed(() => error() !== null),
      isIdle: computed(() => !loading() && error() === null),
    }))
  );
}
