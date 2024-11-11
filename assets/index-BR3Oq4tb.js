import{_ as k,r as ia,o as ga,a as U,c as P,b as W,d as A,t as ta,u as B,e as M,g as Ta,n as _a,F as Ea}from"./index-eXsmdKa4.js";const ya={__name:"spark",setup(L){let v=ia(null);ga(()=>{_()});function _(){const s=v.value;s.width=s.clientWidth,s.height=s.clientHeight;let d={TEXTURE_DOWNSAMPLE:1,DENSITY_DISSIPATION:.98,VELOCITY_DISSIPATION:.99,PRESSURE_DISSIPATION:.8,PRESSURE_ITERATIONS:25,CURL:30,SPLAT_RADIUS:.005},n=[],$=[];const{gl:a,ext:S}=ra(s);function ra(e){const r={alpha:!1,depth:!1,stencil:!1,antialias:!1};let t=e.getContext("webgl2",r);const i=!!t;i||(t=e.getContext("webgl",r)||e.getContext("experimental-webgl",r));let o,u;i?(t.getExtension("EXT_color_buffer_float"),u=t.getExtension("OES_texture_float_linear")):(o=t.getExtension("OES_texture_half_float"),u=t.getExtension("OES_texture_half_float_linear")),t.clearColor(0,0,0,1);const l=i?t.HALF_FLOAT:o.HALF_FLOAT_OES;let h,T,I;return i?(h=b(t,t.RGBA16F,t.RGBA,l),T=b(t,t.RG16F,t.RG,l),I=b(t,t.R16F,t.RED,l)):(h=b(t,t.RGBA,t.RGBA,l),T=b(t,t.RGBA,t.RGBA,l),I=b(t,t.RGBA,t.RGBA,l)),{gl:t,ext:{formatRGBA:h,formatRG:T,formatR:I,halfFloatTexType:l,supportLinearFiltering:u}}}function b(e,r,t,i){if(!sa(e,r,t,i))switch(r){case e.R16F:return b(e,e.RG16F,e.RG,i);case e.RG16F:return b(e,e.RGBA16F,e.RGBA,i);default:return null}return{internalFormat:r,format:t}}function sa(e,r,t,i){let o=e.createTexture();e.bindTexture(e.TEXTURE_2D,o),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,r,4,4,0,t,i,null);let u=e.createFramebuffer();return e.bindFramebuffer(e.FRAMEBUFFER,u),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,o,0),e.checkFramebufferStatus(e.FRAMEBUFFER)==e.FRAMEBUFFER_COMPLETE}function Z(){this.id=-1,this.x=0,this.y=0,this.dx=0,this.dy=0,this.down=!1,this.moved=!1,this.color=[30,0,300]}n.push(new Z);class E{constructor(r,t){if(this.uniforms={},this.program=a.createProgram(),a.attachShader(this.program,r),a.attachShader(this.program,t),a.linkProgram(this.program),!a.getProgramParameter(this.program,a.LINK_STATUS))throw a.getProgramInfoLog(this.program);const i=a.getProgramParameter(this.program,a.ACTIVE_UNIFORMS);for(let o=0;o<i;o++){const u=a.getActiveUniform(this.program,o).name;this.uniforms[u]=a.getUniformLocation(this.program,u)}}bind(){a.useProgram(this.program)}}function p(e,r){const t=a.createShader(e);if(a.shaderSource(t,r),a.compileShader(t),!a.getShaderParameter(t,a.COMPILE_STATUS))throw a.getShaderInfoLog(t);return t}const y=p(a.VERTEX_SHADER,`
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
`),na=p(a.FRAGMENT_SHADER,`
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float value;

    void main () {
        gl_FragColor = value * texture2D(uTexture, vUv);
    }
`),oa=p(a.FRAGMENT_SHADER,`
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    uniform sampler2D uTexture;

    void main () {
        gl_FragColor = texture2D(uTexture, vUv);
    }
`),ca=p(a.FRAGMENT_SHADER,`
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
`),da=p(a.FRAGMENT_SHADER,`
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
`),la=p(a.FRAGMENT_SHADER,`
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
`),va=p(a.FRAGMENT_SHADER,`
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
`),ua=p(a.FRAGMENT_SHADER,`
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
`),ma=p(a.FRAGMENT_SHADER,`
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
`),fa=p(a.FRAGMENT_SHADER,`
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
`),pa=p(a.FRAGMENT_SHADER,`
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
`);let m,f,w,c,G,X,g;q();const V=new E(y,na),j=new E(y,oa),D=new E(y,ca),R=new E(y,S.supportLinearFiltering?la:da),H=new E(y,va),z=new E(y,ua),F=new E(y,ma),C=new E(y,fa),N=new E(y,pa);function q(){m=a.drawingBufferWidth>>d.TEXTURE_DOWNSAMPLE,f=a.drawingBufferHeight>>d.TEXTURE_DOWNSAMPLE;const e=S.halfFloatTexType,r=S.formatRGBA,t=S.formatRG,i=S.formatR;w=Y(2,m,f,r.internalFormat,r.format,e,S.supportLinearFiltering?a.LINEAR:a.NEAREST),c=Y(0,m,f,t.internalFormat,t.format,e,S.supportLinearFiltering?a.LINEAR:a.NEAREST),G=O(4,m,f,i.internalFormat,i.format,e,a.NEAREST),X=O(5,m,f,i.internalFormat,i.format,e,a.NEAREST),g=Y(6,m,f,i.internalFormat,i.format,e,a.NEAREST)}function O(e,r,t,i,o,u,l){a.activeTexture(a.TEXTURE0+e);let h=a.createTexture();a.bindTexture(a.TEXTURE_2D,h),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,l),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,l),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE),a.texImage2D(a.TEXTURE_2D,0,i,r,t,0,o,u,null);let T=a.createFramebuffer();return a.bindFramebuffer(a.FRAMEBUFFER,T),a.framebufferTexture2D(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0,a.TEXTURE_2D,h,0),a.viewport(0,0,r,t),a.clear(a.COLOR_BUFFER_BIT),[h,T,e]}function Y(e,r,t,i,o,u,l){let h=O(e,r,t,i,o,u,l),T=O(e+1,r,t,i,o,u,l);return{get read(){return h},get write(){return T},swap(){let I=h;h=T,T=I}}}const x=(a.bindBuffer(a.ARRAY_BUFFER,a.createBuffer()),a.bufferData(a.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),a.STATIC_DRAW),a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,a.createBuffer()),a.bufferData(a.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),a.STATIC_DRAW),a.vertexAttribPointer(0,2,a.FLOAT,!1,0,0),a.enableVertexAttribArray(0),e=>{a.bindFramebuffer(a.FRAMEBUFFER,e),a.drawElements(a.TRIANGLES,6,a.UNSIGNED_SHORT,0)});let Q=Date.now();aa(parseInt(Math.random()*20)+5),K();function K(){xa();const e=Math.min((Date.now()-Q)/1e3,.016);Q=Date.now(),a.viewport(0,0,m,f),$.length>0&&aa($.pop()),R.bind(),a.uniform2f(R.uniforms.texelSize,1/m,1/f),a.uniform1i(R.uniforms.uVelocity,c.read[2]),a.uniform1i(R.uniforms.uSource,c.read[2]),a.uniform1f(R.uniforms.dt,e),a.uniform1f(R.uniforms.dissipation,d.VELOCITY_DISSIPATION),x(c.write[1]),c.swap(),a.uniform1i(R.uniforms.uVelocity,c.read[2]),a.uniform1i(R.uniforms.uSource,w.read[2]),a.uniform1f(R.uniforms.dissipation,d.DENSITY_DISSIPATION),x(w.write[1]),w.swap();for(let t=0;t<n.length;t++){const i=n[t];i.moved&&(J(i.x,i.y,i.dx,i.dy,i.color),i.moved=!1)}z.bind(),a.uniform2f(z.uniforms.texelSize,1/m,1/f),a.uniform1i(z.uniforms.uVelocity,c.read[2]),x(X[1]),F.bind(),a.uniform2f(F.uniforms.texelSize,1/m,1/f),a.uniform1i(F.uniforms.uVelocity,c.read[2]),a.uniform1i(F.uniforms.uCurl,X[2]),a.uniform1f(F.uniforms.curl,d.CURL),a.uniform1f(F.uniforms.dt,e),x(c.write[1]),c.swap(),H.bind(),a.uniform2f(H.uniforms.texelSize,1/m,1/f),a.uniform1i(H.uniforms.uVelocity,c.read[2]),x(G[1]),V.bind();let r=g.read[2];a.activeTexture(a.TEXTURE0+r),a.bindTexture(a.TEXTURE_2D,g.read[0]),a.uniform1i(V.uniforms.uTexture,r),a.uniform1f(V.uniforms.value,d.PRESSURE_DISSIPATION),x(g.write[1]),g.swap(),C.bind(),a.uniform2f(C.uniforms.texelSize,1/m,1/f),a.uniform1i(C.uniforms.uDivergence,G[2]),r=g.read[2],a.uniform1i(C.uniforms.uPressure,r),a.activeTexture(a.TEXTURE0+r);for(let t=0;t<d.PRESSURE_ITERATIONS;t++)a.bindTexture(a.TEXTURE_2D,g.read[0]),x(g.write[1]),g.swap();N.bind(),a.uniform2f(N.uniforms.texelSize,1/m,1/f),a.uniform1i(N.uniforms.uPressure,g.read[2]),a.uniform1i(N.uniforms.uVelocity,c.read[2]),x(c.write[1]),c.swap(),a.viewport(0,0,a.drawingBufferWidth,a.drawingBufferHeight),j.bind(),a.uniform1i(j.uniforms.uTexture,w.read[2]),x(null),requestAnimationFrame(K)}function J(e,r,t,i,o){D.bind(),a.uniform1i(D.uniforms.uTarget,c.read[2]),a.uniform1f(D.uniforms.aspectRatio,s.width/s.height),a.uniform2f(D.uniforms.point,e/s.width,1-r/s.height),a.uniform3f(D.uniforms.color,t,-i,1),a.uniform1f(D.uniforms.radius,d.SPLAT_RADIUS),x(c.write[1]),c.swap(),a.uniform1i(D.uniforms.uTarget,w.read[2]),a.uniform3f(D.uniforms.color,o[0]*.3,o[1]*.3,o[2]*.3),x(w.write[1]),w.swap()}function aa(e){for(let r=0;r<e;r++){const t=[Math.random()*10,Math.random()*10,Math.random()*10],i=s.width*Math.random(),o=s.height*Math.random(),u=1e3*(Math.random()-.5),l=1e3*(Math.random()-.5);J(i,o,u,l,t)}}function xa(){(s.width!=s.clientWidth||s.height!=s.clientHeight)&&(s.width=s.clientWidth,s.height=s.clientHeight,q())}s.addEventListener("touchmove",e=>{e.preventDefault();const r=e.targetTouches;for(let t=0;t<r.length;t++){let i=n[t];i.moved=i.down,i.dx=(r[t].pageX-i.x)*10,i.dy=(r[t].pageY-i.y)*10,i.x=r[t].pageX,i.y=r[t].pageY}},!1);let ea=-1;function ha(){const e=window.performance.now();return e-ea>1e3?(ea=e,!0):!1}s.addEventListener("mousemove",e=>{n[0].moved=!0,n[0].dx=(e.offsetX-n[0].x)*10,n[0].dy=(e.offsetY-n[0].y)*10,n[0].x=e.offsetX,n[0].y=e.offsetY,ha()&&(n[0].color=[Math.random()+.2,Math.random()+.2,Math.random()+.2])}),s.addEventListener("mousedown",()=>{n[0].down=!0,n[0].color=[Math.random()+.2,Math.random()+.2,Math.random()+.2]}),s.addEventListener("touchstart",e=>{e.preventDefault();const r=e.targetTouches;for(let t=0;t<r.length;t++)t>=n.length&&n.push(new Z),n[t].id=r[t].identifier,n[t].down=!0,n[t].x=r[t].pageX,n[t].y=r[t].pageY,n[t].color=[Math.random()+.2,Math.random()+.2,Math.random()+.2]}),window.addEventListener("mouseup",()=>{n[0].down=!1}),window.addEventListener("touchend",e=>{const r=e.changedTouches;for(let t=0;t<r.length;t++)for(let i=0;i<n.length;i++)r[t].identifier==n[i].id&&(n[i].down=!1)})}return(s,d)=>(U(),P("canvas",{id:"spark",ref_key:"canvasRef",ref:v},null,512))}},Ra=k(ya,[["__scopeId","data-v-d7f49eb0"]]),ba={};function wa(L,v){return U(),P("span",null,v[0]||(v[0]=[W('<div id="mouse-scroll" data-v-e110276f><div class="mouse" data-v-e110276f><div class="mouse-in" data-v-e110276f></div></div><div data-v-e110276f><span class="down-arrow-1" data-v-e110276f></span><span class="down-arrow-2" data-v-e110276f></span><span class="down-arrow-3" data-v-e110276f></span></div></div>',1)]))}const Da=k(ba,[["render",wa],["__scopeId","data-v-e110276f"]]),Sa={class:"hello-wrapper"},Aa=["data-text"],Fa=["data-text"],Ua={__name:"welcome-page",setup(L){const v=Ta(),{proxy:_}=v,s=()=>{let d=document.documentElement.clientHeight;window.scrollTo({top:d,behavior:"smooth"})};return(d,n)=>(U(),P("section",Sa,[A("span",{class:"hello_text","data-text":B(_).$global.welcomeText},ta(B(_).$global.welcomeText),9,Aa),A("span",{class:"sub_text","data-text":B(_).$global.subText},ta(B(_).$global.subText),9,Fa),M(Da,{class:"down-arrow",onClick:s}),M(Ra)]))}},Pa=k(Ua,[["__scopeId","data-v-8f0ae8cb"]]),La={},Ia={class:"img-wrapper"};function Ba(L,v){return U(),P("section",Ia,v[0]||(v[0]=[A("div",{class:"black-bg"},null,-1)]))}const Ma=k(La,[["render",Ba],["__scopeId","data-v-937bedbb"]]),ka="/resume/person.png",Ca={class:"main-content"},Na={class:"first-section"},Oa={class:"container-row"},Ga={class:"container-left"},Xa={__name:"main-content",setup(L){const v=ia(!1);return window.addEventListener("scroll",_=>{const s=document.documentElement.clientHeight,d=document.documentElement.scrollTop;console.log("scrollTop",d),console.log("clientHeight",s),console.log(d>s),d>s?v.value=!0:v.value=!1}),(_,s)=>(U(),P("section",Ca,[A("section",Na,[A("section",Oa,[A("div",Ga,[A("div",{class:_a(["sidebar",{"tranY-40":B(v)}])},s[0]||(s[0]=[W('<div class="sidebar-card" data-v-165c45aa><div class="sidebar-avatar" data-v-165c45aa><img class="sidebar-avatar-img" data-src="/person.png" src="'+ka+'" data-v-165c45aa></div><div class="sidebar-name" data-v-165c45aa>ZHOU YI</div><div class="sidebar-label" data-v-165c45aa>&quot; Hi ! 👋 &quot;</div><div class="c-divider c-mb-40" data-v-165c45aa></div><div class="sidebar-social" data-v-165c45aa><a href="https://github.com/ZHYI-source" target="_blank" data-v-165c45aa><i class="iconfont icon-github" data-v-165c45aa></i></a><a href="https://gitee.com/Z568_568" target="_blank" data-v-165c45aa><i class="iconfont icon-gitee" data-v-165c45aa></i></a></div><div class="c-divider c-mb-40 c-mt-40" data-v-165c45aa></div><ul class="sidebar-other" data-v-165c45aa><li class="other-item" data-v-165c45aa><span class="item-label" data-v-165c45aa>城市：</span><span class="item-label-light" data-v-165c45aa>贵州·贵阳</span></li><li class="other-item" data-v-165c45aa><span class="item-label" data-v-165c45aa>交流群：</span><span class="item-label-light" data-v-165c45aa>🐧 529675917</span></li><li class="other-item" data-v-165c45aa><span class="item-label" title="码云关注" data-v-165c45aa>关注我：</span><div class="item-label-light" data-v-165c45aa><div data-v-1f0a8cfc="" class="align" data-v-165c45aa></div></div></li><li class="other-item" data-v-165c45aa><span class="item-label" data-v-165c45aa>微信/QQ：</span></li><div class="social" data-v-165c45aa><img width="80" class="lazy-image" data-src="https://blogapi.zhouyi.run/v1/common/files/preview/img/1697612406209.jpg" src="https://blogapi.zhouyi.run/v1/common/files/preview/img/1697612406209.jpg" data-v-165c45aa><img width="80" class="lazy-image" data-src="https://blogapi.zhouyi.run/v1/common/files/preview/img/1697791317828.png" src="https://blogapi.zhouyi.run/v1/common/files/preview/img/1697791317828.png" data-v-165c45aa></div></ul><div class="c-divider c-mb-40" data-v-165c45aa></div><div class="sidebar-btn" style="background-color:rgb(245, 67, 37);border-color:rgb(245, 67, 37);" data-v-165c45aa><span data-v-165c45aa>在线留言</span></div><span class="downResume" style="color:rgb(245, 67, 37);" data-v-165c45aa>下载简历</span></div>',1)]),2)]),s[1]||(s[1]=W('<div class="container-right" data-v-165c45aa><div class="container-right-content" data-v-165c45aa><div class="brand-card-list" data-v-165c45aa><div class="brand-card-item" data-v-165c45aa><div class="card-item" data-v-165c45aa><h3 class="card-item-title" data-v-165c45aa>Vue、Node</h3><div class="c-divider" data-v-165c45aa></div><div class="card-item-content" data-v-165c45aa>语言框架</div></div></div><div class="brand-card-item" data-v-165c45aa><div class="card-item" data-v-165c45aa><h3 class="card-item-title" data-v-165c45aa>4 +</h3><div class="c-divider" data-v-165c45aa></div><div class="card-item-content" data-v-165c45aa>实战经验</div></div></div><div class="brand-card-item" data-v-165c45aa><div class="card-item" data-v-165c45aa><h3 class="card-item-title" data-v-165c45aa>99+</h3><div class="c-divider" data-v-165c45aa></div><div class="card-item-content" data-v-165c45aa>项目合作</div></div></div></div><section class="notice" data-v-165c45aa><div class="notice-line" data-v-165c45aa><span class="notice-title" data-v-165c45aa>📢 公告：</span><div class="notice-desc" data-v-165c45aa><div class="ant-carousel ant-carousel-vertical" data-v-165c45aa><div class="slick-slider slick-vertical slick-initialized" dir="ltr" data-v-165c45aa><div class="slick-list" style="height:22px;" data-v-165c45aa><div class="slick-track" style="opacity:1;transform:translate3d(0px, -44px, 0px);height:154px;" data-v-165c45aa><div class="slick-slide slick-cloned" tabindex="-1" data-index="-1" aria-hidden="true" style="width:516px;" data-v-165c45aa><div data-v-165c45aa><div class="notice-txt" tabindex="-1" style="width:100%;display:inline-block;" data-v-165c45aa> ⚙ ZHOUYI 更新日志 </div></div></div><div tabindex="-1" data-index="0" aria-hidden="true" class="slick-slide" style="outline:none;width:516px;" data-v-165c45aa><div data-v-165c45aa><div class="notice-txt" tabindex="-1" style="width:100%;display:inline-block;" data-v-165c45aa> ⚙ ZHOUYI 站点迁移服务器完成 </div></div></div><div tabindex="-1" data-index="1" aria-hidden="false" class="slick-slide slick-active slick-current" style="outline:none;width:516px;" data-v-165c45aa><div data-v-165c45aa><div class="notice-txt" tabindex="-1" style="width:100%;display:inline-block;" data-v-165c45aa> 哥，你不更新我就帮你更新了（博主已回复） </div></div></div><div tabindex="-1" data-index="2" aria-hidden="true" class="slick-slide" style="outline:none;width:516px;" data-v-165c45aa><div data-v-165c45aa><div class="notice-txt" tabindex="-1" style="width:100%;display:inline-block;" data-v-165c45aa> 🎉🎉有项目合作或者需要有偿解决问题的同学可以联系哦 </div></div></div><div tabindex="-1" data-index="3" aria-hidden="true" class="slick-slide" style="outline:none;width:516px;" data-v-165c45aa><div data-v-165c45aa><div class="notice-txt" tabindex="-1" style="width:100%;display:inline-block;" data-v-165c45aa> 🌟 致到访主页的朋友公告 🌟 </div></div></div><div tabindex="-1" data-index="4" aria-hidden="true" class="slick-slide" style="outline:none;width:516px;" data-v-165c45aa><div data-v-165c45aa><div class="notice-txt" tabindex="-1" style="width:100%;display:inline-block;" data-v-165c45aa> ⚙ ZHOUYI 更新日志 </div></div></div><div tabindex="-1" data-index="5" aria-hidden="true" class="slick-slide slick-cloned" style="width:516px;" data-v-165c45aa><div data-v-165c45aa><div class="notice-txt" tabindex="-1" style="width:100%;display:inline-block;" data-v-165c45aa> ⚙ ZHOUYI 站点迁移服务器完成 </div></div></div><div tabindex="-1" data-index="6" aria-hidden="true" class="slick-slide slick-cloned" style="width:516px;" data-v-165c45aa><div data-v-165c45aa><div class="notice-txt" tabindex="-1" style="width:100%;display:inline-block;" data-v-165c45aa> 哥，你不更新我就帮你更新了（博主已回复） </div></div></div><div tabindex="-1" data-index="7" aria-hidden="true" class="slick-slide slick-cloned" style="width:516px;" data-v-165c45aa><div data-v-165c45aa><div class="notice-txt" tabindex="-1" style="width:100%;display:inline-block;" data-v-165c45aa> 🎉🎉有项目合作或者需要有偿解决问题的同学可以联系哦 </div></div></div><div tabindex="-1" data-index="8" aria-hidden="true" class="slick-slide slick-cloned" style="width:516px;" data-v-165c45aa><div data-v-165c45aa><div class="notice-txt" tabindex="-1" style="width:100%;display:inline-block;" data-v-165c45aa> 🌟 致到访主页的朋友公告 🌟 </div></div></div><div tabindex="-1" data-index="9" aria-hidden="true" class="slick-slide slick-cloned" style="width:516px;" data-v-165c45aa><div data-v-165c45aa><div class="notice-txt" tabindex="-1" style="width:100%;display:inline-block;" data-v-165c45aa> ⚙ ZHOUYI 更新日志 </div></div></div></div></div></div></div></div><div class="notice-his" data-v-165c45aa> 查看所有<i class="iconfont icon-click" data-v-165c45aa></i></div></div></section><section class="brand-tips" data-v-165c45aa><h5 data-v-fad7d149="" class="section-title c-mb-40" data-v-165c45aa> 🎯 Tips <span data-v-fad7d149="" data-number="01" data-v-165c45aa></span></h5><blockquote class="my-story" data-v-165c45aa><p data-v-165c45aa>无趣的人想过着有趣的生活。</p><p data-v-165c45aa>每一步都是奇迹，每一天都是新的起点。</p><img class="wx-logo lazy-image" width="120" data-src="https://blogapi.zhouyi.run/v1/common/files/preview/img/1697612406209.jpg" src="https://blogapi.zhouyi.run/v1/common/files/preview/img/1697612406209.jpg" data-v-165c45aa></blockquote></section></div></div>',1))])])]))}},Va=k(Xa,[["__scopeId","data-v-165c45aa"]]),za={__name:"index",setup(L){return(v,_)=>(U(),P(Ea,null,[M(Pa),M(Ma),M(Va)],64))}};export{za as default};
