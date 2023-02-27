import { Pixels } from '@prefecthq/prefect-design'
import * as d3 from 'd3'

export type HistogramData<T = unknown> = HistogramDataPoint<T>[]
export type HistogramDataPoint<T = unknown> = {
  value: number,
  intervalStart: Date,
  intervalEnd: Date,
  data?: T,
}

export type HistogramChartOptions = {
  showXAxis?: boolean,
  showYAxis?: boolean,
  curve?: d3.CurveFactory,
  transition?: boolean,
  transitionDuration?: number,
  selectionMinimumSeconds?: number,
  selectionMaximumSeconds?: number,
}

export type HistogramBarStyles = {
  left: Pixels,
  bottom: Pixels,
  width: Pixels,
  height: Pixels,
}

export type HistogramBar = HistogramDataPoint & {
  styles: HistogramBarStyles,
}

export const defaultHistogramChartOptions: Required<HistogramChartOptions> = {
  showXAxis: true,
  showYAxis: true,
  curve: d3.curveCatmullRom,
  transition: true,
  transitionDuration: 250,
  selectionMaximumSeconds: 0,
  selectionMinimumSeconds: Infinity,
}