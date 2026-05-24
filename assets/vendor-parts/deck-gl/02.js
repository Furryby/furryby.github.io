{return e.forEach(r=>{switch(r.type){case"function":r.regex=new RegExp(`\\b${r.old}\\(`);break;default:r.regex=new RegExp(`${r.type} ${r.old};`)}}),e}_defaultGetUniforms(e={}){let r={},s=this.uniforms;for(let i in s){let n=s[i];i in e&&!n.private?(n.validate&&ls(n.validate(e[i],n),`${this.name}: invalid ${i}`),r[i]=e[i]):r[i]=n.value}return r}};function n0(t){if(t.source&&t.platformInfo.type==="webgpu")return{...t,vs:void 0,fs:void 0};if(!t.vs)throw new Error("no vertex shader");let e=cS(t.platformInfo,t.vs),r;return t.fs&&(r=cS(t.platformInfo,t.fs)),{...t,vs:e,fs:r}}function cS(t,e){if(typeof e=="string")return e;switch(t.type){case"webgpu":if(e?.wgsl)return e.wgsl;throw new Error("WebGPU does not support GLSL shaders");default:if(e?.glsl)return e.glsl;throw new Error("WebGL does not support WGSL shaders")}}function dn(t){let e=Jt.instantiateModules(t);return UD(e)}function UD(t){let e={},r={};return lS({modules:t,level:0,moduleMap:e,moduleDepth:r}),Object.keys(r).sort((s,i)=>r[i]-r[s]).map(s=>e[s])}function lS(t){let{modules:e,level:r,moduleMap:s,moduleDepth:i}=t;if(r>=5)throw new Error("Possible loop in shader dependency graph");for(let n of e)s[n.name]=n,(i[n.name]===void 0||i[n.name]<r)&&(i[n.name]=r);for(let n of e)n.dependencies&&lS({modules:n.dependencies,level:r+1,moduleMap:s,moduleDepth:i})}function uS(t){switch(t?.gpu.toLowerCase()){case"apple":return`#define APPLE_GPU
#define LUMA_FP64_CODE_ELIMINATION_WORKAROUND 1
#define LUMA_FP32_TAN_PRECISION_WORKAROUND 1
#define LUMA_FP64_HIGH_BITS_OVERFLOW_WORKAROUND 1
`;case"nvidia":return`#define NVIDIA_GPU
#define LUMA_FP64_CODE_ELIMINATION_WORKAROUND 1
`;case"intel":return`#define INTEL_GPU
#define LUMA_FP64_CODE_ELIMINATION_WORKAROUND 1
#define LUMA_FP32_TAN_PRECISION_WORKAROUND 1
#define LUMA_FP64_HIGH_BITS_OVERFLOW_WORKAROUND 1
`;case"amd":return`#define AMD_GPU
`;default:return`#define DEFAULT_GPU
#define LUMA_FP64_CODE_ELIMINATION_WORKAROUND 1
#define LUMA_FP32_TAN_PRECISION_WORKAROUND 1
#define LUMA_FP64_HIGH_BITS_OVERFLOW_WORKAROUND 1
`}}function hS(t,e){if(Number(t.match(/^#version[ \t]+(\d+)/m)?.[1]||100)!==300)throw new Error("luma.gl v9 only supports GLSL 3.00 shader sources");switch(e){case"vertex":return t=fS(t,kD),t;case"fragment":return t=fS(t,VD),t;default:throw new Error(e)}}var dS=[[/^(#version[ \t]+(100|300[ \t]+es))?[ \t]*\n/,`#version 300 es
`],[/\btexture(2D|2DProj|Cube)Lod(EXT)?\(/g,"textureLod("],[/\btexture(2D|2DProj|Cube)(EXT)?\(/g,"texture("]],kD=[...dS,[o0("attribute"),"in $1"],[o0("varying"),"out $1"]],VD=[...dS,[o0("varying"),"in $1"]];function fS(t,e){for(let[r,s]of e)t=t.replace(r,s);return t}function o0(t){return new RegExp(`\\b${t}[ \\t]+(\\w+[ \\t]+\\w+(\\[\\w+\\])?;)`,"g")}function a0(t,e){let r="";for(let s in t){let i=t[s];if(r+=`void ${i.signature} {
`,i.header&&(r+=`  ${i.header}`),e[s]){let n=e[s];n.sort((o,a)=>o.order-a.order);for(let o of n)r+=`  ${o.injection}
`}i.footer&&(r+=`  ${i.footer}`),r+=`}
`}return r}function c0(t){let e={vertex:{},fragment:{}};for(let r of t){let s,i;typeof r!="string"?(s=r,i=s.hook):(s={},i=r),i=i.trim();let[n,o]=i.split(":"),a=i.replace(/\(.+/,""),c=Object.assign(s,{signature:o});switch(n){case"vs":e.vertex[a]=c;break;case"fs":e.fragment[a]=c;break;default:throw new Error(n)}}return e}function pS(t,e){return{name:zD(t,e),language:"glsl",version:HD(t)}}function zD(t,e="unnamed"){let s=/#define[^\S\r\n]*SHADER_NAME[^\S\r\n]*([A-Za-z0-9_-]+)\s*/.exec(t);return s?s[1]:e}function HD(t){let e=100,r=t.match(/[^\s]+/g);if(r&&r.length>=2&&r[0]==="#version"){let s=parseInt(r[1],10);Number.isFinite(s)&&(e=s)}if(e!==100&&e!==300)throw new Error(`Invalid GLSL version ${e}`);return e}var mS=`

${kc}
`,GD=`precision highp float;
`;function _S(t){let e=dn(t.modules||[]);return{source:l0(t.platformInfo,{...t,source:t.source,stage:"vertex",modules:e}),getUniforms:u0(e)}}function yS(t){let e=dn(t.modules||[]);return{vs:l0(t.platformInfo,{...t,source:t.vs,stage:"vertex",modules:e}),fs:l0(t.platformInfo,{...t,source:t.fs,stage:"fragment",modules:e}),getUniforms:u0(e)}}function xS(t){let{vs:e,fs:r}=t,s=dn(t.modules||[]);return{vs:gS(t.platformInfo,{...t,source:e,stage:"vertex",modules:s}),fs:gS(t.platformInfo,{...t,source:r,stage:"fragment",modules:s}),getUniforms:u0(s)}}function l0(t,e){let{source:r,stage:s,modules:i,hookFunctions:n=[],inject:o={},log:a}=e;ls(typeof r=="string","shader source must be a string");let c=r,l="",u=c0(n),f={},h={},d={};for(let g in o){let m=typeof o[g]=="string"?{injection:o[g],order:0}:o[g],_=/^(v|f)s:(#)?([\w-]+)$/.exec(g);if(_){let y=_[2],x=_[3];y?x==="decl"?h[g]=[m]:d[g]=[m]:f[g]=[m]}else d[g]=[m]}let p=t.type!=="webgpu"?i:[];for(let g of p){a&&g.checkDeprecations(c,a);let m=g.getModuleSource(s,"wgsl");l+=m;let _=g.injections[s];for(let y in _){let x=/^(v|f)s:#([\w-]+)$/.exec(y);if(x){let P=x[2]==="decl"?h:d;P[y]=P[y]||[],P[y].push(_[y])}else f[y]=f[y]||[],f[y].push(_[y])}}return l+=mS,l=Vc(l,s,h),l+=a0(u[s],f),l+=c,l=Vc(l,s,d),l}function gS(t,e){let{id:r,source:s,stage:i,language:n="glsl",modules:o,defines:a={},hookFunctions:c=[],inject:l={},prologue:u=!0,log:f}=e;ls(typeof s=="string","shader source must be a string");let h=n==="glsl"?pS(s).version:-1,d=t.shaderLanguageVersion,p=h===100?"#version 100":"#version 300 es",m=s.split(`
`).slice(1).join(`
`),_={};o.forEach(L=>{Object.assign(_,L.getDefines())}),Object.assign(_,a);let y="";switch(n){case"wgsl":break;case"glsl":y=u?`${p}

// ----- PROLOGUE -------------------------
${WD({id:r,source:s,stage:i})}
${`#define SHADER_TYPE_${i.toUpperCase()}`}
${uS(t)}
${i==="fragment"?GD:""}

// ----- APPLICATION DEFINES -------------------------

${jD(_)}

`:`${p}
`;break}let x=c0(c),S={},P={},B={};for(let L in l){let M=typeof l[L]=="string"?{injection:l[L],order:0}:l[L],v=/^(v|f)s:(#)?([\w-]+)$/.exec(L);if(v){let T=v[2],D=v[3];T?D==="decl"?P[L]=[M]:B[L]=[M]:S[L]=[M]}else B[L]=[M]}for(let L of o){f&&L.checkDeprecations(m,f);let M=L.getModuleSource(i);y+=M;let v=L.injections[i];for(let T in v){let D=/^(v|f)s:#([\w-]+)$/.exec(T);if(D){let z=D[2]==="decl"?P:B;z[T]=z[T]||[],z[T].push(v[T])}else S[T]=S[T]||[],S[T].push(v[T])}}return y+="// ----- MAIN SHADER SOURCE -------------------------",y+=mS,y=Vc(y,i,P),y+=a0(x[i],S),y+=m,y=Vc(y,i,B),n==="glsl"&&h!==d&&(y=hS(y,i)),y.trim()}function u0(t){return function(r){let s={};for(let i of t){let n=i.getUniforms(r,s);Object.assign(s,n)}return s}}function WD(t){let{id:e,source:r,stage:s}=t;return e&&r.indexOf("SHADER_NAME")===-1?`
#define SHADER_NAME ${e}_${s}

`:""}function jD(t={}){let e="";for(let r in t){let s=t[r];(s||Number.isFinite(s))&&(e+=`#define ${r.toUpperCase()} ${t[r]}
`)}return e}var Co=class{_hookFunctions=[];_defaultModules=[];static getDefaultShaderAssembler(){return Co.defaultShaderAssembler=Co.defaultShaderAssembler||new Co,Co.defaultShaderAssembler}addDefaultModule(e){this._defaultModules.find(r=>r.name===(typeof e=="string"?e:e.name))||this._defaultModules.push(e)}removeDefaultModule(e){let r=typeof e=="string"?e:e.name;this._defaultModules=this._defaultModules.filter(s=>s.name!==r)}addShaderHook(e,r){r&&(e=Object.assign(r,{hook:e})),this._hookFunctions.push(e)}assembleShader(e){let r=this._getModuleList(e.modules),s=this._hookFunctions,i=n0(e);return{..._S({platformInfo:e.platformInfo,...i,modules:r,hookFunctions:s}),modules:r}}assembleShaderPair(e){let r=n0(e),s=this._getModuleList(e.modules),i=this._hookFunctions,{platformInfo:n}=e;return{...e.platformInfo.shaderLanguage==="wgsl"?yS({platformInfo:n,...r,modules:s,hookFunctions:i}):xS({platformInfo:n,...r,modules:s,hookFunctions:i}),modules:s}}_getModuleList(e=[]){let r=new Array(this._defaultModules.length+e.length),s={},i=0;for(let n=0,o=this._defaultModules.length;n<o;++n){let a=this._defaultModules[n],c=a.name;r[i++]=a,s[c]=!0}for(let n=0,o=e.length;n<o;++n){let a=e[n],c=a.name;s[c]||(r[i++]=a,s[c]=!0)}return r.length=i,Jt.instantiateModules(r)}},hi=Co;Y(hi,"defaultShaderAssembler");function f0(t){if(!t.normalized&&(t.normalized=!0,t.uniformPropTypes&&!t.getUniforms)){let e=new Jt(t);t.getUniforms=e.getUniforms.bind(e)}return t}var XD=`out vec4 transform_output;
void main() {
transform_output = vec4(0);
}`,YD=`#version 300 es
${XD}`;function zc(t){let{input:e,inputChannels:r,output:s}=t||{};if(!e)return YD;if(!r)throw new Error("inputChannels");let i=qD(r),n=AS(e,r);return`#version 300 es
in ${i} ${e};
out vec4 ${s};
void main() {
  ${s} = ${n};
}`}function qD(t){switch(t){case 1:return"float";case 2:return"vec2";case 3:return"vec3";case 4:return"vec4";default:throw new Error(`invalid channels: ${t}`)}}function AS(t,e){switch(e){case 1:return`vec4(${t}, 0.0, 0.0, 1.0)`;case 2:return`vec4(${t}, 0.0, 1.0)`;case 3:return`vec4(${t}, 1.0)`;case 4:return t;default:throw new Error(`invalid channels: ${e}`)}}var U=new kt({id:"luma.gl"});var h0=class{stats=new Map;getStats(e){return this.get(e)}get(e){return this.stats.has(e)||this.stats.set(e,new Tt({id:e})),this.stats.get(e)}},wo=new h0;function KD(){let t="9.0.27",e="set luma.log.level=1 (or higher) to trace rendering";if(globalThis.luma&&globalThis.luma.VERSION!==t)throw new Error(`luma.gl - multiple VERSIONs detected: ${globalThis.luma.VERSION} vs ${t}`);return globalThis.luma||(At()&&U.log(1,`${t} - ${e}`)(),globalThis.luma=globalThis.luma||{VERSION:t,version:t,log:U,stats:wo}),t}var TS=KD();function $D(t){return ArrayBuffer.isView(t)&&!(t instanceof DataView)?t:null}function di(t){return Array.isArray(t)?t.length===0||typeof t[0]=="number"?t:null:$D(t)}var d0={};function Ge(t="id"){d0[t]=d0[t]||1;let e=d0[t]++;return`${t}-${e}`}function pi(t){let e=!0;for(let r in t){e=!1;break}return e}var te=class{id;props;userData={};_device;destroyed=!1;allocatedBytes=0;_attachedResources=new Set;constructor(e,r,s){if(!e)throw new Error("no device");this._device=e,this.props=JD(r,s);let i=this.props.id!=="undefined"?this.props.id:Ge(this[Symbol.toStringTag]);this.props.id=i,this.id=i,this.userData=this.props.userData||{},this.addStats()}destroy(){this.destroyResource()}delete(){return this.destroy(),this}toString(){return`${this[Symbol.toStringTag]||this.constructor.name}(${this.id})`}getProps(){return this.props}attachResource(e){this._attachedResources.add(e)}detachResource(e){this._attachedResources.delete(e)}destroyAttachedResource(e){this._attachedResources.delete(e)&&e.destroy()}destroyAttachedResources(){for(let e of Object.values(this._attachedResources))e.destroy();this._attachedResources=new Set}destroyResource(){this.destroyAttachedResources(),this.removeStats(),this.destroyed=!0}removeStats(){let e=this._device.statsManager.getStats("Resource Counts"),r=this[Symbol.toStringTag];e.get(`${r}s Active`).decrementCount()}trackAllocatedMemory(e,r=this[Symbol.toStringTag]){let s=this._device.statsManager.getStats("Resource Counts");s.get("GPU Memory").addCount(e),s.get(`${r} Memory`).addCount(e),this.allocatedBytes=e}trackDeallocatedMemory(e=this[Symbol.toStringTag]){let r=this._device.statsManager.getStats("Resource Counts");r.get("GPU Memory").subtractCount(this.allocatedBytes),r.get(`${e} Memory`).subtractCount(this.allocatedBytes),this.allocatedBytes=0}addStats(){let e=this._device.statsManager.getStats("Resource Counts"),r=this[Symbol.toStringTag];e.get("Resources Created").incrementCount(),e.get(`${r}s Created`).incrementCount(),e.get(`${r}s Active`).incrementCount()}};Y(te,"defaultProps",{id:"undefined",handle:void 0,userData:void 0});function JD(t,e){let r={...e};for(let s in t)t[s]!==void 0&&(r[s]=t[s]);return r}var Hc=class extends te{get[Symbol.toStringTag](){return"Buffer"}usage;indexType;updateTimestamp;constructor(e,r){let s={...r};(r.usage||0)&Hc.INDEX&&!r.indexType&&(r.data instanceof Uint32Array?s.indexType="uint32":r.data instanceof Uint16Array&&(s.indexType="uint16")),super(e,s,Hc.defaultProps),this.usage=r.usage||0,this.indexType=s.indexType,this.updateTimestamp=e.incrementTimestamp()}readSyncWebGL(e,r){throw new Error("not implemented")}debugData=new ArrayBuffer(0);_setDebugData(e,r,s){let i=ArrayBuffer.isView(e)?e.buffer:e,n=Math.min(e?e.byteLength:s,Hc.DEBUG_DATA_MAX_LENGTH);e===null?this.debugData=new ArrayBuffer(n):r===0&&s===e.byteLength?this.debugData=i.slice(0,n):this.debugData=i.slice(r,r+n)}},Q=Hc;Y(Q,"defaultProps",{...te.defaultProps,usage:0,byteLength:0,byteOffset:0,data:null,indexType:"uint16",mappedAtCreation:!1}),Y(Q,"MAP_READ",1),Y(Q,"MAP_WRITE",2),Y(Q,"COPY_SRC",4),Y(Q,"COPY_DST",8),Y(Q,"INDEX",16),Y(Q,"VERTEX",32),Y(Q,"UNIFORM",64),Y(Q,"STORAGE",128),Y(Q,"INDIRECT",256),Y(Q,"QUERY_RESOLVE",512),Y(Q,"DEBUG_DATA_MAX_LENGTH",32);function Wh(t){let e=bS[t],r=ZD(e),s=t.includes("norm"),i=!s&&!t.startsWith("float"),n=t.startsWith("s");return{dataType:bS[t],byteLength:r,integer:i,signed:n,normalized:s}}function ZD(t){return QD[t]}var bS={uint8:"uint8",sint8:"sint8",unorm8:"uint8",snorm8:"sint8",uint16:"uint16",sint16:"sint16",unorm16:"uint16",snorm16:"sint16",float16:"float16",float32:"float32",uint32:"uint32",sint32:"sint32"},QD={uint8:1,sint8:1,uint16:2,sint16:2,float16:2,float32:4,uint32:4,sint32:4};var eU=["bc1","bc2","bc3","bc4","bc5","bc6","bc7","etc1","etc2","eac","atc","astc","pvrtc"],tU=/^(rg?b?a?)([0-9]*)([a-z]*)(-srgb)?(-webgl|-unsized)?$/;function ES(t){return eU.some(e=>t.startsWith(e))}function jh(t){let e=tU.exec(t);if(e){let[,r,s,i,n,o]=e;if(r){let a=`${i}${s}`,c=Wh(a);return{format:r,components:r.length,srgb:n==="-srgb",unsized:o==="-unsized",webgl:o==="-webgl",...c}}}return sU(t)}var rU={"rgba4unorm-webgl":{format:"rgba",bpp:2},"rgb565unorm-webgl":{format:"rgb",bpp:2},"rgb5a1unorm-webgl":{format:"rgba",bbp:2},rgb9e5ufloat:{format:"rgb",bbp:4},rg11b10ufloat:{format:"rgb",bbp:4},rgb10a2unorm:{format:"rgba",bbp:4},"rgb10a2uint-webgl":{format:"rgba",bbp:4},stencil8:{components:1,bpp:1,a:"stencil"},depth16unorm:{components:1,bpp:2,a:"depth"},depth24plus:{components:1,bpp:3,a:"depth"},depth32float:{components:1,bpp:4,a:"depth"},"depth24plus-stencil8":{components:2,bpp:4,a:"depth-stencil"},"depth24unorm-stencil8":{components:2,bpp:4,a:"depth-stencil"},"depth32float-stencil8":{components:2,bpp:4,a:"depth-stencil"}};function sU(t){let e=rU[t];if(!e)throw new Error(`Unknown format ${t}`);return{format:e.format||"",components:e.components||e.format?.length||1,byteLength:e.bpp||1,srgb:!1,unsized:!1}}var Gc=class{},Wc=class{features;disabledFeatures;constructor(e=[],r){this.features=new Set(e),this.disabledFeatures=r||{}}*[Symbol.iterator](){yield*this.features}has(e){return!this.disabledFeatures[e]&&this.features.has(e)}},p0=class{get[Symbol.toStringTag](){return"Device"}constructor(e){this.props={...p0.defaultProps,...e},this.id=this.props.id||Ge(this[Symbol.toStringTag].toLowerCase())}id;props;userData={};statsManager=wo;_lumaData={};isTextureFormatCompressed(e){return ES(e)}loseDevice(){return!1}getCanvasContext(){if(!this.canvasContext)throw new Error("Device has no CanvasContext");return this.canvasContext}createTexture(e){return(e instanceof Promise||typeof e=="string")&&(e={data:e}),this._createTexture(e)}createCommandEncoder(e={}){throw new Error("not implemented")}readPixelsToArrayWebGL(e,r){throw new Error("not implemented")}readPixelsToBufferWebGL(e,r){throw new Error("not implemented")}setParametersWebGL(e){throw new Error("not implemented")}getParametersWebGL(e){throw new Error("not implemented")}withParametersWebGL(e,r){throw new Error("not implemented")}clearWebGL(e){throw new Error("not implemented")}resetWebGL(){throw new Error("not implemented")}timestamp=0;incrementTimestamp(){return this.timestamp++}onError(e){this.props.onError(e)}_getBufferProps(e){(e instanceof ArrayBuffer||ArrayBuffer.isView(e))&&(e={data:e});let r={...e};return(e.usage||0)&Q.INDEX&&!e.indexType&&(e.data instanceof Uint32Array?r.indexType="uint32":e.data instanceof Uint16Array?r.indexType="uint16":U.warn("indices buffer content must be of integer type")()),r}},Zt=p0;Y(Zt,"defaultProps",{id:null,canvas:null,container:null,manageState:!0,width:800,height:600,requestMaxLimits:!0,debug:Boolean(U.get("debug")),spector:Boolean(U.get("spector")||U.get("spectorjs")),break:[],initalizeFeatures:!0,disabledFeatures:{"compilation-status-async-webgl":!0},gl:null,onError:e=>U.error(e.message)}),Y(Zt,"VERSION",TS);function ee(t,e){if(!t)throw new Error(e||"luma.gl: assertion failed.")}var jc=new Map,g0=class{static registerDevices(e){for(let r of e)ee(r.type&&r.isSupported&&r.create),jc.set(r.type,r)}static getAvailableDevices(){return Array.from(jc).map(e=>e.type)}static getSupportedDevices(){return Array.from(jc).filter(e=>e.isSupported()).map(e=>e.type)}static setDefaultDeviceProps(e){Object.assign(Zt.defaultProps,e)}static async attachDevice(e){let r=SS(e.devices)||jc;if(e.handle instanceof WebGL2RenderingContext){let s=r.get("webgl");if(s)return await s.attach(e.handle)}if(e.handle===null){let s=r.get("unknown");if(s)return await s.attach(null)}throw new Error("Failed to attach device. Ensure `@luma.gl/webgl` and/or `@luma.gl/webgpu` modules are imported.")}static async createDevice(e={}){e={...g0.defaultProps,...e},e.gl&&(e.type="webgl");let r=SS(e.devices)||jc,s,i;switch(e.type){case"webgpu":if(s=r.get("webgpu"),s)return await s.create(e);break;case"webgl":if(i=r.get("webgl"),i)return await i.create(e);break;case"unknown":let n=r.get("unknown");if(n)return await n.create(e);break;case"best-available":if(s=r.get("webgpu"),s?.isSupported?.())return await s.create(e);if(i=r.get("webgl"),i?.isSupported?.())return await i.create(e);break}throw new Error("No matching device found. Ensure `@luma.gl/webgl` and/or `@luma.gl/webgpu` modules are imported.")}static enforceWebGL2(e=!0){let r=HTMLCanvasElement.prototype;if(!e&&r.originalGetContext){r.getContext=r.originalGetContext,r.originalGetContext=void 0;return}r.originalGetContext=r.getContext,r.getContext=function(s,i){return s==="webgl"||s==="experimental-webgl"?this.originalGetContext("webgl2",i):this.originalGetContext(s,i)}}},Vt=g0;Y(Vt,"defaultProps",{...Zt.defaultProps,type:"best-available",devices:void 0}),Y(Vt,"stats",wo),Y(Vt,"log",U);function SS(t){if(!t||t?.length===0)return null;let e=new Map;for(let r of t)e.set(r.type,r);return e}var iU=At()&&typeof document<"u",Xh=()=>iU&&document.readyState==="complete",nU={canvas:null,width:800,height:600,useDevicePixels:!0,autoResize:!0,container:null,visible:!0,colorSpace:"srgb",alphaMode:"opaque"},gi=class{id;props;canvas;htmlCanvas;offscreenCanvas;type;width=1;height=1;resizeObserver;_canvasSizeInfo={clientWidth:0,clientHeight:0,devicePixelRatio:1};static get isPageLoaded(){return Xh()}constructor(e){if(this.props={...nU,...e},e=this.props,!At()){this.id="node-canvas-context",this.type="node",this.width=this.props.width,this.height=this.props.height,this.canvas=null;return}if(e.canvas)typeof e.canvas=="string"?this.canvas=cU(e.canvas):this.canvas=e.canvas;else{let r=lU(e),s=aU(e?.container||null);s.insertBefore(r,s.firstChild),this.canvas=r,e?.visible||(this.canvas.style.visibility="hidden")}this.canvas instanceof HTMLCanvasElement?(this.id=this.canvas.id,this.type="html-canvas",this.htmlCanvas=this.canvas):(this.id="offscreen-canvas",this.type="offscreen-canvas",this.offscreenCanvas=this.canvas),this.canvas instanceof HTMLCanvasElement&&e.autoResize&&(this.resizeObserver=new ResizeObserver(r=>{for(let s of r)s.target===this.canvas&&this.update()}),this.resizeObserver.observe(this.canvas))}getDevicePixelRatio(e){return typeof OffscreenCanvas<"u"&&this.canvas instanceof OffscreenCanvas||(e=e===void 0?this.props.useDevicePixels:e,!e||e<=0)?1:e===!0?typeof window<"u"&&window.devicePixelRatio||1:e}getPixelSize(){switch(this.type){case"node":return[this.width,this.height];case"offscreen-canvas":return[this.canvas.width,this.canvas.height];case"html-canvas":let e=this.getDevicePixelRatio(),r=this.canvas;return r.parentElement?[r.clientWidth*e,r.clientHeight*e]:[this.canvas.width,this.canvas.height];default:throw new Error(this.type)}}getAspect(){let[e,r]=this.getPixelSize();return e/r}cssToDeviceRatio(){try{let[e]=this.getDrawingBufferSize(),{clientWidth:r}=this._canvasSizeInfo;return r?e/r:1}catch{return 1}}cssToDevicePixels(e,r=!0){let s=this.cssToDeviceRatio(),[i,n]=this.getDrawingBufferSize();return uU(e,s,i,n,r)}setDevicePixelRatio(e,r={}){if(!this.htmlCanvas)return;let s="width"in r?r.width:this.htmlCanvas.clientWidth,i="height"in r?r.height:this.htmlCanvas.clientHeight;(!s||!i)&&(U.log(1,"Canvas clientWidth/clientHeight is 0")(),e=1,s=this.htmlCanvas.width||1,i=this.htmlCanvas.height||1);let n=this._canvasSizeInfo;if(n.clientWidth!==s||n.clientHeight!==i||n.devicePixelRatio!==e){let o=e,a=Math.floor(s*o),c=Math.floor(i*o);this.htmlCanvas.width=a,this.htmlCanvas.height=c;let[l,u]=this.getDrawingBufferSize();(l!==a||u!==c)&&(o=Math.min(l/s,u/i),this.htmlCanvas.width=Math.floor(s*o),this.htmlCanvas.height=Math.floor(i*o),U.warn("Device pixel ratio clamped")()),this._canvasSizeInfo.clientWidth=s,this._canvasSizeInfo.clientHeight=i,this._canvasSizeInfo.devicePixelRatio=e}}getDrawingBufferSize(){let e=this.device.gl;if(!e)throw new Error("canvas size");return[e.drawingBufferWidth,e.drawingBufferHeight]}_setAutoCreatedCanvasId(e){this.htmlCanvas?.id==="lumagl-auto-created-canvas"&&(this.htmlCanvas.id=e)}};Y(gi,"pageLoaded",oU());function oU(){return Xh()||typeof window>"u"?Promise.resolve():new Promise(t=>{window.addEventListener("load",()=>t())})}function aU(t){if(typeof t=="string"){let e=document.getElementById(t);if(!e&&!Xh())throw new Error(`Accessing '${t}' before page was loaded`);if(!e)throw new Error(`${t} is not an HTML element`);return e}else if(t)return t;return document.body}function cU(t){let e=document.getElementById(t);if(!e&&!Xh())throw new Error(`Accessing '${t}' before page was loaded`);if(!(e instanceof HTMLCanvasElement))throw new Error("Object is not a canvas element");return e}function lU(t){let{width:e,height:r}=t,s=document.createElement("canvas");return s.id="lumagl-auto-created-canvas",s.width=e||1,s.height=r||1,s.style.width=Number.isFinite(e)?`${e}px`:"100%",s.style.height=Number.isFinite(r)?`${r}px`:"100%",s}function uU(t,e,r,s,i){let n=t,o=vS(n[0],e,r),a=CS(n[1],e,s,i),c=vS(n[0]+1,e,r),l=c===r-1?c:c-1;c=CS(n[1]+1,e,s,i);let u;return i?(c=c===0?c:c+1,u=a,a=c):u=c===s-1?c:c-1,{x:o,y:a,width:Math.max(l-o+1,1),height:Math.max(u-a+1,1)}}function vS(t,e,r){return Math.min(Math.round(t*e),r-1)}function CS(t,e,r,s){return s?Math.max(0,r-1-Math.round(t*e)):Math.min(Math.round(t*e),r-1)}var m0=class extends te{get[Symbol.toStringTag](){return"Texture"}dimension;format;width;height;depth;updateTimestamp;constructor(e,r,s=m0.defaultProps){super(e,r,s),this.dimension=this.props.dimension,this.format=this.props.format,this.width=this.props.width,this.height=this.props.height,this.depth=this.props.depth,this.updateTimestamp=e.incrementTimestamp()}},xe=m0;Y(xe,"defaultProps",{...te.defaultProps,data:null,dimension:"2d",format:"rgba8unorm",width:void 0,height:void 0,depth:1,mipmaps:!0,compressed:!1,usage:0,mipLevels:void 0,samples:void 0,type:void 0,sampler:{},view:void 0}),Y(xe,"COPY_SRC",1),Y(xe,"COPY_DST",2),Y(xe,"TEXTURE_BINDING",4),Y(xe,"STORAGE_BINDING",8),Y(xe,"RENDER_ATTACHMENT",16);var _0=class extends te{get[Symbol.toStringTag](){return"TextureView"}constructor(e,r){super(e,r,_0.defaultProps)}},mi=_0;Y(mi,"defaultProps",{...te.defaultProps,format:void 0,dimension:void 0,aspect:"all",baseMipLevel:0,mipLevelCount:void 0,baseArrayLayer:0,arrayLayerCount:void 0});function PS(t,e,r){let s="",i=e.split(/\r?\n/),n=t.slice().sort((o,a)=>o.lineNum-a.lineNum);switch(r?.showSourceCode||"no"){case"all":let o=0;for(let a=1;a<=i.length;a++)for(s+=MS(i[a-1],a,r);n.length>o&&n[o].lineNum===a;){let c=n[o++];s+=wS(c,i,c.lineNum,{...r,inlineSource:!1})}return s;case"issues":case"no":for(let a of t)s+=wS(a,i,a.lineNum,{inlineSource:r?.showSourceCode!=="no"});return s}}function wS(t,e,r,s){if(s?.inlineSource){let i=fU(e,r),n=t.linePos>0?`${" ".repeat(t.linePos+5)}^^^
`:"";return`
${i}${n}${t.type.toUpperCase()}: ${t.message}

`}return s?.html?`<div class='luma-compiler-log-error' style="color:red;"><b> ${t.type.toUpperCase()}: ${t.message}</b></div>`:`${t.type.toUpperCase()}: ${t.message}`}function fU(t,e,r){let s="";for(let i=e-2;i<=e;i++){let n=t[i-1];n!==void 0&&(s+=MS(n,e,r))}return s}function MS(t,e,r){let s=r?.html?dU(t):t;return`${hU(String(e),4)}: ${s}${r?.html?"<br/>":`
`}`}function hU(t,e){let r="";for(let s=t.length;s<e;++s)r+=" ";return r+t}function dU(t){return t.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}function y0(t,e){return{name:pU(t,e),language:"glsl",version:gU(t)}}function pU(t,e="unnamed"){let s=/#define[\s*]SHADER_NAME[\s*]([A-Za-z0-9_-]+)[\s*]/.exec(t);return s?s[1]:e}function gU(t){let e=100,r=t.match(/[^\s]+/g);if(r&&r.length>=2&&r[0]==="#version"){let s=parseInt(r[1],10);Number.isFinite(s)&&(e=s)}return e}var x0=class extends te{get[Symbol.toStringTag](){return"Shader"}stage;source;compilationStatus="pending";constructor(e,r){super(e,{id:mU(r),...r},x0.defaultProps),this.stage=this.props.stage,this.source=this.props.source}getCompilationInfoSync(){return null}getTranslatedSource(){return null}async debugShader(e=this.props.debug){switch(e){case"never":return;case"errors":if(this.compilationStatus==="success")return;break;case"warnings":case"always":break}let r=await this.getCompilationInfo();this.props.debug==="warnings"&&r?.length===0||this._displayShaderLog(r)}_displayShaderLog(e){if(typeof document>"u"||!document?.createElement)return;let r=y0(this.source).name,s=`${this.stage} ${r}`,i=PS(e,this.source,{showSourceCode:"all",html:!0}),n=this.getTranslatedSource();n&&(i+=`<br /><br /><h1>Translated Source</h1><br /><br /><code style="user-select:text;"><pre>${n}</pre></code>`);let o=document.createElement("Button");o.innerHTML=`
<h1>Shader Compilation Error in ${s}</h1><br /><br />
<code style="user-select:text;"><pre>
${i}
</pre></code>`,o.style.top="10px",o.style.left="10px",o.style.position="absolute",o.style.zIndex="9999",o.style.width="100%",o.style.textAlign="left",document.body.appendChild(o);let a=document.getElementsByClassName("luma-compiler-log-error");a[0]?.scrollIntoView&&a[0].scrollIntoView(),o.onclick=()=>{let c=`data:text/plain,${encodeURIComponent(this.source)}`;navigator.clipboard.writeText(c)}}},_i=x0;Y(_i,"defaultProps",{...te.defaultProps,language:"auto",stage:void 0,source:"",sourceMap:null,entryPoint:"main",debug:"errors"});function mU(t){return y0(t.source).name||t.id||Ge(`unnamed ${t.stage}-shader`)}var A0=class extends te{get[Symbol.toStringTag](){return"Sampler"}constructor(e,r){super(e,r,A0.defaultProps)}},yi=A0;Y(yi,"defaultProps",{...te.defaultProps,type:"color-sampler",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge",addressModeW:"clamp-to-edge",magFilter:"nearest",minFilter:"nearest",mipmapFilter:"nearest",lodMinClamp:0,lodMaxClamp:32,compare:"less-equal",maxAnisotropy:1});var T0=class extends te{get[Symbol.toStringTag](){return"Framebuffer"}width;height;colorAttachments=[];depthStencilAttachment=null;constructor(e,r={}){super(e,r,T0.defaultProps),this.width=this.props.width,this.height=this.props.height}resize(e){let r=!e;if(e){let[s,i]=Array.isArray(e)?e:[e.width,e.height];r=r||i!==this.height||s!==this.width,this.width=s,this.height=i}r&&(U.log(2,`Resizing framebuffer ${this.id} to ${this.width}x${this.height}`)(),this.resizeAttachments(this.width,this.height))}autoCreateAttachmentTextures(){if(this.props.colorAttachments.length===0&&!this.props.depthStencilAttachment)throw new Error("Framebuffer has noattachments");this.colorAttachments=this.props.colorAttachments.map(r=>{if(typeof r=="string"){let s=this.createColorTexture(r);return this.attachResource(s),s.view}return r instanceof xe?r.view:r});let e=this.props.depthStencilAttachment;if(e)if(typeof e=="string"){let r=this.createDepthStencilTexture(e);this.attachResource(r),this.depthStencilAttachment=r.view}else e instanceof xe?this.depthStencilAttachment=e.view:this.depthStencilAttachment=e}createColorTexture(e){return this.device.createTexture({id:"color-attachment",usage:xe.RENDER_ATTACHMENT,format:e,width:this.width,height:this.height})}createDepthStencilTexture(e){return this.device.createTexture({id:"depth-stencil-attachment",usage:xe.RENDER_ATTACHMENT,format:e,width:this.width,height:this.height})}resizeAttachments(e,r){for(let s=0;s<this.colorAttachments.length;++s)if(this.colorAttachments[s]){let i=this.device._createTexture({...this.colorAttachments[s].props,width:e,height:r});this.destroyAttachedResource(this.colorAttachments[s]),this.colorAttachments[s]=i.view,this.attachResource(i.view)}if(this.depthStencilAttachment){let s=this.device._createTexture({...this.depthStencilAttachment.props,width:e,height:r});this.destroyAttachedResource(this.depthStencilAttachment),this.depthStencilAttachment=s.view,this.attachResource(s)}}},us=T0;Y(us,"defaultProps",{...te.defaultProps,width:1,height:1,colorAttachments:[],depthStencilAttachment:null});var b0=class extends te{get[Symbol.toStringTag](){return"RenderPipeline"}shaderLayout;bufferLayout;linkStatus="pending";hash="";constructor(e,r){super(e,r,b0.defaultProps),this.shaderLayout=this.props.shaderLayout,this.bufferLayout=this.props.bufferLayout||[]}setUniformsWebGL(e){throw new Error("Use uniform blocks")}},Rr=b0;Y(Rr,"defaultProps",{...te.defaultProps,vs:null,vertexEntryPoint:"vertexMain",vsConstants:{},fs:null,fragmentEntryPoint:"fragmentMain",fsConstants:{},shaderLayout:null,bufferLayout:[],topology:"triangle-list",parameters:{},bindings:{},uniforms:{}});var E0=class extends te{get[Symbol.toStringTag](){return"RenderPass"}constructor(e,r){super(e,r,E0.defaultProps)}},Po=E0;Y(Po,"defaultProps",{...te.defaultProps,framebuffer:null,parameters:void 0,clearColor:[0,0,0,0],clearDepth:1,clearStencil:0,depthReadOnly:!1,stencilReadOnly:!1,discard:!1,occlusionQuerySet:void 0,timestampQuerySet:void 0,beginTimestampIndex:void 0,endTimestampIndex:void 0});var S0=class extends te{get[Symbol.toStringTag](){return"ComputePipeline"}hash="";constructor(e,r){super(e,r,S0.defaultProps)}},pn=S0;Y(pn,"defaultProps",{...te.defaultProps,shader:void 0,entryPoint:void 0,constants:{},shaderLayout:void 0});var v0=class extends te{get[Symbol.toStringTag](){return"CommandEncoder"}constructor(e,r){super(e,r,v0.defaultProps)}},Mo=v0;Y(Mo,"defaultProps",{...te.defaultProps,measureExecutionTime:void 0});var C0=class extends te{get[Symbol.toStringTag](){return"CommandBuffer"}constructor(e,r){super(e,r,C0.defaultProps)}},Ro=C0;Y(Ro,"defaultProps",{...te.defaultProps});function RS(t){let[e,r]=yU[t],s=e==="i32"||e==="u32",i=e!=="u32",n=xU[e]*r,o=_U(e,r);return{dataType:e,components:r,defaultVertexFormat:o,byteLength:n,integer:s,signed:i}}function _U(t,e){let r;switch(t){case"f32":r="float32";break;case"i32":r="sint32";break;case"u32":r="uint32";break;case"f16":return e<=2?"float16x2":"float16x4"}return e===1?r:`${r}x${e}`}var yU={f32:["f32",1],"vec2<f32>":["f32",2],"vec3<f32>":["f32",3],"vec4<f32>":["f32",4],f16:["f16",1],"vec2<f16>":["f16",2],"vec3<f16>":["f16",3],"vec4<f16>":["f16",4],i32:["i32",1],"vec2<i32>":["i32",2],"vec3<i32>":["i32",3],"vec4<i32>":["i32",4],u32:["u32",1],"vec2<u32>":["u32",2],"vec3<u32>":["u32",3],"vec4<u32>":["u32",4]},xU={f32:4,f16:2,i32:4,u32:4};function w0(t){let e;t.endsWith("-webgl")&&(t.replace("-webgl",""),e=!0);let[r,s]=t.split("x"),i=r,n=s?parseInt(s):1,o=Wh(i),a={type:i,components:n,byteLength:o.byteLength*n,integer:o.integer,signed:o.signed,normalized:o.normalized};return e&&(a.webglOnly=!0),a}function Yh(t,e){let r={};for(let s of t.attributes)r[s.name]=AU(t,e,s.name);return r}function IS(t,e,r=16){let s=Yh(t,e),i=new Array(r).fill(null);for(let n of Object.values(s))i[n.location]=n;return i}function AU(t,e,r){let s=TU(t,r),i=bU(e,r);if(!s)return null;let n=RS(s.type),o=i?.vertexFormat||n.defaultVertexFormat,a=w0(o);return{attributeName:i?.attributeName||s.name,bufferName:i?.bufferName||s.name,location:s.location,shaderType:s.type,shaderDataType:n.dataType,shaderComponents:n.components,vertexFormat:o,bufferDataType:a.type,bufferComponents:a.components,normalized:a.normalized,integer:n.integer,stepMode:i?.stepMode||s.stepMode,byteOffset:i?.byteOffset||0,byteStride:i?.byteStride||0}}function TU(t,e){let r=t.attributes.find(s=>s.name===e);return r||U.warn(`shader layout attribute "${e}" not present in shader`),r||null}function bU(t,e){EU(t);let r=SU(t,e);return r||(r=vU(t,e),r)?r:(U.warn(`layout for attribute "${e}" not present in buffer layout`),null)}function EU(t){for(let e of t)(e.attributes&&e.format||!e.attributes&&!e.format)&&U.warn(`BufferLayout ${name} must have either 'attributes' or 'format' field`)}function SU(t,e){for(let r of t)if(r.format&&r.name===e)return{attributeName:r.name,bufferName:e,stepMode:r.stepMode,vertexFormat:r.format,byteOffset:0,byteStride:r.byteStride||0};return null}function vU(t,e){for(let r of t){let s=r.byteStride;if(typeof r.byteStride!="number")for(let n of r.attributes||[]){let o=w0(n.format);s+=o.byteLength}let i=r.attributes?.find(n=>n.attribute===e);if(i)return{attributeName:i.attribute,bufferName:r.name,stepMode:r.stepMode,vertexFormat:i.format,byteOffset:i.byteOffset,byteStride:s}}return null}function P0(t,e){let r={...t,attributes:t.attributes.map(s=>({...s}))};for(let s of e?.attributes||[]){let i=r.attributes.find(n=>n.name===s.name);i?(i.type=s.type||i.type,i.stepMode=s.stepMode||i.stepMode):U.warn(`shader layout attribute ${s.name} not present in shader`)}return r}var M0=class extends te{get[Symbol.toStringTag](){return"VertexArray"}maxVertexAttributes;attributeInfos;indexBuffer=null;attributes;constructor(e,r){super(e,r,M0.defaultProps),this.maxVertexAttributes=e.limits.maxVertexAttributes,this.attributes=new Array(this.maxVertexAttributes).fill(null),this.attributeInfos=IS(r.renderPipeline.shaderLayout,r.renderPipeline.bufferLayout,this.maxVertexAttributes)}setConstantWebGL(e,r){throw new Error("constant attributes not supported")}},Io=M0;Y(Io,"defaultProps",{...te.defaultProps,renderPipeline:null});var R0=class extends te{get[Symbol.toStringTag](){return"TransformFeedback"}constructor(e,r){super(e,r,R0.defaultProps)}},Bo=R0;Y(Bo,"defaultProps",{...te.defaultProps,layout:void 0,buffers:{}});var I0=class extends te{get[Symbol.toStringTag](){return"QuerySet"}constructor(e,r){super(e,r,I0.defaultProps)}},Oo=I0;Y(Oo,"defaultProps",{...te.defaultProps,type:void 0,count:void 0});var CU={f32:{type:"f32",components:1},i32:{type:"i32",components:1},u32:{type:"u32",components:1},"vec2<f32>":{type:"f32",components:2},"vec3<f32>":{type:"f32",components:3},"vec4<f32>":{type:"f32",components:4},"vec2<i32>":{type:"i32",components:2},"vec3<i32>":{type:"i32",components:3},"vec4<i32>":{type:"i32",components:4},"vec2<u32>":{type:"u32",components:2},"vec3<u32>":{type:"u32",components:3},"vec4<u32>":{type:"u32",components:4},"mat2x2<f32>":{type:"f32",components:4},"mat2x3<f32>":{type:"f32",components:6},"mat2x4<f32>":{type:"f32",components:8},"mat3x2<f32>":{type:"f32",components:6},"mat3x3<f32>":{type:"f32",components:9},"mat3x4<f32>":{type:"f32",components:12},"mat4x2<f32>":{type:"f32",components:8},"mat4x3<f32>":{type:"f32",components:12},"mat4x4<f32>":{type:"f32",components:16}};function BS(t){let e=CU[t];return ee(t),e}function OS(t,e){switch(e){case 1:return t;case 2:return t+t%2;default:return t+(4-t%4)%4}}var qh;function Kh(t){return(!qh||qh.byteLength<t)&&(qh=new ArrayBuffer(t)),qh}function B0(t,e){let r=Kh(t.BYTES_PER_ELEMENT*e);return new t(r,0,e)}function O0(t){let{target:e,source:r,start:s=0,count:i=1}=t,n=r.length,o=i*n,a=0;for(let c=s;a<n;a++)e[c++]=r[a];for(;a<o;)a<o-a?(e.copyWithin(s+a,s,s+a),a*=2):(e.copyWithin(s+a,s,s+o-a),a=o);return t.target}var FS=1024,$h=class{layout={};byteLength;constructor(e){let r=0;for(let[i,n]of Object.entries(e)){let o=BS(n),{type:a,components:c}=o;r=OS(r,c);let l=r;r+=c,this.layout[i]={type:a,size:c,offset:l}}r+=(4-r%4)%4;let s=r*4;this.byteLength=Math.max(s,FS)}getData(e){let r=Math.max(this.byteLength,FS),s=Kh(r),i={i32:new Int32Array(s),u32:new Uint32Array(s),f32:new Float32Array(s),f16:new Uint16Array(s)};for(let[n,o]of Object.entries(e)){let a=this.layout[n];if(!a){U.warn(`Supplied uniform value ${n} not present in uniform block layout`)();continue}let{type:c,size:l,offset:u}=a,f=i[c];if(l===1){if(typeof o!="number"&&typeof o!="boolean"){U.warn(`Supplied value for single component uniform ${n} is not a number: ${o}`)();continue}f[u]=Number(o)}else{let h=di(o);if(!h){U.warn(`Supplied value for multi component / array uniform ${n} is not a numeric array: ${o}`)();continue}f.set(h,u)}}return new Uint8Array(s)}has(e){return Boolean(this.layout[e])}get(e){return this.layout[e]}};function LS(t,e,r=16){if(t!==e)return!1;let s=di(t);if(!s)return!1;let i=di(e);if(i&&s.length===i.length){for(let n=0;n<s.length;++n)if(i[n]!==s[n])return!1}return!0}function NS(t){let e=di(t);return e?e.slice():t}var Jh=class{name;uniforms={};modifiedUniforms={};modified=!0;bindingLayout={};needsRedraw="initialized";constructor(e){if(this.name=e?.name,e?.name&&e?.shaderLayout){let r=e?.shaderLayout.bindings?.find(i=>i.type==="uniform"&&i.name===e?.name);if(!r)throw new Error(e?.name);let s=r;for(let i of s.uniforms||[])this.bindingLayout[i.name]=i}}setUniforms(e){for(let[r,s]of Object.entries(e))this._setUniform(r,s),this.needsRedraw||this.setNeedsRedraw(`${this.name}.${r}=${s}`)}setNeedsRedraw(e){this.needsRedraw=this.needsRedraw||e}getAllUniforms(){return this.modifiedUniforms={},this.needsRedraw=!1,this.uniforms||{}}_setUniform(e,r){LS(this.uniforms[e],r)||(this.uniforms[e]=NS(r),this.modifiedUniforms[e]=!0,this.modified=!0)}};var Xc=class{uniformBlocks=new Map;uniformBufferLayouts=new Map;uniformBuffers=new Map;constructor(e){for(let[r,s]of Object.entries(e)){let i=r,n=new $h(s.uniformTypes||{});this.uniformBufferLayouts.set(i,n);let o=new Jh({name:r});o.setUniforms(s.defaultUniforms||{}),this.uniformBlocks.set(i,o)}}destroy(){for(let e of this.uniformBuffers.values())e.destroy()}setUniforms(e){for(let[r,s]of Object.entries(e))this.uniformBlocks.get(r).setUniforms(s);this.updateUniformBuffers()}getUniformBufferByteLength(e){return this.uniformBufferLayouts.get(e).byteLength}getUniformBufferData(e){let r=this.uniformBlocks.get(e).getAllUniforms();return this.uniformBufferLayouts.get(e).getData(r)}createUniformBuffer(e,r,s){s&&this.setUniforms(s);let i=this.getUniformBufferByteLength(r),n=e.createBuffer({usage:Q.UNIFORM|Q.COPY_DST,byteLength:i}),o=this.getUniformBufferData(r);return n.write(o),n}getManagedUniformBuffer(e,r){if(!this.uniformBuffers.get(r)){let s=this.getUniformBufferByteLength(r),i=e.createBuffer({usage:Q.UNIFORM|Q.COPY_DST,byteLength:s});this.uniformBuffers.set(r,i)}return this.uniformBuffers.get(r)}updateUniformBuffers(){let e=!1;for(let r of this.uniformBlocks.keys()){let s=this.updateUniformBuffer(r);e||=s}return e&&U.log(3,`UniformStore.updateUniformBuffers(): ${e}`)(),e}updateUniformBuffer(e){let r=this.uniformBlocks.get(e),s=this.uniformBuffers.get(e),i=!1;if(s&&r.needsRedraw){i||=r.needsRedraw;let n=this.getUniformBufferData(e);this.uniformBuffers.get(e).write(n);let a=this.uniformBlocks.get(e).getAllUniforms();U.log(4,`Writing to uniform buffer ${String(e)}`,n,a)()}return i}};function Zh(t){let e=ArrayBuffer.isView(t)?t.constructor:t;switch(e){case Float32Array:return"float32";case Uint16Array:return"uint16";case Uint32Array:return"uint32";case Uint8Array:case Uint8ClampedArray:return"uint8";case Int8Array:return"sint8";case Int16Array:return"sint16";case Int32Array:return"sint32";default:throw new Error(e.constructor.name)}}function Yc(t){switch(t){case"float32":return Float32Array;case"uint32":return Uint32Array;case"sint32":return Int32Array;case"uint16":case"unorm16":return Uint16Array;case"sint16":case"snorm16":return Int16Array;case"uint8":case"unorm8":return Uint8Array;case"sint8":case"snorm8":return Int8Array;default:throw new Error(t)}}function F0(t,e,r){if(!e||e>4)throw new Error(`size ${e}`);let s=e,i=Zh(t);if(i==="uint8"&&r&&s===1)return"unorm8-webgl";if(i==="uint8"&&r&&s===3)return"unorm8x3-webgl";if(i==="uint8"||i==="sint8"){if(s===1||s===3)throw new Error(`size: ${e}`);return r&&(i=i.replace("int","norm")),`${i}x${s}`}if(i==="uint16"||i==="sint16"){if(s===1||s===3)throw new Error(`size: ${e}`);return r&&(i=i.replace("int","norm")),`${i}x${s}`}return s===1?i:`${i}x${s}`}function DS(t){return di(t)!==null||typeof t=="number"||typeof t=="boolean"}function gn(t){let e={bindings:{},uniforms:{}};return Object.keys(t).forEach(r=>{let s=t[r];DS(s)?e.uniforms[r]=s:e.bindings[r]=s}),e}function L0(t,e,r){let{removedProps:s={},deprecatedProps:i={},replacedProps:n={}}=r;for(let a in s)if(a in e){let l=s[a]?`${t}.${s[a]}`:"N/A";U.removed(`${t}.${a}`,l)()}for(let a in i)if(a in e){let c=i[a];U.deprecated(`${t}.${a}`,`${t}.${c}`)()}let o=null;for(let[a,c]of Object.entries(n))a in e&&(U.deprecated(`${t}.${a}`,`${t}.${c}`)(),o=o||Object.assign({},e),o[c]=e[a],delete o[a]);return o||e}var wU="";async function N0(t,e){return await new Promise((r,s)=>{try{let i=new Image;i.onload=()=>r(i),i.onerror=()=>s(new Error(`Could not load image ${t}.`)),i.crossOrigin=e?.crossOrigin||"anonymous",i.src=t.startsWith("http")?t:wU+t}catch(i){s(i)}})}async function qc(t,e){let r=document.getElementsByTagName("head")[0];if(!r)throw new Error("loadScript");let s=document.createElement("script");return s.setAttribute("type","text/javascript"),s.setAttribute("src",t),e&&(s.id=e),new Promise((i,n)=>{s.onload=i,s.onerror=o=>n(new Error(`Unable to load script '${t}': ${o}`)),r.appendChild(s)})}function Kc(t,e,r){if(t===e)return!0;if(!r||!t||!e)return!1;if(Array.isArray(t)){if(!Array.isArray(e)||t.length!==e.length)return!1;for(let s=0;s<t.length;s++)if(!Kc(t[s],e[s],r-1))return!1;return!0}if(Array.isArray(e))return!1;if(typeof t=="object"&&typeof e=="object"){let s=Object.keys(t),i=Object.keys(e);if(s.length!==i.length)return!1;for(let n of s)if(!e.hasOwnProperty(n)||!Kc(t[n],e[n],r-1))return!1;return!0}return!1}function D0(t){return typeof window<"u"&&window.requestAnimationFrame?window.requestAnimationFrame(t):setTimeout(t,1e3/60)}function U0(t){return typeof window<"u"&&window.cancelAnimationFrame?window.cancelAnimationFrame(t):clearTimeout(t)}var k0=class{constructor(){this.constants=new Map,this.aliases=new Map,this.structs=new Map}},Ir=class{constructor(){}get isAstNode(){return!0}get astNodeType(){return""}evaluate(e){throw new Error("Cannot evaluate node")}evaluateString(e){return this.evaluate(e).toString()}search(e){}searchBlock(e,r){if(e){r(Do.instance);for(let s of e)s instanceof Array?this.searchBlock(s,r):s.search(r);r(Uo.instance)}}},Do=class extends Ir{};Do.instance=new Do;var Uo=class extends Ir{};Uo.instance=new Uo;var Be=class extends Ir{constructor(){super()}},Jc=class extends Be{constructor(e,r,s,i,n,o){super(),this.calls=new Set,this.name=e,this.args=r,this.returnType=s,this.body=i,this.startLine=n,this.endLine=o}get astNodeType(){return"function"}search(e){this.searchBlock(this.body,e)}},V0=class extends Be{constructor(e){super(),this.expression=e}get astNodeType(){return"staticAssert"}search(e){this.expression.search(e)}},z0=class extends Be{constructor(e,r){super(),this.condition=e,this.body=r}get astNodeType(){return"while"}search(e){this.condition.search(e),this.searchBlock(this.body,e)}},H0=class extends Be{constructor(e){super(),this.body=e}get astNodeType(){return"continuing"}search(e){this.searchBlock(this.body,e)}},G0=class extends Be{constructor(e,r,s,i){super(),this.init=e,this.condition=r,this.increment=s,this.body=i}get astNodeType(){return"for"}search(e){var r,s,i;(r=this.init)===null||r===void 0||r.search(e),(s=this.condition)===null||s===void 0||s.search(e),(i=this.increment)===null||i===void 0||i.search(e),this.searchBlock(this.body,e)}},Os=class extends Be{constructor(e,r,s,i,n){super(),this.name=e,this.type=r,this.storage=s,this.access=i,this.value=n}get astNodeType(){return"var"}search(e){var r;e(this),(r=this.value)===null||r===void 0||r.search(e)}},Qh=class extends Be{constructor(e,r,s){super(),this.name=e,this.type=r,this.value=s}get astNodeType(){return"override"}search(e){var r;(r=this.value)===null||r===void 0||r.search(e)}},Zc=class extends Be{constructor(e,r,s,i,n){super(),this.name=e,this.type=r,this.storage=s,this.access=i,this.value=n}get astNodeType(){return"let"}search(e){var r;e(this),(r=this.value)===null||r===void 0||r.search(e)}},ed=class extends Be{constructor(e,r,s,i,n){super(),this.name=e,this.type=r,this.storage=s,this.access=i,this.value=n}get astNodeType(){return"const"}evaluate(e){return this.value.evaluate(e)}search(e){var r;e(this),(r=this.value)===null||r===void 0||r.search(e)}},ko;(function(t){t.increment="++",t.decrement="--"})(ko||(ko={}));(function(t){function e(r){let s=r;if(s=="parse")throw new Error("Invalid value for IncrementOperator");return t[s]}t.parse=e})(ko||(ko={}));var W0=class extends Be{constructor(e,r){super(),this.operator=e,this.variable=r}get astNodeType(){return"increment"}search(e){this.variable.search(e)}},Qc;(function(t){t.assign="=",t.addAssign="+=",t.subtractAssin="-=",t.multiplyAssign="*=",t.divideAssign="/=",t.moduloAssign="%=",t.andAssign="&=",t.orAssign="|=",t.xorAssign="^=",t.shiftLeftAssign="<<=",t.shiftRightAssign=">>="})(Qc||(Qc={}));(function(t){function e(r){let s=r;if(s=="parse")throw new Error("Invalid value for AssignOperator");return s}t.parse=e})(Qc||(Qc={}));var j0=class extends Be{constructor(e,r,s){super(),this.operator=e,this.variable=r,this.value=s}get astNodeType(){return"assign"}search(e){this.variable.search(e),this.value.search(e)}},td=class extends Be{constructor(e,r){super(),this.name=e,this.args=r}get astNodeType(){return"call"}search(e){for(let r of this.args)r.search(e);e(this)}},X0=class extends Be{constructor(e,r){super(),this.body=e,this.continuing=r}get astNodeType(){return"loop"}},Y0=class extends Be{constructor(e,r){super(),this.condition=e,this.body=r}get astNodeType(){return"body"}},q0=class extends Be{constructor(e,r,s,i){super(),this.condition=e,this.body=r,this.elseif=s,this.else=i}get astNodeType(){return"if"}search(e){this.condition.search(e),this.searchBlock(this.body,e),this.searchBlock(this.elseif,e),this.searchBlock(this.else,e)}},K0=class extends Be{constructor(e){super(),this.value=e}get astNodeType(){return"return"}search(e){var r;(r=this.value)===null||r===void 0||r.search(e)}},$0=class extends Be{constructor(e){super(),this.name=e}get astNodeType(){return"enable"}},J0=class extends Be{constructor(e){super(),this.extensions=e}get astNodeType(){return"requires"}},Z0=class extends Be{constructor(e,r){super(),this.severity=e,this.rule=r}get astNodeType(){return"diagnostic"}},rd=class extends Be{constructor(e,r){super(),this.name=e,this.type=r}get astNodeType(){return"alias"}},Q0=class extends Be{constructor(){super()}get astNodeType(){return"discard"}},ey=class extends Be{constructor(){super()}get astNodeType(){return"break"}},ty=class extends Be{constructor(){super()}get astNodeType(){return"continue"}},Fs=class extends Be{constructor(e){super(),this.name=e}get astNodeType(){return"type"}get isStruct(){return!1}get isArray(){return!1}},Bs=class extends Fs{constructor(e,r,s,i){super(e),this.members=r,this.startLine=s,this.endLine=i}get astNodeType(){return"struct"}get isStruct(){return!0}getMemberIndex(e){for(let r=0;r<this.members.length;r++)if(this.members[r].name==e)return r;return-1}},sd=class extends Fs{constructor(e,r,s){super(e),this.format=r,this.access=s}get astNodeType(){return"template"}},ry=class extends Fs{constructor(e,r,s,i){super(e),this.storage=r,this.type=s,this.access=i}get astNodeType(){return"pointer"}},id=class extends Fs{constructor(e,r,s,i){super(e),this.attributes=r,this.format=s,this.count=i}get astNodeType(){return"array"}get isArray(){return!0}},mn=class extends Fs{constructor(e,r,s){super(e),this.format=r,this.access=s}get astNodeType(){return"sampler"}},Qt=class extends Ir{constructor(){super()}},nd=class extends Qt{constructor(e){super(),this.value=e}get astNodeType(){return"stringExpr"}toString(){return this.value}evaluateString(){return this.value}},Ai=class extends Qt{constructor(e,r){super(),this.type=e,this.args=r}get astNodeType(){return"createExpr"}search(e){e(this);for(let r of this.args)r.search(e)}},od=class extends Qt{constructor(e,r){super(),this.name=e,this.args=r}get astNodeType(){return"callExpr"}evaluate(e){switch(this.name){case"abs":return Math.abs(this.args[0].evaluate(e));case"acos":return Math.acos(this.args[0].evaluate(e));case"acosh":return Math.acosh(this.args[0].evaluate(e));case"asin":return Math.asin(this.args[0].evaluate(e));case"asinh":return Math.asinh(this.args[0].evaluate(e));case"atan":return Math.atan(this.args[0].evaluate(e));case"atan2":return Math.atan2(this.args[0].evaluate(e),this.args[1].evaluate(e));case"atanh":return Math.atanh(this.args[0].evaluate(e));case"ceil":return Math.ceil(this.args[0].evaluate(e));case"clamp":return Math.min(Math.max(this.args[0].evaluate(e),this.args[1].evaluate(e)),this.args[2].evaluate(e));case"cos":return Math.cos(this.args[0].evaluate(e));case"degrees":return this.args[0].evaluate(e)*180/Math.PI;case"distance":return Math.sqrt(Math.pow(this.args[0].evaluate(e)-this.args[1].evaluate(e),2));case"dot":case"exp":return Math.exp(this.args[0].evaluate(e));case"exp2":return Math.pow(2,this.args[0].evaluate(e));case"floor":return Math.floor(this.args[0].evaluate(e));case"fma":return this.args[0].evaluate(e)*this.args[1].evaluate(e)+this.args[2].evaluate(e);case"fract":return this.args[0].evaluate(e)-Math.floor(this.args[0].evaluate(e));case"inverseSqrt":return 1/Math.sqrt(this.args[0].evaluate(e));case"log":return Math.log(this.args[0].evaluate(e));case"log2":return Math.log2(this.args[0].evaluate(e));case"max":return Math.max(this.args[0].evaluate(e),this.args[1].evaluate(e));case"min":return Math.min(this.args[0].evaluate(e),this.args[1].evaluate(e));case"mix":return this.args[0].evaluate(e)*(1-this.args[2].evaluate(e))+this.args[1].evaluate(e)*this.args[2].evaluate(e);case"modf":return this.args[0].evaluate(e)-Math.floor(this.args[0].evaluate(e));case"pow":return Math.pow(this.args[0].evaluate(e),this.args[1].evaluate(e));case"radians":return this.args[0].evaluate(e)*Math.PI/180;case"round":return Math.round(this.args[0].evaluate(e));case"sign":return Math.sign(this.args[0].evaluate(e));case"sin":return Math.sin(this.args[0].evaluate(e));case"sinh":return Math.sinh(this.args[0].evaluate(e));case"saturate":return Math.min(Math.max(this.args[0].evaluate(e),0),1);case"smoothstep":return this.args[0].evaluate(e)*this.args[0].evaluate(e)*(3-2*this.args[0].evaluate(e));case"sqrt":return Math.sqrt(this.args[0].evaluate(e));case"step":return this.args[0].evaluate(e)<this.args[1].evaluate(e)?0:1;case"tan":return Math.tan(this.args[0].evaluate(e));case"tanh":return Math.tanh(this.args[0].evaluate(e));case"trunc":return Math.trunc(this.args[0].evaluate(e));default:throw new Error("Non const function: "+this.name)}}search(e){for(let r of this.args)r.search(e);e(this)}},el=class extends Qt{constructor(e){super(),this.name=e}get astNodeType(){return"varExpr"}search(e){e(this),this.postfix&&this.postfix.search(e)}evaluate(e){let r=e.constants.get(this.name);if(!r)throw new Error("Cannot evaluate node");return r.evaluate(e)}},ad=class extends Qt{constructor(e,r){super(),this.name=e,this.initializer=r}get astNodeType(){return"constExpr"}evaluate(e){var r,s;if(this.initializer instanceof Ai){let i=(r=this.postfix)===null||r===void 0?void 0:r.evaluateString(e),n=(s=this.initializer.type)===null||s===void 0?void 0:s.name,o=e.structs.get(n),a=o?.getMemberIndex(i);if(a!=-1)return this.initializer.args[a].evaluate(e);console.log(a)}return this.initializer.evaluate(e)}search(e){this.initializer.search(e)}},cd=class extends Qt{constructor(e){super(),this.value=e}get astNodeType(){return"literalExpr"}evaluate(){return this.value}},sy=class extends Qt{constructor(e,r){super(),this.type=e,this.value=r}get astNodeType(){return"bitcastExpr"}search(e){this.value.search(e)}},iy=class extends Qt{constructor(e,r){super(),this.type=e,this.args=r}get astNodeType(){return"typecastExpr"}evaluate(e){return this.args[0].evaluate(e)}search(e){this.searchBlock(this.args,e)}},ld=class extends Qt{constructor(e){super(),this.contents=e}get astNodeType(){return"groupExpr"}evaluate(e){return this.contents[0].evaluate(e)}search(e){this.searchBlock(this.contents,e)}},ny=class extends Qt{constructor(e){super(),this.index=e}search(e){this.index.search(e)}},ud=class extends Qt{constructor(){super()}},oy=class extends ud{constructor(e,r){super(),this.operator=e,this.right=r}get astNodeType(){return"unaryOp"}evaluate(e){switch(this.operator){case"+":return this.right.evaluate(e);case"-":return-this.right.evaluate(e);case"!":return this.right.evaluate(e)?0:1;case"~":return~this.right.evaluate(e);default:throw new Error("Unknown unary operator: "+this.operator)}}search(e){this.right.search(e)}},lr=class extends ud{constructor(e,r,s){super(),this.operator=e,this.left=r,this.right=s}get astNodeType(){return"binaryOp"}evaluate(e){switch(this.operator){case"+":return this.left.evaluate(e)+this.right.evaluate(e);case"-":return this.left.evaluate(e)-this.right.evaluate(e);case"*":return this.left.evaluate(e)*this.right.evaluate(e);case"/":return this.left.evaluate(e)/this.right.evaluate(e);case"%":return this.left.evaluate(e)%this.right.evaluate(e);case"==":return this.left.evaluate(e)==this.right.evaluate(e)?1:0;case"!=":return this.left.evaluate(e)!=this.right.evaluate(e)?1:0;case"<":return this.left.evaluate(e)<this.right.evaluate(e)?1:0;case">":return this.left.evaluate(e)>this.right.evaluate(e)?1:0;case"<=":return this.left.evaluate(e)<=this.right.evaluate(e)?1:0;case">=":return this.left.evaluate(e)>=this.right.evaluate(e)?1:0;case"&&":return this.left.evaluate(e)&&this.right.evaluate(e)?1:0;case"||":return this.left.evaluate(e)||this.right.evaluate(e)?1:0;default:throw new Error(`Unknown operator ${this.operator}`)}}search(e){this.left.search(e),this.right.search(e)}},fd=class extends Ir{constructor(){super()}},ay=class extends fd{constructor(e,r){super(),this.selector=e,this.body=r}get astNodeType(){return"case"}search(e){this.searchBlock(this.body,e)}},cy=class extends fd{constructor(e){super(),this.body=e}get astNodeType(){return"default"}search(e){this.searchBlock(this.body,e)}},ly=class extends Ir{constructor(e,r,s){super(),this.name=e,this.type=r,this.attributes=s}get astNodeType(){return"argument"}},uy=class extends Ir{constructor(e,r){super(),this.condition=e,this.body=r}get astNodeType(){return"elseif"}search(e){this.condition.search(e),this.searchBlock(this.body,e)}},fy=class extends Ir{constructor(e,r,s){super(),this.name=e,this.type=r,this.attributes=s}get astNodeType(){return"member"}},hy=class extends Ir{constructor(e,r){super(),this.name=e,this.value=r}get astNodeType(){return"attribute"}},O,I;(function(t){t[t.token=0]="token",t[t.keyword=1]="keyword",t[t.reserved=2]="reserved"})(I||(I={}));var R=class{constructor(e,r,s){this.name=e,this.type=r,this.rule=s}toString(){return this.name}},E=class{};O=E;E.none=new R("",I.reserved,"");E.eof=new R("EOF",I.token,"");E.reserved={asm:new R("asm",I.reserved,"asm"),bf16:new R("bf16",I.reserved,"bf16"),do:new R("do",I.reserved,"do"),enum:new R("enum",I.reserved,"enum"),f16:new R("f16",I.reserved,"f16"),f64:new R("f64",I.reserved,"f64"),handle:new R("handle",I.reserved,"handle"),i8:new R("i8",I.reserved,"i8"),i16:new R("i16",I.reserved,"i16"),i64:new R("i64",I.reserved,"i64"),mat:new R("mat",I.reserved,"mat"),premerge:new R("premerge",I.reserved,"premerge"),regardless:new R("regardless",I.reserved,"regardless"),typedef:new R("typedef",I.reserved,"typedef"),u8:new R("u8",I.reserved,"u8"),u16:new R("u16",I.reserved,"u16"),u64:new R("u64",I.reserved,"u64"),unless:new R("unless",I.reserved,"unless"),using:new R("using",I.reserved,"using"),vec:new R("vec",I.reserved,"vec"),void:new R("void",I.reserved,"void")};E.keywords={array:new R("array",I.keyword,"array"),atomic:new R("atomic",I.keyword,"atomic"),bool:new R("bool",I.keyword,"bool"),f32:new R("f32",I.keyword,"f32"),i32:new R("i32",I.keyword,"i32"),mat2x2:new R("mat2x2",I.keyword,"mat2x2"),mat2x3:new R("mat2x3",I.keyword,"mat2x3"),mat2x4:new R("mat2x4",I.keyword,"mat2x4"),mat3x2:new R("mat3x2",I.keyword,"mat3x2"),mat3x3:new R("mat3x3",I.keyword,"mat3x3"),mat3x4:new R("mat3x4",I.keyword,"mat3x4"),mat4x2:new R("mat4x2",I.keyword,"mat4x2"),mat4x3:new R("mat4x3",I.keyword,"mat4x3"),mat4x4:new R("mat4x4",I.keyword,"mat4x4"),ptr:new R("ptr",I.keyword,"ptr"),sampler:new R("sampler",I.keyword,"sampler"),sampler_comparison:new R("sampler_comparison",I.keyword,"sampler_comparison"),struct:new R("struct",I.keyword,"struct"),texture_1d:new R("texture_1d",I.keyword,"texture_1d"),texture_2d:new R("texture_2d",I.keyword,"texture_2d"),texture_2d_array:new R("texture_2d_array",I.keyword,"texture_2d_array"),texture_3d:new R("texture_3d",I.keyword,"texture_3d"),texture_cube:new R("texture_cube",I.keyword,"texture_cube"),texture_cube_array:new R("texture_cube_array",I.keyword,"texture_cube_array"),texture_multisampled_2d:new R("texture_multisampled_2d",I.keyword,"texture_multisampled_2d"),texture_storage_1d:new R("texture_storage_1d",I.keyword,"texture_storage_1d"),texture_storage_2d:new R("texture_storage_2d",I.keyword,"texture_storage_2d"),texture_storage_2d_array:new R("texture_storage_2d_array",I.keyword,"texture_storage_2d_array"),texture_storage_3d:new R("texture_storage_3d",I.keyword,"texture_storage_3d"),texture_depth_2d:new R("texture_depth_2d",I.keyword,"texture_depth_2d"),texture_depth_2d_array:new R("texture_depth_2d_array",I.keyword,"texture_depth_2d_array"),texture_depth_cube:new R("texture_depth_cube",I.keyword,"texture_depth_cube"),texture_depth_cube_array:new R("texture_depth_cube_array",I.keyword,"texture_depth_cube_array"),texture_depth_multisampled_2d:new R("texture_depth_multisampled_2d",I.keyword,"texture_depth_multisampled_2d"),texture_external:new R("texture_external",I.keyword,"texture_external"),u32:new R("u32",I.keyword,"u32"),vec2:new R("vec2",I.keyword,"vec2"),vec3:new R("vec3",I.keyword,"vec3"),vec4:new R("vec4",I.keyword,"vec4"),bitcast:new R("bitcast",I.keyword,"bitcast"),block:new R("block",I.keyword,"block"),break:new R("break",I.keyword,"break"),case:new R("case",I.keyword,"case"),continue:new R("continue",I.keyword,"continue"),continuing:new R("continuing",I.keyword,"continuing"),default:new R("default",I.keyword,"default"),diagnostic:new R("diagnostic",I.keyword,"diagnostic"),discard:new R("discard",I.keyword,"discard"),else:new R("else",I.keyword,"else"),enable:new R("enable",I.keyword,"enable"),fallthrough:new R("fallthrough",I.keyword,"fallthrough"),false:new R("false",I.keyword,"false"),fn:new R("fn",I.keyword,"fn"),for:new R("for",I.keyword,"for"),function:new R("function",I.keyword,"function"),if:new R("if",I.keyword,"if"),let:new R("let",I.keyword,"let"),const:new R("const",I.keyword,"const"),loop:new R("loop",I.keyword,"loop"),while:new R("while",I.keyword,"while"),private:new R("private",I.keyword,"private"),read:new R("read",I.keyword,"read"),read_write:new R("read_write",I.keyword,"read_write"),return:new R("return",I.keyword,"return"),requires:new R("requires",I.keyword,"requires"),storage:new R("storage",I.keyword,"storage"),switch:new R("switch",I.keyword,"switch"),true:new R("true",I.keyword,"true"),alias:new R("alias",I.keyword,"alias"),type:new R("type",I.keyword,"type"),uniform:new R("uniform",I.keyword,"uniform"),var:new R("var",I.keyword,"var"),override:new R("override",I.keyword,"override"),workgroup:new R("workgroup",I.keyword,"workgroup"),write:new R("write",I.keyword,"write"),r8unorm:new R("r8unorm",I.keyword,"r8unorm"),r8snorm:new R("r8snorm",I.keyword,"r8snorm"),r8uint:new R("r8uint",I.keyword,"r8uint"),r8sint:new R("r8sint",I.keyword,"r8sint"),r16uint:new R("r16uint",I.keyword,"r16uint"),r16sint:new R("r16sint",I.keyword,"r16sint"),r16float:new R("r16float",I.keyword,"r16float"),rg8unorm:new R("rg8unorm",I.keyword,"rg8unorm"),rg8snorm:new R("rg8snorm",I.keyword,"rg8snorm"),rg8uint:new R("rg8uint",I.keyword,"rg8uint"),rg8sint:new R("rg8sint",I.keyword,"rg8sint"),r32uint:new R("r32uint",I.keyword,"r32uint"),r32sint:new R("r32sint",I.keyword,"r32sint"),r32float:new R("r32float",I.keyword,"r32float"),rg16uint:new R("rg16uint",I.keyword,"rg16uint"),rg16sint:new R("rg16sint",I.keyword,"rg16sint"),rg16float:new R("rg16float",I.keyword,"rg16float"),rgba8unorm:new R("rgba8unorm",I.keyword,"rgba8unorm"),rgba8unorm_srgb:new R("rgba8unorm_srgb",I.keyword,"rgba8unorm_srgb"),rgba8snorm:new R("rgba8snorm",I.keyword,"rgba8snorm"),rgba8uint:new R("rgba8uint",I.keyword,"rgba8uint"),rgba8sint:new R("rgba8sint",I.keyword,"rgba8sint"),bgra8unorm:new R("bgra8unorm",I.keyword,"bgra8unorm"),bgra8unorm_srgb:new R("bgra8unorm_srgb",I.keyword,"bgra8unorm_srgb"),rgb10a2unorm:new R("rgb10a2unorm",I.keyword,"rgb10a2unorm"),rg11b10float:new R("rg11b10float",I.keyword,"rg11b10float"),rg32uint:new R("rg32uint",I.keyword,"rg32uint"),rg32sint:new R("rg32sint",I.keyword,"rg32sint"),rg32float:new R("rg32float",I.keyword,"rg32float"),rgba16uint:new R("rgba16uint",I.keyword,"rgba16uint"),rgba16sint:new R("rgba16sint",I.keyword,"rgba16sint"),rgba16float:new R("rgba16float",I.keyword,"rgba16float"),rgba32uint:new R("rgba32uint",I.keyword,"rgba32uint"),rgba32sint:new R("rgba32sint",I.keyword,"rgba32sint"),rgba32float:new R("rgba32float",I.keyword,"rgba32float"),static_assert:new R("static_assert",I.keyword,"static_assert")};E.tokens={decimal_float_literal:new R("decimal_float_literal",I.token,/((-?[0-9]*\.[0-9]+|-?[0-9]+\.[0-9]*)((e|E)(\+|-)?[0-9]+)?f?)|(-?[0-9]+(e|E)(\+|-)?[0-9]+f?)|([0-9]+f)/),hex_float_literal:new R("hex_float_literal",I.token,/-?0x((([0-9a-fA-F]*\.[0-9a-fA-F]+|[0-9a-fA-F]+\.[0-9a-fA-F]*)((p|P)(\+|-)?[0-9]+f?)?)|([0-9a-fA-F]+(p|P)(\+|-)?[0-9]+f?))/),int_literal:new R("int_literal",I.token,/-?0x[0-9a-fA-F]+|0i?|-?[1-9][0-9]*i?/),uint_literal:new R("uint_literal",I.token,/0x[0-9a-fA-F]+u|0u|[1-9][0-9]*u/),ident:new R("ident",I.token,/[_a-zA-Z][0-9a-zA-Z_]*/),and:new R("and",I.token,"&"),and_and:new R("and_and",I.token,"&&"),arrow:new R("arrow ",I.token,"->"),attr:new R("attr",I.token,"@"),forward_slash:new R("forward_slash",I.token,"/"),bang:new R("bang",I.token,"!"),bracket_left:new R("bracket_left",I.token,"["),bracket_right:new R("bracket_right",I.token,"]"),brace_left:new R("brace_left",I.token,"{"),brace_right:new R("brace_right",I.token,"}"),colon:new R("colon",I.token,":"),comma:new R("comma",I.token,","),equal:new R("equal",I.token,"="),equal_equal:new R("equal_equal",I.token,"=="),not_equal:new R("not_equal",I.token,"!="),greater_than:new R("greater_than",I.token,">"),greater_than_equal:new R("greater_than_equal",I.token,">="),shift_right:new R("shift_right",I.token,">>"),less_than:new R("less_than",I.token,"<"),less_than_equal:new R("less_than_equal",I.token,"<="),shift_left:new R("shift_left",I.token,"<<"),modulo:new R("modulo",I.token,"%"),minus:new R("minus",I.token,"-"),minus_minus:new R("minus_minus",I.token,"--"),period:new R("period",I.token,"."),plus:new R("plus",I.token,"+"),plus_plus:new R("plus_plus",I.token,"++"),or:new R("or",I.token,"|"),or_or:new R("or_or",I.token,"||"),paren_left:new R("paren_left",I.token,"("),paren_right:new R("paren_right",I.token,")"),semicolon:new R("semicolon",I.token,";"),star:new R("star",I.token,"*"),tilde:new R("tilde",I.token,"~"),underscore:new R("underscore",I.token,"_"),xor:new R("xor",I.token,"^"),plus_equal:new R("plus_equal",I.token,"+="),minus_equal:new R("minus_equal",I.token,"-="),times_equal:new R("times_equal",I.token,"*="),division_equal:new R("division_equal",I.token,"/="),modulo_equal:new R("modulo_equal",I.token,"%="),and_equal:new R("and_equal",I.token,"&="),or_equal:new R("or_equal",I.token,"|="),xor_equal:new R("xor_equal",I.token,"^="),shift_right_equal:new R("shift_right_equal",I.token,">>="),shift_left_equal:new R("shift_left_equal",I.token,"<<=")};E.simpleTokens={"@":O.tokens.attr,"{":O.tokens.brace_left,"}":O.tokens.brace_right,":":O.tokens.colon,",":O.tokens.comma,"(":O.tokens.paren_left,")":O.tokens.paren_right,";":O.tokens.semicolon};E.literalTokens={"&":O.tokens.and,"&&":O.tokens.and_and,"->":O.tokens.arrow,"/":O.tokens.forward_slash,"!":O.tokens.bang,"[":O.tokens.bracket_left,"]":O.tokens.bracket_right,"=":O.tokens.equal,"==":O.tokens.equal_equal,"!=":O.tokens.not_equal,">":O.tokens.greater_than,">=":O.tokens.greater_than_equal,">>":O.tokens.shift_right,"<":O.tokens.less_than,"<=":O.tokens.less_than_equal,"<<":O.tokens.shift_left,"%":O.tokens.modulo,"-":O.tokens.minus,"--":O.tokens.minus_minus,".":O.tokens.period,"+":O.tokens.plus,"++":O.tokens.plus_plus,"|":O.tokens.or,"||":O.tokens.or_or,"*":O.tokens.star,"~":O.tokens.tilde,_:O.tokens.underscore,"^":O.tokens.xor,"+=":O.tokens.plus_equal,"-=":O.tokens.minus_equal,"*=":O.tokens.times_equal,"/=":O.tokens.division_equal,"%=":O.tokens.modulo_equal,"&=":O.tokens.and_equal,"|=":O.tokens.or_equal,"^=":O.tokens.xor_equal,">>=":O.tokens.shift_right_equal,"<<=":O.tokens.shift_left_equal};E.regexTokens={decimal_float_literal:O.tokens.decimal_float_literal,hex_float_literal:O.tokens.hex_float_literal,int_literal:O.tokens.int_literal,uint_literal:O.tokens.uint_literal,ident:O.tokens.ident};E.storage_class=[O.keywords.function,O.keywords.private,O.keywords.workgroup,O.keywords.uniform,O.keywords.storage];E.access_mode=[O.keywords.read,O.keywords.write,O.keywords.read_write];E.sampler_type=[O.keywords.sampler,O.keywords.sampler_comparison];E.sampled_texture_type=[O.keywords.texture_1d,O.keywords.texture_2d,O.keywords.texture_2d_array,O.keywords.texture_3d,O.keywords.texture_cube,O.keywords.texture_cube_array];E.multisampled_texture_type=[O.keywords.texture_multisampled_2d];E.storage_texture_type=[O.keywords.texture_storage_1d,O.keywords.texture_storage_2d,O.keywords.texture_storage_2d_array,O.keywords.texture_storage_3d];E.depth_texture_type=[O.keywords.texture_depth_2d,O.keywords.texture_depth_2d_array,O.keywords.texture_depth_cube,O.keywords.texture_depth_cube_array,O.keywords.texture_depth_multisampled_2d];E.texture_external_type=[O.keywords.texture_external];E.any_texture_type=[...O.sampled_texture_type,...O.multisampled_texture_type,...O.storage_texture_type,...O.depth_texture_type,...O.texture_external_type];E.texel_format=[O.keywords.r8unorm,O.keywords.r8snorm,O.keywords.r8uint,O.keywords.r8sint,O.keywords.r16uint,O.keywords.r16sint,O.keywords.r16float,O.keywords.rg8unorm,O.keywords.rg8snorm,O.keywords.rg8uint,O.keywords.rg8sint,O.keywords.r32uint,O.keywords.r32sint,O.keywords.r32float,O.keywords.rg16uint,O.keywords.rg16sint,O.keywords.rg16float,O.keywords.rgba8unorm,O.keywords.rgba8unorm_srgb,O.keywords.rgba8snorm,O.keywords.rgba8uint,O.keywords.rgba8sint,O.keywords.bgra8unorm,O.keywords.bgra8unorm_srgb,O.keywords.rgb10a2unorm,O.keywords.rg11b10float,O.keywords.rg32uint,O.keywords.rg32sint,O.keywords.rg32float,O.keywords.rgba16uint,O.keywords.rgba16sint,O.keywords.rgba16float,O.keywords.rgba32uint,O.keywords.rgba32sint,O.keywords.rgba32float];E.const_literal=[O.tokens.int_literal,O.tokens.uint_literal,O.tokens.decimal_float_literal,O.tokens.hex_float_literal,O.keywords.true,O.keywords.false];E.literal_or_ident=[O.tokens.ident,O.tokens.int_literal,O.tokens.uint_literal,O.tokens.decimal_float_literal,O.tokens.hex_float_literal];E.element_count_expression=[O.tokens.int_literal,O.tokens.uint_literal,O.tokens.ident];E.template_types=[O.keywords.vec2,O.keywords.vec3,O.keywords.vec4,O.keywords.mat2x2,O.keywords.mat2x3,O.keywords.mat2x4,O.keywords.mat3x2,O.keywords.mat3x3,O.keywords.mat3x4,O.keywords.mat4x2,O.keywords.mat4x3,O.keywords.mat4x4,O.keywords.atomic,O.keywords.bitcast,...O.any_texture_type];E.attribute_name=[O.tokens.ident,O.keywords.block,O.keywords.diagnostic];E.assignment_operators=[O.tokens.equal,O.tokens.plus_equal,O.tokens.minus_equal,O.tokens.times_equal,O.tokens.division_equal,O.tokens.modulo_equal,O.tokens.and_equal,O.tokens.or_equal,O.tokens.xor_equal,O.tokens.shift_right_equal,O.tokens.shift_left_equal];E.increment_operators=[O.tokens.plus_plus,O.tokens.minus_minus];var hd=class{constructor(e,r,s){this.type=e,this.lexeme=r,this.line=s}toString(){return this.lexeme}isTemplateType(){return E.template_types.indexOf(this.type)!=-1}isArrayType(){return this.type==E.keywords.array}isArrayOrTemplateType(){return this.isArrayType()||this.isTemplateType()}},dy=class{constructor(e){this._tokens=[],this._start=0,this._current=0,this._line=1,this._source=e??""}scanTokens(){for(;!this._isAtEnd();)if(this._start=this._current,!this.scanToken())throw`Invalid syntax at line ${this._line}`;return this._tokens.push(new hd(E.eof,"",this._line)),this._tokens}scanToken(){let e=this._advance();if(e==`
`)return this._line++,!0;if(this._isWhitespace(e))return!0;if(e=="/"){if(this._peekAhead()=="/"){for(;e!=`
`;){if(this._isAtEnd())return!0;e=this._advance()}return this._line++,!0}else if(this._peekAhead()=="*"){this._advance();let o=1;for(;o>0;){if(this._isAtEnd())return!0;if(e=this._advance(),e==`
`)this._line++;else if(e=="*"){if(this._peekAhead()=="/"&&(this._advance(),o--,o==0))return!0}else e=="/"&&this._peekAhead()=="*"&&(this._advance(),o++)}return!0}}let r=E.simpleTokens[e];if(r)return this._addToken(r),!0;let s=E.none,i=this._isAlpha(e),n=e==="_";if(this._isAlphaNumeric(e)){let o=this._peekAhead();for(;this._isAlphaNumeric(o);)e+=this._advance(),o=this._peekAhead()}if(i){let o=E.keywords[e];if(o)return this._addToken(o),!0}if(i||n)return this._addToken(E.tokens.ident),!0;for(;;){let o=this._findType(e),a=this._peekAhead();if(e=="-"&&this._tokens.length>0){if(a=="=")return this._current++,e+=a,this._addToken(E.tokens.minus_equal),!0;if(a=="-")return this._current++,e+=a,this._addToken(E.tokens.minus_minus),!0;let c=this._tokens.length-1;if((E.literal_or_ident.indexOf(this._tokens[c].type)!=-1||this._tokens[c].type==E.tokens.paren_right)&&a!=">")return this._addToken(o),!0}if(e==">"&&(a==">"||a=="=")){let c=!1,l=this._tokens.length-1;for(let u=0;u<5&&l>=0&&E.assignment_operators.indexOf(this._tokens[l].type)===-1;++u,--l)if(this._tokens[l].type===E.tokens.less_than){l>0&&this._tokens[l-1].isArrayOrTemplateType()&&(c=!0);break}if(c)return this._addToken(o),!0}if(o===E.none){let c=e,l=0,u=2;for(let f=0;f<u;++f)if(c+=this._peekAhead(f),o=this._findType(c),o!==E.none){l=f;break}if(o===E.none)return s===E.none?!1:(this._current--,this._addToken(s),!0);e=c,this._current+=l+1}if(s=o,this._isAtEnd())break;e+=this._advance()}return s===E.none?!1:(this._addToken(s),!0)}_findType(e){for(let s in E.regexTokens){let i=E.regexTokens[s];if(this._match(e,i.rule))return i}let r=E.literalTokens[e];return r||E.none}_match(e,r){let s=r.exec(e);return s&&s.index==0&&s[0]==e}_isAtEnd(){return this._current>=this._source.length}_isAlpha(e){return e>="a"&&e<="z"||e>="A"&&e<="Z"}_isAlphaNumeric(e){return e>="a"&&e<="z"||e>="A"&&e<="Z"||e=="_"||e>="0"&&e<="9"}_isWhitespace(e){return e==" "||e=="	"||e=="\r"}_advance(e=0){let r=this._source[this._current];return e=e||0,e++,this._current+=e,r}_peekAhead(e=0){return e=e||0,this._current+e>=this._source.length?"\0":this._source[this._current+e]}_addToken(e){let r=this._source.substring(this._start,this._current);this._tokens.push(new hd(e,r,this._line))}},py=class{constructor(){this._tokens=[],this._current=0,this._currentLine=0,this._context=new k0,this._deferArrayCountEval=[]}parse(e){this._initialize(e),this._deferArrayCountEval.length=0;let r=[];for(;!this._isAtEnd();){let s=this._global_decl_or_directive();if(!s)break;r.push(s)}if(this._deferArrayCountEval.length>0){for(let s of this._deferArrayCountEval){let i=s.arrayType,n=s.countNode;if(n instanceof el){let a=n.name,c=this._context.constants.get(a);if(c)try{let l=c.evaluate(this._context);i.count=l}catch{}}}this._deferArrayCountEval.length=0}return r}_initialize(e){if(e)if(typeof e=="string"){let r=new dy(e);this._tokens=r.scanTokens()}else this._tokens=e;else this._tokens=[];this._current=0}_error(e,r){return{token:e,message:r,toString:function(){return`${r}`}}}_isAtEnd(){return this._current>=this._tokens.length||this._peek().type==E.eof}_match(e){if(e instanceof R)return this._check(e)?(this._advance(),!0):!1;for(let r=0,s=e.length;r<s;++r){let i=e[r];if(this._check(i))return this._advance(),!0}return!1}_consume(e,r){if(this._check(e))return this._advance();throw this._error(this._peek(),r)}_check(e){if(this._isAtEnd())return!1;let r=this._peek();if(e instanceof Array){let s=r.type;return e.indexOf(s)!=-1}return r.type==e}_advance(){var e,r;return this._currentLine=(r=(e=this._peek())===null||e===void 0?void 0:e.line)!==null&&r!==void 0?r:-1,this._isAtEnd()||this._current++,this._previous()}_peek(){return this._tokens[this._current]}_previous(){return this._tokens[this._current-1]}_global_decl_or_directive(){for(;this._match(E.tokens.semicolon)&&!this._isAtEnd(););if(this._match(E.keywords.alias)){let r=this._type_alias();return this._consume(E.tokens.semicolon,"Expected ';'"),r}if(this._match(E.keywords.diagnostic)){let r=this._diagnostic();return this._consume(E.tokens.semicolon,"Expected ';'"),r}if(this._match(E.keywords.requires)){let r=this._requires_directive();return this._consume(E.tokens.semicolon,"Expected ';'"),r}if(this._match(E.keywords.enable)){let r=this._enable_directive();return this._consume(E.tokens.semicolon,"Expected ';'"),r}let e=this._attribute();if(this._check(E.keywords.var)){let r=this._global_variable_decl();return r!=null&&(r.attributes=e),this._consume(E.tokens.semicolon,"Expected ';'."),r}if(this._check(E.keywords.override)){let r=this._override_variable_decl();return r!=null&&(r.attributes=e),this._consume(E.tokens.semicolon,"Expected ';'."),r}if(this._check(E.keywords.let)){let r=this._global_let_decl();return r!=null&&(r.attributes=e),this._consume(E.tokens.semicolon,"Expected ';'."),r}if(this._check(E.keywords.const)){let r=this._global_const_decl();return r!=null&&(r.attributes=e),this._consume(E.tokens.semicolon,"Expected ';'."),r}if(this._check(E.keywords.struct)){let r=this._struct_decl();return r!=null&&(r.attributes=e),r}if(this._check(E.keywords.fn)){let r=this._function_decl();return r!=null&&(r.attributes=e),r}return null}_function_decl(){if(!this._match(E.keywords.fn))return null;let e=this._currentLine,r=this._consume(E.tokens.ident,"Expected function name.").toString();this._consume(E.tokens.paren_left,"Expected '(' for function arguments.");let s=[];if(!this._check(E.tokens.paren_right))do{if(this._check(E.tokens.paren_right))break;let a=this._attribute(),c=this._consume(E.tokens.ident,"Expected argument name.").toString();this._consume(E.tokens.colon,"Expected ':' for argument type.");let l=this._attribute(),u=this._type_decl();u!=null&&(u.attributes=l,s.push(new ly(c,u,a)))}while(this._match(E.tokens.comma));this._consume(E.tokens.paren_right,"Expected ')' after function arguments.");let i=null;if(this._match(E.tokens.arrow)){let a=this._attribute();i=this._type_decl(),i!=null&&(i.attributes=a)}let n=this._compound_statement(),o=this._currentLine;return new Jc(r,s,i,n,e,o)}_compound_statement(){let e=[];for(this._consume(E.tokens.brace_left,"Expected '{' for block.");!this._check(E.tokens.brace_right);){let r=this._statement();r!==null&&e.push(r)}return this._consume(E.tokens.brace_right,"Expected '}' for block."),e}_statement(){for(;this._match(E.tokens.semicolon)&&!this._isAtEnd(););if(this._check(E.tokens.attr)&&this._attribute(),this._check(E.keywords.if))return this._if_statement();if(this._check(E.keywords.switch))return this._switch_statement();if(this._check(E.keywords.loop))return this._loop_statement();if(this._check(E.keywords.for))return this._for_statement();if(this._check(E.keywords.while))return this._while_statement();if(this._check(E.keywords.continuing))return this._continuing_statement();if(this._check(E.keywords.static_assert))return this._static_assert_statement();if(this._check(E.tokens.brace_left))return this._compound_statement();let e=null;return this._check(E.keywords.return)?e=this._return_statement():this._check([E.keywords.var,E.keywords.let,E.keywords.const])?e=this._variable_statement():this._match(E.keywords.discard)?e=new Q0:this._match(E.keywords.break)?e=new ey:this._match(E.keywords.continue)?e=new ty:e=this._increment_decrement_statement()||this._func_call_statement()||this._assignment_statement(),e!=null&&this._consume(E.tokens.semicolon,"Expected ';' after statement."),e}_static_assert_statement(){if(!this._match(E.keywords.static_assert))return null;let e=this._optional_paren_expression();return new V0(e)}_while_statement(){if(!this._match(E.keywords.while))return null;let e=this._optional_paren_expression();this._check(E.tokens.attr)&&this._attribute();let r=this._compound_statement();return new z0(e,r)}_continuing_statement(){if(!this._match(E.keywords.continuing))return null;let e=this._compound_statement();return new H0(e)}_for_statement(){if(!this._match(E.keywords.for))return null;this._consume(E.tokens.paren_left,"Expected '('.");let e=this._check(E.tokens.semicolon)?null:this._for_init();this._consume(E.tokens.semicolon,"Expected ';'.");let r=this._check(E.tokens.semicolon)?null:this._short_circuit_or_expression();this._consume(E.tokens.semicolon,"Expected ';'.");let s=this._check(E.tokens.paren_right)?null:this._for_increment();this._consume(E.tokens.paren_right,"Expected ')'."),this._check(E.tokens.attr)&&this._attribute();let i=this._compound_statement();return new G0(e,r,s,i)}_for_init(){return this._variable_statement()||this._func_call_statement()||this._assignment_statement()}_for_increment(){return this._func_call_statement()||this._increment_decrement_statement()||this._assignment_statement()}_variable_statement(){if(this._check(E.keywords.var)){let e=this._variable_decl();if(e===null)throw this._error(this._peek(),"Variable declaration expected.");let r=null;return this._match(E.tokens.equal)&&(r=this._short_circuit_or_expression()),new Os(e.name,e.type,e.storage,e.access,r)}if(this._match(E.keywords.let)){let e=this._consume(E.tokens.ident,"Expected name for let.").toString(),r=null;if(this._match(E.tokens.colon)){let i=this._attribute();r=this._type_decl(),r!=null&&(r.attributes=i)}this._consume(E.tokens.equal,"Expected '=' for let.");let s=this._short_circuit_or_expression();return new Zc(e,r,null,null,s)}if(this._match(E.keywords.const)){let e=this._consume(E.tokens.ident,"Expected name for const.").toString(),r=null;if(this._match(E.tokens.colon)){let i=this._attribute();r=this._type_decl(),r!=null&&(r.attributes=i)}this._consume(E.tokens.equal,"Expected '=' for const.");let s=this._short_circuit_or_expression();return new ed(e,r,null,null,s)}return null}_increment_decrement_statement(){let e=this._current,r=this._unary_expression();if(r==null)return null;if(!this._check(E.increment_operators))return this._current=e,null;let s=this._consume(E.increment_operators,"Expected increment operator");return new W0(s.type===E.tokens.plus_plus?ko.increment:ko.decrement,r)}_assignment_statement(){let e=null;if(this._check(E.tokens.brace_right))return null;let r=this._match(E.tokens.underscore);if(r||(e=this._unary_expression()),!r&&e==null)return null;let s=this._consume(E.assignment_operators,"Expected assignment operator."),i=this._short_circuit_or_expression();return new j0(Qc.parse(s.lexeme),e,i)}_func_call_statement(){if(!this._check(E.tokens.ident))return null;let e=this._current,r=this._consume(E.tokens.ident,"Expected function name."),s=this._argument_expression_list();return s===null?(this._current=e,null):new td(r.lexeme,s)}_loop_statement(){if(!this._match(E.keywords.loop))return null;this._check(E.tokens.attr)&&this._attribute(),this._consume(E.tokens.brace_left,"Expected '{' for loop.");let e=[],r=this._statement();for(;r!==null;){if(Array.isArray(r))for(let i of r)e.push(i);else e.push(r);r=this._statement()}let s=null;return this._match(E.keywords.continuing)&&(s=this._compound_statement()),this._consume(E.tokens.brace_right,"Expected '}' for loop."),new X0(e,s)}_switch_statement(){if(!this._match(E.keywords.switch))return null;let e=this._optional_paren_expression();this._check(E.tokens.attr)&&this._attribute(),this._consume(E.tokens.brace_left,"Expected '{' for switch.");let r=this._switch_body();if(r==null||r.length==0)throw this._error(this._previous(),"Expected 'case' or 'default'.");return this._consume(E.tokens.brace_right,"Expected '}' for switch."),new Y0(e,r)}_switch_body(){let e=[];if(this._match(E.keywords.case)){let r=this._case_selectors();this._match(E.tokens.colon),this._check(E.tokens.attr)&&this._attribute(),this._consume(E.tokens.brace_left,"Exected '{' for switch case.");let s=this._case_body();this._consume(E.tokens.brace_right,"Exected '}' for switch case."),e.push(new ay(r,s))}if(this._match(E.keywords.default)){this._match(E.tokens.colon),this._check(E.tokens.attr)&&this._attribute(),this._consume(E.tokens.brace_left,"Exected '{' for switch default.");let r=this._case_body();this._consume(E.tokens.brace_right,"Exected '}' for switch default."),e.push(new cy(r))}if(this._check([E.keywords.default,E.keywords.case])){let r=this._switch_body();e.push(r[0])}return e}_case_selectors(){let e=[this._shift_expression()];for(;this._match(E.tokens.comma);)e.push(this._shift_expression());return e}_case_body(){if(this._match(E.keywords.fallthrough))return this._consume(E.tokens.semicolon,"Expected ';'"),[];let e=this._statement();if(e==null)return[];e instanceof Array||(e=[e]);let r=this._case_body();return r.length==0?e:[...e,r[0]]}_if_statement(){if(!this._match(E.keywords.if))return null;let e=this._optional_paren_expression();this._check(E.tokens.attr)&&this._attribute();let r=this._compound_statement(),s=[];this._match_elseif()&&(this._check(E.tokens.attr)&&this._attribute(),s=this._elseif_statement(s));let i=null;return this._match(E.keywords.else)&&(this._check(E.tokens.attr)&&this._attribute(),i=this._compound_statement()),new q0(e,r,s,i)}_match_elseif(){return this._tokens[this._current].type===E.keywords.else&&this._tokens[this._current+1].type===E.keywords.if?(this._advance(),this._advance(),!0):!1}_elseif_statement(e=[]){let r=this._optional_paren_expression(),s=this._compound_statement();return e.push(new uy(r,s)),this._match_elseif()&&(this._check(E.tokens.attr)&&this._attribute(),this._elseif_statement(e)),e}_return_statement(){if(!this._match(E.keywords.return))return null;let e=this._short_circuit_or_expression();return new K0(e)}_short_circuit_or_expression(){let e=this._short_circuit_and_expr();for(;this._match(E.tokens.or_or);)e=new lr(this._previous().toString(),e,this._short_circuit_and_expr());return e}_short_circuit_and_expr(){let e=this._inclusive_or_expression();for(;this._match(E.tokens.and_and);)e=new lr(this._previous().toString(),e,this._inclusive_or_expression());return e}_inclusive_or_expression(){let e=this._exclusive_or_expression();for(;this._match(E.tokens.or);)e=new lr(this._previous().toString(),e,this._exclusive_or_expression());return e}_exclusive_or_expression(){let e=this._and_expression();for(;this._match(E.tokens.xor);)e=new lr(this._previous().toString(),e,this._and_expression());return e}_and_expression(){let e=this._equality_expression();for(;this._match(E.tokens.and);)e=new lr(this._previous().toString(),e,this._equality_expression());return e}_equality_expression(){let e=this._relational_expression();return this._match([E.tokens.equal_equal,E.tokens.not_equal])?new lr(this._previous().toString(),e,this._relational_expression()):e}_relational_expression(){let e=this._shift_expression();for(;this._match([E.tokens.less_than,E.tokens.greater_than,E.tokens.less_than_equal,E.tokens.greater_than_equal]);)e=new lr(this._previous().toString(),e,this._shift_expression());return e}_shift_expression(){let e=this._additive_expression();for(;this._match([E.tokens.shift_left,E.tokens.shift_right]);)e=new lr(this._previous().toString(),e,this._additive_expression());return e}_additive_expression(){let e=this._multiplicative_expression();for(;this._match([E.tokens.plus,E.tokens.minus]);)e=new lr(this._previous().toString(),e,this._multiplicative_expression());return e}_multiplicative_expression(){let e=this._unary_expression();for(;this._match([E.tokens.star,E.tokens.forward_slash,E.tokens.modulo]);)e=new lr(this._previous().toString(),e,this._unary_expression());return e}_unary_expression(){return this._match([E.tokens.minus,E.tokens.bang,E.tokens.tilde,E.tokens.star,E.tokens.and])?new oy(this._previous().toString(),this._unary_expression()):this._singular_expression()}_singular_expression(){let e=this._primary_expression(),r=this._postfix_expression();return r&&(e.postfix=r),e}_postfix_expression(){if(this._match(E.tokens.bracket_left)){let e=this._short_circuit_or_expression();this._consume(E.tokens.bracket_right,"Expected ']'.");let r=new ny(e),s=this._postfix_expression();return s&&(r.postfix=s),r}if(this._match(E.tokens.period)){let e=this._consume(E.tokens.ident,"Expected member name."),r=this._postfix_expression(),s=new nd(e.lexeme);return r&&(s.postfix=r),s}return null}_getStruct(e){return this._context.aliases.has(e)?this._context.aliases.get(e).type:this._context.structs.has(e)?this._context.structs.get(e):null}_primary_expression(){if(this._match(E.tokens.ident)){let s=this._previous().toString();if(this._check(E.tokens.paren_left)){let i=this._argument_expression_list(),n=this._getStruct(s);return n!=null?new Ai(n,i):new od(s,i)}if(this._context.constants.has(s)){let i=this._context.constants.get(s);return new ad(s,i.value)}return new el(s)}if(this._match(E.const_literal))return new cd(parseFloat(this._previous().toString()));if(this._check(E.tokens.paren_left))return this._paren_expression();if(this._match(E.keywords.bitcast)){this._consume(E.tokens.less_than,"Expected '<'.");let s=this._type_decl();this._consume(E.tokens.greater_than,"Expected '>'.");let i=this._paren_expression();return new sy(s,i)}let e=this._type_decl(),r=this._argument_expression_list();return new iy(e,r)}_argument_expression_list(){if(!this._match(E.tokens.paren_left))return null;let e=[];do{if(this._check(E.tokens.paren_right))break;let r=this._short_circuit_or_expression();e.push(r)}while(this._match(E.tokens.comma));return this._consume(E.tokens.paren_right,"Expected ')' for agument list"),e}_optional_paren_expression(){this._match(E.tokens.paren_left);let e=this._short_circuit_or_expression();return this._match(E.tokens.paren_right),new ld([e])}_paren_expression(){this._consume(E.tokens.paren_left,"Expected '('.");let e=this._short_circuit_or_expression();return this._consume(E.tokens.paren_right,"Expected ')'."),new ld([e])}_struct_decl(){if(!this._match(E.keywords.struct))return null;let e=this._currentLine,r=this._consume(E.tokens.ident,"Expected name for struct.").toString();this._consume(E.tokens.brace_left,"Expected '{' for struct body.");let s=[];for(;!this._check(E.tokens.brace_right);){let o=this._attribute(),a=this._consume(E.tokens.ident,"Expected variable name.").toString();this._consume(E.tokens.colon,"Expected ':' for struct member type.");let c=this._attribute(),l=this._type_decl();l!=null&&(l.attributes=c),this._check(E.tokens.brace_right)?this._match(E.tokens.comma):this._consume(E.tokens.comma,"Expected ',' for struct member."),s.push(new fy(a,l,o))}this._consume(E.tokens.brace_right,"Expected '}' after struct body.");let i=this._currentLine,n=new Bs(r,s,e,i);return this._context.structs.set(r,n),n}_global_variable_decl(){let e=this._variable_decl();return e&&this._match(E.tokens.equal)&&(e.value=this._const_expression()),e}_override_variable_decl(){let e=this._override_decl();return e&&this._match(E.tokens.equal)&&(e.value=this._const_expression()),e}_global_const_decl(){if(!this._match(E.keywords.const))return null;let e=this._consume(E.tokens.ident,"Expected variable name"),r=null;if(this._match(E.tokens.colon)){let n=this._attribute();r=this._type_decl(),r!=null&&(r.attributes=n)}let s=null;if(this._match(E.tokens.equal)){let n=this._short_circuit_or_expression();if(n instanceof Ai)s=n;else if(n instanceof ad&&n.initializer instanceof Ai)s=n.initializer;else try{let o=n.evaluate(this._context);s=new cd(o)}catch{s=n}}let i=new ed(e.toString(),r,"","",s);return this._context.constants.set(i.name,i),i}_global_let_decl(){if(!this._match(E.keywords.let))return null;let e=this._consume(E.tokens.ident,"Expected variable name"),r=null;if(this._match(E.tokens.colon)){let i=this._attribute();r=this._type_decl(),r!=null&&(r.attributes=i)}let s=null;return this._match(E.tokens.equal)&&(s=this._const_expression()),new Zc(e.toString(),r,"","",s)}_const_expression(){if(this._match(E.const_literal))return new nd(this._previous().toString());let e=this._type_decl();this._consume(E.tokens.paren_left,"Expected '('.");let r=[];for(;!this._check(E.tokens.paren_right)&&(r.push(this._const_expression()),!!this._check(E.tokens.comma));)this._advance();return this._consume(E.tokens.paren_right,"Expected ')'."),new Ai(e,r)}_variable_decl(){if(!this._match(E.keywords.var))return null;let e="",r="";this._match(E.tokens.less_than)&&(e=this._consume(E.storage_class,"Expected storage_class.").toString(),this._match(E.tokens.comma)&&(r=this._consume(E.access_mode,"Expected access_mode.").toString()),this._consume(E.tokens.greater_than,"Expected '>'."));let s=this._consume(E.tokens.ident,"Expected variable name"),i=null;if(this._match(E.tokens.colon)){let n=this._attribute();i=this._type_decl(),i!=null&&(i.attributes=n)}return new Os(s.toString(),i,e,r,null)}_override_decl(){if(!this._match(E.keywords.override))return null;let e=this._consume(E.tokens.ident,"Expected variable name"),r=null;if(this._match(E.tokens.colon)){let s=this._attribute();r=this._type_decl(),r!=null&&(r.attributes=s)}return new Qh(e.toString(),r,null)}_diagnostic(){this._consume(E.tokens.paren_left,"Expected '('");let e=this._consume(E.tokens.ident,"Expected severity control name.");this._consume(E.tokens.comma,"Expected ','");let r=this._consume(E.tokens.ident,"Expected diagnostic rule name.");return this._consume(E.tokens.paren_right,"Expected ')'"),new Z0(e.toString(),r.toString())}_enable_directive(){let e=this._consume(E.tokens.ident,"identity expected.");return new $0(e.toString())}_requires_directive(){let e=[this._consume(E.tokens.ident,"identity expected.").toString()];for(;this._match(E.tokens.comma);){let r=this._consume(E.tokens.ident,"identity expected.");e.push(r.toString())}return new J0(e)}_type_alias(){let e=this._consume(E.tokens.ident,"identity expected.");this._consume(E.tokens.equal,"Expected '=' for type alias.");let r=this._type_decl();if(r===null)throw this._error(this._peek(),"Expected Type for Alias.");this._context.aliases.has(r.name)&&(r=this._context.aliases.get(r.name).type);let s=new rd(e.toString(),r);return this._context.aliases.set(s.name,s),s}_type_decl(){if(this._check([E.tokens.ident,...E.texel_format,E.keywords.bool,E.keywords.f32,E.keywords.i32,E.keywords.u32])){let s=this._advance(),i=s.toString();return this._context.structs.has(i)?this._context.structs.get(i):this._context.aliases.has(i)?this._context.aliases.get(i).type:new Fs(s.toString())}let e=this._texture_sampler_types();if(e)return e;if(this._check(E.template_types)){let s=this._advance().toString(),i=null,n=null;return this._match(E.tokens.less_than)&&(i=this._type_decl(),n=null,this._match(E.tokens.comma)&&(n=this._consume(E.access_mode,"Expected access_mode for pointer").toString()),this._consume(E.tokens.greater_than,"Expected '>' for type.")),new sd(s,i,n)}if(this._match(E.keywords.ptr)){let s=this._previous().toString();this._consume(E.tokens.less_than,"Expected '<' for pointer.");let i=this._consume(E.storage_class,"Expected storage_class for pointer");this._consume(E.tokens.comma,"Expected ',' for pointer.");let n=this._type_decl(),o=null;return this._match(E.tokens.comma)&&(o=this._consume(E.access_mode,"Expected access_mode for pointer").toString()),this._consume(E.tokens.greater_than,"Expected '>' for pointer."),new ry(s,i.toString(),n,o)}let r=this._attribute();if(this._match(E.keywords.array)){let s=null,i=-1,n=this._previous(),o=null;if(this._match(E.tokens.less_than)){s=this._type_decl(),this._context.aliases.has(s.name)&&(s=this._context.aliases.get(s.name).type);let c="";if(this._match(E.tokens.comma)){o=this._shift_expression();try{c=o.evaluate(this._context).toString(),o=null}catch{c="1"}}this._consume(E.tokens.greater_than,"Expected '>' for array."),i=c?parseInt(c):0}let a=new id(n.toString(),r,s,i);return o&&this._deferArrayCountEval.push({arrayType:a,countNode:o}),a}return null}_texture_sampler_types(){if(this._match(E.sampler_type))return new mn(this._previous().toString(),null,null);if(this._match(E.depth_texture_type))return new mn(this._previous().toString(),null,null);if(this._match(E.sampled_texture_type)||this._match(E.multisampled_texture_type)){let e=this._previous();this._consume(E.tokens.less_than,"Expected '<' for sampler type.");let r=this._type_decl();return this._consume(E.tokens.greater_than,"Expected '>' for sampler type."),new mn(e.toString(),r,null)}if(this._match(E.storage_texture_type)){let e=this._previous();this._consume(E.tokens.less_than,"Expected '<' for sampler type.");let r=this._consume(E.texel_format,"Invalid texel format.").toString();this._consume(E.tokens.comma,"Expected ',' after texel format.");let s=this._consume(E.access_mode,"Expected access mode for storage texture type.").toString();return this._consume(E.tokens.greater_than,"Expected '>' for sampler type."),new mn(e.toString(),r,s)}return null}_attribute(){let e=[];for(;this._match(E.tokens.attr);){let r=this._consume(E.attribute_name,"Expected attribute name"),s=new hy(r.toString(),null);if(this._match(E.tokens.paren_left)){if(s.value=this._consume(E.literal_or_ident,"Expected attribute value").toString(),this._check(E.tokens.comma)){this._advance();do{let i=this._consume(E.literal_or_ident,"Expected attribute value").toString();s.value instanceof Array||(s.value=[s.value]),s.value.push(i)}while(this._match(E.tokens.comma))}this._consume(E.tokens.paren_right,"Expected ')'")}e.push(s)}return e.length==0?null:e}},Ti=class{constructor(e,r){this.name=e,this.attributes=r,this.size=0}get isArray(){return!1}get isStruct(){return!1}get isTemplate(){return!1}},dd=class{constructor(e,r,s){this.name=e,this.type=r,this.attributes=s,this.offset=0,this.size=0}get isArray(){return this.type.isArray}get isStruct(){return this.type.isStruct}get isTemplate(){return this.type.isTemplate}get align(){return this.type.isStruct?this.type.align:0}get members(){return this.type.isStruct?this.type.members:null}get format(){return this.type.isArray?this.type.format:this.type.isTemplate?this.type.format:null}get count(){return this.type.isArray?this.type.count:0}get stride(){return this.type.isArray?this.type.stride:this.size}},Fo=class extends Ti{constructor(e,r){super(e,r),this.members=[],this.align=0,this.startLine=-1,this.endLine=-1,this.inUse=!1}get isStruct(){return!0}},$c=class extends Ti{constructor(e,r){super(e,r),this.count=0,this.stride=0}get isArray(){return!0}},pd=class extends Ti{constructor(e,r,s,i){super(e,s),this.format=r,this.access=i}get isTemplate(){return!0}},xi;(function(t){t[t.Uniform=0]="Uniform",t[t.Storage=1]="Storage",t[t.Texture=2]="Texture",t[t.Sampler=3]="Sampler",t[t.StorageTexture=4]="StorageTexture"})(xi||(xi={}));var Lo=class{constructor(e,r,s,i,n,o,a){this.name=e,this.type=r,this.group=s,this.binding=i,this.attributes=n,this.resourceType=o,this.access=a}get isArray(){return this.type.isArray}get isStruct(){return this.type.isStruct}get isTemplate(){return this.type.isTemplate}get size(){return this.type.size}get align(){return this.type.isStruct?this.type.align:0}get members(){return this.type.isStruct?this.type.members:null}get format(){return this.type.isArray?this.type.format:this.type.isTemplate?this.type.format:null}get count(){return this.type.isArray?this.type.count:0}get stride(){return this.type.isArray?this.type.stride:this.size}},gy=class{constructor(e,r){this.name=e,this.type=r}},No=class{constructor(e,r){this.align=e,this.size=r}},my=class{constructor(e,r,s,i){this.name=e,this.type=r,this.locationType=s,this.location=i,this.interpolation=null}},gd=class{constructor(e,r,s,i){this.name=e,this.type=r,this.locationType=s,this.location=i}},_y=class{constructor(e,r=null){this.stage=null,this.inputs=[],this.outputs=[],this.resources=[],this.startLine=-1,this.endLine=-1,this.inUse=!1,this.calls=new Set,this.name=e,this.stage=r}},yy=class{constructor(){this.vertex=[],this.fragment=[],this.compute=[]}},xy=class{constructor(e,r,s,i){this.name=e,this.type=r,this.attributes=s,this.id=i}},Ay=class{constructor(e){this.resources=null,this.inUse=!1,this.info=null,this.node=e}},ur=class{constructor(e){this.uniforms=[],this.storage=[],this.textures=[],this.samplers=[],this.aliases=[],this.overrides=[],this.structs=[],this.entry=new yy,this.functions=[],this._types=new Map,this._functions=new Map,e&&this.update(e)}_isStorageTexture(e){return e.name=="texture_storage_1d"||e.name=="texture_storage_2d"||e.name=="texture_storage_2d_array"||e.name=="texture_storage_3d"}update(e){let s=new py().parse(e);for(let i of s)i instanceof Jc&&this._functions.set(i.name,new Ay(i));for(let i of s)if(i instanceof Bs){let n=this._getTypeInfo(i,null);n instanceof Fo&&this.structs.push(n)}for(let i of s){if(i instanceof rd){this.aliases.push(this._getAliasInfo(i));continue}if(i instanceof Qh){let n=i,o=this._getAttributeNum(n.attributes,"id",0),a=n.type!=null?this._getTypeInfo(n.type,n.attributes):null;this.overrides.push(new xy(n.name,a,n.attributes,o));continue}if(this._isUniformVar(i)){let n=i,o=this._getAttributeNum(n.attributes,"group",0),a=this._getAttributeNum(n.attributes,"binding",0),c=this._getTypeInfo(n.type,n.attributes),l=new Lo(n.name,c,o,a,n.attributes,xi.Uniform,n.access);this.uniforms.push(l);continue}if(this._isStorageVar(i)){let n=i,o=this._getAttributeNum(n.attributes,"group",0),a=this._getAttributeNum(n.attributes,"binding",0),c=this._getTypeInfo(n.type,n.attributes),l=this._isStorageTexture(c),u=new Lo(n.name,c,o,a,n.attributes,l?xi.StorageTexture:xi.Storage,n.access);this.storage.push(u);continue}if(this._isTextureVar(i)){let n=i,o=this._getAttributeNum(n.attributes,"group",0),a=this._getAttributeNum(n.attributes,"binding",0),c=this._getTypeInfo(n.type,n.attributes),l=this._isStorageTexture(c),u=new Lo(n.name,c,o,a,n.attributes,l?xi.StorageTexture:xi.Texture,n.access);l?this.storage.push(u):this.textures.push(u);continue}if(this._isSamplerVar(i)){let n=i,o=this._getAttributeNum(n.attributes,"group",0),a=this._getAttributeNum(n.attributes,"binding",0),c=this._getTypeInfo(n.type,n.attributes),l=new Lo(n.name,c,o,a,n.attributes,xi.Sampler,n.access);this.samplers.push(l);continue}if(i instanceof Jc){let n=this._getAttribute(i,"vertex"),o=this._getAttribute(i,"fragment"),a=this._getAttribute(i,"compute"),c=n||o||a,l=new _y(i.name,c?.name);l.startLine=i.startLine,l.endLine=i.endLine,this.functions.push(l),this._functions.get(i.name).info=l,c&&(this._functions.get(i.name).inUse=!0,l.inUse=!0,l.resources=this._findResources(i,!!c),l.inputs=this._getInputs(i.args),l.outputs=this._getOutputs(i.returnType),this.entry[c.name].push(l));continue}}for(let i of this._functions.values())i.info&&(i.info.inUse=i.inUse,this._addCalls(i.node,i.info.calls));for(let i of this.uniforms)this._markStructsInUse(i.type);for(let i of this.storage)this._markStructsInUse(i.type)}_markStructsInUse(e){if(e.isStruct){e.inUse=!0;for(let r of e.members)this._markStructsInUse(r.type)}else if(e.isArray)this._markStructsInUse(e.format);else if(e.isTemplate)this._markStructsInUse(e.format);else{let r=this._getAlias(e.name);r&&this._markStructsInUse(r)}}_addCalls(e,r){var s;for(let i of e.calls){let n=(s=this._functions.get(i.name))===null||s===void 0?void 0:s.info;n&&r.add(n)}}findResource(e,r){for(let s of this.uniforms)if(s.group==e&&s.binding==r)return s;for(let s of this.storage)if(s.group==e&&s.binding==r)return s;for(let s of this.textures)if(s.group==e&&s.binding==r)return s;for(let s of this.samplers)if(s.group==e&&s.binding==r)return s;return null}_findResource(e){for(let r of this.uniforms)if(r.name==e)return r;for(let r of this.storage)if(r.name==e)return r;for(let r of this.textures)if(r.name==e)return r;for(let r of this.samplers)if(r.name==e)return r;return null}_markStructsFromAST(e){let r=this._getTypeInfo(e,null);this._markStructsInUse(r)}_findResources(e,r){let s=[],i=this,n=[];return e.search(o=>{if(o instanceof Do)n.push({});else if(o instanceof Uo)n.pop();else if(o instanceof Os){let a=o;r&&a.type!==null&&this._markStructsFromAST(a.type),n.length>0&&(n[n.length-1][a.name]=a)}else if(o instanceof Ai){let a=o;r&&a.type!==null&&this._markStructsFromAST(a.type)}else if(o instanceof Zc){let a=o;r&&a.type!==null&&this._markStructsFromAST(a.type),n.length>0&&(n[n.length-1][a.name]=a)}else if(o instanceof el){let a=o;if(n.length>0&&n[n.length-1][a.name])return;let c=i._findResource(a.name);c&&s.push(c)}else if(o instanceof od){let a=o,c=i._functions.get(a.name);c&&(r&&(c.inUse=!0),e.calls.add(c.node),c.resources===null&&(c.resources=i._findResources(c.node,r)),s.push(...c.resources))}else if(o instanceof td){let a=o,c=i._functions.get(a.name);c&&(r&&(c.inUse=!0),e.calls.add(c.node),c.resources===null&&(c.resources=i._findResources(c.node,r)),s.push(...c.resources))}}),[...new Map(s.map(o=>[o.name,o])).values()]}getBindGroups(){let e=[];function r(s,i){s>=e.length&&(e.length=s+1),e[s]===void 0&&(e[s]=[]),i>=e[s].length&&(e[s].length=i+1)}for(let s of this.uniforms){r(s.group,s.binding);let i=e[s.group];i[s.binding]=s}for(let s of this.storage){r(s.group,s.binding);let i=e[s.group];i[s.binding]=s}for(let s of this.textures){r(s.group,s.binding);let i=e[s.group];i[s.binding]=s}for(let s of this.samplers){r(s.group,s.binding);let i=e[s.group];i[s.binding]=s}return e}_getOutputs(e,r=void 0){if(r===void 0&&(r=[]),e instanceof Bs)this._getStructOutputs(e,r);else{let s=this._getOutputInfo(e);s!==null&&r.push(s)}return r}_getStructOutputs(e,r){for(let s of e.members)if(s.type instanceof Bs)this._getStructOutputs(s.type,r);else{let i=this._getAttribute(s,"location")||this._getAttribute(s,"builtin");if(i!==null){let n=this._getTypeInfo(s.type,s.type.attributes),o=this._parseInt(i.value),a=new gd(s.name,n,i.name,o);r.push(a)}}}_getOutputInfo(e){let r=this._getAttribute(e,"location")||this._getAttribute(e,"builtin");if(r!==null){let s=this._getTypeInfo(e,e.attributes),i=this._parseInt(r.value);return new gd("",s,r.name,i)}return null}_getInputs(e,r=void 0){r===void 0&&(r=[]);for(let s of e)if(s.type instanceof Bs)this._getStructInputs(s.type,r);else{let i=this._getInputInfo(s);i!==null&&r.push(i)}return r}_getStructInputs(e,r){for(let s of e.members)if(s.type instanceof Bs)this._getStructInputs(s.type,r);else{let i=this._getInputInfo(s);i!==null&&r.push(i)}}_getInputInfo(e){let r=this._getAttribute(e,"location")||this._getAttribute(e,"builtin");if(r!==null){let s=this._getAttribute(e,"interpolation"),i=this._getTypeInfo(e.type,e.attributes),n=this._parseInt(r.value),o=new my(e.name,i,r.name,n);return s!==null&&(o.interpolation=this._parseString(s.value)),o}return null}_parseString(e){return e instanceof Array&&(e=e[0]),e}_parseInt(e){e instanceof Array&&(e=e[0]);let r=parseInt(e);return isNaN(r)?e:r}_getAlias(e){for(let r of this.aliases)if(r.name==e)return r.type;return null}_getAliasInfo(e){return new gy(e.name,this._getTypeInfo(e.type,null))}_getTypeInfo(e,r){if(this._types.has(e))return this._types.get(e);if(e instanceof id){let i=e,n=this._getTypeInfo(i.format,i.attributes),o=new $c(i.name,r);return o.format=n,o.count=i.count,this._types.set(e,o),this._updateTypeInfo(o),o}if(e instanceof Bs){let i=e,n=new Fo(i.name,r);n.startLine=i.startLine,n.endLine=i.endLine;for(let o of i.members){let a=this._getTypeInfo(o.type,o.attributes);n.members.push(new dd(o.name,a,o.attributes))}return this._types.set(e,n),this._updateTypeInfo(n),n}if(e instanceof mn){let i=e,n=i.format instanceof Fs,o=i.format?n?this._getTypeInfo(i.format,null):new Ti(i.format,null):null,a=new pd(i.name,o,r,i.access);return this._types.set(e,a),this._updateTypeInfo(a),a}if(e instanceof sd){let i=e,n=i.format?this._getTypeInfo(i.format,null):null,o=new pd(i.name,n,r,i.access);return this._types.set(e,o),this._updateTypeInfo(o),o}let s=new Ti(e.name,r);return this._types.set(e,s),this._updateTypeInfo(s),s}_updateTypeInfo(e){var r,s;let i=this._getTypeSize(e);if(e.size=(r=i?.size)!==null&&r!==void 0?r:0,e instanceof $c){let n=this._getTypeSize(e.format);e.stride=(s=n?.size)!==null&&s!==void 0?s:0,this._updateTypeInfo(e.format)}e instanceof Fo&&this._updateStructInfo(e)}_updateStructInfo(e){var r;let s=0,i=0,n=0,o=0;for(let a=0,c=e.members.length;a<c;++a){let l=e.members[a],u=this._getTypeSize(l);if(!u)continue;(r=this._getAlias(l.type.name))!==null&&r!==void 0||l.type;let f=u.align,h=u.size;s=this._roundUp(f,s+i),i=h,n=s,o=Math.max(o,f),l.offset=s,l.size=h,this._updateTypeInfo(l.type)}e.size=this._roundUp(o,n+i),e.align=o}_getTypeSize(e){var r;if(e==null)return null;let s=this._getAttributeNum(e.attributes,"size",0),i=this._getAttributeNum(e.attributes,"align",0);if(e instanceof dd&&(e=e.type),e instanceof Ti){let n=this._getAlias(e.name);n!==null&&(e=n)}{let n=ur._typeInfo[e.name];if(n!==void 0){let o=e.format==="f16"?2:1;return new No(Math.max(i,n.align/o),Math.max(s,n.size/o))}}{let n=ur._typeInfo[e.name.substring(0,e.name.length-1)];if(n){let o=e.name[e.name.length-1]==="h"?2:1;return new No(Math.max(i,n.align/o),Math.max(s,n.size/o))}}if(e instanceof $c){let n=e,o=8,a=8,c=this._getTypeSize(n.format);c!==null&&(a=c.size,o=c.align);let l=n.count,u=this._getAttributeNum((r=e?.attributes)!==null&&r!==void 0?r:null,"stride",this._roundUp(o,a));return a=l*u,s&&(a=s),new No(Math.max(i,o),Math.max(s,a))}if(e instanceof Fo){let n=0,o=0,a=0,c=0,l=0;for(let u of e.members){let f=this._getTypeSize(u.type);f!==null&&(n=Math.max(f.align,n),a=this._roundUp(f.align,a+c),c=f.size,l=a)}return o=this._roundUp(n,l+c),new No(Math.max(i,n),Math.max(s,o))}return null}_isUniformVar(e){return e instanceof Os&&e.storage=="uniform"}_isStorageVar(e){return e instanceof Os&&e.storage=="storage"}_isTextureVar(e){return e instanceof Os&&e.type!==null&&ur._textureTypes.indexOf(e.type.name)!=-1}_isSamplerVar(e){return e instanceof Os&&e.type!==null&&ur._samplerTypes.indexOf(e.type.name)!=-1}_getAttribute(e,r){let s=e;if(!s||!s.attributes)return null;let i=s.attributes;for(let n of i)if(n.name==r)return n;return null}_getAttributeNum(e,r,s){if(e===null)return s;for(let i of e)if(i.name==r){let n=i!==null&&i.value!==null?i.value:s;return n instanceof Array&&(n=n[0]),typeof n=="number"?n:typeof n=="string"?parseInt(n):s}return s}_roundUp(e,r){return Math.ceil(r/e)*e}};ur._typeInfo={f16:{align:2,size:2},i32:{align:4,size:4},u32:{align:4,size:4},f32:{align:4,size:4},atomic:{align:4,size:4},vec2:{align:8,size:8},vec3:{align:16,size:12},vec4:{align:16,size:16},mat2x2:{align:8,size:16},mat3x2:{align:8,size:24},mat4x2:{align:8,size:32},mat2x3:{align:16,size:32},mat3x3:{align:16,size:48},mat4x3:{align:16,size:64},mat2x4:{align:16,size:32},mat3x4:{align:16,size:48},mat4x4:{align:16,size:64}};ur._textureTypes=E.any_texture_type.map(t=>t.name);ur._samplerTypes=E.sampler_type.map(t=>t.name);function Ty(t){let e={attributes:[],bindings:[]},r;try{r=PU(t)}catch(n){return U.error(n.message)(),e}for(let n of r.uniforms){let o=[];for(let a of n.type?.members||[])o.push({name:a.name,type:US(a.type)});e.bindings.push({type:"uniform",name:n.name,location:n.binding,group:n.group,members:o})}let s=r.entry.vertex[0],i=s?.inputs.length||0;for(let n=0;n<i;n++){let o=s.inputs[n];if(o.locationType==="location"){let a=US(o.type);e.attributes.push({name:o.name,location:Number(o.location),type:a})}}return e}function US(t){return t.format?`${t.name}<${t.format.name}>`:t.name}function PU(t){try{return new ur(t)}catch(e){if(e instanceof Error)throw e;let r="WGSL parse error";throw typeof e=="object"&&e?.message&&(r+=`: ${e.message} `),typeof e=="object"&&e?.token&&(r+=e.token.line||""),new Error(r,{cause:e})}}var MU=`#ifdef LUMA_FP32_TAN_PRECISION_WORKAROUND
const float TWO_PI = 6.2831854820251465;
const float PI_2 = 1.5707963705062866;
const float PI_16 = 0.1963495463132858;
const float SIN_TABLE_0 = 0.19509032368659973;
const float SIN_TABLE_1 = 0.3826834261417389;
const float SIN_TABLE_2 = 0.5555702447891235;
const float SIN_TABLE_3 = 0.7071067690849304;
const float COS_TABLE_0 = 0.9807852506637573;
const float COS_TABLE_1 = 0.9238795042037964;
const float COS_TABLE_2 = 0.8314695954322815;
const float COS_TABLE_3 = 0.7071067690849304;
const float INVERSE_FACTORIAL_3 = 1.666666716337204e-01;
const float INVERSE_FACTORIAL_5 = 8.333333767950535e-03;
const float INVERSE_FACTORIAL_7 = 1.9841270113829523e-04;
const float INVERSE_FACTORIAL_9 = 2.75573188446287533e-06;
float sin_taylor_fp32(float a) {
float r, s, t, x;
if (a == 0.0) {
return 0.0;
}
x = -a * a;
s = a;
r = a;
r = r * x;
t = r * INVERSE_FACTORIAL_3;
s = s + t;
r = r * x;
t = r * INVERSE_FACTORIAL_5;
s = s + t;
r = r * x;
t = r * INVERSE_FACTORIAL_7;
s = s + t;
r = r * x;
t = r * INVERSE_FACTORIAL_9;
s = s + t;
return s;
}
void sincos_taylor_fp32(float a, out float sin_t, out float cos_t) {
if (a == 0.0) {
sin_t = 0.0;
cos_t = 1.0;
}
sin_t = sin_taylor_fp32(a);
cos_t = sqrt(1.0 - sin_t * sin_t);
}
float tan_taylor_fp32(float a) {
float sin_a;
float cos_a;
if (a == 0.0) {
return 0.0;
}
float z = floor(a / TWO_PI);
float r = a - TWO_PI * z;
float t;
float q = floor(r / PI_2 + 0.5);
int j = int(q);
if (j < -2 || j > 2) {
return 1.0 / 0.0;
}
t = r - PI_2 * q;
q = floor(t / PI_16 + 0.5);
int k = int(q);
int abs_k = int(abs(float(k)));
if (abs_k > 4) {
return 1.0 / 0.0;
} else {
t = t - PI_16 * q;
}
float u = 0.0;
float v = 0.0;
float sin_t, cos_t;
float s, c;
sincos_taylor_fp32(t, sin_t, cos_t);
if (k == 0) {
s = sin_t;
c = cos_t;
} else {
if (abs(float(abs_k) - 1.0) < 0.5) {
u = COS_TABLE_0;
v = SIN_TABLE_0;
} else if (abs(float(abs_k) - 2.0) < 0.5) {
u = COS_TABLE_1;
v = SIN_TABLE_1;
} else if (abs(float(abs_k) - 3.0) < 0.5) {
u = COS_TABLE_2;
v = SIN_TABLE_2;
} else if (abs(float(abs_k) - 4.0) < 0.5) {
u = COS_TABLE_3;
v = SIN_TABLE_3;
}
if (k > 0) {
s = u * sin_t + v * cos_t;
c = u * cos_t - v * sin_t;
} else {
s = u * sin_t - v * cos_t;
c = u * cos_t + v * sin_t;
}
}
if (j == 0) {
sin_a = s;
cos_a = c;
} else if (j == 1) {
sin_a = c;
cos_a = -s;
} else if (j == -1) {
sin_a = -c;
cos_a = s;
} else {
sin_a = -s;
cos_a = -c;
}
return sin_a / cos_a;
}
#endif
float tan_fp32(float a) {
#ifdef LUMA_FP32_TAN_PRECISION_WORKAROUND
return tan_taylor_fp32(a);
#else
return tan(a);
#endif
}
`,by={name:"fp32",vs:MU};var RU=[0,1,1,1],IU=`uniform pickingUniforms {
float isActive;
float isAttribute;
float isHighlightActive;
float useFloatColors;
vec3 highlightedObjectColor;
vec4 highlightColor;
} picking;
out vec4 picking_vRGBcolor_Avalid;
vec3 picking_normalizeColor(vec3 color) {
return picking.useFloatColors > 0.5 ? color : color / 255.0;
}
vec4 picking_normalizeColor(vec4 color) {
return picking.useFloatColors > 0.5 ? color : color / 255.0;
}
bool picking_isColorZero(vec3 color) {
return dot(color, vec3(1.0)) < 0.00001;
}
bool picking_isColorValid(vec3 color) {
return dot(color, vec3(1.0)) > 0.00001;
}
bool isVertexHighlighted(vec3 vertexColor) {
vec3 highlightedObjectColor = picking_normalizeColor(picking.highlightedObjectColor);
return
bool(picking.isHighlightActive) && picking_isColorZero(abs(vertexColor - highlightedObjectColor));
}
void picking_setPickingColor(vec3 pickingColor) {
pickingColor = picking_normalizeColor(pickingColor);
if (bool(picking.isActive)) {
picking_vRGBcolor_Avalid.a = float(picking_isColorValid(pickingColor));
if (!bool(picking.isAttribute)) {
picking_vRGBcolor_Avalid.rgb = pickingColor;
}
} else {
picking_vRGBcolor_Avalid.a = float(isVertexHighlighted(pickingColor));
}
}
void picking_setPickingAttribute(float value) {
if (bool(picking.isAttribute)) {
picking_vRGBcolor_Avalid.r = value;
}
}
void picking_setPickingAttribute(vec2 value) {
if (bool(picking.isAttribute)) {
picking_vRGBcolor_Avalid.rg = value;
}
}
void picking_setPickingAttribute(vec3 value) {
if (bool(picking.isAttribute)) {
picking_vRGBcolor_Avalid.rgb = value;
}
}
`,BU=`uniform pickingUniforms {
float isActive;
float isAttribute;
float isHighlightActive;
float useFloatColors;
vec3 highlightedObjectColor;
vec4 highlightColor;
} picking;
in vec4 picking_vRGBcolor_Avalid;
vec4 picking_filterHighlightColor(vec4 color) {
if (picking.isActive > 0.5) {
return color;
}
bool selected = bool(picking_vRGBcolor_Avalid.a);
if (selected) {
float highLightAlpha = picking.highlightColor.a;
float blendedAlpha = highLightAlpha + color.a * (1.0 - highLightAlpha);
float highLightRatio = highLightAlpha / blendedAlpha;
vec3 blendedRGB = mix(color.rgb, picking.highlightColor.rgb, highLightRatio);
return vec4(blendedRGB, blendedAlpha);
} else {
return color;
}
}
vec4 picking_filterPickingColor(vec4 color) {
if (bool(picking.isActive)) {
if (picking_vRGBcolor_Avalid.a == 0.0) {
discard;
}
return picking_vRGBcolor_Avalid;
}
return color;
}
vec4 picking_filterColor(vec4 color) {
vec4 highlightColor = picking_filterHighlightColor(color);
return picking_filterPickingColor(highlightColor);
}
`,md={name:"picking",vs:IU,fs:BU,uniformTypes:{isActive:"f32",isAttribute:"f32",isHighlightActive:"f32",useFloatColors:"f32",highlightedObjectColor:"vec3<f32>",highlightColor:"vec4<f32>"},defaultUniforms:{isActive:!1,isAttribute:!1,isHighlightActive:!1,useFloatColors:!0,highlightedObjectColor:[0,0,0],highlightColor:RU},getUniforms:OU};function OU(t={},e){let r={};if(t.highlightedObjectColor!==void 0)if(t.highlightedObjectColor===null)r.isHighlightActive=!1;else{r.isHighlightActive=!0;let s=t.highlightedObjectColor.slice(0,3);r.highlightedObjectColor=s}if(t.highlightColor){let s=Array.from(t.highlightColor,i=>i/255);Number.isFinite(s[3])||(s[3]=1),r.highlightColor=s}return t.isActive!==void 0&&(r.isActive=Boolean(t.isActive),r.isAttribute=Boolean(t.isAttribute)),t.useFloatColors!==void 0&&(r.useFloatColors=Boolean(t.useFloatColors)),r}function _d(t,e=[],r=0){let s=Math.fround(t),i=t-s;return e[r]=s,e[r+1]=i,e}function Ey(t){return t-Math.fround(t)}function Sy(t){let e=new Float32Array(32);for(let r=0;r<4;++r)for(let s=0;s<4;++s){let i=r*4+s;_d(t[s*4+r],e,i*2)}return e}var kS=`uniform float ONE;
vec2 split(float a) {
const float SPLIT = 4097.0;
float t = a * SPLIT;
#if defined(LUMA_FP64_CODE_ELIMINATION_WORKAROUND)
float a_hi = t * ONE - (t - a);
float a_lo = a * ONE - a_hi;
#else
float a_hi = t - (t - a);
float a_lo = a - a_hi;
#endif
return vec2(a_hi, a_lo);
}
vec2 split2(vec2 a) {
vec2 b = split(a.x);
b.y += a.y;
return b;
}
vec2 quickTwoSum(float a, float b) {
#if defined(LUMA_FP64_CODE_ELIMINATION_WORKAROUND)
float sum = (a + b) * ONE;
float err = b - (sum - a) * ONE;
#else
float sum = a + b;
float err = b - (sum - a);
#endif
return vec2(sum, err);
}
vec2 twoSum(float a, float b) {
float s = (a + b);
#if defined(LUMA_FP64_CODE_ELIMINATION_WORKAROUND)
float v = (s * ONE - a) * ONE;
float err = (a - (s - v) * ONE) * ONE * ONE * ONE + (b - v);
#else
float v = s - a;
float err = (a - (s - v)) + (b - v);
#endif
return vec2(s, err);
}
vec2 twoSub(float a, float b) {
float s = (a - b);
#if defined(LUMA_FP64_CODE_ELIMINATION_WORKAROUND)
float v = (s * ONE - a) * ONE;
float err = (a - (s - v) * ONE) * ONE * ONE * ONE - (b + v);
#else
float v = s - a;
float err = (a - (s - v)) - (b + v);
#endif
return vec2(s, err);
}
vec2 twoSqr(float a) {
float prod = a * a;
vec2 a_fp64 = split(a);
#if defined(LUMA_FP64_CODE_ELIMINATION_WORKAROUND)
float err = ((a_fp64.x * a_fp64.x - prod) * ONE + 2.0 * a_fp64.x *
a_fp64.y * ONE * ONE) + a_fp64.y * a_fp64.y * ONE * ONE * ONE;
#else
float err = ((a_fp64.x * a_fp64.x - prod) + 2.0 * a_fp64.x * a_fp64.y) + a_fp64.y * a_fp64.y;
#endif
return vec2(prod, err);
}
vec2 twoProd(float a, float b) {
float prod = a * b;
vec2 a_fp64 = split(a);
vec2 b_fp64 = split(b);
float err = ((a_fp64.x * b_fp64.x - prod) + a_fp64.x * b_fp64.y +
a_fp64.y * b_fp64.x) + a_fp64.y * b_fp64.y;
return vec2(prod, err);
}
vec2 sum_fp64(vec2 a, vec2 b) {
vec2 s, t;
s = twoSum(a.x, b.x);
t = twoSum(a.y, b.y);
s.y += t.x;
s = quickTwoSum(s.x, s.y);
s.y += t.y;
s = quickTwoSum(s.x, s.y);
return s;
}
vec2 sub_fp64(vec2 a, vec2 b) {
vec2 s, t;
s = twoSub(a.x, b.x);
t = twoSub(a.y, b.y);
s.y += t.x;
s = quickTwoSum(s.x, s.y);
s.y += t.y;
s = quickTwoSum(s.x, s.y);
return s;
}
vec2 mul_fp64(vec2 a, vec2 b) {
vec2 prod = twoProd(a.x, b.x);
prod.y += a.x * b.y;
#if defined(LUMA_FP64_HIGH_BITS_OVERFLOW_WORKAROUND)
prod = split2(prod);
#endif
prod = quickTwoSum(prod.x, prod.y);
prod.y += a.y * b.x;
#if defined(LUMA_FP64_HIGH_BITS_OVERFLOW_WORKAROUND)
prod = split2(prod);
#endif
prod = quickTwoSum(prod.x, prod.y);
return prod;
}
vec2 div_fp64(vec2 a, vec2 b) {
float xn = 1.0 / b.x;
#if defined(LUMA_FP64_HIGH_BITS_OVERFLOW_WORKAROUND)
vec2 yn = mul_fp64(a, vec2(xn, 0));
#else
vec2 yn = a * xn;
#endif
float diff = (sub_fp64(a, mul_fp64(b, yn))).x;
vec2 prod = twoProd(xn, diff);
return sum_fp64(yn, prod);
}
vec2 sqrt_fp64(vec2 a) {
if (a.x == 0.0 && a.y == 0.0) return vec2(0.0, 0.0);
if (a.x < 0.0) return vec2(0.0 / 0.0, 0.0 / 0.0);
float x = 1.0 / sqrt(a.x);
float yn = a.x * x;
#if defined(LUMA_FP64_CODE_ELIMINATION_WORKAROUND)
vec2 yn_sqr = twoSqr(yn) * ONE;
#else
vec2 yn_sqr = twoSqr(yn);
#endif
float diff = sub_fp64(a, yn_sqr).x;
vec2 prod = twoProd(x * 0.5, diff);
#if defined(LUMA_FP64_HIGH_BITS_OVERFLOW_WORKAROUND)
return sum_fp64(split(yn), prod);
#else
return sum_fp64(vec2(yn, 0.0), prod);
#endif
}
`;var VS=`const vec2 E_FP64 = vec2(2.7182817459106445e+00, 8.254840366817007e-08);
const vec2 LOG2_FP64 = vec2(0.6931471824645996e+00, -1.9046542121259336e-09);
const vec2 PI_FP64 = vec2(3.1415927410125732, -8.742278012618954e-8);
const vec2 TWO_PI_FP64 = vec2(6.2831854820251465, -1.7484556025237907e-7);
const vec2 PI_2_FP64 = vec2(1.5707963705062866, -4.371139006309477e-8);
const vec2 PI_4_FP64 = vec2(0.7853981852531433, -2.1855695031547384e-8);
const vec2 PI_16_FP64 = vec2(0.19634954631328583, -5.463923757886846e-9);
const vec2 PI_16_2_FP64 = vec2(0.39269909262657166, -1.0927847515773692e-8);
const vec2 PI_16_3_FP64 = vec2(0.5890486240386963, -1.4906100798128818e-9);
const vec2 PI_180_FP64 = vec2(0.01745329238474369, 1.3519960498364902e-10);
const vec2 SIN_TABLE_0_FP64 = vec2(0.19509032368659973, -1.6704714833615242e-9);
const vec2 SIN_TABLE_1_FP64 = vec2(0.3826834261417389, 6.22335089017767e-9);
const vec2 SIN_TABLE_2_FP64 = vec2(0.5555702447891235, -1.1769521357507529e-8);
const vec2 SIN_TABLE_3_FP64 = vec2(0.7071067690849304, 1.2101617041793133e-8);
const vec2 COS_TABLE_0_FP64 = vec2(0.9807852506637573, 2.9739473106360492e-8);
const vec2 COS_TABLE_1_FP64 = vec2(0.9238795042037964, 2.8307490351764386e-8);
const vec2 COS_TABLE_2_FP64 = vec2(0.8314695954322815, 1.6870263741530778e-8);
const vec2 COS_TABLE_3_FP64 = vec2(0.7071067690849304, 1.2101617152815436e-8);
const vec2 INVERSE_FACTORIAL_3_FP64 = vec2(1.666666716337204e-01, -4.967053879312289e-09);
const vec2 INVERSE_FACTORIAL_4_FP64 = vec2(4.16666679084301e-02, -1.2417634698280722e-09);
const vec2 INVERSE_FACTORIAL_5_FP64 = vec2(8.333333767950535e-03, -4.34617203337595e-10);
const vec2 INVERSE_FACTORIAL_6_FP64 = vec2(1.3888889225199819e-03, -3.3631094437103215e-11);
const vec2 INVERSE_FACTORIAL_7_FP64 = vec2(1.9841270113829523e-04,  -2.725596874933456e-12);
const vec2 INVERSE_FACTORIAL_8_FP64 = vec2(2.4801587642286904e-05, -3.406996025904184e-13);
const vec2 INVERSE_FACTORIAL_9_FP64 = vec2(2.75573188446287533e-06, 3.7935713937038186e-14);
const vec2 INVERSE_FACTORIAL_10_FP64 = vec2(2.755731998149713e-07, -7.575112367869873e-15);
float nint(float d) {
if (d == floor(d)) return d;
return floor(d + 0.5);
}
vec2 nint_fp64(vec2 a) {
float hi = nint(a.x);
float lo;
vec2 tmp;
if (hi == a.x) {
lo = nint(a.y);
tmp = quickTwoSum(hi, lo);
} else {
lo = 0.0;
if (abs(hi - a.x) == 0.5 && a.y < 0.0) {
hi -= 1.0;
}
tmp = vec2(hi, lo);
}
return tmp;
}
vec2 exp_fp64(vec2 a) {
const int k_power = 4;
const float k = 16.0;
const float inv_k = 1.0 / k;
if (a.x <= -88.0) return vec2(0.0, 0.0);
if (a.x >= 88.0) return vec2(1.0 / 0.0, 1.0 / 0.0);
if (a.x == 0.0 && a.y == 0.0) return vec2(1.0, 0.0);
if (a.x == 1.0 && a.y == 0.0) return E_FP64;
float m = floor(a.x / LOG2_FP64.x + 0.5);
vec2 r = sub_fp64(a, mul_fp64(LOG2_FP64, vec2(m, 0.0))) * inv_k;
vec2 s, t, p;
p = mul_fp64(r, r);
s = sum_fp64(r, p * 0.5);
p = mul_fp64(p, r);
t = mul_fp64(p, INVERSE_FACTORIAL_3_FP64);
s = sum_fp64(s, t);
p = mul_fp64(p, r);
t = mul_fp64(p, INVERSE_FACTORIAL_4_FP64);
s = sum_fp64(s, t);
p = mul_fp64(p, r);
t = mul_fp64(p, INVERSE_FACTORIAL_5_FP64);
s = sum_fp64(s, t);
for (int i = 0; i < k_power; i++) {
s = sum_fp64(s * 2.0, mul_fp64(s, s));
}
#if defined(NVIDIA_FP64_WORKAROUND) || defined(INTEL_FP64_WORKAROUND)
s = sum_fp64(s, vec2(ONE, 0.0));
#else
s = sum_fp64(s, vec2(1.0, 0.0));
#endif
return s * pow(2.0, m);
}
vec2 log_fp64(vec2 a)
{
if (a.x == 1.0 && a.y == 0.0) return vec2(0.0, 0.0);
if (a.x <= 0.0) return vec2(0.0 / 0.0, 0.0 / 0.0);
vec2 x = vec2(log(a.x), 0.0);
vec2 s;
#if defined(NVIDIA_FP64_WORKAROUND) || defined(INTEL_FP64_WORKAROUND)
s = vec2(ONE, 0.0);
#else
s = vec2(1.0, 0.0);
#endif
x = sub_fp64(sum_fp64(x, mul_fp64(a, exp_fp64(-x))), s);
return x;
}
vec2 sin_taylor_fp64(vec2 a) {
vec2 r, s, t, x;
if (a.x == 0.0 && a.y == 0.0) {
return vec2(0.0, 0.0);
}
x = -mul_fp64(a, a);
s = a;
r = a;
r = mul_fp64(r, x);
t = mul_fp64(r, INVERSE_FACTORIAL_3_FP64);
s = sum_fp64(s, t);
r = mul_fp64(r, x);
t = mul_fp64(r, INVERSE_FACTORIAL_5_FP64);
s = sum_fp64(s, t);
return s;
}
vec2 cos_taylor_fp64(vec2 a) {
vec2 r, s, t, x;
if (a.x == 0.0 && a.y == 0.0) {
return vec2(1.0, 0.0);
}
x = -mul_fp64(a, a);
r = x;
s = sum_fp64(vec2(1.0, 0.0), r * 0.5);
r = mul_fp64(r, x);
t = mul_fp64(r, INVERSE_FACTORIAL_4_FP64);
s = sum_fp64(s, t);
r = mul_fp64(r, x);
t = mul_fp64(r, INVERSE_FACTORIAL_6_FP64);
s = sum_fp64(s, t);
return s;
}
void sincos_taylor_fp64(vec2 a, out vec2 sin_t, out vec2 cos_t) {
if (a.x == 0.0 && a.y == 0.0) {
sin_t = vec2(0.0, 0.0);
cos_t = vec2(1.0, 0.0);
}
sin_t = sin_taylor_fp64(a);
cos_t = sqrt_fp64(sub_fp64(vec2(1.0, 0.0), mul_fp64(sin_t, sin_t)));
}
vec2 sin_fp64(vec2 a) {
if (a.x == 0.0 && a.y == 0.0) {
return vec2(0.0, 0.0);
}
vec2 z = nint_fp64(div_fp64(a, TWO_PI_FP64));
vec2 r = sub_fp64(a, mul_fp64(TWO_PI_FP64, z));
vec2 t;
float q = floor(r.x / PI_2_FP64.x + 0.5);
int j = int(q);
if (j < -2 || j > 2) {
return vec2(0.0 / 0.0, 0.0 / 0.0);
}
t = sub_fp64(r, mul_fp64(PI_2_FP64, vec2(q, 0.0)));
q = floor(t.x / PI_16_FP64.x + 0.5);
int k = int(q);
if (k == 0) {
if (j == 0) {
return sin_taylor_fp64(t);
} else if (j == 1) {
return cos_taylor_fp64(t);
} else if (j == -1) {
return -cos_taylor_fp64(t);
} else {
return -sin_taylor_fp64(t);
}
}
int abs_k = int(abs(float(k)));
if (abs_k > 4) {
return vec2(0.0 / 0.0, 0.0 / 0.0);
} else {
t = sub_fp64(t, mul_fp64(PI_16_FP64, vec2(q, 0.0)));
}
vec2 u = vec2(0.0, 0.0);
vec2 v = vec2(0.0, 0.0);
#if defined(NVIDIA_FP64_WORKAROUND) || defined(INTEL_FP64_WORKAROUND)
if (abs(float(abs_k) - 1.0) < 0.5) {
u = COS_TABLE_0_FP64;
v = SIN_TABLE_0_FP64;
} else if (abs(float(abs_k) - 2.0) < 0.5) {
u = COS_TABLE_1_FP64;
v = SIN_TABLE_1_FP64;
} else if (abs(float(abs_k) - 3.0) < 0.5) {
u = COS_TABLE_2_FP64;
v = SIN_TABLE_2_FP64;
} else if (abs(float(abs_k) - 4.0) < 0.5) {
u = COS_TABLE_3_FP64;
v = SIN_TABLE_3_FP64;
}
#else
if (abs_k == 1) {
u = COS_TABLE_0_FP64;
v = SIN_TABLE_0_FP64;
} else if (abs_k == 2) {
u = COS_TABLE_1_FP64;
v = SIN_TABLE_1_FP64;
} else if (abs_k == 3) {
u = COS_TABLE_2_FP64;
v = SIN_TABLE_2_FP64;
} else if (abs_k == 4) {
u = COS_TABLE_3_FP64;
v = SIN_TABLE_3_FP64;
}
#endif
vec2 sin_t, cos_t;
sincos_taylor_fp64(t, sin_t, cos_t);
vec2 result = vec2(0.0, 0.0);
if (j == 0) {
if (k > 0) {
result = sum_fp64(mul_fp64(u, sin_t), mul_fp64(v, cos_t));
} else {
result = sub_fp64(mul_fp64(u, sin_t), mul_fp64(v, cos_t));
}
} else if (j == 1) {
if (k > 0) {
result = sub_fp64(mul_fp64(u, cos_t), mul_fp64(v, sin_t));
} else {
result = sum_fp64(mul_fp64(u, cos_t), mul_fp64(v, sin_t));
}
} else if (j == -1) {
if (k > 0) {
result = sub_fp64(mul_fp64(v, sin_t), mul_fp64(u, cos_t));
} else {
result = -sum_fp64(mul_fp64(v, sin_t), mul_fp64(u, cos_t));
}
} else {
if (k > 0) {