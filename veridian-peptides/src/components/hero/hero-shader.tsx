"use client";

// Interactive WebGL shader background for the hero, ported from the
// "Veridian Hero" design. The original shipped GLSL (HERO_COMMON + variants)
// is kept verbatim; this component supplies a minimal renderer in place of the
// missing renderer.js, plus React lifecycle, pointer interaction, click
// ripples, reduced-motion handling and visibility/offscreen pausing.

import { useEffect, useRef } from "react";

type Variant = "silk" | "aurora" | "marble";

const HERO_COMMON = `
precision highp float;
uniform vec2  u_resolution;
uniform float u_time;
uniform vec2  u_mouse;      // smoothed cursor, pixels, y-up
uniform float u_mouseVel;   // 0..~1.5 cursor speed
uniform float u_energy;     // idle motion 0..1
uniform vec3  u_ripples[10];// xy = pixel pos, z = click time (s)

vec2 toCoord(vec2 frag){ return (frag - 0.5*u_resolution)/u_resolution.y; }

float hash21(vec2 p){
  p = fract(p*vec2(123.34, 345.45));
  p += dot(p, p+34.345);
  return fract(p.x*p.y);
}
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  float a = hash21(i);
  float b = hash21(i+vec2(1.0,0.0));
  float c = hash21(i+vec2(0.0,1.0));
  float d = hash21(i+vec2(1.0,1.0));
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for(int i=0;i<6;i++){ v += a*noise(p); p = m*p; a *= 0.5; }
  return v;
}
float rippleField(vec2 uv){
  float sum = 0.0;
  for(int i=0;i<10;i++){
    vec3 r = u_ripples[i];
    if(r.z <= 0.0) continue;
    float age = u_time - r.z;
    if(age < 0.0 || age > 4.0) continue;
    vec2 rp = toCoord(r.xy);
    float d = length(uv - rp);
    float wave = sin(d*18.0 - age*8.0);
    float env  = exp(-age*1.6) * exp(-d*2.4) * smoothstep(0.0,0.08,age);
    sum += wave*env;
  }
  return sum;
}

const vec3 CREAM = vec3(0.967, 0.972, 0.953);
const vec3 SAGE  = vec3(0.788, 0.882, 0.796);
const vec3 GREEN = vec3(0.318, 0.592, 0.435);
const vec3 DEEP  = vec3(0.071, 0.353, 0.227);
const vec3 LILAC = vec3(0.741, 0.690, 0.945);
const vec3 LILAC_DEEP = vec3(0.424, 0.361, 0.906);

float grain(vec2 frag){ return (hash21(frag + fract(u_time)*97.0) - 0.5); }
`;

