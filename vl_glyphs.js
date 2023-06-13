import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

import { Gesture } from "https://cdn.skypack.dev/@use-gesture/vanilla";

const IS_DEBUG = window.location.port.length > 0;
const GLYPH_FROM_ROTATION = Math.PI * -2;

const GLYPH_SRC = [
  {
    name: "A",
    src: "https://uploads-ssl.webflow.com/603379589922195849a7718c/64594108c63b66596e225d15_a_glyph_van_loon.gltf.txt",
  },
  {
    name: "O",
    src: "https://uploads-ssl.webflow.com/603379589922195849a7718c/64594108626c3017a92bfeaf_o_glyph_van_loon.gltf.txt",
  },
  {
    name: "N",
    src: "https://uploads-ssl.webflow.com/603379589922195849a7718c/645941081911cd17ae54d71f_n_glyph_van_loon.gltf.txt",
  },
  {
    name: "L",
    src: "https://uploads-ssl.webflow.com/603379589922195849a7718c/645941088474694b20fbd33d_l_glyph_van_loon.gltf.txt",
  },
  {
    name: "V",
    src: "https://uploads-ssl.webflow.com/603379589922195849a7718c/6459410800413fdec23ab65c_v_glyph_van_loon.gltf.txt",
  },
];

const glyphs = [
  // TEMP: for testing distance
  // {
  //   type: "O",
  //   element: IS_DEBUG ? "h3" : ".GLYPH-O-5",
  //   elementOffset: new THREE.Vector3(5, 2, 0),
  //   overridePosition: new THREE.Vector3(0, 0, 0),
  //   elementPositionX: "top",
  //   elementPositionY: "right",
  //   rotation: new THREE.Euler(0.2, -Math.PI, 1),
  //   //scale: 0.5,
  // },

  {
    // OK
    type: "A",
    element: IS_DEBUG ? "h1" : ".GLYPH-A-1",
    elementOffset: new THREE.Vector3(2.3, 0.5, 0),
    elementPositionX: "left",
    elementPositionY: "top",
    rotation: new THREE.Euler(-0.1, Math.PI - GLYPH_FROM_ROTATION, 0.4),
    //scale: 0.5,
  },
  {
    // OK
    type: "O",
    element: IS_DEBUG ? "h2" : ".GLYPH-O-1",
    elementOffset: new THREE.Vector3(1.3, -1.2, 0),
    elementPositionX: "right",
    elementPositionY: "bottom",
    rotation: new THREE.Euler(0.3, 0.1),
    //scale: 0.5,
  },
  {
    // OK
    type: "L",
    element: IS_DEBUG ? "h3" : ".GLYPH-L-1",
    elementOffset: new THREE.Vector3(1.6, -0.4, 0),
    elementPositionX: "top",
    elementPositionY: "left",
    rotation: new THREE.Euler(0.8, 0.3, 0),
    //scale: 0.6,
  },
  {
    type: "A",
    element: IS_DEBUG ? "h3" : ".GLYPH-A-2",
    elementOffset: new THREE.Vector3(8.2, 1.5, 0),
    elementPositionX: "top",
    elementPositionY: "right",
    rotation: new THREE.Euler(0.7, Math.PI + GLYPH_FROM_ROTATION, 0.4),
    //scale: 0.4,
  },
  // {
  //     type: "O",
  //     element: IS_DEBUG ? "h3" : ".GLYPH-O-2",
  //     elementOffset: new THREE.Vector3(0.6, -0.4, 0),
  //     elementPositionX: "bottom",
  //     elementPositionY: "left",
  //     rotation: new THREE.Euler(-0.1, Math.PI - GLYPH_FROM_ROTATION, 0.4),
  //     //scale: 0.4,
  // },
  {
    // OK
    type: "N",
    element: IS_DEBUG ? "h1" : ".GLYPH-N-1",
    elementOffset: new THREE.Vector3(-1, -0.2, 0),
    elementPositionX: "top",
    elementPositionY: "right",
    rotation: new THREE.Euler(-0.1, Math.PI - GLYPH_FROM_ROTATION, 0.4),
    //scale: 0.4,
  },
  // {
  //     type: "L",
  //     element: IS_DEBUG ? "h3" : ".GLYPH-L-2",
  //     elementOffset: new THREE.Vector3(0.3, 0, 0),
  //     elementPositionX: "top",
  //     elementPositionY: "left",
  //     rotation: new THREE.Euler(-0.2, Math.PI + GLYPH_FROM_ROTATION, 0.4),
  ////     scale: 0.5,
  // },
  {
    // OK
    type: "A",
    element: IS_DEBUG ? "h3" : ".GLYPH-A-3",
    elementOffset: new THREE.Vector3(3.3, -0.1, 0),
    elementPositionX: "top",
    elementPositionY: "right",
    rotation: new THREE.Euler(-0.2, Math.PI, 1),
    //scale: 0.5,
  },
  {
    type: "O",
    element: IS_DEBUG ? "h2" : ".GLYPH-O-3",
    elementOffset: new THREE.Vector3(0, 0.1, 0),
    elementPositionX: "top",
    elementPositionY: "right",
    rotation: new THREE.Euler(0.2, -Math.PI, 1),
    //scale: 0.5,
  },
  {
    type: "O",
    element: IS_DEBUG ? "h3" : ".GLYPH-O-4",
    elementOffset: new THREE.Vector3(0, 0.1, 0),
    elementPositionX: "top",
    elementPositionY: "left",
    rotation: new THREE.Euler(0.2, -Math.PI, 1),
    //scale: 0.5,
  },
  {
    // OK
    type: "A",
    element: IS_DEBUG ? "h1" : ".GLYPH-A-5",
    elementOffset: new THREE.Vector3(-1.5, 1.1, 0),
    elementPositionX: "top",
    elementPositionY: "right",
    rotation: new THREE.Euler(0.2, -Math.PI, 1),
    //scale: 0.5,
  },
  {
    type: "O",
    element: IS_DEBUG ? "h3" : ".GLYPH-O-5",
    elementOffset: new THREE.Vector3(5, 2, 0),
    elementPositionX: "top",
    elementPositionY: "right",
    rotation: new THREE.Euler(0.2, -Math.PI, 1),
    //scale: 0.5,
  },
].map((g) => ({
  ...g,
  position: new THREE.Vector3(),
  __mesh: null,
  __interactionGroup: null,
  __rand: Math.random(),
  __objIn: { value: 0 },
  // Webflow converts classes to lowercase
  element: g.element.toLowerCase(),
}));

