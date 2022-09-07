import {Injectable} from '@angular/core';
import {ApiUrlProvider} from '../services/apiUrlProvider';
import {environment} from '../../../../environments/environment';

// test

@Injectable()
// export class ApiUrlProviderService extends ApiUrlProvider {
//   url = environment.SERVER_URL;
//   getUrl(controller?: string, action?: string) {
//     if (controller && action) {
//       return this.url + '/' + controller + '/' + action;
//     } else if (controller) {
//       return this.url + '/' + controller;
//     } else if (!controller && !action) {
//       return this.url;
//     } else {
//       return 'invalid';
//     }
//   }
// }


export class ApiUrlProviderService extends ApiUrlProvider {

  url = environment.SERVER_URL;

  getUrlByArray(controller?: string, action?: string, ids?: string[]): string {
    if (controller && action && ids) {
      return this.url + '/' + controller + '/' + action + '/' + ids;
    }
    else if (controller && action) {
      return this.url + '/' + controller + '/' + action;
    } else {
      return 'invalid';
    }
  }

  getUrlForUser(controller?: string, action?: string, id?: string): string {
    if (controller && action && id) {
      return this.url + '/' + controller + '/' + action + '?userId=' + id;
    }
    else if (controller && action) {
      return this.url + '/' + controller + '/' + action;
    } else if (controller && id) {
      return this.url + '/' + controller + '/' + id;
    } else if (controller) {
      return this.url + '/' + controller;
    }
    else if (!controller && !action) {
      return this.url;
    } else {
      return 'invalid';
    }
  }

  getUrl(controller?: string, action?: string, id?: number) {
    if (controller && action && id) {
      return this.url + '/' + controller + '/' + action + '/' + id;
    }
    else if (controller && action) {
      return this.url + '/' + controller + '/' + action;
    } else if (controller && id) {
      return this.url + '/' + controller + '/' + id;
    } else if (controller) {
      return this.url + '/' + controller;
    }
    else if (!controller && !action) {
      return this.url;
    } else {
      return 'invalid';
    }
  }


  // getUrlForGasRequestChilds(controller: string, gasReqId: number, action?: string, id?: number) {
  //   if (controller && gasReqId && action && id) {
  //     return this.url + '/' + 'GasRequest/' + gasReqId + '/' + controller + '/' + action + '/' + id;
  //   }
  //   else if (controller && gasReqId && action) {
  //     return this.url + '/' + 'GasRequest/' + gasReqId + '/' + controller + '/' + action ;
  //   }
  //   else if (controller && gasReqId) {
  //     return this.url + '/' + 'GasRequest/' + gasReqId + '/' + controller ;
  //   }
  //   else if (!controller && !gasReqId) {
  //     return this.url;
  //   } else {
  //     return 'invalid';
  //   }
  // }

  // getUrlForAproveAlbumArchitecture(controller: string, gasReqId: number, action?: string, id?: number) {
  //   if (controller && gasReqId && action && id) {
  //     return this.url + '/' + 'GasRequest/' + gasReqId + '/' + controller + '/' + action + '/' + id;
  //   }
  //   else if (controller && gasReqId && action) {
  //     return this.url + '/' + 'GasRequest/' + gasReqId + '/' + controller + '/' + action ;
  //   }
  //   else if (controller && gasReqId) {
  //     return this.url + '/' + 'GasRequest/' + gasReqId + '/' + controller ;
  //   }
  //   else if (!controller && !gasReqId) {
  //     return this.url;
  //   } else {
  //     return 'invalid';
  //   }
  // }

}
