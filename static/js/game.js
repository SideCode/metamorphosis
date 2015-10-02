import { THREE, OrbitControls } from "engine";

import Axes from "util/axes";
import SkySphere from "util/skysphere";

import Terrain from "procedural/terrain";
import Biome from "procedural/biome";

export default class Game {
    constructor(container_id, world_size=128) {
        this.WIDTH = window.innerWidth;
        this.HEIGHT = window.innerHeight;
        this.VIEW_ANGLE = 45;
        this.ASPECT = this.WIDTH / this.HEIGHT;
        this.NEAR = 0.1;
        this.FAR = 10000;

        this.world_size = world_size;
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setSize(this.WIDTH, this.HEIGHT);
        this.renderer.setClearColor(0x000000, 1);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.soft = true;

        this.camera = new THREE.PerspectiveCamera(this.VIEW_ANGLE, this.ASPECT, this.NEAR, this.FAR);
        this.camera.position.x = 200;
        this.camera.position.y = 400;
        this.camera.position.z = 200;

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.scene = new THREE.Scene();
        this.scene.add(this.camera);

        document.getElementById(container_id).appendChild(this.renderer.domElement);
        window.addEventListener("resize", () => this.resize());
    }

    init() {
        this.scene.add(SkySphere("/static/images/galaxy_starfield.png", 4 * this.world_size));
        this.scene.add(Axes(this.WIDTH));

        const pointLight = new THREE.DirectionalLight(0xFFFF00, 1, 10000);
        pointLight.castShadow = true;
        pointLight.position.set(this.world_size/2, 50, -this.world_size/2);
        this.scene.add(pointLight);

        this.scene.add(Terrain.Ground(this.world_size));
        this.scene.add(Terrain.Water(this.world_size));
        const biome = Biome(this.world_size * 7);
        biome.position.y = -10;
        this.scene.add(biome);

        this.scene.fog = new THREE.FogExp2(0xEEDDBB, 0.0010);
    }

    resize() {
        this.WIDTH = window.innerWidth;
        this.HEIGHT = window.innerHeight;
        this.renderer.setSize(this.WIDTH, this.HEIGHT);
        this.camera.aspect = this.WIDTH / this.HEIGHT;
        this.camera.updateProjectionMatrix();
    }

    update() {
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}
