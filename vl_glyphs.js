import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

import { Gesture } from "https://cdn.skypack.dev/@use-gesture/vanilla";

const IS_DEBUG = window.location.port.length > 0;
const GLYPH_FROM_ROTATION = Math.PI * -2;

const GLYPH_SRC = [
    {
        name: "A",
        src: "https://uploads-ssl.webflow.com/603379589922195849a7718c/644eda97b6958181ae521001_a_glyph_van_loon_WF.gltf.txt",
    },
    {
        name: "O",
        src: "https://uploads-ssl.webflow.com/603379589922195849a7718c/644eda97ac066513ce630f14_o_glyph_van_loon_WF.gltf.txt",
    },
    {
        name: "N",
        src: "https://uploads-ssl.webflow.com/603379589922195849a7718c/644eda970014987c0babbbba_n_glyph_van_loon_WF.gltf.txt",
    },
    {
        name: "L",
        src: "https://uploads-ssl.webflow.com/603379589922195849a7718c/644eda97442c994d73c035fe_l_glyph_van_loon_WF.gltf.txt",
    },
    {
        name: "V",
        src: "https://uploads-ssl.webflow.com/603379589922195849a7718c/644eda97228bee398ef568d3_v_glyph_van_loon_WF.gltf.txt",
    },
];

const glyphs = [
    {
        type: "A",

        element: IS_DEBUG ? "h1" : ".GLYPH-A-1",
        elementOffset: new THREE.Vector3(0, 1, 0),
        elementPositionX: "left",
        elementPositionY: "top",

        rotation: new THREE.Euler(-0.1, Math.PI - GLYPH_FROM_ROTATION, 0.4),
        scale: 0.5,
    },
    {
        type: "O",

        element: IS_DEBUG ? "h2" : ".GLYPH-O-1",
        elementOffset: new THREE.Vector3(0.2, -0.4, 0),
        elementPositionX: "right",
        elementPositionY: "bottom",

        rotation: new THREE.Euler(),
        scale: 0.5,
    },
    {
        type: "L",

        element: IS_DEBUG ? "h3" : ".GLYPH-L-1",
        elementOffset: new THREE.Vector3(0.3, -0.4, 0),
        elementPositionX: "top",
        elementPositionY: "left",

        rotation: new THREE.Euler(0.2, 0.3, 0),
        scale: 0.6,
    },

    {
        type: "A",

        element: IS_DEBUG ? "h3" : ".GLYPH-A-2",
        elementOffset: new THREE.Vector3(0.3, -0.4, 0),
        elementPositionX: "top",
        elementPositionY: "right",

        rotation: new THREE.Euler(-0.1, Math.PI - GLYPH_FROM_ROTATION, 0.4),
        scale: 0.4,
    },

    {
        type: "O",

        element: IS_DEBUG ? "h3" : ".GLYPH-O-2",
        elementOffset: new THREE.Vector3(0.3, -0.4, 0),
        elementPositionX: "bottom",
        elementPositionY: "left",

        rotation: new THREE.Euler(-0.1, Math.PI - GLYPH_FROM_ROTATION, 0.4),
        scale: 0.4,
    },

    {
        type: "N",

        element: IS_DEBUG ? "h3" : ".GLYPH-N-1",
        elementOffset: new THREE.Vector3(-1, -0.2, 0),
        elementPositionX: "top",
        elementPositionY: "right",

        rotation: new THREE.Euler(-0.1, Math.PI - GLYPH_FROM_ROTATION, 0.4),
        scale: 0.5,
    },

    {
        type: "L",

        element: IS_DEBUG ? "h3" : ".GLYPH-L-2",
        elementOffset: new THREE.Vector3(0.3, 0, 0),
        elementPositionX: "top",
        elementPositionY: "left",

        rotation: new THREE.Euler(-0.2, Math.PI + GLYPH_FROM_ROTATION, 0.4),
        scale: 0.5,
    },

    {
        type: "A",

        element: IS_DEBUG ? "h3" : ".GLYPH-A-3",
        elementOffset: new THREE.Vector3(0.5, -0.1, 0),
        elementPositionX: "top",
        elementPositionY: "right",

        rotation: new THREE.Euler(-0.2, Math.PI, 1),
        scale: 0.5,
    },

    {
        type: "O",

        element: IS_DEBUG ? "h3" : ".GLYPH-O-3",
        elementOffset: new THREE.Vector3(0, 0.1, 0),
        elementPositionX: "top",
        elementPositionY: "right",

        rotation: new THREE.Euler(0.2, -Math.PI, 1),
        scale: 0.5,
    },

    {
        type: "O",

        element: IS_DEBUG ? "h3" : ".GLYPH-O-4",
        elementOffset: new THREE.Vector3(0, 0.1, 0),
        elementPositionX: "top",
        elementPositionY: "left",

        rotation: new THREE.Euler(0.2, -Math.PI, 1),
        scale: 0.5,
    },

    {
        type: "O",

        element: IS_DEBUG ? "h3" : ".GLYPH-O-5",
        elementOffset: new THREE.Vector3(0.5, 0.5, 0),
        elementPositionX: "top",
        elementPositionY: "right",

        rotation: new THREE.Euler(0.2, -Math.PI, 1),
        scale: 0.5,
    },

    {
        type: "A",

        element: IS_DEBUG ? "h3" : ".GLYPH-A-4",
        elementOffset: new THREE.Vector3(-0.5, -0.5, 0),
        elementPositionX: "bottom",
        elementPositionY: "left",

        rotation: new THREE.Euler(0.2, -Math.PI, 1),
        scale: 0.5,
    },
].map((g) => ({
    ...g,
    position: new THREE.Vector3(),
    __mesh: null,
    __interactionGroup: null,
    __rand: Math.random(),
    __objIn: { value: 0 },
}));

