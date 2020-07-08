const ua = navigator.userAgent.toLowerCase();
const isSafari: boolean = ua.includes('safari') && !ua.includes('chrome');

if (isSafari) {
  delete (window as any).fetch;
  delete (window as any).Request;
  delete (window as any).Response;
}

import { fetch as $fetch, Response as $Response, Request as $Request } from 'whatwg-fetch';

if (isSafari) {
  (window as any).fetch = $fetch;
  (window as any).Request = $Request;
  (window as any).Response = $Response;
}
