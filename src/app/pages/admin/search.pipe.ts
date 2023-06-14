import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'customeFilter'
})
export class SearchPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!args) {
      return value;
    }
    return value.filter((val) => {
      let rVal = val.engineerOrganizationCode ? (val.engineerOrganizationCode.toLocaleLowerCase().includes(args)) : false
      || (val.fullName.toLocaleLowerCase().includes(args))
      || (val.nationalID.toLocaleLowerCase().includes(args))
      ;
      return rVal;
    })

  }

}