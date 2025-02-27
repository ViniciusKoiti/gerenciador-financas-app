import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {MatAccordion, MatExpansionPanel, MatExpansionPanelHeader} from '@angular/material/expansion';
import {MatIcon} from '@angular/material/icon';
import {BaseChartDirective} from 'ng2-charts';
import {LineGraphService} from '@shared/services/line-graph.service';

@Component({
  selector: 'app-report-graph',
  imports: [
    MatExpansionPanel,
    MatAccordion,
    MatExpansionPanelHeader,
    MatIcon,
    BaseChartDirective
  ],
  templateUrl: './report-graph.component.html',
  styleUrl: './report-graph.component.scss',
  standalone: true
})
export class ReportGraphComponent implements OnInit  {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  public barChartOptions = {
    responsive: true,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuad'
    }
  };
  public barChartLabels = ['Janeiro', 'Fevereiro', 'Março', 'Abril'];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData = [
    { data: [50, 70, 40, 90], label: 'Vendas 2024' },
    { data: [30, 80, 60, 100], label: 'Vendas 2023' }
  ];
  private readonly lineGraphService = inject(LineGraphService);


  ngOnInit(): void {
    this.findGraphData();
  }



  updateChart() {
    setTimeout(() => {
      this.chart?.update();
    }, 300);
  }

  findGraphData(): void {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 1);
    const lastMonth = new Date();
    lastMonth.setFullYear(lastMonth.getFullYear() - 1);
    lastMonth.setDate(today.getDate() - 30);

    this.lineGraphService.findLineGraphs(lastMonth, today).subscribe(response => {
      const {labels, dataset}: { labels: string[], dataset: number[] } =
        response.reduce<{ labels: string[], dataset: number[] }>((acc, item) => {
          acc.labels.push(item.name);
          acc.dataset.push(item.value);
          return acc;
        }, {labels: [], dataset: []});

      this.barChartLabels = labels;
      this.barChartData = [{data: dataset, label: 'Vendas Atualizadas'}];
    });
  }

}