const FRAGS: Record<Variant, string> = {
  silk: `
void main(){
  vec2 uv = toCoord(gl_FragCoord.xy);
  vec2 m  = toCoord(u_mouse);
  float spd = mix(0.45, 1.0, u_energy);
  float t = u_time*0.034*spd;
  vec2 toM = m - uv; float dM = length(toM);
  vec2 warp = normalize(toM + 1e-5) * 0.05 / (1.0 + dM*7.0);
  float rip = rippleField(uv);
  vec2 p = uv*1.15 + warp + rip*0.012;
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(3.2, -t)));
  float n = fbm(p + q*1.6 + t);
  float band = 0.5 + 0.5*sin((q.y*2.4 + n*2.2 + p.x*0.6)*3.14159 + u_time*0.05);
  vec3 col = CREAM;
  col = mix(col, SAGE,  smoothstep(0.25, 0.78, n)*0.82);
  col = mix(col, GREEN, smoothstep(0.55, 0.96, n)*band*0.55);
  col = mix(col, DEEP,  pow(band, 3.0)*smoothstep(0.62, 1.0, n)*0.22);
  float lilacField = smoothstep(0.46, 0.0, n) * (0.5 + 0.5*sin(q.x*3.0 + p.y*1.4 + u_time*0.06));
  col = mix(col, LILAC, lilacField*0.42);
  col = mix(col, LILAC_DEEP, smoothstep(0.40, 0.0, n)*band*0.22);
  float leftLift = smoothstep(0.15, -0.55, uv.x);
  col = mix(col, CREAM, leftLift*0.42);
  col += (1.0 - smoothstep(0.0, 0.5, dM)) * 0.06;
  col = mix(col, GREEN, (1.0 - smoothstep(0.0, 0.34, dM)) * 0.10 * min(u_mouseVel, 1.0));
  col += abs(rip) * DEEP * 0.40;
  col += grain(gl_FragCoord.xy) * 0.018;
  col *= 1.0 - 0.06*dot(uv, uv);
  gl_FragColor = vec4(col, 1.0);
}
`,
  aurora: `
void main(){
  vec2 uv = toCoord(gl_FragCoord.xy);
  vec2 m  = toCoord(u_mouse);
  float spd = mix(0.45, 1.0, u_energy);
  float t = u_time*0.05*spd;
  float rip = rippleField(uv);
  vec2 toM = uv - m; float dM = length(toM);
  vec3 col = CREAM;
  for(int i=0;i<3;i++){
    float fi = float(i);
    float x = uv.x + sin(uv.y*1.3 + t + fi*2.1)*0.26 + (fi - 1.0)*0.30;
    x += m.x*0.10 + rip*0.04;
    float curtain = exp(-x*x*5.5);
    float fade = smoothstep(-0.75, 0.7, uv.y + sin(t + fi)*0.18);
    vec3 tint = mix(GREEN, DEEP, fi/2.0);
    tint = mix(tint, LILAC_DEEP, step(1.5, fi)*0.95);
    tint = mix(tint, LILAC, step(0.5, fi)*step(fi,1.5)*0.55);
    col = mix(col, tint, curtain*fade*0.46);
  }
  float leftLift = smoothstep(0.15, -0.55, uv.x);
  col = mix(col, CREAM, leftLift*0.30);
  col += (1.0 - smoothstep(0.0, 0.45, dM)) * 0.05;
  col = mix(col, GREEN, (1.0 - smoothstep(0.0, 0.32, dM)) * 0.08 * min(u_mouseVel, 1.0));
  col += abs(rip) * DEEP * 0.45;
  col += grain(gl_FragCoord.xy) * 0.016;
  col *= 1.0 - 0.05*dot(uv, uv);
  gl_FragColor = vec4(col, 1.0);
}
`,
  marble: `
void main(){
  vec2 uv = toCoord(gl_FragCoord.xy);
  vec2 m  = toCoord(u_mouse);
  float spd = mix(0.45, 1.0, u_energy);
  float t = u_time*0.024*spd;
  vec2 toM = m - uv; float dM = length(toM);
  vec2 warp = normalize(toM + 1e-5) * 0.06 / (1.0 + dM*6.0);
  float rip = rippleField(uv);
  vec2 p = uv*1.4 + warp + rip*0.02;
  float n1 = fbm(p + t);
  float n2 = fbm(p*1.8 + vec2(n1*2.0) - t);
  vec2  q  = vec2(n1, n2);
  float n3 = fbm(p*2.6 + q*3.2 + vec2(1.7, -t*1.3));
  float v  = fbm(p + q*2.4 + vec2(n3)*1.8);
  float turb = abs(fbm(p*3.4 + q*2.0 - t*0.6) - 0.5) * 2.0;
  float ridgeA = abs(sin((v*1.6 + turb*0.9)*6.2832 + u_time*0.04));
  float veinA  = pow(1.0 - ridgeA, 3.4);
  float ridgeB = abs(sin((v*3.7 - turb*1.4)*6.2832 - u_time*0.05));
  float veinB  = pow(1.0 - ridgeB, 5.0) * 0.7;
  float veins  = clamp(veinA + veinB, 0.0, 1.0);
  vec3 col = mix(CREAM, SAGE, smoothstep(0.16, 0.86, v));
  col = mix(col, GREEN, veins*0.60);
  col = mix(col, DEEP,  veins*smoothstep(0.42, 0.92, v)*0.42);
  col = mix(col, DEEP, pow(veinA, 2.0)*0.30);
  col = mix(col, LILAC, smoothstep(0.46, 0.0, v) * 0.55);
  col = mix(col, LILAC_DEEP, veins*smoothstep(0.0, 0.4, v)*(1.0-smoothstep(0.4,0.7,v))*0.45);
  col = mix(col, LILAC, smoothstep(0.30, 0.62, v)*(1.0-smoothstep(0.62,0.9,v))*0.30);
  float leftLift = smoothstep(0.15, -0.55, uv.x);
  col = mix(col, CREAM, leftLift*0.40);
  col += (1.0 - smoothstep(0.0, 0.42, dM)) * 0.05;
  col = mix(col, GREEN, (1.0 - smoothstep(0.0, 0.32, dM)) * 0.09 * min(u_mouseVel, 1.0));
  col += abs(rip) * DEEP * 0.40;
  col += grain(gl_FragCoord.xy) * 0.016;
  col *= 1.0 - 0.06*dot(uv, uv);
  gl_FragColor = vec4(col, 1.0);
}
`,
};

