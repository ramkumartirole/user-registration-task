// import React, { useMemo } from 'react';
// import { useGLTF } from '@react-three/drei';

// export default function TallCabinetHanger({ isSelected, ...props }) {
//   const { nodes, materials } = useGLTF('./models/parts144/TallCabinetHanger.glb');

//   const highlightedMaterial2 = useMemo(() => {
//     const material = materials.Material_2.clone();

//     material.emissiveIntensity = 1;
//     return material;
//   }, [materials.Material_2]);

//   const highlightedMaterialLock002 = useMemo(() => {
//     const material = materials['lock.002'].clone();

//     material.emissiveIntensity = 1;
//     return material;
//   }, [materials['lock.002']]);

//   return (
//     <group {...props} dispose={null}>
//       <group position={[0.511, 1.525, -0.447]}>
//         <mesh
//           castShadow
//           receiveShadow
//           geometry={nodes.Object_29001_1.geometry}
//           material={isSelected ? highlightedMaterial2 : materials.Material_2}
//         />
//         <mesh
//           castShadow
//           receiveShadow
//           geometry={nodes.Object_29001_2.geometry}
//           material={isSelected ? highlightedMaterialLock002 : materials['lock.002']}
//         />
//       </group>
//     </group>
//   );
// }

// useGLTF.preload('./models/parts144/TallCabinetHanger.glb');