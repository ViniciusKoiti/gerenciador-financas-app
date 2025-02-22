import { Component } from '@angular/core';
import {MatAccordion, MatExpansionPanel} from '@angular/material/expansion';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-report-graph',
  imports: [
    MatExpansionPanel,
    MatAccordion,
    MatIcon
  ],
  templateUrl: './report-graph.component.html',
  styleUrl: './report-graph.component.scss',
  standalone: true
})
export class ReportGraphComponent {

}
