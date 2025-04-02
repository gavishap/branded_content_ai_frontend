import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  MeshDistortMaterial,
  GradientTexture,
  OrbitControls
} from '@react-three/drei';
import { motion } from 'framer-motion';
import { colors, spacing, typography } from '../../utils/theme';

// Spinning 3D shape component
const AnimatedShape = ({
  position = [0, 0, 0],
  scale = 1,
  distortFactor = 0.4,
  speed = 0.5,
  color1 = colors.primary.light,
  color2 = colors.primary.dark,
  colorMid = colors.primary.main
}) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Rotate the object
  useFrame(state => {
    if (meshRef.current) {
      meshRef.current.rotation.x = meshRef.current.rotation.y += speed * 0.01;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={hovered ? scale * 1.1 : scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial
        distort={hovered ? distortFactor * 1.2 : distortFactor}
        speed={hovered ? 5 : 2}
        roughness={0.5}
      >
        <GradientTexture
          stops={[0, 0.5, 1]}
          colors={[color1, colorMid, color2]}
          size={1024}
        />
      </MeshDistortMaterial>
    </mesh>
  );
};

AnimatedShape.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number),
  scale: PropTypes.number,
  distortFactor: PropTypes.number,
  speed: PropTypes.number,
  color1: PropTypes.string,
  color2: PropTypes.string,
  colorMid: PropTypes.string
};

// Main 3D model viewer component
const ModelViewer3D = ({
  title,
  height = 300,
  animate = true,
  shapes = [
    {
      position: [0, 0, 0],
      scale: 1,
      distortFactor: 0.4,
      speed: 0.5,
      colors: [colors.primary.light, colors.primary.main, colors.primary.dark]
    }
  ]
}) => {
  // Motion animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      initial={animate ? 'hidden' : 'visible'}
      animate="visible"
      variants={containerVariants}
      style={{
        height: height,
        width: '100%',
        position: 'relative'
      }}
    >
      {title && (
        <h4
          style={{
            textAlign: 'center',
            margin: 0,
            marginBottom: spacing.sm,
            color: colors.neutral.darkGrey,
            fontWeight: typography.fontWeights.medium,
            fontSize: typography.fontSize.md
          }}
        >
          {title}
        </h4>
      )}

      <div
        style={{
          position: 'absolute',
          top: title ? '30px' : 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '8px',
          overflow: 'hidden',
          background: `linear-gradient(to bottom right, ${colors.neutral.lightGrey}, ${colors.neutral.white})`
        }}
      >
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <pointLight
            position={[-10, -10, -10]}
            intensity={0.5}
            color={colors.accent.purple}
          />

          {shapes.map((shape, index) => (
            <AnimatedShape
              key={`shape-${index}`}
              position={shape.position}
              scale={shape.scale}
              distortFactor={shape.distortFactor}
              speed={shape.speed}
              color1={shape.colors[0]}
              colorMid={shape.colors[1]}
              color2={shape.colors[2]}
            />
          ))}

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Canvas>

        {/* Overlay text at the bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: spacing.sm,
            textAlign: 'center',
            fontSize: typography.fontSize.xs,
            color: colors.neutral.darkGrey,
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(4px)'
          }}
        >
          Click and drag to interact
        </div>
      </div>
    </motion.div>
  );
};

ModelViewer3D.propTypes = {
  title: PropTypes.string,
  height: PropTypes.number,
  animate: PropTypes.bool,
  shapes: PropTypes.arrayOf(
    PropTypes.shape({
      position: PropTypes.arrayOf(PropTypes.number),
      scale: PropTypes.number,
      distortFactor: PropTypes.number,
      speed: PropTypes.number,
      colors: PropTypes.arrayOf(PropTypes.string)
    })
  )
};

export default ModelViewer3D;
