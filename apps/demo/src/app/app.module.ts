import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { MotionsDataModule } from '@sensor-demo/motions-data';
import { StoreModule } from '@ngrx/store';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    MotionsDataModule,
    StoreModule.forRoot({}),
    RouterModule.forRoot(
      [
        {
          path: 'control',
          loadChildren: () =>
            import('@sensor-demo/m').then((module) => module.MModule),
        },
        {
          path: 'scene',
          loadChildren: () =>
            import('@sensor-demo/im').then((module) => module.ImModule),
        },
      ],
      { initialNavigation: 'enabledBlocking' }
    ),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
