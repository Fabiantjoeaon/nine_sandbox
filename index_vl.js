import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

import { Gesture } from "https://cdn.skypack.dev/@use-gesture/vanilla";

const IS_DEBUG = window.location.port.length > 0;
const GLYPH_FROM_ROTATION = Math.PI * -2;
const glyphs = {
    a: {
        initialTransform: {
            position: new THREE.Vector3(-1, 3, 0),

            rotation: new THREE.Euler(-0.1, Math.PI - GLYPH_FROM_ROTATION, 0.4),
            scale: 0.7,
        },
        src: "https://uploads-ssl.webflow.com/603379589922195849a7718c/644eda97b6958181ae521001_a_glyph_van_loon_WF.gltf.txt",

        __mesh: null,
        __interactionGroup: null,
        __rand: Math.random(),
        __objIn: { value: 0 },
    },
    o: {
        initialTransform: {
            position: new THREE.Vector3(3, -1, 0),

            rotation: new THREE.Euler(),
            scale: 0.6,
        },
        src: "https://uploads-ssl.webflow.com/603379589922195849a7718c/644eda97ac066513ce630f14_o_glyph_van_loon_WF.gltf.txt",

        __mesh: null,
        __interactionGroup: null,
        __rand: Math.random(),
        __objIn: { value: 0 },
    },
    n: {
        initialTransform: {
            position: new THREE.Vector3(-3, -4, 0),

            rotation: new THREE.Euler(),
            scale: 0.7,
        },
        src: "https://uploads-ssl.webflow.com/603379589922195849a7718c/644eda970014987c0babbbba_n_glyph_van_loon_WF.gltf.txt",

        __mesh: null,
        __interactionGroup: null,
        __rand: Math.random(),
        __objIn: { value: 0 },
    },
    // l: {
    //     initialTransform: {
    //         position: new THREE.Vector3(-3, -4, 0),
    //         rotation: new THREE.Euler(-0.1, Math.PI - GLYPH_FROM_ROATION, 0.4),
    //         scale: 0.7,
    //     },
    //     src: "https://uploads-ssl.webflow.com/603379589922195849a7718c/644eda97442c994d73c035fe_l_glyph_van_loon_WF.gltf.txt",
    //     mesh: null,
    //     splineLayerName: "N",
    //     __objIn: { value: 0 },
    // },
    // v: {
    //     initialTransform: {
    //         position: new THREE.Vector3(-3, -4, 0),
    //         rotation: new THREE.Euler(-0.1, Math.PI - GLYPH_FROM_ROATION, 0.4),
    //         scale: 0.7,
    //     },
    //     src: "https://uploads-ssl.webflow.com/603379589922195849a7718c/644eda97228bee398ef568d3_v_glyph_van_loon_WF.gltf.txt",
    //     mesh: null,
    //     splineLayerName: "N",
    //     __objIn: { value: 0 },
    // },
};

const ENV_MAP_PATH =
    "https://uploads-ssl.webflow.com/603379589922195849a7718c/644ed7aeae089038fc622679_envmap.jpg";
const VAN_LOON_BLUE = new THREE.Color("rgb(0,120,255)");

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

function traverseGlyphs(callback, fn = "forEach") {
    return Object.values(glyphs)[fn](callback);
}

function pixelsToUnits(px) {
    const dist = camera.position.z;
    const fov = camera.fov;
    const height = 2 * dist * Math.tan(fov * 0.5 * (Math.PI / 180));
    const units = (px / window.innerHeight) * height;

    return units;
}

const scrollVelocity = new THREE.Vector3();
const _scrollVelocity = new THREE.Vector3();
let _scrollRot = 0;
let _scrollPosY = 0;
let _scrollVelY = 0;
const mouseMoveVelocity = new THREE.Vector3();
const _mouseMoveVelocity = new THREE.Vector3();

