import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "ngx-addressTooltip",
  templateUrl: "./addressTooltip.component.html",
  styleUrls: ["./addressTooltip.component.scss"]
})
export class AddressTooltipComponent implements OnInit {
  fullAddress: string;
  partialAddress :string;
  @Input() value: string | number;
  @Input() rowData: any;

  constructor() {}

  ngOnInit() {
    if(this.rowData.address) {
      if(this.rowData.address.length > 16){
        this.partialAddress = this.rowData.address.substring(0,16).concat('...');
      } else{
        this.partialAddress = this.rowData.address;
      }
    }  else{
      this.partialAddress = this.rowData.address;
    }
    this.fullAddress = this.rowData.address;
  }
}
