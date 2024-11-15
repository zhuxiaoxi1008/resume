import{_ as P,r as K,o as de,a as f,c as g,b as me,d as n,t as v,u as d,e as p,g as G,n as N,f as X,w as O,F as H,h as q,i as ve,j as Se}from"./index-D3YL8XFd.js";const we={__name:"spark",setup(b){let c=K(null);de(()=>{u()});function u(){const i=c.value;i.width=i.clientWidth,i.height=i.clientHeight;let l={TEXTURE_DOWNSAMPLE:1,DENSITY_DISSIPATION:.98,VELOCITY_DISSIPATION:.99,PRESSURE_DISSIPATION:.8,PRESSURE_ITERATIONS:25,CURL:30,SPLAT_RADIUS:.005},s=[],A=[];const{gl:e,ext:y}=M(i);function M(t){const a={alpha:!1,depth:!1,stencil:!1,antialias:!1};let r=t.getContext("webgl2",a);const o=!!r;o||(r=t.getContext("webgl",a)||t.getContext("experimental-webgl",a));let m,T;o?(r.getExtension("EXT_color_buffer_float"),T=r.getExtension("OES_texture_float_linear")):(m=r.getExtension("OES_texture_half_float"),T=r.getExtension("OES_texture_half_float_linear")),r.clearColor(0,0,0,1);const x=o?r.HALF_FLOAT:m.HALF_FLOAT_OES;let w,U,z;return o?(w=_(r,r.RGBA16F,r.RGBA,x),U=_(r,r.RG16F,r.RG,x),z=_(r,r.R16F,r.RED,x)):(w=_(r,r.RGBA,r.RGBA,x),U=_(r,r.RGBA,r.RGBA,x),z=_(r,r.RGBA,r.RGBA,x)),{gl:r,ext:{formatRGBA:w,formatRG:U,formatR:z,halfFloatTexType:x,supportLinearFiltering:T}}}function _(t,a,r,o){if(!V(t,a,r,o))switch(a){case t.R16F:return _(t,t.RG16F,t.RG,o);case t.RG16F:return _(t,t.RGBA16F,t.RGBA,o);default:return null}return{internalFormat:a,format:r}}function V(t,a,r,o){let m=t.createTexture();t.bindTexture(t.TEXTURE_2D,m),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texImage2D(t.TEXTURE_2D,0,a,4,4,0,r,o,null);let T=t.createFramebuffer();return t.bindFramebuffer(t.FRAMEBUFFER,T),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,m,0),t.checkFramebufferStatus(t.FRAMEBUFFER)==t.FRAMEBUFFER_COMPLETE}function oe(){this.id=-1,this.x=0,this.y=0,this.dx=0,this.dy=0,this.down=!1,this.moved=!1,this.color=[30,0,300]}s.push(new oe);class L{constructor(a,r){if(this.uniforms={},this.program=e.createProgram(),e.attachShader(this.program,a),e.attachShader(this.program,r),e.linkProgram(this.program),!e.getProgramParameter(this.program,e.LINK_STATUS))throw e.getProgramInfoLog(this.program);const o=e.getProgramParameter(this.program,e.ACTIVE_UNIFORMS);for(let m=0;m<o;m++){const T=e.getActiveUniform(this.program,m).name;this.uniforms[T]=e.getUniformLocation(this.program,T)}}bind(){e.useProgram(this.program)}}function D(t,a){const r=e.createShader(t);if(e.shaderSource(r,a),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS))throw e.getShaderInfoLog(r);return r}const B=D(e.VERTEX_SHADER,`
    precision highp float;
    precision mediump sampler2D;

    attribute vec2 aPosition;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform vec2 texelSize;

    void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
    }
`),fe=D(e.FRAGMENT_SHADER,`
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float value;

    void main () {
        gl_FragColor = value * texture2D(uTexture, vUv);
    }
`),pe=D(e.FRAGMENT_SHADER,`
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    uniform sampler2D uTexture;

    void main () {
        gl_FragColor = texture2D(uTexture, vUv);
    }
`),_e=D(e.FRAGMENT_SHADER,`
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    uniform sampler2D uTarget;
    uniform float aspectRatio;
    uniform vec3 color;
    uniform vec2 point;
    uniform float radius;

    void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
    }
`),he=D(e.FRAGMENT_SHADER,`
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    uniform sampler2D uVelocity;
    uniform sampler2D uSource;
    uniform vec2 texelSize;
    uniform float dt;
    uniform float dissipation;

    vec4 bilerp (in sampler2D sam, in vec2 p) {
        vec4 st;
        st.xy = floor(p - 0.5) + 0.5;
        st.zw = st.xy + 1.0;
        vec4 uv = st * texelSize.xyxy;
        vec4 a = texture2D(sam, uv.xy);
        vec4 b = texture2D(sam, uv.zy);
        vec4 c = texture2D(sam, uv.xw);
        vec4 d = texture2D(sam, uv.zw);
        vec2 f = p - st.xy;
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    void main () {
        vec2 coord = gl_FragCoord.xy - dt * texture2D(uVelocity, vUv).xy;
        gl_FragColor = dissipation * bilerp(uSource, coord);
        gl_FragColor.a = 1.0;
    }
`),ge=D(e.FRAGMENT_SHADER,`
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    uniform sampler2D uVelocity;
    uniform sampler2D uSource;
    uniform vec2 texelSize;
    uniform float dt;
    uniform float dissipation;

    void main () {
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        gl_FragColor = dissipation * texture2D(uSource, coord);
        gl_FragColor.a = 1.0;
    }
`),xe=D(e.FRAGMENT_SHADER,`
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uVelocity;

    vec2 sampleVelocity (in vec2 uv) {
        vec2 multiplier = vec2(1.0, 1.0);
        if (uv.x < 0.0) { uv.x = 0.0; multiplier.x = -1.0; }
        if (uv.x > 1.0) { uv.x = 1.0; multiplier.x = -1.0; }
        if (uv.y < 0.0) { uv.y = 0.0; multiplier.y = -1.0; }
        if (uv.y > 1.0) { uv.y = 1.0; multiplier.y = -1.0; }
        return multiplier * texture2D(uVelocity, uv).xy;
    }

    void main () {
        float L = sampleVelocity(vL).x;
        float R = sampleVelocity(vR).x;
        float T = sampleVelocity(vT).y;
        float B = sampleVelocity(vB).y;
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
    }
`),Te=D(e.FRAGMENT_SHADER,`
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uVelocity;

    void main () {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        float vorticity = R - L - T + B;
        gl_FragColor = vec4(vorticity, 0.0, 0.0, 1.0);
    }
`),Ee=D(e.FRAGMENT_SHADER,`
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uVelocity;
    uniform sampler2D uCurl;
    uniform float curl;
    uniform float dt;

    void main () {
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = vec2(abs(T) - abs(B), 0.0);
        force *= 1.0 / length(force + 0.00001) * curl * C;
        vec2 vel = texture2D(uVelocity, vUv).xy;
        gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
    }
`),Re=D(e.FRAGMENT_SHADER,`
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uPressure;
    uniform sampler2D uDivergence;

    vec2 boundary (in vec2 uv) {
        uv = min(max(uv, 0.0), 1.0);
        return uv;
    }

    void main () {
        float L = texture2D(uPressure, boundary(vL)).x;
        float R = texture2D(uPressure, boundary(vR)).x;
        float T = texture2D(uPressure, boundary(vT)).x;
        float B = texture2D(uPressure, boundary(vB)).x;
        float C = texture2D(uPressure, vUv).x;
        float divergence = texture2D(uDivergence, vUv).x;
        float pressure = (L + R + B + T - divergence) * 0.25;
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
    }
`),ye=D(e.FRAGMENT_SHADER,`
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uPressure;
    uniform sampler2D uVelocity;

    vec2 boundary (in vec2 uv) {
        uv = min(max(uv, 0.0), 1.0);
        return uv;
    }

    void main () {
        float L = texture2D(uPressure, boundary(vL)).x;
        float R = texture2D(uPressure, boundary(vR)).x;
        float T = texture2D(uPressure, boundary(vT)).x;
        float B = texture2D(uPressure, boundary(vB)).x;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity.xy -= vec2(R - L, T - B);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
    }
`);let E,R,C,h,J,Q,F;ae();const Z=new L(B,fe),ie=new L(B,pe),$=new L(B,_e),I=new L(B,y.supportLinearFiltering?ge:he),ee=new L(B,xe),te=new L(B,Te),k=new L(B,Ee),W=new L(B,Re),Y=new L(B,ye);function ae(){E=e.drawingBufferWidth>>l.TEXTURE_DOWNSAMPLE,R=e.drawingBufferHeight>>l.TEXTURE_DOWNSAMPLE;const t=y.halfFloatTexType,a=y.formatRGBA,r=y.formatRG,o=y.formatR;C=re(2,E,R,a.internalFormat,a.format,t,y.supportLinearFiltering?e.LINEAR:e.NEAREST),h=re(0,E,R,r.internalFormat,r.format,t,y.supportLinearFiltering?e.LINEAR:e.NEAREST),J=j(4,E,R,o.internalFormat,o.format,t,e.NEAREST),Q=j(5,E,R,o.internalFormat,o.format,t,e.NEAREST),F=re(6,E,R,o.internalFormat,o.format,t,e.NEAREST)}function j(t,a,r,o,m,T,x){e.activeTexture(e.TEXTURE0+t);let w=e.createTexture();e.bindTexture(e.TEXTURE_2D,w),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,x),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,x),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,o,a,r,0,m,T,null);let U=e.createFramebuffer();return e.bindFramebuffer(e.FRAMEBUFFER,U),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,w,0),e.viewport(0,0,a,r),e.clear(e.COLOR_BUFFER_BIT),[w,U,t]}function re(t,a,r,o,m,T,x){let w=j(t,a,r,o,m,T,x),U=j(t+1,a,r,o,m,T,x);return{get read(){return w},get write(){return U},swap(){let z=w;w=U,U=z}}}const S=(e.bindBuffer(e.ARRAY_BUFFER,e.createBuffer()),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),e.STATIC_DRAW),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,e.createBuffer()),e.bufferData(e.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),e.STATIC_DRAW),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.enableVertexAttribArray(0),t=>{e.bindFramebuffer(e.FRAMEBUFFER,t),e.drawElements(e.TRIANGLES,6,e.UNSIGNED_SHORT,0)});let ne=Date.now();le(parseInt(Math.random()*20)+5),se();function se(){be();const t=Math.min((Date.now()-ne)/1e3,.016);ne=Date.now(),e.viewport(0,0,E,R),A.length>0&&le(A.pop()),I.bind(),e.uniform2f(I.uniforms.texelSize,1/E,1/R),e.uniform1i(I.uniforms.uVelocity,h.read[2]),e.uniform1i(I.uniforms.uSource,h.read[2]),e.uniform1f(I.uniforms.dt,t),e.uniform1f(I.uniforms.dissipation,l.VELOCITY_DISSIPATION),S(h.write[1]),h.swap(),e.uniform1i(I.uniforms.uVelocity,h.read[2]),e.uniform1i(I.uniforms.uSource,C.read[2]),e.uniform1f(I.uniforms.dissipation,l.DENSITY_DISSIPATION),S(C.write[1]),C.swap();for(let r=0;r<s.length;r++){const o=s[r];o.moved&&(ce(o.x,o.y,o.dx,o.dy,o.color),o.moved=!1)}te.bind(),e.uniform2f(te.uniforms.texelSize,1/E,1/R),e.uniform1i(te.uniforms.uVelocity,h.read[2]),S(Q[1]),k.bind(),e.uniform2f(k.uniforms.texelSize,1/E,1/R),e.uniform1i(k.uniforms.uVelocity,h.read[2]),e.uniform1i(k.uniforms.uCurl,Q[2]),e.uniform1f(k.uniforms.curl,l.CURL),e.uniform1f(k.uniforms.dt,t),S(h.write[1]),h.swap(),ee.bind(),e.uniform2f(ee.uniforms.texelSize,1/E,1/R),e.uniform1i(ee.uniforms.uVelocity,h.read[2]),S(J[1]),Z.bind();let a=F.read[2];e.activeTexture(e.TEXTURE0+a),e.bindTexture(e.TEXTURE_2D,F.read[0]),e.uniform1i(Z.uniforms.uTexture,a),e.uniform1f(Z.uniforms.value,l.PRESSURE_DISSIPATION),S(F.write[1]),F.swap(),W.bind(),e.uniform2f(W.uniforms.texelSize,1/E,1/R),e.uniform1i(W.uniforms.uDivergence,J[2]),a=F.read[2],e.uniform1i(W.uniforms.uPressure,a),e.activeTexture(e.TEXTURE0+a);for(let r=0;r<l.PRESSURE_ITERATIONS;r++)e.bindTexture(e.TEXTURE_2D,F.read[0]),S(F.write[1]),F.swap();Y.bind(),e.uniform2f(Y.uniforms.texelSize,1/E,1/R),e.uniform1i(Y.uniforms.uPressure,F.read[2]),e.uniform1i(Y.uniforms.uVelocity,h.read[2]),S(h.write[1]),h.swap(),e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),ie.bind(),e.uniform1i(ie.uniforms.uTexture,C.read[2]),S(null),requestAnimationFrame(se)}function ce(t,a,r,o,m){$.bind(),e.uniform1i($.uniforms.uTarget,h.read[2]),e.uniform1f($.uniforms.aspectRatio,i.width/i.height),e.uniform2f($.uniforms.point,t/i.width,1-a/i.height),e.uniform3f($.uniforms.color,r,-o,1),e.uniform1f($.uniforms.radius,l.SPLAT_RADIUS),S(h.write[1]),h.swap(),e.uniform1i($.uniforms.uTarget,C.read[2]),e.uniform3f($.uniforms.color,m[0]*.3,m[1]*.3,m[2]*.3),S(C.write[1]),C.swap()}function le(t){for(let a=0;a<t;a++){const r=[Math.random()*10,Math.random()*10,Math.random()*10],o=i.width*Math.random(),m=i.height*Math.random(),T=1e3*(Math.random()-.5),x=1e3*(Math.random()-.5);ce(o,m,T,x,r)}}function be(){(i.width!=i.clientWidth||i.height!=i.clientHeight)&&(i.width=i.clientWidth,i.height=i.clientHeight,ae())}i.addEventListener("touchmove",t=>{t.preventDefault();const a=t.targetTouches;for(let r=0;r<a.length;r++){let o=s[r];o.moved=o.down,o.dx=(a[r].pageX-o.x)*10,o.dy=(a[r].pageY-o.y)*10,o.x=a[r].pageX,o.y=a[r].pageY}},!1);let ue=-1;function De(){const t=window.performance.now();return t-ue>1e3?(ue=t,!0):!1}i.addEventListener("mousemove",t=>{s[0].moved=!0,s[0].dx=(t.offsetX-s[0].x)*10,s[0].dy=(t.offsetY-s[0].y)*10,s[0].x=t.offsetX,s[0].y=t.offsetY,De()&&(s[0].color=[Math.random()+.2,Math.random()+.2,Math.random()+.2])}),i.addEventListener("mousedown",()=>{s[0].down=!0,s[0].color=[Math.random()+.2,Math.random()+.2,Math.random()+.2]}),i.addEventListener("touchstart",t=>{t.preventDefault();const a=t.targetTouches;for(let r=0;r<a.length;r++)r>=s.length&&s.push(new oe),s[r].id=a[r].identifier,s[r].down=!0,s[r].x=a[r].pageX,s[r].y=a[r].pageY,s[r].color=[Math.random()+.2,Math.random()+.2,Math.random()+.2]}),window.addEventListener("mouseup",()=>{s[0].down=!1}),window.addEventListener("touchend",t=>{const a=t.changedTouches;for(let r=0;r<a.length;r++)for(let o=0;o<s.length;o++)a[r].identifier==s[o].id&&(s[o].down=!1)})}return(i,l)=>(f(),g("canvas",{id:"spark",ref_key:"canvasRef",ref:c},null,512))}},Ae=P(we,[["__scopeId","data-v-d7f49eb0"]]),Fe={};function Ue(b,c){return f(),g("span",null,c[0]||(c[0]=[me('<div id="mouse-scroll" data-v-e110276f><div class="mouse" data-v-e110276f><div class="mouse-in" data-v-e110276f></div></div><div data-v-e110276f><span class="down-arrow-1" data-v-e110276f></span><span class="down-arrow-2" data-v-e110276f></span><span class="down-arrow-3" data-v-e110276f></span></div></div>',1)]))}const Pe=P(Fe,[["render",Ue],["__scopeId","data-v-e110276f"]]),Le={class:"hello-wrapper"},Be=["data-text"],Ie=["data-text"],Me={__name:"welcome-page",setup(b){const c=G(),{proxy:u}=c,i=()=>{let l=document.documentElement.clientHeight;window.scrollTo({top:l,behavior:"smooth"})};return(l,s)=>(f(),g("section",Le,[n("span",{class:"hello_text","data-text":d(u).$global.welcomeText},v(d(u).$global.welcomeText),9,Be),n("span",{class:"sub_text","data-text":d(u).$global.subText},v(d(u).$global.subText),9,Ie),p(Pe,{class:"down-arrow",onClick:i}),p(Ae)]))}},Ce=P(Me,[["__scopeId","data-v-8f0ae8cb"]]),$e={class:"img-wrapper"},Ne={class:"black-bg"},Ge={class:"row-warpper"},ke={class:"row"},Xe={class:"row-col-right"},Oe={class:"text-tip"},Ve={class:"text-main"},ze={__name:"middle-img-page",setup(b){const c=G(),{proxy:u}=c,i=K(!1);return window.addEventListener("scroll",l=>{const s=document.documentElement.clientHeight;document.documentElement.scrollTop>s?i.value=!0:i.value=!1}),(l,s)=>(f(),g("section",$e,[n("div",Ne,[n("div",Ge,[n("div",ke,[s[0]||(s[0]=n("div",{class:"row-col-left"},null,-1)),n("div",Xe,[n("div",{class:N(["banner-text",{trans:d(i),default:!d(i)}])},[n("p",Oe,v(d(u).$global.middleImgPage.title),1),n("p",Ve,v(d(u).$global.middleImgPage.content),1)],2)])])])])]))}},He=P(ze,[["__scopeId","data-v-69b22d08"]]),We="/resume/images/person.png",Ye={class:"wrapper"},je={class:"tips-label"},qe={class:"tips-content"},Ke={__name:"tips",setup(b){const c=G(),{proxy:u}=c;return(i,l)=>(f(),g("div",Ye,[n("h3",je,v(d(u).$global.tips.label),1),n("p",qe,v(d(u).$global.tips.content),1)]))}},Je=P(Ke,[["__scopeId","data-v-5d2b29b0"]]),Qe={class:"about-me-wrapper"},Ze={class:"about-me-content"},et=["src"],tt={class:"about-me-description"},rt={__name:"about-me",setup(b){const c=G(),{proxy:u}=c,i=K("horizontal"),l=()=>{document.documentElement.clientWidth<=768?i.value="vertical":i.value="horizontal"};return window.onresize=()=>{console.log("resize"),l()},de(()=>{l()}),(s,A)=>{const e=X("el-step"),y=X("el-steps");return f(),g("section",Qe,[n("h3",null,v(d(u).$global.aboutMe.label),1),n("div",Ze,[p(y,{"align-center":"",active:"5",direction:d(i)},{default:O(()=>[(f(!0),g(H,null,q(d(u).$global.aboutMe.steps,(M,_)=>(f(),ve(e,{key:_,id:"el-step-"+_},{icon:O(()=>[n("img",{src:M.icon,class:"step-icon"},null,8,et)]),title:O(()=>[n("span",null,v(M.title),1)]),description:O(()=>[n("div",tt,[n("span",null,v(M.description.label),1),n("span",null,v(M.description.content),1)])]),_:2},1032,["id"]))),128))]),_:1},8,["direction"])])])}}},ot=P(rt,[["__scopeId","data-v-87840a0c"]]),it=["src"],at={__name:"figure-item",props:{img:{type:String,default:""},description:{type:String,default:""},mask:{type:Boolean,default:!0},animation:{type:Boolean,default:!0},maskDirection:{type:String,default:"top"},color:{type:String,default:""}},setup(b){const c=b;return(u,i)=>(f(),g("figure",{class:N(["figure-item",{"no-mask":!c.mask}])},[n("img",{src:c.img,alt:"logo"},null,8,it),n("div",{class:N({[`mask-${c.maskDirection}`]:c.animation,mask:!c.animation})},i[0]||(i[0]=[me('<div class="mask-card" data-v-6a103620></div><div class="mask-card" data-v-6a103620></div><div class="mask-card" data-v-6a103620></div><div class="mask-card" data-v-6a103620></div><div class="mask-card" data-v-6a103620></div>',5)]),2),n("figcaption",{class:"figure-description",style:Se(c.color?`color: ${c.color}`:"")},[n("span",null,v(c.description),1)],4)],2))}},nt=P(at,[["__scopeId","data-v-6a103620"]]),st={class:"project-warrper"},ct={class:"project-list"},lt={__name:"about-project",setup(b){const c=G().proxy;return(u,i)=>(f(),g("section",st,[n("h3",null,v(d(c).$global.aboutProject.label),1),n("div",ct,[(f(!0),g(H,null,q(d(c).$global.aboutProject.list,(l,s)=>(f(),ve(nt,{key:s,img:l.img,mask:l.mask,animation:l.animation,"mask-direction":l.maskDirection,description:l.description,class:"project-card"},null,8,["img","mask","animation","mask-direction","description"]))),128))])]))}},ut=P(lt,[["__scopeId","data-v-71bbe6ac"]]),dt={class:"main-content"},mt={class:"container-row"},vt={class:"container-left"},ft={class:"sidebar"},pt={class:"sidebar-name"},_t={class:"sidebar-label"},ht={class:"sidebar-social"},gt={class:"item-label"},xt={class:"item-label-light"},Tt={class:"sidebar-download"},Et={class:"downResume"},Rt={class:"container-right"},yt={class:"container-right-content"},bt={class:"card-item"},Dt={class:"card-item-title"},St={class:"card-item-content"},wt={__name:"main-content",setup(b){const c=G(),{proxy:u}=c,i=K(!1);return window.addEventListener("scroll",l=>{const s=document.documentElement.clientHeight;document.documentElement.scrollTop>s?i.value=!0:i.value=!1}),(l,s)=>{const A=X("el-divider"),e=X("LogoGithub"),y=X("Icon"),M=X("Blog");return f(),g("section",dt,[n("section",mt,[n("div",vt,[n("div",ft,[n("div",{class:N(["sidebar-card",{"sidebar-trans":d(i)}])},[n("div",{class:N(["sidebar-avatar",{"img-trans":d(i)}])},s[0]||(s[0]=[n("img",{class:"sidebar-avatar-img",src:We},null,-1)]),2),n("div",pt,v(d(u).$global.name),1),n("div",_t,v(d(u).$global.hi),1),p(A,{class:"divider","border-style":"dashed"}),n("div",ht,[p(y,{size:"28"},{default:O(()=>[p(e)]),_:1}),p(y,{size:"28",style:{"margin-left":"10px"}},{default:O(()=>[p(M)]),_:1})]),p(A,{class:"divider","border-style":"dashed"}),n("ul",null,[(f(!0),g(H,null,q(d(u).$global.info,(_,V)=>(f(),g("li",{class:"other-item",key:V},[n("span",gt,v(_.label)+":",1),n("span",xt,v(_.value),1)]))),128))]),p(A,{class:"divider","border-style":"dashed"}),n("div",Tt,[n("span",Et,v(d(u).$global.downloadResume),1)])],2)])]),n("div",Rt,[n("div",yt,[n("div",{class:N(["brand-card-list",{"skill-trans":d(i)}])},[(f(!0),g(H,null,q(d(u).$global.skillList,(_,V)=>(f(),g("div",{class:"brand-card-item",key:V},[n("div",bt,[n("h3",Dt,v(_.title),1),p(A,{class:"divider right-card-item-divider","border-style":"dashed"}),n("div",St,v(_.name),1)])]))),128))],2),p(Je,{class:N({"skill-trans":d(i)})},null,8,["class"])])])]),p(ot),p(ut)])}}},At=P(wt,[["__scopeId","data-v-cd4c0ead"]]),Ft={class:"footer-wrapper"},Ut={class:"footer-content"},Pt={__name:"home-footer",setup(b){const c=G().proxy;return(u,i)=>(f(),g("section",Ft,[n("div",Ut,[n("p",null,v(d(c).$global.homefooterText),1)])]))}},Lt=P(Pt,[["__scopeId","data-v-8863421a"]]),It={__name:"index",setup(b){return(c,u)=>(f(),g(H,null,[p(Ce),p(He),p(At),p(Lt)],64))}};export{It as default};
