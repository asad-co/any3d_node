import express from 'express'
const router = express.Router();
import { JSDOM } from 'jsdom'
import path from 'path'
import * as THREE from "three"
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


router.get('/', async (req, res) => {
    // Create a DOM environment using jsdom
    const dom = new JSDOM('<!DOCTYPE html>');
    const window = dom.window;
    global.window = window;
    global.document = window.document;



    // Create Three.js scene and return it as response
    const scene = new THREE.Scene();

    // const GLTF= require('../utils/three.js')


    // add light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 2, 10);

    scene.add(directionalLight);

    const loader = new GLTFLoader();
    const gltfPath = path.resolve(__dirname, 'fan.gltf');

    console.log({gltfPath})

    try {
         loader.load(
            gltfPath,
            (gltf => {
                const mesh = gltf.scene;

                // Calculate the bounding box of the entire group
                const groupBoundingBox = new THREE.Box3().setFromObject(mesh);



                const size = new THREE.Vector3();
                groupBoundingBox.getSize(size);

                // Calculate the scaling factor for model
                const target_size = 10;
                const scale = target_size / size.length();
                mesh.scale.set(scale, scale, scale);

                const newgroupBoundingBox = new THREE.Box3().setFromObject(mesh);
                const groupCenter = new THREE.Vector3();
                newgroupBoundingBox.getCenter(groupCenter);

                // Move the group so that its center is at the scene's origin
                mesh.position.sub(groupCenter);

                scene.add(mesh);

                // Convert the Three.js scene to a JSON object
                const sceneJSON = JSON.stringify(scene.toJSON());

                // Clean up the jsdom global variables
                delete global.window;
                delete global.document;

                res.json({ scene: sceneJSON })


            }))



    
    } catch (error) {
        console.error('Error loading GLTF:', error);
        res.status(500).send('Error loading GLTF file');
    }

})

export default router