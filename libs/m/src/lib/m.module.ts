import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlComponent } from './control/control.component';
import { RouterModule } from '@angular/router';
import { MotionsDataModule } from '@sensor-demo/motions-data';

@NgModule({
  imports: [
    CommonModule,
    MotionsDataModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: ControlComponent },
    ]),
  ],
  declarations: [ControlComponent],
  exports: [ControlComponent],
})
export class MModule {}
