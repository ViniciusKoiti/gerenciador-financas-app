import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '@shared/interceptor/auth.interceptor';
import { errorInterceptor } from '@shared/interceptor/error.interceptor';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import {Chart} from 'chart.js';
import * as ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),

    provideCharts(withDefaultRegisterables()),
  ]
};
