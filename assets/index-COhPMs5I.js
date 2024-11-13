import{_ as X,r as q,o as de,a as g,c as R,b as be,d as a,t as f,u as l,e as h,g as H,n as z,f as G,w as $,F as j,h as re,i as De}from"./index-CHt8dyRG.js";const Se={__name:"spark",setup(C){let p=q(null);de(()=>{c()});function c(){const n=p.value;n.width=n.clientWidth,n.height=n.clientHeight;let u={TEXTURE_DOWNSAMPLE:1,DENSITY_DISSIPATION:.98,VELOCITY_DISSIPATION:.99,PRESSURE_DISSIPATION:.8,PRESSURE_ITERATIONS:25,CURL:30,SPLAT_RADIUS:.005},s=[],A=[];const{gl:e,ext:y}=B(n);function B(t){const i={alpha:!1,depth:!1,stencil:!1,antialias:!1};let r=t.getContext("webgl2",i);const o=!!r;o||(r=t.getContext("webgl",i)||t.getContext("experimental-webgl",i));let d,T;o?(r.getExtension("EXT_color_buffer_float"),T=r.getExtension("OES_texture_float_linear")):(d=r.getExtension("OES_texture_half_float"),T=r.getExtension("OES_texture_half_float_linear")),r.clearColor(0,0,0,1);const _=o?r.HALF_FLOAT:d.HALF_FLOAT_OES;let S,F,V;return o?(S=m(r,r.RGBA16F,r.RGBA,_),F=m(r,r.RG16F,r.RG,_),V=m(r,r.R16F,r.RED,_)):(S=m(r,r.RGBA,r.RGBA,_),F=m(r,r.RGBA,r.RGBA,_),V=m(r,r.RGBA,r.RGBA,_)),{gl:r,ext:{formatRGBA:S,formatRG:F,formatR:V,halfFloatTexType:_,supportLinearFiltering:T}}}function m(t,i,r,o){if(!O(t,i,r,o))switch(i){case t.R16F:return m(t,t.RG16F,t.RG,o);case t.RG16F:return m(t,t.RGBA16F,t.RGBA,o);default:return null}return{internalFormat:i,format:r}}function O(t,i,r,o){let d=t.createTexture();t.bindTexture(t.TEXTURE_2D,d),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texImage2D(t.TEXTURE_2D,0,i,4,4,0,r,o,null);let T=t.createFramebuffer();return t.bindFramebuffer(t.FRAMEBUFFER,T),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,d,0),t.checkFramebufferStatus(t.FRAMEBUFFER)==t.FRAMEBUFFER_COMPLETE}function oe(){this.id=-1,this.x=0,this.y=0,this.dx=0,this.dy=0,this.down=!1,this.moved=!1,this.color=[30,0,300]}s.push(new oe);class U{constructor(i,r){if(this.uniforms={},this.program=e.createProgram(),e.attachShader(this.program,i),e.attachShader(this.program,r),e.linkProgram(this.program),!e.getProgramParameter(this.program,e.LINK_STATUS))throw e.getProgramInfoLog(this.program);const o=e.getProgramParameter(this.program,e.ACTIVE_UNIFORMS);for(let d=0;d<o;d++){const T=e.getActiveUniform(this.program,d).name;this.uniforms[T]=e.getUniformLocation(this.program,T)}}bind(){e.useProgram(this.program)}}function b(t,i){const r=e.createShader(t);if(e.shaderSource(r,i),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS))throw e.getShaderInfoLog(r);return r}const L=b(e.VERTEX_SHADER,`
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
`),me=b(e.FRAGMENT_SHADER,`
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float value;

    void main () {
        gl_FragColor = value * texture2D(uTexture, vUv);
    }
`),ve=b(e.FRAGMENT_SHADER,`
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    uniform sampler2D uTexture;

    void main () {
        gl_FragColor = texture2D(uTexture, vUv);
    }
`),fe=b(e.FRAGMENT_SHADER,`
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
`),pe=b(e.FRAGMENT_SHADER,`
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
`),_e=b(e.FRAGMENT_SHADER,`
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
`),he=b(e.FRAGMENT_SHADER,`
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
`),Te=b(e.FRAGMENT_SHADER,`
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
`),ge=b(e.FRAGMENT_SHADER,`
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
`),xe=b(e.FRAGMENT_SHADER,`
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
`),Ee=b(e.FRAGMENT_SHADER,`
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
`);let x,E,M,v,K,J,w;ne();const Q=new U(L,me),ie=new U(L,ve),I=new U(L,fe),P=new U(L,y.supportLinearFiltering?_e:pe),Z=new U(L,he),ee=new U(L,Te),N=new U(L,ge),W=new U(L,xe),k=new U(L,Ee);function ne(){x=e.drawingBufferWidth>>u.TEXTURE_DOWNSAMPLE,E=e.drawingBufferHeight>>u.TEXTURE_DOWNSAMPLE;const t=y.halfFloatTexType,i=y.formatRGBA,r=y.formatRG,o=y.formatR;M=te(2,x,E,i.internalFormat,i.format,t,y.supportLinearFiltering?e.LINEAR:e.NEAREST),v=te(0,x,E,r.internalFormat,r.format,t,y.supportLinearFiltering?e.LINEAR:e.NEAREST),K=Y(4,x,E,o.internalFormat,o.format,t,e.NEAREST),J=Y(5,x,E,o.internalFormat,o.format,t,e.NEAREST),w=te(6,x,E,o.internalFormat,o.format,t,e.NEAREST)}function Y(t,i,r,o,d,T,_){e.activeTexture(e.TEXTURE0+t);let S=e.createTexture();e.bindTexture(e.TEXTURE_2D,S),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,_),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,_),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,o,i,r,0,d,T,null);let F=e.createFramebuffer();return e.bindFramebuffer(e.FRAMEBUFFER,F),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,S,0),e.viewport(0,0,i,r),e.clear(e.COLOR_BUFFER_BIT),[S,F,t]}function te(t,i,r,o,d,T,_){let S=Y(t,i,r,o,d,T,_),F=Y(t+1,i,r,o,d,T,_);return{get read(){return S},get write(){return F},swap(){let V=S;S=F,F=V}}}const D=(e.bindBuffer(e.ARRAY_BUFFER,e.createBuffer()),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),e.STATIC_DRAW),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,e.createBuffer()),e.bufferData(e.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),e.STATIC_DRAW),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.enableVertexAttribArray(0),t=>{e.bindFramebuffer(e.FRAMEBUFFER,t),e.drawElements(e.TRIANGLES,6,e.UNSIGNED_SHORT,0)});let ae=Date.now();le(parseInt(Math.random()*20)+5),se();function se(){Re();const t=Math.min((Date.now()-ae)/1e3,.016);ae=Date.now(),e.viewport(0,0,x,E),A.length>0&&le(A.pop()),P.bind(),e.uniform2f(P.uniforms.texelSize,1/x,1/E),e.uniform1i(P.uniforms.uVelocity,v.read[2]),e.uniform1i(P.uniforms.uSource,v.read[2]),e.uniform1f(P.uniforms.dt,t),e.uniform1f(P.uniforms.dissipation,u.VELOCITY_DISSIPATION),D(v.write[1]),v.swap(),e.uniform1i(P.uniforms.uVelocity,v.read[2]),e.uniform1i(P.uniforms.uSource,M.read[2]),e.uniform1f(P.uniforms.dissipation,u.DENSITY_DISSIPATION),D(M.write[1]),M.swap();for(let r=0;r<s.length;r++){const o=s[r];o.moved&&(ce(o.x,o.y,o.dx,o.dy,o.color),o.moved=!1)}ee.bind(),e.uniform2f(ee.uniforms.texelSize,1/x,1/E),e.uniform1i(ee.uniforms.uVelocity,v.read[2]),D(J[1]),N.bind(),e.uniform2f(N.uniforms.texelSize,1/x,1/E),e.uniform1i(N.uniforms.uVelocity,v.read[2]),e.uniform1i(N.uniforms.uCurl,J[2]),e.uniform1f(N.uniforms.curl,u.CURL),e.uniform1f(N.uniforms.dt,t),D(v.write[1]),v.swap(),Z.bind(),e.uniform2f(Z.uniforms.texelSize,1/x,1/E),e.uniform1i(Z.uniforms.uVelocity,v.read[2]),D(K[1]),Q.bind();let i=w.read[2];e.activeTexture(e.TEXTURE0+i),e.bindTexture(e.TEXTURE_2D,w.read[0]),e.uniform1i(Q.uniforms.uTexture,i),e.uniform1f(Q.uniforms.value,u.PRESSURE_DISSIPATION),D(w.write[1]),w.swap(),W.bind(),e.uniform2f(W.uniforms.texelSize,1/x,1/E),e.uniform1i(W.uniforms.uDivergence,K[2]),i=w.read[2],e.uniform1i(W.uniforms.uPressure,i),e.activeTexture(e.TEXTURE0+i);for(let r=0;r<u.PRESSURE_ITERATIONS;r++)e.bindTexture(e.TEXTURE_2D,w.read[0]),D(w.write[1]),w.swap();k.bind(),e.uniform2f(k.uniforms.texelSize,1/x,1/E),e.uniform1i(k.uniforms.uPressure,w.read[2]),e.uniform1i(k.uniforms.uVelocity,v.read[2]),D(v.write[1]),v.swap(),e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),ie.bind(),e.uniform1i(ie.uniforms.uTexture,M.read[2]),D(null),requestAnimationFrame(se)}function ce(t,i,r,o,d){I.bind(),e.uniform1i(I.uniforms.uTarget,v.read[2]),e.uniform1f(I.uniforms.aspectRatio,n.width/n.height),e.uniform2f(I.uniforms.point,t/n.width,1-i/n.height),e.uniform3f(I.uniforms.color,r,-o,1),e.uniform1f(I.uniforms.radius,u.SPLAT_RADIUS),D(v.write[1]),v.swap(),e.uniform1i(I.uniforms.uTarget,M.read[2]),e.uniform3f(I.uniforms.color,d[0]*.3,d[1]*.3,d[2]*.3),D(M.write[1]),M.swap()}function le(t){for(let i=0;i<t;i++){const r=[Math.random()*10,Math.random()*10,Math.random()*10],o=n.width*Math.random(),d=n.height*Math.random(),T=1e3*(Math.random()-.5),_=1e3*(Math.random()-.5);ce(o,d,T,_,r)}}function Re(){(n.width!=n.clientWidth||n.height!=n.clientHeight)&&(n.width=n.clientWidth,n.height=n.clientHeight,ne())}n.addEventListener("touchmove",t=>{t.preventDefault();const i=t.targetTouches;for(let r=0;r<i.length;r++){let o=s[r];o.moved=o.down,o.dx=(i[r].pageX-o.x)*10,o.dy=(i[r].pageY-o.y)*10,o.x=i[r].pageX,o.y=i[r].pageY}},!1);let ue=-1;function ye(){const t=window.performance.now();return t-ue>1e3?(ue=t,!0):!1}n.addEventListener("mousemove",t=>{s[0].moved=!0,s[0].dx=(t.offsetX-s[0].x)*10,s[0].dy=(t.offsetY-s[0].y)*10,s[0].x=t.offsetX,s[0].y=t.offsetY,ye()&&(s[0].color=[Math.random()+.2,Math.random()+.2,Math.random()+.2])}),n.addEventListener("mousedown",()=>{s[0].down=!0,s[0].color=[Math.random()+.2,Math.random()+.2,Math.random()+.2]}),n.addEventListener("touchstart",t=>{t.preventDefault();const i=t.targetTouches;for(let r=0;r<i.length;r++)r>=s.length&&s.push(new oe),s[r].id=i[r].identifier,s[r].down=!0,s[r].x=i[r].pageX,s[r].y=i[r].pageY,s[r].color=[Math.random()+.2,Math.random()+.2,Math.random()+.2]}),window.addEventListener("mouseup",()=>{s[0].down=!1}),window.addEventListener("touchend",t=>{const i=t.changedTouches;for(let r=0;r<i.length;r++)for(let o=0;o<s.length;o++)i[r].identifier==s[o].id&&(s[o].down=!1)})}return(n,u)=>(g(),R("canvas",{id:"spark",ref_key:"canvasRef",ref:p},null,512))}},Ae=X(Se,[["__scopeId","data-v-d7f49eb0"]]),we={};function Fe(C,p){return g(),R("span",null,p[0]||(p[0]=[be('<div id="mouse-scroll" data-v-e110276f><div class="mouse" data-v-e110276f><div class="mouse-in" data-v-e110276f></div></div><div data-v-e110276f><span class="down-arrow-1" data-v-e110276f></span><span class="down-arrow-2" data-v-e110276f></span><span class="down-arrow-3" data-v-e110276f></span></div></div>',1)]))}const Ue=X(we,[["render",Fe],["__scopeId","data-v-e110276f"]]),Le={class:"hello-wrapper"},Pe=["data-text"],Be=["data-text"],Me={__name:"welcome-page",setup(C){const p=H(),{proxy:c}=p,n=()=>{let u=document.documentElement.clientHeight;window.scrollTo({top:u,behavior:"smooth"})};return(u,s)=>(g(),R("section",Le,[a("span",{class:"hello_text","data-text":l(c).$global.welcomeText},f(l(c).$global.welcomeText),9,Pe),a("span",{class:"sub_text","data-text":l(c).$global.subText},f(l(c).$global.subText),9,Be),h(Ue,{class:"down-arrow",onClick:n}),h(Ae)]))}},Ie=X(Me,[["__scopeId","data-v-8f0ae8cb"]]),Ce={class:"img-wrapper"},Ne={class:"black-bg"},Ge={class:"row-warpper"},$e={class:"row"},Xe={class:"row-col-right"},Oe={class:"text-tip"},Ve={class:"text-main"},ze={__name:"middle-img-page",setup(C){const p=H(),{proxy:c}=p,n=q(!1);return window.addEventListener("scroll",u=>{const s=document.documentElement.clientHeight;document.documentElement.scrollTop>s?n.value=!0:n.value=!1}),(u,s)=>(g(),R("section",Ce,[a("div",Ne,[a("div",Ge,[a("div",$e,[s[0]||(s[0]=a("div",{class:"row-col-left"},null,-1)),a("div",Xe,[a("div",{class:z(["banner-text",{trans:l(n),default:!l(n)}])},[a("p",Oe,f(l(c).$global.middleImgPage.title),1),a("p",Ve,f(l(c).$global.middleImgPage.content),1)],2)])])])])]))}},He=X(ze,[["__scopeId","data-v-69b22d08"]]),We="/resume/images/person.png",ke={class:"wrapper"},Ye={class:"tips-label"},je={class:"tips-content"},qe={__name:"tips",setup(C){const p=H(),{proxy:c}=p;return(n,u)=>(g(),R("div",ke,[a("h3",Ye,f(l(c).$global.tips.label),1),a("p",je,f(l(c).$global.tips.content),1)]))}},Ke=X(qe,[["__scopeId","data-v-5d2b29b0"]]),Je={class:"about-me-wrapper"},Qe={class:"about-me-content"},Ze=["src"],et={class:"about-me-description"},tt={__name:"about-me",setup(C){const p=H(),{proxy:c}=p,n=q("horizontal"),u=()=>{document.documentElement.clientWidth<=768?n.value="vertical":n.value="horizontal"};return window.onresize=()=>{console.log("resize"),u()},de(()=>{u()}),(s,A)=>{const e=G("el-step"),y=G("el-steps");return g(),R("section",Je,[a("h3",null,f(l(c).$global.aboutMe.label),1),a("div",Qe,[h(y,{"align-center":"",active:"5",direction:l(n)},{default:$(()=>[(g(!0),R(j,null,re(l(c).$global.aboutMe.steps,(B,m)=>(g(),De(e,{key:m,id:"el-step-"+m},{icon:$(()=>[a("img",{src:B.icon,class:"step-icon"},null,8,Ze)]),title:$(()=>[a("span",null,f(B.title),1)]),description:$(()=>[a("div",et,[a("span",null,f(B.description.label),1),a("span",null,f(B.description.content),1)])]),_:2},1032,["id"]))),128))]),_:1},8,["direction"])])])}}},rt={class:"main-content"},ot={class:"container-row"},it={class:"container-left"},nt={class:"sidebar"},at={class:"sidebar-name"},st={class:"sidebar-label"},ct={class:"sidebar-social"},lt={class:"item-label"},ut={class:"item-label-light"},dt={class:"sidebar-download"},mt={class:"downResume"},vt={class:"container-right"},ft={class:"container-right-content"},pt={class:"card-item"},_t={class:"card-item-title"},ht={class:"card-item-content"},Tt={__name:"main-content",setup(C){const p=H(),{proxy:c}=p,n=q(!1);return window.addEventListener("scroll",u=>{const s=document.documentElement.clientHeight;document.documentElement.scrollTop>s?n.value=!0:n.value=!1}),(u,s)=>{const A=G("el-divider"),e=G("LogoGithub"),y=G("Icon"),B=G("Blog");return g(),R("section",rt,[a("section",ot,[a("div",it,[a("div",nt,[a("div",{class:z(["sidebar-card",{"sidebar-trans":l(n)}])},[a("div",{class:z(["sidebar-avatar",{"img-trans":l(n)}])},s[0]||(s[0]=[a("img",{class:"sidebar-avatar-img",src:We},null,-1)]),2),a("div",at,f(l(c).$global.name),1),a("div",st,f(l(c).$global.hi),1),h(A,{class:"divider","border-style":"dashed"}),a("div",ct,[h(y,{size:"28"},{default:$(()=>[h(e)]),_:1}),h(y,{size:"28",style:{"margin-left":"10px"}},{default:$(()=>[h(B)]),_:1})]),h(A,{class:"divider","border-style":"dashed"}),a("ul",null,[(g(!0),R(j,null,re(l(c).$global.info,(m,O)=>(g(),R("li",{class:"other-item",key:O},[a("span",lt,f(m.label)+":",1),a("span",ut,f(m.value),1)]))),128))]),h(A,{class:"divider","border-style":"dashed"}),a("div",dt,[a("span",mt,f(l(c).$global.downloadResume),1)])],2)])]),a("div",vt,[a("div",ft,[a("div",{class:z(["brand-card-list",{"skill-trans":l(n)}])},[(g(!0),R(j,null,re(l(c).$global.skillList,(m,O)=>(g(),R("div",{class:"brand-card-item",key:O},[a("div",pt,[a("h3",_t,f(m.title),1),h(A,{class:"divider right-card-item-divider","border-style":"dashed"}),a("div",ht,f(m.name),1)])]))),128))],2),h(Ke,{class:z({"skill-trans":l(n)})},null,8,["class"])])])]),h(tt)])}}},gt=X(Tt,[["__scopeId","data-v-ee4cc24c"]]),Et={__name:"index",setup(C){return(p,c)=>(g(),R(j,null,[h(Ie),h(He),h(gt)],64))}};export{Et as default};
