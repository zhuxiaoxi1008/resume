import{_ as G,r as Te,o as Ee,a as b,c as P,b as xe,d as k,t as re,u as C,e as N,g as Re,F as _e}from"./index-q6hUPaac.js";const ge={__name:"spark",setup(L){let d=Te(null);Ee(()=>{A()});function A(){const a=d.value;a.width=a.clientWidth,a.height=a.clientHeight;let m={TEXTURE_DOWNSAMPLE:1,DENSITY_DISSIPATION:.98,VELOCITY_DISSIPATION:.99,PRESSURE_DISSIPATION:.8,PRESSURE_ITERATIONS:25,CURL:30,SPLAT_RADIUS:.005},n=[],Y=[];const{gl:e,ext:F}=te(a);function te(r){const o={alpha:!1,depth:!1,stencil:!1,antialias:!1};let t=r.getContext("webgl2",o);const i=!!t;i||(t=r.getContext("webgl",o)||r.getContext("experimental-webgl",o));let u,l;i?(t.getExtension("EXT_color_buffer_float"),l=t.getExtension("OES_texture_float_linear")):(u=t.getExtension("OES_texture_half_float"),l=t.getExtension("OES_texture_half_float_linear")),t.clearColor(0,0,0,1);const c=i?t.HALF_FLOAT:u.HALF_FLOAT_OES;let E,R,U;return i?(E=y(t,t.RGBA16F,t.RGBA,c),R=y(t,t.RG16F,t.RG,c),U=y(t,t.R16F,t.RED,c)):(E=y(t,t.RGBA,t.RGBA,c),R=y(t,t.RGBA,t.RGBA,c),U=y(t,t.RGBA,t.RGBA,c)),{gl:t,ext:{formatRGBA:E,formatRG:R,formatR:U,halfFloatTexType:c,supportLinearFiltering:l}}}function y(r,o,t,i){if(!ie(r,o,t,i))switch(o){case r.R16F:return y(r,r.RG16F,r.RG,i);case r.RG16F:return y(r,r.RGBA16F,r.RGBA,i);default:return null}return{internalFormat:o,format:t}}function ie(r,o,t,i){let u=r.createTexture();r.bindTexture(r.TEXTURE_2D,u),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.NEAREST),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE),r.texImage2D(r.TEXTURE_2D,0,o,4,4,0,t,i,null);let l=r.createFramebuffer();return r.bindFramebuffer(r.FRAMEBUFFER,l),r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,u,0),r.checkFramebufferStatus(r.FRAMEBUFFER)==r.FRAMEBUFFER_COMPLETE}function $(){this.id=-1,this.x=0,this.y=0,this.dx=0,this.dy=0,this.down=!1,this.moved=!1,this.color=[30,0,300]}n.push(new $);class _{constructor(o,t){if(this.uniforms={},this.program=e.createProgram(),e.attachShader(this.program,o),e.attachShader(this.program,t),e.linkProgram(this.program),!e.getProgramParameter(this.program,e.LINK_STATUS))throw e.getProgramInfoLog(this.program);const i=e.getProgramParameter(this.program,e.ACTIVE_UNIFORMS);for(let u=0;u<i;u++){const l=e.getActiveUniform(this.program,u).name;this.uniforms[l]=e.getUniformLocation(this.program,l)}}bind(){e.useProgram(this.program)}}function p(r,o){const t=e.createShader(r);if(e.shaderSource(t,o),e.compileShader(t),!e.getShaderParameter(t,e.COMPILE_STATUS))throw e.getShaderInfoLog(t);return t}const g=p(e.VERTEX_SHADER,`
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
`),oe=p(e.FRAGMENT_SHADER,`
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float value;

    void main () {
        gl_FragColor = value * texture2D(uTexture, vUv);
    }
`),ae=p(e.FRAGMENT_SHADER,`
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    uniform sampler2D uTexture;

    void main () {
        gl_FragColor = texture2D(uTexture, vUv);
    }
`),ne=p(e.FRAGMENT_SHADER,`
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
`),ue=p(e.FRAGMENT_SHADER,`
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
`),se=p(e.FRAGMENT_SHADER,`
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
`),ce=p(e.FRAGMENT_SHADER,`
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
`),le=p(e.FRAGMENT_SHADER,`
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
`),fe=p(e.FRAGMENT_SHADER,`
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
`),ve=p(e.FRAGMENT_SHADER,`
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
`),me=p(e.FRAGMENT_SHADER,`
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
`);let f,v,D,s,X,O,x;q();const V=new _(g,oe),j=new _(g,ae),S=new _(g,ne),h=new _(g,F.supportLinearFiltering?se:ue),H=new _(g,ce),z=new _(g,le),w=new _(g,fe),B=new _(g,ve),M=new _(g,me);function q(){f=e.drawingBufferWidth>>m.TEXTURE_DOWNSAMPLE,v=e.drawingBufferHeight>>m.TEXTURE_DOWNSAMPLE;const r=F.halfFloatTexType,o=F.formatRGBA,t=F.formatRG,i=F.formatR;D=W(2,f,v,o.internalFormat,o.format,r,F.supportLinearFiltering?e.LINEAR:e.NEAREST),s=W(0,f,v,t.internalFormat,t.format,r,F.supportLinearFiltering?e.LINEAR:e.NEAREST),X=I(4,f,v,i.internalFormat,i.format,r,e.NEAREST),O=I(5,f,v,i.internalFormat,i.format,r,e.NEAREST),x=W(6,f,v,i.internalFormat,i.format,r,e.NEAREST)}function I(r,o,t,i,u,l,c){e.activeTexture(e.TEXTURE0+r);let E=e.createTexture();e.bindTexture(e.TEXTURE_2D,E),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,c),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,c),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,i,o,t,0,u,l,null);let R=e.createFramebuffer();return e.bindFramebuffer(e.FRAMEBUFFER,R),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,E,0),e.viewport(0,0,o,t),e.clear(e.COLOR_BUFFER_BIT),[E,R,r]}function W(r,o,t,i,u,l,c){let E=I(r,o,t,i,u,l,c),R=I(r+1,o,t,i,u,l,c);return{get read(){return E},get write(){return R},swap(){let U=E;E=R,R=U}}}const T=(e.bindBuffer(e.ARRAY_BUFFER,e.createBuffer()),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),e.STATIC_DRAW),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,e.createBuffer()),e.bufferData(e.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),e.STATIC_DRAW),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.enableVertexAttribArray(0),r=>{e.bindFramebuffer(e.FRAMEBUFFER,r),e.drawElements(e.TRIANGLES,6,e.UNSIGNED_SHORT,0)});let K=Date.now();Z(parseInt(Math.random()*20)+5),J();function J(){de();const r=Math.min((Date.now()-K)/1e3,.016);K=Date.now(),e.viewport(0,0,f,v),Y.length>0&&Z(Y.pop()),h.bind(),e.uniform2f(h.uniforms.texelSize,1/f,1/v),e.uniform1i(h.uniforms.uVelocity,s.read[2]),e.uniform1i(h.uniforms.uSource,s.read[2]),e.uniform1f(h.uniforms.dt,r),e.uniform1f(h.uniforms.dissipation,m.VELOCITY_DISSIPATION),T(s.write[1]),s.swap(),e.uniform1i(h.uniforms.uVelocity,s.read[2]),e.uniform1i(h.uniforms.uSource,D.read[2]),e.uniform1f(h.uniforms.dissipation,m.DENSITY_DISSIPATION),T(D.write[1]),D.swap();for(let t=0;t<n.length;t++){const i=n[t];i.moved&&(Q(i.x,i.y,i.dx,i.dy,i.color),i.moved=!1)}z.bind(),e.uniform2f(z.uniforms.texelSize,1/f,1/v),e.uniform1i(z.uniforms.uVelocity,s.read[2]),T(O[1]),w.bind(),e.uniform2f(w.uniforms.texelSize,1/f,1/v),e.uniform1i(w.uniforms.uVelocity,s.read[2]),e.uniform1i(w.uniforms.uCurl,O[2]),e.uniform1f(w.uniforms.curl,m.CURL),e.uniform1f(w.uniforms.dt,r),T(s.write[1]),s.swap(),H.bind(),e.uniform2f(H.uniforms.texelSize,1/f,1/v),e.uniform1i(H.uniforms.uVelocity,s.read[2]),T(X[1]),V.bind();let o=x.read[2];e.activeTexture(e.TEXTURE0+o),e.bindTexture(e.TEXTURE_2D,x.read[0]),e.uniform1i(V.uniforms.uTexture,o),e.uniform1f(V.uniforms.value,m.PRESSURE_DISSIPATION),T(x.write[1]),x.swap(),B.bind(),e.uniform2f(B.uniforms.texelSize,1/f,1/v),e.uniform1i(B.uniforms.uDivergence,X[2]),o=x.read[2],e.uniform1i(B.uniforms.uPressure,o),e.activeTexture(e.TEXTURE0+o);for(let t=0;t<m.PRESSURE_ITERATIONS;t++)e.bindTexture(e.TEXTURE_2D,x.read[0]),T(x.write[1]),x.swap();M.bind(),e.uniform2f(M.uniforms.texelSize,1/f,1/v),e.uniform1i(M.uniforms.uPressure,x.read[2]),e.uniform1i(M.uniforms.uVelocity,s.read[2]),T(s.write[1]),s.swap(),e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),j.bind(),e.uniform1i(j.uniforms.uTexture,D.read[2]),T(null),requestAnimationFrame(J)}function Q(r,o,t,i,u){S.bind(),e.uniform1i(S.uniforms.uTarget,s.read[2]),e.uniform1f(S.uniforms.aspectRatio,a.width/a.height),e.uniform2f(S.uniforms.point,r/a.width,1-o/a.height),e.uniform3f(S.uniforms.color,t,-i,1),e.uniform1f(S.uniforms.radius,m.SPLAT_RADIUS),T(s.write[1]),s.swap(),e.uniform1i(S.uniforms.uTarget,D.read[2]),e.uniform3f(S.uniforms.color,u[0]*.3,u[1]*.3,u[2]*.3),T(D.write[1]),D.swap()}function Z(r){for(let o=0;o<r;o++){const t=[Math.random()*10,Math.random()*10,Math.random()*10],i=a.width*Math.random(),u=a.height*Math.random(),l=1e3*(Math.random()-.5),c=1e3*(Math.random()-.5);Q(i,u,l,c,t)}}function de(){(a.width!=a.clientWidth||a.height!=a.clientHeight)&&(a.width=a.clientWidth,a.height=a.clientHeight,q())}a.addEventListener("touchmove",r=>{r.preventDefault();const o=r.targetTouches;for(let t=0;t<o.length;t++){let i=n[t];i.moved=i.down,i.dx=(o[t].pageX-i.x)*10,i.dy=(o[t].pageY-i.y)*10,i.x=o[t].pageX,i.y=o[t].pageY}},!1);let ee=-1;function pe(){const r=window.performance.now();return r-ee>1e3?(ee=r,!0):!1}a.addEventListener("mousemove",r=>{n[0].moved=!0,n[0].dx=(r.offsetX-n[0].x)*10,n[0].dy=(r.offsetY-n[0].y)*10,n[0].x=r.offsetX,n[0].y=r.offsetY,pe()&&(n[0].color=[Math.random()+.2,Math.random()+.2,Math.random()+.2])}),a.addEventListener("mousedown",()=>{n[0].down=!0,n[0].color=[Math.random()+.2,Math.random()+.2,Math.random()+.2]}),a.addEventListener("touchstart",r=>{r.preventDefault();const o=r.targetTouches;for(let t=0;t<o.length;t++)t>=n.length&&n.push(new $),n[t].id=o[t].identifier,n[t].down=!0,n[t].x=o[t].pageX,n[t].y=o[t].pageY,n[t].color=[Math.random()+.2,Math.random()+.2,Math.random()+.2]}),window.addEventListener("mouseup",()=>{n[0].down=!1}),window.addEventListener("touchend",r=>{const o=r.changedTouches;for(let t=0;t<o.length;t++)for(let i=0;i<n.length;i++)o[t].identifier==n[i].id&&(n[i].down=!1)})}return(a,m)=>(b(),P("canvas",{id:"spark",ref_key:"canvasRef",ref:d},null,512))}},he=G(ge,[["__scopeId","data-v-d7f49eb0"]]),ye={};function De(L,d){return b(),P("span",null,d[0]||(d[0]=[xe('<div id="mouse-scroll" data-v-e110276f><div class="mouse" data-v-e110276f><div class="mouse-in" data-v-e110276f></div></div><div data-v-e110276f><span class="down-arrow-1" data-v-e110276f></span><span class="down-arrow-2" data-v-e110276f></span><span class="down-arrow-3" data-v-e110276f></span></div></div>',1)]))}const Se=G(ye,[["render",De],["__scopeId","data-v-e110276f"]]),Ae={class:"hello-wrapper"},Fe=["data-text"],we=["data-text"],Ue={__name:"welcome-page",setup(L){const d=Re(),{proxy:A}=d,a=()=>{let m=document.documentElement.clientHeight;window.scrollTo({top:m,behavior:"smooth"})};return(m,n)=>(b(),P("section",Ae,[k("span",{class:"hello_text","data-text":C(A).$global.welcomeText},re(C(A).$global.welcomeText),9,Fe),k("span",{class:"sub_text","data-text":C(A).$global.subText},re(C(A).$global.subText),9,we),N(Se,{class:"down-arrow",onClick:a}),N(he)]))}},be=G(Ue,[["__scopeId","data-v-8f0ae8cb"]]),Pe={},Le={class:"img-wrapper"};function Be(L,d){return b(),P("section",Le,d[0]||(d[0]=[k("div",{class:"black-bg"},null,-1)]))}const Me=G(Pe,[["render",Be],["__scopeId","data-v-f0acbf84"]]),Ce={__name:"index",setup(L){return(d,A)=>(b(),P(_e,null,[N(be),N(Me)],64))}};export{Ce as default};