const ENV_MAP_PATH =
    "https://uploads-ssl.webflow.com/603379589922195849a7718c/644ed7aeae089038fc622679_envmap.jpg";
const VAN_LOON_BLUE_COLOR = new THREE.Color("rgb(0,50,255)");
const VAN_LOON_BLUE_EMISSIVE = new THREE.Color("rgb(0,0,100)");
const VAN_LOON_FRESNEL = new THREE.Color("rgb(10,0,200)");
// const VAN_LOON_FRESNEL = new THREE.Color("rgb(255,255,255)");

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};

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

const mouseMoveVelocity = new THREE.Vector3();
const _mouseMoveVelocity = new THREE.Vector3();

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
        return console.warn(`No element ${glyph.element}`);
    }

    let posOffsetX = 0,
        posOffsetY = 0;
    const boundingBox = el.getBoundingClientRect();

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

    const half = pixelsToUnits(boundingBox.width / 2);

    glyph.position.x +=
        pixelsToUnits(el.offsetLeft) +
        glyph.elementOffset.x +
        posOffsetX -
        half;
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
            delay: i,
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
    setTimeout(() => {
        animateIn();
    }, 1000);
});

const envMapTexture = glyphResults.find((r) => r instanceof THREE.Texture);
glyphs.forEach((glyph, i) => {
    const glyphScene = glyphResults
        .find((r) => r.name === glyph.type)
        .scene.clone();

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
                
                float fresnelIntensity = .5;
                float fresnelTerm = (1.0 - -min(dot(vPositionW, normalize(vNormalW) ), 0.0));    
                vec3 fresnelColor = uFresnelColor;
                
                gl_FragColor = mix(gl_FragColor, gl_FragColor + vec4(fresnelColor, 1.) * vec4(fresnelTerm), fresnelIntensity);

                // float alpha = 1.;
                // float cut = 0.0001;
                // alpha *= aastep(cut, vUv.x);
                // alpha *= 1. - aastep(1. - cut, vUv.x);
                // alpha *= aastep(cut, vUv.x);
                // alpha *= 1. - aastep(1. - cut, vUv.y);

                // gl_FragColor.a = alpha;
        `
        );
    };

    glyphObj.material = new THREE.MeshStandardMaterial({
        ...glyphObj.material,
        envMap: envMapTexture,
        envMapIntensity: 1,
        roughness: 1,
        metalness: 1,
        color: VAN_LOON_BLUE_COLOR,
        emissive: VAN_LOON_BLUE_EMISSIVE,
    });

    setGlyphPositionBasedOnDOM(glyph);

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

    // Pos will be handled in loop,
    // if we handle it here we'll get a weird offset from origin
    glyphScene.scale.setScalar(glyph.scale);
    glyphScene.rotation.copy(glyph.rotation);

    glyph.__animationGroup.scale.setScalar(0);

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

    // const nextCameraY = THREE.MathUtils.mapLinear(window.innerHeight);
    const nextY = pixelsToUnits(_scrollPosY) * -1;
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, nextY, 0.5);

    //camera.position.y -= pixelsToUnits(_scrollVelY);

    glyphs.forEach((glyph, i) => {
        // Rotation on mouse move
        const influence = 0.001;
        glyph.__interactionGroup.rotation.x = THREE.MathUtils.lerp(
            glyph.__interactionGroup.rotation.x,
            glyph.__initialGroup.rotation.x -
                _mouseMoveVelocity.y * (glyph.__rand * 0.4),
            influence + glyph.__rand * i * influence
        );
        glyph.__interactionGroup.rotation.y = THREE.MathUtils.lerp(
            glyph.__interactionGroup.rotation.y,
            glyph.__initialGroup.rotation.y -
                _mouseMoveVelocity.x * glyph.__rand,
            influence + glyph.__rand * i * influence
        );

        let idleT = Math.sin(t * 0.5 + i * 10);
        // Normalize -1 - 1 to 0 - 1
        idleT = (idleT + 1) * 0.5;
        idleT = idleT;
        glyph.__interactionGroup.position.y =
            glyph.__initialGroup.position.y + idleT;
    });
}

render();

window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
    glyphs.forEach((glyph) => {
        setGlyphPositionBasedOnDOM(glyph);
        copyGlyphContainerTransforms(glyph);
    });

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}