const VERT = `attribute vec2 a_pos; void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error("shader compile error", gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export function HeroShader({
  variant = "marble",
  energy = 0.5,
  className,
}: {
  variant?: Variant;
  energy?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false });
    if (!gl) return; // CSS gradient on the parent remains as fallback

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, HERO_COMMON + FRAGS[variant]);
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("program link error", gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = {
      res: gl.getUniformLocation(prog, "u_resolution"),
      time: gl.getUniformLocation(prog, "u_time"),
      mouse: gl.getUniformLocation(prog, "u_mouse"),
      vel: gl.getUniformLocation(prog, "u_mouseVel"),
      energy: gl.getUniformLocation(prog, "u_energy"),
      ripples: gl.getUniformLocation(prog, "u_ripples[0]"),
    };

    let w = 0, h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = Math.max(1, Math.round(r.width * dpr));
      h = Math.max(1, Math.round(r.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    // pointer state (pixels, y-up to match the shader)
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, vel: 0 };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = ((e.clientX - r.left) / r.width) * w;
      mouse.ty = (1 - (e.clientY - r.top) / r.height) * h;
    };
    const ripples = new Float32Array(30);
    let rIdx = 0;
    const onDown = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const px = ((e.clientX - r.left) / r.width) * w;
      const py = (1 - (e.clientY - r.top) / r.height) * h;
      const base = (rIdx % 10) * 3;
      ripples[base] = px;
      ripples[base + 1] = py;
      ripples[base + 2] = (performance.now() - start) / 1000;
      rIdx++;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });

    const start = performance.now();
    let raf = 0;
    let running = true;

    const renderFrame = (now: number) => {
      const t = (now - start) / 1000;
      // smooth cursor + velocity estimate
      const px = mouse.x, py = mouse.y;
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;
      const d = Math.hypot(mouse.x - px, mouse.y - py) / Math.max(h, 1);
      mouse.vel += (Math.min(d * 14, 1.5) - mouse.vel) * 0.2;
      gl.uniform2f(u.res, w, h);
      gl.uniform1f(u.time, t);
      gl.uniform2f(u.mouse, mouse.x, mouse.y);
      gl.uniform1f(u.vel, mouse.vel);
      gl.uniform1f(u.energy, energy);
      if (u.ripples) gl.uniform3fv(u.ripples, ripples);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (now: number) => {
      if (!running) return;
      renderFrame(now);
      raf = requestAnimationFrame(loop);
    };

    if (reduce) {
      // single static frame, no animation
      resize();
      renderFrame(start);
    } else {
      // pause when the hero scrolls offscreen or the tab is hidden
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !document.hidden) {
            if (!running) {
              running = true;
              raf = requestAnimationFrame(loop);
            }
          } else {
            running = false;
            cancelAnimationFrame(raf);
          }
        },
        { threshold: 0 },
      );
      io.observe(canvas);
      const onVis = () => {
        if (document.hidden) {
          running = false;
          cancelAnimationFrame(raf);
        } else if (!running) {
          running = true;
          raf = requestAnimationFrame(loop);
        }
      };
      document.addEventListener("visibilitychange", onVis);
      raf = requestAnimationFrame(loop);

      return () => {
        running = false;
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerdown", onDown);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    }

    return () => {
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [variant, energy]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
