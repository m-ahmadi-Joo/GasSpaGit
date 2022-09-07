export let environment = {
  production: true,
  SERVER_URL: '',
  // SERVER_URL: 'http://localhost:52805/api',
  // SERVER_URL: 'http://gas.fceo.ir:2727/api',
  // FILE_SERVER: 'http://gas.fceo.ir:2727'
};

let url = window.location.origin;

if (url.includes("http://localhost:4200")) {
  environment.SERVER_URL = 'http://localhost:52805/api';
}
else if (url.includes("http://gas.fceo.ir")) {
  environment.SERVER_URL = 'http://gas.fceo.ir:2727/api';
}
// else if(url.includes("http://gas.fceo.ir:2121")) {
//   environment.SERVER_URL = 'http://gas.fceo.ir:2727/api';
// }
else if (url.includes("http://192.168.0.201")) {
  environment.SERVER_URL = 'http://192.168.0.201:81/api';
}
else if (url.includes("http://192.168.0.6")) {
  environment.SERVER_URL = 'http://192.168.0.6:82/api';
}
else if (url.includes("http://192.168.0.18:83")) {
  environment.SERVER_URL = "http://192.168.0.18:82/api";
}
else if (url.includes("http://192.168.0.06:83")) {
  environment.SERVER_URL = "http://192.168.0.06:82/api";
}
else if (url.includes("http://192.168.2.6:83")) {
  environment.SERVER_URL = "http://192.168.2.06:82/api";
}
else if (url.includes("http://192.168.02.06:83")) {
  environment.SERVER_URL = "http://192.168.02.06:82/api";
}
else if (url.includes("http://192.168.0.15:83")) {
  environment.SERVER_URL = "http://192.168.0.15:82/api";
}
else {
  environment.SERVER_URL = 'http://localhost:5000/api';
}
//
