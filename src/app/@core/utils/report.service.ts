import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  baseServerRoute: string;
  pdfSrc:string;
  getPrint:any;

constructor() { }

showReport(fullPath: string) {
  this.baseServerRoute = environment.SERVER_URL.split("/api")[0];
  this.pdfSrc = fullPath;
  this.pdfSrc = this.pdfSrc.split("\Documents").pop();
  this.pdfSrc = "\\Documents" + this.pdfSrc;
  console.log(this.baseServerRoute);
  console.log(this.pdfSrc);
  console.log(this.baseServerRoute + this.pdfSrc);
  this.pdfSrc = this.baseServerRoute + this.pdfSrc;
  this.getPrint = window.open(this.pdfSrc, '_blank');
  this.getPrint.print();
}

}


