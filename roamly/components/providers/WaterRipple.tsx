"use client";

import React, { useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ============================================================================
// SIMULATION & RENDER SHADERS
// ============================================================================

const simVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

// Drop shader: injects circular ripples at the mouse coordinates
const dropShader = `
  uniform sampler2D uTexture;
  uniform vec2 uCenter;
  uniform float uRadius;
  uniform float uStrength;
  uniform float uAspect;
  varying vec2 vUv;

  void main() {
    vec4 info = texture2D(uTexture, vUv);
    vec2 p = vUv - uCenter;
    p.x *= uAspect;
    float dist = length(p);
    
    if (dist < uRadius) {
      float drop = max(0.0, 1.0 - dist / uRadius);
      drop = 0.5 - cos(drop * 3.14159265) * 0.5;
      info.r += drop * uStrength;
    }
    
    gl_FragColor = info;
  }
`;

// Wave equation propagation shader (Ping-Pong simulation step)
const stepShader = `
  uniform sampler2D uTexture;
  uniform vec2 uDelta;
  uniform float uViscosity;
  varying vec2 vUv;

  void main() {
    vec4 info = texture2D(uTexture, vUv);
    
    float dx = uDelta.x;
    float dy = uDelta.y;

    float left   = texture2D(uTexture, vUv + vec2(-dx, 0.0)).r;
    float right  = texture2D(uTexture, vUv + vec2(dx, 0.0)).r;
    float top    = texture2D(uTexture, vUv + vec2(0.0, dy)).r;
    float bottom = texture2D(uTexture, vUv + vec2(0.0, -dy)).r;

    // Wave equation propagation
    float newHeight = (left + right + top + bottom) * 0.5 - info.g;
    
    // Viscosity and decay damping
    newHeight *= uViscosity;

    info.g = info.r; // store previous height
    info.r = newHeight; // store current height

    gl_FragColor = info;
  }
`;

// Final Water Display Shaders (Background image refraction, normal calculation, aberration, specular)
const waterVertexShader = `
  varying vec2 vUv;
  varying vec2 vScreenUv;
  uniform vec2 uViewportSize;

  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vScreenUv = (worldPos.xy + uViewportSize * 0.5) / uViewportSize;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const waterFragmentShader = `
  uniform sampler2D uTexture;
  uniform sampler2D uSimulation;
  uniform float uDistortionStrength;
  uniform float uAberration;
  uniform float uLightIntensity;
  uniform float uSpecularPower;
  uniform float uImageAspect;
  uniform float uPlaneAspect;
  uniform vec2 uDelta;

  varying vec2 vUv;

  vec2 coverUv(vec2 uv, float imageAspect, float planeAspect) {
    vec2 ratio = vec2(
      min(planeAspect / imageAspect, 1.0),
      min(imageAspect / planeAspect, 1.0)
    );
    return vec2(
      uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      uv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );
  }

  void main() {
    vec2 coveredUv = coverUv(vUv, uImageAspect, uPlaneAspect);

    // Sample neighboring simulation pixels to calculate surface normal gradient
    float left   = texture2D(uSimulation, vUv + vec2(-uDelta.x, 0.0)).r;
    float right  = texture2D(uSimulation, vUv + vec2(uDelta.x, 0.0)).r;
    float bottom = texture2D(uSimulation, vUv + vec2(0.0, -uDelta.y)).r;
    float top    = texture2D(uSimulation, vUv + vec2(0.0, uDelta.y)).r;

    vec3 normal = normalize(vec3((left - right) * 2.0, (bottom - top) * 2.0, 0.2));

    // Refraction UV offset based on surface normal
    vec2 refraction = normal.xy * uDistortionStrength;
    vec2 distortedUv = clamp(coveredUv + refraction, 0.001, 0.999);

    float aberrationAmount = uAberration * length(refraction);

    // Chromatic Aberration RGB channel separation sampling
    vec4 colorR = texture2D(uTexture, distortedUv + vec2(aberrationAmount, 0.0));
    vec4 colorG = texture2D(uTexture, distortedUv);
    vec4 colorB = texture2D(uTexture, distortedUv - vec2(aberrationAmount, 0.0));

    vec3 color = vec3(colorR.r, colorG.g, colorB.b);

    // Specular lighting highlights
    vec3 lightDir = normalize(vec3(0.5, 0.5, 1.0));
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 halfDir = normalize(lightDir + viewDir);

    float specular = pow(max(dot(normal, halfDir), 0.0), uSpecularPower) * uLightIntensity * abs(normal.x + normal.y);
    color += vec3(specular);

    gl_FragColor = vec4(color, 1.0);
  }
`;

// ============================================================================
// WEBGL SCENE CONTROLLER & MESH
// ============================================================================

function SimulationPlane({ imageSrc }: { imageSrc: string }) {
  const { gl, viewport } = useThree();
  const mouseRef = useRef({ x: 0.5, y: 0.5, prevX: 0.5, prevY: 0.5, down: false, speed: 0 });
  const simMatRef = useRef<THREE.ShaderMaterial | null>(null);
  const dropMatRef = useRef<THREE.ShaderMaterial | null>(null);
  const waterMatRef = useRef<THREE.ShaderMaterial | null>(null);
  
  const imageAspectRef = useRef(1);

  // Simulation Render Targets (Ping-Pong Buffers)
  const simWidth = 256;
  const simHeight = 256;

  const targetA = useRef<THREE.WebGLRenderTarget | null>(null);
  const targetB = useRef<THREE.WebGLRenderTarget | null>(null);
  const simScene = useRef(new THREE.Scene());
  const simCamera = useRef(new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1));
  const quadMesh = useRef<THREE.Mesh | null>(null);

  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(imageSrc, (loadedTex) => {
      const img = loadedTex.image as HTMLImageElement;
      if (img) {
        imageAspectRef.current = img.naturalWidth / img.naturalHeight;
      }
    });
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }, [imageSrc]);

  useEffect(() => {
    targetA.current = new THREE.WebGLRenderTarget(simWidth, simHeight, {
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    });
    targetB.current = new THREE.WebGLRenderTarget(simWidth, simHeight, {
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    });

    const geom = new THREE.PlaneGeometry(2, 2);

    simMatRef.current = new THREE.ShaderMaterial({
      vertexShader: simVertexShader,
      fragmentShader: stepShader,
      uniforms: {
        uTexture: { value: null },
        uDelta: { value: new THREE.Vector2(1 / simWidth, 1 / simHeight) },
        uViscosity: { value: 0.985 },
      },
    });

    dropMatRef.current = new THREE.ShaderMaterial({
      vertexShader: simVertexShader,
      fragmentShader: dropShader,
      uniforms: {
        uTexture: { value: null },
        uCenter: { value: new THREE.Vector2(0.5, 0.5) },
        uRadius: { value: 0.03 },
        uStrength: { value: 0.02 },
        uAspect: { value: 1.0 },
      },
    });

    quadMesh.current = new THREE.Mesh(geom, simMatRef.current);
    simScene.current.add(quadMesh.current);

    return () => {
      targetA.current?.dispose();
      targetB.current?.dispose();
      geom.dispose();
    };
  }, []);

  // Pointer tracking & force injection
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = 1.0 - e.clientY / window.innerHeight;

      const dx = x - mouseRef.current.x;
      const dy = y - mouseRef.current.y;
      mouseRef.current.speed = Math.sqrt(dx * dx + dy * dy);

      mouseRef.current.prevX = mouseRef.current.x;
      mouseRef.current.prevY = mouseRef.current.y;
      mouseRef.current.x = x;
      mouseRef.current.y = y;
      mouseRef.current.down = true;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  // Frame Loop: Ping-Pong Simulation Steps + Water Distort Rendering
  useFrame(() => {
    if (!targetA.current || !targetB.current || !quadMesh.current) return;

    const renderer = gl;
    const currentRenderTarget = renderer.getRenderTarget();

    // 1. Inject drop if mouse moved
    if (mouseRef.current.down && dropMatRef.current && simMatRef.current) {
      quadMesh.current.material = dropMatRef.current;
      dropMatRef.current.uniforms.uTexture.value = targetA.current.texture;
      dropMatRef.current.uniforms.uCenter.value.set(mouseRef.current.x, mouseRef.current.y);
      dropMatRef.current.uniforms.uStrength.value = Math.min(0.03, 0.005 + mouseRef.current.speed * 0.4);
      dropMatRef.current.uniforms.uAspect.value = simWidth / simHeight;

      renderer.setRenderTarget(targetB.current);
      renderer.render(simScene.current, simCamera.current);

      // Swap targets
      const temp = targetA.current;
      targetA.current = targetB.current;
      targetB.current = temp;

      mouseRef.current.speed *= 0.8;
      if (mouseRef.current.speed < 0.0001) {
        mouseRef.current.down = false;
      }
    }

    // 2. Step simulation forward (Wave propagation)
    if (simMatRef.current) {
      quadMesh.current.material = simMatRef.current;
      simMatRef.current.uniforms.uTexture.value = targetA.current.texture;

      renderer.setRenderTarget(targetB.current);
      renderer.render(simScene.current, simCamera.current);

      // Swap targets
      const temp = targetA.current;
      targetA.current = targetB.current;
      targetB.current = temp;
    }

    // Restore original render target
    renderer.setRenderTarget(currentRenderTarget);

    // Update water shader simulation texture reference
    if (waterMatRef.current && targetA.current) {
      waterMatRef.current.uniforms.uSimulation.value = targetA.current.texture;
      waterMatRef.current.uniforms.uImageAspect.value = imageAspectRef.current;
      waterMatRef.current.uniforms.uPlaneAspect.value = viewport.width / viewport.height;
    }
  });

  const waterMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: waterVertexShader,
      fragmentShader: waterFragmentShader,
      uniforms: {
        uTexture: { value: texture },
        uSimulation: { value: null },
        uDistortionStrength: { value: 0.12 },
        uAberration: { value: 0.012 },
        uLightIntensity: { value: 0.65 },
        uSpecularPower: { value: 32.0 },
        uViewportSize: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uImageAspect: { value: 1.0 },
        uPlaneAspect: { value: 1.0 },
        uDelta: { value: new THREE.Vector2(1 / simWidth, 1 / simHeight) },
      },
    });
  }, [texture]);

  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <primitive ref={waterMatRef} object={waterMaterial} attach="material" />
    </mesh>
  );
}

export default function WaterRipple({ imageSrc }: { imageSrc: string }) {
  const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    return (
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: `url(${imageSrc})` }} 
      />
    );
  }

  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden pointer-events-auto">
      <Canvas
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 5], fov: 50, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        className="h-full w-full"
      >
        <color attach="background" args={["#0a0a0a"]} />
        <SimulationPlane imageSrc={imageSrc} />
      </Canvas>
    </div>
  );
}