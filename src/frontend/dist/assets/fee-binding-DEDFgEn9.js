import{D as r}from"./index--4TiUmLq.js";/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const s=[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]],d=r("external-link",s);/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i=[["path",{d:"M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",key:"96xj49"}]],g=r("flame",i);function x(c,h){const a=h.toLowerCase().replace(/^0x/,"");if(a.length!==64)throw new Error("Invalid burn tx hash length — expected 32 bytes");const e=new TextEncoder().encode(c);if(e.length<5||e.length>63)throw new Error("Invalid principal length for fee binding payload");const t=new Uint8Array(1+e.length+32);t[0]=e.length,t.set(e,1);const l=(a.match(/.{2}/g)??[]).map(n=>Number.parseInt(n,16));t.set(l,1+e.length);let o="0x";for(const n of t)o+=n.toString(16).padStart(2,"0");return o}export{d as E,g as F,x as b};
