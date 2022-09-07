import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomWindowServiceService {

constructor() { }


public close: EventEmitter<any> = new EventEmitter<any>();
}
