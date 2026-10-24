
"use client";

import * as React from "react";
import { useEffect, useMemo, useRef } from "react";

interface FontProps {
  fontFamily?: string;
  fontWeight?: number | string;
  fontStyle?: string;
  fontSize?: number | string;
  letterSpacing?: number | string;
}

interface LineProps {
  density: number;
  width: number;
  softness: number;
  depth: number;
  overshoot: number;
  flicker: number;
}

interface Props {
  text: string;
  font: FontProps;
  background: string;
  textColor: string;
  lineColor: string;
  speed: number;
  offsetY: number;
  interactive: boolean;
  pointerIntensity: number;
  lines: Partial<LineProps>;
  style?: React.CSSProperties;
}

interface Resolved {
  text: string;
  font: FontProps;
  background: string;
  textColor: string;
  lineColor: string;
  speed: number;
  offsetY: number;
  interactive: boolean;
  pointerIntensity: number;
  lines: LineProps;
}

interface Source {
  canvas: HTMLCanvasElement;
  top: Uint8Array;
}

const DEFAULT_TEXT = "FLICKER";

const DEFAULT_FONT: FontProps = {
  fontFamily: "Georgia, serif",
  fontWeight: 800,
  fontSize: 76,
  letterSpacing: "0.04em",
};

const DEFAULT_LINES: LineProps = {
  density: 150,
  width: 24,
  softness: 55,
  depth: 13,
  overshoot: 35,
  flicker: 65,
};

const AIR = 0.075;
const AIR_TOP_BIAS = 0.72;
const GRAIN = 0.15;
const GLOW_STEPS = 64;
const REF_GLOW_RATE = 0.55;

const ESCAPE_FADE_LO = 0.45;
const ESCAPE_FADE_HI = 0.95;
const ESCAPE_LEVEL = 0.45;
const DPR_CAP = 2;
const EDGE_ALPHA = 100;

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

const num = (v: unknown, fallback: number) =>
  typeof v === "number" && Number.isFinite(v) ? v : fallback;

function parseFontSize(value: number | string | undefined): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const n = parseFloat(value);

    if (Number.isFinite(n)) {
      if (value.includes("rem")) return n * 16;
      if (value.includes("em")) return n * 16;
      return n;
    }
  }

  return 76;
}

function parseTracking(
  value: number | string | undefined,
  fontSize: number
): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const n = parseFloat(value);

    if (Number.isFinite(n)) {
      if (value.endsWith("em")) return n * fontSize;
      if (value.endsWith("%")) return (n / 100) * fontSize;
      return n;
    }
  }

  return 0;
}

function quoteFamily(family: string): string {
  return family
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean)
    .map((name) =>
      name.startsWith("'") ||
      name.startsWith('"') ||
      /^[a-z-]+$/i.test(name)
        ? name
        : `"${name.replace(/"/g, '\\"')}"`
    )
    .join(", ");
}

function fontSpec(font: FontProps) {
  const fontSize = parseFontSize(font.fontSize);

  return {
    family: quoteFamily(
      font.fontFamily || "Georgia, serif"
    ),
    weight: font.fontWeight || 800,
    style: font.fontStyle || "normal",
    fontSize,
    tracking: parseTracking(font.letterSpacing, fontSize),
  };
}

function fontShorthand(font: FontProps, scale = 1): string {
  const f = fontSpec(font);

  return `${f.style} ${f.weight} ${Math.round(
    f.fontSize * scale
  )}px ${f.family}`;
}

function oneLine(text: string): string {
  return (
    (text || DEFAULT_TEXT).replace(/\s*\n\s*/g, " ").trim() ||
    DEFAULT_TEXT
  );
}

const colorCache = new Map<string, [number, number, number]>();

function resolveRgb(
  color: string,
  host: HTMLElement | null
): [number, number, number] {
  const cached = colorCache.get(color);

  if (cached) return cached;

  let result: [number, number, number] = [1, 1, 1];

  if (typeof document !== "undefined") {
    const probe = document.createElement("span");

    probe.style.color = color;
    probe.style.position = "absolute";
    probe.style.pointerEvents = "none";
    probe.style.visibility = "hidden";

    (host || document.body || document.documentElement).appendChild(
      probe
    );

    const computed = getComputedStyle(probe).color;
    probe.remove();

    const matches = computed.match(/-?[\d.]+/g);

    if (matches && matches.length >= 3) {
      result = [
        clamp(parseFloat(matches[0]) / 255, 0, 1),
        clamp(parseFloat(matches[1]) / 255, 0, 1),
        clamp(parseFloat(matches[2]) / 255, 0, 1),
      ];
    }
  }

  colorCache.set(color, result);

  return result;
}

