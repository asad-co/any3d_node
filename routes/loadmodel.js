
const express = require('express');
const router = express.Router();
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const NodeThreeExporter = require('@injectit/threejs-nodejs-exporters')
const encryptResponse = require('../middleware/encrypt');

const crypto = require('crypto');
const encryptionKey = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
const insertCustomData = require('../utils/dataHandler')

router.get('/', (req, res) => {
  // Create a DOM environment using jsdom
  const dom = new JSDOM('<!DOCTYPE html>');
  const window = dom.window;
  global.window = window;
  global.document = window.document;

  // Import Three.js in the server-side environment
  const THREE = require('three');

  // Create Three.js scene and return it as response
  const scene = new THREE.Scene();



  // add light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(0, 2, 10);

  scene.add(directionalLight);

  const onParse = gltf => {
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




    const responseDataString = JSON.stringify(sceneJSON);


    // Create a cipher using AES encryption algorithm with CBC mode
    const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);

    // Encrypt the response data
    let encryptedData = cipher.update(responseDataString, 'utf8', 'hex');
    encryptedData += cipher.final('hex');

    const data=encryptedData;
    const sendIV= iv.toString('hex');
    const key =encryptionKey.toString('hex');

    

  

      const modifiedData=insertCustomData(encryptedData,sendIV,key)



    // Set the encrypted response data
    res.set('Content-Type', 'application/json');
    res.send.call(res, {response:modifiedData });

    // res.json({ scene: sceneJSON })

  }


  const file = fs.readFileSync('./3dfiles/flagarm.gltf')
  const exporter = new NodeThreeExporter()


  exporter.parse('gltf', file, onParse)


})

module.exports = router