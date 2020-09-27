import { Curtains, Plane } from "curtainsjs";
import fragment from "../shaders_circle/fragment.glsl";
import vertex from "../shaders_circle/vertex.glsl";
import gsap from "gsap";

let activeTexture = 0;
let currentTexture = 0;
let transitionTimer = 0;
let timer = 0;

window.addEventListener("load", () => {
  // set up our WebGL context and append the canvas to our wrapper
  const curtains = new Curtains({
    container: "canvas",
    pixelRatio: Math.min(1.5, window.devicePixelRatio), // limit pixel ratio for performance
  });

  // get our plane element
  const planeElements = [...document.getElementsByClassName("plane")];
  const navElements = [...document.getElementsByClassName("js-nav")];
  const duration = planeElements[0].getAttribute("data-duration") || 2;
  // set our initial parameters (basic uniforms)
  const params = {
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
      transitionTimer: {
        name: "uTransitionTimer",
        type: "1f",
        value: 0,
      },
      timer: {
        name: "uTimer",
        type: "1f",
        value: 0,
      },
    },
  };

  const multiTexturesPlane = new Plane(curtains, planeElements[0], params);

  // set up our basic methods
  multiTexturesPlane
    .onReady(() => {
      // display the button

      document.body.classList.add("curtains-ready");
      let length = multiTexturesPlane.videos.length;

      // planeElements[0].addEventListener("click", () => {
      //   gsap.to(multiTexturesPlane.uniforms.transitionTimer, {
      //     duration: duration,
      //     value: currentTexture + 1,
      //     easing: 'power2.in',
      //     onStart: () => {
      //       multiTexturesPlane.videos[(currentTexture + 1) % length].play();
      //       currentTexture = currentTexture + 1;
      //     },
      //     onComplete: () => {
      //       multiTexturesPlane.videos[
      //         (currentTexture + length - 1) % length
      //       ].pause();
      //       multiTexturesPlane.videos[
      //         (currentTexture + length + 1) % length
      //       ].pause();
      //     },
      //   });
      // });
      navElements.forEach(nav=>{
        nav.addEventListener('click',(event)=>{
          console.log(event.target.getAttribute('data-nav'));
        })
      })

      // click to play the videos
      document.getElementById("intro").addEventListener(
        "click",
        () => {
          // fade out animation
          gsap.to('#intro',{duration:0.1,autoAlpha:0.})
            document.body.classList.add("video-started");

          // play all videos to force uploading the first frame of each texture
          multiTexturesPlane.playVideos();

          // wait a tick and pause the rest of videos (the ones that are hidden)
          curtains.nextRender(() => {
            multiTexturesPlane.videos[1].pause();
            multiTexturesPlane.videos[2].pause();
          });
        },
        false
      );
    })
    .onRender(() => {
      timer += 0.001;

      // multiTexturesPlane.uniforms.transitionTimer.value = transitionTimer;
      multiTexturesPlane.uniforms.timer.value = timer;
    });
});