/* Rasterize the text and calculate its top and bottom edges. */
function rasterise(
  p: Resolved,
  w: number,
  h: number,
  dpr: number
): Source {
  const canvas = document.createElement("canvas");

  canvas.width = w;
  canvas.height = h;

  const top = new Uint8Array(w * 4);

  // Empty pixels should not create unwanted light shafts.
  for (let i = 0; i < w; i++) {
    top[i * 4] = 255;
    top[i * 4 + 1] = 255;
    top[i * 4 + 2] = 255;
    top[i * 4 + 3] = 255;
  }

  const ctx = canvas.getContext("2d", {
    willReadFrequently: true,
  });

  if (!ctx) return { canvas, top };

  const f = fontSpec(p.font);
  let fontSize = f.fontSize * dpr;

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Fit long text into the available width on mobile.
  ctx.font = `${f.style} ${f.weight} ${fontSize}px ${f.family}`;

  const tracking = f.tracking * dpr;
  const text = oneLine(p.text);

  const measuredWidth = ctx.measureText(text).width;
  const availableWidth = w * 0.92;

  if (measuredWidth > availableWidth) {
    fontSize *= availableWidth / measuredWidth;
    ctx.font = `${f.style} ${f.weight} ${fontSize}px ${f.family}`;
  }

  if ("letterSpacing" in ctx) {
    (
      ctx as CanvasRenderingContext2D & {
        letterSpacing: string;
      }
    ).letterSpacing = `${tracking * Math.min(
      1,
      availableWidth / Math.max(measuredWidth, 1)
    )}px`;
  }

  ctx.fillStyle = "#ffffff";

  ctx.fillText(
    text,
    w * 0.5,
    h * 0.5 + (p.offsetY / 100) * h
  );

  const data = ctx.getImageData(0, 0, w, h).data;

  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      if (data[(y * w + x) * 4 + 3] >= EDGE_ALPHA) {
        const v = Math.floor((y / h) * 65535);

        top[x * 4] = (v >> 8) & 255;
        top[x * 4 + 1] = v & 255;

        break;
      }
    }

    for (let y = h - 1; y >= 0; y--) {
      if (data[(y * w + x) * 4 + 3] >= EDGE_ALPHA) {
        const v = Math.min(
          65535,
          Math.ceil(((y + 1) / h) * 65535)
        );

        top[x * 4 + 2] = (v >> 8) & 255;
        top[x * 4 + 3] = v & 255;

        break;
      }
    }
  }

  return { canvas, top };
}

