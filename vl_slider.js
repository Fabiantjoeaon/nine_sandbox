import {
  ScrollGesture,
  DragGesture,
} from "https://cdn.skypack.dev/@use-gesture/vanilla";

let isMobile = "ontouchstart" in document.documentElement;

const debugData = [
  {
    src: "https://picsum.photos/2400?random=1",
    name: "Lisa De Jong",
    function: "HR",
    url: "#1",
  },
  {
    src: "https://picsum.photos/2400?random=2",
    name: "Lisa De Jong",
    function: "HR",
    url: "#2",
  },
  {
    src: "https://picsum.photos/2400?random=3",
    name: "Lisa De Jong",
    function: "HR",
    url: "#3",
  },
  {
    src: "https://picsum.photos/2400?random=4",
    name: "Lisa De Jong",
    function: "HR",
    url: "#4",
  },
  {
    src: "https://picsum.photos/2400?random=5",
    name: "Lisa De Jong",
    function: "HR",
    url: "#1",
  },
  {
    src: "https://picsum.photos/2400?random=6",
    name: "Lisa De Jong",
    function: "HR",
    url: "#1",
  },
  {
    src: "https://picsum.photos/2400?random=6",
    name: "Lisa De Jong",
    function: "HR",
    url: "#1",
  },
  {
    src: "https://picsum.photos/2400?random=6",
    name: "Lisa De Jong",
    function: "HR",
    url: "#1",
  },
];

window.addEventListener(
  "load",
  function (event) {
    main();
  },
  false
);

