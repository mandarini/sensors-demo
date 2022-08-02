import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromMotions from './+state/motions.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      fromMotions.MOTIONS_FEATURE_KEY,
      fromMotions.motionsReducer
    ),
  ],
})
export class MotionsDataModule {}
