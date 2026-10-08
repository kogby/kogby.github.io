"use client";

import { useEffect, useRef } from "react";

// An ivory marble wall with black ink flowing over it in thin swirling lines, after
// the LeBlanc chamber in the Welcome to Noxus cinematic (suminagashi-style ink
// marbling). One full-screen WebGL fragment shader: domain-warped fbm noise drawn
// as anti-aliased contour lines whose weight varies along the flow, pooling into a
// few dark blots. The cursor is LeBlanc's hand: the flow twists around it. Lines
// stay faint inside the content column so text is readable. Renders at CSS-pixel
// resolution, vsync-paced, drops to half resolution if frames stay slow, pauses
// when the tab is hidden, and draws one still frame for prefers-reduced-motion.
// Without WebGL the body background colour shows.

const VERT = `
attribute vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }
`;

const FRAG = `
#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;     // uv, y up
uniform float u_mouseAmt;
uniform float u_column;   // half width of the content column, in uv x
uniform float u_scroll;   // px
uniform vec3 u_wall;
uniform vec3 u_ink;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i), b = hash(i + vec2(1.0, 0.0)), c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / u_res.y;
  vec2 pp = vec2(uv.x * aspect, uv.y);
  float t = u_time * 0.045;

  // LeBlanc's hand: the flow twists around the cursor.
  vec2 m = vec2(u_mouse.x * aspect, u_mouse.y);
  vec2 dm = pp - m;
  float dist = length(dm);
  float twist = u_mouseAmt * 1.4 * exp(-dist * dist * 14.0);
  float cs = cos(twist), sn = sin(twist);
  vec2 p = m + mat2(cs, -sn, sn, cs) * dm;
  p = p * 1.8 + vec2(0.0, u_scroll * 0.0003);

  // Ink flow: two rounds of domain warping over slowly drifting noise.
  vec2 q = vec2(fbm(p + t * vec2(0.6, 0.25)), fbm(p + vec2(5.2, 1.3) - t * 0.4));
  vec2 r = vec2(fbm(p + 1.8 * q + vec2(1.7, 9.2) + t * 0.25), fbm(p + 1.8 * q + vec2(8.3, 2.8) - t * 0.15));
  float n = fbm(p + 1.5 * r);

  // Marbling: contour lines of the warped field, weight varying along the flow.
  float f = n * 17.0 + t * 0.8;
  float band = abs(fract(f) - 0.5) * 2.0;     // 0 at a line's centre, 1 between lines
  float weight = smoothstep(0.3, 0.7, r.x);   // hairline here, heavy stroke there
  float w = mix(0.05, 0.42, weight);
#ifdef GL_OES_standard_derivatives
  float aa = fwidth(f) * 1.2;
#else
  float aa = 0.03;
#endif
  float line = 1.0 - smoothstep(w - aa, w + aa, band);
  // Most of the wall bare, ink gathered in places, and more likely in the margins than behind the text.
  // The noisy boundary only ever pushes ink outward, never over the text.
  float xo = abs(uv.x - 0.5) - abs(q.x - 0.5) * 0.12;
  float edge = smoothstep(u_column + 0.015, u_column + 0.2, xo);
  float density = smoothstep(0.4, 0.64, q.y + 0.16 * edge);
  float pool = smoothstep(0.66, 0.74, n);                // a few dark blots
  float veil = smoothstep(0.5, 0.75, n) * 0.06;          // grey haze where ink is dense
  float dark = density * (line * 0.85 + pool * 0.55 + veil);

  // No ink inside the content column: the text sits on clean wall.
  dark *= edge;

  // Marble: soft large mottling, no grit.
  vec3 wall = u_wall + (fbm(pp * 2.5 + 3.0) - 0.5) * 0.045;
  vec3 col = mix(wall, u_ink, clamp(dark, 0.0, 1.0));
  gl_FragColor = vec4(col, 1.0);
}
`;

const CONTENT_WIDTH = 896; // Container max-w-4xl, px
const SLOW_FRAME_MS = 22; // ~45 fps; below this we halve the render resolution

