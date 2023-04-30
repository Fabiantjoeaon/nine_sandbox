window.addEventListener("load", () => {
    main();
});

function main() {
    const CONFIG = {
        canvasElement: "#root",
        scrollWrapper: ".inner",

        scrollAlpha: 0.01,

        noiseFrequency: 1,
        noiseTimeScale: 0.5,
        dithering: 0.1,

        noiseScrollInfluence: 2,

        color1: "#000000",
        color2: "#FF6B00",
        color3: "#FF0000",
    };

    function initializeGUI() {
        gui = new window.dat.GUI();
        gui.add(CONFIG, "dithering", 0, 0.5, 0.01);
        gui.add(CONFIG, "scrollAlpha", 0, 1, 0.01);
        gui.add(CONFIG, "noiseFrequency", 0, 2.5, 0.01);
        gui.add(CONFIG, "noiseTimeScale", 0, 10, 0.01);

        gui.add(CONFIG, "noiseScrollInfluence", 0, 50, 0.01);

        gui.addColor(CONFIG, "color1");
        gui.addColor(CONFIG, "color2");
        gui.addColor(CONFIG, "color3");
    }

    function lerp(v0, v1, t) {
        return v0 * (1 - t) + v1 * t;
    }

    function clamp(input, min, max) {
        return input < min ? min : input > max ? max : input;
    }

    function map(current, in_min, in_max, out_min, out_max) {
        const mapped =
            ((current - in_min) * (out_max - out_min)) / (in_max - in_min) +
            out_min;
        return clamp(mapped, out_min, out_max);
    }

    let gui = null;
    let _color1 = new THREE.Color(CONFIG.color1);
    let _color2 = new THREE.Color(CONFIG.color2);
    let _color3 = new THREE.Color(CONFIG.color3);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer();
    const clock = new THREE.Clock();

    const geometry = new THREE.PlaneBufferGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uResolution: {
                value: new THREE.Vector2(window.innerWidth, window.innerHeight),
            },
            uColor1: {
                value: CONFIG.color1,
            },
            uColor2: {
                value: CONFIG.color2,
            },
            uColor3: {
                value: CONFIG.color3,
            },

            uNoiseOffset: {
                value: new THREE.Vector2(),
            },
            uNoiseScroll: {
                value: 0,
            },
            uNoiseScrollInfluence: {
                value: CONFIG.noiseScrollInfluence,
            },

            uDither: {
                value: CONFIG.dither,
            },

            uNoiseFrequency: { value: CONFIG.noiseFrequency },
            // uNoiseAmplitude: { value: 0.5 },
            uNoiseTimeScale: { value: CONFIG.noiseTimeScale },
        },
        vertexShader: /*glsl*/ `
            varying vec2 vUv;

            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: /*glsl*/ `
            precision highp float;

            uniform float uTime;
            uniform vec2 uResolution;
            uniform vec3 uColor1;
            uniform vec3 uColor2;
            uniform vec3 uColor3;

            uniform float uNoiseTimeScale;
            uniform float uNoiseFrequency;
            uniform float uNoiseScroll;
            uniform vec2 uNoiseOffset;
            uniform float uDither;
            uniform float uNoiseScrollInfluence;

            varying vec2 vUv;

            float random(vec2 p) {
                return fract(sin(dot(p.xy,vec2(10.09898,0.233)))*12000.5453);
            }

            float pnoise2d(vec2 P) {
                // establish our grid cell and unit position
                vec2 Pi = floor(P);
                vec4 Pf_Pfmin1 = P.xyxy - vec4( Pi, Pi + 1.0 );

                // calculate the hash
                vec4 Pt = vec4( Pi.xy, Pi.xy + 1.0 );
                Pt = Pt - floor(Pt * ( 1.0 / 71.0 )) * 71.0;
                Pt += vec2( 26.0, 161.0 ).xyxy;
                Pt *= Pt;
                Pt = Pt.xzxz * Pt.yyww;
                vec4 hash_x = fract( Pt * ( 1.0 / 951.135664 ) );
                vec4 hash_y = fract( Pt * ( 1.0 / 642.949883 ) );

                // calculate the gradient results
                vec4 grad_x = hash_x - 0.49999;
                vec4 grad_y = hash_y - 0.49999;
                vec4 grad_results = inversesqrt( grad_x * grad_x + grad_y * grad_y ) * ( grad_x * Pf_Pfmin1.xzxz + grad_y * Pf_Pfmin1.yyww );

                // Classic Perlin Interpolation
                grad_results *= 1.4142135623730950488016887242097;  // scale things to a strict -1.0->1.0 range  *= 1.0/sqrt(0.5)
                vec2 blend = Pf_Pfmin1.xy * Pf_Pfmin1.xy * Pf_Pfmin1.xy * (Pf_Pfmin1.xy * (Pf_Pfmin1.xy * 6.0 - 15.0) + 10.0);
                vec4 blend2 = vec4( blend, vec2( 1.0 - blend ) );
                return dot( grad_results, blend2.zxzx * blend2.wwyy );
            }

            void main() {
                // float scale = -uNoiseTimeScale * (1. + (uNoiseScroll * 1000.));
                float scale = -uNoiseTimeScale - (1. + (uNoiseScroll * uNoiseScrollInfluence));
                // float scale = -uNoiseTimeScale;
                float offset = uTime * scale;
                vec2 st = vUv - uNoiseOffset;
                // st.x -= (uNoiseScroll * uNoiseScrollInfluence);


                vec2 cellRowCol = vec2(st.x / uNoiseFrequency, st.y / uNoiseFrequency);
                float gradientNoise =
                    .6 * cos(offset / (2.0) + st.y * 4.0 + cos(st.y * (2.0 * sin(offset / 20.0)) + offset / 5. + pnoise2d(cellRowCol) +
                    cos(st.x * 4.0 * (2.0 * sin(offset / 40.0)) + offset / 20.0) + (pnoise2d(cellRowCol) + pnoise2d(cellRowCol)
                ))) + (uNoiseScroll * uNoiseScrollInfluence);

                float dither = random(gl_FragCoord.xy * 4.0) * uDither;
                float finalN = clamp(gradientNoise + dither, 0.0, 1.0);
                float finalN2 = pnoise2d(vec2(finalN));
                // float gradientNoise2 = pnoise2d(cellRowCol + offset);
                // float finalN2 = clamp(gradientNoise2 + dither, 0.0, 1.0);
                vec3 color = mix(uColor1, uColor2, finalN);
                color += mix(color, uColor3, finalN2);

                gl_FragColor = vec4(color, 1.);
            }
        `,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const rootEl = document.querySelector(CONFIG.canvasElement);
    rootEl.appendChild(renderer.domElement);
    const scrollWrapper = document.querySelector(CONFIG.scrollWrapper);

    let totalHeight = scrollWrapper.clientHeight - window.innerHeight;
    function handleResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        mesh.material.uniforms["uResolution"].value.set(width, height);
        renderer.setSize(width, height);
        totalHeight = scrollWrapper.clientHeight - height;
    }

    let _scrollY = 0;
    let _infl = 0;

    function handleScroll(e) {
        if (!scrollWrapper) return;
        _scrollY = map(window.scrollY, 0, totalHeight, 0, 1);
    }

    window.addEventListener("resize", handleResize, false);
    document.addEventListener("scroll", handleScroll, false);

    function updateUniforms() {
        mesh.material.uniforms["uNoiseFrequency"].value = CONFIG.noiseFrequency;
        mesh.material.uniforms["uNoiseTimeScale"].value = CONFIG.noiseTimeScale;
        mesh.material.uniforms["uDither"].value = CONFIG.dithering;
        mesh.material.uniforms["uNoiseScrollInfluence"].value =
            CONFIG.noiseScrollInfluence;
        mesh.material.uniforms["uColor1"].value = _color1.setStyle(
            CONFIG.color1
        );
        mesh.material.uniforms["uColor2"].value = _color2.setStyle(
            CONFIG.color2
        );
        mesh.material.uniforms["uColor3"].value = _color3.setStyle(
            CONFIG.color3
        );
    }

    function render() {
        const currY = mesh.material.uniforms["uNoiseOffset"].value.y;
        const nextY = lerp(currY, _scrollY, CONFIG.scrollAlpha);

        const currInfl = mesh.material.uniforms["uNoiseScroll"].value;
        const yDelta = nextY - currY;
        const nextInfl = lerp(currInfl, yDelta, 0.1);

        if (gui) {
            updateUniforms();
        }

        mesh.material.uniforms["uTime"].value = clock.getElapsedTime();
        mesh.material.uniforms["uNoiseOffset"].value.set(0, nextY);
        mesh.material.uniforms["uNoiseScroll"].value = nextInfl;

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    if (window?.dat?.GUI) initializeGUI();
    updateUniforms();
    render();
    handleResize();
}
