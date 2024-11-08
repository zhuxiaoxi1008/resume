import{_ as H,r as de,o as pe,a as M,c as z,b as Te,d as Q,t as Z,u as B,e as ee,g as Ee,f as xe}from"./index-TfRGXIzk.js";const Re={__name:"spark",setup(I){let h=de(null);pe(()=>{A()});function A(){const a=h.value;a.width=a.clientWidth,a.height=a.clientHeight;let T={TEXTURE_DOWNSAMPLE:1,DENSITY_DISSIPATION:.98,VELOCITY_DISSIPATION:.99,PRESSURE_DISSIPATION:.8,PRESSURE_ITERATIONS:25,CURL:30,SPLAT_RADIUS:.005},n=[],W=[];const{gl:e,ext:b}=re(a);function re(t){const o={alpha:!1,depth:!1,stencil:!1,antialias:!1};let r=t.getContext("webgl2",o);const i=!!r;i||(r=t.getContext("webgl",o)||t.getContext("experimental-webgl",o));let u,l;i?(r.getExtension("EXT_color_buffer_float"),l=r.getExtension("OES_texture_float_linear")):(u=r.getExtension("OES_texture_half_float"),l=r.getExtension("OES_texture_half_float_linear")),r.clearColor(0,0,0,1);const c=i?r.HALF_FLOAT:u.HALF_FLOAT_OES;let p,x,U;return i?(p=y(r,r.RGBA16F,r.RGBA,c),x=y(r,r.RG16F,r.RG,c),U=y(r,r.R16F,r.RED,c)):(p=y(r,r.RGBA,r.RGBA,c),x=y(r,r.RGBA,r.RGBA,c),U=y(r,r.RGBA,r.RGBA,c)),{gl:r,ext:{formatRGBA:p,formatRG:x,formatR:U,halfFloatTexType:c,supportLinearFiltering:l}}}function y(t,o,r,i){if(!te(t,o,r,i))switch(o){case t.R16F:return y(t,t.RG16F,t.RG,i);case t.RG16F:return y(t,t.RGBA16F,t.RGBA,i);default:return null}return{internalFormat:o,format:r}}function te(t,o,r,i){let u=t.createTexture();t.bindTexture(t.TEXTURE_2D,u),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texImage2D(t.TEXTURE_2D,0,o,4,4,0,r,i,null);let l=t.createFramebuffer();return t.bindFramebuffer(t.FRAMEBUFFER,l),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,u,0),t.checkFramebufferStatus(t.FRAMEBUFFER)==t.FRAMEBUFFER_COMPLETE}function Y(){this.id=-1,this.x=0,this.y=0,this.dx=0,this.dy=0,this.down=!1,this.moved=!1,this.color=[30,0,300]}n.push(new Y);class R{constructor(o,r){if(this.uniforms={},this.program=e.createProgram(),e.attachShader(this.program,o),e.attachShader(this.program,r),e.linkProgram(this.program),!e.getProgramParameter(this.program,e.LINK_STATUS))throw e.getProgramInfoLog(this.program);const i=e.getProgramParameter(this.program,e.ACTIVE_UNIFORMS);for(let u=0;u<i;u++){const l=e.getActiveUniform(this.program,u).name;this.uniforms[l]=e.getUniformLocation(this.program,l)}}bind(){e.useProgram(this.program)}}function m(t,o){const r=e.createShader(t);if(e.shaderSource(r,o),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS))throw e.getShaderInfoLog(r);return r}const _=m(e.VERTEX_SHADER,`
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
`),ie=m(e.FRAGMENT_SHADER,`
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float value;

    void main () {
        gl_FragColor = value * texture2D(uTexture, vUv);
    }
`),oe=m(e.FRAGMENT_SHADER,`
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    uniform sampler2D uTexture;

    void main () {
        gl_FragColor = texture2D(uTexture, vUv);
    }
`),ae=m(e.FRAGMENT_SHADER,`
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
`),ne=m(e.FRAGMENT_SHADER,`
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
`),ue=m(e.FRAGMENT_SHADER,`
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
`),se=m(e.FRAGMENT_SHADER,`
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
`),ce=m(e.FRAGMENT_SHADER,`
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
`),le=m(e.FRAGMENT_SHADER,`
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
`),fe=m(e.FRAGMENT_SHADER,`
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
`),ve=m(e.FRAGMENT_SHADER,`
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
`);let f,v,D,s,C,N,E;$();const G=new R(_,ie),k=new R(_,oe),S=new R(_,ae),g=new R(_,b.supportLinearFiltering?ue:ne),X=new R(_,se),O=new R(_,ce),F=new R(_,le),w=new R(_,fe),P=new R(_,ve);function $(){f=e.drawingBufferWidth>>T.TEXTURE_DOWNSAMPLE,v=e.drawingBufferHeight>>T.TEXTURE_DOWNSAMPLE;const t=b.halfFloatTexType,o=b.formatRGBA,r=b.formatRG,i=b.formatR;D=V(2,f,v,o.internalFormat,o.format,t,b.supportLinearFiltering?e.LINEAR:e.NEAREST),s=V(0,f,v,r.internalFormat,r.format,t,b.supportLinearFiltering?e.LINEAR:e.NEAREST),C=L(4,f,v,i.internalFormat,i.format,t,e.NEAREST),N=L(5,f,v,i.internalFormat,i.format,t,e.NEAREST),E=V(6,f,v,i.internalFormat,i.format,t,e.NEAREST)}function L(t,o,r,i,u,l,c){e.activeTexture(e.TEXTURE0+t);let p=e.createTexture();e.bindTexture(e.TEXTURE_2D,p),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,c),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,c),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,i,o,r,0,u,l,null);let x=e.createFramebuffer();return e.bindFramebuffer(e.FRAMEBUFFER,x),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,p,0),e.viewport(0,0,o,r),e.clear(e.COLOR_BUFFER_BIT),[p,x,t]}function V(t,o,r,i,u,l,c){let p=L(t,o,r,i,u,l,c),x=L(t+1,o,r,i,u,l,c);return{get read(){return p},get write(){return x},swap(){let U=p;p=x,x=U}}}const d=(e.bindBuffer(e.ARRAY_BUFFER,e.createBuffer()),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),e.STATIC_DRAW),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,e.createBuffer()),e.bufferData(e.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),e.STATIC_DRAW),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.enableVertexAttribArray(0),t=>{e.bindFramebuffer(e.FRAMEBUFFER,t),e.drawElements(e.TRIANGLES,6,e.UNSIGNED_SHORT,0)});let j=Date.now();J(parseInt(Math.random()*20)+5),q();function q(){me();const t=Math.min((Date.now()-j)/1e3,.016);j=Date.now(),e.viewport(0,0,f,v),W.length>0&&J(W.pop()),g.bind(),e.uniform2f(g.uniforms.texelSize,1/f,1/v),e.uniform1i(g.uniforms.uVelocity,s.read[2]),e.uniform1i(g.uniforms.uSource,s.read[2]),e.uniform1f(g.uniforms.dt,t),e.uniform1f(g.uniforms.dissipation,T.VELOCITY_DISSIPATION),d(s.write[1]),s.swap(),e.uniform1i(g.uniforms.uVelocity,s.read[2]),e.uniform1i(g.uniforms.uSource,D.read[2]),e.uniform1f(g.uniforms.dissipation,T.DENSITY_DISSIPATION),d(D.write[1]),D.swap();for(let r=0;r<n.length;r++){const i=n[r];i.moved&&(K(i.x,i.y,i.dx,i.dy,i.color),i.moved=!1)}O.bind(),e.uniform2f(O.uniforms.texelSize,1/f,1/v),e.uniform1i(O.uniforms.uVelocity,s.read[2]),d(N[1]),F.bind(),e.uniform2f(F.uniforms.texelSize,1/f,1/v),e.uniform1i(F.uniforms.uVelocity,s.read[2]),e.uniform1i(F.uniforms.uCurl,N[2]),e.uniform1f(F.uniforms.curl,T.CURL),e.uniform1f(F.uniforms.dt,t),d(s.write[1]),s.swap(),X.bind(),e.uniform2f(X.uniforms.texelSize,1/f,1/v),e.uniform1i(X.uniforms.uVelocity,s.read[2]),d(C[1]),G.bind();let o=E.read[2];e.activeTexture(e.TEXTURE0+o),e.bindTexture(e.TEXTURE_2D,E.read[0]),e.uniform1i(G.uniforms.uTexture,o),e.uniform1f(G.uniforms.value,T.PRESSURE_DISSIPATION),d(E.write[1]),E.swap(),w.bind(),e.uniform2f(w.uniforms.texelSize,1/f,1/v),e.uniform1i(w.uniforms.uDivergence,C[2]),o=E.read[2],e.uniform1i(w.uniforms.uPressure,o),e.activeTexture(e.TEXTURE0+o);for(let r=0;r<T.PRESSURE_ITERATIONS;r++)e.bindTexture(e.TEXTURE_2D,E.read[0]),d(E.write[1]),E.swap();P.bind(),e.uniform2f(P.uniforms.texelSize,1/f,1/v),e.uniform1i(P.uniforms.uPressure,E.read[2]),e.uniform1i(P.uniforms.uVelocity,s.read[2]),d(s.write[1]),s.swap(),e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),k.bind(),e.uniform1i(k.uniforms.uTexture,D.read[2]),d(null),requestAnimationFrame(q)}function K(t,o,r,i,u){S.bind(),e.uniform1i(S.uniforms.uTarget,s.read[2]),e.uniform1f(S.uniforms.aspectRatio,a.width/a.height),e.uniform2f(S.uniforms.point,t/a.width,1-o/a.height),e.uniform3f(S.uniforms.color,r,-i,1),e.uniform1f(S.uniforms.radius,T.SPLAT_RADIUS),d(s.write[1]),s.swap(),e.uniform1i(S.uniforms.uTarget,D.read[2]),e.uniform3f(S.uniforms.color,u[0]*.3,u[1]*.3,u[2]*.3),d(D.write[1]),D.swap()}function J(t){for(let o=0;o<t;o++){const r=[Math.random()*10,Math.random()*10,Math.random()*10],i=a.width*Math.random(),u=a.height*Math.random(),l=1e3*(Math.random()-.5),c=1e3*(Math.random()-.5);K(i,u,l,c,r)}}function me(){(a.width!=a.clientWidth||a.height!=a.clientHeight)&&(a.width=a.clientWidth,a.height=a.clientHeight,$())}a.addEventListener("touchmove",t=>{t.preventDefault();const o=t.targetTouches;for(let r=0;r<o.length;r++){let i=n[r];i.moved=i.down,i.dx=(o[r].pageX-i.x)*10,i.dy=(o[r].pageY-i.y)*10,i.x=o[r].pageX,i.y=o[r].pageY}},!1),a.addEventListener("mousemove",t=>{n[0].color=[Math.random()+.2,Math.random()+.2,Math.random()+.2],n[0].moved=!0,n[0].dx=(t.offsetX-n[0].x)*10,n[0].dy=(t.offsetY-n[0].y)*10,n[0].x=t.offsetX,n[0].y=t.offsetY}),a.addEventListener("mousedown",()=>{n[0].down=!0,n[0].color=[Math.random()+.2,Math.random()+.2,Math.random()+.2]}),a.addEventListener("touchstart",t=>{t.preventDefault();const o=t.targetTouches;for(let r=0;r<o.length;r++)r>=n.length&&n.push(new Y),n[r].id=o[r].identifier,n[r].down=!0,n[r].x=o[r].pageX,n[r].y=o[r].pageY,n[r].color=[Math.random()+.2,Math.random()+.2,Math.random()+.2]}),window.addEventListener("mouseup",()=>{n[0].down=!1}),window.addEventListener("touchend",t=>{const o=t.changedTouches;for(let r=0;r<o.length;r++)for(let i=0;i<n.length;i++)o[r].identifier==n[i].id&&(n[i].down=!1)})}return(a,T)=>(M(),z("canvas",{id:"spark",ref_key:"canvasRef",ref:h},null,512))}},_e=H(Re,[["__scopeId","data-v-5fc3cb82"]]),ge={};function he(I,h){return M(),z("span",null,h[0]||(h[0]=[Te('<div id="mouse-scroll" data-v-c1e953bb><div class="mouse" data-v-c1e953bb><div class="mouse-in" data-v-c1e953bb></div></div><div data-v-c1e953bb><span class="down-arrow-1" data-v-c1e953bb></span><span class="down-arrow-2" data-v-c1e953bb></span><span class="down-arrow-3" data-v-c1e953bb></span></div></div>',1)]))}const ye=H(ge,[["render",he],["__scopeId","data-v-c1e953bb"]]),De={class:"hello-wrapper"},Se=["data-text"],Ae=["data-text"],be={__name:"welcome-page",setup(I){const h=Ee(),{proxy:A}=h;return(a,T)=>(M(),z("section",De,[Q("span",{class:"hello_text","data-text":B(A).$global.welcomeText},Z(B(A).$global.welcomeText),9,Se),Q("span",{class:"sub_text","data-text":B(A).$global.subText},Z(B(A).$global.subText),9,Ae),ee(ye,{class:"down-arrow"}),ee(_e)]))}},Fe=H(be,[["__scopeId","data-v-dfb916c6"]]),we={__name:"index",setup(I){return(h,A)=>(M(),xe(Fe))}};export{we as default};
