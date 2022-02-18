import {loadGLTF, loadVideo} from "../../libs/loader.js";
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {

  let video = null;

  const init = async() => {
    video = await loadVideo("../../assets/videos/sintel/sintel.mp4");
    video.play();
    video.pause();
  }

  const start = async() => {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: '../../assets/targets/sintel.mind',
    });
    const {renderer, scene, camera} = mindarThree;


    const texture = new THREE.VideoTexture(video);

    const geometry = new THREE.PlaneGeometry(1, 204/480);
    const material = new THREE.MeshBasicMaterial({map: texture});
    const plane = new THREE.Mesh(geometry, material);

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(plane);

    anchor.onTargetFound = () => {
      video.play();
    }
    anchor.onTargetLost = () => {
      video.pause();
    }
    video.addEventListener( 'play', () => {
      video.currentTime = 6;
    });

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  //start();

  const button = document.createElement("button");
  button.textContent = "Start";
  button.addEventListener("click", start);

  document.body.appendChild(button);
});