const gesture = new Gesture(window, {
    onScroll: (state) => {
        const [x, y] = state.delta;
        const [_, velY] = state.delta;
        const [__, offsetY] = state.offset;
        const range = 100;
        _scrollVelocity.set(
            THREE.MathUtils.mapLinear(x, -range, range, -1, 1),
            THREE.MathUtils.mapLinear(y, -range, range, -1, 1),
            0
        );
        _scrollVelY = velY;
        _scrollPosY = offsetY;
    },
    onMove: (state) => {
        const [dirX, dirY] = state.direction;

        const [x, y] = state.delta;
        const [velX, velY] = state.velocity;
        const range = 100;
        _mouseMoveVelocity.set(
            // THREE.MathUtils.mapLinear(x, -range, range, -1, 1),
            // THREE.MathUtils.mapLinear(y, -range, range, -1, 1),
            velX * dirX * -1,
            velY * dirY * -1,
            0
        );
        console.log(_mouseMoveVelocity);
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

// TODO: rewrite to re-use glyph meshes then transform position
const el = document.querySelector("h1");
glyphs.a.initialTransform.position.set(
    pixelsToUnits(window.innerWidth / -2),
    pixelsToUnits(window.innerHeight / 2)
);
glyphs.a.initialTransform.position.x += pixelsToUnits(el.offsetLeft);
glyphs.a.initialTransform.position.y -= pixelsToUnits(el.offsetTop);

const gltfLoader = new GLTFLoader();

const glyphPromises = traverseGlyphs((glyph) => {
    return new Promise((resolve, reject) => {
        gltfLoader.load(
            glyph.src,
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
}, "map");

function animateIn() {
    traverseGlyphs((glyph) => {
        //
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
glyphResults.forEach((result, i) => {
    if (result instanceof THREE.Texture) return;

    const { scene: glyphScene } = result;
    const glyphData = Object.values(glyphs)[i];

    const glyphObj = glyphScene.children[0].children[0].children[0];
    glyphObj.geometry.center();
    // glyphObj.material.onBeforeCompile = function (shader) {
    //     // TODO:
    // };

    glyphObj.material = new THREE.MeshStandardMaterial({
        // envMap: envMapTexture,
        ...glyphObj.material,
        roughness: 1,
        metalness: 0.6,
        color: VAN_LOON_BLUE,
        //emissive: new THREE.Color("#751aff"),
        envMap: envMapTexture,
        envMapIntensity: 10,
    });

    // Used only to apply initial position and later on as initial ref point
    const initialGroup = new THREE.Group();
    // Used for mouse move and scroll interactions
    const interactionGroup = new THREE.Group();
    // Used for in/out animation
    const animationGroup = new THREE.Group();

    glyphData.__mesh = glyphScene;

    glyphData.__initialGroup = initialGroup;
    glyphData.__interactionGroup = interactionGroup;
    glyphData.__animationGroup = animationGroup;

    // Pos will be handled in loop,
    // if we handle it here we'll get a weird offset from origin
    glyphScene.scale.setScalar(glyphData.initialTransform.scale);
    glyphScene.rotation.copy(glyphData.initialTransform.rotation);

    // All groups should copy affine transforms from initial position
    glyphData.__initialGroup.position.copy(glyphData.initialTransform.position);
    glyphData.__initialGroup.rotation.copy(glyphData.initialTransform.rotation);

    glyphData.__interactionGroup.position.copy(
        glyphData.initialTransform.position
    );
    glyphData.__interactionGroup.rotation.copy(
        glyphData.initialTransform.rotation
    );

    glyphData.__animationGroup.position.copy(
        glyphData.initialTransform.position
    );
    glyphData.__animationGroup.rotation.copy(
        glyphData.initialTransform.rotation
    );

    scene.add(glyphData.__interactionGroup);
    glyphData.__interactionGroup.add(glyphScene);
});

const clock = new THREE.Clock();

// const dirLight = new THREE.DirectionalLight(new THREE.Color("#db4dff"), 1);
// const dirLight = new THREE.DirectionalLight(new THREE.Color("#db4dff"), 1);
// dirLight.position.set(0, pixelsToUnits(window.innerHeight / -2), 0);
//scene.add(new THREE.AmbientLight(0xffffff, 0.1));
// scene.add(dirLight);

function render() {
    window.requestAnimationFrame(render);
    renderer.render(scene, camera);

    const t = clock.getElapsedTime();

    _mouseMoveVelocity.lerp(mouseMoveVelocity, 0.01);
    _scrollVelocity.lerp(scrollVelocity, 0.001);
    _scrollRot = THREE.MathUtils.lerp(_scrollRot, _scrollVelocity.y, 0.01);

    // const nextCameraY = THREE.MathUtils.mapLinear(window.innerHeight);
    const nextY = pixelsToUnits(_scrollPosY) * -1;
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, nextY, 0.5);

    //camera.position.y -= pixelsToUnits(_scrollVelY);

    traverseGlyphs((glyph, i) => {
        // Rotation on mouse move
        const influence = 0.005;
        glyph.__interactionGroup.rotation.x = THREE.MathUtils.lerp(
            glyph.__interactionGroup.rotation.x,
            glyph.__initialGroup.rotation.x -
                _mouseMoveVelocity.y * glyph.__rand,
            influence + glyph.__rand * i * influence
        );
        glyph.__interactionGroup.rotation.y = THREE.MathUtils.lerp(
            glyph.__interactionGroup.rotation.y,
            glyph.__initialGroup.rotation.y -
                _mouseMoveVelocity.x * glyph.__rand,
            influence + glyph.__rand * i * influence
        );

        // Rotation on scroll
        // glyph.__interactionGroup.rotation.z = THREE.MathUtils.lerp(
        //     glyph.__interactionGroup.rotation.z,
        //     _scrollRot + (_scrollVelocity.y * -2 + glyph.__rand),

        //     0.01 + glyph.__rand * i * 0.4
        // );

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
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}
