import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditUserPageRoutingModule } from './edit-user-routing.module';

import { EditUserPage } from './edit-user.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { MaskPipe } from 'ngx-mask';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditUserPageRoutingModule,
    ComponentsModule
  ],
  declarations: [EditUserPage],
  providers: [MaskPipe]
})
export class EditUserPageModule {}
