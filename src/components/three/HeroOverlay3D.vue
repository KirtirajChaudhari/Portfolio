<template>
  <!-- Optional 3D layer over the portrait. Mounts only once a model has
       actually loaded, so no WebGL context is spent when the asset is absent. -->
  <div v-if="ready" class="overlay3d" aria-hidden="true">
    <TresCanvas alpha render-mode="always" :antialias="true">
      <TresPerspectiveCamera :position="CAM_POS" :fov="45" />
      <TresAmbientLight :intensity="0.6" />
      <TresDirectionalLight :position="KEY_POS" :intensity="1.1" />
      <primitive :object="model" />
    </TresCanvas>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, onMounted, onUnmounted } from 'vue';
import { TresCanvas } from '@tresjs/core';
import { gsap } from 'gsap';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Vector3, type Object3D } from 'three';

/* Tres types these as Vector3, not the array shorthand. */
const CAM_POS = new Vector3(0, 0, 5);
const KEY_POS = new Vector3(6, 8, 5);

const props = withDefaults(defineProps<{
  /** Model to load. Absent file = layer never mounts, hero still complete. */
  src?: string;
  /** Peak rotation in radians at the screen edge. */
  swing?: number;
  scale?: number;
}>(), {
  src: '/models/hero.glb',
  swing: Math.PI / 8,
  scale: 2,
});

const ready = ref(false);
const model = shallowRef<Object3D | null>(null);

/* Normalised pointer, -1..1, written by the window listener. */
const pointer = { x: 0, y: 0 };

function onMove(e: PointerEvent) {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
}

/* Lerp toward the pointer on the ticker Lenis already drives, rather than
   standing up a second RAF loop for one object. */
function tick() {
  const obj = model.value;
  if (!obj) return;
  obj.rotation.y += (pointer.x * props.swing - obj.rotation.y) * 0.1;
  obj.rotation.x += (pointer.y * props.swing - obj.rotation.x) * 0.1;
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  new GLTFLoader().load(
    props.src,
    (gltf) => {
      gltf.scene.scale.setScalar(props.scale);
      model.value = gltf.scene;
      ready.value = true;
      window.addEventListener('pointermove', onMove, { passive: true });
      gsap.ticker.add(tick);
    },
    undefined,
    /* No model shipped yet — stay silent and leave the hero as-is. */
    () => {},
  );
});

onUnmounted(() => {
  window.removeEventListener('pointermove', onMove);
  gsap.ticker.remove(tick);
});
</script>

<style scoped>
.overlay3d {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}
</style>
