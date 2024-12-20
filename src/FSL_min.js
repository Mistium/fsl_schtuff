const splitters={splitLogic(e){const t=[];let r="",n=!1,s=!1,o=0,a=0,i=0,u=!1;const c=/(\|\||&&)/;for(let l=0;l<e.length;l++){const p=e[l];if(u)r+=p,u=!1;else if("\\"!==p){if("'"!==p||s||u?'"'!==p||n||u||(s=!s):n=!n,n||s||("["===p?o++:"]"===p?o--:"{"===p?a++:"}"===p?a--:"("===p?i++:")"===p&&i--),!n&&!s&&0===o&&0===a&&0===i){const n=e.slice(l).match(c);if(n&&0===n.index){r.trim()&&(t.push(r.trim()),r=""),t.push(n[0]),l+=n[0].length-1;continue}}r+=p}else u=!0,r+=p}return r.trim()&&t.push(r.trim()),t},splitOperators(e){const t=["+","-","*","/"],r=[];let n="",s=!1,o=!1,a=0,i=0,u=0,c=!1;for(let l=0;l<e.length;l++){const p=e[l];c?(c=!1,n+=p):"\\"!==p?"'"!==p||o||a||i||u?'"'!==p||s||a||i||u?s||o?n+=p:("["===p?a++:"]"===p?a--:"{"===p?i++:"}"===p?i--:"("===p?u++:")"===p&&u--,t.includes(p)&&0===a&&0===i&&0===u?"+"!=p||"+"==p&&"+"!=e[l-1]&&"+"!=e[l+1]?(n.trim()&&r.push(n.trim()),r.push(p),n=""):("+"==p&&"+"==e[l+1]&&(r.push(n.trim()),n=""),n+=p,"+"==p&&"+"==e[l-1]&&(r.push(n.trim()),n="")):n+=p):(c||(o=!o),n+=p):(c||(s=!s),n+=p):(c=!0,n+=p)}return n.trim()&&r.push(n.trim()),r},splitComparsion(e){const t=/(==|!=|~=|:=|>=|<=)/,r=[];let n="",s=!1,o=!1,a=0,i=0,u=0;for(let c=0;c<e.length;c++){const l=e[c],p=e[c+1],f=e[c-1];"'"!==l||o||"\\"===f&&"'"===l||a||i||u?'"'!==l||s||"\\"===f&&'"'===l||a||i||u||(o=!o):s=!s,s||o||("["===l?a++:"]"===l?a--:"{"===l?i++:"}"===l?i--:"("===l?u++:")"===l&&u--),!t.test(l+p)||s||o||0!==a||0!==i||0!==u?![">","<"].includes(l)||s||o||0!==a||0!==i||0!==u?n+=l:(n.trim()&&r.push(n.trim()),r.push(l),n=""):(n.trim()&&r.push(n.trim()),r.push(l+p),n="",c++)}return n.trim()&&r.push(n.trim()),r},splitStatement(e){const t=[];let r="",n=0,s=0,o=!1,a="",i=0;for(;i<e.length;){const u=e[i],c=e[i-1];'"'!==u&&"'"!==u||"\\"===c||(o?u===a&&(o=!1):(o=!0,a=u)),o?r+=u:"("===u?(s++,r+=u):")"===u?(s--,r+=u):"{"===u?(0===s&&0===n&&r.trim()&&(t.push(r.trim()),r=""),r+=u,n++):"}"===u?(n--,r+=u,0===s&&0===n&&r.trim()&&(t.push(r.trim()),r="")):";"===u&&0===n&&0===s?(t.push(r.trim()),r=""):r+=u,i++}return r.trim()&&t.push(r.trim()),t},splitSegment(e){let t=[],r="",n=!1,s=!1,o=0,a=0,i=0,u=-1;for(let c of e){u++;const l="\\"===(u>0?e[u-1]:null);if('"'!==c||n||l||(s=!s),"'"!==c||s||l||(n=!n),n||s)r+=c;else switch(c){case"{":i++,r+=c;break;case"}":i--,r+=c,0===o&&0===i&&0===a&&"("!==e[u+1]&&r&&(t.push(r.trim()),r="");break;case"[":a++,r+=c;break;case"]":a--,r+=c;break;case"(":o++,r+=c;break;case")":o--,r+=c;break;case";":0===o&&0===i&&0===a?r&&(t.push(r.trim()),r=""):r+=c;break;default:r+=c}}return r&&t.push(r.trim()),t},splitAssignment(e){let t=[],r="",n=!1,s=!1,o=!0,a=0,i=0,u=0,c=["+","-","*","/"],l=c.concat("="),p=-1;for(let f of e){p++;const m="\\"===(p>0?e[p-1]:null);if('"'!==f||n||m||(s=!s),"'"!==f||s||m||(n=!n),n||s)r+=f;else switch(f){case"{":u++,r+=f;break;case"}":u--,r+=f,0===a&&0===u&&0===i&&r&&(t.push(r.trim()),r="");break;case"[":i++,r+=f;break;case"]":i--,r+=f;break;case"(":a++,r+=f;break;case")":a--,r+=f;break;case"=":if(0===a&&0===u&&0===i&&o&&c.includes(e[p-1])&&o&&!c.includes(f)){r+=f,t.push(r.trim()),r="",o=!1;continue}0!==a||0!==u||0!==i||!o||l.includes(e[p+1])||l.includes(e[p-1])?r+=f:(c.includes(e[p-1])?(r+=f,r&&t.push(r.trim()),r=""):(r.trim()&&t.push(r.trim()),t.push(f),r=""),o=!1);break;default:c.includes(e[p+1])&&l.includes(e[p+2])&&o&&(r.trim()&&t.push(r.trim()),r=""),r+=f}}return r&&t.push(r.trim()),t},splitByFirstSpace(e){const t=(e=e.trim()).indexOf(" ");if(-1===t)return[e];return[e.slice(0,t),e.slice(t+1)]},splitCharedCommand(e,t){const r=[];let n="",s=!1,o=!1,a=0,i=0,u=0,c=!1;for(let l=0;l<e.length;l++){const p=e[l];if(c)n+=p,c=!1;else if("\\"!==p)if('"'!==p||o||0!==a||0!==i||0!==u)if("'"!==p||s||0!==a||0!==i||0!==u){if(!s&&!o){if("("===p){a++,n+=p;continue}if("{"===p){i++,n+=p;continue}if("["===p){u++,n+=p;continue}if(")"===p&&a>0){a--,n+=p;continue}if("}"===p&&i>0){i--,n+=p;continue}if("]"===p&&u>0){u--,n+=p;continue}}p!==t||s||o||0!==a||0!==i||0!==u?n+=p:n.length>0&&(r.push(n.trim()),n="")}else o=!o,n+=p;else s=!s,n+=p;else c=!0,n+=p}return n.length>0&&r.push(n.trim()),r},splitCommand(e){const t=[];let r="",n=!1,s="",o=0,a=0,i=0,u=!1;for(let c=0;c<e.length;c++){const l=e[c];u?(r+=l,u=!1):"\\"!==l?n?(r+=l,l===s&&(n=!1)):'"'===l||"'"===l?(n=!0,s=l,r+=l):"("===l?(0===o&&0===a&&0===i?(""!==r&&t.push(r.trim()),r="("):r+="(",o++):")"===l?(o--,0===o&&0===a&&0===i?(r+=")",""!==r&&t.push(r.trim()),r=""):r+=")"):"{"===l?(a++,r+=l):"}"===l?(a--,r+=l,0===o&&0===a&&0===i&&(""!==r&&t.push(r.trim()),r="")):"["===l?(i++,r+=l):"]"===l?(i--,r+=l,0===o&&0===a&&0===i&&(""!==r&&t.push(r.trim()),r="")):r+=l:(u=!0,r+=l)}return""!==r&&t.push(r.trim()),t},splitReferences(e){const t=[];let r="",n=0,s=0,o=0,a=!1,i="";for(let u=0;u<e.length;u++){const c=e[u];a?(r+=c,c===i&&(a=!1)):'"'!==c&&"'"!==c?("("===c&&n++,"{"===c&&s++,"["===c&&o++,")"===c&&n--,"}"===c&&s--,"]"===c&&o--,"["!==c||1!==o?"]"!==c||0!==o?r+=c:(r+=c,0===n&&0===s&&(t.push(r.trim()),r="")):(0===n&&0===s&&""!==r&&(t.push(r.trim()),r=""),r+=c)):(a=!0,i=c,r+=c)}return r.length>0&&t.push(r.trim()),t},splitCommandParams(e){const t=[];let r="",n=!1,s=!1,o=0,a=0,i=0;for(let u=0;u<e.length;u++){const c=e[u];(n||s)&&"\\"===c&&u+1<e.length?(r+=c+e[u+1],u++):'"'!==c||s?"'"!==c||n?"{"!==c||n||s?"}"!==c||n||s?"["!==c||n||s?"]"!==c||n||s?"("!==c||n||s?")"!==c||n||s?","!==c||n||s||o>0||a>0||i>0?r+=c:(t.push(r.trim()),r=""):(i--,r+=c):(i++,r+=c):(a--,r+=c):(a++,r+=c):(o--,r+=c):(o++,r+=c):(s=!s,r+=c):(n=!n,r+=c)}return r&&t.push(r.trim()),t}};function removeStr(e){let t=e.replace(/\\\\n/g,"");return t=t.replace(/\\n/g,"\n"),t.replace(/\uE000/g,"\\n").slice(1,-1)}function removeCurlyBrackets(e){return e.replace(/^\{|\}$/g,"").trim()}function removeSquareBrackets(e){return e.replace(/^\[|\]$/g,"").trim()}function removeBrackets(e){return e.replace(/^\(|\)$/g,"").trim()}function removeComments(e){return e.replace(/(["'])(?:(?=(\\?))\2.)*?\1|\/\/.*|\/\*[\s\S]*?\*\//g,((e,t)=>t?e:""))}function isCurlyBrackets(e){return"string"==typeof e&&("{"==e[0]&&"}"==e[e.length-1])}function isSquareBrackets(e){return"string"==typeof e&&("["==e[0]&&"]"==e[e.length-1])}function isBrackets(e){return"string"==typeof e&&("("==e[0]&&")"==e[e.length-1])}utils={fsl_log(e,t){t||(t="fsl"),console.log("["+t+"] [log] "+e)},fsl_warn(e,t){t||(t="fsl"),console.warn("["+t+"] [warning] "+e)},fsl_error(e,t){t||(t="fsl"),console.error("["+t+"] [error] "+e),process.exit(1)},MD5(e){function t(e,t){var r,n,s,o,a;return s=2147483648&e,o=2147483648&t,a=(1073741823&e)+(1073741823&t),(r=1073741824&e)&(n=1073741824&t)?2147483648^a^s^o:r|n?1073741824&a?3221225472^a^s^o:1073741824^a^s^o:a^s^o}function r(e,r,n,s,o,a,i){return e=t(e,t(t(r&n|~r&s,o),i)),t(e<<a|e>>>32-a,r)}function n(e,r,n,s,o,a,i){return e=t(e,t(t(r&s|n&~s,o),i)),t(e<<a|e>>>32-a,r)}function s(e,r,n,s,o,a,i){return e=t(e,t(t(r^n^s,o),i)),t(e<<a|e>>>32-a,r)}function o(e,r,n,s,o,a,i){return e=t(e,t(t(n^(r|~s),o),i)),t(e<<a|e>>>32-a,r)}function a(e){var t,r="",n="";for(t=0;3>=t;t++)r+=(n="0"+(n=e>>>8*t&255).toString(16)).substr(n.length-2,2);return r}var i,u,c,l,p,f,m,g,d;for(e=function(e){e=e.replace(/\r\n/g,"\n");for(var t="",r=0;r<e.length;r++){var n=e.charCodeAt(r);128>n?t+=String.fromCharCode(n):(127<n&&2048>n?t+=String.fromCharCode(n>>6|192):(t+=String.fromCharCode(n>>12|224),t+=String.fromCharCode(n>>6&63|128)),t+=String.fromCharCode(63&n|128))}return t}(e),i=function(e){for(var t,r=e.length,n=16*(((t=r+8)-t%64)/64+1),s=Array(n-1),o=0,a=0;a<r;)o=a%4*8,s[t=(a-a%4)/4]|=e.charCodeAt(a)<<o,a++;return s[t=(a-a%4)/4]|=128<<a%4*8,s[n-2]=r<<3,s[n-1]=r>>>29,s}(e),f=1732584193,m=4023233417,g=2562383102,d=271733878,e=0;e<i.length;e+=16)u=f,c=m,l=g,p=d,f=r(f,m,g,d,i[e+0],7,3614090360),d=r(d,f,m,g,i[e+1],12,3905402710),g=r(g,d,f,m,i[e+2],17,606105819),m=r(m,g,d,f,i[e+3],22,3250441966),f=r(f,m,g,d,i[e+4],7,4118548399),d=r(d,f,m,g,i[e+5],12,1200080426),g=r(g,d,f,m,i[e+6],17,2821735955),m=r(m,g,d,f,i[e+7],22,4249261313),f=r(f,m,g,d,i[e+8],7,1770035416),d=r(d,f,m,g,i[e+9],12,2336552879),g=r(g,d,f,m,i[e+10],17,4294925233),m=r(m,g,d,f,i[e+11],22,2304563134),f=r(f,m,g,d,i[e+12],7,1804603682),d=r(d,f,m,g,i[e+13],12,4254626195),g=r(g,d,f,m,i[e+14],17,2792965006),f=n(f,m=r(m,g,d,f,i[e+15],22,1236535329),g,d,i[e+1],5,4129170786),d=n(d,f,m,g,i[e+6],9,3225465664),g=n(g,d,f,m,i[e+11],14,643717713),m=n(m,g,d,f,i[e+0],20,3921069994),f=n(f,m,g,d,i[e+5],5,3593408605),d=n(d,f,m,g,i[e+10],9,38016083),g=n(g,d,f,m,i[e+15],14,3634488961),m=n(m,g,d,f,i[e+4],20,3889429448),f=n(f,m,g,d,i[e+9],5,568446438),d=n(d,f,m,g,i[e+14],9,3275163606),g=n(g,d,f,m,i[e+3],14,4107603335),m=n(m,g,d,f,i[e+8],20,1163531501),f=n(f,m,g,d,i[e+13],5,2850285829),d=n(d,f,m,g,i[e+2],9,4243563512),g=n(g,d,f,m,i[e+7],14,1735328473),f=s(f,m=n(m,g,d,f,i[e+12],20,2368359562),g,d,i[e+5],4,4294588738),d=s(d,f,m,g,i[e+8],11,2272392833),g=s(g,d,f,m,i[e+11],16,1839030562),m=s(m,g,d,f,i[e+14],23,4259657740),f=s(f,m,g,d,i[e+1],4,2763975236),d=s(d,f,m,g,i[e+4],11,1272893353),g=s(g,d,f,m,i[e+7],16,4139469664),m=s(m,g,d,f,i[e+10],23,3200236656),f=s(f,m,g,d,i[e+13],4,681279174),d=s(d,f,m,g,i[e+0],11,3936430074),g=s(g,d,f,m,i[e+3],16,3572445317),m=s(m,g,d,f,i[e+6],23,76029189),f=s(f,m,g,d,i[e+9],4,3654602809),d=s(d,f,m,g,i[e+12],11,3873151461),g=s(g,d,f,m,i[e+15],16,530742520),f=o(f,m=s(m,g,d,f,i[e+2],23,3299628645),g,d,i[e+0],6,4096336452),d=o(d,f,m,g,i[e+7],10,1126891415),g=o(g,d,f,m,i[e+14],15,2878612391),m=o(m,g,d,f,i[e+5],21,4237533241),f=o(f,m,g,d,i[e+12],6,1700485571),d=o(d,f,m,g,i[e+3],10,2399980690),g=o(g,d,f,m,i[e+10],15,4293915773),m=o(m,g,d,f,i[e+1],21,2240044497),f=o(f,m,g,d,i[e+8],6,1873313359),d=o(d,f,m,g,i[e+15],10,4264355552),g=o(g,d,f,m,i[e+6],15,2734768916),m=o(m,g,d,f,i[e+13],21,1309151649),f=o(f,m,g,d,i[e+4],6,4149444226),d=o(d,f,m,g,i[e+11],10,3174756917),g=o(g,d,f,m,i[e+2],15,718787259),m=o(m,g,d,f,i[e+9],21,3951481745),f=t(f,u),m=t(m,c),g=t(g,l),d=t(d,p);return(a(f)+a(m)+a(g)+a(d)).toLowerCase()},randomStr(e=10){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";let r="";for(let n=0;n<e;n++)r+=t.charAt(Math.floor(62*Math.random()));return r},Object_merge(e,t){if("object"!=typeof e||"object"!=typeof t)return t;{let r=Object_clone(e);for(let n in t)t.hasOwnProperty(n)&&("object"==typeof t[n]?r[n]=Object_merge(e[n],t[n]):r[n]=t[n]);return r}},Object_clone(e){if(null===e)return null;if("object"==typeof e){if(Array.isArray(e))return e.map((e=>Object_clone(e)));if(e instanceof RegExp)return new RegExp(e);{let t={};for(let r in e)e.hasOwnProperty(r)&&(t[r]=Object_clone(e[r]));return t}}return e},Object_isSame(e,t){if("object"!=typeof e||"object"!=typeof t)return!1;{if(e===t)return!0;let r=Object.keys(e),n=Object.keys(t);if(r.length!==n.length)return!1;for(let s of n){if(!r.includes(s))return!1;let n=typeof e[s],o=typeof t[s];if(n!==o)return!1;if("object"===n&&"object"===o){if(!Object_isSame(e[s],t[s]))return!1}else if(e[s]!==t[s])return!1}return!0}}};const isNumeric=e=>/^[+-]?\d+(\.\d+)?$/.test(e);function isValidVariableFormat(e){return/^[A-Za-z0-9_@#]+$/.test(e)}function isValidFunctionFormat(e){return/^[A-Za-z0-9_.@#]+$/.test(e)}function isValidDefinitionFormat(e){return/^[A-Za-z0-9_.@# ]+$/.test(e)}function isValidAssignFormat(e){return/^[A-Za-z0-9_.@#\[\]\" ]+$/.test(e)}const spacedCommandsHighPriority=["return"];function generateAst(e){return generateAstSegment(e)}function generateAstSegment(e){var t={content:[]};const r=splitters.splitSegment(e);for(let e=0;e<r.length;e++){const n=generateAstNode(removeComments(r[e]));if(n)if("function"===n.type)Object.keys(t).includes("functions")||(t.functions={}),delete n.type,t.functions[n.hash]=n;else t.content.push(n)}return t}function generateAstNode(e){const t=splitters.splitCommand(e),r=splitters.splitCharedCommand(e," "),n=splitters.splitLogic(e),s=splitters.splitComparsion(e),o=splitters.splitOperators(e),a=splitters.splitCharedCommand(e,"."),i=splitters.splitAssignment(e);if(!e)return null;if(r.length>1&&spacedCommandsHighPriority.includes(r[0]))return{type:"spaced command",name:r.shift(),data:generateAstNode(r.join(" "))};if(3==i.length){const e={"=":"set","+=":"inc_by","-=":"dec_by","++":"inc","--":"dec"}[i[1]];if(e)return{type:"assignment",key:generateAstPath(i[0]),assignment:e,value:generateAstNode(i[2])}}if(3==t.length){const r=splitters.splitCharedCommand(t[0]," ");if(!isBrackets(t[0])&&isBrackets(t[1])&&isCurlyBrackets(t[2])&&"fn"==r[0]&&isValidVariableFormat(r[1]))return{type:"function",key:r[1],args:splitters.splitCommandParams(removeBrackets(t[1])).map((e=>{const t=splitters.splitCharedCommand(e," ");if(1==t.length&&isValidVariableFormat(t[0]))return{name:t[0],type:"any"};const r=splitters.splitAssignment(e);if(3==r.length&&isValidVariableFormat(r[0])&&"="==r[1])return{name:r[0],type:"any",default:generateAstNode(r[2])};let n=t.shift();if(isSquareBrackets(n))n=splitters.splitCommandParams(removeSquareBrackets(n));else if(!isValidVariableFormat(n))return console.warn("unknown type "+n),null;const s=t.join(" ");if(1==t.length&&isValidVariableFormat(t[0]))return{name:t[0],type:n};const o=splitters.splitAssignment(s);return 3==o.length&&isValidVariableFormat(o[0])&&"="==o[1]?{name:o[0],type:n,default:generateAstNode(o[2])}:void 0})),content:generateAstSegment(removeCurlyBrackets(t[2])),hash:utils.MD5(e)}}if(t.length>1){const e=t,r=e.pop();if(isBrackets(r)&&isValidFunctionFormat(e.join("")))return{type:"execution",key:generateAstNode(e.join("")),args:generateAstParams(removeBrackets(r))}}if(n.length>1){const e={"||":"or","&&":"and"};if(Object.keys(e).includes(n[n.length-2]))return{type:"logic",b:generateAstNode(n.pop()),operator:e[n.pop()],a:generateAstNode(n.join(" "))}}if(3==s.length){const e={"==":"equal","!=":"not_equal","~=":"string_equal",":=":"type_equal",">":"greater","<":"smaller",">=":"greater_equal","<=":"smaller_equal"};if(Object.keys(e).includes(s[1]))return{type:"comparison",comparison:e[s[1]],a:generateAstNode(s[0]),b:generateAstNode(s[2])}}if(o.length>1){const e=generateAstNode(o.pop());return{type:"operator",operator:o.pop(),a:generateAstNode(o.join(" ")),b:e}}if(r.length>1&&isValidVariableFormat(r[0]))return{type:"spaced command",name:r.shift(),data:generateAstNode(r.join(" "))};if(isNumeric(e))return{type:"literal",data:[Number(e),"number"]};if(a.length>1){const e=splitters.splitCommand(a.pop());if(2==e.length&&!isBrackets(e[0])&&!isSquareBrackets(e[0])&&!isCurlyBrackets(e[0])&&isBrackets(e[1])&&!isSquareBrackets(e[1])&&!isCurlyBrackets(e[1]))return{type:"method",key:e[0],args:generateAstParams(removeBrackets(e[1])),value:generateAstNode(a.join("."))}}if('"'==e[0]&&'"'==e[e.length-1]||"'"==e[0]&&"'"==e[e.length-1])return{type:"literal",data:[removeStr(e),"string"]};const u={true:[!0,"bool"],false:[!1,"bool"]};return Object.keys(u).includes(e)?{type:"literal",data:u[e]}:isValidVariableFormat(e)?{type:"reference",key:e}:isBrackets(e)?generateAstNode(removeBrackets(e)):(utils.fsl_error("unknown node '"+e+"'"),{type:"empty"})}function generateAstParams(e){let t=[];const r=splitters.splitCommandParams(e);for(let e=0;e<r.length;e++){const n=r[e];t.push(generateAstNode(n))}return t}function generateAstPath(e){let t=[],r=e;for(;r;){const e=splitters.splitReferences(r);if(e.length>1&&isSquareBrackets(e[e.length-1])){const n=generateAstNode(removeSquareBrackets(e.pop()));t.push(n),r=e.join()}else{const e=splitters.splitCharedCommand(r,".");e.length>1?(t.push({type:"literal",data:[e.pop(),"string"]}),r=e.join(".")):(t.push({type:"reference",key:r}),r="")}}return console.log(t.reverse()),t.reverse()}let{randomStr:randomStr,Object_merge:Object_merge,Object_isSame:Object_isSame}=utils;var scopes={},functions={},funcCacheKey={};function runAst(e,t="main",r=[],n=!1){const s=randomStr();if(n){const t=runSegmentFunc(e,"",r,s);if("null"!=t[1]&&"segmentNull"!=t[0])return t}return runSegmentFunc(e,t,r,s)}function runSegmentFunc(e,t,r=[],n){if(!Object.keys(scopes).includes(n)){let t=getDefaultScope();if(Object.keys(e).includes("functions")){const r=Object.keys(e.functions),n=Object.values(e.functions);for(let e=0;e<r.length;e++){const s=r[e],o=n[e].key;t.variables[o]=[{type:"ref",data:s},"function"],functions[s]=n[e]}}scopes[n]=t}if(""==t&&Object.keys(e).includes("content"))return runSegment(e.content,n);if(Object.keys(e).includes("functions")){const s=Object.keys(e.functions),o=Object.values(e.functions);let a="";for(let e=0;e<s.length;e++){const n=s[e];funcMatches(o[e],t,r)&&(a=n)}if(a){const t=e.functions[a];let s=scopes[n];for(let e=0;e<t.args.length;e++){const o=t.args[e],a=r[e];s.variables[o.name]=a||runNode(o.default,n)}return scopes[n]=s,runSegment(t.content.content,n)}}return["functionNull","null"]}function runSegment(e,t){for(let r=0;r<e.length;r++){const n=runNode(e[r],t);if("object"==typeof n&&!Array.isArray(n)&&n)return n.data}return["segmentNull","null"]}function runNodes(e,t){let r=[];for(let n=0;n<e.length;n++)r.push(runNode(e[n],t));return r}function runNode(e,t){switch(e.type){case"execution":return runExecution(runNode(e.key,t),runNodes(e.args,t),t);case"literal":return e.data;case"reference":const r=scopes[t].variables;return Object.keys(r).includes(e.key)||error(e.key,"is not defined."),r[e.key];case"function":return[{type:"def",data:e}];case"spaced command":return"return"===e.name?{data:runNode(e.data,t)}:void error("unknown spaced command type",e.name);case"operator":return runMath(e.operator,runNode(e.a,t),runNode(e.b,t));case"comparison":return runComparison(e.comparison,runNode(e.a,t),runNode(e.b,t));case"logic":const n=castType(runNode(e.a,t),"bool"),s=castType(runNode(e.b,t),"bool");switch(e.operator){case"or":return[n[0]||s[0],"bool"];case"and":return[n[0]&&s[0],"bool"];default:error("unknown logic operator",e.operator)}break;case"assignment":break;default:return error("unknown node type '"+e.type+"'"),["null","null"]}}function runExecution(e,t,r){if("function"===e[1])switch(e[0].type){case"js":return e[0].data(t,r);case"ref":const n=functions[e[0].data];return runSegmentFunc({functions:[n]},n.key,t,randomStr());default:error("unknown function type",e[0].type)}else error("cannot run",e[1]);return["null","null"]}function runMath(e,t,r){switch(e){case"+":try{const e=castType(t,"number",!0),n=castType(r,"number",!0);return[e[0]+n[0],"number"]}catch{}return[castType(t,"string")[0]+" "+castType(r,"string")[0],"string"];case"++":return[castType(t,"string")[0]+castType(r,"string")[0],"string"];case"-":try{const e=castType(t,"number",!0),n=castType(r,"number",!0);return[e[0]-n[0],"number"]}catch(e){}error("cannot subtract",t[1],"by",r[1]);case"*":try{const e=castType(t,"number",!0),n=castType(r,"number",!0);return[e[0]*n[0],"number"]}catch{}try{const e=castType(t,"string",!0),n=castType(r,"number",!0);return[e[0].repeat(n[0]),"string"]}catch{}error("cannot multiply",t[1],"by",r[1]);case"/":try{const e=castType(t,"number",!0),n=castType(r,"number",!0);return[e[0]/n[0],"number"]}catch(e){}error("cannot divide",t[1],"by",r[1]);default:error("unknown operator",e)}return["null","null"]}function runComparison(e,t,r){switch(e){case"equal":return[t[0]==r[0]&&typeEqual(t[1],r[1]),"bool"];case"not_equal":return[!(t[0]==r[0]&&typeEqual(t[1],r[1])),"bool"];case"string_equal":return t=castType(t,"string"),r=castType(r,"string"),[t[0]==r[0],"bool"];case"type_equal":return[t[1]==r[1],"bool"];case"greater":return t=castType(t,"number"),r=castType(r,"number"),[t[0]>r[0],"bool"];case"smaller":return t=castType(t,"number"),r=castType(r,"number"),[t[0]<r[0],"bool"];case"greater_equal":return t=castType(t,"number"),r=castType(r,"number"),[t[0]>=r[0],"bool"];case"smaller_equal":return t=castType(t,"number"),r=castType(r,"number"),[t[0]<=r[0],"bool"];default:error("unknown comparison",e)}}function typeEqual(e,t){return"any"==e||"any"==t||e==t}function typesEqual(e,t){for(let r=0;r<e.length;r++)if(typeEqual(e[r],t))return!0;return!1}function castType(e,t,r=!1){if(!Array.isArray(e))return["null","null"];if(e[1]==t)return e;switch(t){case"string":return"object"==typeof e[1]?[JSON.stringify(e),"string"]:[e[0].toString(),"string"];case"number":if("string"==typeof e[1]&&isNumeric(e[0]))return[Number(e[0]),"number"];default:r||error("cannot cast to",t)}}function funcMatches(e,t,r){if(e.key!=t)return!1;if(0==e.args.length&&0==r.length)return!0;if(r.length>e.args.length)return!1;for(let t=0;t<e.args.length;t++)if(t>=r.length){if(!Object.keys(e.args[t]).includes("default"))return!1}else{const n=r[t];if(!Array.isArray(n))return error("invalid passed in arg",n),!1;if(!argMatches(e.args[t],n))return!1}return!0}function argMatches(e,t){if(Array.isArray(e.type)){if(!typesEqual(e.type,t[1]))return!1}else if(!typeEqual(e.type,t[1]))return!1;return!0}function getDefaultScope(){return{variables:{print:[{type:"js",data:function(e,t){return console.log(...e.map((e=>formatString(e)))),["null","null"]}},"function"],type:[{type:"js",data:function(e,t){return[e[0][1],"string"]}},"function"]}}}function error(...e){console.error(...e)}function formatString(e){return castType(e,"string")[0]}console.log(runAst(generateAst('print("hello world")'),"main",[],!0));
