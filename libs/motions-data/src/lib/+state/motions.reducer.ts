import { createReducer, on, Action } from '@ngrx/store';

import * as MotionsActions from './motions.actions';

import { MotionMessage } from '@sensor-demo/utils';

export const MOTIONS_FEATURE_KEY = 'motions';

export interface MotionsState {
  motion: MotionMessage | null;
  loaded: boolean;
  username?: string;
}

export interface MotionsPartialState {
  readonly [MOTIONS_FEATURE_KEY]: MotionsState;
}

export const initialMotionsState: MotionsState = {
  motion: null,
  loaded: false,
};

const reducer = createReducer(
  initialMotionsState,
  on(MotionsActions.initMotions, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(MotionsActions.loadMotionsSuccess, (state, { motion }) => ({
    ...state,
    loaded: true,
    motion,
  })),
  on(MotionsActions.userLoggedIn, (state, { username }) => ({
    ...state,
    username,
  }))
);

export function motionsReducer(
  state: MotionsState | undefined,
  action: Action
) {
  return reducer(state, action);
}
