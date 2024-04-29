export class Chart {
  static readonly GridNoPadding = {
    left: 20,
    top: 30,
    right: 0,
    bottom: 20
  };

  static readonly DefaultColors = [
    // TODO: use something similar to trix
    '#1f75cb',
    '#108548'
  ];

  static readonly DefaultTooltip = <any>{
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  };

  static readonly DefaultSeries = <any[]>[
    // TODO
    this.createLineSeries('#1f75cb'),
    this.createLineSeries('#108548')
  ];

  static createLineSeries(areaColor: string) {
    return {
      type: 'line',
      name: 'Online Users',
      stack: 'Total',
      emphasis: {
        disabled: true
      },
      lineStyle: {
        width: 2
      },
      areaStyle: {
        color: areaColor,
        opacity: 0.3
      }
    };
  }
}
