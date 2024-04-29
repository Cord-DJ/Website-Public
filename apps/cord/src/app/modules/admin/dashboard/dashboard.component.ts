import { Component, OnInit } from '@angular/core';
import { EChartsOption, registerTheme } from 'echarts';
import { FetchService } from '../services/fetch.service';
import { DatasetOption } from 'echarts/types/dist/shared';
import { DateRange } from '../services/date-range';
import { Chart } from '../services/chart-config';
import { DateTime } from 'luxon';

@Component({
  selector: 'cord-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  chartOption: EChartsOption = {
    grid: Chart.GridNoPadding,
    color: Chart.DefaultColors,
    tooltip: Chart.DefaultTooltip,

    title: {
      text: 'Online Users'
    },

    legend: {
      data: ['Online Users']
    },

    xAxis: {
      type: 'category'
    },

    yAxis: {
      // type: 'value',
    },

    series: Chart.DefaultSeries.slice(0, 1)
  };

  constructor(private fetch: FetchService) {
    registerTheme('dark', {
      title: {
        textStyle: {
          color: '#FFFFFF'
        }
      },
      legend: {
        textStyle: {
          color: '#FFFFFF'
        }
      },
      yAxis: {
        splitLine: {
          lineStyle: {
            color: '#FF0000'
          }
        }
      }
    });
  }

  async ngOnInit() {
    const dr = new DateRange(DateTime.now().minus({ days: 1 }), DateTime.now());
    const response = await this.fetch.get('sum(sum(cord_open_sessions))').setRange(dr).fetchRange();

    this.chartOption = {
      ...this.chartOption,
      dataset: <DatasetOption>{
        source: [['date', 'online'], ...response.map((x: any) => [new Date(x[0] * 1000).toLocaleString(), x[1]])]
      }
    };
  }
}
