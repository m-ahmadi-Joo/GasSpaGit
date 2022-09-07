import { HttpParams } from "@angular/common/http";
import { PersianMonths, ChartType } from "./../../../../@core/models/baseEnums";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { Chart } from "./../../../../@core/models/baseInterfaces";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AdminPanelInfo } from "src/app/@core/models/baseInterfaces";
import * as shape from "d3-shape";

// import { environment } from 'src/environments/environment';

@Component({
  selector: "app-admin-panel",
  templateUrl: "./admin-panel.component.html",
  styleUrls: ["./admin-panel.component.scss"],
})
export class AdminPanelComponent implements OnInit {
  info: AdminPanelInfo;
  persianMonths = PersianMonths;
  chartTypes = ChartType;
  searchForm: FormGroup;
  params: any = {};
  // @ViewChild('chart', {static: false}) chart: LineChartComponent;

  constructor(
    private route: ActivatedRoute,
    private api: ApiCommandCenter,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.info = data["data"] as AdminPanelInfo;
      let monthKey = "";
      console.log(this.info);
      switch (this.info.currentMonth) {
        case 1:
          monthKey = "Farvardin";
          break;
        case 2:
          monthKey = "Ordibehesht";
          break;
        case 3:
          monthKey = "Khordad";
          break;
        case 4:
          monthKey = "Tir";
          break;
        case 5:
          monthKey = "Mordad";
          break;
        case 6:
          monthKey = "Shahrivar";
          break;
        case 7:
          monthKey = "Mehr";
          break;
        case 8:
          monthKey = "Aban";
          break;
        case 9:
          monthKey = "Azar";
          break;
        case 10:
          monthKey = "Dey";
          break;
        case 11:
          monthKey = "Bahman";
          break;
        case 12:
          monthKey = "Esfand";
          break;
        default:
          break;
      }

      this.searchForm = this.fb.group({
        areaIds: new FormControl(""),
        chartType: new FormControl("Monthly"),
        persianYear: new FormControl(this.info.currentPersianYear),
        persianMonth: new FormControl(monthKey),
      });
    });
    // this.usertoken = localStorage.getItem("token");
  }

  resetFilters() {
    // this.params.areaIds = [];
    // this.params.chartType =  this.chartTypes.Monthly.toString();
    // this.params.persianYear = this.info.currentPersianYear;
    // this.params.persianMonth = this.info.currentMonth;
    this.searchForm.get("chartType").setValue("Monthly");
    this.searchForm.get("persianYear").setValue(this.info.currentPersianYear);
    let monthKey = "";
    switch (this.info.currentMonth) {
      case 1:
        monthKey = "Farvardin";
        break;
      case 2:
        monthKey = "Ordibehesht";
        break;
      case 3:
        monthKey = "Khordad";
        break;
      case 4:
        monthKey = "Tir";
        break;
      case 5:
        monthKey = "Mordad";
        break;
      case 6:
        monthKey = "Shahrivar";
        break;
      case 7:
        monthKey = "Mehr";
        break;
      case 8:
        monthKey = "Aban";
        break;
      case 9:
        monthKey = "Azar";
        break;
      case 10:
        monthKey = "Dey";
        break;
      case 11:
        monthKey = "Bahman";
        break;
      case 12:
        monthKey = "Esfand";
        break;
      default:
        break;
    }
    this.searchForm.get("persianMonth").setValue(monthKey);
    this.searchForm.get("areaIds").setValue([]);
    this.loadChart();
  }

  loadChart() {
    let params = new HttpParams()
      .set("areaIds", this.searchForm.get("areaIds").value)
      .set("chartType", this.searchForm.get("chartType").value)
      .set("persianYear", this.searchForm.get("persianYear").value)
      .set(
        "persianMonth",
        this.mapPersianMonthNameToNumber(
          this.searchForm.get("persianMonth").value
        ).toString()
      );

    this.api
      .getFromByParams("Admin", "GetLineChartInfo", params)
      .subscribe((data: Array<Chart>) => {
        this.info.inspectionResultForChart = data;
        console.log(data);
        // this.chart.filteredDomain = null;
        // this.chart.update();
      });
  }

  mapPersianMonthNameToNumber(monthName) {
    let result = this.info.currentMonth;
    switch (monthName) {
      case "Farvardin":
        result = 1;
        break;
      case "Ordibehesht":
        result = 2;
        break;
      case "Khordad":
        result = 3;
        break;
      case "Tir":
        result = 4;
        break;
      case "Mordad":
        result = 5;
        break;
      case "Shahrivar":
        result = 6;
        break;
      case "Mehr":
        result = 7;
        break;
      case "Aban":
        result = 8;
        break;
      case "Azar":
        result = 9;
        break;
      case "Dey":
        result = 10;
        break;
      case "Bahman":
        result = 11;
        break;
      case "Esfand":
        result = 12;
        break;
      default:
        break;
    }
    return result;
  }

  // getLineChartInfo(pyear) {
  //   this.api.getFrom("Admin", "GetLineChartInfo/" + pyear)
  //     .subscribe((data: Array<Chart>) => {
  //       this.info.inspectionResultForChart = data;
  //     })
  // }

  // options
  rangeFillOpacity: number = 0.15;
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  legendTitle = "عنوان درخواست ها";
  legendPosition = "right"; //'right';
  showXAxisLabel = true;
  tooltipDisabled = false;
  showText = true;
  xAxisLabel = "ماه";
  showYAxisLabel = true;
  yAxisLabel = "تعداد";
  showGridLines = true;
  innerPadding = "10%";
  barPadding = 8;
  groupPadding = 16;
  roundDomains = false;
  // maxRadius = 10;
  // minRadius = 3;
  maxRadius = 15;
  minRadius = 0;
  showSeriesOnHover = true;
  roundEdges: boolean = true;
  animations: boolean = true;
  xScaleMin: any;
  xScaleMax: any;
  yScaleMin: number;
  yScaleMax: number;
  showDataLabel = true;
  noBarWhenZero = true;
  trimXAxisTicks = true;
  trimYAxisTicks = true;
  rotateXAxisTicks = true;
  maxXAxisTickLength = 16;
  maxYAxisTickLength = 16;
  schemeType: string = "ordinal";
  autoScale = true;
  curves = {
    Basis: shape.curveBasis,
    "Basis Closed": shape.curveBasisClosed,
    Bundle: shape.curveBundle.beta(1),
    Cardinal: shape.curveCardinal,
    "Cardinal Closed": shape.curveCardinalClosed,
    "Catmull Rom": shape.curveCatmullRom,
    "Catmull Rom Closed": shape.curveCatmullRomClosed,
    Linear: shape.curveLinear,
    "Linear Closed": shape.curveLinearClosed,
    "Monotone X": shape.curveMonotoneX,
    "Monotone Y": shape.curveMonotoneY,
    Natural: shape.curveNatural,
    Step: shape.curveStep,
    "Step After": shape.curveStepAfter,
    "Step Before": shape.curveStepBefore,
    default: shape.curveLinear,
  };

  // line interpolation
  curveType: string = "Linear";
  curve: any = this.curves[this.curveType];
  interpolationTypes = [
    "Basis",
    "Bundle",
    "Cardinal",
    "Catmull Rom",
    "Linear",
    "Monotone X",
    "Monotone Y",
    "Natural",
    "Step",
    "Step After",
    "Step Before",
  ];
  // view: any[] = [600, 400];
  // options for the chart
  // showXAxis = true;
  // showYAxis = true;
  // gradient = false;
  // showLegend = true;
  // showXAxisLabel = true;
  // xAxisLabel = 'ماه';
  // showYAxisLabel = true;
  // yAxisLabel = 'تعداد';
  timeline = true;
  // colorScheme = {
  //   domain: ['#9370DB', '#87CEFA', '#FA8072', '#FF7F50', '#90EE90', '#9370DB']
  // };

  colorScheme = {
    domain: [
      "#797508",
      "#e820a1",
      "#34daca",
      "#a26274",
      "#9370DB",
      "#87CEFA",
      "#FA8072",
      "#b5907e",
      "#90EE90",
      "#856c90",
      "#8bbd11",
      "#ec9bfa",
      "#bb234d",
      "#026b49",
    ],
  };

  //pie
  showLabels = true;

  onLegendLabelClick(entry) {
    console.log("Legend clicked", entry);
  }

  select(data) {
    console.log("Item clicked", JSON.parse(JSON.stringify(data)));
  }

  // mathFunction: (o: any) => any;

  // generatePlotData() {
  //   if (!this.mathFunction) {
  //     return [];
  //   }
  //   const twoPi = 2 * Math.PI;
  //   const length = 25;
  //   const series = Array.apply(null, { length }).map((d, i) => {
  //     const x = i / (length - 1);
  //     const t = x * twoPi;
  //     return {
  //       name: ~~(x * 360),
  //       value: this.mathFunction(t)
  //     };
  //   });

  //   return [
  //     {
  //       name: this.mathText,
  //       series
  //     }
  //   ];
  // }

  // hangfireDashboard() {
  //   this.api.getFrom("Schedules", "RefreshJobs").subscribe((res: any) => {
  //     if(res.ok) {
  //       alert('ok')
  //     }
  //   })
  // }
}
