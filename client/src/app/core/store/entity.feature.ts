import { inject } from '@angular/core';
import { patchState } from '@ngrx/signals';
import {
  setAllEntities,
  addEntity,
  updateEntity,
  removeEntity,
  type EntityId,
  type SelectEntityId,
} from '@ngrx/signals/entities';
import { ApiService } from '../api/api.service';

export interface EntityCrudConfig<T> {
  endpoint: string;
  mapListResponse?: (res: unknown) => T[];
  mapCreatePayload?: (data: Partial<T>) => unknown;
  mapUpdatePayload?: (data: Partial<T>) => unknown;
}

/** MongoDB uses `_id` — this selectId function maps it for NgRx entities */
const mongoSelectId: SelectEntityId<{ _id: string }> = (entity) => entity._id;

/**
 * Creates CRUD method implementations for an entity store.
 * Use inside `withMethods()` — call `entityCrudMethods<T>(store, config)`.
 *
 * Each store composes `withEntities<T>()` and `withLoadingState()` directly,
 * then uses this helper for standard CRUD operations.
 */
export function entityCrudMethods<T extends { _id: string }>(
  store: any,
  config: EntityCrudConfig<T>,
) {
  const api = inject(ApiService);
  const selectId = mongoSelectId as SelectEntityId<T>;

  return {
    async loadAll(params?: Record<string, string>): Promise<void> {
      patchState(store, { loading: true, error: null });
      try {
        const res = await api.get<unknown>(config.endpoint, params);
        const items = config.mapListResponse
          ? config.mapListResponse(res)
          : ((res as { data: T[] }).data ?? (res as T[]));
        patchState(store, setAllEntities(items, { selectId }));
        patchState(store, { loading: false });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Failed to load';
        patchState(store, { loading: false, error: msg });
      }
    },

    async loadById(id: string): Promise<T> {
      const res = await api.get<T>(`${config.endpoint}/${id}`);
      patchState(store, addEntity(res, { selectId }));
      return res;
    },

    async create(data: Partial<T>): Promise<T> {
      const payload = config.mapCreatePayload ? config.mapCreatePayload(data) : data;
      const created = await api.post<T>(config.endpoint, payload);
      patchState(store, addEntity(created, { selectId }));
      return created;
    },

    async update(id: string, data: Partial<T>): Promise<T> {
      const payload = config.mapUpdatePayload ? config.mapUpdatePayload(data) : data;
      const updated = await api.put<T>(`${config.endpoint}/${id}`, payload);
      // Replace the entity in the store by removing and re-adding
      patchState(store, removeEntity(id as EntityId));
      patchState(store, addEntity(updated, { selectId }));
      return updated;
    },

    async remove(id: string): Promise<void> {
      await api.delete(`${config.endpoint}/${id}`);
      patchState(store, removeEntity(id as EntityId));
    },
  };
}
