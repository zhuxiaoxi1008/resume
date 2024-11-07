import{_ as q,r as fe,o as le,a as X,c as K,b as ve,d as me,e as de}from"./index-Cjr5FIDc.js";const pe={__name:"introduce",setup(O){let P=fe(null);le(()=>{F()});function F(){const n=P.value;n.width=n.clientWidth,n.height=n.clientHeight;let R={TEXTURE_DOWNSAMPLE:1,DENSITY_DISSIPATION:.98,VELOCITY_DISSIPATION:.99,PRESSURE_DISSIPATION:.8,PRESSURE_ITERATIONS:25,CURL:30,SPLAT_RADIUS:.005},a=[],V=[];const{gl:e,ext:S}=J(n);function J(t){const o={alpha:!1,depth:!1,stencil:!1,antialias:!1};let r=t.getContext("webgl2",o);const i=!!r;i||(r=t.getContext("webgl",o)||t.getContext("experimental-webgl",o));let u,f;i?(r.getExtension("EXT_color_buffer_float"),f=r.getExtension("OES_texture_float_linear")):(u=r.getExtension("OES_texture_half_float"),f=r.getExtension("OES_texture_half_float_linear")),r.clearColor(0,0,0,1);const c=i?r.HALF_FLOAT:u.HALF_FLOAT_OES;let p,E,U;return i?(p=g(r,r.RGBA16F,r.RGBA,c),E=g(r,r.RG16F,r.RG,c),U=g(r,r.R16F,r.RED,c)):(p=g(r,r.RGBA,r.RGBA,c),E=g(r,r.RGBA,r.RGBA,c),U=g(r,r.RGBA,r.RGBA,c)),{gl:r,ext:{formatRGBA:p,formatRG:E,formatR:U,halfFloatTexType:c,supportLinearFiltering:f}}}function g(t,o,r,i){if(!Q(t,o,r,i))switch(o){case t.R16F:return g(t,t.RG16F,t.RG,i);case t.RG16F:return g(t,t.RGBA16F,t.RGBA,i);default:return null}return{internalFormat:o,format:r}}function Q(t,o,r,i){let u=t.createTexture();t.bindTexture(t.TEXTURE_2D,u),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texImage2D(t.TEXTURE_2D,0,o,4,4,0,r,i,null);let f=t.createFramebuffer();return t.bindFramebuffer(t.FRAMEBUFFER,f),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,u,0),t.checkFramebufferStatus(t.FRAMEBUFFER)==t.FRAMEBUFFER_COMPLETE}function H(){this.id=-1,this.x=0,this.y=0,this.dx=0,this.dy=0,this.down=!1,this.moved=!1,this.color=[30,0,300]}a.push(new H);class x{constructor(o,r){if(this.uniforms={},this.program=e.createProgram(),e.attachShader(this.program,o),e.attachShader(this.program,r),e.linkProgram(this.program),!e.getProgramParameter(this.program,e.LINK_STATUS))throw e.getProgramInfoLog(this.program);const i=e.getProgramParameter(this.program,e.ACTIVE_UNIFORMS);for(let u=0;u<i;u++){const f=e.getActiveUniform(this.program,u).name;this.uniforms[f]=e.getUniformLocation(this.program,f)}}bind(){e.useProgram(this.program)}}function m(t,o){const r=e.createShader(t);if(e.shaderSource(r,o),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS))throw e.getShaderInfoLog(r);return r}const h=m(e.VERTEX_SHADER,`
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
`),Z=m(e.FRAGMENT_SHADER,`
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float value;

    void main () {
        gl_FragColor = value * texture2D(uTexture, vUv);
    }
`),ee=m(e.FRAGMENT_SHADER,`
    precision highp float;
    precision mediump sampler2D;

    varying vec2 vUv;
    uniform sampler2D uTexture;

    void main () {
        gl_FragColor = texture2D(uTexture, vUv);
    }
`),re=m(e.FRAGMENT_SHADER,`
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
`),te=m(e.FRAGMENT_SHADER,`
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
`),ie=m(e.FRAGMENT_SHADER,`
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
`),oe=m(e.FRAGMENT_SHADER,`
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
`),ae=m(e.FRAGMENT_SHADER,`
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
`),ne=m(e.FRAGMENT_SHADER,`
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
`),ue=m(e.FRAGMENT_SHADER,`
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
`),se=m(e.FRAGMENT_SHADER,`
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
`);let l,v,y,s,B,M,T;W();const I=new x(h,Z),z=new x(h,ee),D=new x(h,re),_=new x(h,S.supportLinearFiltering?ie:te),C=new x(h,oe),N=new x(h,ae),A=new x(h,ne),b=new x(h,ue),w=new x(h,se);function W(){l=e.drawingBufferWidth>>R.TEXTURE_DOWNSAMPLE,v=e.drawingBufferHeight>>R.TEXTURE_DOWNSAMPLE;const t=S.halfFloatTexType,o=S.formatRGBA,r=S.formatRG,i=S.formatR;y=G(2,l,v,o.internalFormat,o.format,t,S.supportLinearFiltering?e.LINEAR:e.NEAREST),s=G(0,l,v,r.internalFormat,r.format,t,S.supportLinearFiltering?e.LINEAR:e.NEAREST),B=L(4,l,v,i.internalFormat,i.format,t,e.NEAREST),M=L(5,l,v,i.internalFormat,i.format,t,e.NEAREST),T=G(6,l,v,i.internalFormat,i.format,t,e.NEAREST)}function L(t,o,r,i,u,f,c){e.activeTexture(e.TEXTURE0+t);let p=e.createTexture();e.bindTexture(e.TEXTURE_2D,p),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,c),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,c),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,i,o,r,0,u,f,null);let E=e.createFramebuffer();return e.bindFramebuffer(e.FRAMEBUFFER,E),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,p,0),e.viewport(0,0,o,r),e.clear(e.COLOR_BUFFER_BIT),[p,E,t]}function G(t,o,r,i,u,f,c){let p=L(t,o,r,i,u,f,c),E=L(t+1,o,r,i,u,f,c);return{get read(){return p},get write(){return E},swap(){let U=p;p=E,E=U}}}const d=(e.bindBuffer(e.ARRAY_BUFFER,e.createBuffer()),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),e.STATIC_DRAW),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,e.createBuffer()),e.bufferData(e.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),e.STATIC_DRAW),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.enableVertexAttribArray(0),t=>{e.bindFramebuffer(e.FRAMEBUFFER,t),e.drawElements(e.TRIANGLES,6,e.UNSIGNED_SHORT,0)});let Y=Date.now();j(parseInt(Math.random()*20)+5),k();function k(){ce();const t=Math.min((Date.now()-Y)/1e3,.016);Y=Date.now(),e.viewport(0,0,l,v),V.length>0&&j(V.pop()),_.bind(),e.uniform2f(_.uniforms.texelSize,1/l,1/v),e.uniform1i(_.uniforms.uVelocity,s.read[2]),e.uniform1i(_.uniforms.uSource,s.read[2]),e.uniform1f(_.uniforms.dt,t),e.uniform1f(_.uniforms.dissipation,R.VELOCITY_DISSIPATION),d(s.write[1]),s.swap(),e.uniform1i(_.uniforms.uVelocity,s.read[2]),e.uniform1i(_.uniforms.uSource,y.read[2]),e.uniform1f(_.uniforms.dissipation,R.DENSITY_DISSIPATION),d(y.write[1]),y.swap();for(let r=0;r<a.length;r++){const i=a[r];i.moved&&($(i.x,i.y,i.dx,i.dy,i.color),i.moved=!1)}N.bind(),e.uniform2f(N.uniforms.texelSize,1/l,1/v),e.uniform1i(N.uniforms.uVelocity,s.read[2]),d(M[1]),A.bind(),e.uniform2f(A.uniforms.texelSize,1/l,1/v),e.uniform1i(A.uniforms.uVelocity,s.read[2]),e.uniform1i(A.uniforms.uCurl,M[2]),e.uniform1f(A.uniforms.curl,R.CURL),e.uniform1f(A.uniforms.dt,t),d(s.write[1]),s.swap(),C.bind(),e.uniform2f(C.uniforms.texelSize,1/l,1/v),e.uniform1i(C.uniforms.uVelocity,s.read[2]),d(B[1]),I.bind();let o=T.read[2];e.activeTexture(e.TEXTURE0+o),e.bindTexture(e.TEXTURE_2D,T.read[0]),e.uniform1i(I.uniforms.uTexture,o),e.uniform1f(I.uniforms.value,R.PRESSURE_DISSIPATION),d(T.write[1]),T.swap(),b.bind(),e.uniform2f(b.uniforms.texelSize,1/l,1/v),e.uniform1i(b.uniforms.uDivergence,B[2]),o=T.read[2],e.uniform1i(b.uniforms.uPressure,o),e.activeTexture(e.TEXTURE0+o);for(let r=0;r<R.PRESSURE_ITERATIONS;r++)e.bindTexture(e.TEXTURE_2D,T.read[0]),d(T.write[1]),T.swap();w.bind(),e.uniform2f(w.uniforms.texelSize,1/l,1/v),e.uniform1i(w.uniforms.uPressure,T.read[2]),e.uniform1i(w.uniforms.uVelocity,s.read[2]),d(s.write[1]),s.swap(),e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),z.bind(),e.uniform1i(z.uniforms.uTexture,y.read[2]),d(null),requestAnimationFrame(k)}function $(t,o,r,i,u){D.bind(),e.uniform1i(D.uniforms.uTarget,s.read[2]),e.uniform1f(D.uniforms.aspectRatio,n.width/n.height),e.uniform2f(D.uniforms.point,t/n.width,1-o/n.height),e.uniform3f(D.uniforms.color,r,-i,1),e.uniform1f(D.uniforms.radius,R.SPLAT_RADIUS),d(s.write[1]),s.swap(),e.uniform1i(D.uniforms.uTarget,y.read[2]),e.uniform3f(D.uniforms.color,u[0]*.3,u[1]*.3,u[2]*.3),d(y.write[1]),y.swap()}function j(t){for(let o=0;o<t;o++){const r=[Math.random()*10,Math.random()*10,Math.random()*10],i=n.width*Math.random(),u=n.height*Math.random(),f=1e3*(Math.random()-.5),c=1e3*(Math.random()-.5);$(i,u,f,c,r)}}function ce(){(n.width!=n.clientWidth||n.height!=n.clientHeight)&&(n.width=n.clientWidth,n.height=n.clientHeight,W())}n.addEventListener("touchmove",t=>{t.preventDefault();const o=t.targetTouches;for(let r=0;r<o.length;r++){let i=a[r];i.moved=i.down,i.dx=(o[r].pageX-i.x)*10,i.dy=(o[r].pageY-i.y)*10,i.x=o[r].pageX,i.y=o[r].pageY}},!1),n.addEventListener("mousemove",t=>{a[0].color=[Math.random()+.2,Math.random()+.2,Math.random()+.2],a[0].moved=!0,a[0].dx=(t.offsetX-a[0].x)*10,a[0].dy=(t.offsetY-a[0].y)*10,a[0].x=t.offsetX,a[0].y=t.offsetY}),n.addEventListener("mousedown",()=>{a[0].down=!0,a[0].color=[Math.random()+.2,Math.random()+.2,Math.random()+.2]}),n.addEventListener("touchstart",t=>{t.preventDefault();const o=t.targetTouches;for(let r=0;r<o.length;r++)r>=a.length&&a.push(new H),a[r].id=o[r].identifier,a[r].down=!0,a[r].x=o[r].pageX,a[r].y=o[r].pageY,a[r].color=[Math.random()+.2,Math.random()+.2,Math.random()+.2]}),window.addEventListener("mouseup",()=>{a[0].down=!1}),window.addEventListener("touchend",t=>{const o=t.changedTouches;for(let r=0;r<o.length;r++)for(let i=0;i<a.length;i++)o[r].identifier==a[i].id&&(a[i].down=!1)})}return(n,R)=>(X(),K("canvas",{id:"mm-introduce",ref_key:"canvasRef",ref:P},null,512))}},Te=q(pe,[["__scopeId","data-v-99a0dfad"]]),Ee={class:"hello-wrapper"},Re={__name:"hello",setup(O){return(P,F)=>(X(),K("section",Ee,[F[0]||(F[0]=ve("span",{class:"hello_text","data-text":"Hello Resume"},"Hello Resume",-1)),me(Te)]))}},xe=q(Re,[["__scopeId","data-v-a1a2472e"]]),_e={__name:"index",setup(O){return(P,F)=>(X(),de(xe))}};export{_e as default};