const VERTEX = `#version 300 es
precision highp float;

in vec2 aPosition;
out vec2 vUv;

void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const FRAGMENT = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uGlyph;
uniform sampler2D uTop;

uniform vec2 uResolution;
uniform float uTime;

uniform vec3 uBg;
uniform vec3 uInk;
uniform vec3 uRay;

uniform float uPitch;
uniform float uHalf;
uniform float uSoft;
uniform float uDepth;
uniform float uOvershoot;
uniform float uFloor;
uniform float uAir;
uniform float uGrain;

uniform vec2 uPointer;
uniform float uPointerActive;
uniform float uPointerRadius;
uniform float uPointerStrength;

const float STEPS = 64.0;
const float ESCAPE_LEVEL = 0.45;
const float ESCAPE_FADE_LO = 0.45;
const float ESCAPE_FADE_HI = 0.95;
const float AIR_TOP_BIAS = 0.72;

float hash11(float p) {
    p = fract(p * 0.1031);
    p *= p + 33.33;
    p *= p + p;
    return fract(p);
}

float hash21(vec2 p) {
    vec3 q = fract(vec3(p.xyx) * 0.1031);
    q += dot(q, q.yzx + 33.33);
    return fract((q.x + q.y) * q.z);
}

float vnoise(float id, float x, float wrap) {
    float i = floor(x);
    float f = fract(x);

    f = f * f * (3.0 - 2.0 * f);

    float a = hash21(vec2(id, mod(i, wrap)));
    float b = hash21(vec2(id, mod(i + 1.0, wrap)));

    return mix(a, b, f);
}

float glowAt(float id, float t) {
    float n =
        0.62 * vnoise(id, t, STEPS) +
        0.38 * vnoise(id + 131.0, t * 2.0, STEPS * 2.0);

    n = pow(clamp(n, 0.0, 1.0), 1.25);

    float amp = 0.87 + 0.13 * hash11(id + 41.7);

    return amp * mix(uFloor, 1.0, n);
}

void main() {
    float sy = 1.0 - vUv.y;

    float cover = texture(
        uGlyph,
        vec2(vUv.x, sy)
    ).a;

    vec4 packed = texture(
        uTop,
        vec2(vUv.x, 0.5)
    );

    float top =
        (packed.r * 65280.0 + packed.g * 255.0) / 65535.0;

    float bot =
        (packed.b * 65280.0 + packed.a * 255.0) / 65535.0;

    float outPx = (
        max(0.0, top - sy) +
        max(0.0, sy - bot)
    ) * uResolution.y;

    float u = vUv.x * uResolution.x / uPitch;
    float ci = floor(u);

    float comb = 0.0;
    float escape = 0.0;

    for (int k = -1; k <= 1; k++) {
        float id = ci + float(k);

        float d = abs(u - (id + 0.5)) * uPitch;

        float hw = uHalf *
            (0.72 + 0.56 * hash11(id + 9.13));

        float e = max(hw * uSoft, 0.6);

        float s = min(
            1.0,
            uPitch / max(hw + e, 1e-4)
        );

        hw *= s;
        e *= s;

        float lineX = (id + 0.5) * uPitch;

        float pointerPx = length(
            vec2(lineX, sy * uResolution.y) -
            vec2(
                uPointer.x * uResolution.x,
                uPointer.y * uResolution.y
            )
        );

        float pointerBoost =
            uPointerActive *
            uPointerStrength *
            exp(
                -(pointerPx * pointerPx) /
                (2.0 * uPointerRadius * uPointerRadius)
            );

        float glow = clamp(
            glowAt(id, uTime) + pointerBoost,
            0.0,
            1.6
        );

        float prof = 1.0 - smoothstep(
            hw - e,
            hw + e,
            d
        );

        comb = max(comb, prof * glow);

        float len = uOvershoot *
            pow(hash11(id + 57.3), 1.6);

        float tip = max(len * 0.15, 1.5);

        float body = 1.0 - smoothstep(
            len - tip,
            len,
            outPx
        );

        float fade = smoothstep(
            ESCAPE_FADE_LO,
            ESCAPE_FADE_HI,
            glow
        );

        escape = max(
            escape,
            prof * ESCAPE_LEVEL * fade * body
        );
    }

    float belowPx = max(0.0, sy - top) * uResolution.y;

    float inside = exp(
        -belowPx / max(uDepth, 1.0)
    );

    float hasGlyph = step(top, 0.999);

    escape *= hasGlyph;

    float air = uAir * comb * comb *
        (1.0 - AIR_TOP_BIAS * sy);

    float inBand = step(top, sy) * step(sy, bot);

    float lit =
        inBand * cover * inside * comb +
        (1.0 - inBand) * max(escape, air);

    lit *= 1.0 - uGrain *
        (1.0 - hash21(gl_FragCoord.xy));

    // Transparent output lets the page background show through.
    float textAlpha = cover;
    float rayAlpha = clamp(lit * 0.8, 0.0, 0.92);

    float alpha = max(textAlpha, rayAlpha);

    vec3 col = uInk * textAlpha + uRay * rayAlpha;

    // Avoid invisible pixels carrying unwanted color.
    fragColor = vec4(col, alpha);
}`;

const UNIFORMS = [
  "uGlyph",
  "uTop",
  "uResolution",
  "uTime",
  "uBg",
  "uInk",
  "uRay",
  "uPitch",
  "uHalf",
  "uSoft",
  "uDepth",
  "uOvershoot",
  "uFloor",
  "uAir",
  "uGrain",
  "uPointer",
  "uPointerActive",
  "uPointerRadius",
  "uPointerStrength",
] as const;

type UniformName = (typeof UNIFORMS)[number];

function compile(
  gl: WebGL2RenderingContext,
  type: number,
  src: string
): WebGLShader | null {
  const shader = gl.createShader(type);

  if (!shader) return null;

  gl.shaderSource(shader, src);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn(
      "LightShaftText:",
      gl.getShaderInfoLog(shader)
    );

    gl.deleteShader(shader);

    return null;
  }

  return shader;
}

