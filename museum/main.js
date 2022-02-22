import {loadGLTF} from "../libs/loader.js";
const THREE = window.MINDAR.IMAGE.THREE;

let STATE_TRACKING_START = 1;
let STATE_TRACKING_FINISH = 2;

const scaleVal = 0.001;
var isTrackingFound = false;

document.addEventListener('DOMContentLoaded', () => {

  const start = async() => {

    const arCode = await Android.requestArCode();
    //const targetPath = './target/' + arCode + '.mind';
    const targetPath = './target/ps01001010_02.mind';
    const modelPath = './model/' + arCode + '.glb';

    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: targetPath,
      uiScanning: "no",
      uiLoading: "no",
    });

    const {renderer, scene, camera} = mindarThree;

    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    const model = await loadGLTF(modelPath);
    model.scene.scale.set(scaleVal, scaleVal, scaleVal);
    model.scene.position.set(0, -0.4, 0);

    const modelAnchor = mindarThree.addAnchor(0);
    modelAnchor.group.add(model.scene);

    modelAnchor.onTargetFound = () => {
      if(!isTrackingFound){
          isTrackingFound = true;
          Android.sendState(STATE_TRACKING_FINISH);
      }
    }
    modelAnchor.onTargetLost = () => {
      console.log("on target lost");
    }

    const mixer = new THREE.AnimationMixer(model.scene);

    const action = mixer.clipAction(model.animations[0]);
    //action.setLoop(THREE.LoopOnce);
    action.setLoop(THREE.LoopRepeat);
    action.play();

    const clock = new THREE.Clock();

    await mindarThree.start();
    Android.sendState(STATE_TRACKING_START);

    renderer.setAnimationLoop(() => {

      const delta = clock.getDelta();
      mixer.update(delta);

      renderer.render(scene, camera);
    });
  }

  start();
});
