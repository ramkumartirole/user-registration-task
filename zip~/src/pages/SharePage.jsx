import React, { useState, useEffect, Suspense, useRef } from "react";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Center } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
// TOP OF FILE
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

import Swal from "sweetalert2";
import "./SharePage.css";

const SharePage = () => {
  const code = new URL(window.location.href).searchParams.get("code");
  const directUrl = new URL(window.location.href).searchParams.get("modelUrl");
  const [modelUrl, setModelUrl] = useState(null); // ← use this in the loader
  const [loading, setLoading] = useState(true);
  const [gltf, setGltf] = useState(null);
  const [interiorView, setInteriorView] = useState(false);
  const controlsRef = useRef();

  const exteriorCameraPosition = new THREE.Vector3(-8, 0, 0);
  const interiorCameraPosition = new THREE.Vector3(0, 0, 0);
  const exteriorTarget = new THREE.Vector3(0, 0, 0);
  const interiorTarget = new THREE.Vector3(0.01, 0.0, 0.01);

  // 🌟 1. Resolve short code into actual model URL
  useEffect(() => {
    const fetchUrl = async () => {
      try {
        if (directUrl) {
          setModelUrl(directUrl);
        } else if (code) {
          const res = await axios.get(`${API_BASE_URL}/api/links/code/${code}`);
          if (!res.data?.url) {
            throw new Error("No model URL found for this code.");
          }
          setModelUrl(res.data.url);
        } else {
          throw new Error("No valid model URL or code provided.");
        }
      } catch (err) {
        console.error("Failed to resolve model URL:", err);
        Swal.fire("Error", err.message || "Model not found", "error");
        setLoading(false);
      }
    };
    fetchUrl();
  }, [code, directUrl]);


  useEffect(() => {
    if (!modelUrl) return;

    const loadGltf = async () => {
      const loader = new GLTFLoader();
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.4.3/");
      loader.setDRACOLoader(dracoLoader);

      try {
        const data = await loader.loadAsync(modelUrl);
        setGltf(data);
      } catch (error) {
        console.error("Failed to load GLB model:", error);
        Swal.fire({
          icon: "error",
          title: "Model Load Failed",
          text: "Could not load the 3D model.",
        });
      } finally {
        setLoading(false);
      }
    };

    loadGltf();
  }, [modelUrl]);


  return (
    <div className="container-fluid">
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        gltf && (
          <Suspense fallback={<span className="loading">Just a moment</span>}>
            <div className="canvas-container" style={{ position: "relative" }}>
              <Canvas
                gl={{ preserveDrawingBuffer: true }}
                dpr={[1, 1.2]}
                camera={{
                  position: [
                    exteriorCameraPosition.x,
                    exteriorCameraPosition.y,
                    exteriorCameraPosition.z,
                  ],
                  fov: 50,
                }}
                frameloop="demand"
              >
                <Environment preset="city" />
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <Center>
                  <primitive object={gltf.scene} />
                </Center>
                <OrbitControls
                  ref={controlsRef}
                  enableDamping
                  dampingFactor={0.05}
                  target={
                    interiorView
                      ? [interiorTarget.x, interiorTarget.y, interiorTarget.z]
                      : [exteriorTarget.x, exteriorTarget.y, exteriorTarget.z]
                  }
                />
              </Canvas>

             
            </div>
          </Suspense>
        )
      )}
    </div>
  );
};

export default SharePage;