function cssRgb(name: string, fallback: [number, number, number]): [number, number, number] {
	const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
	const hex = v.match(/^#([0-9a-f]{6})$/i);
	if (hex) {
		const n = parseInt(hex[1], 16);
		return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
	}
	const triple = v.match(/^(\d+)\s+(\d+)\s+(\d+)$/);
	if (triple) return [+triple[1] / 255, +triple[2] / 255, +triple[3] / 255];
	return fallback;
}

export default function InkWall() {
	const ref = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = ref.current;
		if (!canvas) return;
		const gl = canvas.getContext("webgl", { alpha: false, antialias: false, depth: false, stencil: false });
		if (!gl) return;
		gl.getExtension("OES_standard_derivatives");

		const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const hasHover = !window.matchMedia("(hover: none)").matches;

		const compile = (type: number, src: string) => {
			const s = gl.createShader(type)!;
			gl.shaderSource(s, src);
			gl.compileShader(s);
			if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
			return s;
		};
		let prog: WebGLProgram;
		try {
			prog = gl.createProgram()!;
			gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
			gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
			gl.linkProgram(prog);
			if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? "link");
		} catch (e) {
			console.warn("InkWall: shader failed, falling back to flat wall", e);
			return;
		}
		gl.useProgram(prog);
		const buf = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buf);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
		const a = gl.getAttribLocation(prog, "a");
		gl.enableVertexAttribArray(a);
		gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
		const u = (name: string) => gl.getUniformLocation(prog, name);
		const uRes = u("u_res"), uTime = u("u_time"), uMouse = u("u_mouse"), uMouseAmt = u("u_mouseAmt");
		const uColumn = u("u_column"), uScroll = u("u_scroll");
		gl.uniform3fv(u("u_wall"), cssRgb("--background", [0.98, 0.98, 0.973]));
		gl.uniform3fv(u("u_ink"), cssRgb("--ink", [0.067, 0.067, 0.067]));

		// CSS-pixel resolution: the lines are soft, so skipping the device pixel ratio costs nothing visible.
		let scale = 1;
		const resize = () => {
			canvas.width = Math.max(1, Math.round(window.innerWidth * scale));
			canvas.height = Math.max(1, Math.round(window.innerHeight * scale));
			gl.viewport(0, 0, canvas.width, canvas.height);
			gl.uniform2f(uRes, canvas.width, canvas.height);
			gl.uniform1f(uColumn, Math.min(0.5, CONTENT_WIDTH / 2 / window.innerWidth));
		};
		resize();
		window.addEventListener("resize", resize);

		// Cursor, smoothed so the twist trails the pointer like a hand moving through water.
		const target = { x: 0.5, y: 0.5, amt: 0 };
		const cur = { x: 0.5, y: 0.5, amt: 0 };
		const onMove = (e: PointerEvent) => {
			target.x = e.clientX / window.innerWidth;
			target.y = 1 - e.clientY / window.innerHeight;
			target.amt = 1;
		};
		const onLeave = () => { target.amt = 0; };
		if (hasHover) {
			window.addEventListener("pointermove", onMove, { passive: true });
			document.documentElement.addEventListener("pointerleave", onLeave);
		}

		const draw = (time: number) => {
			const k = still ? 1 : 0.07;
			cur.x += (target.x - cur.x) * k;
			cur.y += (target.y - cur.y) * k;
			cur.amt += (target.amt - cur.amt) * k * 0.6;
			gl.uniform1f(uTime, time);
			gl.uniform2f(uMouse, cur.x, cur.y);
			gl.uniform1f(uMouseAmt, cur.amt);
			gl.uniform1f(uScroll, window.scrollY);
			gl.drawArrays(gl.TRIANGLES, 0, 3);
		};

		if (still) {
			draw(0);
			const redraw = () => { resize(); draw(0); };
			window.addEventListener("resize", redraw);
			return () => {
				window.removeEventListener("resize", resize);
				window.removeEventListener("resize", redraw);
				window.removeEventListener("pointermove", onMove);
				document.documentElement.removeEventListener("pointerleave", onLeave);
			};
		}

		// Vsync-paced. If frames stay slow for a couple of seconds (after the page's own load
		// animations have settled), halve the resolution once.
		let frame = 0;
		let last = 0;
		let slow = 0;
		const start = performance.now();
		const loop = (now: number) => {
			frame = requestAnimationFrame(loop);
			if (last && scale === 1 && now - start > 2000 && now - last > SLOW_FRAME_MS) {
				if (++slow > 90) { scale = 0.5; resize(); }
			} else if (slow > 0) {
				slow--;
			}
			last = now;
			draw((now - start) / 1000);
		};
		const onVisibility = () => {
			cancelAnimationFrame(frame);
			last = 0;
			if (!document.hidden) frame = requestAnimationFrame(loop);
		};
		frame = requestAnimationFrame(loop);
		document.addEventListener("visibilitychange", onVisibility);
		return () => {
			cancelAnimationFrame(frame);
			document.removeEventListener("visibilitychange", onVisibility);
			window.removeEventListener("resize", resize);
			window.removeEventListener("pointermove", onMove);
			document.documentElement.removeEventListener("pointerleave", onLeave);
			gl.getExtension("WEBGL_lose_context")?.loseContext();
		};
	}, []);

	return <canvas ref={ref} aria-hidden className="ink-wall" />;
}
