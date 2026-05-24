
result = -sum_fp64(mul_fp64(u, sin_t), mul_fp64(v, cos_t));
} else {
result = sub_fp64(mul_fp64(v, cos_t), mul_fp64(u, sin_t));
}
}
return result;
}
vec2 cos_fp64(vec2 a) {
if (a.x == 0.0 && a.y == 0.0) {
return vec2(1.0, 0.0);
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
return cos_taylor_fp64(t);
} else if (j == 1) {
return -sin_taylor_fp64(t);
} else if (j == -1) {
return sin_taylor_fp64(t);
} else {
return -cos_taylor_fp64(t);
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
result = sub_fp64(mul_fp64(u, cos_t), mul_fp64(v, sin_t));
} else {
result = sum_fp64(mul_fp64(u, cos_t), mul_fp64(v, sin_t));
}
} else if (j == 1) {
if (k > 0) {
result = -sum_fp64(mul_fp64(u, sin_t), mul_fp64(v, cos_t));
} else {
result = sub_fp64(mul_fp64(v, cos_t), mul_fp64(u, sin_t));
}
} else if (j == -1) {
if (k > 0) {
result = sum_fp64(mul_fp64(u, sin_t), mul_fp64(v, cos_t));
} else {
result = sub_fp64(mul_fp64(u, sin_t), mul_fp64(v, cos_t));
}
} else {
if (k > 0) {
result = sub_fp64(mul_fp64(v, sin_t), mul_fp64(u, cos_t));
} else {
result = -sum_fp64(mul_fp64(u, cos_t), mul_fp64(v, sin_t));
}
}
return result;
}
vec2 tan_fp64(vec2 a) {
vec2 sin_a;
vec2 cos_a;
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
int abs_k = int(abs(float(k)));
if (abs_k > 4) {
return vec2(0.0 / 0.0, 0.0 / 0.0);
} else {
t = sub_fp64(t, mul_fp64(PI_16_FP64, vec2(q, 0.0)));
}
vec2 u = vec2(0.0, 0.0);
vec2 v = vec2(0.0, 0.0);
vec2 sin_t, cos_t;
vec2 s, c;
sincos_taylor_fp64(t, sin_t, cos_t);
if (k == 0) {
s = sin_t;
c = cos_t;
} else {
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
if (k > 0) {
s = sum_fp64(mul_fp64(u, sin_t), mul_fp64(v, cos_t));
c = sub_fp64(mul_fp64(u, cos_t), mul_fp64(v, sin_t));
} else {
s = sub_fp64(mul_fp64(u, sin_t), mul_fp64(v, cos_t));
c = sum_fp64(mul_fp64(u, cos_t), mul_fp64(v, sin_t));
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
return div_fp64(sin_a, cos_a);
}
vec2 radians_fp64(vec2 degree) {
return mul_fp64(degree, PI_180_FP64);
}
vec2 mix_fp64(vec2 a, vec2 b, float x) {
vec2 range = sub_fp64(b, a);
return sum_fp64(a, mul_fp64(range, vec2(x, 0.0)));
}
void vec2_sum_fp64(vec2 a[2], vec2 b[2], out vec2 out_val[2]) {
out_val[0] = sum_fp64(a[0], b[0]);
out_val[1] = sum_fp64(a[1], b[1]);
}
void vec2_sub_fp64(vec2 a[2], vec2 b[2], out vec2 out_val[2]) {
out_val[0] = sub_fp64(a[0], b[0]);
out_val[1] = sub_fp64(a[1], b[1]);
}
void vec2_mul_fp64(vec2 a[2], vec2 b[2], out vec2 out_val[2]) {
out_val[0] = mul_fp64(a[0], b[0]);
out_val[1] = mul_fp64(a[1], b[1]);
}
void vec2_div_fp64(vec2 a[2], vec2 b[2], out vec2 out_val[2]) {
out_val[0] = div_fp64(a[0], b[0]);
out_val[1] = div_fp64(a[1], b[1]);
}
void vec2_mix_fp64(vec2 x[2], vec2 y[2], float a, out vec2 out_val[2]) {
vec2 range[2];
vec2_sub_fp64(y, x, range);
vec2 portion[2];
portion[0] = range[0] * a;
portion[1] = range[1] * a;
vec2_sum_fp64(x, portion, out_val);
}
vec2 vec2_length_fp64(vec2 x[2]) {
return sqrt_fp64(sum_fp64(mul_fp64(x[0], x[0]), mul_fp64(x[1], x[1])));
}
void vec2_normalize_fp64(vec2 x[2], out vec2 out_val[2]) {
vec2 length = vec2_length_fp64(x);
vec2 length_vec2[2];
length_vec2[0] = length;
length_vec2[1] = length;
vec2_div_fp64(x, length_vec2, out_val);
}
vec2 vec2_distance_fp64(vec2 x[2], vec2 y[2]) {
vec2 diff[2];
vec2_sub_fp64(x, y, diff);
return vec2_length_fp64(diff);
}
vec2 vec2_dot_fp64(vec2 a[2], vec2 b[2]) {
vec2 v[2];
v[0] = mul_fp64(a[0], b[0]);
v[1] = mul_fp64(a[1], b[1]);
return sum_fp64(v[0], v[1]);
}
void vec3_sub_fp64(vec2 a[3], vec2 b[3], out vec2 out_val[3]) {
for (int i = 0; i < 3; i++) {
out_val[i] = sum_fp64(a[i], b[i]);
}
}
void vec3_sum_fp64(vec2 a[3], vec2 b[3], out vec2 out_val[3]) {
for (int i = 0; i < 3; i++) {
out_val[i] = sum_fp64(a[i], b[i]);
}
}
vec2 vec3_length_fp64(vec2 x[3]) {
return sqrt_fp64(sum_fp64(sum_fp64(mul_fp64(x[0], x[0]), mul_fp64(x[1], x[1])),
mul_fp64(x[2], x[2])));
}
vec2 vec3_distance_fp64(vec2 x[3], vec2 y[3]) {
vec2 diff[3];
vec3_sub_fp64(x, y, diff);
return vec3_length_fp64(diff);
}
void vec4_fp64(vec4 a, out vec2 out_val[4]) {
out_val[0].x = a[0];
out_val[0].y = 0.0;
out_val[1].x = a[1];
out_val[1].y = 0.0;
out_val[2].x = a[2];
out_val[2].y = 0.0;
out_val[3].x = a[3];
out_val[3].y = 0.0;
}
void vec4_scalar_mul_fp64(vec2 a[4], vec2 b, out vec2 out_val[4]) {
out_val[0] = mul_fp64(a[0], b);
out_val[1] = mul_fp64(a[1], b);
out_val[2] = mul_fp64(a[2], b);
out_val[3] = mul_fp64(a[3], b);
}
void vec4_sum_fp64(vec2 a[4], vec2 b[4], out vec2 out_val[4]) {
for (int i = 0; i < 4; i++) {
out_val[i] = sum_fp64(a[i], b[i]);
}
}
void vec4_dot_fp64(vec2 a[4], vec2 b[4], out vec2 out_val) {
vec2 v[4];
v[0] = mul_fp64(a[0], b[0]);
v[1] = mul_fp64(a[1], b[1]);
v[2] = mul_fp64(a[2], b[2]);
v[3] = mul_fp64(a[3], b[3]);
out_val = sum_fp64(sum_fp64(v[0], v[1]), sum_fp64(v[2], v[3]));
}
void mat4_vec4_mul_fp64(vec2 b[16], vec2 a[4], out vec2 out_val[4]) {
vec2 tmp[4];
for (int i = 0; i < 4; i++)
{
for (int j = 0; j < 4; j++)
{
tmp[j] = b[j + i * 4];
}
vec4_dot_fp64(a, tmp, out_val[i]);
}
}
`;var FU={ONE:1};function LU(){return FU}var Ls={name:"fp64-arithmetic",vs:kS,getUniforms:LU,fp64ify:_d,fp64LowPart:Ey,fp64ifyMatrix4:Sy},yd={name:"fp64",vs:VS,dependencies:[Ls],fp64ify:_d,fp64LowPart:Ey,fp64ifyMatrix4:Sy};var NU=1/Math.PI*180,DU=1/180*Math.PI,UU={EPSILON:1e-12,debug:!1,precision:4,printTypes:!1,printDegrees:!1,printRowMajor:!0,_cartographicRadians:!1};globalThis.mathgl=globalThis.mathgl||{config:{...UU}};var Se=globalThis.mathgl.config;function tl(t,{precision:e=Se.precision}={}){return t=kU(t),`${parseFloat(t.toPrecision(e))}`}function er(t){return Array.isArray(t)||ArrayBuffer.isView(t)&&!(t instanceof DataView)}function vy(t){return _n(t)}function Cy(t){return Je(t)}function _n(t,e){return wy(t,r=>r*DU,e)}function Je(t,e){return wy(t,r=>r*NU,e)}function fe(t,e,r){return wy(t,s=>Math.max(e,Math.min(r,s)))}function it(t,e,r){return er(t)?t.map((s,i)=>it(s,e[i],r)):r*e+(1-r)*t}function Ce(t,e,r){let s=Se.EPSILON;r&&(Se.EPSILON=r);try{if(t===e)return!0;if(er(t)&&er(e)){if(t.length!==e.length)return!1;for(let i=0;i<t.length;++i)if(!Ce(t[i],e[i]))return!1;return!0}return t&&t.equals?t.equals(e):e&&e.equals?e.equals(t):typeof t=="number"&&typeof e=="number"?Math.abs(t-e)<=Se.EPSILON*Math.max(1,Math.abs(t),Math.abs(e)):!1}finally{Se.EPSILON=s}}function kU(t){return Math.round(t/Se.EPSILON)*Se.EPSILON}function VU(t){return t.clone?t.clone():new Array(t.length)}function wy(t,e,r){if(er(t)){let s=t;r=r||VU(s);for(let i=0;i<r.length&&i<s.length;++i){let n=typeof t=="number"?t:t[i];r[i]=e(n,i,r)}return r}return e(t)}var bi=class extends Array{clone(){return new this.constructor().copy(this)}fromArray(e,r=0){for(let s=0;s<this.ELEMENTS;++s)this[s]=e[s+r];return this.check()}toArray(e=[],r=0){for(let s=0;s<this.ELEMENTS;++s)e[r+s]=this[s];return e}toObject(e){return e}from(e){return Array.isArray(e)?this.copy(e):this.fromObject(e)}to(e){return e===this?this:er(e)?this.toArray(e):this.toObject(e)}toTarget(e){return e?this.to(e):this}toFloat32Array(){return new Float32Array(this)}toString(){return this.formatString(Se)}formatString(e){let r="";for(let s=0;s<this.ELEMENTS;++s)r+=(s>0?", ":"")+tl(this[s],e);return`${e.printTypes?this.constructor.name:""}[${r}]`}equals(e){if(!e||this.length!==e.length)return!1;for(let r=0;r<this.ELEMENTS;++r)if(!Ce(this[r],e[r]))return!1;return!0}exactEquals(e){if(!e||this.length!==e.length)return!1;for(let r=0;r<this.ELEMENTS;++r)if(this[r]!==e[r])return!1;return!0}negate(){for(let e=0;e<this.ELEMENTS;++e)this[e]=-this[e];return this.check()}lerp(e,r,s){if(s===void 0)return this.lerp(this,e,r);for(let i=0;i<this.ELEMENTS;++i){let n=e[i],o=typeof r=="number"?r:r[i];this[i]=n+s*(o-n)}return this.check()}min(e){for(let r=0;r<this.ELEMENTS;++r)this[r]=Math.min(e[r],this[r]);return this.check()}max(e){for(let r=0;r<this.ELEMENTS;++r)this[r]=Math.max(e[r],this[r]);return this.check()}clamp(e,r){for(let s=0;s<this.ELEMENTS;++s)this[s]=Math.min(Math.max(this[s],e[s]),r[s]);return this.check()}add(...e){for(let r of e)for(let s=0;s<this.ELEMENTS;++s)this[s]+=r[s];return this.check()}subtract(...e){for(let r of e)for(let s=0;s<this.ELEMENTS;++s)this[s]-=r[s];return this.check()}scale(e){if(typeof e=="number")for(let r=0;r<this.ELEMENTS;++r)this[r]*=e;else for(let r=0;r<this.ELEMENTS&&r<e.length;++r)this[r]*=e[r];return this.check()}multiplyByScalar(e){for(let r=0;r<this.ELEMENTS;++r)this[r]*=e;return this.check()}check(){if(Se.debug&&!this.validate())throw new Error(`math.gl: ${this.constructor.name} some fields set to invalid numbers'`);return this}validate(){let e=this.length===this.ELEMENTS;for(let r=0;r<this.ELEMENTS;++r)e=e&&Number.isFinite(this[r]);return e}sub(e){return this.subtract(e)}setScalar(e){for(let r=0;r<this.ELEMENTS;++r)this[r]=e;return this.check()}addScalar(e){for(let r=0;r<this.ELEMENTS;++r)this[r]+=e;return this.check()}subScalar(e){return this.addScalar(-e)}multiplyScalar(e){for(let r=0;r<this.ELEMENTS;++r)this[r]*=e;return this.check()}divideScalar(e){return this.multiplyByScalar(1/e)}clampScalar(e,r){for(let s=0;s<this.ELEMENTS;++s)this[s]=Math.min(Math.max(this[s],e),r);return this.check()}get elements(){return this}};function zU(t,e){if(t.length!==e)return!1;for(let r=0;r<t.length;++r)if(!Number.isFinite(t[r]))return!1;return!0}function ce(t){if(!Number.isFinite(t))throw new Error(`Invalid number ${JSON.stringify(t)}`);return t}function Ei(t,e,r=""){if(Se.debug&&!zU(t,e))throw new Error(`math.gl: ${r} some fields set to invalid numbers'`);return t}function ut(t,e){if(!t)throw new Error(`math.gl assertion ${e}`)}var Si=class extends bi{get x(){return this[0]}set x(e){this[0]=ce(e)}get y(){return this[1]}set y(e){this[1]=ce(e)}len(){return Math.sqrt(this.lengthSquared())}magnitude(){return this.len()}lengthSquared(){let e=0;for(let r=0;r<this.ELEMENTS;++r)e+=this[r]*this[r];return e}magnitudeSquared(){return this.lengthSquared()}distance(e){return Math.sqrt(this.distanceSquared(e))}distanceSquared(e){let r=0;for(let s=0;s<this.ELEMENTS;++s){let i=this[s]-e[s];r+=i*i}return ce(r)}dot(e){let r=0;for(let s=0;s<this.ELEMENTS;++s)r+=this[s]*e[s];return ce(r)}normalize(){let e=this.magnitude();if(e!==0)for(let r=0;r<this.ELEMENTS;++r)this[r]/=e;return this.check()}multiply(...e){for(let r of e)for(let s=0;s<this.ELEMENTS;++s)this[s]*=r[s];return this.check()}divide(...e){for(let r of e)for(let s=0;s<this.ELEMENTS;++s)this[s]/=r[s];return this.check()}lengthSq(){return this.lengthSquared()}distanceTo(e){return this.distance(e)}distanceToSquared(e){return this.distanceSquared(e)}getComponent(e){return ut(e>=0&&e<this.ELEMENTS,"index is out of range"),ce(this[e])}setComponent(e,r){return ut(e>=0&&e<this.ELEMENTS,"index is out of range"),this[e]=r,this.check()}addVectors(e,r){return this.copy(e).add(r)}subVectors(e,r){return this.copy(e).subtract(r)}multiplyVectors(e,r){return this.copy(e).multiply(r)}addScaledVector(e,r){return this.add(new this.constructor(e).multiplyScalar(r))}};var Ze={};Ke(Ze,{add:()=>XU,angle:()=>c4,ceil:()=>YU,clone:()=>HU,copy:()=>WU,create:()=>zS,cross:()=>i4,dist:()=>_4,distance:()=>jS,div:()=>m4,divide:()=>WS,dot:()=>s4,equals:()=>h4,exactEquals:()=>f4,floor:()=>qU,forEach:()=>A4,fromValues:()=>GU,inverse:()=>t4,len:()=>d4,length:()=>YS,lerp:()=>n4,max:()=>$U,min:()=>KU,mul:()=>g4,multiply:()=>GS,negate:()=>e4,normalize:()=>r4,random:()=>o4,rotate:()=>a4,round:()=>JU,scale:()=>ZU,scaleAndAdd:()=>QU,set:()=>jU,sqrDist:()=>y4,sqrLen:()=>x4,squaredDistance:()=>XS,squaredLength:()=>qS,str:()=>u4,sub:()=>p4,subtract:()=>HS,transformMat2:()=>Py,transformMat2d:()=>My,transformMat3:()=>rl,transformMat4:()=>sl,zero:()=>l4});var we=typeof Float32Array<"u"?Float32Array:Array,fs=Math.random;function fr(t){return t>=0?Math.round(t):t%.5===0?Math.floor(t):Math.round(t)}var fce=Math.PI/180;function zS(){let t=new we(2);return we!=Float32Array&&(t[0]=0,t[1]=0),t}function HU(t){let e=new we(2);return e[0]=t[0],e[1]=t[1],e}function GU(t,e){let r=new we(2);return r[0]=t,r[1]=e,r}function WU(t,e){return t[0]=e[0],t[1]=e[1],t}function jU(t,e,r){return t[0]=e,t[1]=r,t}function XU(t,e,r){return t[0]=e[0]+r[0],t[1]=e[1]+r[1],t}function HS(t,e,r){return t[0]=e[0]-r[0],t[1]=e[1]-r[1],t}function GS(t,e,r){return t[0]=e[0]*r[0],t[1]=e[1]*r[1],t}function WS(t,e,r){return t[0]=e[0]/r[0],t[1]=e[1]/r[1],t}function YU(t,e){return t[0]=Math.ceil(e[0]),t[1]=Math.ceil(e[1]),t}function qU(t,e){return t[0]=Math.floor(e[0]),t[1]=Math.floor(e[1]),t}function KU(t,e,r){return t[0]=Math.min(e[0],r[0]),t[1]=Math.min(e[1],r[1]),t}function $U(t,e,r){return t[0]=Math.max(e[0],r[0]),t[1]=Math.max(e[1],r[1]),t}function JU(t,e){return t[0]=fr(e[0]),t[1]=fr(e[1]),t}function ZU(t,e,r){return t[0]=e[0]*r,t[1]=e[1]*r,t}function QU(t,e,r,s){return t[0]=e[0]+r[0]*s,t[1]=e[1]+r[1]*s,t}function jS(t,e){let r=e[0]-t[0],s=e[1]-t[1];return Math.sqrt(r*r+s*s)}function XS(t,e){let r=e[0]-t[0],s=e[1]-t[1];return r*r+s*s}function YS(t){let e=t[0],r=t[1];return Math.sqrt(e*e+r*r)}function qS(t){let e=t[0],r=t[1];return e*e+r*r}function e4(t,e){return t[0]=-e[0],t[1]=-e[1],t}function t4(t,e){return t[0]=1/e[0],t[1]=1/e[1],t}function r4(t,e){let r=e[0],s=e[1],i=r*r+s*s;return i>0&&(i=1/Math.sqrt(i)),t[0]=e[0]*i,t[1]=e[1]*i,t}function s4(t,e){return t[0]*e[0]+t[1]*e[1]}function i4(t,e,r){let s=e[0]*r[1]-e[1]*r[0];return t[0]=t[1]=0,t[2]=s,t}function n4(t,e,r,s){let i=e[0],n=e[1];return t[0]=i+s*(r[0]-i),t[1]=n+s*(r[1]-n),t}function o4(t,e){e=e===void 0?1:e;let r=fs()*2*Math.PI;return t[0]=Math.cos(r)*e,t[1]=Math.sin(r)*e,t}function Py(t,e,r){let s=e[0],i=e[1];return t[0]=r[0]*s+r[2]*i,t[1]=r[1]*s+r[3]*i,t}function My(t,e,r){let s=e[0],i=e[1];return t[0]=r[0]*s+r[2]*i+r[4],t[1]=r[1]*s+r[3]*i+r[5],t}function rl(t,e,r){let s=e[0],i=e[1];return t[0]=r[0]*s+r[3]*i+r[6],t[1]=r[1]*s+r[4]*i+r[7],t}function sl(t,e,r){let s=e[0],i=e[1];return t[0]=r[0]*s+r[4]*i+r[12],t[1]=r[1]*s+r[5]*i+r[13],t}function a4(t,e,r,s){let i=e[0]-r[0],n=e[1]-r[1],o=Math.sin(s),a=Math.cos(s);return t[0]=i*a-n*o+r[0],t[1]=i*o+n*a+r[1],t}function c4(t,e){let r=t[0],s=t[1],i=e[0],n=e[1],o=Math.sqrt((r*r+s*s)*(i*i+n*n)),a=o&&(r*i+s*n)/o;return Math.acos(Math.min(Math.max(a,-1),1))}function l4(t){return t[0]=0,t[1]=0,t}function u4(t){return`vec2(${t[0]}, ${t[1]})`}function f4(t,e){return t[0]===e[0]&&t[1]===e[1]}function h4(t,e){let r=t[0],s=t[1],i=e[0],n=e[1];return Math.abs(r-i)<=1e-6*Math.max(1,Math.abs(r),Math.abs(i))&&Math.abs(s-n)<=1e-6*Math.max(1,Math.abs(s),Math.abs(n))}var d4=YS,p4=HS,g4=GS,m4=WS,_4=jS,y4=XS,x4=qS,A4=function(){let t=zS();return function(e,r,s,i,n,o){let a,c;for(r||(r=2),s||(s=0),i?c=Math.min(i*r+s,e.length):c=e.length,a=s;a<c;a+=r)t[0]=e[a],t[1]=e[a+1],n(t,t,o),e[a]=t[0],e[a+1]=t[1];return e}}();function xd(t,e,r){let s=e[0],i=e[1],n=r[3]*s+r[7]*i||1;return t[0]=(r[0]*s+r[4]*i)/n,t[1]=(r[1]*s+r[5]*i)/n,t}function Ad(t,e,r){let s=e[0],i=e[1],n=e[2],o=r[3]*s+r[7]*i+r[11]*n||1;return t[0]=(r[0]*s+r[4]*i+r[8]*n)/o,t[1]=(r[1]*s+r[5]*i+r[9]*n)/o,t[2]=(r[2]*s+r[6]*i+r[10]*n)/o,t}function KS(t,e,r){let s=e[0],i=e[1];return t[0]=r[0]*s+r[2]*i,t[1]=r[1]*s+r[3]*i,t[2]=e[2],t}function $S(t,e,r){let s=e[0],i=e[1];return t[0]=r[0]*s+r[2]*i,t[1]=r[1]*s+r[3]*i,t[2]=e[2],t[3]=e[3],t}function Td(t,e,r){let s=e[0],i=e[1],n=e[2];return t[0]=r[0]*s+r[3]*i+r[6]*n,t[1]=r[1]*s+r[4]*i+r[7]*n,t[2]=r[2]*s+r[5]*i+r[8]*n,t[3]=e[3],t}var Br=class extends Si{constructor(e=0,r=0){super(2),er(e)&&arguments.length===1?this.copy(e):(Se.debug&&(ce(e),ce(r)),this[0]=e,this[1]=r)}set(e,r){return this[0]=e,this[1]=r,this.check()}copy(e){return this[0]=e[0],this[1]=e[1],this.check()}fromObject(e){return Se.debug&&(ce(e.x),ce(e.y)),this[0]=e.x,this[1]=e.y,this.check()}toObject(e){return e.x=this[0],e.y=this[1],e}get ELEMENTS(){return 2}horizontalAngle(){return Math.atan2(this.y,this.x)}verticalAngle(){return Math.atan2(this.x,this.y)}transform(e){return this.transformAsPoint(e)}transformAsPoint(e){return sl(this,this,e),this.check()}transformAsVector(e){return xd(this,this,e),this.check()}transformByMatrix3(e){return rl(this,this,e),this.check()}transformByMatrix2x3(e){return My(this,this,e),this.check()}transformByMatrix2(e){return Py(this,this,e),this.check()}};var We={};Ke(We,{add:()=>S4,angle:()=>Fy,bezier:()=>D4,ceil:()=>v4,clone:()=>T4,copy:()=>b4,create:()=>bd,cross:()=>yn,dist:()=>X4,distance:()=>ev,div:()=>j4,divide:()=>QS,dot:()=>il,equals:()=>H4,exactEquals:()=>z4,floor:()=>C4,forEach:()=>K4,fromValues:()=>Sd,hermite:()=>N4,inverse:()=>O4,len:()=>Ly,length:()=>Ed,lerp:()=>F4,max:()=>P4,min:()=>w4,mul:()=>W4,multiply:()=>ZS,negate:()=>B4,normalize:()=>Ry,random:()=>U4,rotateX:()=>Iy,rotateY:()=>By,rotateZ:()=>Oy,round:()=>M4,scale:()=>R4,scaleAndAdd:()=>I4,set:()=>E4,slerp:()=>L4,sqrDist:()=>Y4,sqrLen:()=>q4,squaredDistance:()=>tv,squaredLength:()=>rv,str:()=>V4,sub:()=>G4,subtract:()=>JS,transformMat3:()=>nl,transformMat4:()=>xn,transformQuat:()=>ol,zero:()=>k4});function bd(){let t=new we(3);return we!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0),t}function T4(t){let e=new we(3);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e}function Ed(t){let e=t[0],r=t[1],s=t[2];return Math.sqrt(e*e+r*r+s*s)}function Sd(t,e,r){let s=new we(3);return s[0]=t,s[1]=e,s[2]=r,s}function b4(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t}function E4(t,e,r,s){return t[0]=e,t[1]=r,t[2]=s,t}function S4(t,e,r){return t[0]=e[0]+r[0],t[1]=e[1]+r[1],t[2]=e[2]+r[2],t}function JS(t,e,r){return t[0]=e[0]-r[0],t[1]=e[1]-r[1],t[2]=e[2]-r[2],t}function ZS(t,e,r){return t[0]=e[0]*r[0],t[1]=e[1]*r[1],t[2]=e[2]*r[2],t}function QS(t,e,r){return t[0]=e[0]/r[0],t[1]=e[1]/r[1],t[2]=e[2]/r[2],t}function v4(t,e){return t[0]=Math.ceil(e[0]),t[1]=Math.ceil(e[1]),t[2]=Math.ceil(e[2]),t}function C4(t,e){return t[0]=Math.floor(e[0]),t[1]=Math.floor(e[1]),t[2]=Math.floor(e[2]),t}function w4(t,e,r){return t[0]=Math.min(e[0],r[0]),t[1]=Math.min(e[1],r[1]),t[2]=Math.min(e[2],r[2]),t}function P4(t,e,r){return t[0]=Math.max(e[0],r[0]),t[1]=Math.max(e[1],r[1]),t[2]=Math.max(e[2],r[2]),t}function M4(t,e){return t[0]=fr(e[0]),t[1]=fr(e[1]),t[2]=fr(e[2]),t}function R4(t,e,r){return t[0]=e[0]*r,t[1]=e[1]*r,t[2]=e[2]*r,t}function I4(t,e,r,s){return t[0]=e[0]+r[0]*s,t[1]=e[1]+r[1]*s,t[2]=e[2]+r[2]*s,t}function ev(t,e){let r=e[0]-t[0],s=e[1]-t[1],i=e[2]-t[2];return Math.sqrt(r*r+s*s+i*i)}function tv(t,e){let r=e[0]-t[0],s=e[1]-t[1],i=e[2]-t[2];return r*r+s*s+i*i}function rv(t){let e=t[0],r=t[1],s=t[2];return e*e+r*r+s*s}function B4(t,e){return t[0]=-e[0],t[1]=-e[1],t[2]=-e[2],t}function O4(t,e){return t[0]=1/e[0],t[1]=1/e[1],t[2]=1/e[2],t}function Ry(t,e){let r=e[0],s=e[1],i=e[2],n=r*r+s*s+i*i;return n>0&&(n=1/Math.sqrt(n)),t[0]=e[0]*n,t[1]=e[1]*n,t[2]=e[2]*n,t}function il(t,e){return t[0]*e[0]+t[1]*e[1]+t[2]*e[2]}function yn(t,e,r){let s=e[0],i=e[1],n=e[2],o=r[0],a=r[1],c=r[2];return t[0]=i*c-n*a,t[1]=n*o-s*c,t[2]=s*a-i*o,t}function F4(t,e,r,s){let i=e[0],n=e[1],o=e[2];return t[0]=i+s*(r[0]-i),t[1]=n+s*(r[1]-n),t[2]=o+s*(r[2]-o),t}function L4(t,e,r,s){let i=Math.acos(Math.min(Math.max(il(e,r),-1),1)),n=Math.sin(i),o=Math.sin((1-s)*i)/n,a=Math.sin(s*i)/n;return t[0]=o*e[0]+a*r[0],t[1]=o*e[1]+a*r[1],t[2]=o*e[2]+a*r[2],t}function N4(t,e,r,s,i,n){let o=n*n,a=o*(2*n-3)+1,c=o*(n-2)+n,l=o*(n-1),u=o*(3-2*n);return t[0]=e[0]*a+r[0]*c+s[0]*l+i[0]*u,t[1]=e[1]*a+r[1]*c+s[1]*l+i[1]*u,t[2]=e[2]*a+r[2]*c+s[2]*l+i[2]*u,t}function D4(t,e,r,s,i,n){let o=1-n,a=o*o,c=n*n,l=a*o,u=3*n*a,f=3*c*o,h=c*n;return t[0]=e[0]*l+r[0]*u+s[0]*f+i[0]*h,t[1]=e[1]*l+r[1]*u+s[1]*f+i[1]*h,t[2]=e[2]*l+r[2]*u+s[2]*f+i[2]*h,t}function U4(t,e){e=e===void 0?1:e;let r=fs()*2*Math.PI,s=fs()*2-1,i=Math.sqrt(1-s*s)*e;return t[0]=Math.cos(r)*i,t[1]=Math.sin(r)*i,t[2]=s*e,t}function xn(t,e,r){let s=e[0],i=e[1],n=e[2],o=r[3]*s+r[7]*i+r[11]*n+r[15];return o=o||1,t[0]=(r[0]*s+r[4]*i+r[8]*n+r[12])/o,t[1]=(r[1]*s+r[5]*i+r[9]*n+r[13])/o,t[2]=(r[2]*s+r[6]*i+r[10]*n+r[14])/o,t}function nl(t,e,r){let s=e[0],i=e[1],n=e[2];return t[0]=s*r[0]+i*r[3]+n*r[6],t[1]=s*r[1]+i*r[4]+n*r[7],t[2]=s*r[2]+i*r[5]+n*r[8],t}function ol(t,e,r){let s=r[0],i=r[1],n=r[2],o=r[3],a=e[0],c=e[1],l=e[2],u=i*l-n*c,f=n*a-s*l,h=s*c-i*a,d=i*h-n*f,p=n*u-s*h,g=s*f-i*u,m=o*2;return u*=m,f*=m,h*=m,d*=2,p*=2,g*=2,t[0]=a+u+d,t[1]=c+f+p,t[2]=l+h+g,t}function Iy(t,e,r,s){let i=[],n=[];return i[0]=e[0]-r[0],i[1]=e[1]-r[1],i[2]=e[2]-r[2],n[0]=i[0],n[1]=i[1]*Math.cos(s)-i[2]*Math.sin(s),n[2]=i[1]*Math.sin(s)+i[2]*Math.cos(s),t[0]=n[0]+r[0],t[1]=n[1]+r[1],t[2]=n[2]+r[2],t}function By(t,e,r,s){let i=[],n=[];return i[0]=e[0]-r[0],i[1]=e[1]-r[1],i[2]=e[2]-r[2],n[0]=i[2]*Math.sin(s)+i[0]*Math.cos(s),n[1]=i[1],n[2]=i[2]*Math.cos(s)-i[0]*Math.sin(s),t[0]=n[0]+r[0],t[1]=n[1]+r[1],t[2]=n[2]+r[2],t}function Oy(t,e,r,s){let i=[],n=[];return i[0]=e[0]-r[0],i[1]=e[1]-r[1],i[2]=e[2]-r[2],n[0]=i[0]*Math.cos(s)-i[1]*Math.sin(s),n[1]=i[0]*Math.sin(s)+i[1]*Math.cos(s),n[2]=i[2],t[0]=n[0]+r[0],t[1]=n[1]+r[1],t[2]=n[2]+r[2],t}function Fy(t,e){let r=t[0],s=t[1],i=t[2],n=e[0],o=e[1],a=e[2],c=Math.sqrt((r*r+s*s+i*i)*(n*n+o*o+a*a)),l=c&&il(t,e)/c;return Math.acos(Math.min(Math.max(l,-1),1))}function k4(t){return t[0]=0,t[1]=0,t[2]=0,t}function V4(t){return`vec3(${t[0]}, ${t[1]}, ${t[2]})`}function z4(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]}function H4(t,e){let r=t[0],s=t[1],i=t[2],n=e[0],o=e[1],a=e[2];return Math.abs(r-n)<=1e-6*Math.max(1,Math.abs(r),Math.abs(n))&&Math.abs(s-o)<=1e-6*Math.max(1,Math.abs(s),Math.abs(o))&&Math.abs(i-a)<=1e-6*Math.max(1,Math.abs(i),Math.abs(a))}var G4=JS,W4=ZS,j4=QS,X4=ev,Y4=tv,Ly=Ed,q4=rv,K4=function(){let t=bd();return function(e,r,s,i,n,o){let a,c;for(r||(r=3),s||(s=0),i?c=Math.min(i*r+s,e.length):c=e.length,a=s;a<c;a+=r)t[0]=e[a],t[1]=e[a+1],t[2]=e[a+2],n(t,t,o),e[a]=t[0],e[a+1]=t[1],e[a+2]=t[2];return e}}();var Ny=[0,0,0],vd,w=class extends Si{static get ZERO(){return vd||(vd=new w(0,0,0),Object.freeze(vd)),vd}constructor(e=0,r=0,s=0){super(-0,-0,-0),arguments.length===1&&er(e)?this.copy(e):(Se.debug&&(ce(e),ce(r),ce(s)),this[0]=e,this[1]=r,this[2]=s)}set(e,r,s){return this[0]=e,this[1]=r,this[2]=s,this.check()}copy(e){return this[0]=e[0],this[1]=e[1],this[2]=e[2],this.check()}fromObject(e){return Se.debug&&(ce(e.x),ce(e.y),ce(e.z)),this[0]=e.x,this[1]=e.y,this[2]=e.z,this.check()}toObject(e){return e.x=this[0],e.y=this[1],e.z=this[2],e}get ELEMENTS(){return 3}get z(){return this[2]}set z(e){this[2]=ce(e)}angle(e){return Fy(this,e)}cross(e){return yn(this,this,e),this.check()}rotateX({radians:e,origin:r=Ny}){return Iy(this,this,r,e),this.check()}rotateY({radians:e,origin:r=Ny}){return By(this,this,r,e),this.check()}rotateZ({radians:e,origin:r=Ny}){return Oy(this,this,r,e),this.check()}transform(e){return this.transformAsPoint(e)}transformAsPoint(e){return xn(this,this,e),this.check()}transformAsVector(e){return Ad(this,this,e),this.check()}transformByMatrix3(e){return nl(this,this,e),this.check()}transformByMatrix2(e){return KS(this,this,e),this.check()}transformByQuaternion(e){return ol(this,this,e),this.check()}};var Cd,zo=class extends Si{static get ZERO(){return Cd||(Cd=new zo(0,0,0,0),Object.freeze(Cd)),Cd}constructor(e=0,r=0,s=0,i=0){super(-0,-0,-0,-0),er(e)&&arguments.length===1?this.copy(e):(Se.debug&&(ce(e),ce(r),ce(s),ce(i)),this[0]=e,this[1]=r,this[2]=s,this[3]=i)}set(e,r,s,i){return this[0]=e,this[1]=r,this[2]=s,this[3]=i,this.check()}copy(e){return this[0]=e[0],this[1]=e[1],this[2]=e[2],this[3]=e[3],this.check()}fromObject(e){return Se.debug&&(ce(e.x),ce(e.y),ce(e.z),ce(e.w)),this[0]=e.x,this[1]=e.y,this[2]=e.z,this[3]=e.w,this}toObject(e){return e.x=this[0],e.y=this[1],e.z=this[2],e.w=this[3],e}get ELEMENTS(){return 4}get z(){return this[2]}set z(e){this[2]=ce(e)}get w(){return this[3]}set w(e){this[3]=ce(e)}transform(e){return xn(this,this,e),this.check()}transformByMatrix3(e){return Td(this,this,e),this.check()}transformByMatrix2(e){return $S(this,this,e),this.check()}transformByQuaternion(e){return ol(this,this,e),this.check()}applyMatrix4(e){return e.transform(this,this),this}};var Ho=class extends bi{toString(){let e="[";if(Se.printRowMajor){e+="row-major:";for(let r=0;r<this.RANK;++r)for(let s=0;s<this.RANK;++s)e+=` ${this[s*this.RANK+r]}`}else{e+="column-major:";for(let r=0;r<this.ELEMENTS;++r)e+=` ${this[r]}`}return e+="]",e}getElementIndex(e,r){return r*this.RANK+e}getElement(e,r){return this[r*this.RANK+e]}setElement(e,r,s){return this[r*this.RANK+e]=ce(s),this}getColumn(e,r=new Array(this.RANK).fill(-0)){let s=e*this.RANK;for(let i=0;i<this.RANK;++i)r[i]=this[s+i];return r}setColumn(e,r){let s=e*this.RANK;for(let i=0;i<this.RANK;++i)this[s+i]=r[i];return this}};function sv(){let t=new we(9);return we!=Float32Array&&(t[1]=0,t[2]=0,t[3]=0,t[5]=0,t[6]=0,t[7]=0),t[0]=1,t[4]=1,t[8]=1,t}function iv(t,e){if(t===e){let r=e[1],s=e[2],i=e[5];t[1]=e[3],t[2]=e[6],t[3]=r,t[5]=e[7],t[6]=s,t[7]=i}else t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8];return t}function nv(t,e){let r=e[0],s=e[1],i=e[2],n=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8],f=u*o-a*l,h=-u*n+a*c,d=l*n-o*c,p=r*f+s*h+i*d;return p?(p=1/p,t[0]=f*p,t[1]=(-u*s+i*l)*p,t[2]=(a*s-i*o)*p,t[3]=h*p,t[4]=(u*r-i*c)*p,t[5]=(-a*r+i*n)*p,t[6]=d*p,t[7]=(-l*r+s*c)*p,t[8]=(o*r-s*n)*p,t):null}function ov(t){let e=t[0],r=t[1],s=t[2],i=t[3],n=t[4],o=t[5],a=t[6],c=t[7],l=t[8];return e*(l*n-o*c)+r*(-l*i+o*a)+s*(c*i-n*a)}function Dy(t,e,r){let s=e[0],i=e[1],n=e[2],o=e[3],a=e[4],c=e[5],l=e[6],u=e[7],f=e[8],h=r[0],d=r[1],p=r[2],g=r[3],m=r[4],_=r[5],y=r[6],x=r[7],S=r[8];return t[0]=h*s+d*o+p*l,t[1]=h*i+d*a+p*u,t[2]=h*n+d*c+p*f,t[3]=g*s+m*o+_*l,t[4]=g*i+m*a+_*u,t[5]=g*n+m*c+_*f,t[6]=y*s+x*o+S*l,t[7]=y*i+x*a+S*u,t[8]=y*n+x*c+S*f,t}function av(t,e,r){let s=e[0],i=e[1],n=e[2],o=e[3],a=e[4],c=e[5],l=e[6],u=e[7],f=e[8],h=r[0],d=r[1];return t[0]=s,t[1]=i,t[2]=n,t[3]=o,t[4]=a,t[5]=c,t[6]=h*s+d*o+l,t[7]=h*i+d*a+u,t[8]=h*n+d*c+f,t}function cv(t,e,r){let s=e[0],i=e[1],n=e[2],o=e[3],a=e[4],c=e[5],l=e[6],u=e[7],f=e[8],h=Math.sin(r),d=Math.cos(r);return t[0]=d*s+h*o,t[1]=d*i+h*a,t[2]=d*n+h*c,t[3]=d*o-h*s,t[4]=d*a-h*i,t[5]=d*c-h*n,t[6]=l,t[7]=u,t[8]=f,t}function Uy(t,e,r){let s=r[0],i=r[1];return t[0]=s*e[0],t[1]=s*e[1],t[2]=s*e[2],t[3]=i*e[3],t[4]=i*e[4],t[5]=i*e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t}function lv(t,e){let r=e[0],s=e[1],i=e[2],n=e[3],o=r+r,a=s+s,c=i+i,l=r*o,u=s*o,f=s*a,h=i*o,d=i*a,p=i*c,g=n*o,m=n*a,_=n*c;return t[0]=1-f-p,t[3]=u-_,t[6]=h+m,t[1]=u+_,t[4]=1-l-p,t[7]=d-g,t[2]=h-m,t[5]=d+g,t[8]=1-l-f,t}var ky;(function(t){t[t.COL0ROW0=0]="COL0ROW0",t[t.COL0ROW1=1]="COL0ROW1",t[t.COL0ROW2=2]="COL0ROW2",t[t.COL1ROW0=3]="COL1ROW0",t[t.COL1ROW1=4]="COL1ROW1",t[t.COL1ROW2=5]="COL1ROW2",t[t.COL2ROW0=6]="COL2ROW0",t[t.COL2ROW1=7]="COL2ROW1",t[t.COL2ROW2=8]="COL2ROW2"})(ky||(ky={}));var J4=Object.freeze([1,0,0,0,1,0,0,0,1]),me=class extends Ho{static get IDENTITY(){return Q4()}static get ZERO(){return Z4()}get ELEMENTS(){return 9}get RANK(){return 3}get INDICES(){return ky}constructor(e,...r){super(-0,-0,-0,-0,-0,-0,-0,-0,-0),arguments.length===1&&Array.isArray(e)?this.copy(e):r.length>0?this.copy([e,...r]):this.identity()}copy(e){return this[0]=e[0],this[1]=e[1],this[2]=e[2],this[3]=e[3],this[4]=e[4],this[5]=e[5],this[6]=e[6],this[7]=e[7],this[8]=e[8],this.check()}identity(){return this.copy(J4)}fromObject(e){return this.check()}fromQuaternion(e){return lv(this,e),this.check()}set(e,r,s,i,n,o,a,c,l){return this[0]=e,this[1]=r,this[2]=s,this[3]=i,this[4]=n,this[5]=o,this[6]=a,this[7]=c,this[8]=l,this.check()}setRowMajor(e,r,s,i,n,o,a,c,l){return this[0]=e,this[1]=i,this[2]=a,this[3]=r,this[4]=n,this[5]=c,this[6]=s,this[7]=o,this[8]=l,this.check()}determinant(){return ov(this)}transpose(){return iv(this,this),this.check()}invert(){return nv(this,this),this.check()}multiplyLeft(e){return Dy(this,e,this),this.check()}multiplyRight(e){return Dy(this,this,e),this.check()}rotate(e){return cv(this,this,e),this.check()}scale(e){return Array.isArray(e)?Uy(this,this,e):Uy(this,this,[e,e]),this.check()}translate(e){return av(this,this,e),this.check()}transform(e,r){let s;switch(e.length){case 2:s=rl(r||[-0,-0],e,this);break;case 3:s=nl(r||[-0,-0,-0],e,this);break;case 4:s=Td(r||[-0,-0,-0,-0],e,this);break;default:throw new Error("Illegal vector")}return Ei(s,e.length),s}transformVector(e,r){return this.transform(e,r)}transformVector2(e,r){return this.transform(e,r)}transformVector3(e,r){return this.transform(e,r)}},wd,Pd=null;function Z4(){return wd||(wd=new me([0,0,0,0,0,0,0,0,0]),Object.freeze(wd)),wd}function Q4(){return Pd||(Pd=new me,Object.freeze(Pd)),Pd}var ke={};Ke(ke,{add:()=>Sk,adjoint:()=>nk,clone:()=>tk,copy:()=>rk,create:()=>ek,decompose:()=>gk,determinant:()=>Hy,equals:()=>Pk,exactEquals:()=>wk,frob:()=>Ek,fromQuat:()=>Ky,fromQuat2:()=>hk,fromRotation:()=>ck,fromRotationTranslation:()=>fv,fromRotationTranslationScale:()=>mk,fromRotationTranslationScaleOrigin:()=>_k,fromScaling:()=>ak,fromTranslation:()=>ok,fromValues:()=>sk,fromXRotation:()=>lk,fromYRotation:()=>uk,fromZRotation:()=>fk,frustum:()=>$y,getRotation:()=>pk,getScaling:()=>hv,getTranslation:()=>dk,identity:()=>uv,invert:()=>zy,lookAt:()=>Qy,mul:()=>Mk,multiply:()=>al,multiplyScalar:()=>vk,multiplyScalarAndAdd:()=>Ck,ortho:()=>Zy,orthoNO:()=>pv,orthoZO:()=>Ak,perspective:()=>Jy,perspectiveFromFieldOfView:()=>xk,perspectiveNO:()=>dv,perspectiveZO:()=>yk,rotate:()=>jy,rotateX:()=>Xy,rotateY:()=>Yy,rotateZ:()=>qy,scale:()=>Wy,set:()=>ik,str:()=>bk,sub:()=>Rk,subtract:()=>gv,targetTo:()=>Tk,translate:()=>Gy,transpose:()=>Vy});function ek(){let t=new we(16);return we!=Float32Array&&(t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0),t[0]=1,t[5]=1,t[10]=1,t[15]=1,t}function tk(t){let e=new we(16);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e[9]=t[9],e[10]=t[10],e[11]=t[11],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15],e}function rk(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t[9]=e[9],t[10]=e[10],t[11]=e[11],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15],t}function sk(t,e,r,s,i,n,o,a,c,l,u,f,h,d,p,g){let m=new we(16);return m[0]=t,m[1]=e,m[2]=r,m[3]=s,m[4]=i,m[5]=n,m[6]=o,m[7]=a,m[8]=c,m[9]=l,m[10]=u,m[11]=f,m[12]=h,m[13]=d,m[14]=p,m[15]=g,m}function ik(t,e,r,s,i,n,o,a,c,l,u,f,h,d,p,g,m){return t[0]=e,t[1]=r,t[2]=s,t[3]=i,t[4]=n,t[5]=o,t[6]=a,t[7]=c,t[8]=l,t[9]=u,t[10]=f,t[11]=h,t[12]=d,t[13]=p,t[14]=g,t[15]=m,t}function uv(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function Vy(t,e){if(t===e){let r=e[1],s=e[2],i=e[3],n=e[6],o=e[7],a=e[11];t[1]=e[4],t[2]=e[8],t[3]=e[12],t[4]=r,t[6]=e[9],t[7]=e[13],t[8]=s,t[9]=n,t[11]=e[14],t[12]=i,t[13]=o,t[14]=a}else t[0]=e[0],t[1]=e[4],t[2]=e[8],t[3]=e[12],t[4]=e[1],t[5]=e[5],t[6]=e[9],t[7]=e[13],t[8]=e[2],t[9]=e[6],t[10]=e[10],t[11]=e[14],t[12]=e[3],t[13]=e[7],t[14]=e[11],t[15]=e[15];return t}function zy(t,e){let r=e[0],s=e[1],i=e[2],n=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8],f=e[9],h=e[10],d=e[11],p=e[12],g=e[13],m=e[14],_=e[15],y=r*a-s*o,x=r*c-i*o,S=r*l-n*o,P=s*c-i*a,B=s*l-n*a,L=i*l-n*c,M=u*g-f*p,v=u*m-h*p,T=u*_-d*p,D=f*m-h*g,V=f*_-d*g,z=h*_-d*m,W=y*z-x*V+S*D+P*T-B*v+L*M;return W?(W=1/W,t[0]=(a*z-c*V+l*D)*W,t[1]=(i*V-s*z-n*D)*W,t[2]=(g*L-m*B+_*P)*W,t[3]=(h*B-f*L-d*P)*W,t[4]=(c*T-o*z-l*v)*W,t[5]=(r*z-i*T+n*v)*W,t[6]=(m*S-p*L-_*x)*W,t[7]=(u*L-h*S+d*x)*W,t[8]=(o*V-a*T+l*M)*W,t[9]=(s*T-r*V-n*M)*W,t[10]=(p*B-g*S+_*y)*W,t[11]=(f*S-u*B-d*y)*W,t[12]=(a*v-o*D-c*M)*W,t[13]=(r*D-s*v+i*M)*W,t[14]=(g*x-p*P-m*y)*W,t[15]=(u*P-f*x+h*y)*W,t):null}function nk(t,e){let r=e[0],s=e[1],i=e[2],n=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8],f=e[9],h=e[10],d=e[11],p=e[12],g=e[13],m=e[14],_=e[15],y=r*a-s*o,x=r*c-i*o,S=r*l-n*o,P=s*c-i*a,B=s*l-n*a,L=i*l-n*c,M=u*g-f*p,v=u*m-h*p,T=u*_-d*p,D=f*m-h*g,V=f*_-d*g,z=h*_-d*m;return t[0]=a*z-c*V+l*D,t[1]=i*V-s*z-n*D,t[2]=g*L-m*B+_*P,t[3]=h*B-f*L-d*P,t[4]=c*T-o*z-l*v,t[5]=r*z-i*T+n*v,t[6]=m*S-p*L-_*x,t[7]=u*L-h*S+d*x,t[8]=o*V-a*T+l*M,t[9]=s*T-r*V-n*M,t[10]=p*B-g*S+_*y,t[11]=f*S-u*B-d*y,t[12]=a*v-o*D-c*M,t[13]=r*D-s*v+i*M,t[14]=g*x-p*P-m*y,t[15]=u*P-f*x+h*y,t}function Hy(t){let e=t[0],r=t[1],s=t[2],i=t[3],n=t[4],o=t[5],a=t[6],c=t[7],l=t[8],u=t[9],f=t[10],h=t[11],d=t[12],p=t[13],g=t[14],m=t[15],_=e*o-r*n,y=e*a-s*n,x=r*a-s*o,S=l*p-u*d,P=l*g-f*d,B=u*g-f*p,L=e*B-r*P+s*S,M=n*B-o*P+a*S,v=l*x-u*y+f*_,T=d*x-p*y+g*_;return c*L-i*M+m*v-h*T}function al(t,e,r){let s=e[0],i=e[1],n=e[2],o=e[3],a=e[4],c=e[5],l=e[6],u=e[7],f=e[8],h=e[9],d=e[10],p=e[11],g=e[12],m=e[13],_=e[14],y=e[15],x=r[0],S=r[1],P=r[2],B=r[3];return t[0]=x*s+S*a+P*f+B*g,t[1]=x*i+S*c+P*h+B*m,t[2]=x*n+S*l+P*d+B*_,t[3]=x*o+S*u+P*p+B*y,x=r[4],S=r[5],P=r[6],B=r[7],t[4]=x*s+S*a+P*f+B*g,t[5]=x*i+S*c+P*h+B*m,t[6]=x*n+S*l+P*d+B*_,t[7]=x*o+S*u+P*p+B*y,x=r[8],S=r[9],P=r[10],B=r[11],t[8]=x*s+S*a+P*f+B*g,t[9]=x*i+S*c+P*h+B*m,t[10]=x*n+S*l+P*d+B*_,t[11]=x*o+S*u+P*p+B*y,x=r[12],S=r[13],P=r[14],B=r[15],t[12]=x*s+S*a+P*f+B*g,t[13]=x*i+S*c+P*h+B*m,t[14]=x*n+S*l+P*d+B*_,t[15]=x*o+S*u+P*p+B*y,t}function Gy(t,e,r){let s=r[0],i=r[1],n=r[2],o,a,c,l,u,f,h,d,p,g,m,_;return e===t?(t[12]=e[0]*s+e[4]*i+e[8]*n+e[12],t[13]=e[1]*s+e[5]*i+e[9]*n+e[13],t[14]=e[2]*s+e[6]*i+e[10]*n+e[14],t[15]=e[3]*s+e[7]*i+e[11]*n+e[15]):(o=e[0],a=e[1],c=e[2],l=e[3],u=e[4],f=e[5],h=e[6],d=e[7],p=e[8],g=e[9],m=e[10],_=e[11],t[0]=o,t[1]=a,t[2]=c,t[3]=l,t[4]=u,t[5]=f,t[6]=h,t[7]=d,t[8]=p,t[9]=g,t[10]=m,t[11]=_,t[12]=o*s+u*i+p*n+e[12],t[13]=a*s+f*i+g*n+e[13],t[14]=c*s+h*i+m*n+e[14],t[15]=l*s+d*i+_*n+e[15]),t}function Wy(t,e,r){let s=r[0],i=r[1],n=r[2];return t[0]=e[0]*s,t[1]=e[1]*s,t[2]=e[2]*s,t[3]=e[3]*s,t[4]=e[4]*i,t[5]=e[5]*i,t[6]=e[6]*i,t[7]=e[7]*i,t[8]=e[8]*n,t[9]=e[9]*n,t[10]=e[10]*n,t[11]=e[11]*n,t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15],t}function jy(t,e,r,s){let i=s[0],n=s[1],o=s[2],a=Math.sqrt(i*i+n*n+o*o),c,l,u,f,h,d,p,g,m,_,y,x,S,P,B,L,M,v,T,D,V,z,W,Z;return a<1e-6?null:(a=1/a,i*=a,n*=a,o*=a,l=Math.sin(r),c=Math.cos(r),u=1-c,f=e[0],h=e[1],d=e[2],p=e[3],g=e[4],m=e[5],_=e[6],y=e[7],x=e[8],S=e[9],P=e[10],B=e[11],L=i*i*u+c,M=n*i*u+o*l,v=o*i*u-n*l,T=i*n*u-o*l,D=n*n*u+c,V=o*n*u+i*l,z=i*o*u+n*l,W=n*o*u-i*l,Z=o*o*u+c,t[0]=f*L+g*M+x*v,t[1]=h*L+m*M+S*v,t[2]=d*L+_*M+P*v,t[3]=p*L+y*M+B*v,t[4]=f*T+g*D+x*V,t[5]=h*T+m*D+S*V,t[6]=d*T+_*D+P*V,t[7]=p*T+y*D+B*V,t[8]=f*z+g*W+x*Z,t[9]=h*z+m*W+S*Z,t[10]=d*z+_*W+P*Z,t[11]=p*z+y*W+B*Z,e!==t&&(t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t)}function Xy(t,e,r){let s=Math.sin(r),i=Math.cos(r),n=e[4],o=e[5],a=e[6],c=e[7],l=e[8],u=e[9],f=e[10],h=e[11];return e!==t&&(t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[4]=n*i+l*s,t[5]=o*i+u*s,t[6]=a*i+f*s,t[7]=c*i+h*s,t[8]=l*i-n*s,t[9]=u*i-o*s,t[10]=f*i-a*s,t[11]=h*i-c*s,t}function Yy(t,e,r){let s=Math.sin(r),i=Math.cos(r),n=e[0],o=e[1],a=e[2],c=e[3],l=e[8],u=e[9],f=e[10],h=e[11];return e!==t&&(t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[0]=n*i-l*s,t[1]=o*i-u*s,t[2]=a*i-f*s,t[3]=c*i-h*s,t[8]=n*s+l*i,t[9]=o*s+u*i,t[10]=a*s+f*i,t[11]=c*s+h*i,t}function qy(t,e,r){let s=Math.sin(r),i=Math.cos(r),n=e[0],o=e[1],a=e[2],c=e[3],l=e[4],u=e[5],f=e[6],h=e[7];return e!==t&&(t[8]=e[8],t[9]=e[9],t[10]=e[10],t[11]=e[11],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[0]=n*i+l*s,t[1]=o*i+u*s,t[2]=a*i+f*s,t[3]=c*i+h*s,t[4]=l*i-n*s,t[5]=u*i-o*s,t[6]=f*i-a*s,t[7]=h*i-c*s,t}function ok(t,e){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=e[0],t[13]=e[1],t[14]=e[2],t[15]=1,t}function ak(t,e){return t[0]=e[0],t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=e[1],t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=e[2],t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function ck(t,e,r){let s=r[0],i=r[1],n=r[2],o=Math.sqrt(s*s+i*i+n*n),a,c,l;return o<1e-6?null:(o=1/o,s*=o,i*=o,n*=o,c=Math.sin(e),a=Math.cos(e),l=1-a,t[0]=s*s*l+a,t[1]=i*s*l+n*c,t[2]=n*s*l-i*c,t[3]=0,t[4]=s*i*l-n*c,t[5]=i*i*l+a,t[6]=n*i*l+s*c,t[7]=0,t[8]=s*n*l+i*c,t[9]=i*n*l-s*c,t[10]=n*n*l+a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t)}function lk(t,e){let r=Math.sin(e),s=Math.cos(e);return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=s,t[6]=r,t[7]=0,t[8]=0,t[9]=-r,t[10]=s,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function uk(t,e){let r=Math.sin(e),s=Math.cos(e);return t[0]=s,t[1]=0,t[2]=-r,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=r,t[9]=0,t[10]=s,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function fk(t,e){let r=Math.sin(e),s=Math.cos(e);return t[0]=s,t[1]=r,t[2]=0,t[3]=0,t[4]=-r,t[5]=s,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function fv(t,e,r){let s=e[0],i=e[1],n=e[2],o=e[3],a=s+s,c=i+i,l=n+n,u=s*a,f=s*c,h=s*l,d=i*c,p=i*l,g=n*l,m=o*a,_=o*c,y=o*l;return t[0]=1-(d+g),t[1]=f+y,t[2]=h-_,t[3]=0,t[4]=f-y,t[5]=1-(u+g),t[6]=p+m,t[7]=0,t[8]=h+_,t[9]=p-m,t[10]=1-(u+d),t[11]=0,t[12]=r[0],t[13]=r[1],t[14]=r[2],t[15]=1,t}function hk(t,e){let r=new we(3),s=-e[0],i=-e[1],n=-e[2],o=e[3],a=e[4],c=e[5],l=e[6],u=e[7],f=s*s+i*i+n*n+o*o;return f>0?(r[0]=(a*o+u*s+c*n-l*i)*2/f,r[1]=(c*o+u*i+l*s-a*n)*2/f,r[2]=(l*o+u*n+a*i-c*s)*2/f):(r[0]=(a*o+u*s+c*n-l*i)*2,r[1]=(c*o+u*i+l*s-a*n)*2,r[2]=(l*o+u*n+a*i-c*s)*2),fv(t,e,r),t}function dk(t,e){return t[0]=e[12],t[1]=e[13],t[2]=e[14],t}function hv(t,e){let r=e[0],s=e[1],i=e[2],n=e[4],o=e[5],a=e[6],c=e[8],l=e[9],u=e[10];return t[0]=Math.sqrt(r*r+s*s+i*i),t[1]=Math.sqrt(n*n+o*o+a*a),t[2]=Math.sqrt(c*c+l*l+u*u),t}function pk(t,e){let r=new we(3);hv(r,e);let s=1/r[0],i=1/r[1],n=1/r[2],o=e[0]*s,a=e[1]*i,c=e[2]*n,l=e[4]*s,u=e[5]*i,f=e[6]*n,h=e[8]*s,d=e[9]*i,p=e[10]*n,g=o+u+p,m=0;return g>0?(m=Math.sqrt(g+1)*2,t[3]=.25*m,t[0]=(f-d)/m,t[1]=(h-c)/m,t[2]=(a-l)/m):o>u&&o>p?(m=Math.sqrt(1+o-u-p)*2,t[3]=(f-d)/m,t[0]=.25*m,t[1]=(a+l)/m,t[2]=(h+c)/m):u>p?(m=Math.sqrt(1+u-o-p)*2,t[3]=(h-c)/m,t[0]=(a+l)/m,t[1]=.25*m,t[2]=(f+d)/m):(m=Math.sqrt(1+p-o-u)*2,t[3]=(a-l)/m,t[0]=(h+c)/m,t[1]=(f+d)/m,t[2]=.25*m),t}function gk(t,e,r,s){e[0]=s[12],e[1]=s[13],e[2]=s[14];let i=s[0],n=s[1],o=s[2],a=s[4],c=s[5],l=s[6],u=s[8],f=s[9],h=s[10];r[0]=Math.sqrt(i*i+n*n+o*o),r[1]=Math.sqrt(a*a+c*c+l*l),r[2]=Math.sqrt(u*u+f*f+h*h);let d=1/r[0],p=1/r[1],g=1/r[2],m=i*d,_=n*p,y=o*g,x=a*d,S=c*p,P=l*g,B=u*d,L=f*p,M=h*g,v=m+S+M,T=0;return v>0?(T=Math.sqrt(v+1)*2,t[3]=.25*T,t[0]=(P-L)/T,t[1]=(B-y)/T,t[2]=(_-x)/T):m>S&&m>M?(T=Math.sqrt(1+m-S-M)*2,t[3]=(P-L)/T,t[0]=.25*T,t[1]=(_+x)/T,t[2]=(B+y)/T):S>M?(T=Math.sqrt(1+S-m-M)*2,t[3]=(B-y)/T,t[0]=(_+x)/T,t[1]=.25*T,t[2]=(P+L)/T):(T=Math.sqrt(1+M-m-S)*2,t[3]=(_-x)/T,t[0]=(B+y)/T,t[1]=(P+L)/T,t[2]=.25*T),t}function mk(t,e,r,s){let i=e[0],n=e[1],o=e[2],a=e[3],c=i+i,l=n+n,u=o+o,f=i*c,h=i*l,d=i*u,p=n*l,g=n*u,m=o*u,_=a*c,y=a*l,x=a*u,S=s[0],P=s[1],B=s[2];return t[0]=(1-(p+m))*S,t[1]=(h+x)*S,t[2]=(d-y)*S,t[3]=0,t[4]=(h-x)*P,t[5]=(1-(f+m))*P,t[6]=(g+_)*P,t[7]=0,t[8]=(d+y)*B,t[9]=(g-_)*B,t[10]=(1-(f+p))*B,t[11]=0,t[12]=r[0],t[13]=r[1],t[14]=r[2],t[15]=1,t}function _k(t,e,r,s,i){let n=e[0],o=e[1],a=e[2],c=e[3],l=n+n,u=o+o,f=a+a,h=n*l,d=n*u,p=n*f,g=o*u,m=o*f,_=a*f,y=c*l,x=c*u,S=c*f,P=s[0],B=s[1],L=s[2],M=i[0],v=i[1],T=i[2],D=(1-(g+_))*P,V=(d+S)*P,z=(p-x)*P,W=(d-S)*B,Z=(1-(h+_))*B,le=(m+y)*B,ie=(p+x)*L,Re=(m-y)*L,ge=(1-(h+g))*L;return t[0]=D,t[1]=V,t[2]=z,t[3]=0,t[4]=W,t[5]=Z,t[6]=le,t[7]=0,t[8]=ie,t[9]=Re,t[10]=ge,t[11]=0,t[12]=r[0]+M-(D*M+W*v+ie*T),t[13]=r[1]+v-(V*M+Z*v+Re*T),t[14]=r[2]+T-(z*M+le*v+ge*T),t[15]=1,t}function Ky(t,e){let r=e[0],s=e[1],i=e[2],n=e[3],o=r+r,a=s+s,c=i+i,l=r*o,u=s*o,f=s*a,h=i*o,d=i*a,p=i*c,g=n*o,m=n*a,_=n*c;return t[0]=1-f-p,t[1]=u+_,t[2]=h-m,t[3]=0,t[4]=u-_,t[5]=1-l-p,t[6]=d+g,t[7]=0,t[8]=h+m,t[9]=d-g,t[10]=1-l-f,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function $y(t,e,r,s,i,n,o){let a=1/(r-e),c=1/(i-s),l=1/(n-o);return t[0]=n*2*a,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=n*2*c,t[6]=0,t[7]=0,t[8]=(r+e)*a,t[9]=(i+s)*c,t[10]=(o+n)*l,t[11]=-1,t[12]=0,t[13]=0,t[14]=o*n*2*l,t[15]=0,t}function dv(t,e,r,s,i){let n=1/Math.tan(e/2);if(t[0]=n/r,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=n,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[11]=-1,t[12]=0,t[13]=0,t[15]=0,i!=null&&i!==1/0){let o=1/(s-i);t[10]=(i+s)*o,t[14]=2*i*s*o}else t[10]=-1,t[14]=-2*s;return t}var Jy=dv;function yk(t,e,r,s,i){let n=1/Math.tan(e/2);if(t[0]=n/r,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=n,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[11]=-1,t[12]=0,t[13]=0,t[15]=0,i!=null&&i!==1/0){let o=1/(s-i);t[10]=i*o,t[14]=i*s*o}else t[10]=-1,t[14]=-s;return t}function xk(t,e,r,s){let i=Math.tan(e.upDegrees*Math.PI/180),n=Math.tan(e.downDegrees*Math.PI/180),o=Math.tan(e.leftDegrees*Math.PI/180),a=Math.tan(e.rightDegrees*Math.PI/180),c=2/(o+a),l=2/(i+n);return t[0]=c,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=l,t[6]=0,t[7]=0,t[8]=-((o-a)*c*.5),t[9]=(i-n)*l*.5,t[10]=s/(r-s),t[11]=-1,t[12]=0,t[13]=0,t[14]=s*r/(r-s),t[15]=0,t}function pv(t,e,r,s,i,n,o){let a=1/(e-r),c=1/(s-i),l=1/(n-o);return t[0]=-2*a,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=-2*c,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=2*l,t[11]=0,t[12]=(e+r)*a,t[13]=(i+s)*c,t[14]=(o+n)*l,t[15]=1,t}var Zy=pv;function Ak(t,e,r,s,i,n,o){let a=1/(e-r),c=1/(s-i),l=1/(n-o);return t[0]=-2*a,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=-2*c,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=l,t[11]=0,t[12]=(e+r)*a,t[13]=(i+s)*c,t[14]=n*l,t[15]=1,t}function Qy(t,e,r,s){let i,n,o,a,c,l,u,f,h,d,p=e[0],g=e[1],m=e[2],_=s[0],y=s[1],x=s[2],S=r[0],P=r[1],B=r[2];return Math.abs(p-S)<1e-6&&Math.abs(g-P)<1e-6&&Math.abs(m-B)<1e-6?uv(t):(f=p-S,h=g-P,d=m-B,i=1/Math.sqrt(f*f+h*h+d*d),f*=i,h*=i,d*=i,n=y*d-x*h,o=x*f-_*d,a=_*h-y*f,i=Math.sqrt(n*n+o*o+a*a),i?(i=1/i,n*=i,o*=i,a*=i):(n=0,o=0,a=0),c=h*a-d*o,l=d*n-f*a,u=f*o-h*n,i=Math.sqrt(c*c+l*l+u*u),i?(i=1/i,c*=i,l*=i,u*=i):(c=0,l=0,u=0),t[0]=n,t[1]=c,t[2]=f,t[3]=0,t[4]=o,t[5]=l,t[6]=h,t[7]=0,t[8]=a,t[9]=u,t[10]=d,t[11]=0,t[12]=-(n*p+o*g+a*m),t[13]=-(c*p+l*g+u*m),t[14]=-(f*p+h*g+d*m),t[15]=1,t)}function Tk(t,e,r,s){let i=e[0],n=e[1],o=e[2],a=s[0],c=s[1],l=s[2],u=i-r[0],f=n-r[1],h=o-r[2],d=u*u+f*f+h*h;d>0&&(d=1/Math.sqrt(d),u*=d,f*=d,h*=d);let p=c*h-l*f,g=l*u-a*h,m=a*f-c*u;return d=p*p+g*g+m*m,d>0&&(d=1/Math.sqrt(d),p*=d,g*=d,m*=d),t[0]=p,t[1]=g,t[2]=m,t[3]=0,t[4]=f*m-h*g,t[5]=h*p-u*m,t[6]=u*g-f*p,t[7]=0,t[8]=u,t[9]=f,t[10]=h,t[11]=0,t[12]=i,t[13]=n,t[14]=o,t[15]=1,t}function bk(t){return`mat4(${t[0]}, ${t[1]}, ${t[2]}, ${t[3]}, ${t[4]}, ${t[5]}, ${t[6]}, ${t[7]}, ${t[8]}, ${t[9]}, ${t[10]}, ${t[11]}, ${t[12]}, ${t[13]}, ${t[14]}, ${t[15]})`}function Ek(t){return Math.sqrt(t[0]*t[0]+t[1]*t[1]+t[2]*t[2]+t[3]*t[3]+t[4]*t[4]+t[5]*t[5]+t[6]*t[6]+t[7]*t[7]+t[8]*t[8]+t[9]*t[9]+t[10]*t[10]+t[11]*t[11]+t[12]*t[12]+t[13]*t[13]+t[14]*t[14]+t[15]*t[15])}function Sk(t,e,r){return t[0]=e[0]+r[0],t[1]=e[1]+r[1],t[2]=e[2]+r[2],t[3]=e[3]+r[3],t[4]=e[4]+r[4],t[5]=e[5]+r[5],t[6]=e[6]+r[6],t[7]=e[7]+r[7],t[8]=e[8]+r[8],t[9]=e[9]+r[9],t[10]=e[10]+r[10],t[11]=e[11]+r[11],t[12]=e[12]+r[12],t[13]=e[13]+r[13],t[14]=e[14]+r[14],t[15]=e[15]+r[15],t}function gv(t,e,r){return t[0]=e[0]-r[0],t[1]=e[1]-r[1],t[2]=e[2]-r[2],t[3]=e[3]-r[3],t[4]=e[4]-r[4],t[5]=e[5]-r[5],t[6]=e[6]-r[6],t[7]=e[7]-r[7],t[8]=e[8]-r[8],t[9]=e[9]-r[9],t[10]=e[10]-r[10],t[11]=e[11]-r[11],t[12]=e[12]-r[12],t[13]=e[13]-r[13],t[14]=e[14]-r[14],t[15]=e[15]-r[15],t}function vk(t,e,r){return t[0]=e[0]*r,t[1]=e[1]*r,t[2]=e[2]*r,t[3]=e[3]*r,t[4]=e[4]*r,t[5]=e[5]*r,t[6]=e[6]*r,t[7]=e[7]*r,t[8]=e[8]*r,t[9]=e[9]*r,t[10]=e[10]*r,t[11]=e[11]*r,t[12]=e[12]*r,t[13]=e[13]*r,t[14]=e[14]*r,t[15]=e[15]*r,t}function Ck(t,e,r,s){return t[0]=e[0]+r[0]*s,t[1]=e[1]+r[1]*s,t[2]=e[2]+r[2]*s,t[3]=e[3]+r[3]*s,t[4]=e[4]+r[4]*s,t[5]=e[5]+r[5]*s,t[6]=e[6]+r[6]*s,t[7]=e[7]+r[7]*s,t[8]=e[8]+r[8]*s,t[9]=e[9]+r[9]*s,t[10]=e[10]+r[10]*s,t[11]=e[11]+r[11]*s,t[12]=e[12]+r[12]*s,t[13]=e[13]+r[13]*s,t[14]=e[14]+r[14]*s,t[15]=e[15]+r[15]*s,t}function wk(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]&&t[3]===e[3]&&t[4]===e[4]&&t[5]===e[5]&&t[6]===e[6]&&t[7]===e[7]&&t[8]===e[8]&&t[9]===e[9]&&t[10]===e[10]&&t[11]===e[11]&&t[12]===e[12]&&t[13]===e[13]&&t[14]===e[14]&&t[15]===e[15]}function Pk(t,e){let r=t[0],s=t[1],i=t[2],n=t[3],o=t[4],a=t[5],c=t[6],l=t[7],u=t[8],f=t[9],h=t[10],d=t[11],p=t[12],g=t[13],m=t[14],_=t[15],y=e[0],x=e[1],S=e[2],P=e[3],B=e[4],L=e[5],M=e[6],v=e[7],T=e[8],D=e[9],V=e[10],z=e[11],W=e[12],Z=e[13],le=e[14],ie=e[15];return Math.abs(r-y)<=1e-6*Math.max(1,Math.abs(r),Math.abs(y))&&Math.abs(s-x)<=1e-6*Math.max(1,Math.abs(s),Math.abs(x))&&Math.abs(i-S)<=1e-6*Math.max(1,Math.abs(i),Math.abs(S))&&Math.abs(n-P)<=1e-6*Math.max(1,Math.abs(n),Math.abs(P))&&Math.abs(o-B)<=1e-6*Math.max(1,Math.abs(o),Math.abs(B))&&Math.abs(a-L)<=1e-6*Math.max(1,Math.abs(a),Math.abs(L))&&Math.abs(c-M)<=1e-6*Math.max(1,Math.abs(c),Math.abs(M))&&Math.abs(l-v)<=1e-6*Math.max(1,Math.abs(l),Math.abs(v))&&Math.abs(u-T)<=1e-6*Math.max(1,Math.abs(u),Math.abs(T))&&Math.abs(f-D)<=1e-6*Math.max(1,Math.abs(f),Math.abs(D))&&Math.abs(h-V)<=1e-6*Math.max(1,Math.abs(h),Math.abs(V))&&Math.abs(d-z)<=1e-6*Math.max(1,Math.abs(d),Math.abs(z))&&Math.abs(p-W)<=1e-6*Math.max(1,Math.abs(p),Math.abs(W))&&Math.abs(g-Z)<=1e-6*Math.max(1,Math.abs(g),Math.abs(Z))&&Math.abs(m-le)<=1e-6*Math.max(1,Math.abs(m),Math.abs(le))&&Math.abs(_-ie)<=1e-6*Math.max(1,Math.abs(_),Math.abs(ie))}var Mk=al,Rk=gv;var It={};Ke(It,{add:()=>ex,ceil:()=>Ik,clone:()=>_v,copy:()=>xv,create:()=>mv,cross:()=>kk,dist:()=>Yk,distance:()=>Sv,div:()=>Xk,divide:()=>Ev,dot:()=>sx,equals:()=>Gk,exactEquals:()=>Cv,floor:()=>Bk,forEach:()=>Jk,fromValues:()=>yv,inverse:()=>Uk,len:()=>Kk,length:()=>Md,lerp:()=>ix,max:()=>Fk,min:()=>Ok,mul:()=>jk,multiply:()=>bv,negate:()=>Dk,normalize:()=>rx,random:()=>Vk,round:()=>Lk,scale:()=>tx,scaleAndAdd:()=>Nk,set:()=>Av,sqrDist:()=>qk,sqrLen:()=>$k,squaredDistance:()=>vv,squaredLength:()=>Rd,str:()=>Hk,sub:()=>Wk,subtract:()=>Tv,transformMat4:()=>nx,transformQuat:()=>ox,zero:()=>zk});function mv(){let t=new we(4);return we!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0,t[3]=0),t}function _v(t){let e=new we(4);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e}function yv(t,e,r,s){let i=new we(4);return i[0]=t,i[1]=e,i[2]=r,i[3]=s,i}function xv(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t}function Av(t,e,r,s,i){return t[0]=e,t[1]=r,t[2]=s,t[3]=i,t}function ex(t,e,r){return t[0]=e[0]+r[0],t[1]=e[1]+r[1],t[2]=e[2]+r[2],t[3]=e[3]+r[3],t}function Tv(t,e,r){return t[0]=e[0]-r[0],t[1]=e[1]-r[1],t[2]=e[2]-r[2],t[3]=e[3]-r[3],t}function bv(t,e,r){return t[0]=e[0]*r[0],t[1]=e[1]*r[1],t[2]=e[2]*r[2],t[3]=e[3]*r[3],t}function Ev(t,e,r){return t[0]=e[0]/r[0],t[1]=e[1]/r[1],t[2]=e[2]/r[2],t[3]=e[3]/r[3],t}function Ik(t,e){return t[0]=Math.ceil(e[0]),t[1]=Math.ceil(e[1]),t[2]=Math.ceil(e[2]),t[3]=Math.ceil(e[3]),t}function Bk(t,e){return t[0]=Math.floor(e[0]),t[1]=Math.floor(e[1]),t[2]=Math.floor(e[2]),t[3]=Math.floor(e[3]),t}function Ok(t,e,r){return t[0]=Math.min(e[0],r[0]),t[1]=Math.min(e[1],r[1]),t[2]=Math.min(e[2],r[2]),t[3]=Math.min(e[3],r[3]),t}function Fk(t,e,r){return t[0]=Math.max(e[0],r[0]),t[1]=Math.max(e[1],r[1]),t[2]=Math.max(e[2],r[2]),t[3]=Math.max(e[3],r[3]),t}function Lk(t,e){return t[0]=fr(e[0]),t[1]=fr(e[1]),t[2]=fr(e[2]),t[3]=fr(e[3]),t}function tx(t,e,r){return t[0]=e[0]*r,t[1]=e[1]*r,t[2]=e[2]*r,t[3]=e[3]*r,t}function Nk(t,e,r,s){return t[0]=e[0]+r[0]*s,t[1]=e[1]+r[1]*s,t[2]=e[2]+r[2]*s,t[3]=e[3]+r[3]*s,t}function Sv(t,e){let r=e[0]-t[0],s=e[1]-t[1],i=e[2]-t[2],n=e[3]-t[3];return Math.sqrt(r*r+s*s+i*i+n*n)}function vv(t,e){let r=e[0]-t[0],s=e[1]-t[1],i=e[2]-t[2],n=e[3]-t[3];return r*r+s*s+i*i+n*n}function Md(t){let e=t[0],r=t[1],s=t[2],i=t[3];return Math.sqrt(e*e+r*r+s*s+i*i)}function Rd(t){let e=t[0],r=t[1],s=t[2],i=t[3];return e*e+r*r+s*s+i*i}function Dk(t,e){return t[0]=-e[0],t[1]=-e[1],t[2]=-e[2],t[3]=-e[3],t}function Uk(t,e){return t[0]=1/e[0],t[1]=1/e[1],t[2]=1/e[2],t[3]=1/e[3],t}function rx(t,e){let r=e[0],s=e[1],i=e[2],n=e[3],o=r*r+s*s+i*i+n*n;return o>0&&(o=1/Math.sqrt(o)),t[0]=r*o,t[1]=s*o,t[2]=i*o,t[3]=n*o,t}function sx(t,e){return t[0]*e[0]+t[1]*e[1]+t[2]*e[2]+t[3]*e[3]}function kk(t,e,r,s){let i=r[0]*s[1]-r[1]*s[0],n=r[0]*s[2]-r[2]*s[0],o=r[0]*s[3]-r[3]*s[0],a=r[1]*s[2]-r[2]*s[1],c=r[1]*s[3]-r[3]*s[1],l=r[2]*s[3]-r[3]*s[2],u=e[0],f=e[1],h=e[2],d=e[3];return t[0]=f*l-h*c+d*a,t[1]=-(u*l)+h*o-d*n,t[2]=u*c-f*o+d*i,t[3]=-(u*a)+f*n-h*i,t}function ix(t,e,r,s){let i=e[0],n=e[1],o=e[2],a=e[3];return t[0]=i+s*(r[0]-i),t[1]=n+s*(r[1]-n),t[2]=o+s*(r[2]-o),t[3]=a+s*(r[3]-a),t}function Vk(t,e){e=e===void 0?1:e;let r,s,i,n,o,a;do r=fs()*2-1,s=fs()*2-1,o=r*r+s*s;while(o>=1);do i=fs()*2-1,n=fs()*2-1,a=i*i+n*n;while(a>=1);let c=Math.sqrt((1-o)/a);return t[0]=e*r,t[1]=e*s,t[2]=e*i*c,t[3]=e*n*c,t}function nx(t,e,r){let s=e[0],i=e[1],n=e[2],o=e[3];return t[0]=r[0]*s+r[4]*i+r[8]*n+r[12]*o,t[1]=r[1]*s+r[5]*i+r[9]*n+r[13]*o,t[2]=r[2]*s+r[6]*i+r[10]*n+r[14]*o,t[3]=r[3]*s+r[7]*i+r[11]*n+r[15]*o,t}function ox(t,e,r){let s=e[0],i=e[1],n=e[2],o=r[0],a=r[1],c=r[2],l=r[3],u=l*s+a*n-c*i,f=l*i+c*s-o*n,h=l*n+o*i-a*s,d=-o*s-a*i-c*n;return t[0]=u*l+d*-o+f*-c-h*-a,t[1]=f*l+d*-a+h*-o-u*-c,t[2]=h*l+d*-c+u*-a-f*-o,t[3]=e[3],t}function zk(t){return t[0]=0,t[1]=0,t[2]=0,t[3]=0,t}function Hk(t){return`vec4(${t[0]}, ${t[1]}, ${t[2]}, ${t[3]})`}function Cv(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]&&t[3]===e[3]}function Gk(t,e){let r=t[0],s=t[1],i=t[2],n=t[3],o=e[0],a=e[1],c=e[2],l=e[3];return Math.abs(r-o)<=1e-6*Math.max(1,Math.abs(r),Math.abs(o))&&Math.abs(s-a)<=1e-6*Math.max(1,Math.abs(s),Math.abs(a))&&Math.abs(i-c)<=1e-6*Math.max(1,Math.abs(i),Math.abs(c))&&Math.abs(n-l)<=1e-6*Math.max(1,Math.abs(n),Math.abs(l))}var Wk=Tv,jk=bv,Xk=Ev,Yk=Sv,qk=vv,Kk=Md,$k=Rd,Jk=function(){let t=mv();return function(e,r,s,i,n,o){let a,c;for(r||(r=4),s||(s=0),i?c=Math.min(i*r+s,e.length):c=e.length,a=s;a<c;a+=r)t[0]=e[a],t[1]=e[a+1],t[2]=e[a+2],t[3]=e[a+3],n(t,t,o),e[a]=t[0],e[a+1]=t[1],e[a+2]=t[2],e[a+3]=t[3];return e}}();var lx;(function(t){t[t.COL0ROW0=0]="COL0ROW0",t[t.COL0ROW1=1]="COL0ROW1",t[t.COL0ROW2=2]="COL0ROW2",t[t.COL0ROW3=3]="COL0ROW3",t[t.COL1ROW0=4]="COL1ROW0",t[t.COL1ROW1=5]="COL1ROW1",t[t.COL1ROW2=6]="COL1ROW2",t[t.COL1ROW3=7]="COL1ROW3",t[t.COL2ROW0=8]="COL2ROW0",t[t.COL2ROW1=9]="COL2ROW1",t[t.COL2ROW2=10]="COL2ROW2",t[t.COL2ROW3=11]="COL2ROW3",t[t.COL3ROW0=12]="COL3ROW0",t[t.COL3ROW1=13]="COL3ROW1",t[t.COL3ROW2=14]="COL3ROW2",t[t.COL3ROW3=15]="COL3ROW3"})(lx||(lx={}));var Zk=45*Math.PI/180,Qk=1,ax=.1,cx=500,e6=Object.freeze([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),q=class extends Ho{static get IDENTITY(){return r6()}static get ZERO(){return t6()}get ELEMENTS(){return 16}get RANK(){return 4}get INDICES(){return lx}constructor(e){super(-0,-0,-0,-0,-0,-0,-0,-0,-0,-0,-0,-0,-0,-0,-0,-0),arguments.length===1&&Array.isArray(e)?this.copy(e):this.identity()}copy(e){return this[0]=e[0],this[1]=e[1],this[2]=e[2],this[3]=e[3],this[4]=e[4],this[5]=e[5],this[6]=e[6],this[7]=e[7],this[8]=e[8],this[9]=e[9],this[10]=e[10],this[11]=e[11],this[12]=e[12],this[13]=e[13],this[14]=e[14],this[15]=e[15],this.check()}set(e,r,s,i,n,o,a,c,l,u,f,h,d,p,g,m){return this[0]=e,this[1]=r,this[2]=s,this[3]=i,this[4]=n,this[5]=o,this[6]=a,this[7]=c,this[8]=l,this[9]=u,this[10]=f,this[11]=h,this[12]=d,this[13]=p,this[14]=g,this[15]=m,this.check()}setRowMajor(e,r,s,i,n,o,a,c,l,u,f,h,d,p,g,m){return this[0]=e,this[1]=n,this[2]=l,this[3]=d,this[4]=r,this[5]=o,this[6]=u,this[7]=p,this[8]=s,this[9]=a,this[10]=f,this[11]=g,this[12]=i,this[13]=c,this[14]=h,this[15]=m,this.check()}toRowMajor(e){return e[0]=this[0],e[1]=this[4],e[2]=this[8],e[3]=this[12],e[4]=this[1],e[5]=this[5],e[6]=this[9],e[7]=this[13],e[8]=this[2],e[9]=this[6],e[10]=this[10],e[11]=this[14],e[12]=this[3],e[13]=this[7],e[14]=this[11],e[15]=this[15],e}identity(){return this.copy(e6)}fromObject(e){return this.check()}fromQuaternion(e){return Ky(this,e),this.check()}frustum(e){let{left:r,right:s,bottom:i,top:n,near:o=ax,far:a=cx}=e;return a===1/0?s6(this,r,s,i,n,o):$y(this,r,s,i,n,o,a),this.check()}lookAt(e){let{eye:r,center:s=[0,0,0],up:i=[0,1,0]}=e;return Qy(this,r,s,i),this.check()}ortho(e){let{left:r,right:s,bottom:i,top:n,near:o=ax,far:a=cx}=e;return Zy(this,r,s,i,n,o,a),this.check()}orthographic(e){let{fovy:r=Zk,aspect:s=Qk,focalDistance:i=1,near:n=ax,far:o=cx}=e;wv(r);let a=r/2,c=i*Math.tan(a),l=c*s;return this.ortho({left:-l,right:l,bottom:-c,top:c,near:n,far:o})}perspective(e){let{fovy:r=45*Math.PI/180,aspect:s=1,near:i=.1,far:n=500}=e;return wv(r),Jy(this,r,s,i,n),this.check()}determinant(){return Hy(this)}getScale(e=[-0,-0,-0]){return e[0]=Math.sqrt(this[0]*this[0]+this[1]*this[1]+this[2]*this[2]),e[1]=Math.sqrt(this[4]*this[4]+this[5]*this[5]+this[6]*this[6]),e[2]=Math.sqrt(this[8]*this[8]+this[9]*this[9]+this[10]*this[10]),e}getTranslation(e=[-0,-0,-0]){return e[0]=this[12],e[1]=this[13],e[2]=this[14],e}getRotation(e,r){e=e||[-0,-0,-0,-0,-0,-0,-0,-0,-0,-0,-0,-0,-0,-0,-0,-0],r=r||[-0,-0,-0];let s=this.getScale(r),i=1/s[0],n=1/s[1],o=1/s[2];return e[0]=this[0]*i,e[1]=this[1]*n,e[2]=this[2]*o,e[3]=0,e[4]=this[4]*i,e[5]=this[5]*n,e[6]=this[6]*o,e[7]=0,e[8]=this[8]*i,e[9]=this[9]*n,e[10]=this[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}getRotationMatrix3(e,r){e=e||[-0,-0,-0,-0,-0,-0,-0,-0,-0],r=r||[-0,-0,-0];let s=this.getScale(r),i=1/s[0],n=1/s[1],o=1/s[2];return e[0]=this[0]*i,e[1]=this[1]*n,e[2]=this[2]*o,e[3]=this[4]*i,e[4]=this[5]*n,e[5]=this[6]*o,e[6]=this[8]*i,e[7]=this[9]*n,e[8]=this[10]*o,e}transpose(){return Vy(this,this),this.check()}invert(){return zy(this,this),this.check()}multiplyLeft(e){return al(this,e,this),this.check()}multiplyRight(e){return al(this,this,e),this.check()}rotateX(e){return Xy(this,this,e),this.check()}rotateY(e){return Yy(this,this,e),this.check()}rotateZ(e){return qy(this,this,e),this.check()}rotateXYZ(e){return this.rotateX(e[0]).rotateY(e[1]).rotateZ(e[2])}rotateAxis(e,r){return jy(this,this,e,r),this.check()}scale(e){return Wy(this,this,Array.isArray(e)?e:[e,e,e]),this.check()}translate(e){return Gy(this,this,e),this.check()}transform(e,r){return e.length===4?(r=nx(r||[-0,-0,-0,-0],e,this),Ei(r,4),r):this.transformAsPoint(e,r)}transformAsPoint(e,r){let{length:s}=e,i;switch(s){case 2:i=sl(r||[-0,-0],e,this);break;case 3:i=xn(r||[-0,-0,-0],e,this);break;default:throw new Error("Illegal vector")}return Ei(i,e.length),i}transformAsVector(e,r){let s;switch(e.length){case 2:s=xd(r||[-0,-0],e,this);break;case 3:s=Ad(r||[-0,-0,-0],e,this);break;default:throw new Error("Illegal vector")}return Ei(s,e.length),s}transformPoint(e,r){return this.transformAsPoint(e,r)}transformVector(e,r){return this.transformAsPoint(e,r)}transformDirection(e,r){return this.transformAsVector(e,r)}makeRotationX(e){return this.identity().rotateX(e)}makeTranslation(e,r,s){return this.identity().translate([e,r,s])}},Id,Bd;function t6(){return Id||(Id=new q([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),Object.freeze(Id)),Id}function r6(){return Bd||(Bd=new q,Object.freeze(Bd)),Bd}function wv(t){if(t>Math.PI*2)throw Error("expected radians")}function s6(t,e,r,s,i,n){let o=2*n/(r-e),a=2*n/(i-s),c=(r+e)/(r-e),l=(i+s)/(i-s),u=-1,f=-1,h=-2*n;return t[0]=o,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=a,t[6]=0,t[7]=0,t[8]=c,t[9]=l,t[10]=u,t[11]=f,t[12]=0,t[13]=0,t[14]=h,t[15]=0,t}function Pv(){let t=new we(4);return we!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0),t[3]=1,t}function Mv(t){return t[0]=0,t[1]=0,t[2]=0,t[3]=1,t}function ux(t,e,r){r=r*.5;let s=Math.sin(r);return t[0]=s*e[0],t[1]=s*e[1],t[2]=s*e[2],t[3]=Math.cos(r),t}function fx(t,e,r){let s=e[0],i=e[1],n=e[2],o=e[3],a=r[0],c=r[1],l=r[2],u=r[3];return t[0]=s*u+o*a+i*l-n*c,t[1]=i*u+o*c+n*a-s*l,t[2]=n*u+o*l+s*c-i*a,t[3]=o*u-s*a-i*c-n*l,t}function Rv(t,e,r){r*=.5;let s=e[0],i=e[1],n=e[2],o=e[3],a=Math.sin(r),c=Math.cos(r);return t[0]=s*c+o*a,t[1]=i*c+n*a,t[2]=n*c-i*a,t[3]=o*c-s*a,t}function Iv(t,e,r){r*=.5;let s=e[0],i=e[1],n=e[2],o=e[3],a=Math.sin(r),c=Math.cos(r);return t[0]=s*c-n*a,t[1]=i*c+o*a,t[2]=n*c+s*a,t[3]=o*c-i*a,t}function Bv(t,e,r){r*=.5;let s=e[0],i=e[1],n=e[2],o=e[3],a=Math.sin(r),c=Math.cos(r);return t[0]=s*c+i*a,t[1]=i*c-s*a,t[2]=n*c+o*a,t[3]=o*c-n*a,t}function Ov(t,e){let r=e[0],s=e[1],i=e[2];return t[0]=r,t[1]=s,t[2]=i,t[3]=Math.sqrt(Math.abs(1-r*r-s*s-i*i)),t}function cl(t,e,r,s){let i=e[0],n=e[1],o=e[2],a=e[3],c=r[0],l=r[1],u=r[2],f=r[3],h,d,p,g,m;return h=i*c+n*l+o*u+a*f,h<0&&(h=-h,c=-c,l=-l,u=-u,f=-f),1-h>1e-6?(d=Math.acos(h),m=Math.sin(d),p=Math.sin((1-s)*d)/m,g=Math.sin(s*d)/m):(p=1-s,g=s),t[0]=p*i+g*c,t[1]=p*n+g*l,t[2]=p*o+g*u,t[3]=p*a+g*f,t}function Fv(t,e){let r=e[0],s=e[1],i=e[2],n=e[3],o=r*r+s*s+i*i+n*n,a=o?1/o:0;return t[0]=-r*a,t[1]=-s*a,t[2]=-i*a,t[3]=n*a,t}function Lv(t,e){return t[0]=-e[0],t[1]=-e[1],t[2]=-e[2],t[3]=e[3],t}function hx(t,e){let r=e[0]+e[4]+e[8],s;if(r>0)s=Math.sqrt(r+1),t[3]=.5*s,s=.5/s,t[0]=(e[5]-e[7])*s,t[1]=(e[6]-e[2])*s,t[2]=(e[1]-e[3])*s;else{let i=0;e[4]>e[0]&&(i=1),e[8]>e[i*3+i]&&(i=2);let n=(i+1)%3,o=(i+2)%3;s=Math.sqrt(e[i*3+i]-e[n*3+n]-e[o*3+o]+1),t[i]=.5*s,s=.5/s,t[3]=(e[n*3+o]-e[o*3+n])*s,t[n]=(e[n*3+i]+e[i*3+n])*s,t[o]=(e[o*3+i]+e[i*3+o])*s}return t}var Nv=ex;var Dv=tx,Uv=sx,kv=ix,Vv=Md;var zv=Rd;var Hv=rx;var Gv=function(){let t=bd(),e=Sd(1,0,0),r=Sd(0,1,0);return function(s,i,n){let o=il(i,n);return o<-.999999?(yn(t,e,i),Ly(t)<1e-6&&yn(t,r,i),Ry(t,t),ux(s,t,Math.PI),s):o>.999999?(s[0]=0,s[1]=0,s[2]=0,s[3]=1,s):(yn(t,i,n),s[0]=t[0],s[1]=t[1],s[2]=t[2],s[3]=1+o,Hv(s,s))}}(),$ce=function(){let t=Pv(),e=Pv();return function(r,s,i,n,o,a){return cl(t,s,o,a),cl(e,i,n,a),cl(r,t,e,2*a*(1-a)),r}}(),Jce=function(){let t=sv();return function(e,r,s,i){return t[0]=s[0],t[3]=s[1],t[6]=s[2],t[1]=i[0],t[4]=i[1],t[7]=i[2],t[2]=-r[0],t[5]=-r[1],t[8]=-r[2],Hv(e,hx(e,t))}}();var i6=[0,0,0,1],hr=class extends bi{constructor(e=0,r=0,s=0,i=1){super(-0,-0,-0,-0),Array.isArray(e)&&arguments.length===1?this.copy(e):this.set(e,r,s,i)}copy(e){return this[0]=e[0],this[1]=e[1],this[2]=e[2],this[3]=e[3],this.check()}set(e,r,s,i){return this[0]=e,this[1]=r,this[2]=s,this[3]=i,this.check()}fromObject(e){return this[0]=e.x,this[1]=e.y,this[2]=e.z,this[3]=e.w,this.check()}fromMatrix3(e){return hx(this,e),this.check()}fromAxisRotation(e,r){return ux(this,e,r),this.check()}identity(){return Mv(this),this.check()}setAxisAngle(e,r){return this.fromAxisRotation(e,r)}get ELEMENTS(){return 4}get x(){return this[0]}set x(e){this[0]=ce(e)}get y(){return this[1]}set y(e){this[1]=ce(e)}get z(){return this[2]}set z(e){this[2]=ce(e)}get w(){return this[3]}set w(e){this[3]=ce(e)}len(){return Vv(this)}lengthSquared(){return zv(this)}dot(e){return Uv(this,e)}rotationTo(e,r){return Gv(this,e,r),this.check()}add(e){return Nv(this,this,e),this.check()}calculateW(){return Ov(this,this),this.check()}conjugate(){return Lv(this,this),this.check()}invert(){return Fv(this,this),this.check()}lerp(e,r,s){return s===void 0?this.lerp(this,e,r):(kv(this,e,r,s),this.check())}multiplyRight(e){return fx(this,this,e),this.check()}multiplyLeft(e){return fx(this,e,this),this.check()}normalize(){let e=this.len(),r=e>0?1/e:0;return this[0]=this[0]*r,this[1]=this[1]*r,this[2]=this[2]*r,this[3]=this[3]*r,e===0&&(this[3]=1),this.check()}rotateX(e){return Rv(this,this,e),this.check()}rotateY(e){return Iv(this,this,e),this.check()}rotateZ(e){return Bv(this,this,e),this.check()}scale(e){return Dv(this,this,e),this.check()}slerp(e,r,s){let i,n,o;switch(arguments.length){case 1:({start:i=i6,target:n,ratio:o}=e);break;case 2:i=this,n=e,o=r;break;default:i=e,n=r,o=s}return cl(this,i,n,o),this.check()}transformVector4(e,r=new zo){return ox(r,e,this),Ei(r,4)}lengthSq(){return this.lengthSquared()}setFromAxisAngle(e,r){return this.setAxisAngle(e,r)}premultiply(e){return this.multiplyLeft(e)}multiply(e){return this.multiplyRight(e)}};var Wv=1e-6,n6=6371e3,Or=class{constructor({phi:e=0,theta:r=0,radius:s=1,bearing:i,pitch:n,altitude:o,radiusScale:a=n6}={}){this.phi=e,this.theta=r,this.radius=s||o||1,this.radiusScale=a||1,i!==void 0&&(this.bearing=i),n!==void 0&&(this.pitch=n),this.check()}toString(){return this.formatString(Se)}formatString({printTypes:e=!1}){let r=tl;return`${e?"Spherical":""}[rho:${r(this.radius)},theta:${r(this.theta)},phi:${r(this.phi)}]`}equals(e){return Ce(this.radius,e.radius)&&Ce(this.theta,e.theta)&&Ce(this.phi,e.phi)}exactEquals(e){return this.radius===e.radius&&this.theta===e.theta&&this.phi===e.phi}get bearing(){return 180-Je(this.phi)}set bearing(e){this.phi=Math.PI-_n(e)}get pitch(){return Je(this.theta)}set pitch(e){this.theta=_n(e)}get longitude(){return Je(this.phi)}get latitude(){return Je(this.theta)}get lng(){return Je(this.phi)}get lat(){return Je(this.theta)}get z(){return(this.radius-1)*this.radiusScale}set(e,r,s){return this.radius=e,this.phi=r,this.theta=s,this.check()}clone(){return new Or().copy(this)}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this.check()}fromLngLatZ([e,r,s]){return this.radius=1+s/this.radiusScale,this.phi=_n(r),this.theta=_n(e),this.check()}fromVector3(e){return this.radius=Ed(e),this.radius>0&&(this.theta=Math.atan2(e[0],e[1]),this.phi=Math.acos(fe(e[2]/this.radius,-1,1))),this.check()}toVector3(){return new w(0,0,this.radius).rotateX({radians:this.theta}).rotateZ({radians:this.phi})}makeSafe(){return this.phi=Math.max(Wv,Math.min(Math.PI-Wv,this.phi)),this}check(){if(!Number.isFinite(this.phi)||!Number.isFinite(this.theta)||!(this.radius>0))throw new Error("SphericalCoordinates: some fields set to invalid numbers");return this}};var dr={};Ke(dr,{EPSILON1:()=>o6,EPSILON10:()=>g6,EPSILON11:()=>m6,EPSILON12:()=>_6,EPSILON13:()=>y6,EPSILON14:()=>x6,EPSILON15:()=>A6,EPSILON16:()=>T6,EPSILON17:()=>b6,EPSILON18:()=>E6,EPSILON19:()=>S6,EPSILON2:()=>a6,EPSILON20:()=>v6,EPSILON3:()=>c6,EPSILON4:()=>l6,EPSILON5:()=>u6,EPSILON6:()=>f6,EPSILON7:()=>h6,EPSILON8:()=>d6,EPSILON9:()=>p6,PI_OVER_FOUR:()=>w6,PI_OVER_SIX:()=>P6,PI_OVER_TWO:()=>C6,TWO_PI:()=>M6});var o6=.1,a6=.01,c6=.001,l6=1e-4,u6=1e-5,f6=1e-6,h6=1e-7,d6=1e-8,p6=1e-9,g6=1e-10,m6=1e-11,_6=1e-12,y6=1e-13,x6=1e-14,A6=1e-15,T6=1e-16,b6=1e-17,E6=1e-18,S6=1e-19,v6=1e-20,C6=Math.PI/2,w6=Math.PI/4,P6=Math.PI/6,M6=Math.PI*2;var dx=`#if (defined(SHADER_TYPE_FRAGMENT) && defined(LIGHTING_FRAGMENT)) || (defined(SHADER_TYPE_VERTEX) && defined(LIGHTING_VERTEX))
struct AmbientLight {
vec3 color;
};
struct PointLight {
vec3 color;
vec3 position;
vec3 attenuation;
};
struct DirectionalLight {
vec3 color;
vec3 direction;
};
uniform AmbientLight lighting_uAmbientLight;
uniform PointLight lighting_uPointLight[MAX_LIGHTS];
uniform DirectionalLight lighting_uDirectionalLight[MAX_LIGHTS];
uniform int lighting_uPointLightCount;
uniform int lighting_uDirectionalLightCount;
uniform bool lighting_uEnabled;
float getPointLightAttenuation(PointLight pointLight, float distance) {
return pointLight.attenuation.x
+ pointLight.attenuation.y * distance
+ pointLight.attenuation.z * distance * distance;
}
#endif
`;var R6={lightSources:{}};function px(t={}){let{color:e=[0,0,0],intensity:r=1}=t;return e.map(s=>s*r/255)}function I6({ambientLight:t,pointLights:e=[],directionalLights:r=[]}){let s={};return t?s["lighting_uAmbientLight.color"]=px(t):s["lighting_uAmbientLight.color"]=[0,0,0],e.forEach((i,n)=>{s[`lighting_uPointLight[${n}].color`]=px(i),s[`lighting_uPointLight[${n}].position`]=i.position,s[`lighting_uPointLight[${n}].attenuation`]=i.attenuation||[1,0,0]}),s.lighting_uPointLightCount=e.length,r.forEach((i,n)=>{s[`lighting_uDirectionalLight[${n}].color`]=px(i),s[`lighting_uDirectionalLight[${n}].direction`]=i.direction}),s.lighting_uDirectionalLightCount=r.length,s}function jv(t=R6){if("lightSources"in t){let{ambientLight:e,pointLights:r,directionalLights:s}=t.lightSources||{};return e||r&&r.length>0||s&&s.length>0?Object.assign({},I6({ambientLight:e,pointLights:r,directionalLights:s}),{lighting_uEnabled:!0}):{lighting_uEnabled:!1}}if("lights"in t){let e={pointLights:[],directionalLights:[]};for(let r of t.lights||[])switch(r.type){case"ambient":e.ambientLight=r;break;case"directional":e.directionalLights?.push(r);break;case"point":e.pointLights?.push(r);break;default:}return jv({lightSources:e})}return{}}var ll={name:"lights",vs:dx,fs:dx,getUniforms:jv,defines:{MAX_LIGHTS:3}};var gx=`uniform float lighting_uAmbient;
uniform float lighting_uDiffuse;
uniform float lighting_uShininess;
uniform vec3  lighting_uSpecularColor;
vec3 lighting_getLightColor(vec3 surfaceColor, vec3 light_direction, vec3 view_direction, vec3 normal_worldspace, vec3 color) {
vec3 halfway_direction = normalize(light_direction + view_direction);
float lambertian = dot(light_direction, normal_worldspace);
float specular = 0.0;
if (lambertian > 0.0) {
float specular_angle = max(dot(normal_worldspace, halfway_direction), 0.0);
specular = pow(specular_angle, lighting_uShininess);
}
lambertian = max(lambertian, 0.0);
return (lambertian * lighting_uDiffuse * surfaceColor + specular * lighting_uSpecularColor) * color;
}
vec3 lighting_getLightColor(vec3 surfaceColor, vec3 cameraPosition, vec3 position_worldspace, vec3 normal_worldspace) {
vec3 lightColor = surfaceColor;
if (lighting_uEnabled) {
vec3 view_direction = normalize(cameraPosition - position_worldspace);
lightColor = lighting_uAmbient * surfaceColor * lighting_uAmbientLight.color;
for (int i = 0; i < MAX_LIGHTS; i++) {
if (i >= lighting_uPointLightCount) {
break;
}
PointLight pointLight = lighting_uPointLight[i];
vec3 light_position_worldspace = pointLight.position;
vec3 light_direction = normalize(light_position_worldspace - position_worldspace);
lightColor += lighting_getLightColor(surfaceColor, light_direction, view_direction, normal_worldspace, pointLight.color);
}
for (int i = 0; i < MAX_LIGHTS; i++) {
if (i >= lighting_uDirectionalLightCount) {
break;
}
DirectionalLight directionalLight = lighting_uDirectionalLight[i];
lightColor += lighting_getLightColor(surfaceColor, -directionalLight.direction, view_direction, normal_worldspace, directionalLight.color);
}
}
return lightColor;
}
vec3 lighting_getSpecularLightColor(vec3 cameraPosition, vec3 position_worldspace, vec3 normal_worldspace) {
vec3 lightColor = vec3(0, 0, 0);
vec3 surfaceColor = vec3(0, 0, 0);
if (lighting_uEnabled) {
vec3 view_direction = normalize(cameraPosition - position_worldspace);
for (int i = 0; i < MAX_LIGHTS; i++) {
if (i >= lighting_uPointLightCount) {
break;
}
PointLight pointLight = lighting_uPointLight[i];
vec3 light_position_worldspace = pointLight.position;
vec3 light_direction = normalize(light_position_worldspace - position_worldspace);
lightColor += lighting_getLightColor(surfaceColor, light_direction, view_direction, normal_worldspace, pointLight.color);
}
for (int i = 0; i < MAX_LIGHTS; i++) {
if (i >= lighting_uDirectionalLightCount) {
break;
}
DirectionalLight directionalLight = lighting_uDirectionalLight[i];
lightColor += lighting_getLightColor(surfaceColor, -directionalLight.direction, view_direction, normal_worldspace, directionalLight.color);
}
}
return lightColor;
}
`;var B6={};function O6(t){let{ambient:e=.35,diffuse:r=.6,shininess:s=32,specularColor:i=[30,30,30]}=t;return{lighting_uAmbient:e,lighting_uDiffuse:r,lighting_uShininess:s,lighting_uSpecularColor:i.map(n=>n/255)}}function Xv(t=B6){if(!("material"in t))return{};let{material:e}=t;return e?O6(e):{lighting_uEnabled:!1}}var pr={name:"gouraud-lighting",dependencies:[ll],vs:gx,defines:{LIGHTING_VERTEX:1},getUniforms:Xv},vi={name:"phong-lighting",dependencies:[ll],fs:gx,defines:{LIGHTING_FRAGMENT:1},getUniforms:Xv};var Yv=`uniform mat4 u_MVPMatrix;
uniform mat4 u_ModelMatrix;
uniform mat4 u_NormalMatrix;
out vec3 pbr_vPosition;
out vec2 pbr_vUV;
#ifdef HAS_NORMALS
# ifdef HAS_TANGENTS
out mat3 pbr_vTBN;
# else
out vec3 pbr_vNormal;
# endif
#endif
void pbr_setPositionNormalTangentUV(vec4 position, vec4 normal, vec4 tangent, vec2 uv)
{
vec4 pos = u_ModelMatrix * position;
pbr_vPosition = vec3(pos.xyz) / pos.w;
#ifdef HAS_NORMALS
#ifdef HAS_TANGENTS
vec3 normalW = normalize(vec3(u_NormalMatrix * vec4(normal.xyz, 0.0)));
vec3 tangentW = normalize(vec3(u_ModelMatrix * vec4(tangent.xyz, 0.0)));
vec3 bitangentW = cross(normalW, tangentW) * tangent.w;
pbr_vTBN = mat3(tangentW, bitangentW, normalW);
#else
pbr_vNormal = normalize(vec3(u_ModelMatrix * vec4(normal.xyz, 0.0)));
#endif
#endif
#ifdef HAS_UV
pbr_vUV = uv;
#else
pbr_vUV = vec2(0.,0.);
#endif
}
`;var qv=`precision highp float;
uniform bool pbr_uUnlit;
#ifdef USE_IBL
uniform samplerCube u_DiffuseEnvSampler;
uniform samplerCube u_SpecularEnvSampler;
uniform sampler2D u_brdfLUT;
uniform vec2 u_ScaleIBLAmbient;
#endif
#ifdef HAS_BASECOLORMAP
uniform sampler2D u_BaseColorSampler;
#endif
#ifdef HAS_NORMALMAP
uniform sampler2D u_NormalSampler;
uniform float u_NormalScale;
#endif
#ifdef HAS_EMISSIVEMAP
uniform sampler2D u_EmissiveSampler;
uniform vec3 u_EmissiveFactor;
#endif
#ifdef HAS_METALROUGHNESSMAP
uniform sampler2D u_MetallicRoughnessSampler;
#endif
#ifdef HAS_OCCLUSIONMAP
uniform sampler2D u_OcclusionSampler;
uniform float u_OcclusionStrength;
#endif
#ifdef ALPHA_CUTOFF
uniform float u_AlphaCutoff;
#endif
uniform vec2 u_MetallicRoughnessValues;
uniform vec4 u_BaseColorFactor;
uniform vec3 u_Camera;
#ifdef PBR_DEBUG
uniform vec4 u_ScaleDiffBaseMR;
uniform vec4 u_ScaleFGDSpec;
#endif
in vec3 pbr_vPosition;
in vec2 pbr_vUV;
#ifdef HAS_NORMALS
#ifdef HAS_TANGENTS
in mat3 pbr_vTBN;
#else
in vec3 pbr_vNormal;
#endif
#endif
struct PBRInfo
{
float NdotL;
float NdotV;
float NdotH;
float LdotH;
float VdotH;
float perceptualRoughness;
float metalness;
vec3 reflectance0;
vec3 reflectance90;
float alphaRoughness;
vec3 diffuseColor;
vec3 specularColor;
vec3 n;
vec3 v;
};
const float M_PI = 3.141592653589793;
const float c_MinRoughness = 0.04;
vec4 SRGBtoLINEAR(vec4 srgbIn)
{
#ifdef MANUAL_SRGB
#ifdef SRGB_FAST_APPROXIMATION
vec3 linOut = pow(srgbIn.xyz,vec3(2.2));
#else
vec3 bLess = step(vec3(0.04045),srgbIn.xyz);
vec3 linOut = mix( srgbIn.xyz/vec3(12.92), pow((srgbIn.xyz+vec3(0.055))/vec3(1.055),vec3(2.4)), bLess );
#endif
return vec4(linOut,srgbIn.w);;
#else
return srgbIn;
#endif
}
vec3 getNormal()
{
#ifndef HAS_TANGENTS
vec3 pos_dx = dFdx(pbr_vPosition);
vec3 pos_dy = dFdy(pbr_vPosition);
vec3 tex_dx = dFdx(vec3(pbr_vUV, 0.0));
vec3 tex_dy = dFdy(vec3(pbr_vUV, 0.0));
vec3 t = (tex_dy.t * pos_dx - tex_dx.t * pos_dy) / (tex_dx.s * tex_dy.t - tex_dy.s * tex_dx.t);
#ifdef HAS_NORMALS
vec3 ng = normalize(pbr_vNormal);
#else
vec3 ng = cross(pos_dx, pos_dy);
#endif
t = normalize(t - ng * dot(ng, t));
vec3 b = normalize(cross(ng, t));
mat3 tbn = mat3(t, b, ng);
#else
mat3 tbn = pbr_vTBN;
#endif
#ifdef HAS_NORMALMAP
vec3 n = texture(u_NormalSampler, pbr_vUV).rgb;
n = normalize(tbn * ((2.0 * n - 1.0) * vec3(u_NormalScale, u_NormalScale, 1.0)));
#else
vec3 n = normalize(tbn[2].xyz);
#endif
return n;
}
#ifdef USE_IBL
vec3 getIBLContribution(PBRInfo pbrInputs, vec3 n, vec3 reflection)
{
float mipCount = 9.0;
float lod = (pbrInputs.perceptualRoughness * mipCount);
vec3 brdf = SRGBtoLINEAR(texture(u_brdfLUT,
vec2(pbrInputs.NdotV, 1.0 - pbrInputs.perceptualRoughness))).rgb;
vec3 diffuseLight = SRGBtoLINEAR(textureCube(u_DiffuseEnvSampler, n)).rgb;
#ifdef USE_TEX_LOD
vec3 specularLight = SRGBtoLINEAR(textureCubeLod(u_SpecularEnvSampler, reflection, lod)).rgb;
#else
vec3 specularLight = SRGBtoLINEAR(textureCube(u_SpecularEnvSampler, reflection)).rgb;
#endif
vec3 diffuse = diffuseLight * pbrInputs.diffuseColor;
vec3 specular = specularLight * (pbrInputs.specularColor * brdf.x + brdf.y);
diffuse *= u_ScaleIBLAmbient.x;
specular *= u_ScaleIBLAmbient.y;
return diffuse + specular;
}
#endif
vec3 diffuse(PBRInfo pbrInputs)
{
return pbrInputs.diffuseColor / M_PI;
}
vec3 specularReflection(PBRInfo pbrInputs)
{
return pbrInputs.reflectance0 +
(pbrInputs.reflectance90 - pbrInputs.reflectance0) *
pow(clamp(1.0 - pbrInputs.VdotH, 0.0, 1.0), 5.0);
}
float geometricOcclusion(PBRInfo pbrInputs)
{
float NdotL = pbrInputs.NdotL;
float NdotV = pbrInputs.NdotV;
float r = pbrInputs.alphaRoughness;
float attenuationL = 2.0 * NdotL / (NdotL + sqrt(r * r + (1.0 - r * r) * (NdotL * NdotL)));
float attenuationV = 2.0 * NdotV / (NdotV + sqrt(r * r + (1.0 - r * r) * (NdotV * NdotV)));
return attenuationL * attenuationV;
}
float microfacetDistribution(PBRInfo pbrInputs)
{
float roughnessSq = pbrInputs.alphaRoughness * pbrInputs.alphaRoughness;
float f = (pbrInputs.NdotH * roughnessSq - pbrInputs.NdotH) * pbrInputs.NdotH + 1.0;
return roughnessSq / (M_PI * f * f);
}
void PBRInfo_setAmbientLight(inout PBRInfo pbrInputs) {
pbrInputs.NdotL = 1.0;
pbrInputs.NdotH = 0.0;
pbrInputs.LdotH = 0.0;
pbrInputs.VdotH = 1.0;
}
void PBRInfo_setDirectionalLight(inout PBRInfo pbrInputs, vec3 lightDirection) {
vec3 n = pbrInputs.n;
vec3 v = pbrInputs.v;
vec3 l = normalize(lightDirection);
vec3 h = normalize(l+v);
pbrInputs.NdotL = clamp(dot(n, l), 0.001, 1.0);
pbrInputs.NdotH = clamp(dot(n, h), 0.0, 1.0);
pbrInputs.LdotH = clamp(dot(l, h), 0.0, 1.0);
pbrInputs.VdotH = clamp(dot(v, h), 0.0, 1.0);
}
void PBRInfo_setPointLight(inout PBRInfo pbrInputs, PointLight pointLight) {
vec3 light_direction = normalize(pointLight.position - pbr_vPosition);
PBRInfo_setDirectionalLight(pbrInputs, light_direction);
}
vec3 calculateFinalColor(PBRInfo pbrInputs, vec3 lightColor) {
vec3 F = specularReflection(pbrInputs);
float G = geometricOcclusion(pbrInputs);
float D = microfacetDistribution(pbrInputs);
vec3 diffuseContrib = (1.0 - F) * diffuse(pbrInputs);
vec3 specContrib = F * G * D / (4.0 * pbrInputs.NdotL * pbrInputs.NdotV);
return pbrInputs.NdotL * lightColor * (diffuseContrib + specContrib);
}
vec4 pbr_filterColor(vec4 colorUnused)
{
#ifdef HAS_BASECOLORMAP
vec4 baseColor = SRGBtoLINEAR(texture(u_BaseColorSampler, pbr_vUV)) * u_BaseColorFactor;
#else
vec4 baseColor = u_BaseColorFactor;
#endif
#ifdef ALPHA_CUTOFF
if (baseColor.a < u_AlphaCutoff) {
discard;
}
#endif
vec3 color = vec3(0, 0, 0);
if(pbr_uUnlit){
color.rgb = baseColor.rgb;
}
else{
float perceptualRoughness = u_MetallicRoughnessValues.y;
float metallic = u_MetallicRoughnessValues.x;
#ifdef HAS_METALROUGHNESSMAP
vec4 mrSample = texture(u_MetallicRoughnessSampler, pbr_vUV);
perceptualRoughness = mrSample.g * perceptualRoughness;
metallic = mrSample.b * metallic;
#endif
perceptualRoughness = clamp(perceptualRoughness, c_MinRoughness, 1.0);
metallic = clamp(metallic, 0.0, 1.0);
float alphaRoughness = perceptualRoughness * perceptualRoughness;
vec3 f0 = vec3(0.04);
vec3 diffuseColor = baseColor.rgb * (vec3(1.0) - f0);
diffuseColor *= 1.0 - metallic;
vec3 specularColor = mix(f0, baseColor.rgb, metallic);
float reflectance = max(max(specularColor.r, specularColor.g), specularColor.b);
float reflectance90 = clamp(reflectance * 25.0, 0.0, 1.0);
vec3 specularEnvironmentR0 = specularColor.rgb;
vec3 specularEnvironmentR90 = vec3(1.0, 1.0, 1.0) * reflectance90;
vec3 n = getNormal();
vec3 v = normalize(u_Camera - pbr_vPosition);
float NdotV = clamp(abs(dot(n, v)), 0.001, 1.0);
vec3 reflection = -normalize(reflect(v, n));
PBRInfo pbrInputs = PBRInfo(
0.0,
NdotV,
0.0,
0.0,
0.0,
perceptualRoughness,
metallic,
specularEnvironmentR0,
specularEnvironmentR90,
alphaRoughness,
diffuseColor,
specularColor,
n,
v
);
#ifdef USE_LIGHTS
PBRInfo_setAmbientLight(pbrInputs);
color += calculateFinalColor(pbrInputs, lighting_uAmbientLight.color);
for(int i = 0; i < lighting_uDirectionalLightCount; i++) {
if (i < lighting_uDirectionalLightCount) {
PBRInfo_setDirectionalLight(pbrInputs, lighting_uDirectionalLight[i].direction);
color += calculateFinalColor(pbrInputs, lighting_uDirectionalLight[i].color);
}
}
for(int i = 0; i < lighting_uPointLightCount; i++) {
if (i < lighting_uPointLightCount) {
PBRInfo_setPointLight(pbrInputs, lighting_uPointLight[i]);
float attenuation = getPointLightAttenuation(lighting_uPointLight[i], distance(lighting_uPointLight[i].position, pbr_vPosition));
color += calculateFinalColor(pbrInputs, lighting_uPointLight[i].color / attenuation);
}
}
#endif
#ifdef USE_IBL
color += getIBLContribution(pbrInputs, n, reflection);
#endif
#ifdef HAS_OCCLUSIONMAP
float ao = texture(u_OcclusionSampler, pbr_vUV).r;
color = mix(color, color * ao, u_OcclusionStrength);
#endif
#ifdef HAS_EMISSIVEMAP
vec3 emissive = SRGBtoLINEAR(texture(u_EmissiveSampler, pbr_vUV)).rgb * u_EmissiveFactor;
color += emissive;
#endif
#ifdef PBR_DEBUG
color = mix(color, baseColor.rgb, u_ScaleDiffBaseMR.y);
color = mix(color, vec3(metallic), u_ScaleDiffBaseMR.z);
color = mix(color, vec3(perceptualRoughness), u_ScaleDiffBaseMR.w);
#endif
}
return vec4(pow(color,vec3(1.0/2.2)), baseColor.a);
}
`;var An={name:"pbr",vs:Yv,fs:qv,defines:{LIGHTING_FRAGMENT:1},dependencies:[ll]};var Kv="#define SMOOTH_EDGE_RADIUS 0.5",F6=`
${Kv}

struct VertexGeometry {
  vec4 position;
  vec3 worldPosition;
  vec3 worldPositionAlt;
  vec3 normal;
  vec2 uv;
  vec3 pickingColor;
} geometry = VertexGeometry(
  vec4(0.0, 0.0, 1.0, 0.0),
  vec3(0.0),
  vec3(0.0),
  vec3(0.0),
  vec2(0.0),
  vec3(0.0)
);
`,L6=`
${Kv}

struct FragmentGeometry {
  vec2 uv;
} geometry;

float smoothedge(float edge, float x) {
  return smoothstep(edge - SMOOTH_EDGE_RADIUS, edge + SMOOTH_EDGE_RADIUS, x);
}
`,$v={name:"geometry",vs:F6,fs:L6};var X={DEFAULT:-1,LNGLAT:1,METER_OFFSETS:2,LNGLAT_OFFSETS:3,CARTESIAN:0};Object.defineProperty(X,"IDENTITY",{get:()=>(k.deprecated("COORDINATE_SYSTEM.IDENTITY","COORDINATE_SYSTEM.CARTESIAN")(),0)});var bt={WEB_MERCATOR:1,GLOBE:2,WEB_MERCATOR_AUTO_OFFSET:4,IDENTITY:0},Fe={common:0,meters:1,pixels:2},ul={click:{handler:"onClick"},panstart:{handler:"onDragStart"},panmove:{handler:"onDrag"},panend:{handler:"onDragEnd"}},Jv={DRAW:"draw",MASK:"mask",TERRAIN:"terrain"};var N6=Object.keys(X).map(t=>`const int COORDINATE_SYSTEM_${t} = ${X[t]};`).join(""),D6=Object.keys(bt).map(t=>`const int PROJECTION_MODE_${t} = ${bt[t]};`).join(""),U6=Object.keys(Fe).map(t=>`const int UNIT_${t.toUpperCase()} = ${Fe[t]};`).join(""),Zv=`${N6}
${D6}
${U6}
uniform int project_uCoordinateSystem;
uniform int project_uProjectionMode;
uniform float project_uScale;
uniform bool project_uWrapLongitude;
uniform vec3 project_uCommonUnitsPerMeter;
uniform vec3 project_uCommonUnitsPerWorldUnit;
uniform vec3 project_uCommonUnitsPerWorldUnit2;
uniform vec4 project_uCenter;
uniform mat4 project_uModelMatrix;
uniform mat4 project_uViewProjectionMatrix;
uniform vec2 project_uViewportSize;
uniform float project_uDevicePixelRatio;
uniform float project_uFocalDistance;
uniform vec3 project_uCameraPosition;
uniform vec3 project_uCoordinateOrigin;
uniform vec3 project_uCommonOrigin;
uniform bool project_uPseudoMeters;
const float TILE_SIZE = 512.0;
const float PI = 3.1415926536;
const float WORLD_SCALE = TILE_SIZE / (PI * 2.0);
const vec3 ZERO_64_LOW = vec3(0.0);
const float EARTH_RADIUS = 6370972.0;
const float GLOBE_RADIUS = 256.0;
float project_size_at_latitude(float lat) {
float y = clamp(lat, -89.9, 89.9);
return 1.0 / cos(radians(y));
}
float project_size() {
if (project_uProjectionMode == PROJECTION_MODE_WEB_MERCATOR &&
project_uCoordinateSystem == COORDINATE_SYSTEM_LNGLAT &&
project_uPseudoMeters == false) {
if (geometry.position.w == 0.0) {
return project_size_at_latitude(geometry.worldPosition.y);
}
float y = geometry.position.y / TILE_SIZE * 2.0 - 1.0;
float y2 = y * y;
float y4 = y2 * y2;
float y6 = y4 * y2;
return 1.0 + 4.9348 * y2 + 4.0587 * y4 + 1.5642 * y6;
}
return 1.0;
}
float project_size_at_latitude(float meters, float lat) {
return meters * project_uCommonUnitsPerMeter.z * project_size_at_latitude(lat);
}
float project_size(float meters) {
return meters * project_uCommonUnitsPerMeter.z * project_size();
}
vec2 project_size(vec2 meters) {
return meters * project_uCommonUnitsPerMeter.xy * project_size();
}
vec3 project_size(vec3 meters) {
return meters * project_uCommonUnitsPerMeter * project_size();
}
vec4 project_size(vec4 meters) {
return vec4(meters.xyz * project_uCommonUnitsPerMeter, meters.w);
}
mat3 project_get_orientation_matrix(vec3 up) {
vec3 uz = normalize(up);
vec3 ux = abs(uz.z) == 1.0 ? vec3(1.0, 0.0, 0.0) : normalize(vec3(uz.y, -uz.x, 0));
vec3 uy = cross(uz, ux);
return mat3(ux, uy, uz);
}
bool project_needs_rotation(vec3 commonPosition, out mat3 transform) {
if (project_uProjectionMode == PROJECTION_MODE_GLOBE) {
transform = project_get_orientation_matrix(commonPosition);
return true;
}
return false;
}
vec3 project_normal(vec3 vector) {
vec4 normal_modelspace = project_uModelMatrix * vec4(vector, 0.0);
vec3 n = normalize(normal_modelspace.xyz * project_uCommonUnitsPerMeter);
mat3 rotation;
if (project_needs_rotation(geometry.position.xyz, rotation)) {
n = rotation * n;
}
return n;
}
vec4 project_offset_(vec4 offset) {
float dy = offset.y;
vec3 commonUnitsPerWorldUnit = project_uCommonUnitsPerWorldUnit + project_uCommonUnitsPerWorldUnit2 * dy;
return vec4(offset.xyz * commonUnitsPerWorldUnit, offset.w);
}
vec2 project_mercator_(vec2 lnglat) {
float x = lnglat.x;
if (project_uWrapLongitude) {
x = mod(x + 180., 360.0) - 180.;
}
float y = clamp(lnglat.y, -89.9, 89.9);
return vec2(
radians(x) + PI,
PI + log(tan_fp32(PI * 0.25 + radians(y) * 0.5))
) * WORLD_SCALE;
}
vec3 project_globe_(vec3 lnglatz) {
float lambda = radians(lnglatz.x);
float phi = radians(lnglatz.y);
float cosPhi = cos(phi);
float D = (lnglatz.z / EARTH_RADIUS + 1.0) * GLOBE_RADIUS;
return vec3(
sin(lambda) * cosPhi,
-cos(lambda) * cosPhi,
sin(phi)
) * D;
}
vec4 project_position(vec4 position, vec3 position64Low) {
vec4 position_world = project_uModelMatrix * position;
if (project_uProjectionMode == PROJECTION_MODE_WEB_MERCATOR) {
if (project_uCoordinateSystem == COORDINATE_SYSTEM_LNGLAT) {
return vec4(
project_mercator_(position_world.xy),
project_size_at_latitude(position_world.z, position_world.y),
position_world.w
);
}
if (project_uCoordinateSystem == COORDINATE_SYSTEM_CARTESIAN) {
position_world.xyz += project_uCoordinateOrigin;
}
}
if (project_uProjectionMode == PROJECTION_MODE_GLOBE) {
if (project_uCoordinateSystem == COORDINATE_SYSTEM_LNGLAT) {
return vec4(
project_globe_(position_world.xyz),
position_world.w
);
}
}
if (project_uProjectionMode == PROJECTION_MODE_WEB_MERCATOR_AUTO_OFFSET) {
if (project_uCoordinateSystem == COORDINATE_SYSTEM_LNGLAT) {
if (abs(position_world.y - project_uCoordinateOrigin.y) > 0.25) {
return vec4(
project_mercator_(position_world.xy) - project_uCommonOrigin.xy,
project_size(position_world.z),
position_world.w
);
}
}
}
if (project_uProjectionMode == PROJECTION_MODE_IDENTITY ||
(project_uProjectionMode == PROJECTION_MODE_WEB_MERCATOR_AUTO_OFFSET &&
(project_uCoordinateSystem == COORDINATE_SYSTEM_LNGLAT ||
project_uCoordinateSystem == COORDINATE_SYSTEM_CARTESIAN))) {
position_world.xyz -= project_uCoordinateOrigin;
}
return project_offset_(position_world) + project_offset_(project_uModelMatrix * vec4(position64Low, 0.0));
}
vec4 project_position(vec4 position) {
return project_position(position, ZERO_64_LOW);
}
vec3 project_position(vec3 position, vec3 position64Low) {
vec4 projected_position = project_position(vec4(position, 1.0), position64Low);
return projected_position.xyz;
}
vec3 project_position(vec3 position) {
vec4 projected_position = project_position(vec4(position, 1.0), ZERO_64_LOW);
return projected_position.xyz;
}
vec2 project_position(vec2 position) {
vec4 projected_position = project_position(vec4(position, 0.0, 1.0), ZERO_64_LOW);
return projected_position.xy;
}
vec4 project_common_position_to_clipspace(vec4 position, mat4 viewProjectionMatrix, vec4 center) {
return viewProjectionMatrix * position + center;
}
vec4 project_common_position_to_clipspace(vec4 position) {
return project_common_position_to_clipspace(position, project_uViewProjectionMatrix, project_uCenter);
}
vec2 project_pixel_size_to_clipspace(vec2 pixels) {
vec2 offset = pixels / project_uViewportSize * project_uDevicePixelRatio * 2.0;
return offset * project_uFocalDistance;
}
float project_size_to_pixel(float meters) {
return project_size(meters) * project_uScale;
}
float project_size_to_pixel(float size, int unit) {
if (unit == UNIT_METERS) return project_size_to_pixel(size);
if (unit == UNIT_COMMON) return size * project_uScale;
return size;
}
float project_pixel_size(float pixels) {
return pixels / project_uScale;
}
vec2 project_pixel_size(vec2 pixels) {
return pixels / project_uScale;
}
`;function k6(t,e){if(t===e)return!0;if(Array.isArray(t)){let r=t.length;if(!e||e.length!==r)return!1;for(let s=0;s<r;s++)if(t[s]!==e[s])return!1;return!0}return!1}function zt(t){let e={},r;return s=>{for(let i in s)if(!k6(s[i],e[i])){r=t(s),e=s;break}return r}}var Qv=[0,0,0,0],V6=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],eC=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],z6=[0,0,0],tC=[0,0,0],H6=zt(W6);function mx(t,e,r=tC){r.length<3&&(r=[r[0],r[1],0]);let s=r,i,n=!0;switch(e===X.LNGLAT_OFFSETS||e===X.METER_OFFSETS?i=r:i=t.isGeospatial?[Math.fround(t.longitude),Math.fround(t.latitude),0]:null,t.projectionMode){case bt.WEB_MERCATOR:(e===X.LNGLAT||e===X.CARTESIAN)&&(i=[0,0,0],n=!1);break;case bt.WEB_MERCATOR_AUTO_OFFSET:e===X.LNGLAT?s=i:e===X.CARTESIAN&&(s=[Math.fround(t.center[0]),Math.fround(t.center[1]),0],i=t.unprojectPosition(s),s[0]-=r[0],s[1]-=r[1],s[2]-=r[2]);break;case bt.IDENTITY:s=t.position.map(Math.fround),s[2]=s[2]||0;break;case bt.GLOBE:n=!1,i=null;break;default:n=!1}return{geospatialOrigin:i,shaderCoordinateOrigin:s,offsetMode:n}}function G6(t,e,r){let{viewMatrixUncentered:s,projectionMatrix:i}=t,{viewMatrix:n,viewProjectionMatrix:o}=t,a=Qv,c=Qv,l=t.cameraPosition,{geospatialOrigin:u,shaderCoordinateOrigin:f,offsetMode:h}=mx(t,e,r);return h&&(c=t.projectPosition(u||f),l=[l[0]-c[0],l[1]-c[1],l[2]-c[2]],c[3]=1,a=It.transformMat4([],c,o),n=s||n,o=ke.multiply([],i,n),o=ke.multiply([],o,V6)),{viewMatrix:n,viewProjectionMatrix:o,projectionCenter:a,originCommon:c,cameraPosCommon:l,shaderCoordinateOrigin:f,geospatialOrigin:u}}function Od({viewport:t,devicePixelRatio:e=1,modelMatrix:r=null,coordinateSystem:s=X.DEFAULT,coordinateOrigin:i=tC,autoWrapLongitude:n=!1}){s===X.DEFAULT&&(s=t.isGeospatial?X.LNGLAT:X.CARTESIAN);let o=H6({viewport:t,devicePixelRatio:e,coordinateSystem:s,coordinateOrigin:i});return o.project_uWrapLongitude=n,o.project_uModelMatrix=r||eC,o}function W6({viewport:t,devicePixelRatio:e,coordinateSystem:r,coordinateOrigin:s}){let{projectionCenter:i,viewProjectionMatrix:n,originCommon:o,cameraPosCommon:a,shaderCoordinateOrigin:c,geospatialOrigin:l}=G6(t,r,s),u=t.getDistanceScales(),f=[t.width*e,t.height*e],h=It.transformMat4([],[0,0,-t.focalDistance,1],t.projectionMatrix)[3]||1,d={project_uCoordinateSystem:r,project_uProjectionMode:t.projectionMode,project_uCoordinateOrigin:c,project_uCommonOrigin:o.slice(0,3),project_uCenter:i,project_uPseudoMeters:Boolean(t._pseudoMeters),project_uViewportSize:f,project_uDevicePixelRatio:e,project_uFocalDistance:h,project_uCommonUnitsPerMeter:u.unitsPerMeter,project_uCommonUnitsPerWorldUnit:u.unitsPerMeter,project_uCommonUnitsPerWorldUnit2:z6,project_uScale:t.scale,project_uWrapLongitude:!1,project_uViewProjectionMatrix:n,project_uModelMatrix:eC,project_uCameraPosition:a};if(l){let p=t.getDistanceScales(l);switch(r){case X.METER_OFFSETS:d.project_uCommonUnitsPerWorldUnit=p.unitsPerMeter,d.project_uCommonUnitsPerWorldUnit2=p.unitsPerMeter2;break;case X.LNGLAT:case X.LNGLAT_OFFSETS:t._pseudoMeters||(d.project_uCommonUnitsPerMeter=p.unitsPerMeter),d.project_uCommonUnitsPerWorldUnit=p.unitsPerDegree,d.project_uCommonUnitsPerWorldUnit2=p.unitsPerDegree2;break;case X.CARTESIAN:d.project_uCommonUnitsPerWorldUnit=[1,1,p.unitsPerMeter[2]],d.project_uCommonUnitsPerWorldUnit2=[0,0,p.unitsPerMeter2[2]];break;default:break}}return d}var j6={};function X6(t=j6){return"viewport"in t?Od(t):{}}var Qe={name:"project",dependencies:[by,$v],vs:Zv,getUniforms:X6};var Y6=`
vec4 project_position_to_clipspace(
  vec3 position, vec3 position64Low, vec3 offset, out vec4 commonPosition
) {
  vec3 projectedPosition = project_position(position, position64Low);
  mat3 rotation;
  if (project_needs_rotation(projectedPosition, rotation)) {
    // offset is specified as ENU
    // when in globe projection, rotate offset so that the ground alighs with the surface of the globe
    offset = rotation * offset;
  }
  commonPosition = vec4(projectedPosition + offset, 1.0);
  return project_common_position_to_clipspace(commonPosition);
}

vec4 project_position_to_clipspace(
  vec3 position, vec3 position64Low, vec3 offset
) {
  vec4 commonPosition;
  return project_position_to_clipspace(position, position64Low, offset, commonPosition);
}
`,de={name:"project32",dependencies:[Qe],vs:Y6};function _x(){return[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]}function Ci(t,e){let r=It.transformMat4([],e,t);return It.scale(r,r,1/r[3]),r}function yx(t,e){let r=t%e;return r<0?e+r:r}function rC(t,e,r){return r*e+(1-r)*t}function fl(t,e,r){return t<e?e:t>r?r:t}function q6(t){return Math.log(t)*Math.LOG2E}var Go=Math.log2||q6;function Fr(t,e){if(!t)throw new Error(e||"@math.gl/web-mercator: assertion failed.")}var Lr=Math.PI,sC=Lr/4,gr=Lr/180,xx=180/Lr,Wo=512,Fd=4003e4,jo=85.051129,iC=1.5;function hl(t){return Math.pow(2,t)}function Ld(t){return Go(t)}function je(t){let[e,r]=t;Fr(Number.isFinite(e)),Fr(Number.isFinite(r)&&r>=-90&&r<=90,"invalid latitude");let s=e*gr,i=r*gr,n=Wo*(s+Lr)/(2*Lr),o=Wo*(Lr+Math.log(Math.tan(sC+i*.5)))/(2*Lr);return[n,o]}function mt(t){let[e,r]=t,s=e/Wo*(2*Lr)-Lr,i=2*(Math.atan(Math.exp(r/Wo*(2*Lr)-Lr))-sC);return[s*xx,i*xx]}function dl(t){let{latitude:e}=t;Fr(Number.isFinite(e));let r=Math.cos(e*gr);return Ld(Fd*r)-9}function bn(t){let e=Math.cos(t*gr);return Wo/Fd/e}function Xo(t){let{latitude:e,longitude:r,highPrecision:s=!1}=t;Fr(Number.isFinite(e)&&Number.isFinite(r));let i=Wo,n=Math.cos(e*gr),o=i/360,a=o/n,c=i/Fd/n,l={unitsPerMeter:[c,c,c],metersPerUnit:[1/c,1/c,1/c],unitsPerDegree:[o,a,c],degreesPerUnit:[1/o,1/a,1/c]};if(s){let u=gr*Math.tan(e*gr)/n,f=o*u/2,h=i/Fd*u,d=h/a*c;l.unitsPerDegree2=[0,f,h],l.unitsPerMeter2=[d,0,d]}return l}function pl(t,e){let[r,s,i]=t,[n,o,a]=e,{unitsPerMeter:c,unitsPerMeter2:l}=Xo({longitude:r,latitude:s,highPrecision:!0}),u=je(t);u[0]+=n*(c[0]+l[0]*o),u[1]+=o*(c[1]+l[1]*o);let f=mt(u),h=(i||0)+(a||0);return Number.isFinite(i)||Number.isFinite(a)?[f[0],f[1],h]:f}function Nd(t){let{height:e,pitch:r,bearing:s,altitude:i,scale:n,center:o}=t,a=_x();ke.translate(a,a,[0,0,-i]),ke.rotateX(a,a,-r*gr),ke.rotateZ(a,a,s*gr);let c=n/e;return ke.scale(a,a,[c,c,c]),o&&ke.translate(a,a,We.negate([],o)),a}function Ax(t){let{width:e,height:r,altitude:s,pitch:i=0,offset:n,center:o,scale:a,nearZMultiplier:c=1,farZMultiplier:l=1}=t,{fovy:u=Tn(iC)}=t;s!==void 0&&(u=Tn(s));let f=u*gr,h=i*gr,d=En(u),p=d;o&&(p+=o[2]*a/Math.cos(h)/r);let g=f*(.5+(n?n[1]:0)/r),m=Math.sin(g)*p/Math.sin(fl(Math.PI/2-h-g,.01,Math.PI-.01)),_=Math.sin(h)*m+p,y=p*10,x=Math.min(_*l,y);return{fov:f,aspect:e/r,focalDistance:d,near:c,far:x}}function Tn(t){return 2*Math.atan(.5/t)*xx}function En(t){return .5/Math.tan(.5*t*gr)}function Yo(t,e){let[r,s,i=0]=t;return Fr(Number.isFinite(r)&&Number.isFinite(s)&&Number.isFinite(i)),Ci(e,[r,s,i,1])}function mr(t,e,r=0){let[s,i,n]=t;if(Fr(Number.isFinite(s)&&Number.isFinite(i),"invalid pixel coordinate"),Number.isFinite(n))return Ci(e,[s,i,n,1]);let o=Ci(e,[s,i,0,1]),a=Ci(e,[s,i,1,1]),c=o[2],l=a[2],u=c===l?0:((r||0)-c)/(l-c);return Ze.lerp([],o,a,u)}function Dd(t){let{width:e,height:r,bounds:s,minExtent:i=0,maxZoom:n=24,offset:o=[0,0]}=t,[[a,c],[l,u]]=s,f=K6(t.padding),h=je([a,fl(u,-jo,jo)]),d=je([l,fl(c,-jo,jo)]),p=[Math.max(Math.abs(d[0]-h[0]),i),Math.max(Math.abs(d[1]-h[1]),i)],g=[e-f.left-f.right-Math.abs(o[0])*2,r-f.top-f.bottom-Math.abs(o[1])*2];Fr(g[0]>0&&g[1]>0);let m=g[0]/p[0],_=g[1]/p[1],y=(f.right-f.left)/2/m,x=(f.top-f.bottom)/2/_,S=[(d[0]+h[0])/2+y,(d[1]+h[1])/2+x],P=mt(S),B=Math.min(n,Go(Math.abs(Math.min(m,_))));return Fr(Number.isFinite(B)),{longitude:P[0],latitude:P[1],zoom:B}}function K6(t=0){return typeof t=="number"?{top:t,bottom:t,left:t,right:t}:(Fr(Number.isFinite(t.top)&&Number.isFinite(t.bottom)&&Number.isFinite(t.left)&&Number.isFinite(t.right)),t)}var nC=Math.PI/180;function Ud(t,e=0){let{width:r,height:s,unproject:i}=t,n={targetZ:e},o=i([0,s],n),a=i([r,s],n),c,l,u=t.fovy?.5*t.fovy*nC:Math.atan(.5/t.altitude),f=(90-t.pitch)*nC;return u>f-.01?(c=oC(t,0,e),l=oC(t,r,e)):(c=i([0,0],n),l=i([r,0],n)),[o,a,l,c]}function oC(t,e,r){let{pixelUnprojectionMatrix:s}=t,i=Ci(s,[e,0,1,1]),n=Ci(s,[e,t.height,1,1]),a=(r*t.distanceScales.unitsPerMeter[2]-i[2])/(n[2]-i[2]),c=Ze.lerp([],i,n,a),l=mt(c);return l.push(r),l}var aC=512;function Tx(t){let{width:e,height:r,pitch:s=0}=t,{longitude:i,latitude:n,zoom:o,bearing:a=0}=t;(i<-180||i>180)&&(i=yx(i+180,360)-180),(a<-180||a>180)&&(a=yx(a+180,360)-180);let c=Go(r/aC);if(o<=c)o=c,n=0;else{let l=r/2/Math.pow(2,o),u=mt([0,l])[1];if(n<u)n=u;else{let f=mt([0,aC-l])[1];n>f&&(n=f)}}return{width:e,height:r,longitude:i,latitude:n,zoom:o,pitch:s,bearing:a}}var cC=.01,J6=["longitude","latitude","zoom"],lC={curve:1.414,speed:1.2};function bx(t,e,r,s){let{startZoom:i,startCenterXY:n,uDelta:o,w0:a,u1:c,S:l,rho:u,rho2:f,r0:h}=uC(t,e,s);if(c<cC){let S={};for(let P of J6){let B=t[P],L=e[P];S[P]=rC(B,L,r)}return S}let d=r*l,p=Math.cosh(h)/Math.cosh(h+u*d),g=a*((Math.cosh(h)*Math.tanh(h+u*d)-Math.sinh(h))/f)/c,m=1/p,_=i+Ld(m),y=Ze.scale([],o,g);Ze.add(y,y,n);let x=mt(y);return{longitude:x[0],latitude:x[1],zoom:_}}function Ex(t,e,r){let s={...lC,...r},{screenSpeed:i,speed:n,maxDuration:o}=s,{S:a,rho:c}=uC(t,e,s),l=1e3*a,u;return Number.isFinite(i)?u=l/(i/c):u=l/n,Number.isFinite(o)&&u>o?0:u}function uC(t,e,r){r=Object.assign({},lC,r);let s=r.curve,i=t.zoom,n=[t.longitude,t.latitude],o=hl(i),a=e.zoom,c=[e.longitude,e.latitude],l=hl(a-i),u=je(n),f=je(c),h=Ze.sub([],f,u),d=Math.max(t.width,t.height),p=d/l,g=Ze.length(h)*o,m=Math.max(g,cC),_=s*s,y=(p*p-d*d+_*_*m*m)/(2*d*_*m),x=(p*p-d*d-_*_*m*m)/(2*p*_*m),S=Math.log(Math.sqrt(y*y+1)-y),P=Math.log(Math.sqrt(x*x+1)-x),B=(P-S)/s;return{startZoom:i,startCenterXY:u,uDelta:h,w0:d,u1:g,S:B,rho:s,rho2:_,r0:S,r1:P}}var Q6=`
const int max_lights = 2;
uniform mat4 shadow_uViewProjectionMatrices[max_lights];
uniform vec4 shadow_uProjectCenters[max_lights];
uniform bool shadow_uDrawShadowMap;
uniform bool shadow_uUseShadowMap;
uniform int shadow_uLightId;
uniform float shadow_uLightCount;

out vec3 shadow_vPosition[max_lights];

vec4 shadow_setVertexPosition(vec4 position_commonspace) {
  if (shadow_uDrawShadowMap) {
    return project_common_position_to_clipspace(position_commonspace, shadow_uViewProjectionMatrices[shadow_uLightId], shadow_uProjectCenters[shadow_uLightId]);
  }
  if (shadow_uUseShadowMap) {
    for (int i = 0; i < max_lights; i++) {
      if(i < int(shadow_uLightCount)) {
        vec4 shadowMap_position = project_common_position_to_clipspace(position_commonspace, shadow_uViewProjectionMatrices[i], shadow_uProjectCenters[i]);
        shadow_vPosition[i] = (shadowMap_position.xyz / shadowMap_position.w + 1.0) / 2.0;
      }
    }
  }
  return gl_Position;
}
`,eV=`
const int max_lights = 2;
uniform bool shadow_uDrawShadowMap;
uniform bool shadow_uUseShadowMap;
uniform sampler2D shadow_uShadowMap0;
uniform sampler2D shadow_uShadowMap1;
uniform vec4 shadow_uColor;
uniform float shadow_uLightCount;

in vec3 shadow_vPosition[max_lights];

const vec4 bitPackShift = vec4(1.0, 255.0, 65025.0, 16581375.0);
const vec4 bitUnpackShift = 1.0 / bitPackShift;
const vec4 bitMask = vec4(1.0 / 255.0, 1.0 / 255.0, 1.0 / 255.0,  0.0);

float shadow_getShadowWeight(vec3 position, sampler2D shadowMap) {
  vec4 rgbaDepth = texture(shadowMap, position.xy);

  float z = dot(rgbaDepth, bitUnpackShift);
  return smoothstep(0.001, 0.01, position.z - z);
}

vec4 shadow_filterShadowColor(vec4 color) {
  if (shadow_uDrawShadowMap) {
    vec4 rgbaDepth = fract(gl_FragCoord.z * bitPackShift);
    rgbaDepth -= rgbaDepth.gbaa * bitMask;
    return rgbaDepth;
  }
  if (shadow_uUseShadowMap) {
    float shadowAlpha = 0.0;
    shadowAlpha += shadow_getShadowWeight(shadow_vPosition[0], shadow_uShadowMap0);
    if(shadow_uLightCount > 1.0) {
      shadowAlpha += shadow_getShadowWeight(shadow_vPosition[1], shadow_uShadowMap1);
    }
    shadowAlpha *= shadow_uColor.a / shadow_uLightCount;
    float blendedAlpha = shadowAlpha + color.a * (1.0 - shadowAlpha);

    return vec4(
      mix(color.rgb, shadow_uColor.rgb, shadowAlpha / blendedAlpha),
      blendedAlpha
    );
  }
  return color;
}
`,tV=zt(oV),rV=zt(aV),sV=[0,0,0,1],iV=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0];function nV(t,e){let[r,s,i]=t,n=mr([r,s,i],e);return Number.isFinite(i)?n:[n[0],n[1],0]}function oV({viewport:t,center:e}){return new q(t.viewProjectionMatrix).invert().transform(e)}function aV({viewport:t,shadowMatrices:e}){let r=[],s=t.pixelUnprojectionMatrix,i=t.isGeospatial?void 0:1,n=[[0,0,i],[t.width,0,i],[0,t.height,i],[t.width,t.height,i],[0,0,-1],[t.width,0,-1],[0,t.height,-1],[t.width,t.height,-1]].map(o=>nV(o,s));for(let o of e){let a=o.clone().translate(new w(t.center).negate()),c=n.map(u=>a.transform(u)),l=new q().ortho({left:Math.min(...c.map(u=>u[0])),right:Math.max(...c.map(u=>u[0])),bottom:Math.min(...c.map(u=>u[1])),top:Math.max(...c.map(u=>u[1])),near:Math.min(...c.map(u=>-u[2])),far:Math.max(...c.map(u=>-u[2]))});r.push(l.multiplyRight(o))}return r}function cV(t,e){let{shadowEnabled:r=!0}=t;if(!r||!t.shadowMatrices||!t.shadowMatrices.length)return{shadow_uDrawShadowMap:!1,shadow_uUseShadowMap:!1,shadow_uShadowMap0:t.dummyShadowMap,shadow_uShadowMap1:t.dummyShadowMap};let s={shadow_uDrawShadowMap:Boolean(t.drawToShadowMap),shadow_uUseShadowMap:t.shadowMaps?t.shadowMaps.length>0:!1,shadow_uColor:t.shadowColor||sV,shadow_uLightId:t.shadowLightId||0,shadow_uLightCount:t.shadowMatrices.length},i=tV({viewport:t.viewport,center:e.project_uCenter}),n=[],o=rV({shadowMatrices:t.shadowMatrices,viewport:t.viewport}).slice();for(let a=0;a<t.shadowMatrices.length;a++){let c=o[a],l=c.clone().translate(new w(t.viewport.center).negate());e.project_uCoordinateSystem===X.LNGLAT&&e.project_uProjectionMode===bt.WEB_MERCATOR?(o[a]=l,n[a]=i):(o[a]=c.clone().multiplyRight(iV),n[a]=l.transform(i))}for(let a=0;a<o.length;a++)s[`shadow_uViewProjectionMatrices[${a}]`]=o[a],s[`shadow_uProjectCenters[${a}]`]=n[a];for(let a=0;a<2;a++)s[`shadow_uShadowMap${a}`]=t.shadowMaps&&t.shadowMaps[a]||t.dummyShadowMap;return s}var qo={name:"shadow",dependencies:[Qe],vs:Q6,fs:eV,inject:{"vs:DECKGL_FILTER_GL_POSITION":`
    position = shadow_setVertexPosition(geometry.position);
    `,"fs:DECKGL_FILTER_COLOR":`
    color = shadow_filterShadowColor(color);
    `},getUniforms:(t={},e={})=>"viewport"in t&&(t.drawToShadowMap||t.shadowMaps&&t.shadowMaps.length>0)?cV(t,e):{}};var _e={...md,defaultUniforms:{...md.defaultUniforms,useFloatColors:!1},inject:{"vs:DECKGL_FILTER_GL_POSITION":`
    // for picking depth values
    picking_setPickingAttribute(position.z / position.w);
  `,"vs:DECKGL_FILTER_COLOR":`
  picking_setPickingColor(geometry.pickingColor);
  `,"fs:DECKGL_FILTER_COLOR":{order:99,injection:`
  // use highlight color if this fragment belongs to the selected object.
  color = picking_filterHighlightColor(color);

  // use picking color if rendering to picking FBO.
  color = picking_filterPickingColor(color);
    `}}};var lV=[Qe],uV=["vs:DECKGL_FILTER_SIZE(inout vec3 size, VertexGeometry geometry)","vs:DECKGL_FILTER_GL_POSITION(inout vec4 position, VertexGeometry geometry)","vs:DECKGL_FILTER_COLOR(inout vec4 color, VertexGeometry geometry)","fs:DECKGL_FILTER_COLOR(inout vec4 color, FragmentGeometry geometry)"];function Ko(){let t=hi.getDefaultShaderAssembler();for(let e of lV)t.addDefaultModule(e);for(let e of uV)t.addShaderHook(e);return t}var fV=[255,255,255],hV=1,dV=0,$o=class{constructor(e={}){this.type="ambient";let{color:r=fV}=e,{intensity:s=hV}=e;this.id=e.id||`ambient-${dV++}`,this.color=r,this.intensity=s}};var pV=[255,255,255],gV=1,mV=[0,0,-1],_V=0,Ns=class{constructor(e={}){this.type="directional";let{color:r=pV}=e,{intensity:s=gV}=e,{direction:i=mV}=e,{_shadow:n=!1}=e;this.id=e.id||`directional-${_V++}`,this.color=r,this.intensity=s,this.type="directional",this.direction=new w(i).normalize().toArray(),this.shadow=n}getProjectedLight(e){return this}};var Sn=class{constructor(e,r={id:"pass"}){let{id:s}=r;this.id=s,this.device=e,this.props={...r}}setProps(e){Object.assign(this.props,e)}render(e){}cleanup(){}};var _t=class extends Sn{constructor(){super(...arguments),this._lastRenderIndex=-1}render(e){let[r,s]=this.device.canvasContext.getDrawingBufferSize(),i=e.clearCanvas??!0,n=e.clearColor??(i?[0,0,0,0]:!1),o=i?1:!1,a=i?0:!1,c=e.colorMask??15,l={viewport:[0,0,r,s]};e.colorMask&&(l.colorMask=c),e.scissorRect&&(l.scissorRect=e.scissorRect);let u=this.device.beginRenderPass({framebuffer:e.target,parameters:l,clearColor:n,clearDepth:o,clearStencil:a});try{return this._drawLayers(u,e)}finally{u.end()}}_drawLayers(e,r){let{target:s,moduleParameters:i,viewports:n,views:o,onViewportActive:a,clearStack:c=!0}=r;r.pass=r.pass||"unknown",c&&(this._lastRenderIndex=-1);let l=[];for(let u of n){let f=o&&o[u.id];a?.(u);let h=this._getDrawLayerParams(u,r),d=u.subViewports||[u];for(let p of d){let g=this._drawLayersInViewport(e,{target:s,moduleParameters:i,viewport:p,view:f,pass:r.pass,layers:r.layers},h);l.push(g)}}return l}_getDrawLayerParams(e,{layers:r,pass:s,isPicking:i=!1,layerFilter:n,cullRect:o,effects:a,moduleParameters:c},l=!1){let u=[],f=fC(this._lastRenderIndex+1),h={layer:r[0],viewport:e,isPicking:i,renderPass:s,cullRect:o},d={};for(let p=0;p<r.length;p++){let g=r[p],m=this._shouldDrawLayer(g,h,n,d),_={shouldDrawLayer:m};m&&!l&&(_.layerRenderIndex=f(g,m),_.moduleParameters=this._getModuleParameters(g,a,s,c),_.layerParameters={...g.context.deck?.props.parameters,...this.getLayerParameters(g,p,e)}),u[p]=_}return u}_drawLayersInViewport(e,{layers:r,moduleParameters:s,pass:i,target:n,viewport:o,view:a},c){let l=yV(this.device,{moduleParameters:s,target:n,viewport:o});if(a&&a.props.clear){let f=a.props.clear===!0?{color:!0,depth:!0}:a.props.clear;this.device.withParametersWebGL({scissorTest:!0,scissor:l},()=>this.device.clearWebGL(f))}let u={totalCount:r.length,visibleCount:0,compositeCount:0,pickableCount:0};e.setParameters({viewport:l});for(let f=0;f<r.length;f++){let h=r[f],{shouldDrawLayer:d,layerRenderIndex:p,moduleParameters:g,layerParameters:m}=c[f];if(d&&h.props.pickable&&u.pickableCount++,h.isComposite)u.compositeCount++;else if(d){u.visibleCount++,this._lastRenderIndex=Math.max(this._lastRenderIndex,p),g.viewport=o,h.context.renderPass=e;try{h._drawLayer({renderPass:e,moduleParameters:g,uniforms:{layerIndex:p},parameters:m})}catch(_){h.raiseError(_,`drawing ${h} to ${i}`)}}}return u}shouldDrawLayer(e){return!0}getModuleParameters(e,r){return null}getLayerParameters(e,r,s){return e.props.parameters}_shouldDrawLayer(e,r,s,i){if(!(e.props.visible&&this.shouldDrawLayer(e)))return!1;r.layer=e;let o=e.parent;for(;o;){if(!o.props.visible||!o.filterSubLayer(r))return!1;r.layer=o,o=o.parent}if(s){let a=r.layer.id;if(a in i||(i[a]=s(r)),!i[a])return!1}return e.activateViewport(r.viewport),!0}_getModuleParameters(e,r,s,i){let n=this.device.canvasContext.cssToDeviceRatio(),o=Object.assign(Object.create(e.internalState?.propsInTransition||e.props),{autoWrapLongitude:e.wrapLongitude,viewport:e.context.viewport,mousePosition:e.context.mousePosition,picking:{isActive:0},devicePixelRatio:n});if(r)for(let a of r)Object.assign(o,a.getModuleParameters?.(e));return Object.assign(o,this.getModuleParameters(e,r),i)}};function fC(t=0,e={}){let r={},s=(i,n)=>{let o=i.props._offset,a=i.id,c=i.parent&&i.parent.id,l;if(c&&!(c in e)&&s(i.parent,!1),c in r){let u=r[c]=r[c]||fC(e[c],e);l=u(i,n),r[a]=u}else Number.isFinite(o)?(l=o+(e[c]||0),r[a]=null):l=t;return n&&l>=t&&(t=l+1),e[a]=l,l};return s}function yV(t,{moduleParameters:e,target:r,viewport:s}){let i=e&&e.devicePixelRatio||t.canvasContext.cssToDeviceRatio(),[,n]=t.canvasContext.getDrawingBufferSize(),o=r?r.height:n,a=s;return[a.x*i,o-(a.y+a.height)*i,a.width*i,a.height*i]}var gl=class extends _t{constructor(e,r){super(e,r),this.shadowMap=e.createTexture({width:1,height:1,sampler:{minFilter:"linear",magFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}}),this.depthBuffer=e.createTexture({format:"depth16unorm",width:1,height:1,mipmaps:!1,dataFormat:6402,type:5125}),this.fbo=e.createFramebuffer({id:"shadowmap",width:1,height:1,colorAttachments:[this.shadowMap],depthStencilAttachment:this.depthBuffer})}render(e){let r=this.fbo,s=this.device.canvasContext.cssToDeviceRatio(),i=e.viewports[0],n=i.width*s,o=i.height*s,a=[1,1,1,1];(n!==r.width||o!==r.height)&&r.resize({width:n,height:o}),super.render({...e,clearColor:a,target:r,pass:"shadow"})}getLayerParameters(e,r,s){return{...e.props.parameters,blend:!1,depthRange:[0,1],depthTest:!0}}shouldDrawLayer(e){return e.props.shadowEnabled!==!1}getModuleParameters(){return{drawToShadowMap:!0}}delete(){this.fbo&&(this.fbo.destroy(),this.fbo=null),this.shadowMap&&(this.shadowMap.destroy(),this.shadowMap=null),this.depthBuffer&&(this.depthBuffer.destroy(),this.depthBuffer=null)}};var xV={color:[255,255,255],intensity:1},hC=[{color:[255,255,255],intensity:1,direction:[-1,3,-1]},{color:[255,255,255],intensity:.9,direction:[1,-8,-2.5]}],AV=[0,0,0,200/255],wi=class{constructor(e={}){this.id="lighting-effect",this.shadowColor=AV,this.shadow=!1,this.ambientLight=null,this.directionalLights=[],this.pointLights=[],this.shadowPasses=[],this.shadowMaps=[],this.dummyShadowMap=null,this.setProps(e)}setup(e){this.context=e;let{device:r,deck:s}=e;this.shadow&&!this.dummyShadowMap&&(this._createShadowPasses(r),s._addDefaultShaderModule(qo),this.dummyShadowMap=r.createTexture({width:1,height:1}))}setProps(e){this.ambientLight=null,this.directionalLights=[],this.pointLights=[];for(let r in e){let s=e[r];switch(s.type){case"ambient":this.ambientLight=s;break;case"directional":this.directionalLights.push(s);break;case"point":this.pointLights.push(s);break;default:}}this._applyDefaultLights(),this.shadow=this.directionalLights.some(r=>r.shadow),this.context&&this.setup(this.context),this.props=e}preRender({layers:e,layerFilter:r,viewports:s,onViewportActive:i,views:n}){if(this.shadow){this.shadowMatrices=this._calculateMatrices();for(let o=0;o<this.shadowPasses.length;o++)this.shadowPasses[o].render({layers:e,layerFilter:r,viewports:s,onViewportActive:i,views:n,moduleParameters:{shadowLightId:o,dummyShadowMap:this.dummyShadowMap,shadowMatrices:this.shadowMatrices}})}}getModuleParameters(e){let r=this.shadow?{shadowMaps:this.shadowMaps,dummyShadowMap:this.dummyShadowMap,shadowColor:this.shadowColor,shadowMatrices:this.shadowMatrices}:{};return r.lightSources={ambientLight:this.ambientLight,directionalLights:this.directionalLights.map(s=>s.getProjectedLight({layer:e})),pointLights:this.pointLights.map(s=>s.getProjectedLight({layer:e}))},r}cleanup(e){for(let r of this.shadowPasses)r.delete();this.shadowPasses.length=0,this.shadowMaps.length=0,this.dummyShadowMap&&(this.dummyShadowMap.destroy(),this.dummyShadowMap=null,e.deck._removeDefaultShaderModule(qo))}_calculateMatrices(){let e=[];for(let r of this.directionalLights){let s=new q().lookAt({eye:new w(r.direction).negate()});e.push(s)}return e}_createShadowPasses(e){for(let r=0;r<this.directionalLights.length;r++){let s=new gl(e);this.shadowPasses[r]=s,this.shadowMaps[r]=s.shadowMap}}_applyDefaultLights(){let{ambientLight:e,pointLights:r,directionalLights:s}=this;!e&&r.length===0&&s.length===0&&(this.ambientLight=new $o(xV),this.directionalLights.push(new Ns(hC[0]),new Ns(hC[1])))}};var Sx=class{constructor(e={}){this._pool=[],this.opts={overAlloc:2,poolSize:100},this.setOptions(e)}setOptions(e){Object.assign(this.opts,e)}allocate(e,r,{size:s=1,type:i,padding:n=0,copy:o=!1,initialize:a=!1,maxCount:c}){let l=i||e&&e.constructor||Float32Array,u=r*s+n;if(ArrayBuffer.isView(e)){if(u<=e.length)return e;if(u*e.BYTES_PER_ELEMENT<=e.buffer.byteLength)return new l(e.buffer,0,u)}let f=1/0;c&&(f=c*s+n);let h=this._allocate(l,u,a,f);return e&&o?h.set(e):a||h.fill(0,0,4),this._release(e),h}release(e){this._release(e)}_allocate(e,r,s,i){let n=Math.max(Math.ceil(r*this.opts.overAlloc),1);n>i&&(n=i);let o=this._pool,a=e.BYTES_PER_ELEMENT*n,c=o.findIndex(l=>l.byteLength>=a);if(c>=0){let l=new e(o.splice(c,1)[0],0,n);return s&&l.fill(0),l}return new e(n)}_release(e){if(!ArrayBuffer.isView(e))return;let r=this._pool,{buffer:s}=e,{byteLength:i}=s,n=r.findIndex(o=>o.byteLength>=i);n<0?r.push(s):(n>0||r.length<this.opts.poolSize)&&r.splice(n,0,s),r.length>this.opts.poolSize&&r.shift()}},Nr=new Sx;function Zo(){return[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]}function vn(t,e){let r=t%e;return r<0?e+r:r}function pC(t){return[t[12],t[13],t[14]]}function gC(t){return{left:Jo(t[3]+t[0],t[7]+t[4],t[11]+t[8],t[15]+t[12]),right:Jo(t[3]-t[0],t[7]-t[4],t[11]-t[8],t[15]-t[12]),bottom:Jo(t[3]+t[1],t[7]+t[5],t[11]+t[9],t[15]+t[13]),top:Jo(t[3]-t[1],t[7]-t[5],t[11]-t[9],t[15]-t[13]),near:Jo(t[3]+t[2],t[7]+t[6],t[11]+t[10],t[15]+t[14]),far:Jo(t[3]-t[2],t[7]-t[6],t[11]-t[10],t[15]-t[14])}}var dC=new w;function Jo(t,e,r,s){dC.set(t,e,r);let i=dC.len();return{distance:s/i,normal:new w(-t/i,-e/i,-r/i)}}function Dr(t){return t-Math.fround(t)}var ml;function kd(t,e){let{size:r=1,startIndex:s=0}=e,i=e.endIndex!==void 0?e.endIndex:t.length,n=(i-s)/r;ml=Nr.allocate(ml,n,{type:Float32Array,size:r*2});let o=s,a=0;for(;o<i;){for(let c=0;c<r;c++){let l=t[o++];ml[a+c]=l,ml[a+c+r]=Dr(l)}a+=r*2}return ml.subarray(0,n*r*2)}function mC(t){let e=null,r=!1;for(let s of t)s&&(e?(r||(e=[[e[0][0],e[0][1]],[e[1][0],e[1][1]]],r=!0),e[0][0]=Math.min(e[0][0],s[0][0]),e[0][1]=Math.min(e[0][1],s[0][1]),e[1][0]=Math.max(e[1][0],s[1][0]),e[1][1]=Math.max(e[1][1],s[1][1])):e=s);return e}var TV=Math.PI/180,bV=Zo(),_C=[0,0,0],EV={unitsPerMeter:[1,1,1],metersPerUnit:[1,1,1]};function SV({width:t,height:e,orthographic:r,fovyRadians:s,focalDistance:i,padding:n,near:o,far:a}){let c=t/e,l=r?new q().orthographic({fovy:s,aspect:c,focalDistance:i,near:o,far:a}):new q().perspective({fovy:s,aspect:c,near:o,far:a});if(n){let{left:u=0,right:f=0,top:h=0,bottom:d=0}=n,p=fe((u+t-f)/2,0,t)-t/2,g=fe((h+e-d)/2,0,e)-e/2;l[8]-=p*2/t,l[9]+=g*2/e}return l}var Qo=class{constructor(e={}){this._frustumPlanes={},this.id=e.id||this.constructor.displayName||"viewport",this.x=e.x||0,this.y=e.y||0,this.width=e.width||1,this.height=e.height||1,this.zoom=e.zoom||0,this.padding=e.padding,this.distanceScales=e.distanceScales||EV,this.focalDistance=e.focalDistance||1,this.position=e.position||_C,this.modelMatrix=e.modelMatrix||null;let{longitude:r,latitude:s}=e;this.isGeospatial=Number.isFinite(s)&&Number.isFinite(r),this._initProps(e),this._initMatrices(e),this.equals=this.equals.bind(this),this.project=this.project.bind(this),this.unproject=this.unproject.bind(this),this.projectPosition=this.projectPosition.bind(this),this.unprojectPosition=this.unprojectPosition.bind(this),this.projectFlat=this.projectFlat.bind(this),this.unprojectFlat=this.unprojectFlat.bind(this)}get subViewports(){return null}get metersPerPixel(){return this.distanceScales.metersPerUnit[2]/this.scale}get projectionMode(){return this.isGeospatial?this.zoom<12?bt.WEB_MERCATOR:bt.WEB_MERCATOR_AUTO_OFFSET:bt.IDENTITY}equals(e){return e instanceof Qo?this===e?!0:e.width===this.width&&e.height===this.height&&e.scale===this.scale&&Ce(e.projectionMatrix,this.projectionMatrix)&&Ce(e.viewMatrix,this.viewMatrix):!1}project(e,{topLeft:r=!0}={}){let s=this.projectPosition(e),i=Yo(s,this.pixelProjectionMatrix),[n,o]=i,a=r?o:this.height-o;return e.length===2?[n,a]:[n,a,i[2]]}unproject(e,{topLeft:r=!0,targetZ:s}={}){let[i,n,o]=e,a=r?n:this.height-n,c=s&&s*this.distanceScales.unitsPerMeter[2],l=mr([i,a,o],this.pixelUnprojectionMatrix,c),[u,f,h]=this.unprojectPosition(l);return Number.isFinite(o)?[u,f,h]:Number.isFinite(s)?[u,f,s]:[u,f]}projectPosition(e){let[r,s]=this.projectFlat(e),i=(e[2]||0)*this.distanceScales.unitsPerMeter[2];return[r,s,i]}unprojectPosition(e){let[r,s]=this.unprojectFlat(e),i=(e[2]||0)*this.distanceScales.metersPerUnit[2];return[r,s,i]}projectFlat(e){if(this.isGeospatial){let r=je(e);return r[1]=fe(r[1],-318,830),r}return e}unprojectFlat(e){return this.isGeospatial?mt(e):e}getBounds(e={}){let r={targetZ:e.z||0},s=this.unproject([0,0],r),i=this.unproject([this.width,0],r),n=this.unproject([0,this.height],r),o=this.unproject([this.width,this.height],r);return[Math.min(s[0],i[0],n[0],o[0]),Math.min(s[1],i[1],n[1],o[1]),Math.max(s[0],i[0],n[0],o[0]),Math.max(s[1],i[1],n[1],o[1])]}getDistanceScales(e){return e?Xo({longitude:e[0],latitude:e[1],highPrecision:!0}):this.distanceScales}containsPixel({x:e,y:r,width:s=1,height:i=1}){return e<this.x+this.width&&this.x<e+s&&r<this.y+this.height&&this.y<r+i}getFrustumPlanes(){return this._frustumPlanes.near?this._frustumPlanes:(Object.assign(this._frustumPlanes,gC(this.viewProjectionMatrix)),this._frustumPlanes)}panByPosition(e,r){return null}_initProps(e){let r=e.longitude,s=e.latitude;this.isGeospatial&&(Number.isFinite(e.zoom)||(this.zoom=dl({latitude:s})+Math.log2(this.focalDistance)),this.distanceScales=e.distanceScales||Xo({latitude:s,longitude:r}));let i=Math.pow(2,this.zoom);this.scale=i;let{position:n,modelMatrix:o}=e,a=_C;if(n&&(a=o?new q(o).transformAsVector(n,[]):n),this.isGeospatial){let c=this.projectPosition([r,s,0]);this.center=new w(a).scale(this.distanceScales.unitsPerMeter).add(c)}else this.center=this.projectPosition(a)}_initMatrices(e){let{viewMatrix:r=bV,projectionMatrix:s=null,orthographic:i=!1,fovyRadians:n,fovy:o=75,near:a=.1,far:c=1e3,padding:l=null,focalDistance:u=1}=e;this.viewMatrixUncentered=r,this.viewMatrix=new q().multiplyRight(r).translate(new w(this.center).negate()),this.projectionMatrix=s||SV({width:this.width,height:this.height,orthographic:i,fovyRadians:n||o*TV,focalDistance:u,padding:l,near:a,far:c});let f=Zo();ke.multiply(f,f,this.projectionMatrix),ke.multiply(f,f,this.viewMatrix),this.viewProjectionMatrix=f,this.viewMatrixInverse=ke.invert([],this.viewMatrix)||this.viewMatrix,this.cameraPosition=pC(this.viewMatrixInverse);let h=Zo(),d=Zo();ke.scale(h,h,[this.width/2,-this.height/2,1]),ke.translate(h,h,[1,-1,0]),ke.multiply(d,h,this.viewProjectionMatrix),this.pixelProjectionMatrix=d,this.pixelUnprojectionMatrix=ke.invert(Zo(),this.pixelProjectionMatrix),this.pixelUnprojectionMatrix||k.warn("Pixel project matrix not invertible")()}};Qo.displayName="Viewport";var Ht=Qo;var Cn=class extends Ht{constructor(e={}){let{latitude:r=0,longitude:s=0,zoom:i=0,pitch:n=0,bearing:o=0,nearZMultiplier:a=.1,farZMultiplier:c=1.01,nearZ:l,farZ:u,orthographic:f=!1,projectionMatrix:h,repeat:d=!1,worldOffset:p=0,position:g,padding:m,legacyMeterSizes:_=!1}=e,{width:y,height:x,altitude:S=1.5}=e,P=Math.pow(2,i);y=y||1,x=x||1;let B,L=null;if(h)S=h[5]/2,B=Tn(S);else{e.fovy?(B=e.fovy,S=En(B)):B=Tn(S);let v;if(m){let{top:T=0,bottom:D=0}=m;v=[0,fe((T+x-D)/2,0,x)-x/2]}L=Ax({width:y,height:x,scale:P,center:g&&[0,0,g[2]*bn(r)],offset:v,pitch:n,fovy:B,nearZMultiplier:a,farZMultiplier:c}),Number.isFinite(l)&&(L.near=l),Number.isFinite(u)&&(L.far=u)}let M=Nd({height:x,pitch:n,bearing:o,scale:P,altitude:S});p&&(M=new q().translate([512*p,0,0]).multiplyLeft(M)),super({...e,width:y,height:x,viewMatrix:M,longitude:s,latitude:r,zoom:i,...L,fovy:B,focalDistance:S}),this.latitude=r,this.longitude=s,this.zoom=i,this.pitch=n,this.bearing=o,this.altitude=S,this.fovy=B,this.orthographic=f,this._subViewports=d?[]:null,this._pseudoMeters=_,Object.freeze(this)}get subViewports(){if(this._subViewports&&!this._subViewports.length){let e=this.getBounds(),r=Math.floor((e[0]+180)/360),s=Math.ceil((e[2]-180)/360);for(let i=r;i<=s;i++){let n=i?new Cn({...this,worldOffset:i}):this;this._subViewports.push(n)}}return this._subViewports}projectPosition(e){if(this._pseudoMeters)return super.projectPosition(e);let[r,s]=this.projectFlat(e),i=(e[2]||0)*bn(e[1]);return[r,s,i]}unprojectPosition(e){if(this._pseudoMeters)return super.unprojectPosition(e);let[r,s]=this.unprojectFlat(e),i=(e[2]||0)/bn(s);return[r,s,i]}addMetersToLngLat(e,r){return pl(e,r)}panByPosition(e,r){let s=mr(r,this.pixelUnprojectionMatrix),i=this.projectFlat(e),n=Ze.add([],i,Ze.negate([],s)),o=Ze.add([],this.center,n),[a,c]=this.unprojectFlat(o);return{longitude:a,latitude:c}}getBounds(e={}){let r=Ud(this,e.z||0);return[Math.min(r[0][0],r[1][0],r[2][0],r[3][0]),Math.min(r[0][1],r[1][1],r[2][1],r[3][1]),Math.max(r[0][0],r[1][0],r[2][0],r[3][0]),Math.max(r[0][1],r[1][1],r[2][1],r[3][1])]}fitBounds(e,r={}){let{width:s,height:i}=this,{longitude:n,latitude:o,zoom:a}=Dd({width:s,height:i,bounds:e,...r});return new Cn({width:s,height:i,longitude:n,latitude:o,zoom:a})}};Cn.displayName="WebMercatorViewport";var Et=Cn;var yC=[0,0,0];function vx(t,e,r=!1){let s=e.projectPosition(t);if(r&&e instanceof Et){let[i,n,o=0]=t,a=e.getDistanceScales([i,n]);s[2]=o*a.unitsPerMeter[2]}return s}function vV(t){let{viewport:e,modelMatrix:r,coordinateOrigin:s}=t,{coordinateSystem:i,fromCoordinateSystem:n,fromCoordinateOrigin:o}=t;return i===X.DEFAULT&&(i=e.isGeospatial?X.LNGLAT:X.CARTESIAN),n===void 0&&(n=i),o===void 0&&(o=s),{viewport:e,coordinateSystem:i,coordinateOrigin:s,modelMatrix:r,fromCoordinateSystem:n,fromCoordinateOrigin:o}}function Cx(t,{viewport:e,modelMatrix:r,coordinateSystem:s,coordinateOrigin:i,offsetMode:n}){let[o,a,c=0]=t;switch(r&&([o,a,c]=It.transformMat4([],[o,a,c,1],r)),s){case X.LNGLAT:return vx([o,a,c],e,n);case X.LNGLAT_OFFSETS:return vx([o+i[0],a+i[1],c+(i[2]||0)],e,n);case X.METER_OFFSETS:return vx(pl(i,[o,a,c]),e,n);case X.CARTESIAN:default:return e.isGeospatial?[o+i[0],a+i[1],c+i[2]]:e.projectPosition([o,a,c])}}function Vd(t,e){let{viewport:r,coordinateSystem:s,coordinateOrigin:i,modelMatrix:n,fromCoordinateSystem:o,fromCoordinateOrigin:a}=vV(e),{autoOffset:c=!0}=e,{geospatialOrigin:l=yC,shaderCoordinateOrigin:u=yC,offsetMode:f=!1}=c?mx(r,s,i):{},h=Cx(t,{viewport:r,modelMatrix:n,coordinateSystem:o,coordinateOrigin:a,offsetMode:f});if(f){let d=r.projectPosition(l||u);We.sub(h,h,d)}return h}var CV=[255,255,255],wV=1,PV=[0,0,1],MV=[0,0,1],RV=0,ea=class{constructor(e={}){this.type="point";let{color:r=CV}=e,{intensity:s=wV}=e,{position:i=MV}=e;this.id=e.id||`point-${RV++}`,this.color=r,this.intensity=s,this.type="point",this.position=i,this.attenuation=IV(e),this.projectedLight={...this}}getProjectedLight({layer:e}){let{projectedLight:r}=this,s=e.context.viewport,{coordinateSystem:i,coordinateOrigin:n}=e.props,o=Vd(this.position,{viewport:s,coordinateSystem:i,coordinateOrigin:n,fromCoordinateSystem:s.isGeospatial?X.LNGLAT:X.CARTESIAN,fromCoordinateOrigin:[0,0,0]});return r.color=this.color,r.intensity=this.intensity,r.position=o,r}};function IV(t){return t.attenuation?t.attenuation:"intensity"in t?[0,0,t.intensity||0]:PV}var _l=class extends ea{getProjectedLight({layer:e}){let{projectedLight:r}=this,s=e.context.viewport,{coordinateSystem:i,coordinateOrigin:n,modelMatrix:o}=e.props,{project_uCameraPosition:a}=Od({viewport:s,modelMatrix:o,coordinateSystem:i,coordinateOrigin:n});return r.color=this.color,r.intensity=this.intensity,r.position=a,r}};var wn=Math.PI/180,BV=1e3*60*60*24,OV=2440588,FV=2451545,zd=wn*23.4397,LV=357.5291,NV=.98560028,DV=280.147,UV=360.9856235;function xC(t,e,r){let s=wn*-r,i=wn*e,n=VV(t),o=qV(n),a=jV(n,s)-o.rightAscension;return{azimuth:GV(a,i,o.declination),altitude:WV(a,i,o.declination)}}function Hd(t,e,r){let{azimuth:s,altitude:i}=xC(t,e,r);return[Math.sin(s)*Math.cos(i),Math.cos(s)*Math.cos(i),-Math.sin(i)]}function kV(t){return(typeof t=="number"?t:t.getTime())/BV-.5+OV}function VV(t){return kV(t)-FV}function zV(t,e){let r=t;return Math.atan2(Math.sin(r)*Math.cos(zd)-Math.tan(e)*Math.sin(zd),Math.cos(r))}function HV(t,e){let r=t;return Math.asin(Math.sin(e)*Math.cos(zd)+Math.cos(e)*Math.sin(zd)*Math.sin(r))}function GV(t,e,r){let s=t,i=e,n=r;return Math.atan2(Math.sin(s),Math.cos(s)*Math.sin(i)-Math.tan(n)*Math.cos(i))}function WV(t,e,r){let s=t,i=e,n=r;return Math.asin(Math.sin(i)*Math.sin(n)+Math.cos(i)*Math.cos(n)*Math.cos(s))}function jV(t,e){return wn*(DV+UV*t)-e}function XV(t){return wn*(LV+NV*t)}function YV(t){let e=t,r=wn*(1.9148*Math.sin(e)+.02*Math.sin(2*e)+3e-4*Math.sin(3*e)),s=wn*102.9372;return e+r+s+Math.PI}function qV(t){let e=XV(t),r=YV(e);return{declination:HV(r,0),rightAscension:zV(r,0)}}var yl=class extends Ns{constructor(e){super(e),this.timestamp=e.timestamp}getProjectedLight({layer:e}){let{viewport:r}=e.context;if(r.resolution&&r.resolution>0){let[i,n,o]=Hd(this.timestamp,0,0);this.direction=[i,-o,n]}else{let{latitude:i,longitude:n}=r;this.direction=Hd(this.timestamp,i,n)}return this}};var KV=1,$V=1,Pn=class{time=0;channels=new Map;animations=new Map;playing=!1;lastEngineTime=-1;constructor(){}addChannel(e){let{delay:r=0,duration:s=Number.POSITIVE_INFINITY,rate:i=1,repeat:n=1}=e,o=KV++,a={time:0,delay:r,duration:s,rate:i,repeat:n};return this._setChannelTime(a,this.time),this.channels.set(o,a),o}removeChannel(e){this.channels.delete(e);for(let[r,s]of this.animations)s.channel===e&&this.detachAnimation(r)}isFinished(e){let r=this.channels.get(e);return r===void 0?!1:this.time>=r.delay+r.duration*r.repeat}getTime(e){if(e===void 0)return this.time;let r=this.channels.get(e);return r===void 0?-1:r.time}setTime(e){this.time=Math.max(0,e);let r=this.channels.values();for(let i of r)this._setChannelTime(i,this.time);let s=this.animations.values();for(let i of s){let{animation:n,channel:o}=i;n.setTime(this.getTime(o))}}play(){this.playing=!0}pause(){this.playing=!1,this.lastEngineTime=-1}reset(){this.setTime(0)}attachAnimation(e,r){let s=$V++;return this.animations.set(s,{animation:e,channel:r}),e.setTime(this.getTime(r)),s}detachAnimation(e){this.animations.delete(e)}update(e){this.playing&&(this.lastEngineTime===-1&&(this.lastEngineTime=e),this.setTime(this.time+(e-this.lastEngineTime)),this.lastEngineTime=e)}_setChannelTime(e,r){let s=r-e.delay,i=e.duration*e.repeat;s>=i?e.time=e.duration*e.rate:(e.time=Math.max(0,s)%e.duration,e.time*=e.rate)}};var JV=0,ZV={device:null,onAddHTML:()=>"",onInitialize:async()=>null,onRender:()=>{},onFinalize:()=>{},onError:t=>console.error(t),stats:Vt.stats.get(`animation-loop-${JV++}`),useDevicePixels:!0,autoResizeViewport:!1,autoResizeDrawingBuffer:!1},xl=class{device=null;canvas=null;props;animationProps=null;timeline=null;stats;cpuTime;gpuTime;frameRate;display;needsRedraw="initialized";_initialized=!1;_running=!1;_animationFrameId=null;_nextFramePromise=null;_resolveNextFrame=null;_cpuStartTime=0;constructor(e){if(this.props={...ZV,...e},e=this.props,!e.device)throw new Error("No device provided");let{useDevicePixels:r=!0}=this.props;this.stats=e.stats||new Tt({id:"animation-loop-stats"}),this.cpuTime=this.stats.get("CPU Time"),this.gpuTime=this.stats.get("GPU Time"),this.frameRate=this.stats.get("Frame Rate"),this.setProps({autoResizeViewport:e.autoResizeViewport,autoResizeDrawingBuffer:e.autoResizeDrawingBuffer,useDevice