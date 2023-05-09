import {
    ScrollGesture,
    DragGesture,
} from "https://cdn.skypack.dev/@use-gesture/vanilla";

const dragSpeed = 10;

const clamp = (val, min, max) => {
    return val > max ? max : val < min ? min : val;
};

NodeList.prototype.forEach = Array.prototype.forEach;
HTMLCollection.prototype.forEach = Array.prototype.forEach;
Element.prototype.prependChild = function (newElement) {
    return this.insertBefore(newElement, this.firstChild);
};

function duplicateChildNodes(parent, append = true) {
    var children = parent.childNodes;
    children.forEach(function (item) {
        var cln = item.cloneNode(true);
        parent.appendChild(cln);
    });
}

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
    {
        src: "https://picsum.photos/400?random=1",
        name: "Lisa De Jong",
        function: "HR",
    },
    {
        src: "https://picsum.photos/400?random=2",
        name: "Lisa De Jong",
        function: "HR",
    },
    {
        src: "https://picsum.photos/400?random=3",
        name: "Lisa De Jong",
        function: "HR",
    },
    {
        src: "https://picsum.photos/400?random=4",
        name: "Lisa De Jong",
        function: "HR",
    },
    {
        src: "https://picsum.photos/400?random=5",
        name: "Lisa De Jong",
        function: "HR",
    },
    {
        src: "https://picsum.photos/400?random=6",
        name: "Lisa De Jong",
        function: "HR",
    },
];

new ScrollGesture(window, (state) => {
    const [_, velY] = state.delta;
});

let _scale = 1;
let __scale = 1;
let down = false;

let _dragVelX = 0;
let __dragVelX = 0;

let currentX = 0;
let _currentX = currentX;

let itemWidth = 400;
const gap = 30;
let totalWidth = (itemWidth + gap) * data.length;

const slider = document.createElement("div");
slider.classList.add("slider");
slider.style.gap = `${gap}px`;

function handleBounds() {
    const diff = _currentX - currentX;

    if (currentX > totalWidth || currentX * -1 > totalWidth) {
        currentX = diff;
        _currentX = diff;
    }
}

new DragGesture(slider, (state) => {
    const [velX] = state.velocity;
    const [dirX] = state.direction;

    if (down !== state.down) {
        down = state.down;
    }

    _dragVelX = velX * dragSpeed * dirX;
    if (!state.down) _dragVelX = 0;

    // TODO: Maybe in loop
});

const images = [];

data.forEach((item, i) => {
    const itemWrapper = document.createElement("div");
    itemWrapper.classList.add("item-wrapper");
    itemWrapper.style.width = `${itemWidth}px`;

    const imageWrapper = document.createElement("div");
    imageWrapper.classList.add("image-wrapper");
    imageWrapper.style.overflow = "hidden";

    const image = document.createElement("img");
    image.setAttribute("draggable", false);
    image.setAttribute("alt", item.name);
    image.src = item.src;
    image.style.transform = "scale(1.1)";

    imageWrapper.appendChild(image);
    itemWrapper.appendChild(imageWrapper);
    slider.appendChild(itemWrapper);

    //images.push(image);

    //mesh.rotation.y = Math.atan2(mesh.position.x, mesh.position.z);
});

duplicateChildNodes(slider);
duplicateChildNodes(slider, false);

// slider.children.forEach((child, i) => {
//     // const step = (2 * Math.PI) / (slider.children.length * 3);
//     // const angle = step * i;
//     // const x = Math.sin(angle) * radius;
//     // const z = Math.cos(angle) * radius;
//     // const rotY = Math.atan2(x, z);

//     const radius = totalWidth;
//     const offset = totalWidth * 0.25;
//     const x = (itemWidth + gap) * i - offset;
//     const angle = Math.acos(Math.sign(x / radius));
//     //const z = Math.acos(angle) * radius;
//     const z = radius * Math.sin(Math.PI / 2 - angle);
//     const rotY = Math.atan2(x, z);

//     console.log(x);
//     // const left = itemWidth + gap * i;
//     //const rot

//     child.style.transform = `translateZ(${
//         z - radius * 2
//     }px) rotateY(${rotY}rad)`;
// });

function render() {
    requestAnimationFrame(render);

    handleBounds();

    currentX += _dragVelX;
    _currentX = lerp(_currentX, currentX, 0.05);
    __dragVelX = lerp(__dragVelX, _dragVelX, 0.01);

    _scale = down ? 0.95 : 1;
    __scale = lerp(__scale, _scale, 0.1);

    slider.style.transform = `translate3D(calc(${_currentX}px - 25%), 0px, 400px)`;
    // console.log(__dragVelX);
    slider.children.forEach((item, i) => {
        const index = i % data.length;
        const image = item.children[0].children[0];

        item.style.transform = `scale(${__scale})`;

        //const i = image.querySelector("img");
        image.style.transform = `scale(1.2) translateX(${
            // __dragVelX * -(3 + index * 0.2)
            __dragVelX * 3
        }px)`;
    });
}

render();

document.querySelector(TARGET_ELEMENT).appendChild(slider);
