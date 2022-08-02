import { createAction, props } from '@ngrx/store';
import { MotionMessage } from '@sensor-demo/utils';

export const initMotions = createAction('[Motions Page] Init');

export const loadMotionsSuccess = createAction(
  '[Motions/API] Load Motions Success',
  props<{ motion: MotionMessage }>()
);

export const userLoggedIn = createAction(
  '[Motions/API] User logged in',
  props<{ username: string }>()
);
