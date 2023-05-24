import {
  ScrollGesture,
  DragGesture,
} from "https://cdn.skypack.dev/@use-gesture/vanilla";

window.addEventListener(
  "load",
  function (event) {
    main();
  },
  false
);

// TODO:
// https://discourse.webflow.com/t/how-do-you-store-use-secret-api-key-data/178977/12

async function main() {
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
      return clamp(
        newValue,
        Math.min(newMin, newMax),
        Math.max(newMin, newMax)
      );
    return newValue;
  }

  const IS_DEBUG = window.location.port.length > 0;
  const TARGET_ELEMENT = IS_DEBUG ? ".inner" : ".vl-3d-slider";

  const data = [
    {
      src: "https://picsum.photos/2400?random=1",
      name: "Lisa De Jong",
      function: "HR",
    },
    {
      src: "https://picsum.photos/2400?random=2",
      name: "Lisa De Jong",
      function: "HR",
    },
    {
      src: "https://picsum.photos/2400?random=3",
      name: "Lisa De Jong",
      function: "HR",
    },
    {
      src: "https://picsum.photos/2400?random=4",
      name: "Lisa De Jong",
      function: "HR",
    },
    {
      src: "https://picsum.photos/2400?random=5",
      name: "Lisa De Jong",
      function: "HR",
    },
    {
      src: "https://picsum.photos/2400?random=6",
      name: "Lisa De Jong",
      function: "HR",
    },
    {
      src: "https://picsum.photos/2400?random=6",
      name: "Lisa De Jong",
      function: "HR",
    },
    {
      src: "https://picsum.photos/2400?random=6",
      name: "Lisa De Jong",
      function: "HR",
    },
    {
      src: "https://picsum.photos/2400?random=6",
      name: "Lisa De Jong",
      function: "HR",
    },
  ];

  let _scale = 1;
  let __scale = 1;
  let down = false;

  let _dragVelX = 0;
  let __dragVelX = 0;

  let _scrollVelY = 0;
  let __scrollVelY = 0;

  let currentX = 0;
  let _currentX = currentX;

  let itemWidth, radiusMult, offset, dragSpeed, radius;
  // let totalWidth = itemWidth * data.length;

  const slider = document.createElement("div");
  slider.style.height = `${itemWidth}px`;
  slider.classList.add("slider");

  const inner = document.createElement("div");
  inner.classList.add("slider-inner");
  slider.appendChild(inner);

  // function handleBounds() {
  //   const diff = _currentX - currentX;

  //   if (currentX > totalWidth || currentX * -1 > totalWidth) {
  //     currentX = diff;
  //     _currentX = diff;
  //   }
  // }

  new DragGesture(slider, (state) => {
    const [velX] = state.velocity;
    const [dirX] = state.direction;

    // let d = state.down;
    let d = state.down || state.dragging;

    if (down !== d) {
      down = d;
    }

    _dragVelX = velX * dragSpeed * dirX;
    if (!d) _dragVelX = 0;

    // TODO: Maybe in loop
  });

  new ScrollGesture(window, (state) => {
    const [_, velY] = state.velocity;
    const [__, dirY] = state.direction;
    _scrollVelY = velY;
    //   if (!state.down) _scrollVelY = 0;

    //   _scrollVelY = velY;
  });

  const itemWrappers = [];

  data.forEach((item, i) => {
    const itemWrapper = document.createElement("div");
    itemWrapper.classList.add("item-wrapper");
    itemWrappers.push(itemWrapper);

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

    itemWrapper.appendChild(metaWrapper);
  });

  const step = (2 * Math.PI) / inner.children.length;

  function render() {
    requestAnimationFrame(render);

    currentX += _dragVelX;
    _currentX = lerp(_currentX, currentX, 0.05);
    __dragVelX = lerp(__dragVelX, _dragVelX, 0.01);
    __scrollVelY = lerp(__scrollVelY, _scrollVelY, 0.01);

    _scale = down ? 0.95 : 1;
    __scale = lerp(__scale, _scale, 0.1);

    let rotY = _currentX * -1;

    // Always in range of 360 deg
    rotY = rotY % (step * itemWidth);

    inner.style.transform = `translateX(${
      itemWidth / -2 - radius * 0.05
    }px) rotateZ(${Math.PI * -0.07}rad)`;

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

      const input = 400;
      const output = 100;
      const moveInnerX = map(
        __dragVelX * 10000,
        -input,
        input,
        -output,
        output,
        true
      );
      image.style.transform = `scale(1.4) translateX(${moveInnerX}px)`;
    });
  }

  function onResize() {
    // TODO:
    //   itemWidth = 1000;
    //   radiusMult = 1.3;
    //   offset = 80;
    // inner,children.forEach(() => {
    // clean up css and use just --var
    // })
    const w = window.innerWidth;
    const h = window.innerHeight;
    const minW = 400;
    const maxW = 2600;

    itemWidth = map(w, minW, maxW, 300, 1000);
    // 8 items
    // radiusMult = map(w, minW, maxW, 1.1, 1.4);
    // 9 items
    radiusMult = map(w, minW, maxW, 1.4, 1.5);
    radius = itemWidth * radiusMult;
    offset = 80;
    dragSpeed = map(w, maxW, minW, 0.05, 0.12);

    itemWrappers.forEach((item) => {
      item.style.width = `${itemWidth}px`;
      item.style.height = `${itemWidth * 0.75}px`;
    });
    // This also changes perspective
    slider.style.height = `${itemWidth * 1.1}px`;
  }

  onResize();
  window.addEventListener("resize", onResize);

  render();

  document.querySelector(TARGET_ELEMENT).appendChild(slider);
}
