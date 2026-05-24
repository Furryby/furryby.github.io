(a==="number"||a==="color"||a==="array")&&tA(t[n],e[n],o)&&(r[n]=!0,i=!0)}return i?r:!1}function ha({newProps:t,oldProps:e,ignoreProps:r={},propTypes:s={},triggerName:i="props"}){if(e===t)return!1;if(typeof t!="object"||t===null)return`${i} changed shallowly`;if(typeof e!="object"||e===null)return`${i} changed shallowly`;for(let n of Object.keys(t))if(!(n in r)){if(!(n in e))return`${i}.${n} added`;let o=tA(t[n],e[n],s[n]);if(o)return`${i}.${n} ${o}`}for(let n of Object.keys(e))if(!(n in r)){if(!(n in t))return`${i}.${n} dropped`;if(!Object.hasOwnProperty.call(t,n)){let o=tA(t[n],e[n],s[n]);if(o)return`${i}.${n} ${o}`}}return!1}function tA(t,e,r){let s=r&&r.equal;return s&&!s(t,e,r)||!s&&(s=t&&e&&t.equals,s&&!s.call(t,e))?"changed deeply":!s&&e!==t?"changed shallowly":null}function V5(t,e){if(e===null)return"oldProps is null, initial diff";let r=!1,{dataComparator:s,_dataDiff:i}=t;return s?s(t.data,e.data)||(r="Data comparator detected a change"):t.data!==e.data&&(r="A new data container was supplied"),r&&i&&(r=i(t.data,e.data)||r),r}function z5(t,e){if(e===null)return{all:!0};if("all"in t.updateTriggers&&uP(t,e,"all"))return{all:!0};let r={},s=!1;for(let i in t.updateTriggers)i!=="all"&&uP(t,e,i)&&(r[i]=!0,s=!0);return s?r:!1}function H5(t,e){if(e===null)return!0;let r=e.extensions,{extensions:s}=t;if(s===r)return!1;if(!r||!s||s.length!==r.length)return!0;for(let i=0;i<s.length;i++)if(!s[i].equals(r[i]))return!0;return!1}function uP(t,e,r){let s=t.updateTriggers[r];s=s??{};let i=e.updateTriggers[r];return i=i??{},ha({oldProps:i,newProps:s,triggerName:r})}var G5="count(): argument not an object",W5="count(): argument not a container";function wp(t){if(!X5(t))throw new Error(G5);if(typeof t.count=="function")return t.count();if(Number.isFinite(t.size))return t.size;if(Number.isFinite(t.length))return t.length;if(j5(t))return Object.keys(t).length;throw new Error(W5)}function j5(t){return t!==null&&typeof t=="object"&&t.constructor===Object}function X5(t){return t!==null&&typeof t=="object"}function ys(t,e){if(!e)return t;let r={...t,...e};if("defines"in e&&(r.defines={...t.defines,...e.defines}),"modules"in e&&(r.modules=(t.modules||[]).concat(e.modules),e.modules.some(s=>s.name==="project64"))){let s=r.modules.findIndex(i=>i.name==="project32");s>=0&&r.modules.splice(s,1)}if("inject"in e)if(!t.inject)r.inject=e.inject;else{let s={...t.inject};for(let i in e.inject)s[i]=(s[i]||"")+e.inject[i];r.inject=s}return r}var Y5={minFilter:"linear",mipmapFilter:"linear",magFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"},rA={};function dP(t,e,r,s){if(r instanceof xe)return r;r.constructor&&r.constructor.name!=="Object"&&(r={data:r});let i=null;r.compressed&&(i={minFilter:"linear",mipmapFilter:r.data.length>1?"nearest":"linear"});let n=e.createTexture({...r,sampler:{...Y5,...i,...s}});return rA[n.id]=t,n}function pP(t,e){!e||!(e instanceof xe)||rA[e.id]===t&&(e.delete(),delete rA[e.id])}var q5={boolean:{validate(t,e){return!0},equal(t,e,r){return Boolean(t)===Boolean(e)}},number:{validate(t,e){return Number.isFinite(t)&&(!("max"in e)||t<=e.max)&&(!("min"in e)||t>=e.min)}},color:{validate(t,e){return e.optional&&!t||sA(t)&&(t.length===3||t.length===4)},equal(t,e,r){return ve(t,e,1)}},accessor:{validate(t,e){let r=Pp(t);return r==="function"||r===Pp(e.value)},equal(t,e,r){return typeof e=="function"?!0:ve(t,e,1)}},array:{validate(t,e){return e.optional&&!t||sA(t)},equal(t,e,r){let{compare:s}=r,i=Number.isInteger(s)?s:s?1:0;return s?ve(t,e,i):t===e}},object:{equal(t,e,r){if(r.ignore)return!0;let{compare:s}=r,i=Number.isInteger(s)?s:s?1:0;return s?ve(t,e,i):t===e}},function:{validate(t,e){return e.optional&&!t||typeof t=="function"},equal(t,e,r){return!r.compare&&r.ignore!==!1||t===e}},data:{transform:(t,e,r)=>{if(!t)return t;let{dataTransform:s}=r.props;return s?s(t):typeof t.shape=="string"&&t.shape.endsWith("-table")&&Array.isArray(t.data)?t.data:t}},image:{transform:(t,e,r)=>{let s=r.context;return!s||!s.device?null:dP(r.id,s.device,t,{...e.parameters,...r.props.textureParameters})},release:(t,e,r)=>{pP(r.id,t)}}};function gP(t){let e={},r={},s={};for(let[i,n]of Object.entries(t)){let o=n?.deprecatedFor;if(o)s[i]=Array.isArray(o)?o:[o];else{let a=K5(i,n);e[i]=a,r[i]=a.value}}return{propTypes:e,defaultProps:r,deprecatedProps:s}}function K5(t,e){switch(Pp(e)){case"object":return nu(t,e);case"array":return nu(t,{type:"array",value:e,compare:!1});case"boolean":return nu(t,{type:"boolean",value:e});case"number":return nu(t,{type:"number",value:e});case"function":return nu(t,{type:"function",value:e,compare:!0});default:return{name:t,type:"unknown",value:e}}}function nu(t,e){return"type"in e?{name:t,...q5[e.type],...e}:"value"in e?{name:t,type:Pp(e.value),...e}:{name:t,type:"object",value:e}}function sA(t){return Array.isArray(t)||ArrayBuffer.isView(t)}function Pp(t){return sA(t)?"array":t===null?"null":typeof t}function mP(t,e){let r;for(let n=e.length-1;n>=0;n--){let o=e[n];"extensions"in o&&(r=o.extensions)}let s=iA(t.constructor,r),i=Object.create(s);i[ra]=t,i[ps]={},i[kr]={};for(let n=0;n<e.length;++n){let o=e[n];for(let a in o)i[a]=o[a]}return Object.freeze(i),i}var $5="_mergedDefaultProps";function iA(t,e){let r=$5;if(e)for(let i of e){let n=i.constructor;n&&(r+=`:${n.extensionName||n.name}`)}let s=_P(t,r);return s||(t[r]=J5(t,e||[]))}function J5(t,e){if(!t.prototype)return null;let s=Object.getPrototypeOf(t),i=iA(s),n=_P(t,"defaultProps")||{},o=gP(n),a=Object.assign(Object.create(null),i,o.defaultProps),c=Object.assign(Object.create(null),i?.[xr],o.propTypes),l=Object.assign(Object.create(null),i?.[jd],o.deprecatedProps);for(let u of e){let f=iA(u.constructor);f&&(Object.assign(a,f),Object.assign(c,f[xr]),Object.assign(l,f[jd]))}return Z5(a,t),eH(a,c),Q5(a,l),a[xr]=c,a[jd]=l,e.length===0&&!nA(t,"_propTypes")&&(t._propTypes=c),a}function Z5(t,e){let r=rH(e);Object.defineProperties(t,{id:{writable:!0,value:r}})}function Q5(t,e){for(let r in e)Object.defineProperty(t,r,{enumerable:!1,set(s){let i=`${this.id}: ${r}`;for(let n of e[r])nA(this,n)||(this[n]=s);k.deprecated(i,e[r].join("/"))()}})}function eH(t,e){let r={},s={};for(let i in e){let n=e[i],{name:o,value:a}=n;n.async&&(r[o]=a,s[o]=tH(o))}t[Us]=r,t[ps]={},Object.defineProperties(t,s)}function tH(t){return{enumerable:!0,set(e){typeof e=="string"||e instanceof Promise||xp(e)?this[ps][t]=e:this[kr][t]=e},get(){if(this[kr]){if(t in this[kr])return this[kr][t]||this[Us][t];if(t in this[ps]){let e=this[ra]&&this[ra].internalState;if(e&&e.hasAsyncProp(t))return e.getAsyncProp(t)||this[Us][t]}}return this[Us][t]}}}function nA(t,e){return Object.prototype.hasOwnProperty.call(t,e)}function _P(t,e){return nA(t,e)&&t[e]}function rH(t){let e=t.componentName;return e||k.warn(`${t.name}.componentName not specified`)(),e||t.name}var sH=0,ou=class{constructor(...e){this.props=mP(this,e),this.id=this.props.id,this.count=sH++}clone(e){let{props:r}=this,s={};for(let i in r[Us])i in r[kr]?s[i]=r[kr][i]:i in r[ps]&&(s[i]=r[ps][i]);return new this.constructor({...r,...s,...e})}};ou.componentName="Component";ou.defaultProps={};var Mp=ou;var iH=Object.freeze({}),Un=class{constructor(e){this.component=e,this.asyncProps={},this.onAsyncPropUpdated=()=>{},this.oldProps=null,this.oldAsyncProps=null}finalize(){for(let e in this.asyncProps){let r=this.asyncProps[e];r&&r.type&&r.type.release&&r.type.release(r.resolvedValue,r.type,this.component)}this.asyncProps={},this.component=null,this.resetOldProps()}getOldProps(){return this.oldAsyncProps||this.oldProps||iH}resetOldProps(){this.oldAsyncProps=null,this.oldProps=this.component?this.component.props:null}hasAsyncProp(e){return e in this.asyncProps}getAsyncProp(e){let r=this.asyncProps[e];return r&&r.resolvedValue}isAsyncPropLoading(e){if(e){let r=this.asyncProps[e];return Boolean(r&&r.pendingLoadCount>0&&r.pendingLoadCount!==r.resolvedLoadCount)}for(let r in this.asyncProps)if(this.isAsyncPropLoading(r))return!0;return!1}reloadAsyncProp(e,r){this._watchPromise(e,Promise.resolve(r))}setAsyncProps(e){this.component=e[ra]||this.component;let r=e[kr]||{},s=e[ps]||e,i=e[Us]||{};for(let n in r){let o=r[n];this._createAsyncPropData(n,i[n]),this._updateAsyncProp(n,o),r[n]=this.getAsyncProp(n)}for(let n in s){let o=s[n];this._createAsyncPropData(n,i[n]),this._updateAsyncProp(n,o)}}_fetch(e,r){return null}_onResolve(e,r){}_onError(e,r){}_updateAsyncProp(e,r){if(this._didAsyncInputValueChange(e,r)){if(typeof r=="string"&&(r=this._fetch(e,r)),r instanceof Promise){this._watchPromise(e,r);return}if(xp(r)){this._resolveAsyncIterable(e,r);return}this._setPropValue(e,r)}}_freezeAsyncOldProps(){if(!this.oldAsyncProps&&this.oldProps){this.oldAsyncProps=Object.create(this.oldProps);for(let e in this.asyncProps)Object.defineProperty(this.oldAsyncProps,e,{enumerable:!0,value:this.oldProps[e]})}}_didAsyncInputValueChange(e,r){let s=this.asyncProps[e];return r===s.resolvedValue||r===s.lastValue?!1:(s.lastValue=r,!0)}_setPropValue(e,r){this._freezeAsyncOldProps();let s=this.asyncProps[e];s&&(r=this._postProcessValue(s,r),s.resolvedValue=r,s.pendingLoadCount++,s.resolvedLoadCount=s.pendingLoadCount)}_setAsyncPropValue(e,r,s){let i=this.asyncProps[e];i&&s>=i.resolvedLoadCount&&r!==void 0&&(this._freezeAsyncOldProps(),i.resolvedValue=r,i.resolvedLoadCount=s,this.onAsyncPropUpdated(e,r))}_watchPromise(e,r){let s=this.asyncProps[e];if(s){s.pendingLoadCount++;let i=s.pendingLoadCount;r.then(n=>{this.component&&(n=this._postProcessValue(s,n),this._setAsyncPropValue(e,n,i),this._onResolve(e,n))}).catch(n=>{this._onError(e,n)})}}async _resolveAsyncIterable(e,r){if(e!=="data"){this._setPropValue(e,r);return}let s=this.asyncProps[e];if(!s)return;s.pendingLoadCount++;let i=s.pendingLoadCount,n=[],o=0;for await(let a of r){if(!this.component)return;let{dataTransform:c}=this.component.props;c?n=c(a,n):n=n.concat(a),Object.defineProperty(n,"__diff",{enumerable:!1,value:[{startRow:o,endRow:n.length}]}),o=n.length,this._setAsyncPropValue(e,n,i)}this._onResolve(e,n)}_postProcessValue(e,r){let s=e.type;return s&&this.component&&(s.release&&s.release(e.resolvedValue,s,this.component),s.transform)?s.transform(r,s,this.component):r}_createAsyncPropData(e,r){if(!this.asyncProps[e]){let i=this.component&&this.component.props[xr];this.asyncProps[e]={type:i&&i[e],lastValue:null,resolvedValue:r,pendingLoadCount:0,resolvedLoadCount:0}}}};var au=class extends Un{constructor({attributeManager:e,layer:r}){super(r),this.attributeManager=e,this.needsRedraw=!0,this.needsUpdate=!0,this.subLayers=null,this.usesPickingColorCache=!1}get layer(){return this.component}_fetch(e,r){let s=this.layer,i=s?.props.fetch;return i?i(r,{propName:e,layer:s}):super._fetch(e,r)}_onResolve(e,r){let s=this.layer;if(s){let i=s.props.onDataLoad;e==="data"&&i&&i(r,{propName:e,layer:s})}}_onError(e,r){let s=this.layer;s&&s.raiseError(r,`loading ${e} of ${this.layer}`)}};var nH="layer.changeFlag",oH="layer.initialize",aH="layer.update",cH="layer.finalize",lH="layer.matched",yP=2**24-1,uH=Object.freeze([]),fH=zt(({oldViewport:t,viewport:e})=>t.equals(e)),xs=new Uint8ClampedArray(0),hH={data:{type:"data",value:uH,async:!0},dataComparator:{type:"function",value:null,optional:!0},_dataDiff:{type:"function",value:t=>t&&t.__diff,optional:!0},dataTransform:{type:"function",value:null,optional:!0},onDataLoad:{type:"function",value:null,optional:!0},onError:{type:"function",value:null,optional:!0},fetch:{type:"function",value:(t,{propName:e,layer:r,loaders:s,loadOptions:i,signal:n})=>{let{resourceManager:o}=r.context;i=i||r.getLoadOptions(),s=s||r.props.loaders,n&&(i={...i,fetch:{...i?.fetch,signal:n}});let a=o.contains(t);return!a&&!i&&(o.add({resourceId:t,data:$e(t,s),persistent:!1}),a=!0),a?o.subscribe({resourceId:t,onChange:c=>r.internalState?.reloadAsyncProp(e,c),consumerId:r.id,requestId:e}):$e(t,s,i)}},updateTriggers:{},visible:!0,pickable:!1,opacity:{type:"number",min:0,max:1,value:1},operation:"draw",onHover:{type:"function",value:null,optional:!0},onClick:{type:"function",value:null,optional:!0},onDragStart:{type:"function",value:null,optional:!0},onDrag:{type:"function",value:null,optional:!0},onDragEnd:{type:"function",value:null,optional:!0},coordinateSystem:X.DEFAULT,coordinateOrigin:{type:"array",value:[0,0,0],compare:!0},modelMatrix:{type:"array",value:null,compare:!0,optional:!0},wrapLongitude:!1,positionFormat:"XYZ",colorFormat:"RGBA",parameters:{type:"object",value:{},optional:!0,compare:2},loadOptions:{type:"object",value:null,optional:!0,ignore:!0},transitions:null,extensions:[],loaders:{type:"array",value:[],optional:!0,ignore:!0},getPolygonOffset:{type:"function",value:({layerIndex:t})=>[0,-t*100]},highlightedObjectIndex:null,autoHighlight:!1,highlightColor:{type:"accessor",value:[0,0,128,128]}},cu=class extends Mp{constructor(){super(...arguments),this.internalState=null,this.lifecycle=Pi.NO_STATE,this.parent=null}static get componentName(){return Object.prototype.hasOwnProperty.call(this,"layerName")?this.layerName:""}get root(){let e=this;for(;e.parent;)e=e.parent;return e}toString(){return`${this.constructor.layerName||this.constructor.name}({id: '${this.props.id}'})`}project(e){Ae(this.internalState);let r=this.internalState.viewport||this.context.viewport,s=Cx(e,{viewport:r,modelMatrix:this.props.modelMatrix,coordinateOrigin:this.props.coordinateOrigin,coordinateSystem:this.props.coordinateSystem}),[i,n,o]=Yo(s,r.pixelProjectionMatrix);return e.length===2?[i,n]:[i,n,o]}unproject(e){return Ae(this.internalState),(this.internalState.viewport||this.context.viewport).unproject(e)}projectPosition(e,r){Ae(this.internalState);let s=this.internalState.viewport||this.context.viewport;return Vd(e,{viewport:s,modelMatrix:this.props.modelMatrix,coordinateOrigin:this.props.coordinateOrigin,coordinateSystem:this.props.coordinateSystem,...r})}get isComposite(){return!1}setState(e){this.setChangeFlags({stateChanged:!0}),Object.assign(this.state,e),this.setNeedsRedraw()}setNeedsRedraw(){this.internalState&&(this.internalState.needsRedraw=!0)}setNeedsUpdate(){this.internalState&&(this.context.layerManager.setNeedsUpdate(String(this)),this.internalState.needsUpdate=!0)}get isLoaded(){return this.internalState?!this.internalState.isAsyncPropLoading():!1}get wrapLongitude(){return this.props.wrapLongitude}isPickable(){return this.props.pickable&&this.props.visible}getModels(){let e=this.state;return e&&(e.models||e.model&&[e.model])||[]}setModuleParameters(e){for(let r of this.getModels())r.updateModuleSettings(e)}setShaderModuleProps(...e){for(let r of this.getModels())r.shaderInputs.setProps(...e)}getAttributeManager(){return this.internalState&&this.internalState.attributeManager}getCurrentLayer(){return this.internalState&&this.internalState.layer}getLoadOptions(){return this.props.loadOptions}use64bitPositions(){let{coordinateSystem:e}=this.props;return e===X.DEFAULT||e===X.LNGLAT||e===X.CARTESIAN}onHover(e,r){return this.props.onHover&&this.props.onHover(e,r)||!1}onClick(e,r){return this.props.onClick&&this.props.onClick(e,r)||!1}nullPickingColor(){return[0,0,0]}encodePickingColor(e,r=[]){return r[0]=e+1&255,r[1]=e+1>>8&255,r[2]=e+1>>8>>8&255,r}decodePickingColor(e){Ae(e instanceof Uint8Array);let[r,s,i]=e;return r+s*256+i*65536-1}getNumInstances(){return Number.isFinite(this.props.numInstances)?this.props.numInstances:this.state&&this.state.numInstances!==void 0?this.state.numInstances:wp(this.props.data)}getStartIndices(){return this.props.startIndices?this.props.startIndices:this.state&&this.state.startIndices?this.state.startIndices:null}getBounds(){return this.getAttributeManager()?.getBounds(["positions","instancePositions"])}getShaders(e){e=ys(e,{disableWarnings:!0,modules:this.context.defaultShaderModules});for(let r of this.props.extensions)e=ys(e,r.getShaders.call(this,r));return e}shouldUpdateState(e){return e.changeFlags.propsOrDataChanged}updateState(e){let r=this.getAttributeManager(),{dataChanged:s}=e.changeFlags;if(s&&r)if(Array.isArray(s))for(let i of s)r.invalidateAll(i);else r.invalidateAll();if(r){let{props:i}=e,n=this.internalState.hasPickingBuffer,o=Number.isInteger(i.highlightedObjectIndex)||i.pickable||i.extensions.some(a=>a.getNeedsPickingBuffer.call(this,a));if(n!==o){this.internalState.hasPickingBuffer=o;let{pickingColors:a,instancePickingColors:c}=r.attributes,l=a||c;l&&(o&&l.constant&&(l.constant=!1,r.invalidate(l.id)),!l.value&&!o&&(l.constant=!0,l.value=[0,0,0]))}}}finalizeState(e){for(let s of this.getModels())s.destroy();let r=this.getAttributeManager();r&&r.finalize(),this.context&&this.context.resourceManager.unsubscribe({consumerId:this.id}),this.internalState&&(this.internalState.uniformTransitions.clear(),this.internalState.finalize())}draw(e){for(let r of this.getModels())r.draw(e)}getPickingInfo({info:e,mode:r,sourceLayer:s}){let{index:i}=e;return i>=0&&Array.isArray(this.props.data)&&(e.object=this.props.data[i]),e}raiseError(e,r){r&&(e=new Error(`${r}: ${e.message}`,{cause:e})),this.props.onError?.(e)||this.context?.onError?.(e,this)}getNeedsRedraw(e={clearRedrawFlags:!1}){return this._getNeedsRedraw(e)}needsUpdate(){return this.internalState?this.internalState.needsUpdate||this.hasUniformTransition()||this.shouldUpdateState(this._getUpdateParams()):!1}hasUniformTransition(){return this.internalState?.uniformTransitions.active||!1}activateViewport(e){if(!this.internalState)return;let r=this.internalState.viewport;this.internalState.viewport=e,(!r||!fH({oldViewport:r,viewport:e}))&&(this.setChangeFlags({viewportChanged:!0}),this.isComposite?this.needsUpdate()&&this.setNeedsUpdate():this._update())}invalidateAttribute(e="all"){let r=this.getAttributeManager();r&&(e==="all"?r.invalidateAll():r.invalidate(e))}updateAttributes(e){let r=!1;for(let s in e)e[s].layoutChanged()&&(r=!0);for(let s of this.getModels())this._setModelAttributes(s,e,r)}_updateAttributes(){let e=this.getAttributeManager();if(!e)return;let r=this.props,s=this.getNumInstances(),i=this.getStartIndices();e.update({data:r.data,numInstances:s,startIndices:i,props:r,transitions:r.transitions,buffers:r.data.attributes,context:this});let n=e.getChangedAttributes({clearChangedFlags:!0});this.updateAttributes(n)}_updateAttributeTransition(){let e=this.getAttributeManager();e&&e.updateTransition()}_updateUniformTransition(){let{uniformTransitions:e}=this.internalState;if(e.active){let r=e.update(),s=Object.create(this.props);for(let i in r)Object.defineProperty(s,i,{value:r[i]});return s}return this.props}calculateInstancePickingColors(e,{numInstances:r}){if(e.constant)return;let s=Math.floor(xs.length/4);if(this.internalState.usesPickingColorCache=!0,s<r){r>yP&&k.warn("Layer has too many data objects. Picking might not be able to distinguish all objects.")(),xs=Nr.allocate(xs,r,{size:4,copy:!0,maxCount:Math.max(r,yP)});let i=Math.floor(xs.length/4),n=[];for(let o=s;o<i;o++)this.encodePickingColor(o,n),xs[o*4+0]=n[0],xs[o*4+1]=n[1],xs[o*4+2]=n[2]}e.value=xs.subarray(0,r*4)}_setModelAttributes(e,r,s=!1){if(!Object.keys(r).length)return;if(s){let a=this.getAttributeManager();e.setBufferLayout(a.getBufferLayouts(e)),r=a.getAttributes()}let i=e.userData?.excludeAttributes||{},n={},o={};for(let a in r){if(i[a])continue;let c=r[a].getValue();for(let l in c){let u=c[l];u instanceof Q?r[a].settings.isIndexed?e.setIndexBuffer(u):n[l]=u:u&&(o[l]=u)}}e.setAttributes(n),e.setConstantAttributes(o)}disablePickingIndex(e){let r=this.props.data;if(!("attributes"in r)){this._disablePickingIndex(e);return}let{pickingColors:s,instancePickingColors:i}=this.getAttributeManager().attributes,n=s||i,o=n&&r.attributes&&r.attributes[n.id];if(o&&o.value){let a=o.value,c=this.encodePickingColor(e);for(let l=0;l<r.length;l++){let u=n.getVertexOffset(l);a[u]===c[0]&&a[u+1]===c[1]&&a[u+2]===c[2]&&this._disablePickingIndex(l)}}else this._disablePickingIndex(e)}_disablePickingIndex(e){let{pickingColors:r,instancePickingColors:s}=this.getAttributeManager().attributes,i=r||s;if(!i)return;let n=i.getVertexOffset(e),o=i.getVertexOffset(e+1);i.buffer.write(new Uint8Array(o-n),n)}restorePickingColors(){let{pickingColors:e,instancePickingColors:r}=this.getAttributeManager().attributes,s=e||r;s&&(this.internalState.usesPickingColorCache&&s.value.buffer!==xs.buffer&&(s.value=xs.subarray(0,s.value.length)),s.updateSubBuffer({startOffset:0}))}_initialize(){Ae(!this.internalState),Ae(Number.isFinite(this.props.coordinateSystem)),Ue(oH,this);let e=this._getAttributeManager();e&&e.addInstanced({instancePickingColors:{type:"uint8",size:4,noAlloc:!0,update:this.calculateInstancePickingColors}}),this.internalState=new au({attributeManager:e,layer:this}),this._clearChangeFlags(),this.state={},Object.defineProperty(this.state,"attributeManager",{get:()=>(k.deprecated("layer.state.attributeManager","layer.getAttributeManager()")(),e)}),this.internalState.uniformTransitions=new iu(this.context.timeline),this.internalState.onAsyncPropUpdated=this._onAsyncPropUpdated.bind(this),this.internalState.setAsyncProps(this.props),this.initializeState(this.context);for(let r of this.props.extensions)r.initializeState.call(this,this.context,r);this.setChangeFlags({dataChanged:"init",propsChanged:"init",viewportChanged:!0,extensionsChanged:!0}),this._update()}_transferState(e){Ue(lH,this,this===e);let{state:r,internalState:s}=e;this!==e&&(this.internalState=s,this.state=r,this.internalState.setAsyncProps(this.props),this._diffProps(this.props,this.internalState.getOldProps()))}_update(){let e=this.needsUpdate();if(Ue(aH,this,e),!e)return;let r=this.props,s=this.context,i=this.internalState,n=s.viewport,o=this._updateUniformTransition();i.propsInTransition=o,s.viewport=i.viewport||n,this.props=o;try{let a=this._getUpdateParams(),c=this.getModels();if(s.device)this.updateState(a);else try{this.updateState(a)}catch{}for(let u of this.props.extensions)u.updateState.call(this,a,u);let l=this.getModels()[0]!==c[0];this._postUpdate(a,l)}finally{s.viewport=n,this.props=r,this._clearChangeFlags(),i.needsUpdate=!1,i.resetOldProps()}}_finalize(){Ue(cH,this),this.finalizeState(this.context);for(let e of this.props.extensions)e.finalizeState.call(this,this.context,e)}_drawLayer({renderPass:e,moduleParameters:r=null,uniforms:s={},parameters:i={}}){this._updateAttributeTransition();let n=this.props,o=this.context;this.props=this.internalState.propsInTransition||n;let a=this.props.opacity;s.opacity=Math.pow(a,1/2.2);try{if(r){let{isActive:u,isAttribute:f}=r.picking;this.setModuleParameters(r),this.setShaderModuleProps({picking:{isActive:u,isAttribute:f}})}let{getPolygonOffset:c}=this.props,l=c&&c(s)||[0,0];o.device.setParametersWebGL({polygonOffset:l});for(let u of this.getModels())u.setParameters(i);o.device.withParametersWebGL(i,()=>{let u={renderPass:e,moduleParameters:r,uniforms:s,parameters:i,context:o};for(let f of this.props.extensions)f.draw.call(this,u,f);this.draw(u)})}finally{this.props=n}}getChangeFlags(){return this.internalState?.changeFlags}setChangeFlags(e){if(!this.internalState)return;let{changeFlags:r}=this.internalState;for(let i in e)if(e[i]){let n=!1;switch(i){case"dataChanged":let o=e[i],a=r[i];o&&Array.isArray(a)&&(r.dataChanged=Array.isArray(o)?a.concat(o):o,n=!0);default:r[i]||(r[i]=e[i],n=!0)}n&&Ue(nH,this,i,e)}let s=Boolean(r.dataChanged||r.updateTriggersChanged||r.propsChanged||r.extensionsChanged);r.propsOrDataChanged=s,r.somethingChanged=s||r.viewportChanged||r.stateChanged}_clearChangeFlags(){this.internalState.changeFlags={dataChanged:!1,propsChanged:!1,updateTriggersChanged:!1,viewportChanged:!1,stateChanged:!1,extensionsChanged:!1,propsOrDataChanged:!1,somethingChanged:!1}}_diffProps(e,r){let s=hP(e,r);if(s.updateTriggersChanged)for(let i in s.updateTriggersChanged)s.updateTriggersChanged[i]&&this.invalidateAttribute(i);if(s.transitionsChanged)for(let i in s.transitionsChanged)this.internalState.uniformTransitions.add(i,r[i],e[i],e.transitions?.[i]);return this.setChangeFlags(s)}validateProps(){fP(this.props)}updateAutoHighlight(e){this.props.autoHighlight&&!Number.isInteger(this.props.highlightedObjectIndex)&&this._updateAutoHighlight(e)}_updateAutoHighlight(e){let r={highlightedObjectColor:e.picked?e.color:null},{highlightColor:s}=this.props;e.picked&&typeof s=="function"&&(r.highlightColor=s(e)),this.setShaderModuleProps({picking:r}),this.setNeedsRedraw()}_getAttributeManager(){let e=this.context;return new Xr(e.device,{id:this.props.id,stats:e.stats,timeline:e.timeline})}_postUpdate(e,r){let{props:s,oldProps:i}=e;this.setNeedsRedraw(),this._updateAttributes();let n=this.state.model;n?.isInstanced&&n.setInstanceCount(this.getNumInstances());let{autoHighlight:o,highlightedObjectIndex:a,highlightColor:c}=s;if(r||i.autoHighlight!==o||i.highlightedObjectIndex!==a||i.highlightColor!==c){let l={};Array.isArray(c)&&(l.highlightColor=c),(r||i.autoHighlight!==o||a!==i.highlightedObjectIndex)&&(l.highlightedObjectColor=Number.isFinite(a)&&a>=0?this.encodePickingColor(a):null),this.setShaderModuleProps({picking:l})}}_getUpdateParams(){return{props:this.props,oldProps:this.internalState.getOldProps(),context:this.context,changeFlags:this.internalState.changeFlags}}_getNeedsRedraw(e){if(!this.internalState)return!1;let r=!1;r=r||this.internalState.needsRedraw&&this.id;let s=this.getAttributeManager(),i=s?s.getNeedsRedraw(e):!1;if(r=r||i,r)for(let n of this.props.extensions)n.onNeedsRedraw.call(this,n);return this.internalState.needsRedraw=this.internalState.needsRedraw&&!e.clearRedrawFlags,r}_onAsyncPropUpdated(){this._diffProps(this.props,this.internalState.getOldProps()),this.setNeedsUpdate()}};cu.defaultProps=hH;cu.layerName="Layer";var he=cu;var dH="compositeLayer.renderLayers",Rp=class extends he{get isComposite(){return!0}get isLoaded(){return super.isLoaded&&this.getSubLayers().every(e=>e.isLoaded)}getSubLayers(){return this.internalState&&this.internalState.subLayers||[]}initializeState(e){}setState(e){super.setState(e),this.setNeedsUpdate()}getPickingInfo({info:e}){let{object:r}=e;return r&&r.__source&&r.__source.parent&&r.__source.parent.id===this.id&&(e.object=r.__source.object,e.index=r.__source.index),e}filterSubLayer(e){return!0}shouldRenderSubLayer(e,r){return r&&r.length}getSubLayerClass(e,r){let{_subLayerProps:s}=this.props;return s&&s[e]&&s[e].type||r}getSubLayerRow(e,r,s){return e.__source={parent:this,object:r,index:s},e}getSubLayerAccessor(e){if(typeof e=="function"){let r={index:-1,data:this.props.data,target:[]};return(s,i)=>s&&s.__source?(r.index=s.__source.index,e(s.__source.object,r)):e(s,i)}return e}getSubLayerProps(e={}){let{opacity:r,pickable:s,visible:i,parameters:n,getPolygonOffset:o,highlightedObjectIndex:a,autoHighlight:c,highlightColor:l,coordinateSystem:u,coordinateOrigin:f,wrapLongitude:h,positionFormat:d,modelMatrix:p,extensions:g,fetch:m,operation:_,_subLayerProps:y}=this.props,x={id:"",updateTriggers:{},opacity:r,pickable:s,visible:i,parameters:n,getPolygonOffset:o,highlightedObjectIndex:a,autoHighlight:c,highlightColor:l,coordinateSystem:u,coordinateOrigin:f,wrapLongitude:h,positionFormat:d,modelMatrix:p,extensions:g,fetch:m,operation:_},S=y&&e.id&&y[e.id],P=S&&S.updateTriggers,B=e.id||"sublayer";if(S){let L=this.props[xr],M=e.type?e.type._propTypes:{};for(let v in S){let T=M[v]||L[v];T&&T.type==="accessor"&&(S[v]=this.getSubLayerAccessor(S[v]))}}Object.assign(x,e,S),x.id=`${this.props.id}-${B}`,x.updateTriggers={all:this.props.updateTriggers?.all,...e.updateTriggers,...P};for(let L of g){let M=L.getSubLayerProps.call(this,L);M&&Object.assign(x,M,{updateTriggers:Object.assign(x.updateTriggers,M.updateTriggers)})}return x}_updateAutoHighlight(e){for(let r of this.getSubLayers())r.updateAutoHighlight(e)}_getAttributeManager(){return null}_postUpdate(e,r){let s=this.internalState.subLayers,i=!s||this.needsUpdate();if(i){let n=this.renderLayers();s=Bt(n,Boolean),this.internalState.subLayers=s}Ue(dH,this,i,s);for(let n of s)n.parent=this}};Rp.layerName="CompositeLayer";var Le=Rp;var Ip=Math.PI/180,xP=180/Math.PI,Bp=6370972,da=256;function pH(){let t=da/Bp,e=Math.PI/180*da;return{unitsPerMeter:[t,t,t],unitsPerMeter2:[0,0,0],metersPerUnit:[1/t,1/t,1/t],unitsPerDegree:[e,e,t],unitsPerDegree2:[0,0,0],degreesPerUnit:[1/e,1/e,1/t]}}var Yr=class extends Ht{constructor(e={}){let{latitude:r=0,longitude:s=0,zoom:i=0,nearZMultiplier:n=.1,farZMultiplier:o=2,resolution:a=10}=e,{height:c,altitude:l=1.5}=e;c=c||1,l=Math.max(.75,l);let u=new q().lookAt({eye:[0,-l,0],up:[0,0,1]}),f=Math.pow(2,i);u.rotateX(r*Ip),u.rotateZ(-s*Ip),u.scale(f/c);let h=Math.atan(.5/l),d=da*2*f/c;super({...e,height:c,viewMatrix:u,longitude:s,latitude:r,zoom:i,distanceScales:pH(),fovyRadians:h*2,focalDistance:l,near:n,far:Math.min(2,1/d+1)*l*o}),this.latitude=r,this.longitude=s,this.resolution=a}get projectionMode(){return bt.GLOBE}getDistanceScales(){return this.distanceScales}getBounds(e={}){let r={targetZ:e.z||0},s=this.unproject([0,this.height/2],r),i=this.unproject([this.width/2,0],r),n=this.unproject([this.width,this.height/2],r),o=this.unproject([this.width/2,this.height],r);return n[0]<this.longitude&&(n[0]+=360),s[0]>this.longitude&&(s[0]-=360),[Math.min(s[0],n[0],i[0],o[0]),Math.min(s[1],n[1],i[1],o[1]),Math.max(s[0],n[0],i[0],o[0]),Math.max(s[1],n[1],i[1],o[1])]}unproject(e,{topLeft:r=!0,targetZ:s}={}){let[i,n,o]=e,a=r?n:this.height-n,{pixelUnprojectionMatrix:c}=this,l;if(Number.isFinite(o))l=oA(c,[i,a,o,1]);else{let d=oA(c,[i,a,-1,1]),p=oA(c,[i,a,1,1]),g=((s||0)/Bp+1)*da,m=We.sqrLen(We.sub([],d,p)),_=We.sqrLen(d),y=We.sqrLen(p),S=4*((4*_*y-(m-_-y)**2)/16)/m,P=Math.sqrt(_-S),B=Math.sqrt(Math.max(0,g*g-S)),L=(P-B)/Math.sqrt(m);l=We.lerp([],d,p,L)}let[u,f,h]=this.unprojectPosition(l);return Number.isFinite(o)?[u,f,h]:Number.isFinite(s)?[u,f,s]:[u,f]}projectPosition(e){let[r,s,i=0]=e,n=r*Ip,o=s*Ip,a=Math.cos(o),c=(i/Bp+1)*da;return[Math.sin(n)*a*c,-Math.cos(n)*a*c,Math.sin(o)*c]}unprojectPosition(e){let[r,s,i]=e,n=We.len(e),o=Math.asin(i/n),c=Math.atan2(r,-s)*xP,l=o*xP,u=(n/da-1)*Bp;return[c,l,u]}projectFlat(e){return e}unprojectFlat(e){return e}panByPosition(e,r){let s=this.unproject(r);return{longitude:e[0]-s[0]+this.longitude,latitude:e[1]-s[1]+this.latitude}}};function oA(t,e){let r=It.transformMat4([],e,t);return It.scale(r,r,1/r[3]),r}var aA=Math.PI/180;function gH({height:t,focalDistance:e,orbitAxis:r,rotationX:s,rotationOrbit:i,zoom:n}){let o=r==="Z"?[0,0,1]:[0,1,0],a=r==="Z"?[0,-e,0]:[0,0,e],c=new q().lookAt({eye:a,up:o});c.rotateX(s*aA),r==="Z"?c.rotateZ(i*aA):c.rotateY(i*aA);let l=Math.pow(2,n)/t;return c.scale(l),c}var kn=class extends Ht{constructor(e){let{height:r,projectionMatrix:s,fovy:i=50,orbitAxis:n="Z",target:o=[0,0,0],rotationX:a=0,rotationOrbit:c=0,zoom:l=0}=e,u=s?s[5]/2:En(i);super({...e,longitude:void 0,viewMatrix:gH({height:r||1,focalDistance:u,orbitAxis:n,rotationX:a,rotationOrbit:c,zoom:l}),fovy:i,focalDistance:u,position:o,zoom:l}),this.projectedCenter=this.project(this.center)}unproject(e,{topLeft:r=!0}={}){let[s,i,n=this.projectedCenter[2]]=e,o=r?i:this.height-i,[a,c,l]=mr([s,o,n],this.pixelUnprojectionMatrix);return[a,c,l]}panByPosition(e,r){let s=this.project(e),i=[this.width/2+s[0]-r[0],this.height/2+s[1]-r[1],this.projectedCenter[2]];return{target:this.unproject(i)}}};var mH=new q().lookAt({eye:[0,0,1]});function _H({width:t,height:e,near:r,far:s,padding:i}){let n=-t/2,o=t/2,a=-e/2,c=e/2;if(i){let{left:l=0,right:u=0,top:f=0,bottom:h=0}=i,d=fe((l+t-u)/2,0,t)-t/2,p=fe((f+e-h)/2,0,e)-e/2;n-=d,o-=d,a+=p,c+=p}return new q().ortho({left:n,right:o,bottom:a,top:c,near:r,far:s})}var js=class extends Ht{constructor(e){let{width:r,height:s,near:i=.1,far:n=1e3,zoom:o=0,target:a=[0,0,0],padding:c=null,flipY:l=!0}=e,u=Array.isArray(o)?o[0]:o,f=Array.isArray(o)?o[1]:o,h=Math.min(u,f),d=Math.pow(2,h),p;if(u!==f){let g=Math.pow(2,u),m=Math.pow(2,f);p={unitsPerMeter:[g/d,m/d,1],metersPerUnit:[d/g,d/m,1]}}super({...e,longitude:void 0,position:a,viewMatrix:mH.clone().scale([d,d*(l?-1:1),d]),projectionMatrix:_H({width:r||1,height:s||1,padding:c,near:i,far:n}),zoom:h,distanceScales:p})}projectFlat([e,r]){let{unitsPerMeter:s}=this.distanceScales;return[e*s[0],r*s[1]]}unprojectFlat([e,r]){let{metersPerUnit:s}=this.distanceScales;return[e*s[0],r*s[1]]}panByPosition(e,r){let s=mr(r,this.pixelUnprojectionMatrix),i=this.projectFlat(e),n=Ze.add([],i,Ze.negate([],s)),o=Ze.add([],this.center,n);return{target:this.unprojectFlat(o)}}};var Vn=class extends Ht{constructor(e){let{longitude:r,latitude:s,modelMatrix:i,bearing:n=0,pitch:o=0,up:a=[0,0,1]}=e,l=new Or({bearing:n,pitch:o===-90?1e-4:90+o}).toVector3().normalize(),u=i?new q(i).transformAsVector(l):l,f=Number.isFinite(s)?dl({latitude:s}):0,h=Math.pow(2,f),d=new q().lookAt({eye:[0,0,0],center:u,up:a}).scale(h);super({...e,zoom:f,viewMatrix:d}),this.latitude=s,this.longitude=r}};var zn=20,AP=500,lu=class extends Hs{constructor(e){let{width:r,height:s,position:i=[0,0,0],bearing:n=0,pitch:o=0,longitude:a=null,latitude:c=null,maxPitch:l=90,minPitch:u=-90,startRotatePos:f,startBearing:h,startPitch:d,startZoomPosition:p,startPanPos:g,startPanPosition:m}=e;super({width:r,height:s,position:i,bearing:n,pitch:o,longitude:a,latitude:c,maxPitch:l,minPitch:u},{startRotatePos:f,startBearing:h,startPitch:d,startZoomPosition:p,startPanPos:g,startPanPosition:m}),this.makeViewport=e.makeViewport}panStart({pos:e}){let{position:r}=this.getViewportProps();return this._getUpdatedState({startPanPos:e,startPanPosition:r})}pan({pos:e}){if(!e)return this;let{startPanPos:r=[0,0],startPanPosition:s=[0,0]}=this.getState(),{width:i,height:n,bearing:o,pitch:a}=this.getViewportProps(),c=AP*(e[0]-r[0])/i,l=AP*(e[1]-r[1])/n,u=new Or({bearing:o,pitch:a}),f=new Or({bearing:o,pitch:-90}),h=u.toVector3().normalize(),d=f.toVector3().cross(h).normalize();return this._getUpdatedState({position:new w(s).add(d.scale(c)).add(h.scale(l))})}panEnd(){return this._getUpdatedState({startPanPos:null,startPanPosition:null})}rotateStart({pos:e}){return this._getUpdatedState({startRotatePos:e,startBearing:this.getViewportProps().bearing,startPitch:this.getViewportProps().pitch})}rotate({pos:e,deltaAngleX:r=0,deltaAngleY:s=0}){let{startRotatePos:i,startBearing:n,startPitch:o}=this.getState(),{width:a,height:c}=this.getViewportProps();if(!i||n===void 0||o===void 0)return this;let l;if(e){let u=(e[0]-i[0])/a,f=(e[1]-i[1])/c;l={bearing:n-u*180,pitch:o-f*90}}else l={bearing:n-r,pitch:o-s};return this._getUpdatedState(l)}rotateEnd(){return this._getUpdatedState({startRotatePos:null,startBearing:null,startPitch:null})}zoomStart(){return this._getUpdatedState({startZoomPosition:this.getViewportProps().position})}zoom({pos:e,scale:r}){let s=this.getViewportProps(),i=this.getState().startZoomPosition||s.position,n=this.makeViewport(s),{projectionMatrix:o,width:a}=n,l=2*Math.atan(1/o[0])*(e[0]/a-.5),u=this.getDirection(!0);return this._move(u.rotateZ({radians:-l}),Math.log2(r)*zn,i)}zoomEnd(){return this._getUpdatedState({startZoomPosition:null})}moveLeft(e=zn){let r=this.getDirection(!0);return this._move(r.rotateZ({radians:Math.PI/2}),e)}moveRight(e=zn){let r=this.getDirection(!0);return this._move(r.rotateZ({radians:-Math.PI/2}),e)}moveUp(e=zn){let r=this.getDirection(!0);return this._move(r,e)}moveDown(e=zn){let r=this.getDirection(!0);return this._move(r.negate(),e)}rotateLeft(e=15){return this._getUpdatedState({bearing:this.getViewportProps().bearing-e})}rotateRight(e=15){return this._getUpdatedState({bearing:this.getViewportProps().bearing+e})}rotateUp(e=10){return this._getUpdatedState({pitch:this.getViewportProps().pitch+e})}rotateDown(e=10){return this._getUpdatedState({pitch:this.getViewportProps().pitch-e})}zoomIn(e=zn){return this._move(new w(0,0,1),e)}zoomOut(e=zn){return this._move(new w(0,0,-1),e)}shortestPathFrom(e){let r=e.getViewportProps(),s={...this.getViewportProps()},{bearing:i,longitude:n}=s;return Math.abs(i-r.bearing)>180&&(s.bearing=i<0?i+360:i-360),n!==null&&r.longitude!==null&&Math.abs(n-r.longitude)>180&&(s.longitude=n<0?n+360:n-360),s}_move(e,r,s=this.getViewportProps().position){let i=e.scale(r);return this._getUpdatedState({position:new w(s).add(i)})}getDirection(e=!1){return new Or({bearing:this.getViewportProps().bearing,pitch:e?90:90+this.getViewportProps().pitch}).toVector3().normalize()}_getUpdatedState(e){return new lu({makeViewport:this.makeViewport,...this.getViewportProps(),...this.getState(),...e})}applyConstraints(e){let{pitch:r,maxPitch:s,minPitch:i,longitude:n,bearing:o}=e;return e.pitch=fe(r,i,s),n!==null&&(n<-180||n>180)&&(e.longitude=vn(n+180,360)-180),(o<-180||o>180)&&(e.bearing=vn(o+180,360)-180),e}},Hn=class extends Ft{constructor(){super(...arguments),this.ControllerState=lu,this.transition={transitionDuration:300,transitionInterpolator:new yt(["position","pitch","bearing"])}}};var Op=class extends Ot{constructor(e={}){super(e)}get ViewportType(){return Vn}get ControllerType(){return Hn}};Op.displayName="FirstPersonView";var TP=Op;var uu=class extends Hs{constructor(e){let{width:r,height:s,rotationX:i=0,rotationOrbit:n=0,target:o=[0,0,0],zoom:a=0,minRotationX:c=-90,maxRotationX:l=90,minZoom:u=-1/0,maxZoom:f=1/0,startPanPosition:h,startRotatePos:d,startRotationX:p,startRotationOrbit:g,startZoomPosition:m,startZoom:_}=e;super({width:r,height:s,rotationX:i,rotationOrbit:n,target:o,zoom:a,minRotationX:c,maxRotationX:l,minZoom:u,maxZoom:f},{startPanPosition:h,startRotatePos:d,startRotationX:p,startRotationOrbit:g,startZoomPosition:m,startZoom:_}),this.makeViewport=e.makeViewport}panStart({pos:e}){return this._getUpdatedState({startPanPosition:this._unproject(e)})}pan({pos:e,startPosition:r}){let s=this.getState().startPanPosition||r;if(!s)return this;let n=this.makeViewport(this.getViewportProps()).panByPosition(s,e);return this._getUpdatedState(n)}panEnd(){return this._getUpdatedState({startPanPosition:null})}rotateStart({pos:e}){return this._getUpdatedState({startRotatePos:e,startRotationX:this.getViewportProps().rotationX,startRotationOrbit:this.getViewportProps().rotationOrbit})}rotate({pos:e,deltaAngleX:r=0,deltaAngleY:s=0}){let{startRotatePos:i,startRotationX:n,startRotationOrbit:o}=this.getState(),{width:a,height:c}=this.getViewportProps();if(!i||n===void 0||o===void 0)return this;let l;if(e){let u=(e[0]-i[0])/a,f=(e[1]-i[1])/c;(n<-90||n>90)&&(u*=-1),l={rotationX:n+f*180,rotationOrbit:o+u*180}}else l={rotationX:n+s,rotationOrbit:o+r};return this._getUpdatedState(l)}rotateEnd(){return this._getUpdatedState({startRotationX:null,startRotationOrbit:null})}shortestPathFrom(e){let r=e.getViewportProps(),s={...this.getViewportProps()},{rotationOrbit:i}=s;return Math.abs(i-r.rotationOrbit)>180&&(s.rotationOrbit=i<0?i+360:i-360),s}zoomStart({pos:e}){return this._getUpdatedState({startZoomPosition:this._unproject(e),startZoom:this.getViewportProps().zoom})}zoom({pos:e,startPos:r,scale:s}){let{startZoom:i,startZoomPosition:n}=this.getState();if(n||(i=this.getViewportProps().zoom,n=this._unproject(r)||this._unproject(e)),!n)return this;let o=this._calculateNewZoom({scale:s,startZoom:i}),a=this.makeViewport({...this.getViewportProps(),zoom:o});return this._getUpdatedState({zoom:o,...a.panByPosition(n,e)})}zoomEnd(){return this._getUpdatedState({startZoomPosition:null,startZoom:null})}zoomIn(e=2){return this._getUpdatedState({zoom:this._calculateNewZoom({scale:e})})}zoomOut(e=2){return this._getUpdatedState({zoom:this._calculateNewZoom({scale:1/e})})}moveLeft(e=50){return this._panFromCenter([-e,0])}moveRight(e=50){return this._panFromCenter([e,0])}moveUp(e=50){return this._panFromCenter([0,-e])}moveDown(e=50){return this._panFromCenter([0,e])}rotateLeft(e=15){return this._getUpdatedState({rotationOrbit:this.getViewportProps().rotationOrbit-e})}rotateRight(e=15){return this._getUpdatedState({rotationOrbit:this.getViewportProps().rotationOrbit+e})}rotateUp(e=10){return this._getUpdatedState({rotationX:this.getViewportProps().rotationX-e})}rotateDown(e=10){return this._getUpdatedState({rotationX:this.getViewportProps().rotationX+e})}_unproject(e){let r=this.makeViewport(this.getViewportProps());return e&&r.unproject(e)}_calculateNewZoom({scale:e,startZoom:r}){let{maxZoom:s,minZoom:i}=this.getViewportProps();r===void 0&&(r=this.getViewportProps().zoom);let n=r+Math.log2(e);return fe(n,i,s)}_panFromCenter(e){let{width:r,height:s,target:i}=this.getViewportProps();return this.pan({startPosition:i,pos:[r/2+e[0],s/2+e[1]]})}_getUpdatedState(e){return new this.constructor({makeViewport:this.makeViewport,...this.getViewportProps(),...this.getState(),...e})}applyConstraints(e){let{maxZoom:r,minZoom:s,zoom:i,maxRotationX:n,minRotationX:o,rotationOrbit:a}=e;return e.zoom=Array.isArray(i)?[fe(i[0],s,r),fe(i[1],s,r)]:fe(i,s,r),e.rotationX=fe(e.rotationX,o,n),(a<-180||a>180)&&(e.rotationOrbit=vn(a+180,360)-180),e}},Gn=class extends Ft{constructor(){super(...arguments),this.ControllerState=uu,this.transition={transitionDuration:300,transitionInterpolator:new yt({transitionProps:{compare:["target","zoom","rotationX","rotationOrbit"],required:["target","zoom"]}})}}};var Fp=class extends Ot{constructor(e={}){super(e),this.props.orbitAxis=e.orbitAxis||"Z"}get ViewportType(){return kn}get ControllerType(){return Gn}};Fp.displayName="OrbitView";var bP=Fp;var cA=class extends uu{constructor(e){super(e),this.zoomAxis=e.zoomAxis||"all"}_calculateNewZoom({scale:e,startZoom:r}){let{maxZoom:s,minZoom:i}=this.getViewportProps();r===void 0&&(r=this.getViewportProps().zoom);let n=Math.log2(e);if(Array.isArray(r)){let[o,a]=r;switch(this.zoomAxis){case"X":o=fe(o+n,i,s);break;case"Y":a=fe(a+n,i,s);break;default:let c=Math.min(o+n,a+n);c<i&&(n+=i-c),c=Math.max(o+n,a+n),c>s&&(n+=s-c),o+=n,a+=n}return[o,a]}return fe(r+n,i,s)}},Wn=class extends Ft{constructor(){super(...arguments),this.ControllerState=cA,this.transition={transitionDuration:300,transitionInterpolator:new yt(["target","zoom"])},this.dragMode="pan"}_onPanRotate(){return!1}};var Lp=class extends Ot{constructor(e={}){super(e)}get ViewportType(){return js}get ControllerType(){return Wn}};Lp.displayName="OrthographicView";var EP=Lp;var lA=class extends Il{applyConstraints(e){let{maxZoom:r,minZoom:s,zoom:i}=e;e.zoom=fe(i,s,r);let{longitude:n,latitude:o}=e;return(n<-180||n>180)&&(e.longitude=vn(n+180,360)-180),e.latitude=fe(o,-89,89),e}},jn=class extends Ft{constructor(){super(...arguments),this.ControllerState=lA,this.transition={transitionDuration:300,transitionInterpolator:new yt(["longitude","latitude","zoom"])},this.dragMode="pan"}setProps(e){super.setProps(e),this.dragRotate=!1,this.touchRotate=!1}};var Np=class extends Ot{constructor(e={}){super(e)}get ViewportType(){return Yr}get ControllerType(){return jn}};Np.displayName="GlobeView";var SP=Np;var fu=class{static get componentName(){return Object.prototype.hasOwnProperty.call(this,"extensionName")?this.extensionName:""}constructor(e){e&&(this.opts=e)}equals(e){return this===e?!0:this.constructor===e.constructor&&ve(this.opts,e.opts,1)}getShaders(e){return null}getSubLayerProps(e){let{defaultProps:r}=e.constructor,s={updateTriggers:{}};for(let i in r)if(i in this.props){let n=r[i],o=this.props[i];s[i]=o,n&&n.type==="accessor"&&(s.updateTriggers[i]=this.props.updateTriggers[i],typeof o=="function"&&(s[i]=this.getSubLayerAccessor(o)))}return s}initializeState(e,r){}updateState(e,r){}onNeedsRedraw(e){}getNeedsPickingBuffer(e){return!1}draw(e,r){}finalizeState(e,r){}};fu.defaultProps={};fu.extensionName="LayerExtension";var tt=fu;var uA={bearing:0,pitch:0,position:[0,0,0]},yH={speed:1.2,curve:1.414},Xs=class extends zs{constructor(e={}){super({compare:["longitude","latitude","zoom","bearing","pitch","position"],extract:["width","height","longitude","latitude","zoom","bearing","pitch","position"],required:["width","height","latitude","longitude","zoom"]}),this.opts={...yH,...e}}interpolateProps(e,r,s){let i=bx(e,r,s,this.opts);for(let n in uA)i[n]=it(e[n]||uA[n],r[n]||uA[n],s);return i}getDuration(e,r){let{transitionDuration:s}=r;return s==="auto"&&(s=Ex(e,r,this.opts)),s}};var Ys=class{constructor(e){this.indexStarts=[0],this.vertexStarts=[0],this.vertexCount=0,this.instanceCount=0;let{attributes:r={}}=e;this.typedArrayManager=Nr,this.attributes={},this._attributeDefs=r,this.opts=e,this.updateGeometry(e)}updateGeometry(e){Object.assign(this.opts,e);let{data:r,buffers:s={},getGeometry:i,geometryBuffer:n,positionFormat:o,dataChanged:a,normalize:c=!0}=this.opts;if(this.data=r,this.getGeometry=i,this.positionSize=n&&n.size||(o==="XY"?2:3),this.buffers=s,this.normalize=c,n&&(Ae(r.startIndices),this.getGeometry=this.getGeometryFromBuffer(n),c||(s.vertexPositions=n)),this.geometryBuffer=s.vertexPositions,Array.isArray(a))for(let l of a)this._rebuildGeometry(l);else this._rebuildGeometry()}updatePartialGeometry({startRow:e,endRow:r}){this._rebuildGeometry({startRow:e,endRow:r})}getGeometryFromBuffer(e){let r=e.value||e;return ArrayBuffer.isView(r)?Ap(r,{size:this.positionSize,offset:e.offset,stride:e.stride,startIndices:this.data.startIndices}):null}_allocate(e,r){let{attributes:s,buffers:i,_attributeDefs:n,typedArrayManager:o}=this;for(let a in n)if(a in i)o.release(s[a]),s[a]=null;else{let c=n[a];c.copy=r,s[a]=o.allocate(s[a],e,c)}}_forEachGeometry(e,r,s){let{data:i,getGeometry:n}=this,{iterable:o,objectInfo:a}=ze(i,r,s);for(let c of o){a.index++;let l=n?n(c,a):null;e(l,a.index)}}_rebuildGeometry(e){if(!this.data)return;let{indexStarts:r,vertexStarts:s,instanceCount:i}=this,{data:n,geometryBuffer:o}=this,{startRow:a=0,endRow:c=1/0}=e||{},l={};if(e||(r=[0],s=[0]),this.normalize||!o)this._forEachGeometry((f,h)=>{let d=f&&this.normalizeGeometry(f);l[h]=d,s[h+1]=s[h]+(d?this.getGeometrySize(d):0)},a,c),i=s[s.length-1];else if(s=n.startIndices,i=s[n.length]||0,ArrayBuffer.isView(o))i=i||o.length/this.positionSize;else if(o instanceof Q){let f=this.positionSize*4;i=i||o.byteLength/f}else if(o.buffer){let f=o.stride||this.positionSize*4;i=i||o.buffer.byteLength/f}else if(o.value){let f=o.value,h=o.stride/f.BYTES_PER_ELEMENT||this.positionSize;i=i||f.length/h}this._allocate(i,Boolean(e)),this.indexStarts=r,this.vertexStarts=s,this.instanceCount=i;let u={};this._forEachGeometry((f,h)=>{let d=l[h]||f;u.vertexStart=s[h],u.indexStart=r[h];let p=h<s.length-1?s[h+1]:i;u.geometrySize=p-s[h],u.geometryIndex=h,this.updateGeometryAttributes(d,u)},a,c),this.vertexCount=r[r.length-1]}};var vP=`#version 300 es
#define SHADER_NAME arc-layer-vertex-shader
in vec3 positions;
in vec4 instanceSourceColors;
in vec4 instanceTargetColors;
in vec3 instanceSourcePositions;
in vec3 instanceSourcePositions64Low;
in vec3 instanceTargetPositions;
in vec3 instanceTargetPositions64Low;
in vec3 instancePickingColors;
in float instanceWidths;
in float instanceHeights;
in float instanceTilts;
uniform bool greatCircle;
uniform bool useShortestPath;
uniform float numSegments;
uniform float opacity;
uniform float widthScale;
uniform float widthMinPixels;
uniform float widthMaxPixels;
uniform int widthUnits;
out vec4 vColor;
out vec2 uv;
out float isValid;
float paraboloid(float distance, float sourceZ, float targetZ, float ratio) {
float deltaZ = targetZ - sourceZ;
float dh = distance * instanceHeights;
if (dh == 0.0) {
return sourceZ + deltaZ * ratio;
}
float unitZ = deltaZ / dh;
float p2 = unitZ * unitZ + 1.0;
float dir = step(deltaZ, 0.0);
float z0 = mix(sourceZ, targetZ, dir);
float r = mix(ratio, 1.0 - ratio, dir);
return sqrt(r * (p2 - r)) * dh + z0;
}
vec2 getExtrusionOffset(vec2 line_clipspace, float offset_direction, float width) {
vec2 dir_screenspace = normalize(line_clipspace * project_uViewportSize);
dir_screenspace = vec2(-dir_screenspace.y, dir_screenspace.x);
return dir_screenspace * offset_direction * width / 2.0;
}
float getSegmentRatio(float index) {
return smoothstep(0.0, 1.0, index / (numSegments - 1.0));
}
vec3 interpolateFlat(vec3 source, vec3 target, float segmentRatio) {
float distance = length(source.xy - target.xy);
float z = paraboloid(distance, source.z, target.z, segmentRatio);
float tiltAngle = radians(instanceTilts);
vec2 tiltDirection = normalize(target.xy - source.xy);
vec2 tilt = vec2(-tiltDirection.y, tiltDirection.x) * z * sin(tiltAngle);
return vec3(
mix(source.xy, target.xy, segmentRatio) + tilt,
z * cos(tiltAngle)
);
}
float getAngularDist (vec2 source, vec2 target) {
vec2 sourceRadians = radians(source);
vec2 targetRadians = radians(target);
vec2 sin_half_delta = sin((sourceRadians - targetRadians) / 2.0);
vec2 shd_sq = sin_half_delta * sin_half_delta;
float a = shd_sq.y + cos(sourceRadians.y) * cos(targetRadians.y) * shd_sq.x;
return 2.0 * asin(sqrt(a));
}
vec3 interpolateGreatCircle(vec3 source, vec3 target, vec3 source3D, vec3 target3D, float angularDist, float t) {
vec2 lngLat;
if(abs(angularDist - PI) < 0.001) {
lngLat = (1.0 - t) * source.xy + t * target.xy;
} else {
float a = sin((1.0 - t) * angularDist);
float b = sin(t * angularDist);
vec3 p = source3D.yxz * a + target3D.yxz * b;
lngLat = degrees(vec2(atan(p.y, -p.x), atan(p.z, length(p.xy))));
}
float z = paraboloid(angularDist * EARTH_RADIUS, source.z, target.z, t);
return vec3(lngLat, z);
}
void main(void) {
geometry.worldPosition = instanceSourcePositions;
geometry.worldPositionAlt = instanceTargetPositions;
float segmentIndex = positions.x;
float segmentRatio = getSegmentRatio(segmentIndex);
float prevSegmentRatio = getSegmentRatio(max(0.0, segmentIndex - 1.0));
float nextSegmentRatio = getSegmentRatio(min(numSegments - 1.0, segmentIndex + 1.0));
float indexDir = mix(-1.0, 1.0, step(segmentIndex, 0.0));
isValid = 1.0;
uv = vec2(segmentRatio, positions.y);
geometry.uv = uv;
geometry.pickingColor = instancePickingColors;
vec4 curr;
vec4 next;
vec3 source;
vec3 target;
if ((greatCircle || project_uProjectionMode == PROJECTION_MODE_GLOBE) && project_uCoordinateSystem == COORDINATE_SYSTEM_LNGLAT) {
source = project_globe_(vec3(instanceSourcePositions.xy, 0.0));
target = project_globe_(vec3(instanceTargetPositions.xy, 0.0));
float angularDist = getAngularDist(instanceSourcePositions.xy, instanceTargetPositions.xy);
vec3 prevPos = interpolateGreatCircle(instanceSourcePositions, instanceTargetPositions, source, target, angularDist, prevSegmentRatio);
vec3 currPos = interpolateGreatCircle(instanceSourcePositions, instanceTargetPositions, source, target, angularDist, segmentRatio);
vec3 nextPos = interpolateGreatCircle(instanceSourcePositions, instanceTargetPositions, source, target, angularDist, nextSegmentRatio);
if (abs(currPos.x - prevPos.x) > 180.0) {
indexDir = -1.0;
isValid = 0.0;
} else if (abs(currPos.x - nextPos.x) > 180.0) {
indexDir = 1.0;
isValid = 0.0;
}
nextPos = indexDir < 0.0 ? prevPos : nextPos;
nextSegmentRatio = indexDir < 0.0 ? prevSegmentRatio : nextSegmentRatio;
if (isValid == 0.0) {
nextPos.x += nextPos.x > 0.0 ? -360.0 : 360.0;
float t = ((currPos.x > 0.0 ? 180.0 : -180.0) - currPos.x) / (nextPos.x - currPos.x);
currPos = mix(currPos, nextPos, t);
segmentRatio = mix(segmentRatio, nextSegmentRatio, t);
}
vec3 currPos64Low = mix(instanceSourcePositions64Low, instanceTargetPositions64Low, segmentRatio);
vec3 nextPos64Low = mix(instanceSourcePositions64Low, instanceTargetPositions64Low, nextSegmentRatio);
curr = project_position_to_clipspace(currPos, currPos64Low, vec3(0.0), geometry.position);
next = project_position_to_clipspace(nextPos, nextPos64Low, vec3(0.0));
} else {
vec3 source_world = instanceSourcePositions;
vec3 target_world = instanceTargetPositions;
if (useShortestPath) {
source_world.x = mod(source_world.x + 180., 360.0) - 180.;
target_world.x = mod(target_world.x + 180., 360.0) - 180.;
float deltaLng = target_world.x - source_world.x;
if (deltaLng > 180.) target_world.x -= 360.;
if (deltaLng < -180.) source_world.x -= 360.;
}
source = project_position(source_world, instanceSourcePositions64Low);
target = project_position(target_world, instanceTargetPositions64Low);
float antiMeridianX = 0.0;
if (useShortestPath) {
if (project_uProjectionMode == PROJECTION_MODE_WEB_MERCATOR_AUTO_OFFSET) {
antiMeridianX = -(project_uCoordinateOrigin.x + 180.) / 360. * TILE_SIZE;
}
float thresholdRatio = (antiMeridianX - source.x) / (target.x - source.x);
if (prevSegmentRatio <= thresholdRatio && nextSegmentRatio > thresholdRatio) {
isValid = 0.0;
indexDir = sign(segmentRatio - thresholdRatio);
segmentRatio = thresholdRatio;
}
}
nextSegmentRatio = indexDir < 0.0 ? prevSegmentRatio : nextSegmentRatio;
vec3 currPos = interpolateFlat(source, target, segmentRatio);
vec3 nextPos = interpolateFlat(source, target, nextSegmentRatio);
if (useShortestPath) {
if (nextPos.x < antiMeridianX) {
currPos.x += TILE_SIZE;
nextPos.x += TILE_SIZE;
}
}
curr = project_common_position_to_clipspace(vec4(currPos, 1.0));
next = project_common_position_to_clipspace(vec4(nextPos, 1.0));
geometry.position = vec4(currPos, 1.0);
}
float widthPixels = clamp(
project_size_to_pixel(instanceWidths * widthScale, widthUnits),
widthMinPixels, widthMaxPixels
);
vec3 offset = vec3(
getExtrusionOffset((next.xy - curr.xy) * indexDir, positions.y, widthPixels),
0.0);
DECKGL_FILTER_SIZE(offset, geometry);
DECKGL_FILTER_GL_POSITION(curr, geometry);
gl_Position = curr + vec4(project_pixel_size_to_clipspace(offset.xy), 0.0, 0.0);
vec4 color = mix(instanceSourceColors, instanceTargetColors, segmentRatio);
vColor = vec4(color.rgb, color.a * opacity);
DECKGL_FILTER_COLOR(vColor, geometry);
}
`;var CP=`#version 300 es
#define SHADER_NAME arc-layer-fragment-shader
precision highp float;
in vec4 vColor;
in vec2 uv;
in float isValid;
out vec4 fragColor;
void main(void) {
if (isValid == 0.0) {
discard;
}
fragColor = vColor;
geometry.uv = uv;
DECKGL_FILTER_COLOR(fragColor, geometry);
}
`;var Dp=[0,0,0,255],xH={getSourcePosition:{type:"accessor",value:t=>t.sourcePosition},getTargetPosition:{type:"accessor",value:t=>t.targetPosition},getSourceColor:{type:"accessor",value:Dp},getTargetColor:{type:"accessor",value:Dp},getWidth:{type:"accessor",value:1},getHeight:{type:"accessor",value:1},getTilt:{type:"accessor",value:0},greatCircle:!1,numSegments:{type:"number",value:50,min:1},widthUnits:"pixels",widthScale:{type:"number",value:1,min:0},widthMinPixels:{type:"number",value:0,min:0},widthMaxPixels:{type:"number",value:Number.MAX_SAFE_INTEGER,min:0}},hu=class extends he{getBounds(){return this.getAttributeManager()?.getBounds(["instanceSourcePositions","instanceTargetPositions"])}getShaders(){return super.getShaders({vs:vP,fs:CP,modules:[de,_e]})}get wrapLongitude(){return!1}initializeState(){this.getAttributeManager().addInstanced({instanceSourcePositions:{size:3,type:"float64",fp64:this.use64bitPositions(),transition:!0,accessor:"getSourcePosition"},instanceTargetPositions:{size:3,type:"float64",fp64:this.use64bitPositions(),transition:!0,accessor:"getTargetPosition"},instanceSourceColors:{size:this.props.colorFormat.length,type:"unorm8",transition:!0,accessor:"getSourceColor",defaultValue:Dp},instanceTargetColors:{size:this.props.colorFormat.length,type:"unorm8",transition:!0,accessor:"getTargetColor",defaultValue:Dp},instanceWidths:{size:1,transition:!0,accessor:"getWidth",defaultValue:1},instanceHeights:{size:1,transition:!0,accessor:"getHeight",defaultValue:1},instanceTilts:{size:1,transition:!0,accessor:"getTilt",defaultValue:0}})}updateState(e){super.updateState(e);let{props:r,oldProps:s,changeFlags:i}=e;(i.extensionsChanged||r.numSegments!==s.numSegments)&&(this.state.model?.destroy(),this.state.model=this._getModel(),this.getAttributeManager().invalidateAll())}draw({uniforms:e}){let{widthUnits:r,widthScale:s,widthMinPixels:i,widthMaxPixels:n,greatCircle:o,wrapLongitude:a}=this.props,c=this.state.model;c.setUniforms(e),c.setUniforms({greatCircle:o,widthUnits:Fe[r],widthScale:s,widthMinPixels:i,widthMaxPixels:n,useShortestPath:a}),c.draw(this.context.renderPass)}_getModel(){let{numSegments:e}=this.props,r=[];for(let i=0;i<e;i++)r=r.concat([i,1,0,i,-1,0]);let s=new J(this.context.device,{...this.getShaders(),id:this.props.id,bufferLayout:this.getAttributeManager().getBufferLayouts(),geometry:new se({topology:"triangle-strip",attributes:{positions:{size:3,value:new Float32Array(r)}}}),isInstanced:!0});return s.setUniforms({numSegments:e}),s}};hu.layerName="ArcLayer";hu.defaultProps=xH;var Up=hu;var AH=new Uint32Array([0,2,1,0,3,2]),TH=new Float32Array([0,1,0,0,1,0,1,1]);function fA(t,e){if(!e)return bH(t);let r=Math.max(Math.abs(t[0][0]-t[3][0]),Math.abs(t[1][0]-t[2][0])),s=Math.max(Math.abs(t[1][1]-t[0][1]),Math.abs(t[2][1]-t[3][1])),i=Math.ceil(r/e)+1,n=Math.ceil(s/e)+1,o=(i-1)*(n-1)*6,a=new Uint32Array(o),c=new Float32Array(i*n*2),l=new Float64Array(i*n*3),u=0,f=0;for(let h=0;h<i;h++){let d=h/(i-1);for(let p=0;p<n;p++){let g=p/(n-1),m=EH(t,d,g);l[u*3+0]=m[0],l[u*3+1]=m[1],l[u*3+2]=m[2]||0,c[u*2+0]=d,c[u*2+1]=1-g,h>0&&p>0&&(a[f++]=u-n,a[f++]=u-n-1,a[f++]=u-1,a[f++]=u-n,a[f++]=u-1,a[f++]=u),u++}}return{vertexCount:o,positions:l,indices:a,texCoords:c}}function bH(t){let e=new Float64Array(12);for(let r=0;r<t.length;r++)e[r*3+0]=t[r][0],e[r*3+1]=t[r][1],e[r*3+2]=t[r][2]||0;return{vertexCount:6,positions:e,indices:AH,texCoords:TH}}function EH(t,e,r){return it(it(t[0],t[1],r),it(t[3],t[2],r),e)}var wP=`#version 300 es
#define SHADER_NAME bitmap-layer-vertex-shader

in vec2 texCoords;
in vec3 positions;
in vec3 positions64Low;

out vec2 vTexCoord;
out vec2 vTexPos;

uniform float coordinateConversion;

const vec3 pickingColor = vec3(1.0, 0.0, 0.0);

void main(void) {
  geometry.worldPosition = positions;
  geometry.uv = texCoords;
  geometry.pickingColor = pickingColor;

  gl_Position = project_position_to_clipspace(positions, positions64Low, vec3(0.0), geometry.position);
  DECKGL_FILTER_GL_POSITION(gl_Position, geometry);

  vTexCoord = texCoords;

  if (coordinateConversion < -0.5) {
    vTexPos = geometry.position.xy + project_uCommonOrigin.xy;
  } else if (coordinateConversion > 0.5) {
    vTexPos = geometry.worldPosition.xy;
  }

  vec4 color = vec4(0.0);
  DECKGL_FILTER_COLOR(color, geometry);
}
`;var SH=`
vec3 packUVsIntoRGB(vec2 uv) {
  // Extract the top 8 bits. We want values to be truncated down so we can add a fraction
  vec2 uv8bit = floor(uv * 256.);

  // Calculate the normalized remainders of u and v parts that do not fit into 8 bits
  // Scale and clamp to 0-1 range
  vec2 uvFraction = fract(uv * 256.);
  vec2 uvFraction4bit = floor(uvFraction * 16.);

  // Remainder can be encoded in blue channel, encode as 4 bits for pixel coordinates
  float fractions = uvFraction4bit.x + uvFraction4bit.y * 16.;

  return vec3(uv8bit, fractions) / 255.;
}
`,PP=`#version 300 es
#define SHADER_NAME bitmap-layer-fragment-shader

#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D bitmapTexture;

in vec2 vTexCoord;
in vec2 vTexPos;

out vec4 fragColor;

uniform float desaturate;
uniform vec4 transparentColor;
uniform vec3 tintColor;
uniform float opacity;

uniform float coordinateConversion;
uniform vec4 bounds;

/* projection utils */
const float TILE_SIZE = 512.0;
const float PI = 3.1415926536;
const float WORLD_SCALE = TILE_SIZE / PI / 2.0;

// from degrees to Web Mercator
vec2 lnglat_to_mercator(vec2 lnglat) {
  float x = lnglat.x;
  float y = clamp(lnglat.y, -89.9, 89.9);
  return vec2(
    radians(x) + PI,
    PI + log(tan(PI * 0.25 + radians(y) * 0.5))
  ) * WORLD_SCALE;
}

// from Web Mercator to degrees
vec2 mercator_to_lnglat(vec2 xy) {
  xy /= WORLD_SCALE;
  return degrees(vec2(
    xy.x - PI,
    atan(exp(xy.y - PI)) * 2.0 - PI * 0.5
  ));
}
/* End projection utils */

// apply desaturation
vec3 color_desaturate(vec3 color) {
  float luminance = (color.r + color.g + color.b) * 0.333333333;
  return mix(color, vec3(luminance), desaturate);
}

// apply tint
vec3 color_tint(vec3 color) {
  return color * tintColor;
}

// blend with background color
vec4 apply_opacity(vec3 color, float alpha) {
  if (transparentColor.a == 0.0) {
    return vec4(color, alpha);
  }
  float blendedAlpha = alpha + transparentColor.a * (1.0 - alpha);
  float highLightRatio = alpha / blendedAlpha;
  vec3 blendedRGB = mix(transparentColor.rgb, color, highLightRatio);
  return vec4(blendedRGB, blendedAlpha);
}

vec2 getUV(vec2 pos) {
  return vec2(
    (pos.x - bounds[0]) / (bounds[2] - bounds[0]),
    (pos.y - bounds[3]) / (bounds[1] - bounds[3])
  );
}

${SH}

void main(void) {
  vec2 uv = vTexCoord;
  if (coordinateConversion < -0.5) {
    vec2 lnglat = mercator_to_lnglat(vTexPos);
    uv = getUV(lnglat);
  } else if (coordinateConversion > 0.5) {
    vec2 commonPos = lnglat_to_mercator(vTexPos);
    uv = getUV(commonPos);
  }
  vec4 bitmapColor = texture(bitmapTexture, uv);

  fragColor = apply_opacity(color_tint(color_desaturate(bitmapColor.rgb)), bitmapColor.a * opacity);

  geometry.uv = uv;
  DECKGL_FILTER_COLOR(fragColor, geometry);

  if (bool(picking.isActive) && !bool(picking.isAttribute)) {
    // Since instance information is not used, we can use picking color for pixel index
    fragColor.rgb = packUVsIntoRGB(uv);
  }
}
`;var vH={image:{type:"image",value:null,async:!0},bounds:{type:"array",value:[1,0,0,1],compare:!0},_imageCoordinateSystem:X.DEFAULT,desaturate:{type:"number",min:0,max:1,value:0},transparentColor:{type:"color",value:[0,0,0,0]},tintColor:{type:"color",value:[255,255,255]},textureParameters:{type:"object",ignore:!0,value:null}},du=class extends he{getShaders(){return super.getShaders({vs:wP,fs:PP,modules:[de,_e]})}initializeState(){let e=this.getAttributeManager();e.remove(["instancePickingColors"]);let r=!0;e.add({indices:{size:1,isIndexed:!0,update:s=>s.value=this.state.mesh.indices,noAlloc:r},positions:{size:3,type:"float64",fp64:this.use64bitPositions(),update:s=>s.value=this.state.mesh.positions,noAlloc:r},texCoords:{size:2,update:s=>s.value=this.state.mesh.texCoords,noAlloc:r}})}updateState({props:e,oldProps:r,changeFlags:s}){let i=this.getAttributeManager();if(s.extensionsChanged&&(this.state.model?.destroy(),this.state.model=this._getModel(),i.invalidateAll()),e.bounds!==r.bounds){let n=this.state.mesh,o=this._createMesh();this.state.model.setVertexCount(o.vertexCount);for(let a in o)n&&n[a]!==o[a]&&i.invalidate(a);this.setState({mesh:o,...this._getCoordinateUniforms()})}else e._imageCoordinateSystem!==r._imageCoordinateSystem&&this.setState(this._getCoordinateUniforms())}getPickingInfo(e){let{image:r}=this.props,s=e.info;if(!s.color||!r)return s.bitmap=null,s;let{width:i,height:n}=r;s.index=0;let o=CH(s.color);return s.bitmap={size:{width:i,height:n},uv:o,pixel:[Math.floor(o[0]*i),Math.floor(o[1]*n)]},s}disablePickingIndex(){this.setState({disablePicking:!0})}restorePickingColors(){this.setState({disablePicking:!1})}_updateAutoHighlight(e){super._updateAutoHighlight({...e,color:this.encodePickingColor(0)})}_createMesh(){let{bounds:e}=this.props,r=e;return MP(e)&&(r=[[e[0],e[1]],[e[0],e[3]],[e[2],e[3]],[e[2],e[1]]]),fA(r,this.context.viewport.resolution)}_getModel(){return new J(this.context.device,{...this.getShaders(),id:this.props.id,bufferLayout:this.getAttributeManager().getBufferLayouts(),topology:"triangle-list",isInstanced:!1})}draw(e){let{uniforms:r,moduleParameters:s}=e,{model:i,coordinateConversion:n,bounds:o,disablePicking:a}=this.state,{image:c,desaturate:l,transparentColor:u,tintColor:f}=this.props;s.picking.isActive&&a||c&&i&&(i.setUniforms(r),i.setBindings({bitmapTexture:c}),i.setUniforms({desaturate:l,transparentColor:u.map(h=>h/255),tintColor:f.slice(0,3).map(h=>h/255),coordinateConversion:n,bounds:o}),i.draw(this.context.renderPass))}_getCoordinateUniforms(){let{LNGLAT:e,CARTESIAN:r,DEFAULT:s}=X,{_imageCoordinateSystem:i}=this.props;if(i!==s){let{bounds:n}=this.props;if(!MP(n))throw new Error("_imageCoordinateSystem only supports rectangular bounds");let o=this.context.viewport.resolution?e:r;if(i=i===e?e:r,i===e&&o===r)return{coordinateConversion:-1,bounds:n};if(i===r&&o===e){let a=je([n[0],n[1]]),c=je([n[2],n[3]]);return{coordinateConversion:1,bounds:[a[0],a[1],c[0],c[1]]}}}return{coordinateConversion:0,bounds:[0,0,0,0]}}};du.layerName="BitmapLayer";du.defaultProps=vH;var kp=du;function CH(t){let[e,r,s]=t,i=(s&240)/256,n=(s&15)/16;return[(e+n)/256,(r+i)/256]}function MP(t){return Number.isFinite(t[0])}var RP=`#version 300 es
#define SHADER_NAME icon-layer-vertex-shader
in vec2 positions;
in vec3 instancePositions;
in vec3 instancePositions64Low;
in float instanceSizes;
in float instanceAngles;
in vec4 instanceColors;
in vec3 instancePickingColors;
in vec4 instanceIconFrames;
in float instanceColorModes;
in vec2 instanceOffsets;
in vec2 instancePixelOffset;
uniform float sizeScale;
uniform vec2 iconsTextureDim;
uniform float sizeMinPixels;
uniform float sizeMaxPixels;
uniform bool billboard;
uniform int sizeUnits;
out float vColorMode;
out vec4 vColor;
out vec2 vTextureCoords;
out vec2 uv;
vec2 rotate_by_angle(vec2 vertex, float angle) {
float angle_radian = angle * PI / 180.0;
float cos_angle = cos(angle_radian);
float sin_angle = sin(angle_radian);
mat2 rotationMatrix = mat2(cos_angle, -sin_angle, sin_angle, cos_angle);
return rotationMatrix * vertex;
}
void main(void) {
geometry.worldPosition = instancePositions;
geometry.uv = positions;
geometry.pickingColor = instancePickingColors;
uv = positions;
vec2 iconSize = instanceIconFrames.zw;
float sizePixels = clamp(
project_size_to_pixel(instanceSizes * sizeScale, sizeUnits),
sizeMinPixels, sizeMaxPixels
);
float instanceScale = iconSize.y == 0.0 ? 0.0 : sizePixels / iconSize.y;
vec2 pixelOffset = positions / 2.0 * iconSize + instanceOffsets;
pixelOffset = rotate_by_angle(pixelOffset, instanceAngles) * instanceScale;
pixelOffset += instancePixelOffset;
pixelOffset.y *= -1.0;
if (billboard)  {
gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, vec3(0.0), geometry.position);
DECKGL_FILTER_GL_POSITION(gl_Position, geometry);
vec3 offset = vec3(pixelOffset, 0.0);
DECKGL_FILTER_SIZE(offset, geometry);
gl_Position.xy += project_pixel_size_to_clipspace(offset.xy);
} else {
vec3 offset_common = vec3(project_pixel_size(pixelOffset), 0.0);
DECKGL_FILTER_SIZE(offset_common, geometry);
gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, offset_common, geometry.position);
DECKGL_FILTER_GL_POSITION(gl_Position, geometry);
}
vTextureCoords = mix(
instanceIconFrames.xy,
instanceIconFrames.xy + iconSize,
(positions.xy + 1.0) / 2.0
) / iconsTextureDim;
vColor = instanceColors;
DECKGL_FILTER_COLOR(vColor, geometry);
vColorMode = instanceColorModes;
}
`;var IP=`#version 300 es
#define SHADER_NAME icon-layer-fragment-shader
precision highp float;
uniform float opacity;
uniform sampler2D iconsTexture;
uniform float alphaCutoff;
in float vColorMode;
in vec4 vColor;
in vec2 vTextureCoords;
in vec2 uv;
out vec4 fragColor;
void main(void) {
geometry.uv = uv;
vec4 texColor = texture(iconsTexture, vTextureCoords);
vec3 color = mix(texColor.rgb, vColor.rgb, vColorMode);
float a = texColor.a * opacity * vColor.a;
if (a < alphaCutoff) {
discard;
}
fragColor = vec4(color, a);
DECKGL_FILTER_COLOR(fragColor, geometry);
}
`;var wH=1024,PH=4,BP=()=>{},OP={minFilter:"linear",mipmapFilter:"linear",magFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"},MH={x:0,y:0,width:0,height:0};function RH(t){return Math.pow(2,Math.ceil(Math.log2(t)))}function IH(t,e,r,s){let i=Math.min(r/e.width,s/e.height),n=Math.floor(e.width*i),o=Math.floor(e.height*i);return i===1?{data:e,width:n,height:o}:(t.canvas.height=o,t.canvas.width=n,t.clearRect(0,0,n,o),t.drawImage(e,0,0,e.width,e.height,0,0,n,o),{data:t.canvas,width:n,height:o})}function pu(t){return t&&(t.id||t.url)}function BH(t,e,r,s){let{width:i,height:n,device:o}=t,a=o.createTexture({format:"rgba8unorm",width:e,height:r,sampler:s}),c=o.createCommandEncoder();return c.copyTextureToTexture({source:t,destination:a,width:i,height:n}),c.finish(),t.destroy(),a}function FP(t,e,r){for(let s=0;s<e.length;s++){let{icon:i,xOffset:n}=e[s],o=pu(i);t[o]={...i,x:n,y:r}}}function OH({icons:t,buffer:e,mapping:r={},xOffset:s=0,yOffset:i=0,rowHeight:n=0,canvasWidth:o}){let a=[];for(let c=0;c<t.length;c++){let l=t[c],u=pu(l);if(!r[u]){let{height:f,width:h}=l;s+h+e>o&&(FP(r,a,i),s=0,i=n+i+e,n=0,a=[]),a.push({icon:l,xOffset:s}),s=s+h+e,n=Math.max(n,f)}}return a.length>0&&FP(r,a,i),{mapping:r,rowHeight:n,xOffset:s,yOffset:i,canvasWidth:o,canvasHeight:RH(n+i+e)}}function FH(t,e,r){if(!t||!e)return null;r=r||{};let s={},{iterable:i,objectInfo:n}=ze(t);for(let o of i){n.index++;let a=e(o,n),c=pu(a);if(!a)throw new Error("Icon is missing.");if(!a.url)throw new Error("Icon url is missing.");!s[c]&&(!r[c]||a.url!==r[c].url)&&(s[c]={...a,source:o,sourceIndex:n.index})}return s}var gu=class{constructor(e,{onUpdate:r=BP,onError:s=BP}){this._loadOptions=null,this._texture=null,this._externalTexture=null,this._mapping={},this._textureParameters=null,this._pendingCount=0,this._autoPacking=!1,this._xOffset=0,this._yOffset=0,this._rowHeight=0,this._buffer=PH,this._canvasWidth=wH,this._canvasHeight=0,this._canvas=null,this.device=e,this.onUpdate=r,this.onError=s}finalize(){this._texture?.delete()}getTexture(){return this._texture||this._externalTexture}getIconMapping(e){let r=this._autoPacking?pu(e):e;return this._mapping[r]||MH}setProps({loadOptions:e,autoPacking:r,iconAtlas:s,iconMapping:i,textureParameters:n}){e&&(this._loadOptions=e),r!==void 0&&(this._autoPacking=r),i&&(this._mapping=i),s&&(this._texture?.delete(),this._texture=null,this._externalTexture=s),n&&(this._textureParameters=n)}get isLoaded(){return this._pendingCount===0}packIcons(e,r){if(!this._autoPacking||typeof document>"u")return;let s=Object.values(FH(e,r,this._mapping)||{});if(s.length>0){let{mapping:i,xOffset:n,yOffset:o,rowHeight:a,canvasHeight:c}=OH({icons:s,buffer:this._buffer,canvasWidth:this._canvasWidth,mapping:this._mapping,rowHeight:this._rowHeight,xOffset:this._xOffset,yOffset:this._yOffset});this._rowHeight=a,this._mapping=i,this._xOffset=n,this._yOffset=o,this._canvasHeight=c,this._texture||(this._texture=this.device.createTexture({format:"rgba8unorm",width:this._canvasWidth,height:this._canvasHeight,sampler:this._textureParameters||OP})),this._texture.height!==this._canvasHeight&&(this._texture=BH(this._texture,this._canvasWidth,this._canvasHeight,this._textureParameters||OP)),this.onUpdate(),this._canvas=this._canvas||document.createElement("canvas"),this._loadIcons(s)}}_loadIcons(e){let r=this._canvas.getContext("2d",{willReadFrequently:!0});for(let s of e)this._pendingCount++,$e(s.url,this._loadOptions).then(i=>{let n=pu(s),o=this._mapping[n],{x:a,y:c,width:l,height:u}=o,{data:f,width:h,height:d}=IH(r,i,l,u);this._texture.setSubImageData({data:f,x:a+(l-h)/2,y:c+(u-d)/2,width:h,height:d}),o.width=h,o.height=d,this._texture.generateMipmap(),this.onUpdate()}).catch(i=>{this.onError({url:s.url,source:s.source,sourceIndex:s.sourceIndex,loadOptions:this._loadOptions,error:i})}).finally(()=>{this._pendingCount--})}};var LP=[0,0,0,255],LH={iconAtlas:{type:"image",value:null,async:!0},iconMapping:{type:"object",value:{},async:!0},sizeScale:{type:"number",value:1,min:0},billboard:!0,sizeUnits:"pixels",sizeMinPixels:{type:"number",min:0,value:0},sizeMaxPixels:{type:"number",min:0,value:Number.MAX_SAFE_INTEGER},alphaCutoff:{type:"number",value:.05,min:0,max:1},getPosition:{type:"accessor",value:t=>t.position},getIcon:{type:"accessor",value:t=>t.icon},getColor:{type:"accessor",value:LP},getSize:{type:"accessor",value:1},getAngle:{type:"accessor",value:0},getPixelOffset:{type:"accessor",value:[0,0]},onIconError:{type:"function",value:null,optional:!0},textureParameters:{type:"object",ignore:!0,value:null}},mu=class extends he{getShaders(){return super.getShaders({vs:RP,fs:IP,modules:[de,_e]})}initializeState(){this.state={iconManager:new gu(this.context.device,{onUpdate:this._onUpdate.bind(this),onError:this._onError.bind(this)})},this.getAttributeManager().addInstanced({instancePositions:{size:3,type:"float64",fp64:this.use64bitPositions(),transition:!0,accessor:"getPosition"},instanceSizes:{size:1,transition:!0,accessor:"getSize",defaultValue:1},instanceOffsets:{size:2,accessor:"getIcon",transform:this.getInstanceOffset},instanceIconFrames:{size:4,accessor:"getIcon",transform:this.getInstanceIconFrame},instanceColorModes:{size:1,type:"uint8",accessor:"getIcon",transform:this.getInstanceColorMode},instanceColors:{size:this.props.colorFormat.length,type:"unorm8",transition:!0,accessor:"getColor",defaultValue:LP},instanceAngles:{size:1,transition:!0,accessor:"getAngle"},instancePixelOffset:{size:2,transition:!0,accessor:"getPixelOffset"}})}updateState(e){super.updateState(e);let{props:r,oldProps:s,changeFlags:i}=e,n=this.getAttributeManager(),{iconAtlas:o,iconMapping:a,data:c,getIcon:l,textureParameters:u}=r,{iconManager:f}=this.state;if(typeof o=="string")return;let h=o||this.internalState.isAsyncPropLoading("iconAtlas");f.setProps({loadOptions:r.loadOptions,autoPacking:!h,iconAtlas:o,iconMapping:h?a:null,textureParameters:u}),h?s.iconMapping!==r.iconMapping&&n.invalidate("getIcon"):(i.dataChanged||i.updateTriggersChanged&&(i.updateTriggersChanged.all||i.updateTriggersChanged.getIcon))&&f.packIcons(c,l),i.extensionsChanged&&(this.state.model?.destroy(),this.state.model=this._getModel(),n.invalidateAll())}get isLoaded(){return super.isLoaded&&this.state.iconManager.isLoaded}finalizeState(e){super.finalizeState(e),this.state.iconManager.finalize()}draw({uniforms:e}){let{sizeScale:r,sizeMinPixels:s,sizeMaxPixels:i,sizeUnits:n,billboard:o,alphaCutoff:a}=this.props,{iconManager:c}=this.state,l=c.getTexture();if(l){let u=this.state.model;u.setBindings({iconsTexture:l}),u.setUniforms(e),u.setUniforms({iconsTextureDim:[l.width,l.height],sizeUnits:Fe[n],sizeScale:r,sizeMinPixels:s,sizeMaxPixels:i,billboard:o,alphaCutoff:a}),u.draw(this.context.renderPass)}}_getModel(){let e=[-1,-1,1,-1,-1,1,1,1];return new J(this.context.device,{...this.getShaders(),id:this.props.id,bufferLayout:this.getAttributeManager().getBufferLayouts(),geometry:new se({topology:"triangle-strip",attributes:{positions:{size:2,value:new Float32Array(e)}}}),isInstanced:!0})}_onUpdate(){this.setNeedsRedraw()}_onError(e){let r=this.getCurrentLayer()?.props.onIconError;r?r(e):k.error(e.error.message)()}getInstanceOffset(e){let{width:r,height:s,anchorX:i=r/2,anchorY:n=s/2}=this.state.iconManager.getIconMapping(e);return[r/2-i,s/2-n]}getInstanceColorMode(e){return this.state.iconManager.getIconMapping(e).mask?1:0}getInstanceIconFrame(e){let{x:r,y:s,width:i,height:n}=this.state.iconManager.getIconMapping(e);return[r,s,i,n]}};mu.defaultProps=LH;mu.layerName="IconLayer";var pa=mu;var NP=`#version 300 es
#define SHADER_NAME line-layer-vertex-shader
in vec3 positions;
in vec3 instanceSourcePositions;
in vec3 instanceTargetPositions;
in vec3 instanceSourcePositions64Low;
in vec3 instanceTargetPositions64Low;
in vec4 instanceColors;
in vec3 instancePickingColors;
in float instanceWidths;
uniform float opacity;
uniform float widthScale;
uniform float widthMinPixels;
uniform float widthMaxPixels;
uniform float useShortestPath;
uniform int widthUnits;
out vec4 vColor;
out vec2 uv;
vec2 getExtrusionOffset(vec2 line_clipspace, float offset_direction, float width) {
vec2 dir_screenspace = normalize(line_clipspace * project_uViewportSize);
dir_screenspace = vec2(-dir_screenspace.y, dir_screenspace.x);
return dir_screenspace * offset_direction * width / 2.0;
}
vec3 splitLine(vec3 a, vec3 b, float x) {
float t = (x - a.x) / (b.x - a.x);
return vec3(x, mix(a.yz, b.yz, t));
}
void main(void) {
geometry.worldPosition = instanceSourcePositions;
geometry.worldPositionAlt = instanceTargetPositions;
vec3 source_world = instanceSourcePositions;
vec3 target_world = instanceTargetPositions;
vec3 source_world_64low = instanceSourcePositions64Low;
vec3 target_world_64low = instanceTargetPositions64Low;
if (useShortestPath > 0.5 || useShortestPath < -0.5) {
source_world.x = mod(source_world.x + 180., 360.0) - 180.;
target_world.x = mod(target_world.x + 180., 360.0) - 180.;
float deltaLng = target_world.x - source_world.x;
if (deltaLng * useShortestPath > 180.) {
source_world.x += 360. * useShortestPath;
source_world = splitLine(source_world, target_world, 180. * useShortestPath);
source_world_64low = vec3(0.0);
} else if (deltaLng * useShortestPath < -180.) {
target_world.x += 360. * useShortestPath;
target_world = splitLine(source_world, target_world, 180. * useShortestPath);
target_world_64low = vec3(0.0);
} else if (useShortestPath < 0.) {
gl_Position = vec4(0.);
return;
}
}
vec4 source_commonspace;
vec4 target_commonspace;
vec4 source = project_position_to_clipspace(source_world, source_world_64low, vec3(0.), source_commonspace);
vec4 target = project_position_to_clipspace(target_world, target_world_64low, vec3(0.), target_commonspace);
float segmentIndex = positions.x;
vec4 p = mix(source, target, segmentIndex);
geometry.position = mix(source_commonspace, target_commonspace, segmentIndex);
uv = positions.xy;
geometry.uv = uv;
geometry.pickingColor = instancePickingColors;
float widthPixels = clamp(
project_size_to_pixel(instanceWidths * widthScale, widthUnits),
widthMinPixels, widthMaxPixels
);
vec3 offset = vec3(
getExtrusionOffset(target.xy - source.xy, positions.y, widthPixels),
0.0);
DECKGL_FILTER_SIZE(offset, geometry);
DECKGL_FILTER_GL_POSITION(p, geometry);
gl_Position = p + vec4(project_pixel_size_to_clipspace(offset.xy), 0.0, 0.0);
vColor = vec4(instanceColors.rgb, instanceColors.a * opacity);
DECKGL_FILTER_COLOR(vColor, geometry);
}
`;var DP=`#version 300 es
#define SHADER_NAME line-layer-fragment-shader
precision highp float;
in vec4 vColor;
in vec2 uv;
out vec4 fragColor;
void main(void) {
geometry.uv = uv;
fragColor = vColor;
DECKGL_FILTER_COLOR(fragColor, geometry);
}
`;var NH=[0,0,0,255],DH={getSourcePosition:{type:"accessor",value:t=>t.sourcePosition},getTargetPosition:{type:"accessor",value:t=>t.targetPosition},getColor:{type:"accessor",value:NH},getWidth:{type:"accessor",value:1},widthUnits:"pixels",widthScale:{type:"number",value:1,min:0},widthMinPixels:{type:"number",value:0,min:0},widthMaxPixels:{type:"number",value:Number.MAX_SAFE_INTEGER,min:0}},_u=class extends he{getBounds(){return this.getAttributeManager()?.getBounds(["instanceSourcePositions","instanceTargetPositions"])}getShaders(){return super.getShaders({vs:NP,fs:DP,modules:[de,_e]})}get wrapLongitude(){return!1}initializeState(){this.getAttributeManager().addInstanced({instanceSourcePositions:{size:3,type:"float64",fp64:this.use64bitPositions(),transition:!0,accessor:"getSourcePosition"},instanceTargetPositions:{size:3,type:"float64",fp64:this.use64bitPositions(),transition:!0,accessor:"getTargetPosition"},instanceColors:{size:this.props.colorFormat.length,type:"unorm8",transition:!0,accessor:"getColor",defaultValue:[0,0,0,255]},instanceWidths:{size:1,transition:!0,accessor:"getWidth",defaultValue:1}})}updateState(e){super.updateState(e),e.changeFlags.extensionsChanged&&(this.state.model?.destroy(),this.state.model=this._getModel(),this.getAttributeManager().invalidateAll())}draw({uniforms:e}){let{widthUnits:r,widthScale:s,widthMinPixels:i,widthMaxPixels:n,wrapLongitude:o}=this.props,a=this.state.model;a.setUniforms(e),a.setUniforms({widthUnits:Fe[r],widthScale:s,widthMinPixels:i,widthMaxPixels:n,useShortestPath:o?1:0}),a.draw(this.context.renderPass),o&&(a.setUniforms({useShortestPath:-1}),a.draw(this.context.renderPass))}_getModel(){let e=[0,-1,0,0,1,0,1,-1,0,1,1,0];return new J(this.context.device,{...this.getShaders(),id:this.props.id,bufferLayout:this.getAttributeManager().getBufferLayouts(),geometry:new se({topology:"triangle-strip",attributes:{positions:{size:3,value:new Float32Array(e)}}}),isInstanced:!0})}};_u.layerName="LineLayer";_u.defaultProps=DH;var Vp=_u;var UP=`#version 300 es
#define SHADER_NAME point-cloud-layer-vertex-shader
in vec3 positions;
in vec3 instanceNormals;
in vec4 instanceColors;
in vec3 instancePositions;
in vec3 instancePositions64Low;
in vec3 instancePickingColors;
uniform float opacity;
uniform float radiusPixels;
uniform int sizeUnits;
out vec4 vColor;
out vec2 unitPosition;
void main(void) {
geometry.worldPosition = instancePositions;
geometry.normal = project_normal(instanceNormals);
unitPosition = positions.xy;
geometry.uv = unitPosition;
geometry.pickingColor = instancePickingColors;
vec3 offset = vec3(positions.xy * project_size_to_pixel(radiusPixels, sizeUnits), 0.0);
DECKGL_FILTER_SIZE(offset, geometry);
gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, vec3(0.), geometry.position);
DECKGL_FILTER_GL_POSITION(gl_Position, geometry);
gl_Position.xy += project_pixel_size_to_clipspace(offset.xy);
vec3 lightColor = lighting_getLightColor(instanceColors.rgb, project_uCameraPosition, geometry.position.xyz, geometry.normal);
vColor = vec4(lightColor, instanceColors.a * opacity);
DECKGL_FILTER_COLOR(vColor, geometry);
}
`;var kP=`#version 300 es
#define SHADER_NAME point-cloud-layer-fragment-shader
precision highp float;
in vec4 vColor;
in vec2 unitPosition;
out vec4 fragColor;
void main(void) {
geometry.uv = unitPosition;
float distToCenter = length(unitPosition);
if (distToCenter > 1.0) {
discard;
}
fragColor = vColor;
DECKGL_FILTER_COLOR(fragColor, geometry);
}
`;var VP=[0,0,0,255],zP=[0,0,1],UH={sizeUnits:"pixels",pointSize:{type:"number",min:0,value:10},getPosition:{type:"accessor",value:t=>t.position},getNormal:{type:"accessor",value:zP},getColor:{type:"accessor",value:VP},material:!0,radiusPixels:{deprecatedFor:"pointSize"}};function kH(t){let{header:e,attributes:r}=t;if(!(!e||!r)&&(t.length=e.vertexCount,r.POSITION&&(r.instancePositions=r.POSITION),r.NORMAL&&(r.instanceNormals=r.NORMAL),r.COLOR_0)){let{size:s,value:i}=r.COLOR_0;r.instanceColors={size:s,type:"unorm8",value:i}}}var yu=class extends he{getShaders(){return super.getShaders({vs:UP,fs:kP,modules:[de,pr,_e]})}initializeState(){this.getAttributeManager().addInstanced({instancePositions:{size:3,type:"float64",fp64:this.use64bitPositions(),transition:!0,accessor:"getPosition"},instanceNormals:{size:3,transition:!0,accessor:"getNormal",defaultValue:zP},instanceColors:{size:this.props.colorFormat.length,type:"unorm8",transition:!0,accessor:"getColor",defaultValue:VP}})}updateState(e){let{changeFlags:r,props:s}=e;super.updateState(e),r.extensionsChanged&&(this.state.model?.destroy(),this.state.model=this._getModel(),this.getAttributeManager().invalidateAll()),r.dataChanged&&kH(s.data)}draw({uniforms:e}){let{pointSize:r,sizeUnits:s}=this.props,i=this.state.model;i.setUniforms(e),i.setUniforms({sizeUnits:Fe[s],radiusPixels:r}),i.draw(this.context.renderPass)}_getModel(){let e=[];for(let r=0;r<3;r++){let s=r/3*Math.PI*2;e.push(Math.cos(s)*2,Math.sin(s)*2,0)}return new J(this.context.device,{...this.getShaders(),id:this.props.id,bufferLayout:this.getAttributeManager().getBufferLayouts(),geometry:new se({topology:"triangle-list",attributes:{positions:new Float32Array(e)}}),isInstanced:!0})}};yu.layerName="PointCloudLayer";yu.defaultProps=UH;var zp=yu;var HP=`#version 300 es
#define SHADER_NAME scatterplot-layer-vertex-shader
in vec3 positions;
in vec3 instancePositions;
in vec3 instancePositions64Low;
in float instanceRadius;
in float instanceLineWidths;
in vec4 instanceFillColors;
in vec4 instanceLineColors;
in vec3 instancePickingColors;
uniform float opacity;
uniform float radiusScale;
uniform float radiusMinPixels;
uniform float radiusMaxPixels;
uniform float lineWidthScale;
uniform float lineWidthMinPixels;
uniform float lineWidthMaxPixels;
uniform float stroked;
uniform bool filled;
uniform bool antialiasing;
uniform bool billboard;
uniform int radiusUnits;
uniform int lineWidthUnits;
out vec4 vFillColor;
out vec4 vLineColor;
out vec2 unitPosition;
out float innerUnitRadius;
out float outerRadiusPixels;
void main(void) {
geometry.worldPosition = instancePositions;
outerRadiusPixels = clamp(
project_size_to_pixel(radiusScale * instanceRadius, radiusUnits),
radiusMinPixels, radiusMaxPixels
);
float lineWidthPixels = clamp(
project_size_to_pixel(lineWidthScale * instanceLineWidths, lineWidthUnits),
lineWidthMinPixels, lineWidthMaxPixels
);
outerRadiusPixels += stroked * lineWidthPixels / 2.0;
float edgePadding = antialiasing ? (outerRadiusPixels + SMOOTH_EDGE_RADIUS) / outerRadiusPixels : 1.0;
unitPosition = edgePadding * positions.xy;
geometry.uv = unitPosition;
geometry.pickingColor = instancePickingColors;
innerUnitRadius = 1.0 - stroked * lineWidthPixels / outerRadiusPixels;
if (billboard) {
gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, vec3(0.0), geometry.position);
DECKGL_FILTER_GL_POSITION(gl_Position, geometry);
vec3 offset = edgePadding * positions * outerRadiusPixels;
DECKGL_FILTER_SIZE(offset, geometry);
gl_Position.xy += project_pixel_size_to_clipspace(offset.xy);
} else {
vec3 offset = edgePadding * positions * project_pixel_size(outerRadiusPixels);
DECKGL_FILTER_SIZE(offset, geometry);
gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, offset, geometry.position);
DECKGL_FILTER_GL_POSITION(gl_Position, geometry);
}
vFillColor = vec4(instanceFillColors.rgb, instanceFillColors.a * opacity);
DECKGL_FILTER_COLOR(vFillColor, geometry);
vLineColor = vec4(instanceLineColors.rgb, instanceLineColors.a * opacity);
DECKGL_FILTER_COLOR(vLineColor, geometry);
}
`;var GP=`#version 300 es
#define SHADER_NAME scatterplot-layer-fragment-shader
precision highp float;
uniform bool filled;
uniform float stroked;
uniform bool antialiasing;
in vec4 vFillColor;
in vec4 vLineColor;
in vec2 unitPosition;
in float innerUnitRadius;
in float outerRadiusPixels;
out vec4 fragColor;
void main(void) {
geometry.uv = unitPosition;
float distToCenter = length(unitPosition) * outerRadiusPixels;
float inCircle = antialiasing ?
smoothedge(distToCenter, outerRadiusPixels) :
step(distToCenter, outerRadiusPixels);
if (inCircle == 0.0) {
discard;
}
if (stroked > 0.5) {
float isLine = antialiasing ?
smoothedge(innerUnitRadius * outerRadiusPixels, distToCenter) :
step(innerUnitRadius * outerRadiusPixels, distToCenter);
if (filled) {
fragColor = mix(vFillColor, vLineColor, isLine);
} else {
if (isLine == 0.0) {
discard;
}
fragColor = vec4(vLineColor.rgb, vLineColor.a * isLine);
}
} else if (!filled) {
discard;
} else {
fragColor = vFillColor;
}
fragColor.a *= inCircle;
DECKGL_FILTER_COLOR(fragColor, geometry);
}
`;var WP=[0,0,0,255],VH={radiusUnits:"meters",radiusScale:{type:"number",min:0,value:1},radiusMinPixels:{type:"number",min:0,value:0},radiusMaxPixels:{type:"number",min:0,value:Number.MAX_SAFE_INTEGER},lineWidthUnits:"meters",lineWidthScale:{type:"number",min:0,value:1},lineWidthMinPixels:{type:"number",min:0,value:0},lineWidthMaxPixels:{type:"number",min:0,value:Number.MAX_SAFE_INTEGER},stroked:!1,filled:!0,billboard:!1,antialiasing:!0,getPosition:{type:"accessor",value:t=>t.position},getRadius:{type:"accessor",value:1},getFillColor:{type:"accessor",value:WP},getLineColor:{type:"accessor",value:WP},getLineWidth:{type:"accessor",value:1},strokeWidth:{deprecatedFor:"getLineWidth"},outline:{deprecatedFor:"stroked"},getColor:{deprecatedFor:["getFillColor","getLineColor"]}},xu=class extends he{getShaders(){return super.getShaders({vs:HP,fs:GP,modules:[de,_e]})}initializeState(){this.getAttributeManager().addInstanced({instancePositions:{size:3,type:"float64",fp64:this.use64bitPositions(),transition:!0,accessor:"getPosition"},instanceRadius:{size:1,transition:!0,accessor:"getRadius",defaultValue:1},instanceFillColors:{size:this.props.colorFormat.length,transition:!0,type:"unorm8",accessor:"getFillColor",defaultValue:[0,0,0,255]},instanceLineColors:{size:this.props.colorFormat.length,transition:!0,type:"unorm8",accessor:"getLineColor",defaultValue:[0,0,0,255]},instanceLineWidths:{size:1,transition:!0,accessor:"getLineWidth",defaultValue:1}})}updateState(e){super.updateState(e),e.changeFlags.extensionsChanged&&(this.state.model?.destroy(),this.state.model=this._getModel(),this.getAttributeManager().invalidateAll())}draw({uniforms:e}){let{radiusUnits:r,radiusScale:s,radiusMinPixels:i,radiusMaxPixels:n,stroked:o,filled:a,billboard:c,antialiasing:l,lineWidthUnits:u,lineWidthScale:f,lineWidthMinPixels:h,lineWidthMaxPixels:d}=this.props,p=this.state.model;p.setUniforms(e),p.setUniforms({stroked:o?1:0,filled:a,billboard:c,antialiasing:l,radiusUnits:Fe[r],radiusScale:s,radiusMinPixels:i,radiusMaxPixels:n,lineWidthUnits:Fe[u],lineWidthScale:f,lineWidthMinPixels:h,lineWidthMaxPixels:d}),p.draw(this.context.renderPass)}_getModel(){let e=[-1,-1,0,1,-1,0,-1,1,0,1,1,0];return new J(this.context.device,{...this.getShaders(),id:this.props.id,bufferLayout:this.getAttributeManager().getBufferLayouts(),geometry:new se({topology:"triangle-strip",attributes:{positions:{size:3,value:new Float32Array(e)}}}),isInstanced:!0})}};xu.defaultProps=VH;xu.layerName="ScatterplotLayer";var Hp=xu;var ga={CLOCKWISE:1,COUNTER_CLOCKWISE:-1};function Xn(t,e,r={}){return jP(t,r)!==e?(zH(t,r),!0):!1}function jP(t,e={}){return Math.sign(Di(t,e))}var Au={x:0,y:1,z:2};function Di(t,e={}){let{start:r=0,end:s=t.length,plane:i="xy"}=e,n=e.size||2,o=0,a=Au[i[0]],c=Au[i[1]];for(let l=r,u=s-n;l<s;l+=n)o+=(t[l+a]-t[u+a])*(t[l+c]+t[u+c]),u=l;return o/2}function zH(t,e){let{start:r=0,end:s=t.length,size:i=2}=e,n=(s-r)/i,o=Math.floor(n/2);for(let a=0;a<o;++a){let c=r+a*i,l=r+(n-1-a)*i;for(let u=0;u<i;++u){let f=t[c+u];t[c+u]=t[l+u],t[l+u]=f}}}function dA(t,e,r=2,s,i="xy"){let n=e&&e.length,o=n?e[0]*r:t.length,a=YP(t,0,o,r,!0,s&&s[0],i),c=[];if(!a||a.next===a.prev)return c;let l,u,f,h,d,p,g;if(n&&(a=YH(t,e,a,r,s,i)),t.length>80*r){h=u=t[0],d=f=t[1];for(let m=r;m<o;m+=r)p=t[m],g=t[m+1],p<h&&(h=p),g<d&&(d=g),p>u&&(u=p),g>f&&(f=g);l=Math.max(u-h,f-d),l=l!==0?32767/l:0}return Tu(a,c,r,h,d,l,0),c}function YP(t,e,r,s,i,n,o){let a,c;n===void 0&&(n=Di(t,{start:e,end:r,size:s,plane:o}));let l=Au[o[0]],u=Au[o[1]];if(i===n<0)for(a=e;a<r;a+=s)c=XP(a,t[a+l],t[a+u],c);else for(a=r-s;a>=e;a-=s)c=XP(a,t[a+l],t[a+u],c);return c&&jp(c,c.next)&&(Eu(c),c=c.next),c}function Yn(t,e){if(!t)return t;e||(e=t);let r=t,s;do if(s=!1,!r.steiner&&(jp(r,r.next)||Ne(r.prev,r,r.next)===0)){if(Eu(r),r=e=r.prev,r===r.next)break;s=!0}else r=r.next;while(s||r!==e);return e}function Tu(t,e,r,s,i,n,o){if(!t)return;!o&&n&&ZH(t,s,i,n);let a=t,c,l;for(;t.prev!==t.next;){if(c=t.prev,l=t.next,n?WH(t,s,i,n):GH(t)){e.push(c.i/r|0),e.push(t.i/r|0),e.push(l.i/r|0),Eu(t),t=l.next,a=l.next;continue}if(t=l,t===a){o?o===1?(t=jH(Yn(t),e,r),Tu(t,e,r,s,i,n,2)):o===2&&XH(t,e,r,s,i,n):Tu(Yn(t),e,r,s,i,n,1);break}}}function GH(t){let e=t.prev,r=t,s=t.next;if(Ne(e,r,s)>=0)return!1;let i=e.x,n=r.x,o=s.x,a=e.y,c=r.y,l=s.y,u=i<n?i<o?i:o:n<o?n:o,f=a<c?a<l?a:l:c<l?c:l,h=i>n?i>o?i:o:n>o?n:o,d=a>c?a>l?a:l:c>l?c:l,p=s.next;for(;p!==e;){if(p.x>=u&&p.x<=h&&p.y>=f&&p.y<=d&&ma(i,a,n,c,o,l,p.x,p.y)&&Ne(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function WH(t,e,r,s){let i=t.prev,n=t,o=t.next;if(Ne(i,n,o)>=0)return!1;let a=i.x,c=n.x,l=o.x,u=i.y,f=n.y,h=o.y,d=a<c?a<l?a:l:c<l?c:l,p=u<f?u<h?u:h:f<h?f:h,g=a>c?a>l?a:l:c>l?c:l,m=u>f?u>h?u:h:f>h?f:h,_=hA(d,p,e,r,s),y=hA(g,m,e,r,s),x=t.prevZ,S=t.nextZ;for(;x&&x.z>=_&&S&&S.z<=y;){if(x.x>=d&&x.x<=g&&x.y>=p&&x.y<=m&&x!==i&&x!==o&&ma(a,u,c,f,l,h,x.x,x.y)&&Ne(x.prev,x,x.next)>=0||(x=x.prevZ,S.x>=d&&S.x<=g&&S.y>=p&&S.y<=m&&S!==i&&S!==o&&ma(a,u,c,f,l,h,S.x,S.y)&&Ne(S.prev,S,S.next)>=0))return!1;S=S.nextZ}for(;x&&x.z>=_;){if(x.x>=d&&x.x<=g&&x.y>=p&&x.y<=m&&x!==i&&x!==o&&ma(a,u,c,f,l,h,x.x,x.y)&&Ne(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;S&&S.z<=y;){if(S.x>=d&&S.x<=g&&S.y>=p&&S.y<=m&&S!==i&&S!==o&&ma(a,u,c,f,l,h,S.x,S.y)&&Ne(S.prev,S,S.next)>=0)return!1;S=S.nextZ}return!0}function jH(t,e,r){let s=t;do{let i=s.prev,n=s.next.next;!jp(i,n)&&qP(i,s,s.next,n)&&bu(i,n)&&bu(n,i)&&(e.push(i.i/r|0),e.push(s.i/r|0),e.push(n.i/r|0),Eu(s),Eu(s.next),s=t=n),s=s.next}while(s!==t);return Yn(s)}function XH(t,e,r,s,i,n){let o=t;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&t9(o,a)){let c=KP(o,a);o=Yn(o,o.next),c=Yn(c,c.next),Tu(o,e,r,s,i,n,0),Tu(c,e,r,s,i,n,0);return}a=a.next}o=o.next}while(o!==t)}function YH(t,e,r,s,i,n){let o=[],a,c,l,u,f;for(a=0,c=e.length;a<c;a++)l=e[a]*s,u=a<c-1?e[a+1]*s:t.length,f=YP(t,l,u,s,!1,i&&i[a+1],n),f===f.next&&(f.steiner=!0),o.push(e9(f));for(o.sort(qH),a=0;a<o.length;a++)r=KH(o[a],r);return r}function qH(t,e){return t.x-e.x}function KH(t,e){let r=$H(t,e);if(!r)return e;let s=KP(r,t);return Yn(s,s.next),Yn(r,r.next)}function $H(t,e){let r=e,s=t.x,i=t.y,n=-1/0,o;do{if(i<=r.y&&i>=r.next.y&&r.next.y!==r.y){let h=r.x+(i-r.y)*(r.next.x-r.x)/(r.next.y-r.y);if(h<=s&&h>n&&(n=h,o=r.x<r.next.x?r:r.next,h===s))return o}r=r.next}while(r!==e);if(!o)return null;let a=o,c=o.x,l=o.y,u=1/0,f;r=o;do s>=r.x&&r.x>=c&&s!==r.x&&ma(i<l?s:n,i,c,l,i<l?n:s,i,r.x,r.y)&&(f=Math.abs(i-r.y)/(s-r.x),bu(r,t)&&(f<u||f===u&&(r.x>o.x||r.x===o.x&&JH(o,r)))&&(o=r,u=f)),r=r.next;while(r!==a);return o}function JH(t,e){return Ne(t.prev,t,e.prev)<0&&Ne(e.next,t,t.next)<0}function ZH(t,e,r,s){let i=t;do i.z===0&&(i.z=hA(i.x,i.y,e,r,s)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==t);i.prevZ.nextZ=null,i.prevZ=null,QH(i)}function QH(t){let e,r,s=1,i,n,o,a,c,l;do{for(n=t,t=null,l=null,i=0;n;){for(i++,a=n,o=0,r=0;r<s&&(o++,a=a.nextZ,!!a);r++);for(c=s;o>0||c>0&&a;)o!==0&&(c===0||!a||n.z<=a.z)?(e=n,n=n.nextZ,o--):(e=a,a=a.nextZ,c--),l?l.nextZ=e:t=e,e.prevZ=l,l=e;n=a}l.nextZ=null,s*=2}while(i>1);return t}function hA(t,e,r,s,i){return t=(t-r)*i|0,e=(e-s)*i|0,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,t|e<<1}function e9(t){let e=t,r=t;do(e.x<r.x||e.x===r.x&&e.y<r.y)&&(r=e),e=e.next;while(e!==t);return r}function ma(t,e,r,s,i,n,o,a){return(i-o)*(e-a)>=(t-o)*(n-a)&&(t-o)*(s-a)>=(r-o)*(e-a)&&(r-o)*(n-a)>=(i-o)*(s-a)}function t9(t,e){return t.next.i!==e.i&&t.prev.i!==e.i&&!r9(t,e)&&(bu(t,e)&&bu(e,t)&&s9(t,e)&&(Ne(t.prev,t,e.prev)||Ne(t,e.prev,e))||jp(t,e)&&Ne(t.prev,t,t.next)>0&&Ne(e.prev,e,e.next)>0)}function Ne(t,e,r){return(e.y-t.y)*(r.x-e.x)-(e.x-t.x)*(r.y-e.y)}function jp(t,e){return t.x===e.x&&t.y===e.y}function qP(t,e,r,s){let i=Wp(Ne(t,e,r)),n=Wp(Ne(t,e,s)),o=Wp(Ne(r,s,t)),a=Wp(Ne(r,s,e));return!!(i!==n&&o!==a||i===0&&Gp(t,r,e)||n===0&&Gp(t,s,e)||o===0&&Gp(r,t,s)||a===0&&Gp(r,e,s))}function Gp(t,e,r){return e.x<=Math.max(t.x,r.x)&&e.x>=Math.min(t.x,r.x)&&e.y<=Math.max(t.y,r.y)&&e.y>=Math.min(t.y,r.y)}function Wp(t){return t>0?1:t<0?-1:0}function r9(t,e){let r=t;do{if(r.i!==t.i&&r.next.i!==t.i&&r.i!==e.i&&r.next.i!==e.i&&qP(r,r.next,t,e))return!0;r=r.next}while(r!==t);return!1}function bu(t,e){return Ne(t.prev,t,t.next)<0?Ne(t,e,t.next)>=0&&Ne(t,t.prev,e)>=0:Ne(t,e,t.prev)<0||Ne(t,t.next,e)<0}function s9(t,e){let r=t,s=!1,i=(t.x+e.x)/2,n=(t.y+e.y)/2;do r.y>n!=r.next.y>n&&r.next.y!==r.y&&i<(r.next.x-r.x)*(n-r.y)/(r.next.y-r.y)+r.x&&(s=!s),r=r.next;while(r!==t);return s}function KP(t,e){let r=new Su(t.i,t.x,t.y),s=new Su(e.i,e.x,e.y),i=t.next,n=e.prev;return t.next=e,e.prev=t,r.next=i,i.prev=r,s.next=r,r.prev=s,n.next=s,s.prev=n,s}function XP(t,e,r,s){let i=new Su(t,e,r);return s?(i.next=s.next,i.prev=s,s.next.prev=i,s.next=i):(i.prev=i,i.next=i),i}function Eu(t){t.next.prev=t.prev,t.prev.next=t.next,t.prevZ&&(t.prevZ.nextZ=t.nextZ),t.nextZ&&(t.nextZ.prevZ=t.prevZ)}var Su=class{constructor(e,r,s){this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1,this.i=e,this.x=r,this.y=s}};function Wt(t,e){let r=e.length,s=t.length;if(s>0){let i=!0;for(let n=0;n<r;n++)if(t[s-r+n]!==e[n]){i=!1;break}if(i)return!1}for(let i=0;i<r;i++)t[s+i]=e[i];return!0}function vu(t,e){let r=e.length;for(let s=0;s<r;s++)t[s]=e[s]}function Ui(t,e,r,s,i=[]){let n=s+e*r;for(let o=0;o<r;o++)i[o]=t[n+o];return i}function Xp(t,e,r,s,i=[]){let n,o;if(r&8)n=(s[3]-t[1])/(e[1]-t[1]),o=3;else if(r&4)n=(s[1]-t[1])/(e[1]-t[1]),o=1;else if(r&2)n=(s[2]-t[0])/(e[0]-t[0]),o=2;else if(r&1)n=(s[0]-t[0])/(e[0]-t[0]),o=0;else return null;for(let a=0;a<t.length;a++)i[a]=(o&1)===a?s[o]:n*(e[a]-t[a])+t[a];return i}function Cu(t,e){let r=0;return t[0]<e[0]?r|=1:t[0]>e[2]&&(r|=2),t[1]<e[1]?r|=4:t[1]>e[3]&&(r|=8),r}function wu(t,e){let{size:r=2,broken:s=!1,gridResolution:i=10,gridOffset:n=[0,0],startIndex:o=0,endIndex:a=t.length}=e||{},c=(a-o)/r,l=[],u=[l],f=Ui(t,0,r,o),h,d,p=ZP(f,i,n,[]),g=[];Wt(l,f);for(let m=1;m<c;m++){for(h=Ui(t,m,r,o,h),d=Cu(h,p);d;){Xp(f,h,d,p,g);let _=Cu(g,p);_&&(Xp(f,g,_,p,g),d=_),Wt(l,g),vu(f,g),n9(p,i,d),s&&l.length>r&&(l=[],u.push(l),Wt(l,f)),d=Cu(h,p)}Wt(l,h),vu(f,h)}return s?u:u[0]}var $P=0,i9=1;function Pu(t,e=null,r){if(!t.length)return[];let{size:s=2,gridResolution:i=10,gridOffset:n=[0,0],edgeTypes:o=!1}=r||{},a=[],c=[{pos:t,types:o?new Array(t.length/s).fill(i9):null,holes:e||[]}],l=[[],[]],u=[];for(;c.length;){let{pos:f,types:h,holes:d}=c.shift();o9(f,s,d[0]||f.length,l),u=ZP(l[0],i,n,u);let p=Cu(l[1],u);if(p){let g=JP(f,h,s,0,d[0]||f.length,u,p),m={pos:g[0].pos,types:g[0].types,holes:[]},_={pos:g[1].pos,types:g[1].types,holes:[]};c.push(m,_);for(let y=0;y<d.length;y++)g=JP(f,h,s,d[y],d[y+1]||f.length,u,p),g[0]&&(m.holes.push(m.pos.length),m.pos=Yp(m.pos,g[0].pos),o&&(m.types=Yp(m.types,g[0].types))),g[1]&&(_.holes.push(_.pos.length),_.pos=Yp(_.pos,g[1].pos),o&&(_.types=Yp(_.types,g[1].types)))}else{let g={positions:f};o&&(g.edgeTypes=h),d.length&&(g.holeIndices=d),a.push(g)}}return a}function JP(t,e,r,s,i,n,o){let a=(i-s)/r,c=[],l=[],u=[],f=[],h=[],d,p,g,m=Ui(t,a-1,r,s),_=Math.sign(o&8?m[1]-n[3]:m[0]-n[2]),y=e&&e[a-1],x=0,S=0;for(let P=0;P<a;P++)d=Ui(t,P,r,s,d),p=Math.sign(o&8?d[1]-n[3]:d[0]-n[2]),g=e&&e[s/r+P],p&&_&&_!==p&&(Xp(m,d,o,n,h),Wt(c,h)&&u.push(y),Wt(l,h)&&f.push(y)),p<=0?(Wt(c,d)&&u.push(g),x-=p):u.length&&(u[u.length-1]=$P),p>=0?(Wt(l,d)&&f.push(g),S+=p):f.length&&(f[f.length-1]=$P),vu(m,d),_=p,y=g;return[x?{pos:c,types:e&&u}:null,S?{pos:l,types:e&&f}:null]}function ZP(t,e,r,s){let i=Math.floor((t[0]-r[0])/e)*e+r[0],n=Math.floor((t[1]-r[1])/e)*e+r[1];return s[0]=i,s[1]=n,s[2]=i+e,s[3]=n+e,s}function n9(t,e,r){r&8?(t[1]+=e,t[3]+=e):r&4?(t[1]-=e,t[3]-=e):r&2?(t[0]+=e,t[2]+=e):r&1&&(t[0]-=e,t[2]-=e)}function o9(t,e,r,s){let i=1/0,n=-1/0,o=1/0,a=-1/0;for(let c=0;c<r;c+=e){let l=t[c],u=t[c+1];i=l<i?l:i,n=l>n?l:n,o=u<o?u:o,a=u>a?u:a}return s[0][0]=i,s[0][1]=o,s[1][0]=n,s[1][1]=a,s}function Yp(t,e){for(let r=0;r<e.length;r++)t.push(e[r]);return t}var a9=85.051129;function pA(t,e){let{size:r=2,startIndex:s=0,endIndex:i=t.length,normalize:n=!0}=e||{},o=t.slice(s,i);QP(o,r,0,i-s);let a=wu(o,{size:r,broken:!0,gridResolution:360,gridOffset:[-180,-180]});if(n)for(let c of a)eM(c,r);return a}function gA(t,e=null,r){let{size:s=2,normalize:i=!0,edgeTypes:n=!1}=r||{};e=e||[];let o=[],a=[],c=0,l=0;for(let f=0;f<=e.length;f++){let h=e[f]||t.length,d=l,p=c9(t,s,c,h);for(let g=p;g<h;g++)o[l++]=t[g];for(let g=c;g<p;g++)o[l++]=t[g];QP(o,s,d,l),l9(o,s,d,l,r?.maxLatitude),c=h,a[f]=l}a.pop();let u=Pu(o,a,{size:s,gridResolution:360,gridOffset:[-180,-180],edgeTypes:n});if(i)for(let f of u)eM(f.positions,s);return u}function c9(t,e,r,s){let i=-1,n=-1;for(let o=r+1;o<s;o+=e){let a=Math.abs(t[o]);a>i&&(i=a,n=o-1)}return n}function l9(t,e,r,s,i=a9){let n=t[r],o=t[s-e];if(Math.abs(n-o)>180){let a=Ui(t,0,e,r);a[0]+=Math.round((o-n)/360)*360,Wt(t,a),a[1]=Math.sign(a[1])*i,Wt(t,a),a[0]=n,Wt(t,a)}}function QP(t,e,r,s){let i=t[0],n;for(let o=r;o<s;o+=e){n=t[o];let a=n-i;(a>180||a<-180)&&(n-=Math.round(a/360)*360),t[o]=i=n}}function eM(t,e){let r,s=t.length/e;for(let n=0;n<s&&(r=t[n*e],(r+180)%360===0);n++);let i=-Math.round(r/360)*360;if(i!==0)for(let n=0;n<s;n++)t[n*e]+=i}var Mu=class extends se{constructor(e){let{indices:r,attributes:s}=f9(e);super({...e,indices:r,attributes:s})}};function f9(t){let{radius:e,height:r=1,nradial:s=10}=t,{vertices:i}=t;i&&(k.assert(i.length>=s),i=i.flatMap(d=>[d[0],d[1]]),Xn(i,ga.COUNTER_CLOCKWISE));let n=r>0,o=s+1,a=n?o*3+1:s,c=Math.PI*2/s,l=new Uint16Array(n?s*3*2:0),u=new Float32Array(a*3),f=new Float32Array(a*3),h=0;if(n){for(let d=0;d<o;d++){let p=d*c,g=d%s,m=Math.sin(p),_=Math.cos(p);for(let y=0;y<2;y++)u[h+0]=i?i[g*2]:_*e,u[h+1]=i?i[g*2+1]:m*e,u[h+2]=(1/2-y)*r,f[h+0]=i?i[g*2]:_,f[h+1]=i?i[g*2+1]:m,h+=3}u[h+0]=u[h-3],u[h+1]=u[h-2],u[h+2]=u[h-1],h+=3}for(let d=n?0:1;d<o;d++){let p=Math.floor(d/2)*Math.sign(.5-d%2),g=p*c,m=(p+s)%s,_=Math.sin(g),y=Math.cos(g);u[h+0]=i?i[m*2]:y*e,u[h+1]=i?i[m*2+1]:_*e,u[h+2]=r/2,f[h+2]=1,h+=3}if(n){let d=0;for(let p=0;p<s;p++)l[d++]=p*2+0,l[d++]=p*2+2,l[d++]=p*2+0,l[d++]=p*2+1,l[d++]=p*2+1,l[d++]=p*2+3}return{indices:l,attributes:{POSITION:{size:3,value:u},NORMAL:{size:3,value:f}}}}var tM=`#version 300 es
#define SHADER_NAME column-layer-vertex-shader
in vec3 positions;
in vec3 normals;
in vec3 instancePositions;
in float instanceElevations;
in vec3 instancePositions64Low;
in vec4 instanceFillColors;
in vec4 instanceLineColors;
in float instanceStrokeWidths;
in vec3 instancePickingColors;
uniform float opacity;
uniform float radius;
uniform float angle;
uniform vec2 offset;
uniform bool extruded;
uniform bool stroked;
uniform bool isStroke;
uniform float coverage;
uniform float elevationScale;
uniform float edgeDistance;
uniform float widthScale;
uniform float widthMinPixels;
uniform float widthMaxPixels;
uniform int radiusUnits;
uniform int widthUnits;
out vec4 vColor;
#ifdef FLAT_SHADING
out vec4 position_commonspace;
#endif
void main(void) {
geometry.worldPosition = instancePositions;
vec4 color = isStroke ? instanceLineColors : instanceFillColors;
mat2 rotationMatrix = mat2(cos(angle), sin(angle), -sin(angle), cos(angle));
float elevation = 0.0;
float strokeOffsetRatio = 1.0;
if (extruded) {
elevation = instanceElevations * (positions.z + 1.0) / 2.0 * elevationScale;
} else if (stroked) {
float widthPixels = clamp(
project_size_to_pixel(instanceStrokeWidths * widthScale, widthUnits),
widthMinPixels, widthMaxPixels) / 2.0;
float halfOffset = project_pixel_size(widthPixels) / project_size(edgeDistance * coverage * radius);
if (isStroke) {
strokeOffsetRatio -= sign(positions.z) * halfOffset;
} else {
strokeOffsetRatio -= halfOffset;
}
}
float shouldRender = float(color.a > 0.0 && instanceElevations >= 0.0);
float dotRadius = radius * coverage * shouldRender;
geometry.pickingColor = instancePickingColors;
vec3 centroidPosition = vec3(instancePositions.xy, instancePositions.z + elevation);
vec3 centroidPosition64Low = instancePositions64Low;
vec2 offset = (rotationMatrix * positions.xy * strokeOffsetRatio + offset) * dotRadius;
if (radiusUnits == UNIT_METERS) {
offset = project_size(offset);
}
vec3 pos = vec3(offset, 0.);
DECKGL_FILTER_SIZE(pos, geometry);
gl_Position = project_position_to_clipspace(centroidPosition, centroidPosition64Low, pos, geometry.position);
geometry.normal = project_normal(vec3(rotationMatrix * normals.xy, normals.z));
DECKGL_FILTER_GL_POSITION(gl_Position, geometry);
if (extruded && !isStroke) {
#ifdef FLAT_SHADING
position_commonspace = geometry.position;
vColor = vec4(color.rgb, color.a * opacity);
#else
vec3 lightColor = lighting_getLightColor(color.rgb, project_uCameraPosition, geometry.position.xyz, geometry.normal);
vColor = vec4(lightColor, color.a * opacity);
#endif
} else {
vColor = vec4(color.rgb, color.a * opacity);
}
DECKGL_FILTER_COLOR(vColor, geometry);
}
`;var rM=`#version 300 es
#define SHADER_NAME column-layer-fragment-shader
precision highp float;
uniform vec3 project_uCameraPosition;
uniform bool extruded;
uniform bool isStroke;
out vec4 fragColor;
in vec4 vColor;
#ifdef FLAT_SHADING
in vec4 position_commonspace;
#endif
void main(void) {
fragColor = vColor;
geometry.uv = vec2(0.);
#ifdef FLAT_SHADING
if (extruded && !isStroke && !bool(picking.isActive)) {
vec3 normal = normalize(cross(dFdx(position_commonspace.xyz), dFdy(position_commonspace.xyz)));
fragColor.rgb = lighting_getLightColor(vColor.rgb, project_uCameraPosition, position_commonspace.xyz, normal);
}
#endif
DECKGL_FILTER_COLOR(fragColor, geometry);
}
`;var qp=[0,0,0,255],h9={diskResolution:{type:"number",min:4,value:20},vertices:null,radius:{type:"number",min:0,value:1e3},angle:{type:"number",value:0},offset:{type:"array",value:[0,0]},coverage:{type:"number",min:0,max:1,value:1},elevationScale:{type:"number",min:0,value:1},radiusUnits:"meters",lineWidthUnits:"meters",lineWidthScale:1,lineWidthMinPixels:0,lineWidthMaxPixels:Number.MAX_SAFE_INTEGER,extruded:!0,wireframe:!1,filled:!0,stroked:!1,flatShading:!1,getPosition:{type:"accessor",value:t=>t.position},getFillColor:{type:"accessor",value:qp},getLineColor:{type:"accessor",value:qp},getLineWidth:{type:"accessor",value:1},getElevation:{type:"accessor",value:1e3},material:!0,getColor:{deprecatedFor:["getFillColor","getLineColor"]}},Ru=class extends he{getShaders(){let e={},{flatShading:r}=this.props;return r&&(e.FLAT_SHADING=1),super.getShaders({vs:tM,fs:rM,defines:e,modules:[de,r?vi:pr,_e]})}initializeState(){this.getAttributeManager().addInstanced({instancePositions:{size:3,type:"float64",fp64:this.use64bitPositions(),transition:!0,accessor:"getPosition"},instanceElevations:{size:1,transition:!0,accessor:"getElevation"},instanceFillColors:{size:this.props.colorFormat.length,type:"unorm8",transition:!0,accessor:"getFillColor",defaultValue:qp},instanceLineColors:{size:this.props.colorFormat.length,type:"unorm8",transition:!0,accessor:"getLineColor",defaultValue:qp},instanceStrokeWidths:{size:1,accessor:"getLineWidth",transition:!0}})}updateState(e){super.updateState(e);let{props:r,oldProps:s,changeFlags:i}=e,n=i.extensionsChanged||r.flatShading!==s.flatShading;n&&(this.state.models?.forEach(a=>a.destroy()),this.setState(this._getModels()),this.getAttributeManager().invalidateAll());let o=this.getNumInstances();this.state.fillModel.setInstanceCount(o),this.state.wireframeModel.setInstanceCount(o),(n||r.diskResolution!==s.diskResolution||r.vertices!==s.vertices||(r.extruded||r.stroked)!==(s.extruded||s.stroked))&&this._updateGeometry(r)}getGeometry(e,r,s){let i=new Mu({radius:1,height:s?2:0,vertices:r,nradial:e}),n=0;if(r)for(let o=0;o<e;o++){let a=r[o],c=Math.sqrt(a[0]*a[0]+a[1]*a[1]);n+=c/e}else n=1;return this.setState({edgeDistance:Math.cos(Math.PI/e)*n}),i}_getModels(){let e=this.getShaders(),r=this.getAttributeManager().getBufferLayouts(),s=new J(this.context.device,{...e,id:`${this.props.id}-fill`,bufferLayout:r,isInstanced:!0}),i=new J(this.context.device,{...e,id:`${this.props.id}-wireframe`,bufferLayout:r,isInstanced:!0});return{fillModel:s,wireframeModel:i,models:[i,s]}}_updateGeometry({diskResolution:e,vertices:r,extruded:s,stroked:i}){let n=this.getGeometry(e,r,s||i);this.setState({fillVertexCount:n.attributes.POSITION.value.length/3});let o=this.state.fillModel,a=this.state.wireframeModel;o.setGeometry(n),o.setTopology("triangle-strip"),o.setIndexBuffer(null),a.setGeometry(n),a.setTopology("line-list")}draw({uniforms:e}){let{lineWidthUnits:r,lineWidthScale:s,lineWidthMinPixels:i,lineWidthMaxPixels:n,radiusUnits:o,elevationScale:a,extruded:c,filled:l,stroked:u,wireframe:f,offset:h,coverage:d,radius:p,angle:g}=this.props,m=this.state.fillModel,_=this.state.wireframeModel,{fillVertexCount:y,edgeDistance:x}=this.state,S={...e,radius:p,angle:g/180*Math.PI,offset:h,extruded:c,stroked:u,coverage:d,elevationScale:a,edgeDistance:x,radiusUnits:Fe[o],widthUnits:Fe[r],widthScale:s,widthMinPixels:i,widthMaxPixels:n};c&&f&&(_.setUniforms(S),_.setUniforms({isStroke:!0}),_.draw(this.context.renderPass)),m.setUniforms(S),l&&(m.setVertexCount(y),m.setUniforms({isStroke:!1}),m.draw(this.context.renderPass)),!c&&u&&(m.setVertexCount(y*2/3),m.setUniforms({isStroke:!0}),m.draw(this.context.renderPass))}};Ru.layerName="ColumnLayer";Ru.defaultProps=h9;var ki=Ru;var d9={cellSize:{type:"number",min:0,value:1e3},offset:{type:"array",value:[1,1]}},Iu=class extends ki{_updateGeometry(){let e=new Ds;this.state.fillModel.setGeometry(e)}draw({uniforms:e}){let{elevationScale:r,extruded:s,offset:i,coverage:n,cellSize:o,angle:a,radiusUnits:c}=this.props,l=this.state.fillModel;l.setUniforms(e),l.setUniforms({radius:o/2,radiusUnits:Fe[c],angle:a,offset:i,extruded:s,coverage:n,elevationScale:r,edgeDistance:1,isStroke:!1}),l.draw(this.context.renderPass)}};Iu.layerName="GridCellLayer";Iu.defaultProps=d9;var Kp=Iu;function sM(t,e,r,s){let i;if(Array.isArray(t[0])){let n=t.length*e;i=new Array(n);for(let o=0;o<t.length;o++)for(let a=0;a<e;a++)i[o*e+a]=t[o][a]||0}else i=t;return r?wu(i,{size:e,gridResolution:r}):s?pA(i,{size:e}):i}var p9=1,g9=2,mA=4,Bu=class extends Ys{constructor(e){super({...e,attributes:{positions:{size:3,padding:18,initialize:!0,type:e.fp64?Float64Array:Float32Array},segmentTypes:{size:1,type:Uint8ClampedArray}}})}get(e){return this.attributes[e]}getGeometryFromBuffer(e){return this.normalize?super.getGeometryFromBuffer(e):null}normalizeGeometry(e){return this.normalize?sM(e,this.positionSize,this.opts.resolution,this.opts.wrapLongitude):e}getGeometrySize(e){if(iM(e)){let s=0;for(let i of e)s+=this.getGeometrySize(i);return s}let r=this.getPathLength(e);return r<2?0:this.isClosed(e)?r<3?0:r+2:r}updateGeometryAttributes(e,r){if(r.geometrySize!==0)if(e&&iM(e))for(let s of e){let i=this.getGeometrySize(s);r.geometrySize=i,this.updateGeometryAttributes(s,r),r.vertexStart+=i}else this._updateSegmentTypes(e,r),this._updatePositions(e,r)}_updateSegmentTypes(e,r){let s=this.attributes.segmentTypes,i=e?this.isClosed(e):!1,{vertexStart:n,geometrySize:o}=r;s.fill(0,n,n+o),i?(s[n]=mA,s[n+o-2]=mA):(s[n]+=p9,s[n+o-2]+=g9),s[n+o-1]=mA}_updatePositions(e,r){let{positions:s}=this.attributes;if(!s||!e)return;let{vertexStart:i,geometrySize:n}=r,o=new Array(3);for(let a=i,c=0;c<n;a++,c++)this.getPointOnPath(e,c,o),s[a*3]=o[0],s[a*3+1]=o[1],s[a*3+2]=o[2]}getPathLength(e){return e.length/this.positionSize}getPointOnPath(e,r,s=[]){let{positionSize:i}=this;r*i>=e.length&&(r+=1-e.length/i);let n=r*i;return s[0]=e[n],s[1]=e[n+1],s[2]=i===3&&e[n+2]||0,s}isClosed(e){if(!this.normalize)return Boolean(this.opts.loop);let{positionSize:r}=this,s=e.length-r;return e[0]===e[s]&&e[1]===e[s+1]&&(r===2||e[2]===e[s+2])}};function iM(t){return Array.isArray(t[0])}var nM=`#version 300 es
#define SHADER_NAME path-layer-vertex-shader
in vec2 positions;
in float instanceTypes;
in vec3 instanceStartPositions;
in vec3 instanceEndPositions;
in vec3 instanceLeftPositions;
in vec3 instanceRightPositions;
in vec3 instanceLeftPositions64Low;
in vec3 instanceStartPositions64Low;
in vec3 instanceEndPositions64Low;
in vec3 instanceRightPositions64Low;
in float instanceStrokeWidths;
in vec4 instanceColors;
in vec3 instancePickingColors;
uniform float widthScale;
uniform float widthMinPixels;
uniform float widthMaxPixels;
uniform float jointType;
uniform float capType;
uniform float miterLimit;
uniform bool billboard;
uniform int widthUnits;
uniform float opacity;
out vec4 vColor;
out vec2 vCornerOffset;
out float vMiterLength;
out vec2 vPathPosition;
out float vPathLength;
out float vJointType;
const float EPSILON = 0.001;
const vec3 ZERO_OFFSET = vec3(0.0);
float flipIfTrue(bool flag) {
return -(float(flag) * 2. - 1.);
}
vec3 getLineJoinOffset(
vec3 prevPoint, vec3 currPoint, vec3 nextPoint,
vec2 width
) {
bool isEnd = positions.x > 0.0;
float sideOfPath = positions.y;
float isJoint = float(sideOfPath == 0.0);
vec3 deltaA3 = (currPoint - prevPoint);
vec3 deltaB3 = (nextPoint - currPoint);
mat3 rotationMatrix;
bool needsRotation = !billboard && project_needs_rotation(currPoint, rotationMatrix);
if (needsRotation) {
deltaA3 = deltaA3 * rotationMatrix;
deltaB3 = deltaB3 * rotationMatrix;
}
vec2 deltaA = deltaA3.xy / width;
vec2 deltaB = deltaB3.xy / width;
float lenA = length(deltaA);
float lenB = length(deltaB);
vec2 dirA = lenA > 0. ? normalize(deltaA) : vec2(0.0, 0.0);
vec2 dirB = lenB > 0. ? normalize(deltaB) : vec2(0.0, 0.0);
vec2 perpA = vec2(-dirA.y, dirA.x);
vec2 perpB = vec2(-dirB.y, dirB.x);
vec2 tangent = dirA + dirB;
tangent = length(tangent) > 0. ? normalize(tangent) : perpA;
vec2 miterVec = vec2(-tangent.y, tangent.x);
vec2 dir = isEnd ? dirA : dirB;
vec2 perp = isEnd ? perpA : perpB;
float L = isEnd ? lenA : lenB;
float sinHalfA = abs(dot(miterVec, perp));
float cosHalfA = abs(dot(dirA, miterVec));
float turnDirection = flipIfTrue(dirA.x * dirB.y >= dirA.y * dirB.x);
float cornerPosition = sideOfPath * turnDirection;
float miterSize = 1.0 / max(sinHalfA, EPSILON);
miterSize = mix(
min(miterSize, max(lenA, lenB) / max(cosHalfA, EPSILON)),
miterSize,
step(0.0, cornerPosition)
);
vec2 offsetVec = mix(miterVec * miterSize, perp, step(0.5, cornerPosition))
* (sideOfPath + isJoint * turnDirection);
bool isStartCap = lenA == 0.0 || (!isEnd && (instanceTypes == 1.0 || instanceTypes == 3.0));
bool isEndCap = lenB == 0.0 || (isEnd && (instanceTypes == 2.0 || instanceTypes == 3.0));
bool isCap = isStartCap || isEndCap;
if (isCap) {
offsetVec = mix(perp * sideOfPath, dir * capType * 4.0 * flipIfTrue(isStartCap), isJoint);
vJointType = capType;
} else {
vJointType = jointType;
}
vPathLength = L;
vCornerOffset = offsetVec;
vMiterLength = dot(vCornerOffset, miterVec * turnDirection);
vMiterLength = isCap ? isJoint : vMiterLength;
vec2 offsetFromStartOfPath = vCornerOffset + deltaA * float(isEnd);
vPathPosition = vec2(
dot(offsetFromStartOfPath, perp),
dot(offsetFromStartOfPath, dir)
);
geometry.uv = vPathPosition;
float isValid = step(instanceTypes, 3.5);
vec3 offset = vec3(offsetVec * width * isValid, 0.0);
if (needsRotation) {
offset = rotationMatrix * offset;
}
return offset;
}
void clipLine(inout vec4 position, vec4 refPosition) {
if (position.w < EPSILON) {
float r = (EPSILON - refPosition.w) / (position.w - refPosition.w);
position = refPosition + (position - refPosition) * r;
}
}
void main() {
geometry.pickingColor = instancePickingColors;
vColor = vec4(instanceColors.rgb, instanceColors.a * opacity);
float isEnd = positions.x;
vec3 prevPosition = mix(instanceLeftPositions, instanceStartPositions, isEnd);
vec3 prevPosition64Low = mix(instanceLeftPositions64Low, instanceStartPositions64Low, isEnd);
vec3 currPosition = mix(instanceStartPositions, instanceEndPositions, isEnd);
vec3 currPosition64Low = mix(instanceStartPositions64Low, instanceEndPositions64Low, isEnd);
vec3 nextPosition = mix(instanceEndPositions, instanceRightPositions, isEnd);
vec3 nextPosition64Low = mix(instanceEndPositions64Low, instanceRightPositions64Low, isEnd);
geometry.worldPosition = currPosition;
vec2 widthPixels = vec2(clamp(
project_size_to_pixel(instanceStrokeWidths * widthScale, widthUnits),
widthMinPixels, widthMaxPixels) / 2.0);
vec3 width;
if (billboard) {
vec4 prevPositionScreen = project_position_to_clipspace(prevPosition, prevPosition64Low, ZERO_OFFSET);
vec4 currPositionScreen = project_position_to_clipspace(currPosition, currPosition64Low, ZERO_OFFSET, geometry.position);
vec4 nextPositionScreen = project_position_to_clipspace(nextPosition, nextPosition64Low, ZERO_OFFSET);
clipLine(prevPositionScreen, currPositionScreen);
clipLine(nextPositionScreen, currPositionScreen);
clipLine(currPositionScreen, mix(nextPositionScreen, prevPositionScreen, isEnd));
width = vec3(widthPixels, 0.0);
DECKGL_FILTER_SIZE(width, geometry);
vec3 offset = getLineJoinOffset(
prevPositionScreen.xyz / prevPositionScreen.w,
currPositionScreen.xyz / currPositionScreen.w,
nextPositionScreen.xyz / nextPositionScreen.w,
project_pixel_size_to_clipspace(width.xy)
);
DECKGL_FILTER_GL_POSITION(currPositionScreen, geometry);
gl_Position = vec4(currPositionScreen.xyz + offset * currPositionScreen.w, currPositionScreen.w);
} else {
prevPosition = project_position(prevPosition, prevPosition64Low);
currPosition = project_position(currPosition, currPosition64Low);
nextPosition = project_position(nextPosition, nextPosition64Low);
width = vec3(project_pixel_size(widthPixels), 0.0);
DECKGL_FILTER_SIZE(width, geometry);
vec3 offset = getLineJoinOffset(prevPosition, currPosition, nextPosition, width.xy);
geometry.position = vec4(currPosition + offset, 1.0);
gl_Position = project_common_position_to_clipspace(geometry.position);
DECKGL_FILTER_GL_POSITION(gl_Position, geometry);
}
DECKGL_FILTER_COLOR(vColor, geometry);
}
`;var oM=`#version 300 es
#define SHADER_NAME path-layer-fragment-shader
precision highp float;
uniform float miterLimit;
in vec4 vColor;
in vec2 vCornerOffset;
in float vMiterLength;
in vec2 vPathPosition;
in float vPathLength;
in float vJointType;
out vec4 fragColor;
void main(void) {
geometry.uv = vPathPosition;
if (vPathPosition.y < 0.0 || vPathPosition.y > vPathLength) {
if (vJointType > 0.5 && length(vCornerOffset) > 1.0) {
discard;
}
if (vJointType < 0.5 && vMiterLength > miterLimit + 1.0) {
discard;
}
}
fragColor = vColor;
DECKGL_FILTER_COLOR(fragColor, geometry);
}
`;var aM=[0,0,0,255],m9={widthUnits:"meters",widthScale:{type:"number",min:0,value:1},widthMinPixels:{type:"number",min:0,value:0},widthMaxPixels:{type:"number",min:0,value:Number.MAX_SAFE_INTEGER},jointRounded:!1,capRounded:!1,miterLimit:{type:"number",min:0,value:4},billboard:!1,_pathType:null,getPath:{type:"accessor",value:t=>t.path},getColor:{type:"accessor",value:aM},getWidth:{type:"accessor",value:1},rounded:{deprecatedFor:["jointRounded","capRounded"]}},_A={enter:(t,e)=>e.length?e.subarray(e.length-t.length):t},Ou=class extends he{getShaders(){return super.getShaders({vs:nM,fs:oM,modules:[de,_e]})}get wrapLongitude(){return!1}getBounds(){return this.getAttributeManager()?.getBounds(["vertexPositions"])}initializeState(){this.getAttributeManager().addInstanced({vertexPositions:{size:3,vertexOffset:1,type:"float64",fp64:this.use64bitPositions(),transition:_A,accessor:"getPath",update:this.calculatePositions,noAlloc:!0,shaderAttributes:{instanceLeftPositions:{vertexOffset:0},instanceStartPositions:{vertexOffset:1},instanceEndPositions:{vertexOffset:2},instanceRightPositions:{vertexOffset:3}}},instanceTypes:{size:1,type:"uint8",update:this.calculateSegmentTypes,noAlloc:!0},instanceStrokeWidths:{size:1,accessor:"getWidth",transition:_A,defaultValue:1},instanceColors:{size:this.props.colorFormat.length,type:"unorm8",accessor:"getColor",transition:_A,defaultValue:aM},instancePickingColors:{size:4,type:"uint8",accessor:(s,{index:i,target:n})=>this.encodePickingColor(s&&s.__source?s.__source.index:i,n)}}),this.setState({pathTesselator:new Bu({fp64:this.use64bitPositions()})})}updateState(e){super.updateState(e);let{props:r,changeFlags:s}=e,i=this.getAttributeManager();if(s.dataChanged||s.updateTriggersChanged&&(s.updateTriggersChanged.all||s.updateTriggersChanged.getPath)){let{pathTesselator:o}=this.state,a=r.data.attributes||{};o.updateGeometry({data:r.data,geometryBuffer:a.getPath,buffers:a,normalize:!r._pathType,loop:r._pathType==="loop",getGeometry:r.getPath,positionFormat:r.positionFormat,wrapLongitude:r.wrapLongitude,resolution:this.context.viewport.resolution,dataChanged:s.dataChanged}),this.setState({numInstances:o.instanceCount,startIndices:o.vertexStarts}),s.dataChanged||i.invalidateAll()}s.extensionsChanged&&(this.state.model?.destroy(),this.state.model=this._getModel(),i.invalidateAll())}getPickingInfo(e){let r=super.getPickingInfo(e),{index:s}=r,i=this.props.data;return i[0]&&i[0].__source&&(r.object=i.find(n=>n.__source.index===s)),r}disablePickingIndex(e){let r=this.props.data;if(r[0]&&r[0].__source)for(let s=0;s<r.length;s++)r[s].__source.index===e&&this._disablePickingIndex(s);else super.disablePickingIndex(e)}draw({uniforms:e}){let{jointRounded:r,capRounded:s,billboard:i,miterLimit:n,widthUnits:o,widthScale:a,widthMinPixels:c,widthMaxPixels:l}=this.props,u=this.state.model;u.setUniforms(e),u.setUniforms({jointType:Number(r),capType:Number(s),billboard:i,widthUnits:Fe[o],widthScale:a,miterLimit:n,widthMinPixels:c,widthMaxPixels:l}),u.draw(this.context.renderPass)}_getModel(){let e=[0,1,2,1,4,2,1,3,4,3,5,4],r=[0,0,0,-1,0,1,1,-1,1,1,1,0];return new J(this.context.device,{...this.getShaders(),id:this.props.id,bufferLayout:this.getAttributeManager().getBufferLayouts(),geometry:new se({topology:"triangle-list",attributes:{indices:new Uint16Array(e),positions:{value:new Float32Array(r),size:2}}}),isInstanced:!0})}calculatePositions(e){let{pathTesselator:r}=this.state;e.startIndices=r.vertexStarts,e.value=r.get("positions")}calculateSegmentTypes(e){let{pathTesselator:r}=this.state;e.startIndices=r.vertexStarts,e.value=r.get("segmentTypes")}};Ou.defaultProps=m9;Ou.layerName="PathLayer";var Vi=Ou;var _M=ss(hM(),1);var eg=ga.CLOCKWISE,dM=ga.COUNTER_CLOCKWISE,zi={isClosed:!0};function B9(t){if(t=t&&t.positions||t,!Array.isArray(t)&&!ArrayBuffer.isView(t))throw new Error("invalid polygon")}function ya(t){return"positions"in t?t.positions:t}function Du(t){return"holeIndices"in t?t.holeIndices:null}function O9(t){return Array.isArray(t[0])}function F9(t){return t.length>=1&&t[0].length>=2&&Number.isFinite(t[0][0])}function L9(t){let e=t[0],r=t[t.length-1];return e[0]===r[0]&&e[1]===r[1]&&e[2]===r[2]}function N9(t,e,r,s){for(let i=0;i<e;i++)if(t[r+i]!==t[s-e+i])return!1;return!0}function pM(t,e,r,s,i){let n=e,o=r.length;for(let a=0;a<o;a++)for(let c=0;c<s;c++)t[n++]=r[a][c]||0;if(!L9(r))for(let a=0;a<s;a++)t[n++]=r[0][a]||0;return zi.start=e,zi.end=n,zi.size=s,Xn(t,i,zi),n}function gM(t,e,r,s,i=0,n,o){n=n||r.length;let a=n-i;if(a<=0)return e;let c=e;for(let l=0;l<a;l++)t[c++]=r[i+l];if(!N9(r,s,i,n))for(let l=0;l<s;l++)t[c++]=r[i+l];return zi.start=e,zi.end=c,zi.size=s,Xn(t,o,zi),c}function tg(t,e){B9(t);let r=[],s=[];if("positions"in t){let{positions:i,holeIndices:n}=t;if(n){let o=0;for(let a=0;a<=n.length;a++)o=gM(r,o,i,e,n[a-1],n[a],a===0?eg:dM),s.push(o);return s.pop(),{positions:r,holeIndices:s}}t=i}if(!O9(t))return gM(r,0,t,e,0,r.length,eg),r;if(!F9(t)){let i=0;for(let[n,o]of t.entries())i=pM(r,i,o,e,n===0?eg:dM),s.push(i);return s.pop(),{positions:r,holeIndices:s}}return pM(r,0,t,e,eg),r}function bA(t,e,r){let s=t.length/3,i=0;for(let n=0;n<s;n++){let o=(n+1)%s;i+=t[n*3+e]*t[o*3+r],i-=t[o*3+e]*t[n*3+r]}return Math.abs(i/2)}function mM(t,e,r,s){let i=t.length/3;for(let n=0;n<i;n++){let o=n*3,a=t[o+0],c=t[o+1],l=t[o+2];t[o+e]=a,t[o+r]=c,t[o+s]=l}}function yM(t,e,r,s){let i=Du(t);i&&(i=i.map(a=>a/e));let n=ya(t),o=s&&e===3;if(r){let a=n.length;n=n.slice();let c=[];for(let l=0;l<a;l+=e){c[0]=n[l],c[1]=n[l+1],o&&(c[2]=n[l+2]);let u=r(c);n[l]=u[0],n[l+1]=u[1],o&&(n[l+2]=u[2])}}if(o){let a=bA(n,0,1),c=bA(n,0,2),l=bA(n,1,2);if(!a&&!c&&!l)return[];a>c&&a>l||(c>l?(r||(n=n.slice()),mM(n,0,2,1)):(r||(n=n.slice()),mM(n,2,0,1)))}return(0,_M.default)(n,i,e)}var Uu=class extends Ys{constructor(e){let{fp64:r,IndexType:s=Uint32Array}=e;super({...e,attributes:{positions:{size:3,type:r?Float64Array:Float32Array},vertexValid:{type:Uint16Array,size:1},indices:{type:s,size:1}}})}get(e){let{attributes:r}=this;return e==="indices"?r.indices&&r.indices.subarray(0,this.vertexCount):r[e]}updateGeometry(e){super.updateGeometry(e);let r=this.buffers.indices;if(r)this.vertexCount=(r.value||r).length;else if(this.data&&!this.getGeometry)throw new Error("missing indices buffer")}normalizeGeometry(e){if(this.normalize){let r=tg(e,this.positionSize);return this.opts.resolution?Pu(ya(r),Du(r),{size:this.positionSize,gridResolution:this.opts.resolution,edgeTypes:!0}):this.opts.wrapLongitude?gA(ya(r),Du(r),{size:this.positionSize,maxLatitude:86,edgeTypes:!0}):r}return e}getGeometrySize(e){if(AM(e)){let r=0;for(let s of e)r+=this.getGeometrySize(s);return r}return ya(e).length/this.positionSize}getGeometryFromBuffer(e){return this.normalize||!this.buffers.indices?super.getGeometryFromBuffer(e):null}updateGeometryAttributes(e,r){if(e&&AM(e))for(let s of e){let i=this.getGeometrySize(s);r.geometrySize=i,this.updateGeometryAttributes(s,r),r.vertexStart+=i,r.indexStart=this.indexStarts[r.geometryIndex+1]}else{let s=e;this._updateIndices(s,r),this._updatePositions(s,r),this._updateVertexValid(s,r)}}_updateIndices(e,{geometryIndex:r,vertexStart:s,indexStart:i}){let{attributes:n,indexStarts:o,typedArrayManager:a}=this,c=n.indices;if(!c||!e)return;let l=i,u=yM(e,this.positionSize,this.opts.preproject,this.opts.full3d);c=a.allocate(c,i+u.length,{copy:!0});for(let f=0;f<u.length;f++)c[l++]=u[f]+s;o[r+1]=i+u.length,n.indices=c}_updatePositions(e,{vertexStart:r,geometrySize:s}){let{attributes:{positions:i},positionSize:n}=this;if(!i||!e)return;let o=ya(e);for(let a=r,c=0;c<s;a++,c++){let l=o[c*n],u=o[c*n+1],f=n>2?o[c*n+2]:0;i[a*3]=l,i[a*3+1]=u,i[a*3+2]=f}}_updateVertexValid(e,{vertexStart:r,geometrySize:s}){let{positionSize:i}=this,n=this.attributes.vertexValid,o=e&&Du(e);if(e&&e.edgeTypes?n.set(e.edgeTypes,r):n.fill(1,r,r+s),o)for(let a=0;a<o.length;a++)n[r+o[a]/i-1]=0;n[r+s-1]=0}};function AM(t){return Array.isArray(t)&&t.length>0&&!Number.isFinite(t[0])}var rg=`uniform bool extruded;
uniform bool isWireframe;
uniform float elevationScale;
uniform float opacity;
in vec4 fillColors;
in vec4 lineColors;
in vec3 picki