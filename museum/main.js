import {loadGLTF} from "../libs/loader.js";
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      //imageTargetSrc: './target/ps01001002_03.mind',
      imageTargetSrc: '../assets/targets/musicband.mind',
    });
    const {renderer, scene, camera} = mindarThree;

    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    //const model = await loadGLTF("./model/ps01001002_03.glb");
    const model = await loadGLTF("../assets/models/musicband-raccoon/scene.gltf");
    model.scene.scale.set(0.1, 0.1, 0.1);
    model.scene.position.set(0, -0.4, 0);

    const modelAnchor = mindarThree.addAnchor(0);
    modelAnchor.group.add(model.scene);

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});
