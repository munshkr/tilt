(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{"/0+H":function(e,t,n){"use strict";t.__esModule=!0,t.isInAmpMode=a,t.useAmp=function(){return a(o.default.useContext(i.AmpStateContext))};var r,o=(r=n("q1tI"))&&r.__esModule?r:{default:r},i=n("lwAK");function a(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.ampFirst,n=void 0!==t&&t,r=e.hybrid,o=void 0!==r&&r,i=e.hasQuery;return n||o&&(void 0!==i&&i)}},"2qu3":function(e,t,n){"use strict";var r=n("lSNA"),o=n("lwsE"),i=n("W8MJ");function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function u(e,t){var n;if("undefined"===typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(n=function(e,t){if(!e)return;if("string"===typeof e)return c(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return c(e,t)}(e))||t&&e&&"number"===typeof e.length){n&&(e=n);var r=0,o=function(){};return{s:o,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(e){throw e},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,s=!1;return{s:function(){n=e[Symbol.iterator]()},n:function(){var e=n.next();return a=e.done,e},e:function(e){s=!0,i=e},f:function(){try{a||null==n.return||n.return()}finally{if(s)throw i}}}}function c(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}t.__esModule=!0,t.default=void 0;var l,f=(l=n("q1tI"))&&l.__esModule?l:{default:l},d=n("8L3h"),h=n("jwwS");var p=[],y=[],m=!1;function v(e){var t=e(),n={loading:!0,loaded:null,error:null};return n.promise=t.then((function(e){return n.loading=!1,n.loaded=e,e})).catch((function(e){throw n.loading=!1,n.error=e,e})),n}function _(e){var t={loading:!1,loaded:{},error:null},n=[];try{Object.keys(e).forEach((function(r){var o=v(e[r]);o.loading?t.loading=!0:(t.loaded[r]=o.loaded,t.error=o.error),n.push(o.promise),o.promise.then((function(e){t.loaded[r]=e})).catch((function(e){t.error=e}))}))}catch(r){t.error=r}return t.promise=Promise.all(n).then((function(e){return t.loading=!1,e})).catch((function(e){throw t.loading=!1,e})),t}function g(e,t){return f.default.createElement(function(e){return e&&e.__esModule?e.default:e}(e),t)}function b(e,t){var n=Object.assign({loader:null,loading:null,delay:200,timeout:null,render:g,webpack:null,modules:null},t),r=null;function o(){if(!r){var t=new w(e,n);r={getCurrentValue:t.getCurrentValue.bind(t),subscribe:t.subscribe.bind(t),retry:t.retry.bind(t),promise:t.promise.bind(t)}}return r.promise()}if(!m&&"function"===typeof n.webpack){var i=n.webpack();y.push((function(e){var t,n=u(i);try{for(n.s();!(t=n.n()).done;){var r=t.value;if(-1!==e.indexOf(r))return o()}}catch(a){n.e(a)}finally{n.f()}}))}var a=function(e,t){o();var i=f.default.useContext(h.LoadableContext),a=(0,d.useSubscription)(r);return f.default.useImperativeHandle(t,(function(){return{retry:r.retry}}),[]),i&&Array.isArray(n.modules)&&n.modules.forEach((function(e){i(e)})),f.default.useMemo((function(){return a.loading||a.error?f.default.createElement(n.loading,{isLoading:a.loading,pastDelay:a.pastDelay,timedOut:a.timedOut,error:a.error,retry:r.retry}):a.loaded?n.render(a.loaded,e):null}),[e,a])};return a.preload=function(){return o()},a.displayName="LoadableComponent",f.default.forwardRef(a)}var w=function(){function e(t,n){o(this,e),this._loadFn=t,this._opts=n,this._callbacks=new Set,this._delay=null,this._timeout=null,this.retry()}return i(e,[{key:"promise",value:function(){return this._res.promise}},{key:"retry",value:function(){var e=this;this._clearTimeouts(),this._res=this._loadFn(this._opts.loader),this._state={pastDelay:!1,timedOut:!1};var t=this._res,n=this._opts;t.loading&&("number"===typeof n.delay&&(0===n.delay?this._state.pastDelay=!0:this._delay=setTimeout((function(){e._update({pastDelay:!0})}),n.delay)),"number"===typeof n.timeout&&(this._timeout=setTimeout((function(){e._update({timedOut:!0})}),n.timeout))),this._res.promise.then((function(){e._update({}),e._clearTimeouts()})).catch((function(t){e._update({}),e._clearTimeouts()})),this._update({})}},{key:"_update",value:function(e){this._state=s(s({},this._state),{},{error:this._res.error,loaded:this._res.loaded,loading:this._res.loading},e),this._callbacks.forEach((function(e){return e()}))}},{key:"_clearTimeouts",value:function(){clearTimeout(this._delay),clearTimeout(this._timeout)}},{key:"getCurrentValue",value:function(){return this._state}},{key:"subscribe",value:function(e){var t=this;return this._callbacks.add(e),function(){t._callbacks.delete(e)}}}]),e}();function S(e){return b(v,e)}function k(e,t){for(var n=[];e.length;){var r=e.pop();n.push(r(t))}return Promise.all(n).then((function(){if(e.length)return k(e,t)}))}S.Map=function(e){if("function"!==typeof e.render)throw new Error("LoadableMap requires a `render(loaded, props)` function");return b(_,e)},S.preloadAll=function(){return new Promise((function(e,t){k(p).then(e,t)}))},S.preloadReady=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return new Promise((function(t){var n=function(){return m=!0,t()};k(y,e).then(n,n)}))},window.__NEXT_PRELOADREADY=S.preloadReady;var C=S;t.default=C},"3niX":function(e,t,n){"use strict";t.__esModule=!0,t.flush=function(){var e=i.cssRules();return i.flush(),e},t.default=void 0;var r,o=n("q1tI");var i=new(((r=n("SevZ"))&&r.__esModule?r:{default:r}).default),a=function(e){var t,n;function r(t){var n;return(n=e.call(this,t)||this).prevProps={},n}n=e,(t=r).prototype=Object.create(n.prototype),t.prototype.constructor=t,t.__proto__=n,r.dynamic=function(e){return e.map((function(e){var t=e[0],n=e[1];return i.computeId(t,n)})).join(" ")};var o=r.prototype;return o.shouldComponentUpdate=function(e){return this.props.id!==e.id||String(this.props.dynamic)!==String(e.dynamic)},o.componentWillUnmount=function(){i.remove(this.props)},o.render=function(){return this.shouldComponentUpdate(this.prevProps)&&(this.prevProps.id&&i.remove(this.prevProps),i.add(this.props),this.prevProps=this.props),null},r}(o.Component);t.default=a},"5MxS":function(e,t,n){"use strict";(function(){var t=function(e,t,n){var r={},o=!1,i=function(e){try{console.log("lzwCompress: "+(new Date).toISOString()+" : "+("object"===typeof e?t.stringify(e):e))}catch(n){}};!function(e,t,n){var r=[],a=function(e){return function(t){return t===e}},s=function(e,t,n){(function(e,t){for(var n=0;n<e.length;n++)if(t(e[n]))return!0;return!1})(e,n)||e.push(t)},u=function(e){if("object"===typeof e)for(var n in e)t.isArray(e)||s(r,n,a(n)),u(e[n])},c=function(e){if("object"!==typeof e)return e;for(var n in e)t.isArray(e)?e[n]=c(e[n]):e.hasOwnProperty(n)&&(e[r.indexOf(n)]=c(e[n]),delete e[n]);return e},l=function(e){if("object"!==typeof e)return e;for(var n in e)t.isArray(e)?e[n]=l(e[n]):e.hasOwnProperty(n)&&r[n]&&(e[r[n]]=l(e[n]),delete e[n]);return e};e.KeyOptimize={pack:function(e){r=[];var t=n.parse(e);return u(t),o&&i("keys length : "+r.length),o&&i("keys        : "+r),n.stringify({__k:r,__v:c(t)})},unpack:function(e){var t=e;return"object"!==typeof t?e:t.hasOwnProperty("__k")?(r=t.__k,l(t.__v)):n.stringify(t)}}}(r,e,t),function(e,t){e.LZWCompress={pack:function(e){if("string"!==typeof e)return e;var t,n,r,o={},i="",a=[],s=256;for(t=0;t<256;t+=1)o[String.fromCharCode(t)]=t;for(t=0;t<e.length;t+=1)if(o[r=i+(n=e.charAt(t))])i=r;else{if(void 0===o[i])return e;a.push(o[i]),o[r]=s++,i=String(n)}return""!==i&&a.push(o[i]),a},unpack:function(e){if(!t.isArray(e))return e;var n,r,o,i,a=[],s="",u=256;for(n=0;n<256;n+=1)a[n]=String.fromCharCode(n);for(o=r=String.fromCharCode(e[0]),n=1;n<e.length;n+=1){if(a[i=e[n]])s=a[i];else{if(i!==u)return null;s=r+r.charAt(0)}o+=s,a[u++]=r+s.charAt(0),r=s}return o}}}(r,e);return{pack:function(e){if(o&&i("original (uncompressed) : "+e),!e||!0===e||e instanceof Date)return e;var n=e;"object"===typeof e&&(n=r.KeyOptimize.pack(t.stringify(e)),o&&i("key optimized: "+n));var a=r.LZWCompress.pack(n);return o&&i("packed   (compressed)   : "+a),a},unpack:function(e){if(o&&i("original (compressed)   : "+e),!e||!0===e||e instanceof Date)return e;var n,a=r.LZWCompress.unpack(e);try{n=t.parse(a)}catch(s){return o&&i("unpacked (uncompressed) : "+a),a}return"object"===typeof n&&(a=r.KeyOptimize.unpack(n)),o&&i("unpacked (uncompressed) : "+a),a},enableLogging:function(e){o=e}}}(Array,JSON);e.exports?e.exports=t:this.lzwCompress=t}).call(this)},"8Kt/":function(e,t,n){"use strict";t.__esModule=!0,t.defaultHead=c,t.default=void 0;var r=u(n("q1tI")),o=u(n("Xuae")),i=n("lwAK"),a=n("FYa8"),s=n("/0+H");function u(e){return e&&e.__esModule?e:{default:e}}function c(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=[r.default.createElement("meta",{charSet:"utf-8"})];return e||t.push(r.default.createElement("meta",{name:"viewport",content:"width=device-width"})),t}function l(e,t){return"string"===typeof t||"number"===typeof t?e:t.type===r.default.Fragment?e.concat(r.default.Children.toArray(t.props.children).reduce((function(e,t){return"string"===typeof t||"number"===typeof t?e:e.concat(t)}),[])):e.concat(t)}var f=["name","httpEquiv","charSet","itemProp"];function d(e,t){return e.reduce((function(e,t){var n=r.default.Children.toArray(t.props.children);return e.concat(n)}),[]).reduce(l,[]).reverse().concat(c(t.inAmpMode)).filter(function(){var e=new Set,t=new Set,n=new Set,r={};return function(o){var i=!0;if(o.key&&"number"!==typeof o.key&&o.key.indexOf("$")>0){var a=o.key.slice(o.key.indexOf("$")+1);e.has(a)?i=!1:e.add(a)}switch(o.type){case"title":case"base":t.has(o.type)?i=!1:t.add(o.type);break;case"meta":for(var s=0,u=f.length;s<u;s++){var c=f[s];if(o.props.hasOwnProperty(c))if("charSet"===c)n.has(c)?i=!1:n.add(c);else{var l=o.props[c],d=r[c]||new Set;d.has(l)?i=!1:(d.add(l),r[c]=d)}}}return i}}()).reverse().map((function(e,t){var n=e.key||t;return r.default.cloneElement(e,{key:n})}))}var h=(0,o.default)();function p(e){var t=e.children;return(r.default.createElement(i.AmpStateContext.Consumer,null,(function(e){return r.default.createElement(a.HeadManagerContext.Consumer,null,(function(n){return r.default.createElement(h,{reduceComponentsToState:d,handleStateChange:n,inAmpMode:(0,s.isInAmpMode)(e)},t)}))})))}p.rewind=h.rewind;var y=p;t.default=y},"8oxB":function(e,t){var n,r,o=e.exports={};function i(){throw new Error("setTimeout has not been defined")}function a(){throw new Error("clearTimeout has not been defined")}function s(e){if(n===setTimeout)return setTimeout(e,0);if((n===i||!n)&&setTimeout)return n=setTimeout,setTimeout(e,0);try{return n(e,0)}catch(t){try{return n.call(null,e,0)}catch(t){return n.call(this,e,0)}}}!function(){try{n="function"===typeof setTimeout?setTimeout:i}catch(e){n=i}try{r="function"===typeof clearTimeout?clearTimeout:a}catch(e){r=a}}();var u,c=[],l=!1,f=-1;function d(){l&&u&&(l=!1,u.length?c=u.concat(c):f=-1,c.length&&h())}function h(){if(!l){var e=s(d);l=!0;for(var t=c.length;t;){for(u=c,c=[];++f<t;)u&&u[f].run();f=-1,t=c.length}u=null,l=!1,function(e){if(r===clearTimeout)return clearTimeout(e);if((r===a||!r)&&clearTimeout)return r=clearTimeout,clearTimeout(e);try{r(e)}catch(t){try{return r.call(null,e)}catch(t){return r.call(this,e)}}}(e)}}function p(e,t){this.fun=e,this.array=t}function y(){}o.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];c.push(new p(e,t)),1!==c.length||l||s(h)},p.prototype.run=function(){this.fun.apply(null,this.array)},o.title="browser",o.browser=!0,o.env={},o.argv=[],o.version="",o.versions={},o.on=y,o.addListener=y,o.once=y,o.off=y,o.removeListener=y,o.removeAllListeners=y,o.emit=y,o.prependListener=y,o.prependOnceListener=y,o.listeners=function(e){return[]},o.binding=function(e){throw new Error("process.binding is not supported")},o.cwd=function(){return"/"},o.chdir=function(e){throw new Error("process.chdir is not supported")},o.umask=function(){return 0}},"9kyW":function(e,t,n){"use strict";e.exports=function(e){for(var t=5381,n=e.length;n;)t=33*t^e.charCodeAt(--n);return t>>>0}},Bnag:function(e,t){e.exports=function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}},BsWD:function(e,t,n){"use strict";n.d(t,"a",(function(){return o}));var r=n("a3WO");function o(e,t){if(e){if("string"===typeof e)return Object(r.a)(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?Object(r.a)(e,t):void 0}}},EbDI:function(e,t){e.exports=function(e){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}},Ijbi:function(e,t,n){var r=n("WkPL");e.exports=function(e){if(Array.isArray(e))return r(e)}},MX0m:function(e,t,n){e.exports=n("3niX")},RIqP:function(e,t,n){var r=n("Ijbi"),o=n("EbDI"),i=n("ZhPi"),a=n("Bnag");e.exports=function(e){return r(e)||o(e)||i(e)||a()}},RNiq:function(e,t,n){"use strict";n.r(t);var r=n("o0o1"),o=n.n(r);function i(e,t,n,r,o,i,a){try{var s=e[i](a),u=s.value}catch(c){return void n(c)}s.done?t(u):Promise.resolve(u).then(r,o)}function a(e){return function(){var t=this,n=arguments;return new Promise((function(r,o){var a=e.apply(t,n);function s(e){i(a,r,o,s,u,"next",e)}function u(e){i(a,r,o,s,u,"throw",e)}s(void 0)}))}}function s(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function u(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function c(e,t,n){return t&&u(e.prototype,t),n&&u(e,n),e}function l(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function f(e,t){return(f=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function d(e){return(d="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function h(e,t){return!t||"object"!==d(t)&&"function"!==typeof t?l(e):t}function p(e){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function y(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var m=n("BsWD");function v(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(e)){var n=[],r=!0,o=!1,i=void 0;try{for(var a,s=e[Symbol.iterator]();!(r=(a=s.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(u){o=!0,i=u}finally{try{r||null==s.return||s.return()}finally{if(o)throw i}}return n}}(e,t)||Object(m.a)(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _(){return(_=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}var g=n("MX0m"),b=n.n(g),w=n("5MxS"),S=n.n(w),k=n("yLiY"),C=n.n(k),j=n("a6RD"),x=n.n(j),O=n("8Kt/"),P=n.n(O),A=n("nOHt"),R=n("q1tI"),T=n.n(R),E=T.a.createElement,F=function(e){var t=e.src,n=e.disabled,r=e.onClick,o=e.onKeyPress;return E("div",{className:b.a.dynamic([["1735491147",[t,t]]])},E("div",{onClick:n?null:r,onKeyPress:n?null:o,className:b.a.dynamic([["1735491147",[t,t]]])+" "+"button ".concat(n?"disabled":"")}),E(b.a,{id:"1735491147",dynamic:[t,t]},[".button.__jsx-style-dynamic-selector{background-color:#000;-webkit-mask:url(".concat(t,") no-repeat center;-webkit-mask:url(").concat(t,") no-repeat center;mask:url(").concat(t,") no-repeat center;-webkit-mask-size:75%;-webkit-mask-size:75%;mask-size:75%;width:48px;height:48px;cursor:pointer;}"),".button.disabled.__jsx-style-dynamic-selector{background-color:#999;}"]))};F.defaultProps={disabled:!1,onClick:null,onKeyPress:null};var I=F,M=T.a.createElement,z=function(e){var t=e.message;return M("div",{className:"jsx-3430682696"},M("div",{className:"jsx-3430682696 error"},M("span",{className:"jsx-3430682696 title"},"Error: "),M("span",{className:"jsx-3430682696 message"},t)),M(b.a,{id:"3430682696"},['.error.jsx-3430682696{position:absolute;left:1em;bottom:1em;padding:0.25em;font-family:Monaco,Menlo,"Ubuntu Mono",Consolas,source-code-pro;color:#fff;background-color:#f00;z-index:1;}',".error.jsx-3430682696 .title.jsx-3430682696{font-weight:bold;}"]))},N=n("17x9"),D=n.n(N),B=T.a.createElement,q=T.a.forwardRef((function(e,t){var n=e.isPlaying;return B("div",{className:b.a.dynamic([["209836104",[n?"":"display: none"]]])},B("canvas",{ref:t,className:b.a.dynamic([["209836104",[n?"":"display: none"]]])}),B(b.a,{id:"209836104",dynamic:[n?"":"display: none"]},["canvas.__jsx-style-dynamic-selector{".concat(n?"":"display: none"," position:absolute;top:0;left:0;width:100vw;height:100vh;z-index:-10;}")]))}));q.propTypes={isPlaying:D.a.bool},q.defaultProps={isPlaying:!1};var L=q,W=function(){function e(t){var n=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:2048,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:400;s(this,e),y(this,"_tick",(function(){n._analyser.getFloatTimeDomainData(n._dataArray),n._tickRafId=requestAnimationFrame(n._tick)})),y(this,"_draw",(function(){if(n._canvas){var e=n._canvas.getContext("2d");e.clearRect(0,0,n._canvas.width,n._canvas.height),e.beginPath();for(var t=0;t<n._dataArray.length;t+=1){var r=t,o=(.5-n._dataArray[t]/2)*n._canvas.height;0===t?e.moveTo(r,o):e.lineTo(r,o)}e.stroke(),n._drawRafId=requestAnimationFrame(n._draw)}})),this.audioContext=t,this.canvasHeight=o,this._analyser=t.createAnalyser(),this._analyser.fftSize=r,this._dataArray=new Float32Array(this._analyser.frequencyBinCount),this._canvas=null}return c(e,[{key:"connectToSynth",value:function(e){this._synth=e,this._synth.connect(this._analyser)}},{key:"disconnectFromSynth",value:function(){this._synth.disconnect(this._analyser)}},{key:"start",value:function(){this._tick(),this._draw()}},{key:"stop",value:function(){cancelAnimationFrame(this._tickRafId),cancelAnimationFrame(this._drawRafId)}},{key:"release",value:function(){this.stop(),this.disconnectFromSynth()}},{key:"canvas",set:function(e){this._canvas=e,this._canvas.width=this._dataArray.length,this._canvas.height=this.canvasHeight}}]),e}(),U=function(){function e(t){s(this,e),this.audioContext=t,this.loaded=!1,this.isPlaying=!1,this.callbacks={},this.gain=.5}return c(e,[{key:"on",value:function(e,t){this.callbacks[e]||(this.callbacks[e]=[]),this.callbacks[e].push(t)}},{key:"emit",value:function(e,t){var n=this.callbacks[e];n&&n.forEach((function(e){return e(t)}))}},{key:"loadWorkletModules",value:function(){var e=a(o.a.mark((function e(){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.audioContext.audioWorklet.addModule("worklets/output-processor.js");case 2:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"play",value:function(){this.isPlaying||(this._initialize(),this._setGainTarget(this.gain),this.isPlaying=!0,this.emit("play"))}},{key:"eval",value:function(e){var t=this,n={type:"code",data:e};this.node?this.node.port.postMessage(n):this.on("load",(function(){t.node.port.postMessage(n)}))}},{key:"stop",value:function(){this.isPlaying&&(this._setGainTarget(0),this.isPlaying=!1,this.emit("stop"))}},{key:"connect",value:function(e){this.gainNode?this.gainNode.connect(e):this.on("load",(function(t){t.gainNode.connect(e)}))}},{key:"disconnect",value:function(e){this.gainNode&&this.gainNode.disconnect(e)}},{key:"_initialize",value:function(){var e=this;if(!this.loaded){this.gainNode=this.audioContext.createGain(),this.gainNode.value=this.gain,this.gainNode.connect(this.audioContext.destination);try{this.node=new AudioWorkletNode(this.audioContext,"output-processor")}catch(t){return void console.error("Failed to create audio worklet node!")}this.node.port.onmessage=function(t){var n=t.data,r=n.type,o=n.data;if("error"!==r)throw new Error("Unhandled message from output processor: ".concat(r));e.emit("error",o)},this.node.onprocessorerror=function(t){console.error("An error occured in the worklet node processor."),e.emit("error",t)},this.node.connect(this.gainNode),this.loaded=!0,this.emit("load",this)}}},{key:"_setGainTarget",value:function(e){this.gainNode.gain.setTargetAtTime(e,this.audioContext.currentTime,.015)}}]),e}(),K=T.a.createElement;function X(e){var t=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=p(e);if(t){var o=p(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return h(this,n)}}var Z=C()().publicRuntimeConfig.assetPrefix,G=x()((function(){return Promise.all([n.e(3),n.e(9)]).then(n.bind(null,"5xW5"))}),{ssr:!1,loading:function(){return K("span",null,"Loading...")},loadableGenerated:{webpack:function(){return["5xW5"]},modules:["../components/Editor"]}}),H="// Define variable o to set audio output, like this:\no = ( ((t<<1)^((t<<1)+(t>>7)&t>>12))|t>>(4-(1^7&(t>>19)))|t>>7 ) %64/64\n",J=function(e){return K(I,_({src:"play.svg"},e))},V=function(e){return K(I,_({src:"stop.svg"},e))},Y=function(e){return K(I,_({src:"share.svg"},e))},$=function(e){var t=S.a.pack(e),n=btoa(t);return"".concat(Z,"/#v=").concat(1,"&c=").concat(n)},Q=function(e){localStorage.setItem("lastContent",e)},ee=function(e){!function(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&f(e,t)}(n,e);var t=X(n);function n(e){var r;return s(this,n),y(l(r=t.call(this,e)),"handleEval",function(){var e=a(o.a.mark((function e(t){var n;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:n=t.getValue(),r.eval(n);case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()),y(l(r),"handleStop",(function(){r.stop()})),y(l(r),"handlePlayButtonClick",(function(){var e=r.state.content;r.eval(e)})),y(l(r),"handleStopButtonClick",(function(){r.stop()})),y(l(r),"handleChange",(function(e){Q(e),r.setState({content:e,error:null})})),y(l(r),"handleShareButtonClick",(function(){var e=r.props.router,t=r.state.content,n=$(t);e.replace(n,n,{shallow:!0})})),r.state={content:H,isPlaying:!1,isFlashing:!1,error:null,oscSupported:!1},r.canvasRef=T.a.createRef(),r}return c(n,[{key:"componentDidMount",value:function(){this.loadContent(),this.checkOscilloscopeSupport()}},{key:"componentWillUnmount",value:function(){this.oscillator&&this.oscillator.release()}},{key:"checkOscilloscopeSupport",value:function(){this.setState({oscSupported:this.isOscSupported()})}},{key:"loadContent",value:function(){var e,t=function(){var e=window.location.hash;return e?(/^[?#]/.test(e)?e.slice(1):e).split("&").reduce((function(e,t){var n=Object.assign({},e),r=v(t.split("="),2),o=r[0],i=r[1];return n[o]=i?decodeURIComponent(i.replace(/\+/g," ")):"",n}),{}):{}}();(e=t.c?this.decodeCode(t.c):localStorage.getItem("lastContent"))&&this.setState({content:e})}},{key:"isOscSupported",value:function(){return!(!!navigator.platform&&/iPad|iPhone|iPod/.test(navigator.platform))}},{key:"flash",value:function(){var e=this;this.setState({isFlashing:!0}),setTimeout((function(){return e.setState({isFlashing:!1})}),500)}},{key:"initialize",value:function(){var e=a(o.a.mark((function e(){var t,n=this;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=this.state.oscSupported,this.audioContext=new(window.AudioContext||window.webkitAudioContext),this.synth=new U(this.audioContext),this.synth.on("error",(function(e){n.setState({error:e.message})})),e.next=6,this.synth.loadWorkletModules();case 6:t&&(this.oscilloscope=new W(this.audioContext),this.oscilloscope.canvas=this.canvasRef.current,this.oscilloscope.connectToSynth(this.synth),this.oscilloscope.start());case 7:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"play",value:function(){var e=a(o.a.mark((function e(){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(this.synth){e.next=3;break}return e.next=3,this.initialize();case 3:this.synth.play(),this.setState({isPlaying:!0});case 5:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"eval",value:function(){var e=a(o.a.mark((function e(t){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(this.synth){e.next=3;break}return e.next=3,this.initialize();case 3:this.synth.eval(t),this.flash(),this.play();case 6:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"stop",value:function(){this.state.isPlaying&&(this.synth&&this.synth.stop(),this.flash(),this.setState({isPlaying:!1}))}},{key:"decodeCode",value:function(e){try{var t=atob(e).split(",").map(parseFloat);return S.a.unpack(t)}catch(n){return this.setState({error:"(Invalid URL) ".concat(n.message)}),null}}},{key:"render",value:function(){var e=this.state,t=e.isPlaying,n=e.isFlashing,r=e.content,o=e.error,i=e.oscSupported;return K("div",{className:"jsx-4120507668 "+((n?"flash":"")||"")},K(P.a,null,K("meta",{name:"viewport",content:"width=device-width, initial-scale=1",className:"jsx-4120507668"}),K("meta",{charSet:"utf-8",className:"jsx-4120507668"}),K("title",{className:"jsx-4120507668"},"Tilt")),K(G,{ref:this.editorRef,onEval:this.handleEval,onStop:this.handleStop,onChange:this.handleChange,content:r}),K("div",{className:"jsx-4120507668 controls"},K(J,{onClick:this.handlePlayButtonClick}),K(V,{onClick:this.handleStopButtonClick,disabled:!t}),K(Y,{onClick:this.handleShareButtonClick})),i&&K(L,{ref:this.canvasRef,isPlaying:t}),o?K(z,{message:o}):"",K(b.a,{id:"4253008610"},["body{background-color:transparent;margin:0;}"]),K(b.a,{id:"1688806847"},[".controls.jsx-4120507668{position:absolute;right:1.5em;bottom:1em;z-index:2;}",".flash.jsx-4120507668{-webkit-animation-name:flash-animation;-webkit-animation-duration:0.2s;-webkit-animation-name:flash-animation-jsx-4120507668;animation-name:flash-animation-jsx-4120507668;-webkit-animation-duration:0.2s;animation-duration:0.2s;}","@-webkit-keyframes flash-animation{from.jsx-4120507668{background:black;}to.jsx-4120507668{background:default;}}","@-webkit-keyframes flash-animation-jsx-4120507668{from{background:black;}to{background:default;}}","@keyframes flash-animation-jsx-4120507668{from{background:black;}to{background:default;}}"]))}}]),n}(T.a.Component);t.default=Object(A.withRouter)(ee)},SevZ:function(e,t,n){"use strict";t.__esModule=!0,t.default=void 0;var r=i(n("9kyW")),o=i(n("bVZc"));function i(e){return e&&e.__esModule?e:{default:e}}var a=function(){function e(e){var t=void 0===e?{}:e,n=t.styleSheet,r=void 0===n?null:n,i=t.optimizeForSpeed,a=void 0!==i&&i,s=t.isBrowser,u=void 0===s?"undefined"!==typeof window:s;this._sheet=r||new o.default({name:"styled-jsx",optimizeForSpeed:a}),this._sheet.inject(),r&&"boolean"===typeof a&&(this._sheet.setOptimizeForSpeed(a),this._optimizeForSpeed=this._sheet.isOptimizeForSpeed()),this._isBrowser=u,this._fromServer=void 0,this._indices={},this._instancesCounts={},this.computeId=this.createComputeId(),this.computeSelector=this.createComputeSelector()}var t=e.prototype;return t.add=function(e){var t=this;void 0===this._optimizeForSpeed&&(this._optimizeForSpeed=Array.isArray(e.children),this._sheet.setOptimizeForSpeed(this._optimizeForSpeed),this._optimizeForSpeed=this._sheet.isOptimizeForSpeed()),this._isBrowser&&!this._fromServer&&(this._fromServer=this.selectFromServer(),this._instancesCounts=Object.keys(this._fromServer).reduce((function(e,t){return e[t]=0,e}),{}));var n=this.getIdAndRules(e),r=n.styleId,o=n.rules;if(r in this._instancesCounts)this._instancesCounts[r]+=1;else{var i=o.map((function(e){return t._sheet.insertRule(e)})).filter((function(e){return-1!==e}));this._indices[r]=i,this._instancesCounts[r]=1}},t.remove=function(e){var t=this,n=this.getIdAndRules(e).styleId;if(function(e,t){if(!e)throw new Error("StyleSheetRegistry: "+t+".")}(n in this._instancesCounts,"styleId: `"+n+"` not found"),this._instancesCounts[n]-=1,this._instancesCounts[n]<1){var r=this._fromServer&&this._fromServer[n];r?(r.parentNode.removeChild(r),delete this._fromServer[n]):(this._indices[n].forEach((function(e){return t._sheet.deleteRule(e)})),delete this._indices[n]),delete this._instancesCounts[n]}},t.update=function(e,t){this.add(t),this.remove(e)},t.flush=function(){this._sheet.flush(),this._sheet.inject(),this._fromServer=void 0,this._indices={},this._instancesCounts={},this.computeId=this.createComputeId(),this.computeSelector=this.createComputeSelector()},t.cssRules=function(){var e=this,t=this._fromServer?Object.keys(this._fromServer).map((function(t){return[t,e._fromServer[t]]})):[],n=this._sheet.cssRules();return t.concat(Object.keys(this._indices).map((function(t){return[t,e._indices[t].map((function(e){return n[e].cssText})).join(e._optimizeForSpeed?"":"\n")]})).filter((function(e){return Boolean(e[1])})))},t.createComputeId=function(){var e={};return function(t,n){if(!n)return"jsx-"+t;var o=String(n),i=t+o;return e[i]||(e[i]="jsx-"+(0,r.default)(t+"-"+o)),e[i]}},t.createComputeSelector=function(e){void 0===e&&(e=/__jsx-style-dynamic-selector/g);var t={};return function(n,r){this._isBrowser||(r=r.replace(/\/style/gi,"\\/style"));var o=n+r;return t[o]||(t[o]=r.replace(e,n)),t[o]}},t.getIdAndRules=function(e){var t=this,n=e.children,r=e.dynamic,o=e.id;if(r){var i=this.computeId(o,r);return{styleId:i,rules:Array.isArray(n)?n.map((function(e){return t.computeSelector(i,e)})):[this.computeSelector(i,n)]}}return{styleId:this.computeId(o),rules:Array.isArray(n)?n:[n]}},t.selectFromServer=function(){return Array.prototype.slice.call(document.querySelectorAll('[id^="__jsx-"]')).reduce((function(e,t){return e[t.id.slice(2)]=t,e}),{})},e}();t.default=a},Xuae:function(e,t,n){"use strict";var r=n("lwsE"),o=n("PJYZ"),i=n("W8MJ"),a=n("7W2i"),s=n("a1gu"),u=n("Nsbk"),c=n("RIqP");function l(e){var t=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=u(e);if(t){var o=u(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return s(this,n)}}t.__esModule=!0,t.default=void 0;var f=n("q1tI"),d=!1;t.default=function(){var e,t=new Set;function n(n){e=n.props.reduceComponentsToState(c(t),n.props),n.props.handleStateChange&&n.props.handleStateChange(e)}return(function(s){a(c,s);var u=l(c);function c(e){var i;return r(this,c),i=u.call(this,e),d&&(t.add(o(i)),n(o(i))),i}return i(c,null,[{key:"rewind",value:function(){var n=e;return e=void 0,t.clear(),n}}]),i(c,[{key:"componentDidMount",value:function(){t.add(this),n(this)}},{key:"componentDidUpdate",value:function(){n(this)}},{key:"componentWillUnmount",value:function(){t.delete(this),n(this)}},{key:"render",value:function(){return null}}]),c}(f.Component))}},a3WO:function(e,t,n){"use strict";function r(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}n.d(t,"a",(function(){return r}))},a6RD:function(e,t,n){"use strict";var r=n("lSNA");function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}t.__esModule=!0,t.noSSR=l,t.default=function(e,t){var n=s.default,r={loading:function(e){e.error,e.isLoading;return e.pastDelay,null}};e instanceof Promise?r.loader=function(){return e}:"function"===typeof e?r.loader=e:"object"===typeof e&&(r=i(i({},r),e));if(r=i(i({},r),t),"object"===typeof e&&!(e instanceof Promise)&&(e.render&&(r.render=function(t,n){return e.render(n,t)}),e.modules)){n=s.default.Map;var o={},a=e.modules();Object.keys(a).forEach((function(e){var t=a[e];"function"!==typeof t.then?o[e]=t:o[e]=function(){return t.then((function(e){return e.default||e}))}})),r.loader=o}r.loadableGenerated&&delete(r=i(i({},r),r.loadableGenerated)).loadableGenerated;if("boolean"===typeof r.ssr){if(!r.ssr)return delete r.ssr,l(n,r);delete r.ssr}return n(r)};var a=u(n("q1tI")),s=u(n("2qu3"));function u(e){return e&&e.__esModule?e:{default:e}}var c=!1;function l(e,t){if(delete t.webpack,delete t.modules,!c)return e(t);var n=t.loading;return function(){return a.default.createElement(n,{error:null,isLoading:!0,pastDelay:!1,timedOut:!1})}}},bVZc:function(e,t,n){"use strict";(function(e){function n(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}t.__esModule=!0,t.default=void 0;var r="undefined"!==typeof e&&e.env&&!0,o=function(e){return"[object String]"===Object.prototype.toString.call(e)},i=function(){function e(e){var t=void 0===e?{}:e,n=t.name,i=void 0===n?"stylesheet":n,s=t.optimizeForSpeed,u=void 0===s?r:s,c=t.isBrowser,l=void 0===c?"undefined"!==typeof window:c;a(o(i),"`name` must be a string"),this._name=i,this._deletedRulePlaceholder="#"+i+"-deleted-rule____{}",a("boolean"===typeof u,"`optimizeForSpeed` must be a boolean"),this._optimizeForSpeed=u,this._isBrowser=l,this._serverSheet=void 0,this._tags=[],this._injected=!1,this._rulesCount=0;var f=this._isBrowser&&document.querySelector('meta[property="csp-nonce"]');this._nonce=f?f.getAttribute("content"):null}var t,i,s,u=e.prototype;return u.setOptimizeForSpeed=function(e){a("boolean"===typeof e,"`setOptimizeForSpeed` accepts a boolean"),a(0===this._rulesCount,"optimizeForSpeed cannot be when rules have already been inserted"),this.flush(),this._optimizeForSpeed=e,this.inject()},u.isOptimizeForSpeed=function(){return this._optimizeForSpeed},u.inject=function(){var e=this;if(a(!this._injected,"sheet already injected"),this._injected=!0,this._isBrowser&&this._optimizeForSpeed)return this._tags[0]=this.makeStyleTag(this._name),this._optimizeForSpeed="insertRule"in this.getSheet(),void(this._optimizeForSpeed||(r||console.warn("StyleSheet: optimizeForSpeed mode not supported falling back to standard mode."),this.flush(),this._injected=!0));this._serverSheet={cssRules:[],insertRule:function(t,n){return"number"===typeof n?e._serverSheet.cssRules[n]={cssText:t}:e._serverSheet.cssRules.push({cssText:t}),n},deleteRule:function(t){e._serverSheet.cssRules[t]=null}}},u.getSheetForTag=function(e){if(e.sheet)return e.sheet;for(var t=0;t<document.styleSheets.length;t++)if(document.styleSheets[t].ownerNode===e)return document.styleSheets[t]},u.getSheet=function(){return this.getSheetForTag(this._tags[this._tags.length-1])},u.insertRule=function(e,t){if(a(o(e),"`insertRule` accepts only strings"),!this._isBrowser)return"number"!==typeof t&&(t=this._serverSheet.cssRules.length),this._serverSheet.insertRule(e,t),this._rulesCount++;if(this._optimizeForSpeed){var n=this.getSheet();"number"!==typeof t&&(t=n.cssRules.length);try{n.insertRule(e,t)}catch(s){return r||console.warn("StyleSheet: illegal rule: \n\n"+e+"\n\nSee https://stackoverflow.com/q/20007992 for more info"),-1}}else{var i=this._tags[t];this._tags.push(this.makeStyleTag(this._name,e,i))}return this._rulesCount++},u.replaceRule=function(e,t){if(this._optimizeForSpeed||!this._isBrowser){var n=this._isBrowser?this.getSheet():this._serverSheet;if(t.trim()||(t=this._deletedRulePlaceholder),!n.cssRules[e])return e;n.deleteRule(e);try{n.insertRule(t,e)}catch(i){r||console.warn("StyleSheet: illegal rule: \n\n"+t+"\n\nSee https://stackoverflow.com/q/20007992 for more info"),n.insertRule(this._deletedRulePlaceholder,e)}}else{var o=this._tags[e];a(o,"old rule at index `"+e+"` not found"),o.textContent=t}return e},u.deleteRule=function(e){if(this._isBrowser)if(this._optimizeForSpeed)this.replaceRule(e,"");else{var t=this._tags[e];a(t,"rule at index `"+e+"` not found"),t.parentNode.removeChild(t),this._tags[e]=null}else this._serverSheet.deleteRule(e)},u.flush=function(){this._injected=!1,this._rulesCount=0,this._isBrowser?(this._tags.forEach((function(e){return e&&e.parentNode.removeChild(e)})),this._tags=[]):this._serverSheet.cssRules=[]},u.cssRules=function(){var e=this;return this._isBrowser?this._tags.reduce((function(t,n){return n?t=t.concat(Array.prototype.map.call(e.getSheetForTag(n).cssRules,(function(t){return t.cssText===e._deletedRulePlaceholder?null:t}))):t.push(null),t}),[]):this._serverSheet.cssRules},u.makeStyleTag=function(e,t,n){t&&a(o(t),"makeStyleTag acceps only strings as second parameter");var r=document.createElement("style");this._nonce&&r.setAttribute("nonce",this._nonce),r.type="text/css",r.setAttribute("data-"+e,""),t&&r.appendChild(document.createTextNode(t));var i=document.head||document.getElementsByTagName("head")[0];return n?i.insertBefore(r,n):i.appendChild(r),r},t=e,(i=[{key:"length",get:function(){return this._rulesCount}}])&&n(t.prototype,i),s&&n(t,s),e}();function a(e,t){if(!e)throw new Error("StyleSheet: "+t+".")}t.default=i}).call(this,n("8oxB"))},jwwS:function(e,t,n){"use strict";var r;t.__esModule=!0,t.LoadableContext=void 0;var o=((r=n("q1tI"))&&r.__esModule?r:{default:r}).default.createContext(null);t.LoadableContext=o},lSNA:function(e,t){e.exports=function(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}},lwAK:function(e,t,n){"use strict";var r;t.__esModule=!0,t.AmpStateContext=void 0;var o=((r=n("q1tI"))&&r.__esModule?r:{default:r}).default.createContext({});t.AmpStateContext=o},vlRD:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return n("RNiq")}])},yLiY:function(e,t,n){"use strict";var r;t.__esModule=!0,t.setConfig=function(e){r=e},t.default=void 0;t.default=function(){return r}}},[["vlRD",0,2,1]]]);