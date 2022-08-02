import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MOTIONS_FEATURE_KEY, MotionsState } from './motions.reducer';

export const getMotionsState =
  createFeatureSelector<MotionsState>(MOTIONS_FEATURE_KEY);

export const getMotionsLoaded = createSelector(
  getMotionsState,
  (state: MotionsState) => state?.loaded
);

export const getMotion = createSelector(
  getMotionsState,
  (state: MotionsState) => state?.motion
);

export const getUsername = createSelector(
  getMotionsState,
  (state: MotionsState) => state?.username
);
