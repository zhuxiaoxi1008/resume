import{_ as H,r as Te,o as Ee,a as M,c as z,b as xe,d as Z,t as ee,u as B,e as re,g as Re,f as _e}from"./index-CIKtNvg8.js";const ge={__name:"spark",setup(I){let h=Te(null);Ee(()=>{A()});function A(){const a=h.value;a.width=a.clientWidth,a.height=a.clientHeight;let T={TEXTURE_DOWNSAMPLE:1,DENSITY_DISSIPATION:.98,VELOCITY_DISSIPATION:.99,PRESSURE_DISSIPATION:.8,PRESSURE_ITERATIONS:25,CURL:30,SPLAT_RADIUS:.005},n=[],W=[];const{gl:e,ext:F}=te(a);function te(r){const o={alpha:!1,depth:!1,stencil:!1,antialias:!1};let t=r.getContext("webgl2",o);const i=!!t;i||(t=r.getContext("webgl",o)||r.getContext("experimental-webgl",o));let u,l;i?(t.getExtension("EXT_color_buffer_float"),l=t.getExtension("OES_texture_float_linear")):(u=t.getExtension("OES_texture_half_float"),l=t.getExtension("OES_texture_half_float_linear")),t.clearColor(0,0,0,1);const c=i?t.HALF_FLOAT:u.HALF_FLOAT_OES;let p,x,U;return i?(p=y(t,t.RGBA16F,t.RGBA,c),x=y(t,t.RG16F,t.RG,c),U=y(t,t.R16F,t.RED,c)):(p=y(t,t.RGBA,t.RGBA,c),x=y(t,t.RGBA,t.RGBA,c),U=y(t,t.RGBA,t.RGBA,c)),{gl:t,ext:{formatRGBA:p,formatRG:x,formatR:U,halfFloatTexType:c,supportLinearFiltering:l}}}function y(r,o,t,i){if(!ie(r,o,t,i))switch(o){case r.R16F:return y(r,r.RG16F,r.RG,i);case r.RG16F:return y(r,r.RGBA16F,r.RGBA,i);default:return null}return{internalFormat:o,format:t}}function ie(r,o,t,i){let u=r.createTexture();r.bindTexture(r.TEXTURE_2D,u),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.NEAREST),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE),r.texImage2D(r.TEXTURE_2D,0,o,4,4,0,t,i,null);let l=r.createFramebuffer();return r.bindFramebuffer(r.FRAMEBUFFER,l),r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,u,0),r.checkFramebufferStatus(r.FRAMEBUFFER)==r.FRAMEBUFFER_COMPLETE}function Y(){this.id=-1,this.x=0,this.y=0,this.dx=0,this.dy=0,this.down=!1,this.moved=!1,this.color=[30,0,300]}n.push(new Y);class R{constructor(o,t){if(this.uniforms={},this.program=e.createProgram(),e.attachShader(this.program,o),e.attachShader(this.program,t),e.linkProgram(this.program),!e.getProgramParameter(this.program,e.LINK_STATUS))throw e.getProgramInfoLog(this.program);const i=e.getProgramParameter(this.program,e.ACTIVE_UNIFORMS);for(let u=0;u<i;u++){const l=e.getActiveUniform(this.program,u).name;this.uniforms[l]=e.getUniformLocation(this.program,l)}}bind(){e.useProgram(this.program)}}function m(r,o){const t=e.createShader(r);if(e.shaderSource(t,o),e.compileShader(t),!e.getShaderParameter(t,e.COMPILE_STATUS))throw e.getShaderInfoLog(t);return t}const _=m(e.VERTEX_SHADER,`
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
`),oe=m(e.FRAGMENT_SHADER,`
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float value;

    void main () {
        gl_FragColor = value * texture2D(uTexture, vUv);
    }
`),ae=m(e.FRAGMENT_SHADER,`
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    uniform sampler2D uTexture;

    void main () {
        gl_FragColor = texture2D(uTexture, vUv);
    }
`),ne=m(e.FRAGMENT_SHADER,`
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
`),ue=m(e.FRAGMENT_SHADER,`
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
`),se=m(e.FRAGMENT_SHADER,`
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
`),ce=m(e.FRAGMENT_SHADER,`
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
`),le=m(e.FRAGMENT_SHADER,`
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
`),fe=m(e.FRAGMENT_SHADER,`
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
`),ve=m(e.FRAGMENT_SHADER,`
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
`),me=m(e.FRAGMENT_SHADER,`
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
`);let f,v,D,s,C,N,E;$();const G=new R(_,oe),k=new R(_,ae),S=new R(_,ne),g=new R(_,F.supportLinearFiltering?se:ue),X=new R(_,ce),O=new R(_,le),b=new R(_,fe),w=new R(_,ve),P=new R(_,me);function $(){f=e.drawingBufferWidth>>T.TEXTURE_DOWNSAMPLE,v=e.drawingBufferHeight>>T.TEXTURE_DOWNSAMPLE;const r=F.halfFloatTexType,o=F.formatRGBA,t=F.formatRG,i=F.formatR;D=V(2,f,v,o.internalFormat,o.format,r,F.supportLinearFiltering?e.LINEAR:e.NEAREST),s=V(0,f,v,t.internalFormat,t.format,r,F.supportLinearFiltering?e.LINEAR:e.NEAREST),C=L(4,f,v,i.internalFormat,i.format,r,e.NEAREST),N=L(5,f,v,i.internalFormat,i.format,r,e.NEAREST),E=V(6,f,v,i.internalFormat,i.format,r,e.NEAREST)}function L(r,o,t,i,u,l,c){e.activeTexture(e.TEXTURE0+r);let p=e.createTexture();e.bindTexture(e.TEXTURE_2D,p),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,c),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,c),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,i,o,t,0,u,l,null);let x=e.createFramebuffer();return e.bindFramebuffer(e.FRAMEBUFFER,x),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,p,0),e.viewport(0,0,o,t),e.clear(e.COLOR_BUFFER_BIT),[p,x,r]}function V(r,o,t,i,u,l,c){let p=L(r,o,t,i,u,l,c),x=L(r+1,o,t,i,u,l,c);return{get read(){return p},get write(){return x},swap(){let U=p;p=x,x=U}}}const d=(e.bindBuffer(e.ARRAY_BUFFER,e.createBuffer()),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),e.STATIC_DRAW),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,e.createBuffer()),e.bufferData(e.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),e.STATIC_DRAW),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.enableVertexAttribArray(0),r=>{e.bindFramebuffer(e.FRAMEBUFFER,r),e.drawElements(e.TRIANGLES,6,e.UNSIGNED_SHORT,0)});let j=Date.now();J(parseInt(Math.random()*20)+5),q();function q(){de();const r=Math.min((Date.now()-j)/1e3,.016);j=Date.now(),e.viewport(0,0,f,v),W.length>0&&J(W.pop()),g.bind(),e.uniform2f(g.uniforms.texelSize,1/f,1/v),e.uniform1i(g.uniforms.uVelocity,s.read[2]),e.uniform1i(g.uniforms.uSource,s.read[2]),e.uniform1f(g.uniforms.dt,r),e.uniform1f(g.uniforms.dissipation,T.VELOCITY_DISSIPATION),d(s.write[1]),s.swap(),e.uniform1i(g.uniforms.uVelocity,s.read[2]),e.uniform1i(g.uniforms.uSource,D.read[2]),e.uniform1f(g.uniforms.dissipation,T.DENSITY_DISSIPATION),d(D.write[1]),D.swap();for(let t=0;t<n.length;t++){const i=n[t];i.moved&&(K(i.x,i.y,i.dx,i.dy,i.color),i.moved=!1)}O.bind(),e.uniform2f(O.uniforms.texelSize,1/f,1/v),e.uniform1i(O.uniforms.uVelocity,s.read[2]),d(N[1]),b.bind(),e.uniform2f(b.uniforms.texelSize,1/f,1/v),e.uniform1i(b.uniforms.uVelocity,s.read[2]),e.uniform1i(b.uniforms.uCurl,N[2]),e.uniform1f(b.uniforms.curl,T.CURL),e.uniform1f(b.uniforms.dt,r),d(s.write[1]),s.swap(),X.bind(),e.uniform2f(X.uniforms.texelSize,1/f,1/v),e.uniform1i(X.uniforms.uVelocity,s.read[2]),d(C[1]),G.bind();let o=E.read[2];e.activeTexture(e.TEXTURE0+o),e.bindTexture(e.TEXTURE_2D,E.read[0]),e.uniform1i(G.uniforms.uTexture,o),e.uniform1f(G.uniforms.value,T.PRESSURE_DISSIPATION),d(E.write[1]),E.swap(),w.bind(),e.uniform2f(w.uniforms.texelSize,1/f,1/v),e.uniform1i(w.uniforms.uDivergence,C[2]),o=E.read[2],e.uniform1i(w.uniforms.uPressure,o),e.activeTexture(e.TEXTURE0+o);for(let t=0;t<T.PRESSURE_ITERATIONS;t++)e.bindTexture(e.TEXTURE_2D,E.read[0]),d(E.write[1]),E.swap();P.bind(),e.uniform2f(P.uniforms.texelSize,1/f,1/v),e.uniform1i(P.uniforms.uPressure,E.read[2]),e.uniform1i(P.uniforms.uVelocity,s.read[2]),d(s.write[1]),s.swap(),e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),k.bind(),e.uniform1i(k.uniforms.uTexture,D.read[2]),d(null),requestAnimationFrame(q)}function K(r,o,t,i,u){S.bind(),e.uniform1i(S.uniforms.uTarget,s.read[2]),e.uniform1f(S.uniforms.aspectRatio,a.width/a.height),e.uniform2f(S.uniforms.point,r/a.width,1-o/a.height),e.uniform3f(S.uniforms.color,t,-i,1),e.uniform1f(S.uniforms.radius,T.SPLAT_RADIUS),d(s.write[1]),s.swap(),e.uniform1i(S.uniforms.uTarget,D.read[2]),e.uniform3f(S.uniforms.color,u[0]*.3,u[1]*.3,u[2]*.3),d(D.write[1]),D.swap()}function J(r){for(let o=0;o<r;o++){const t=[Math.random()*10,Math.random()*10,Math.random()*10],i=a.width*Math.random(),u=a.height*Math.random(),l=1e3*(Math.random()-.5),c=1e3*(Math.random()-.5);K(i,u,l,c,t)}}function de(){(a.width!=a.clientWidth||a.height!=a.clientHeight)&&(a.width=a.clientWidth,a.height=a.clientHeight,$())}a.addEventListener("touchmove",r=>{r.preventDefault();const o=r.targetTouches;for(let t=0;t<o.length;t++){let i=n[t];i.moved=i.down,i.dx=(o[t].pageX-i.x)*10,i.dy=(o[t].pageY-i.y)*10,i.x=o[t].pageX,i.y=o[t].pageY}},!1);let Q=-1;function pe(){const r=window.performance.now();return r-Q>1e3?(Q=r,!0):!1}a.addEventListener("mousemove",r=>{n[0].moved=!0,n[0].dx=(r.offsetX-n[0].x)*10,n[0].dy=(r.offsetY-n[0].y)*10,n[0].x=r.offsetX,n[0].y=r.offsetY,pe()&&(n[0].color=[Math.random()+.2,Math.random()+.2,Math.random()+.2])}),a.addEventListener("mousedown",()=>{n[0].down=!0,n[0].color=[Math.random()+.2,Math.random()+.2,Math.random()+.2]}),a.addEventListener("touchstart",r=>{r.preventDefault();const o=r.targetTouches;for(let t=0;t<o.length;t++)t>=n.length&&n.push(new Y),n[t].id=o[t].identifier,n[t].down=!0,n[t].x=o[t].pageX,n[t].y=o[t].pageY,n[t].color=[Math.random()+.2,Math.random()+.2,Math.random()+.2]}),window.addEventListener("mouseup",()=>{n[0].down=!1}),window.addEventListener("touchend",r=>{const o=r.changedTouches;for(let t=0;t<o.length;t++)for(let i=0;i<n.length;i++)o[t].identifier==n[i].id&&(n[i].down=!1)})}return(a,T)=>(M(),z("canvas",{id:"spark",ref_key:"canvasRef",ref:h},null,512))}},he=H(ge,[["__scopeId","data-v-d7f49eb0"]]),ye={};function De(I,h){return M(),z("span",null,h[0]||(h[0]=[xe('<div id="mouse-scroll" data-v-c1e953bb><div class="mouse" data-v-c1e953bb><div class="mouse-in" data-v-c1e953bb></div></div><div data-v-c1e953bb><span class="down-arrow-1" data-v-c1e953bb></span><span class="down-arrow-2" data-v-c1e953bb></span><span class="down-arrow-3" data-v-c1e953bb></span></div></div>',1)]))}const Se=H(ye,[["render",De],["__scopeId","data-v-c1e953bb"]]),Ae={class:"hello-wrapper"},Fe=["data-text"],be=["data-text"],Ue={__name:"welcome-page",setup(I){const h=Re(),{proxy:A}=h;return(a,T)=>(M(),z("section",Ae,[Z("span",{class:"hello_text","data-text":B(A).$global.welcomeText},ee(B(A).$global.welcomeText),9,Fe),Z("span",{class:"sub_text","data-text":B(A).$global.subText},ee(B(A).$global.subText),9,be),re(Se,{class:"down-arrow"}),re(he)]))}},we=H(Ue,[["__scopeId","data-v-537e3728"]]),Le={__name:"index",setup(I){return(h,A)=>(M(),_e(we))}};export{Le as default};
