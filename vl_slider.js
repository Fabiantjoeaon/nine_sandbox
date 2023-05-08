import {
    ScrollGesture,
    DragGesture,
} from "https://cdn.skypack.dev/@use-gesture/vanilla";

const clamp = (val, min, max) => {
    return val > max ? max : val < min ? min : val;
};

function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
}

function map(
    value,
    oldMin = -1,
    oldMax = 1,
    newMin = 0,
    newMax = 1,
    isClamp = false
) {
    const newValue =
        ((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;
    if (isClamp)
        return clamp(
            newValue,
            Math.min(newMin, newMax),
            Math.max(newMin, newMax)
        );
    return newValue;
}

const IS_DEBUG = window.location.port.length > 0;
const TARGET_ELEMENT = ".inner";

const data = [
    { src: "https://picsum.photos/400", name: "Lisa De Jong", function: "HR" },
    { src: "https://picsum.photos/400", name: "Lisa De Jong", function: "HR" },
    { src: "https://picsum.photos/400", name: "Lisa De Jong", function: "HR" },
    { src: "https://picsum.photos/400", name: "Lisa De Jong", function: "HR" },
    { src: "https://picsum.photos/400", name: "Lisa De Jong", function: "HR" },
    { src: "https://picsum.photos/400", name: "Lisa De Jong", function: "HR" },
];

const slider = document.createElement("div");
slider.classList.add("slider");

new ScrollGesture(window, (state) => {
    const [_, velY] = state.delta;
});

let _dragVelX = 0;

let currentX = 0;
let _currentX = currentX;

let itemWidth = 350;

function checkOutOfBounds(dir, dist) {
    if (dir === 1) {
        if (dist > itemWidth) {
            console.log("ITEM +");
        }
    }

    if (dir === -1) {
        if (dist > itemWidth) {
            console.log("ITEM -");
        }
    }
}

new DragGesture(slider, (state) => {
    const [velX] = state.velocity;
    const [dirX] = state.direction;
    const [distX] = state.distance;
    _dragVelX = velX * 4 * dirX;

    console.log(state);

    if (!state.down) _dragVelX = 0;

    checkOutOfBounds(dirX, distX);
});

data.forEach((item, i) => {
    const itemWrapper = document.createElement("div");
    itemWrapper.classList.add("item-wrapper");

    const image = document.createElement("img");
    image.setAttribute("draggable", false);
    image.setAttribute("alt", item.name);
    image.src = item.src;

    itemWrapper.appendChild(image);
    slider.appendChild(itemWrapper);

    //itemWidth = itemWrapper.clientWidth;

    const radius = 1000;
    const step = (2 * Math.PI) / (data.length * 100);
    const angle = step * i;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;
    const rotY = Math.atan2(x, z);

    // itemWrapper.style.transform = `translate3D(${x}px, 0px, ${z}px) rotateY(${rotY}rad)`;
    itemWrapper.style.transform = `translate3D(0px, 0px, 0px) rotateY(${rotY}rad)`;
    console.log(itemWrapper.style.transform);
    //mesh.rotation.y = Math.atan2(mesh.position.x, mesh.position.z);
});

function render() {
    requestAnimationFrame(render);

    currentX += _dragVelX;

    _currentX = lerp(_currentX, currentX, 0.06);

    const mod = currentX % itemWidth;
    // if (mod > 0 && mod < itemWidth / 2) {

    // }

    slider.style.transform = `translate3D(calc(${_currentX}px - 25%), 0px, 0px)`;
}

render();

document.querySelector(TARGET_ELEMENT).appendChild(slider);