export default function LightShaftText(
  props: Partial<Props>
) {
  const {
    text = "THE DEDUCTION MATRIX",

    font = DEFAULT_FONT,

    background = "transparent",
    textColor = "#F3E3BD",
    lineColor = "#E7C987",

    speed = 35,
    offsetY = 0,

    interactive = true,
    pointerIntensity = 35,

    lines = DEFAULT_LINES,
    style,
  } = props;

  const resolved: Resolved = useMemo(
    () => ({
      text,

      font: font || DEFAULT_FONT,

      background,
      textColor,
      lineColor,

      speed: clamp(num(speed, 35), 0, 100),

      offsetY: clamp(num(offsetY, 0), -100, 100),

      interactive:
        typeof interactive === "boolean"
          ? interactive
          : true,

      pointerIntensity: clamp(
        num(pointerIntensity, 35),
        0,
        100
      ),

      lines: {
        density: clamp(
          num(lines.density, DEFAULT_LINES.density),
          4,
          300
        ),

        width: clamp(
          num(lines.width, DEFAULT_LINES.width),
          1,
          100
        ),

        softness: clamp(
          num(lines.softness, DEFAULT_LINES.softness),
          0,
          100
        ),

        depth: clamp(
          num(lines.depth, DEFAULT_LINES.depth),
          1,
          100
        ),

        overshoot: clamp(
          num(lines.overshoot, DEFAULT_LINES.overshoot),
          0,
          100
        ),

        flicker: clamp(
          num(lines.flicker, DEFAULT_LINES.flicker),
          0,
          100
        ),
      },
    }),
    [
      text,
      font,
      background,
      textColor,
      lineColor,
      speed,
      offsetY,
      interactive,
      pointerIntensity,
      lines.density,
      lines.width,
      lines.softness,
      lines.depth,
      lines.overshoot,
      lines.flicker,
    ]
  );

  const rootRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const propsRef = useRef<Resolved>(resolved);
  propsRef.current = resolved;

  const dirtyRef = useRef(true);

  const fontKey = fontShorthand(resolved.font);

  const rasterKey =
    `${oneLine(resolved.text)}|${fontKey}|${resolved.offsetY}`;

  useEffect(() => {
    dirtyRef.current = true;
  }, [rasterKey]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    let cancelled = false;

    const redraw = () => {
      if (!cancelled) dirtyRef.current = true;
    };

    document.fonts
      .load(fontShorthand(propsRef.current.font))
      .then(redraw, redraw);

    document.fonts.ready.then(redraw);

    return () => {
      cancelled = true;
    };
  }, [fontKey]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;

    if (!canvas || !root) return;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: true,
      depth: false,
      stencil: false,
      premultipliedAlpha: true,
    });

    if (!gl) {
      console.warn(
        "LightShaftText: WebGL2 is not supported in this browser."
      );
      return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);

    if (!vs || !fs) return;

    const program = gl.createProgram();

    if (!program) return;

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn(
        "LightShaftText:",
        gl.getProgramInfoLog(program)
      );

      gl.deleteProgram(program);

      return;
    }

    gl.useProgram(program);

    const loc = {} as Record<
      UniformName,
      WebGLUniformLocation | null
    >;

    for (const name of UNIFORMS) {
      loc[name] = gl.getUniformLocation(program, name);
    }

    const buffer = gl.createBuffer();

    if (!buffer) return;

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );

    const aPosition = gl.getAttribLocation(
      program,
      "aPosition"
    );

    gl.enableVertexAttribArray(aPosition);

    gl.vertexAttribPointer(
      aPosition,
      2,
      gl.FLOAT,
      false,
      0,
      0
    );

    const makeTexture = () => {
      const tex = gl.createTexture();

      if (!tex) return null;

      gl.bindTexture(gl.TEXTURE_2D, tex);

      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_WRAP_S,
        gl.CLAMP_TO_EDGE
      );

      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_WRAP_T,
        gl.CLAMP_TO_EDGE
      );

      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER,
        gl.LINEAR
      );

      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MAG_FILTER,
        gl.LINEAR
      );

      return tex;
    };

    const glyphTex = makeTexture();
    const topTex = makeTexture();

    if (!glyphTex || !topTex) return;

    gl.bindTexture(gl.TEXTURE_2D, topTex);

    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MIN_FILTER,
      gl.NEAREST
    );

    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MAG_FILTER,
      gl.NEAREST
    );

    gl.uniform1i(loc.uGlyph, 0);
    gl.uniform1i(loc.uTop, 1);

    gl.uniform1f(loc.uAir, AIR);
    gl.uniform1f(loc.uGrain, GRAIN);

    const pointer = {
      x: 0.5,
      y: 0.5,
      targetActive: 0,
      active: 0,
    };

    const setPointer = (
      clientX: number,
      clientY: number
    ) => {
      const rect = root.getBoundingClientRect();

      if (rect.width <= 0 || rect.height <= 0) return;

      pointer.x = clamp(
        (clientX - rect.left) / rect.width,
        0,
        1
      );

      pointer.y = clamp(
        (clientY - rect.top) / rect.height,
        0,
        1
      );

      pointer.targetActive = 1;
    };

    const onPointerMove = (e: PointerEvent) => {
      setPointer(e.clientX, e.clientY);
    };

    const onPointerLeave = () => {
      pointer.targetActive = 0;
    };

    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerleave", onPointerLeave);

    let bufW = 0;
    let bufH = 0;
    let dpr = 1;
    let clock = 0;
    let last = -1;
    let frame = 0;

    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);

      const p = propsRef.current;

      const cssW = Math.max(1, root.clientWidth);
      const cssH = Math.max(1, root.clientHeight);

      const nextDpr = Math.min(
        DPR_CAP,
        window.devicePixelRatio || 1
      );

      const w = Math.max(1, Math.round(cssW * nextDpr));
      const h = Math.max(1, Math.round(cssH * nextDpr));

      if (
        w !== bufW ||
        h !== bufH ||
        nextDpr !== dpr
      ) {
        bufW = w;
        bufH = h;
        dpr = nextDpr;

        canvas.width = w;
        canvas.height = h;

        gl.viewport(0, 0, w, h);

        dirtyRef.current = true;
      }

      if (dirtyRef.current) {
        dirtyRef.current = false;

        const source = rasterise(p, bufW, bufH, dpr);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, glyphTex);

        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          source.canvas
        );

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, topTex);

        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          bufW,
          1,
          0,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          source.top
        );
      }

      const dt =
        last < 0
          ? 0
          : clamp((now - last) / 1000, 0, 0.05);

      last = now;

      clock =
        (clock + dt * (p.speed / 50) * REF_GLOW_RATE) %
        GLOW_STEPS;

      const activeTarget = p.interactive
        ? pointer.targetActive
        : 0;

      pointer.active +=
        (activeTarget - pointer.active) *
        clamp(dt * 6, 0, 1);

      const host = rootRef.current;

      const bg = resolveRgb(p.background, host);
      const ink = resolveRgb(p.textColor, host);
      const ray = resolveRgb(p.lineColor, host);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, glyphTex);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, topTex);

      const pitch = bufW / p.lines.density;

      gl.uniform2f(loc.uResolution, bufW, bufH);
      gl.uniform1f(loc.uTime, clock);

      gl.uniform3f(loc.uBg, bg[0], bg[1], bg[2]);
      gl.uniform3f(loc.uInk, ink[0], ink[1], ink[2]);
      gl.uniform3f(loc.uRay, ray[0], ray[1], ray[2]);

      gl.uniform1f(loc.uPitch, pitch);

      gl.uniform1f(
        loc.uHalf,
        pitch * (p.lines.width / 100) * 0.5
      );

      gl.uniform1f(
        loc.uSoft,
        p.lines.softness / 100
      );

      gl.uniform1f(
        loc.uDepth,
        (p.lines.depth / 100) * bufH
      );

      gl.uniform1f(
        loc.uOvershoot,
        (p.lines.overshoot / 100) * bufH
      );

      gl.uniform1f(
        loc.uFloor,
        1 - (p.lines.flicker / 100) * 0.85
      );

      gl.uniform2f(
        loc.uPointer,
        pointer.x,
        pointer.y
      );

      gl.uniform1f(
        loc.uPointerActive,
        pointer.active
      );

      gl.uniform1f(
        loc.uPointerRadius,
        bufH * 0.22
      );

      gl.uniform1f(
        loc.uPointerStrength,
        p.pointerIntensity / 60
      );

      // Preserve the alpha channel for background blending.
      gl.enable(gl.BLEND);

      gl.blendFunc(
        gl.ONE,
        gl.ONE_MINUS_SRC_ALPHA
      );

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);

      root.removeEventListener(
        "pointermove",
        onPointerMove
      );

      root.removeEventListener(
        "pointerleave",
        onPointerLeave
      );

      gl.deleteTexture(glyphTex);
      gl.deleteTexture(topTex);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      role="img"
      aria-label={oneLine(resolved.text)}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minWidth: 0,
        minHeight: 0,
        overflow: "hidden",
        background: "transparent",
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
    </div>
  );
}

LightShaftText.displayName = "Light Shaft Text";
