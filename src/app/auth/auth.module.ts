import {NgModule} from '@angular/core';
import {AuthRoutingModule, routedComponents} from './auth-routing.module';
import {ThemeModule} from '../@theme/theme.module';
import { DpDatePickerModule } from 'ng2-jalali-date-picker';
import { TypeaheadModule } from "ngx-bootstrap/typeahead";
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ExecutersListResolver } from '../@core/utils/executersList-resolver';
import { GetAllTownsResolver } from '../@core/utils/getAllTowns-resolver';
import { TariffListResolver } from '../@core/utils/tariffList-resolver';
import { TariffNewBuildingListResolver } from '../@core/utils/tariffNewBuildingList-resolver';
import { GetAllTariffTypesResolver } from '../@core/utils/GetAllTariffTypes-resolver';
import { GetAllMeterTypesResolver } from '../@core/utils/GetAllMeterTypes-resolver';
import { GetAllConsumptionRangesResolver } from '../@core/utils/GetAllConsumptionRanges-resolver';
import { GetAllFoundationRangesResolver } from '../@core/utils/GetAllFoundationRanges-resolver';

@NgModule({
  imports: [
    ThemeModule,
    AuthRoutingModule,
    DpDatePickerModule,
    Ng2SmartTableModule,
    NgxPaginationModule,
    NgbTimepickerModule,
    TypeaheadModule.forRoot(),
  ], declarations: [
    ...routedComponents,
  ],
  providers: [
    ExecutersListResolver,
    GetAllTownsResolver,
    TariffListResolver,
    TariffNewBuildingListResolver,
    GetAllTariffTypesResolver,
    GetAllMeterTypesResolver,
    GetAllConsumptionRangesResolver,
    GetAllFoundationRangesResolver
  ],
})
export class AuthModule {
}