async function main() {
  const clamp = (val, min, max) => {
    return val > max ? max : val < min ? min : val;
  };

  NodeList.prototype.forEach = Array.prototype.forEach;
  HTMLCollection.prototype.forEach = Array.prototype.forEach;
  Element.prototype.prependChild = function (newElement) {
    return this.insertBefore(newElement, this.firstChild);
  };

  function waitForImage(imgElem) {
    return new Promise((res) => {
      if (imgElem.complete) {
        return res();
      }
      imgElem.onload = () => res();
      imgElem.onerror = () => res();
    });
  }

  async function scrapeDataFromWebFlowPage() {
    const DATA_CLASS = ".slider_data";
    const items = document.querySelectorAll(`${DATA_CLASS}_wrapper`);

    const promises = [...items].map(async (item) => {
      const name = item.querySelector(`${DATA_CLASS}_name`);
      const image = item.querySelector(`${DATA_CLASS}_image`);
      const urlEl = item.querySelector(`${DATA_CLASS}_link`);

      await waitForImage(image);

      const url = urlEl.getAttribute("href").replace("locaties/", "");

      return new Promise((res, rej) => {
        res({
          src: image.getAttribute("src"),
          name: name.innerText,
          url,
          // function: itemFn.innerText,
        });
      });
    });

    const data = await Promise.all(promises);

    for (let i = items.length; i--; ) {
      items[i].remove();
    }

    return data;
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

  function preventClick(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
  }

  const IS_DEBUG = window.location.port.length > 0;
  const TARGET_ELEMENT = IS_DEBUG ? ".inner" : ".vl-3d-slider";

  const data = IS_DEBUG ? debugData : await scrapeDataFromWebFlowPage();

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

  const slider = document.createElement("div");
  slider.style.height = `${itemWidth}px`;
  slider.classList.add("slider");

  const inner = document.createElement("div");
  inner.classList.add("slider-inner");
  slider.appendChild(inner);

  new DragGesture(slider, (state) => {
    const [velX] = state.velocity;
    const [dirX] = state.direction;

    // let d = state.down;

    let d = state.down || state.dragging;

    // TODO: https://stackoverflow.com/questions/58353280/prevent-click-when-leave-drag-to-scroll-in-js
    if (d) {
      // [...document.querySelectorAll(".item-wrapper")].forEach((el) => {
      //   el.classList.add("disable");
      // });
    }
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

    const scrollVelSpeed = 0.015;
    if (!state.active) _scrollVelY = 0;
    else _scrollVelY = velY * scrollVelSpeed * (dirY * -1);
  });

  const itemWrappers = [];

  data.forEach((item, i) => {
    const itemWrapper = document.createElement("a");
    itemWrapper.setAttribute("href", item.url);
    itemWrapper.setAttribute("draggable", false);
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

    // const fn = document.createElement("span");
    // fn.classList.add("person-function");
    // metaWrapper.appendChild(fn);
    // fn.innerText = item.function;

    const personData = document.createElement("span");
    personData.classList.add("person-data");
    //metaWrapper.appendChild(personData);

    imageWrapper.appendChild(metaWrapper);

    // itemWrapper.addEventListener("mouseover", (e) => {
    //   console.log("hover", e.target);
    // });
  });

  // Prevents click when dragging
  let isDown = false;
  let isDragging = false;

  function handleDown(e) {
    isDown = true;
  }
  function handleUp(e) {
    isDown = false;
    const elements = document.getElementsByClassName("item-wrapper");
    if (isDragging) {
      for (let i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", preventClick);
      }
    } else {
      for (let i = 0; i < elements.length; i++) {
        elements[i].removeEventListener("click", preventClick);
      }
    }
    isDragging = false;
  }

  slider.addEventListener("mousedown", handleDown);
  slider.addEventListener("touchstart", handleDown);

  slider.addEventListener("mouseup", handleUp);
  slider.addEventListener("touchend", handleUp);
  slider.addEventListener("mouseleave", handleUp);

  slider.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    isDragging = true;
    e.preventDefault();
  });

  const step = (2 * Math.PI) / inner.children.length;

  //let rotY = 0;

  function render() {
    requestAnimationFrame(render);

    currentX += _dragVelX;
    _currentX = lerp(_currentX, currentX, isMobile ? 0.2 : 0.05);
    __dragVelX = lerp(__dragVelX, _dragVelX, 0.01);
    __scrollVelY = lerp(__scrollVelY, _scrollVelY, 0.8);

    currentX += __scrollVelY;

    let rotY = _currentX * -1;

    // Always in range of 360 deg
    //rotY = rotY % (step * itemWidth);

    inner.style.transform = `translateX(${
      itemWidth / -2 - radius * 0.05
    }px) translateY(100px) rotateZ(${Math.PI * 0.02}rad)`;

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

      let nextViz = 1;
      if (rotYItem > -offset && rotYItem < offset) {
        nextViz = 0;
      } else {
        nextViz = 1;
      }

      if (nextViz !== item.style.opacity) {
        item.style.opacity = nextViz;
        if (nextViz === 0) {
          item.style.visibility = "hidden";
          // item.style.pointerEvents = "none";
          // item.style.touchAction = "none";
          // item.style.zIndex = -99;
        }
        if (nextViz === 1) {
          console.log("NEXT VIZ");
          item.style.visibility = "visible";
          // item.style.pointerEvents = "all";
          // item.style.touchAction = "auto";
          // item.style.zIndex = 0;
        }
      }

      const input = 400;
      const output = 50;
      const moveInnerX = map(
        __dragVelX * 20000 + _scrollVelY * 30000,
        -input,
        input,
        -output,
        output,
        true
      );

      image.style.transform = `scale(1.2) translateX(${moveInnerX}px)`;
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

    itemWidth = map(w, minW, maxW, 400, 1000);
    // 8 items
    // radiusMult = map(w, minW, maxW, 1.1, 1.4);
    // 9 items
    radiusMult = map(w, minW, maxW, 1.2, 1.32);
    radius = itemWidth * radiusMult;
    offset = 80;
    dragSpeed = map(w, maxW, minW, 0.05, 0.12);
    if (isMobile) dragSpeed *= 1;

    itemWrappers.forEach((item) => {
      item.style.width = `${itemWidth}px`;
      item.style.height = `${itemWidth * 0.75}px`;
    });
    // This also changes perspective
    slider.style.height = `${itemWidth * 1.2}px`;
  }

  onResize();
  window.addEventListener("resize", onResize);

  render();

  document.querySelector(TARGET_ELEMENT).appendChild(slider);
}
