import {
  ScrollGesture,
  DragGesture,
} from "https://cdn.skypack.dev/@use-gesture/vanilla";

const dragSpeed = 4;

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

function radiansToDegrees(radians) {
  const pi = Math.PI * 1;
  return radians * (180 / pi);
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
    return clamp(newValue, Math.min(newMin, newMax), Math.max(newMin, newMax));
  return newValue;
}

const IS_DEBUG = window.location.port.length > 0;
const TARGET_ELEMENT = ".inner";

const data = [
  {
    src: "https://picsum.photos/1000?random=1",
    name: "Lisa De Jong",
    function: "HR",
  },
  {
    src: "https://picsum.photos/1000?random=2",
    name: "Lisa De Jong",
    function: "HR",
  },
  {
    src: "https://picsum.photos/1000?random=3",
    name: "Lisa De Jong",
    function: "HR",
  },
  {
    src: "https://picsum.photos/1000?random=4",
    name: "Lisa De Jong",
    function: "HR",
  },
  {
    src: "https://picsum.photos/1000?random=5",
    name: "Lisa De Jong",
    function: "HR",
  },
  {
    src: "https://picsum.photos/1000?random=6",
    name: "Lisa De Jong",
    function: "HR",
  },
  {
    src: "https://picsum.photos/1000?random=6",
    name: "Lisa De Jong",
    function: "HR",
  },
];

new ScrollGesture(window, (state) => {
  const [_, velY] = state.velocity;
  const [__, dirY] = state.direction;
  _scrollVelY = velY;
  //   if (!state.down) _scrollVelY = 0;

  //   _scrollVelY = velY;
});

let _scale = 1;
let __scale = 1;
let down = false;

let _dragVelX = 0;
let __dragVelX = 0;

let _scrollVelY = 0;
let __scrollVelY = 0;

let currentX = 0;
let _currentX = currentX;

let itemWidth = 1000;
const radiusMult = 1.3;
const radius = itemWidth * radiusMult;

const offset = 80;
//const gap = 30;
let totalWidth = itemWidth * data.length;

const slider = document.createElement("div");
slider.style.height = `${itemWidth}px`;
slider.classList.add("slider");
//slider.style.gap = `${gap}px`;

const inner = document.createElement("div");
inner.classList.add("slider-inner");
slider.appendChild(inner);

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
  itemWrapper.style.height = `${itemWidth * (9 / 16)}px`;

  const imageWrapper = document.createElement("div");
  imageWrapper.classList.add("image-wrapper");
  imageWrapper.style.overflow = "hidden";

  const image = document.createElement("div");
  image.classList.add("image");
  image.setAttribute("draggable", false);
  image.style.backgroundImage = `url('${item.src}')`;

  imageWrapper.appendChild(image);
  itemWrapper.appendChild(imageWrapper);
  inner.appendChild(itemWrapper);

  const metaWrapper = document.createElement("div");
  metaWrapper.classList.add("person-meta");

  const name = document.createElement("span");
  name.classList.add("person-name");
  metaWrapper.appendChild(name);
  name.innerText = item.name;

  const fn = document.createElement("span");
  fn.classList.add("person-function");
  metaWrapper.appendChild(fn);
  fn.innerText = item.function;

  const personData = document.createElement("span");
  personData.classList.add("person-data");
  metaWrapper.appendChild(personData);
  //   name.innerText = item.function

  itemWrapper.appendChild(metaWrapper);
});

inner.style.transform = `translateX(${itemWidth / -2 - radius * 0.05}px)`;

const step = (2 * Math.PI) / inner.children.length;

function render() {
  requestAnimationFrame(render);

  currentX += _dragVelX;
  _currentX = lerp(_currentX, currentX, 0.05);
  __dragVelX = lerp(__dragVelX, _dragVelX, 0.01);
  __scrollVelY = lerp(__scrollVelY, _scrollVelY, 0.01);

  _scale = down ? 0.95 : 1;
  __scale = lerp(__scale, _scale, 0.1);

  let rotY = _currentX * -0.01;

  // Always in range of 360 deg
  rotY = rotY % (step * itemWidth);

  inner.children.forEach((item, i) => {
    const image = item.children[0].children[0];

    const angle = step * i + rotY;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;
    const rotYItem = radiansToDegrees(Math.atan2(x, z)) % (step * itemWidth);

    item.style.transform = `
        translateX(${x}px) 
        translateZ(${z}px) 
        
        rotateY(${rotYItem}deg) 
        rotateZ(${__dragVelX * -1}deg) 
        scale(${__scale * -1}, ${__scale})
    `;

    if (rotYItem > -offset && rotYItem < offset) {
      item.style.visibility = "hidden";
    } else {
      item.style.visibility = "visible";
    }

    image.style.transform = `scale(1.5) translateX(${__dragVelX * 60}px)`;
  });
}

render();

document.querySelector(TARGET_ELEMENT).appendChild(slider);
