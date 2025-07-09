import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
// import * as THREE from "three";

export const VanInteriorControls = ({ showInterior }) => {
  const { camera } = useThree();

  useEffect(() => {
    if (showInterior) {
      // Interior view
      camera.position.set(0, 1.2, 0.5);
      camera.lookAt(0, 1, 2);
    } else {
      // Exterior view
      camera.position.set(-4, 3, -4.8);
      camera.lookAt(0, 0, 0);
    }
  }, [showInterior]);

  return null;
};