import { Component, OnInit, Input } from "@angular/core";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";

@Component({
  selector: "app-contractDetail",
  templateUrl: "./ContractDetailForm.component.html",
  styleUrls: ["../formStyle.scss"],
})
export class ContractDetailFormComponent implements OnInit {
  info: any;

  @Input() id: number;

  // streetMaps = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //   detectRetina: true,
  //   attribution: '',
  // });
  // wMaps = L.tileLayer('http://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
  //   detectRetina: true,
  //   attribution: '',
  // });
  // googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
  //   maxZoom: 20,
  //   subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  // });
  // summit = L.marker([29.631732, 52.5354509], {
  //   icon: L.icon({
  //     iconSize: [25, 41],
  //     iconAnchor: [13, 41],
  //     iconUrl: '/assets/img/markers/marker-icon.png',
  //     shadowUrl: '/assets/img/markers/marker-shadow.png',
  //   }),
  // });
  // layersControl = {
  //   baseLayers: {
  //     'نقشه خیابان ها': this.streetMaps,
  //     // tslint:disable-next-line:object-literal-key-quotes
  //     'نقشه': this.wMaps,
  //     'نقشه ماهواره ای': this.googleSat,
  //   },
  //   overlays: {
  //     'موقعیت فعلی': this.summit,
  //   },
  // };
  // latgs: string[] = [];
  // leafMap: L.Map;
  // options = {
  //   layers: [this.streetMaps, this.summit],
  //   zoom: 11,
  //   center: L.latLng([this.info.lat,this.info.long]),
  // };

  constructor(private api: ApiCommandCenter) {}

  ngOnInit() {
    //let contractId = parseInt(this.route.snapshot.paramMap.get('id'));
    this.api.getById("Contract/GetDetails", this.id).subscribe(
      (res) => {
        this.info = res.body;
      },
      (err) => {
        // console.log(err.error);
      }
    );
    // this.api.getById("Contract/GetDetails", contractId).
    //   subscribe(res => {
    //     this.info = res.body;
    //   },
    //     err => {
    //       console.log(err.error);
    //     });
  }
}
