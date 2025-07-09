import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";

export const ModelPreloader = (vanName) => {
  useEffect(() => {
    if (!vanName) return;
    const formattedName = vanName.replace(/\s+/g, "");
    const modelPath = `/models/AllColorGLB144/Van_${formattedName}.glb`;

    useGLTF.preload(modelPath);
    // console.log("Preloading model:", modelPath);
  }, [vanName]);
};
