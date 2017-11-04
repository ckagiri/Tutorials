function init() {
    // Scene object is a container for all 3D objects that we create.
    // In other words, scene is the parent to all the objects.
    const scene = new THREE.Scene();

    // Use dat.gui to create UIs
    const gui = new dat.GUI();

    // Create a fog, which allows the scene to fade to a given color.
    // We provide the color and density of the fog.
    const enableFog = false;

    if (enableFog) {
        scene.fog = new THREE.FogExp2(0xffffff, 0.2);
    }

    // Create a plane
    const plane = getPlane(30, 30);
    scene.add(plane);

    // Create a grid of boxes
    const boxGrid = getBoxGrid(10, 1.5);
    scene.add(boxGrid);

    // Create light
    const sphere     = getSphere(0.05);
    const pointLight = getPointLight(1);
    pointLight.add(sphere);
    scene.add(pointLight);

    // We can give objects a name so that we can later find them in the
    // scene (the object's parent) using getObjectByName method.
    plane.name = "plane-1";

    // Lay the plane on the ground (rotate by 90 degrees)
    plane.rotation.x = Math.PI / 2;

    // Move the light
    pointLight.position.y = 2;
    pointLight.intensity  = 2;

    // Add sliders
    gui.add(pointLight.position, "y", 0, 5);
    gui.add(pointLight, "intensity", 0, 10);

    // Create a camera to view the 3D world
    const camera = new THREE.PerspectiveCamera(
        45,                                      // field of view
        window.innerWidth / window.innerHeight,  // aspect ratio
        1,                                       // near clipping plane
        1000                                     // far clipping plane
    );

    // Move the camera so that we can see the box and plane
    camera.position.x = 1;
    camera.position.y = 2;
    camera.position.z = 5;

    // Tell the camera where to look
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Use a renderer to create a 2D image
    const renderer = new THREE.WebGLRenderer();

    // Add shadows
    renderer.shadowMap.enabled = true;

    // Set the size of the visual output
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Change the color of the background
    renderer.setClearColor("rgb(120, 120, 120)");

    // Set where the renderer will display its results
    document.getElementById("webgl").appendChild(renderer.domElement);

    // Create orbit controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);

    // Call the update function to continuously render the scene
    update(renderer, scene, camera, controls);

    return scene;
}

// Create a plane
function getPlane(width, depth) {
    // Create the geometry and material
    const geometry = new THREE.PlaneGeometry(width, depth);
    const material = new THREE.MeshPhongMaterial({
        "color": "rgb(120, 120, 120)",
        "side" : THREE.DoubleSide
    });

    // Create the mesh
    const mesh = new THREE.Mesh(geometry, material);

    // Add shadows
    mesh.receiveShadow = true;

    return mesh;
}

// Create a rectangular box
function getBox(width, height, depth) {
    // Create the geometry and material
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshPhongMaterial({
        "color": "rgb(120, 120, 120)"
    });

    // Create the mesh
    const mesh = new THREE.Mesh(geometry, material);

    // Add shadows
    mesh.castShadow = true;

    return mesh;
}

function getBoxGrid(amount, separationMultiplier) {
    // A group lets us group objects together. Think of it as a DIV element
    // in HTML, a folder in Photoshop, or a null object in other 3D software.
    const group = new THREE.Group();

    for (let i = 0; i < amount; i++) {
        const obj = getBox(1, 1, 1);

        obj.position.x = i * separationMultiplier;
        obj.position.y = obj.geometry.parameters.height / 2;

        group.add(obj);

        for (let j = 1; j < amount; j++) {
            const obj = getBox(1, 1, 1);

            obj.position.x = i * separationMultiplier;
            obj.position.y = obj.geometry.parameters.height / 2;
            obj.position.z = j * separationMultiplier;

            group.add(obj);
        }
    }

    group.position.x = -(separationMultiplier * (amount - 1)) / 2;
    group.position.z = -(separationMultiplier * (amount - 1)) / 2;

    return group;
}

// Create a sphere
function getSphere(radius) {
    // We can indicate how smooth we want the surface to be by
    // providing width and height segment values.
    const geometry = new THREE.SphereGeometry(radius, 24, 24);
    const material = new THREE.MeshBasicMaterial({
        "color": 0xffffff
    });

    // Create the mesh
    const mesh = new THREE.Mesh(geometry, material);

    return mesh;
}

// Create a single point light source
function getPointLight(intensity) {
    // White light
    const light = new THREE.PointLight(0xffffff, intensity);

    // Add shadows
    light.castShadow = true;

    return light;
}

function update(renderer, scene, camera, controls) {
    renderer.render(scene, camera);

    controls.update();

    requestAnimationFrame(function() {
        update(renderer, scene, camera, controls);
    });
}

// We can now type `scene` on the console to check its properties
const scene = init();