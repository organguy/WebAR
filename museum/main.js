import {loadGLTF} from "../libs/loader.js";
const THREE = window.MINDAR.IMAGE.THREE;

const scaleVal = 0.001;

//const scaleVal = 0.1;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      //imageTargetSrc: './target/ps01001002_03.mind',
      //imageTargetSrc: './target/ps01001005_10.mind',
      //imageTargetSrc: './target/ps01001008_07.mind',
      imageTargetSrc: './target/ps01001010_02.mind',
      //imageTargetSrc: './target/ps01001011_07.mind',
      //imageTargetSrc: '../assets/targets/musicband.mind',
    });
    const {renderer, scene, camera} = mindarThree;

    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    const model = await loadGLTF("./model/ps01001002_03.glb");
    //const model = await loadGLTF("./model/ps01001005_10.glb");
    //const model = await loadGLTF("./model/ps01001008_07.glb");
    //const model = await loadGLTF("./model/ps01001010_02.glb");
    //const model = await loadGLTF("./model/ps01001011_07.glb");
    //const model = await loadGLTF("../assets/models/musicband-raccoon/scene.gltf");
    model.scene.scale.set(scaleVal, scaleVal, scaleVal);
    model.scene.position.set(0, -0.4, 0);

    const modelAnchor = mindarThree.addAnchor(0);
    modelAnchor.group.add(model.scene);

    const mixer = new THREE.AnimationMixer(model.scene);

    mixer.addEventListener('finished', function(e){
      console.log('animation finish');
    });

    const action = mixer.clipAction(model.animations[0]);
    //action.setLoop(THREE.LoopOnce);
    action.setLoop(THREE.LoopRepeat);
    action.play();

    const clock = new THREE.Clock();

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();
      mixer.update(delta);

      renderer.render(scene, camera);
    });
  }
  start();
});
