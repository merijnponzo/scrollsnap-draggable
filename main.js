import SnapSlider from "@tannerhodges/snap-slider";
import { getScrollSnapPositions } from "scroll-snap-api";
import animateScrollTo from "animated-scroll-to";

import "./style.css";

// add vanilla on document load
document.addEventListener("DOMContentLoaded", function () {
  const slider = document.getElementById("draggable");
  const snapPositions = getScrollSnapPositions(slider);

  const scrollSpeed = 2.5;
  const easeTime = 1000;
  let isDown = false;
  let isAnimating = false;
  let startX;
  let startY;
  let scrollLeft;
  let scrollLeftUpdated;

  slider.addEventListener("mousedown", (e) => {
    slider.classList.add("snap-none");
    isDown = true;
    startX = e.pageX - slider.offsetLeft;
    startY = e.pageY - slider.offsetTop;
    scrollLeft = slider.scrollLeft;
  });
  slider.addEventListener("mouseleave", () => {
    isDown = false;
  });
  slider.addEventListener("mouseup", () => {
    isDown = false;
    // find closest number scrollLeftUpdated within snapPositions.x
    const closest = snapPositions.x.reduce((prev, curr) => {
      return Math.abs(curr - scrollLeftUpdated) <
        Math.abs(prev - scrollLeftUpdated)
        ? curr
        : prev;
    });
    // use animateScrollTo to scroll to closest number with a promise
    animateScrollTo([closest, 0], {
      elementToScroll: slider,
      speed: easeTime,
    }).then((hasScrolledToPosition) => {
      if (hasScrolledToPosition) {
        slider.classList.remove("snap-none");
      }
    });
  });
  slider.addEventListener("mousemove", (e) => {
    if (!isDown) {
      e.preventDefault();
    } else {
      const x = e.pageX - slider.offsetLeft;
      const y = e.pageY - slider.offsetTop;
      const walk_x = (x - startX) * scrollSpeed; // the higher the faster
      scrollLeftUpdated = scrollLeft - walk_x;
      slider.scrollLeft = scrollLeftUpdated;
    }
  });
});
