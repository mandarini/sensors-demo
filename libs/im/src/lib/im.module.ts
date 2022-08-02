import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SceneComponent } from './scene/scene.component';
import { RouterModule } from '@angular/router';
import { MotionsDataModule } from '@sensor-demo/motions-data';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MotionsDataModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: SceneComponent },
    ]),
  ],
  declarations: [SceneComponent],
  exports: [SceneComponent],
})
export class ImModule {}
