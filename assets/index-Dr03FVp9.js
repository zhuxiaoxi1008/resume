import{_ as $,r as re,o as ye,a as g,c as y,b as be,d as s,t as _,u as l,e as p,g as H,n as V,f as N,w as G,F as Y,h as te,i as De}from"./index-n0AzO4Sg.js";const Se={__name:"spark",setup(I){let v=re(null);ye(()=>{c()});function c(){const a=v.value;a.width=a.clientWidth,a.height=a.clientHeight;let d={TEXTURE_DOWNSAMPLE:1,DENSITY_DISSIPATION:.98,VELOCITY_DISSIPATION:.99,PRESSURE_DISSIPATION:.8,PRESSURE_ITERATIONS:25,CURL:30,SPLAT_RADIUS:.005},n=[],b=[];const{gl:e,ext:x}=j(a);function j(t){const i={alpha:!1,depth:!1,stencil:!1,antialias:!1};let r=t.getContext("webgl2",i);const o=!!r;o||(r=t.getContext("webgl",i)||t.getContext("experimental-webgl",i));let u,h;o?(r.getExtension("EXT_color_buffer_float"),h=r.getExtension("OES_texture_float_linear")):(u=r.getExtension("OES_texture_half_float"),h=r.getExtension("OES_texture_half_float_linear")),r.clearColor(0,0,0,1);const f=o?r.HALF_FLOAT:u.HALF_FLOAT_OES;let A,F,O;return o?(A=T(r,r.RGBA16F,r.RGBA,f),F=T(r,r.RG16F,r.RG,f),O=T(r,r.R16F,r.RED,f)):(A=T(r,r.RGBA,r.RGBA,f),F=T(r,r.RGBA,r.RGBA,f),O=T(r,r.RGBA,r.RGBA,f)),{gl:r,ext:{formatRGBA:A,formatRG:F,formatR:O,halfFloatTexType:f,supportLinearFiltering:h}}}function T(t,i,r,o){if(!X(t,i,r,o))switch(i){case t.R16F:return T(t,t.RG16F,t.RG,o);case t.RG16F:return T(t,t.RGBA16F,t.RGBA,o);default:return null}return{internalFormat:i,format:r}}function X(t,i,r,o){let u=t.createTexture();t.bindTexture(t.TEXTURE_2D,u),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texImage2D(t.TEXTURE_2D,0,i,4,4,0,r,o,null);let h=t.createFramebuffer();return t.bindFramebuffer(t.FRAMEBUFFER,h),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,u,0),t.checkFramebufferStatus(t.FRAMEBUFFER)==t.FRAMEBUFFER_COMPLETE}function oe(){this.id=-1,this.x=0,this.y=0,this.dx=0,this.dy=0,this.down=!1,this.moved=!1,this.color=[30,0,300]}n.push(new oe);class U{constructor(i,r){if(this.uniforms={},this.program=e.createProgram(),e.attachShader(this.program,i),e.attachShader(this.program,r),e.linkProgram(this.program),!e.getProgramParameter(this.program,e.LINK_STATUS))throw e.getProgramInfoLog(this.program);const o=e.getProgramParameter(this.program,e.ACTIVE_UNIFORMS);for(let u=0;u<o;u++){const h=e.getActiveUniform(this.program,u).name;this.uniforms[h]=e.getUniformLocation(this.program,h)}}bind(){e.useProgram(this.program)}}function D(t,i){const r=e.createShader(t);if(e.shaderSource(r,i),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS))throw e.getShaderInfoLog(r);return r}const L=D(e.VERTEX_SHADER,`
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
`),de=D(e.FRAGMENT_SHADER,`
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float value;

    void main () {
        gl_FragColor = value * texture2D(uTexture, vUv);
    }
`),me=D(e.FRAGMENT_SHADER,`
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    uniform sampler2D uTexture;

    void main () {
        gl_FragColor = texture2D(uTexture, vUv);
    }
`),ve=D(e.FRAGMENT_SHADER,`
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
`),fe=D(e.FRAGMENT_SHADER,`
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
`),pe=D(e.FRAGMENT_SHADER,`
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
`),_e=D(e.FRAGMENT_SHADER,`
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
`),he=D(e.FRAGMENT_SHADER,`
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
`),Te=D(e.FRAGMENT_SHADER,`
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
`),ge=D(e.FRAGMENT_SHADER,`
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
`),xe=D(e.FRAGMENT_SHADER,`
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
`);let E,R,B,m,q,K,w;ae();const J=new U(L,de),ie=new U(L,me),M=new U(L,ve),P=new U(L,x.supportLinearFiltering?pe:fe),Q=new U(L,_e),Z=new U(L,he),C=new U(L,Te),z=new U(L,ge),k=new U(L,xe);function ae(){E=e.drawingBufferWidth>>d.TEXTURE_DOWNSAMPLE,R=e.drawingBufferHeight>>d.TEXTURE_DOWNSAMPLE;const t=x.halfFloatTexType,i=x.formatRGBA,r=x.formatRG,o=x.formatR;B=ee(2,E,R,i.internalFormat,i.format,t,x.supportLinearFiltering?e.LINEAR:e.NEAREST),m=ee(0,E,R,r.internalFormat,r.format,t,x.supportLinearFiltering?e.LINEAR:e.NEAREST),q=W(4,E,R,o.internalFormat,o.format,t,e.NEAREST),K=W(5,E,R,o.internalFormat,o.format,t,e.NEAREST),w=ee(6,E,R,o.internalFormat,o.format,t,e.NEAREST)}function W(t,i,r,o,u,h,f){e.activeTexture(e.TEXTURE0+t);let A=e.createTexture();e.bindTexture(e.TEXTURE_2D,A),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,f),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,f),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,o,i,r,0,u,h,null);let F=e.createFramebuffer();return e.bindFramebuffer(e.FRAMEBUFFER,F),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,A,0),e.viewport(0,0,i,r),e.clear(e.COLOR_BUFFER_BIT),[A,F,t]}function ee(t,i,r,o,u,h,f){let A=W(t,i,r,o,u,h,f),F=W(t+1,i,r,o,u,h,f);return{get read(){return A},get write(){return F},swap(){let O=A;A=F,F=O}}}const S=(e.bindBuffer(e.ARRAY_BUFFER,e.createBuffer()),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),e.STATIC_DRAW),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,e.createBuffer()),e.bufferData(e.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),e.STATIC_DRAW),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.enableVertexAttribArray(0),t=>{e.bindFramebuffer(e.FRAMEBUFFER,t),e.drawElements(e.TRIANGLES,6,e.UNSIGNED_SHORT,0)});let ne=Date.now();le(parseInt(Math.random()*20)+5),se();function se(){Ee();const t=Math.min((Date.now()-ne)/1e3,.016);ne=Date.now(),e.viewport(0,0,E,R),b.length>0&&le(b.pop()),P.bind(),e.uniform2f(P.uniforms.texelSize,1/E,1/R),e.uniform1i(P.uniforms.uVelocity,m.read[2]),e.uniform1i(P.uniforms.uSource,m.read[2]),e.uniform1f(P.uniforms.dt,t),e.uniform1f(P.uniforms.dissipation,d.VELOCITY_DISSIPATION),S(m.write[1]),m.swap(),e.uniform1i(P.uniforms.uVelocity,m.read[2]),e.uniform1i(P.uniforms.uSource,B.read[2]),e.uniform1f(P.uniforms.dissipation,d.DENSITY_DISSIPATION),S(B.write[1]),B.swap();for(let r=0;r<n.length;r++){const o=n[r];o.moved&&(ce(o.x,o.y,o.dx,o.dy,o.color),o.moved=!1)}Z.bind(),e.uniform2f(Z.uniforms.texelSize,1/E,1/R),e.uniform1i(Z.uniforms.uVelocity,m.read[2]),S(K[1]),C.bind(),e.uniform2f(C.uniforms.texelSize,1/E,1/R),e.uniform1i(C.uniforms.uVelocity,m.read[2]),e.uniform1i(C.uniforms.uCurl,K[2]),e.uniform1f(C.uniforms.curl,d.CURL),e.uniform1f(C.uniforms.dt,t),S(m.write[1]),m.swap(),Q.bind(),e.uniform2f(Q.uniforms.texelSize,1/E,1/R),e.uniform1i(Q.uniforms.uVelocity,m.read[2]),S(q[1]),J.bind();let i=w.read[2];e.activeTexture(e.TEXTURE0+i),e.bindTexture(e.TEXTURE_2D,w.read[0]),e.uniform1i(J.uniforms.uTexture,i),e.uniform1f(J.uniforms.value,d.PRESSURE_DISSIPATION),S(w.write[1]),w.swap(),z.bind(),e.uniform2f(z.uniforms.texelSize,1/E,1/R),e.uniform1i(z.uniforms.uDivergence,q[2]),i=w.read[2],e.uniform1i(z.uniforms.uPressure,i),e.activeTexture(e.TEXTURE0+i);for(let r=0;r<d.PRESSURE_ITERATIONS;r++)e.bindTexture(e.TEXTURE_2D,w.read[0]),S(w.write[1]),w.swap();k.bind(),e.uniform2f(k.uniforms.texelSize,1/E,1/R),e.uniform1i(k.uniforms.uPressure,w.read[2]),e.uniform1i(k.uniforms.uVelocity,m.read[2]),S(m.write[1]),m.swap(),e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),ie.bind(),e.uniform1i(ie.uniforms.uTexture,B.read[2]),S(null),requestAnimationFrame(se)}function ce(t,i,r,o,u){M.bind(),e.uniform1i(M.uniforms.uTarget,m.read[2]),e.uniform1f(M.uniforms.aspectRatio,a.width/a.height),e.uniform2f(M.uniforms.point,t/a.width,1-i/a.height),e.uniform3f(M.uniforms.color,r,-o,1),e.uniform1f(M.uniforms.radius,d.SPLAT_RADIUS),S(m.write[1]),m.swap(),e.uniform1i(M.uniforms.uTarget,B.read[2]),e.uniform3f(M.uniforms.color,u[0]*.3,u[1]*.3,u[2]*.3),S(B.write[1]),B.swap()}function le(t){for(let i=0;i<t;i++){const r=[Math.random()*10,Math.random()*10,Math.random()*10],o=a.width*Math.random(),u=a.height*Math.random(),h=1e3*(Math.random()-.5),f=1e3*(Math.random()-.5);ce(o,u,h,f,r)}}function Ee(){(a.width!=a.clientWidth||a.height!=a.clientHeight)&&(a.width=a.clientWidth,a.height=a.clientHeight,ae())}a.addEventListener("touchmove",t=>{t.preventDefault();const i=t.targetTouches;for(let r=0;r<i.length;r++){let o=n[r];o.moved=o.down,o.dx=(i[r].pageX-o.x)*10,o.dy=(i[r].pageY-o.y)*10,o.x=i[r].pageX,o.y=i[r].pageY}},!1);let ue=-1;function Re(){const t=window.performance.now();return t-ue>1e3?(ue=t,!0):!1}a.addEventListener("mousemove",t=>{n[0].moved=!0,n[0].dx=(t.offsetX-n[0].x)*10,n[0].dy=(t.offsetY-n[0].y)*10,n[0].x=t.offsetX,n[0].y=t.offsetY,Re()&&(n[0].color=[Math.random()+.2,Math.random()+.2,Math.random()+.2])}),a.addEventListener("mousedown",()=>{n[0].down=!0,n[0].color=[Math.random()+.2,Math.random()+.2,Math.random()+.2]}),a.addEventListener("touchstart",t=>{t.preventDefault();const i=t.targetTouches;for(let r=0;r<i.length;r++)r>=n.length&&n.push(new oe),n[r].id=i[r].identifier,n[r].down=!0,n[r].x=i[r].pageX,n[r].y=i[r].pageY,n[r].color=[Math.random()+.2,Math.random()+.2,Math.random()+.2]}),window.addEventListener("mouseup",()=>{n[0].down=!1}),window.addEventListener("touchend",t=>{const i=t.changedTouches;for(let r=0;r<i.length;r++)for(let o=0;o<n.length;o++)i[r].identifier==n[o].id&&(n[o].down=!1)})}return(a,d)=>(g(),y("canvas",{id:"spark",ref_key:"canvasRef",ref:v},null,512))}},Ae=$(Se,[["__scopeId","data-v-d7f49eb0"]]),we={};function Fe(I,v){return g(),y("span",null,v[0]||(v[0]=[be('<div id="mouse-scroll" data-v-e110276f><div class="mouse" data-v-e110276f><div class="mouse-in" data-v-e110276f></div></div><div data-v-e110276f><span class="down-arrow-1" data-v-e110276f></span><span class="down-arrow-2" data-v-e110276f></span><span class="down-arrow-3" data-v-e110276f></span></div></div>',1)]))}const Ue=$(we,[["render",Fe],["__scopeId","data-v-e110276f"]]),Le={class:"hello-wrapper"},Pe=["data-text"],Be=["data-text"],Me={__name:"welcome-page",setup(I){const v=H(),{proxy:c}=v,a=()=>{let d=document.documentElement.clientHeight;window.scrollTo({top:d,behavior:"smooth"})};return(d,n)=>(g(),y("section",Le,[s("span",{class:"hello_text","data-text":l(c).$global.welcomeText},_(l(c).$global.welcomeText),9,Pe),s("span",{class:"sub_text","data-text":l(c).$global.subText},_(l(c).$global.subText),9,Be),p(Ue,{class:"down-arrow",onClick:a}),p(Ae)]))}},Ie=$(Me,[["__scopeId","data-v-8f0ae8cb"]]),Ce={class:"img-wrapper"},Ne={class:"black-bg"},Ge={class:"row-warpper"},$e={class:"row"},Xe={class:"row-col-right"},Oe={class:"text-tip"},Ve={class:"text-main"},He={__name:"middle-img-page",setup(I){const v=H(),{proxy:c}=v,a=re(!1);return window.addEventListener("scroll",d=>{const n=document.documentElement.clientHeight;document.documentElement.scrollTop>n?a.value=!0:a.value=!1}),(d,n)=>(g(),y("section",Ce,[s("div",Ne,[s("div",Ge,[s("div",$e,[n[0]||(n[0]=s("div",{class:"row-col-left"},null,-1)),s("div",Xe,[s("div",{class:V(["banner-text",{trans:l(a),default:!l(a)}])},[s("p",Oe,_(l(c).$global.middleImgPage.title),1),s("p",Ve,_(l(c).$global.middleImgPage.content),1)],2)])])])])]))}},ze=$(He,[["__scopeId","data-v-284e491f"]]),ke="/resume/person.png",We={class:"wrapper"},Ye={class:"tips-label"},je={class:"tips-content"},qe={__name:"tips",setup(I){const v=H(),{proxy:c}=v;return(a,d)=>(g(),y("div",We,[s("h3",Ye,_(l(c).$global.tips.label),1),s("p",je,_(l(c).$global.tips.content),1)]))}},Ke=$(qe,[["__scopeId","data-v-a96b97a7"]]),Je={class:"about-me-wrapper"},Qe={class:"about-me-content"},Ze=["src"],et={__name:"about-me",setup(I){const v=H(),{proxy:c}=v;return(a,d)=>{const n=N("el-step"),b=N("el-steps");return g(),y("section",Je,[s("h3",null,_(l(c).$global.aboutMe.label),1),s("div",Qe,[p(b,{"align-center":"",active:4},{default:G(()=>[(g(!0),y(Y,null,te(l(c).$global.aboutMe.steps,(e,x)=>(g(),De(n,{key:x,id:"el-step-"+x},{title:G(()=>[s("div",null,_(e.title),1)]),description:G(()=>[s("div",null,_(e.description),1)]),icon:G(()=>[s("img",{src:e.icon,alt:"",style:{width:"100px",height:"100px"}},null,8,Ze)]),_:2},1032,["id"]))),128))]),_:1})])])}}},tt={class:"main-content"},rt={class:"container-row"},ot={class:"container-left"},it={class:"sidebar"},at={class:"sidebar-name"},nt={class:"sidebar-label"},st={class:"sidebar-social"},ct={class:"item-label"},lt={class:"item-label-light"},ut={class:"sidebar-download"},dt={class:"downResume"},mt={class:"container-right"},vt={class:"container-right-content"},ft={class:"card-item"},pt={class:"card-item-title"},_t={class:"card-item-content"},ht={__name:"main-content",setup(I){const v=H(),{proxy:c}=v,a=re(!1);return window.addEventListener("scroll",d=>{const n=document.documentElement.clientHeight;document.documentElement.scrollTop>n?a.value=!0:a.value=!1}),(d,n)=>{const b=N("el-divider"),e=N("LogoGithub"),x=N("Icon"),j=N("Blog");return g(),y("section",tt,[s("section",rt,[s("div",ot,[s("div",it,[s("div",{class:V(["sidebar-card",{"sidebar-trans":l(a)}])},[s("div",{class:V(["sidebar-avatar",{"img-trans":l(a)}])},n[0]||(n[0]=[s("img",{class:"sidebar-avatar-img","data-src":"/person.png",src:ke},null,-1)]),2),s("div",at,_(l(c).$global.name),1),s("div",nt,_(l(c).$global.hi),1),p(b,{class:"divider","border-style":"dashed"}),s("div",st,[p(x,{size:"28"},{default:G(()=>[p(e)]),_:1}),p(x,{size:"28",style:{"margin-left":"10px"}},{default:G(()=>[p(j)]),_:1})]),p(b,{class:"divider","border-style":"dashed"}),s("ul",null,[(g(!0),y(Y,null,te(l(c).$global.info,(T,X)=>(g(),y("li",{class:"other-item",key:X},[s("span",ct,_(T.label)+":",1),s("span",lt,_(T.value),1)]))),128))]),p(b,{class:"divider","border-style":"dashed"}),s("div",ut,[s("span",dt,_(l(c).$global.downloadResume),1)])],2)])]),s("div",mt,[s("div",vt,[s("div",{class:V(["brand-card-list",{"skill-trans":l(a)}])},[(g(!0),y(Y,null,te(l(c).$global.skillList,(T,X)=>(g(),y("div",{class:"brand-card-item",key:X},[s("div",ft,[s("h3",pt,_(T.title),1),p(b,{class:"divider","border-style":"dashed"}),s("div",_t,_(T.name),1)])]))),128))],2),p(Ke,{class:V({"skill-trans":l(a)})},null,8,["class"])])])]),p(et)])}}},Tt=$(ht,[["__scopeId","data-v-f7e3e79e"]]),xt={__name:"index",setup(I){return(v,c)=>(g(),y(Y,null,[p(Ie),p(ze),p(Tt)],64))}};export{xt as default};