// window.onbeforeunload = function () {
//   window.scrollTo(0, 0);
// };

window.addEventListener(
  "load",
  function (event) {
    main();
  },
  false
);

async function main() {
  const ENV_MAP_PATH =
    "https://uploads-ssl.webflow.com/603379589922195849a7718c/644ed7aeae089038fc622679_envmap.jpg";
  const VAN_LOON_BLUE_COLOR = new THREE.Color("rgb(0,0,105)");
  const VAN_LOON_BLUE_EMISSIVE = new THREE.Color("rgb(0,0,100)");
  const VAN_LOON_FRESNEL = new THREE.Color("rgb(2,10,100)");

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  function easeInOutQuint(x) {
    return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
  }

  function pixelsToUnits(px) {
    const dist = camera.position.z;
    const fov = camera.fov;
    const height = 2 * dist * Math.tan(fov * 0.5 * (Math.PI / 180));
    const units = (px / window.innerHeight) * height;

    return units;
  }

  let _scrollPosY = 0;
  let _scrollVelY = 0;
  let __scrollVelY = 0;

  // Glyphs that the mouse is close to
  let activeGlyphs = [];

  const mouseMoveVelocity = new THREE.Vector3();
  const _mouseMoveVelocity = new THREE.Vector3();

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function onPointerMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  const gesture = new Gesture(window, {
    onScroll: (state) => {
      // const [x, y] = state.delta;
      const [_, velY] = state.delta;
      const [__, offsetY] = state.offset;
      // const [___, dirY] = state.direction;

      _scrollVelY = velY;
      _scrollPosY = offsetY;
      // _scrollDirY = dirY;
    },
    onMove: (state) => {
      const [dirX, dirY] = state.direction;
      const [velX, velY] = state.velocity;
      mouseMoveVelocity.set(velX * dirX * -1, velY * dirY * -1, 0);
    },
  });

  const textureLoader = new THREE.TextureLoader();
  const envMapPromise = new Promise((resolve, reject) => {
    textureLoader.load(
      ENV_MAP_PATH,
      (result) => {
        resolve(result);
      },
      null,
      (err) => {
        console.log(err);
        reject(err);
      }
    );
  });

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  const rootEl = document.querySelector(".three_root");

  renderer.setSize(window.innerWidth, window.innerHeight);
  rootEl.appendChild(renderer.domElement);

  const gltfLoader = new GLTFLoader();

  const glyphPromises = GLYPH_SRC.map(
    (glyph, i) =>
      new Promise((resolve, reject) => {
        gltfLoader.load(
          glyph.src,
          (result) => {
            result.name = GLYPH_SRC[i].name;

            resolve(result);
          },
          null,
          (err) => {
            console.log(err);
            reject(err);
          }
        );
      })
  );

  function setGlyphPositionBasedOnDOM(glyph) {
    const el = document.querySelector(glyph.element);

    if (!el) {
      glyph.__mesh.visible = false;
      return console.warn(`No element ${glyph.element}`);
    }

    let posOffsetX = 0,
      posOffsetY = 0;
    const boundingBox = el.getBoundingClientRect();

    if (!boundingBox.width || !boundingBox.height) {
      glyph.__mesh.visible = false;
      console.warn(
        `${glyph.element} has no bounding box information, the object has been removed from the scene`
      );
      return;
    }

    if (glyph.elementPositionX === "right") {
      posOffsetX = pixelsToUnits(boundingBox.width);
    }

    if (glyph.elementPositionY === "bottom") {
      posOffsetY = pixelsToUnits(boundingBox.height);
    }

    glyph.position.set(
      pixelsToUnits(window.innerWidth / -2),
      pixelsToUnits(window.innerHeight / 2)
    );

    glyph.position.x +=
      pixelsToUnits(el.offsetLeft) + glyph.elementOffset.x + posOffsetX;

    glyph.position.y -=
      pixelsToUnits(el.offsetTop) + glyph.elementOffset.y + posOffsetY;
  }

  function copyGlyphContainerTransforms(glyph) {
    // All groups should copy affine transforms from initial position
    glyph.__initialGroup.position.copy(glyph.position);
    glyph.__initialGroup.rotation.copy(glyph.rotation);

    glyph.__interactionGroup.position.copy(glyph.position);
    glyph.__interactionGroup.rotation.copy(glyph.rotation);

    // glyph.__animationGroup.position.copy(glyph.position);
    // glyph.__animationGroup.rotation.copy(glyph.rotation);
  }

  function animateIn() {
    glyphs.forEach((glyph, i) => {
      const _obj = { value: 0 };

      gsap.to(_obj, {
        value: 1,
        duration: 2,
        ease: Quint.easeOut,
        delay: i * 0.5,
        onUpdate: () => {
          glyph.__animationGroup.scale.setScalar(_obj.value);
          glyph.__animationGroup.rotation.y = THREE.MathUtils.mapLinear(
            _obj.value,
            0,
            1,
            Math.PI * 2,
            0
          );
        },
      });
    });
  }

  const glyphResults = await Promise.all([
    ...glyphPromises,
    envMapPromise,
  ]).finally(() => {
    // setTimeout(() => {

    animateIn();
    // }, 1000);
  });

  const envMapTexture = glyphResults.find((r) => r instanceof THREE.Texture);
  glyphs.forEach((glyph, i) => {
    const glyphScene = glyphResults
      .find((r) => r.name === glyph.type)
      .scene.clone();
    glyphScene.traverse((c) => {
      c.__ID__ = i;
    });

    const glyphObj = glyphScene.children[0].children[0].children[0];
    glyphObj.geometry.center();
    glyphObj.material.userData = {
      uFresnelColor: { value: VAN_LOON_FRESNEL.convertLinearToSRGB() },
    };

    glyphObj.material.onBeforeCompile = function (shader) {
      Object.keys(glyphObj.material.userData).forEach((uName) => {
        shader.uniforms[uName] = glyphObj.material.userData[uName];
      });

      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        /*glsl*/ `
            #include <common>

            varying vec3 vPositionW;
            varying vec3 vNormalW;
            varying vec2 vUv;
        `
      );

      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        /*glsl*/ `
            #include <begin_vertex>

            vPositionW = normalize(vec3(modelViewMatrix * vec4(position, 1.0)).xyz);
            vNormalW = normalize(normalMatrix * normal);
            vUv = uv;
        `
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <common>",
        /*glsl*/ `
            #include <common>

            varying vec3 vPositionW;
            varying vec3 vNormalW;
            varying vec2 vUv;

            uniform vec3 uFresnelColor;

            float aastep(float threshold, float value) {
                // float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;
                float afwidth = fwidth(value) * 0.5;
                return smoothstep(threshold-afwidth, threshold+afwidth, value);
            }

            float aastep(float threshold, float value, float padding) {
                return smoothstep(threshold - padding, threshold + padding, value);
            }

            vec2 aastep(vec2 threshold, vec2 value) {
                return vec2(
                    aastep(threshold.x, value.x),
                    aastep(threshold.y, value.y)
                );
            }
        `
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <dithering_fragment>",
        /*glsl*/ `
                #include <dithering_fragment>
                
                float fresnelIntensity = .3;
                float fresnelTerm = (1.0 - -min(dot(vPositionW, normalize(vNormalW) ), 0.0));    
                vec3 fresnelColor = uFresnelColor;
                
                gl_FragColor = mix(gl_FragColor, gl_FragColor + vec4(fresnelColor, 1.) * vec4(fresnelTerm), fresnelIntensity);
        `
      );
    };

    glyphObj.material = new THREE.MeshStandardMaterial({
      ...glyphObj.material,
      envMap: envMapTexture,
      envMapIntensity: 1,
      roughness: 1,
      metalness: 0,
      color: VAN_LOON_BLUE_COLOR,
      emissive: VAN_LOON_BLUE_EMISSIVE,
    });

    // Used only to apply initial position and later on as initial ref point
    const initialGroup = new THREE.Group();
    // Used for mouse move and scroll interactions
    const interactionGroup = new THREE.Group();
    // Used for in/out animation
    const animationGroup = new THREE.Group();

    glyph.__mesh = glyphScene;

    glyph.__initialGroup = initialGroup;
    glyph.__interactionGroup = interactionGroup;
    glyph.__animationGroup = animationGroup;

    glyph.__worldPos = new THREE.Vector3();

    // Pos will be handled in loop,
    // if we handle it here we'll get a weird offset from origin
    glyphScene.scale.setScalar(0.6);
    glyphScene.rotation.copy(glyph.rotation);

    glyph.__animationGroup.scale.setScalar(0);

    if (glyph.overridePosition)
      glyph.__mesh.position.copy(glyph.overridePosition);
    else setGlyphPositionBasedOnDOM(glyph);
    copyGlyphContainerTransforms(glyph);

    glyph.__animationGroup.add(glyphScene);
    glyph.__interactionGroup.add(glyph.__animationGroup);
    scene.add(glyph.__interactionGroup);
  });

  const clock = new THREE.Clock();

  function render() {
    window.requestAnimationFrame(render);
    renderer.render(scene, camera);

    const t = clock.getElapsedTime();

    _mouseMoveVelocity.lerp(mouseMoveVelocity, 0.5);
    //_scrollVelocity.lerp(scrollVelocity, 0.001);
    //_scrollRot = THREE.MathUtils.lerp(_scrollRot, _scrollVelocity.y, 0.01);
    __scrollVelY = THREE.MathUtils.lerp(__scrollVelY, _scrollVelY, 0.1);

    const nextY = pixelsToUnits(_scrollPosY) * -1;
    camera.position.y = nextY;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    for (let i = 0; i < intersects.length; i++) {
      activeGlyphs = intersects.map(
        (intersection) => intersection.object.__ID__
      );
    }

    glyphs.forEach((glyph, i) => {
      const idleSpeed = 0.5;
      const idleAmplitude = 100;
      let idleT = Math.sin(t * idleSpeed + i * idleAmplitude);
      // Normalize -1 - 1 to 0 - 1
      idleT = (idleT + 1) * 0.5;
      idleT = idleT;
      glyph.__interactionGroup.position.y =
        glyph.__initialGroup.position.y + idleT;

      glyph.__interactionGroup.rotation.z += idleT * 0.01;

      let toRotZ = glyph.__initialGroup.rotation.z;
      let toRotY = glyph.__initialGroup.rotation.y;

      if (activeGlyphs.includes(i)) {
        toRotZ -= _mouseMoveVelocity.y;
        toRotY -= _mouseMoveVelocity.x;
      }

      glyph.__interactionGroup.rotation.z = THREE.MathUtils.lerp(
        glyph.__interactionGroup.rotation.z,
        toRotZ,
        0.01
      );
      glyph.__interactionGroup.rotation.y = THREE.MathUtils.lerp(
        glyph.__interactionGroup.rotation.y,
        toRotY,
        0.01
      );
    });
  }

  render();

  window.addEventListener("resize", onWindowResize, false);
  window.addEventListener("pointermove", onPointerMove);

  function onWindowResize() {
    glyphs.forEach((glyph) => {
      setGlyphPositionBasedOnDOM(glyph);
      copyGlyphContainerTransforms(glyph);
    });

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
