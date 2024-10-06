// Three.js solar system orrery setup (as explained in previous responses)
function addOrrery() {
    // Initialization, camera, renderer, controls code here...
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // OrbitControls (rotation and zoom)
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;

    // Load textures for planets
    const textureLoader = new THREE.TextureLoader();
    const sunTexture = textureLoader.load('textures/sun.jpg');
    const mercuryTexture = textureLoader.load('textures/mercury.jpg');
    const venusTexture = textureLoader.load('textures/venus.jpg');
    const earthTexture = textureLoader.load('textures/earth.jpg');
    const marsTexture = textureLoader.load('textures/mars.jpg');
    const jupiterTexture = textureLoader.load('textures/jupiter.jpg');
    const saturnTexture = textureLoader.load('textures/saturn.jpg');
    const uranusTexture = textureLoader.load('textures/uranus.jpg');
    const neptuneTexture = textureLoader.load('textures/neptune.jpg');
    const asteroidTexture = textureLoader.load('textures/meteroids.jpg'); // Rocky texture for asteroids and meteoroids

    // Sun
    const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Create planet function with texture, distance, and speed
    function createPlanet(size, texture, distance, speed) {
      const geometry = new THREE.SphereGeometry(size, 32, 32);
      const material = new THREE.MeshBasicMaterial({ map: texture });
      const planet = new THREE.Mesh(geometry, material);

      planet.userData = { distance, speed, angle: Math.random() * Math.PI * 2 };
      scene.add(planet);

      return planet;
    }

    // Planets with real textures
    const planets = [];
    planets.push(createPlanet(0.2, mercuryTexture, 7, 0.03));   // Mercury
    planets.push(createPlanet(0.3, venusTexture, 9, 0.025));    // Venus
    planets.push(createPlanet(0.5, earthTexture, 12, 0.02));    // Earth
    planets.push(createPlanet(0.4, marsTexture, 15, 0.018));    // Mars
    planets.push(createPlanet(1.0, jupiterTexture, 20, 0.012)); // Jupiter
    planets.push(createPlanet(0.9, saturnTexture, 25, 0.01));   // Saturn
    planets.push(createPlanet(0.7, uranusTexture, 30, 0.008));  // Uranus
    planets.push(createPlanet(0.7, neptuneTexture, 35, 0.007)); // Neptune

    // Orbit paths for planets
    const orbitLines = [];
    planets.forEach(planet => {
      const orbitGeometry = new THREE.RingGeometry(planet.userData.distance - 0.1, planet.userData.distance + 0.1, 64);
      const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.x = Math.PI / 2;
      scene.add(orbit);
      orbitLines.push(orbit);
    });

    // Asteroids - Using rocky texture for realism
    function createAsteroid(size, distance, speed) {
      const geometry = new THREE.SphereGeometry(size, 16, 16);
      const material = new THREE.MeshBasicMaterial({ map: asteroidTexture });
      const asteroid = new THREE.Mesh(geometry, material);

      asteroid.userData = { distance, speed, angle: Math.random() * Math.PI * 2 };
      scene.add(asteroid);

      return asteroid;
    }

    const asteroids = [];
    for (let i = 0; i < 20; i++) {
      asteroids.push(createAsteroid(0.1, 25 + i * 2, 0.005 + i * 0.001));
    }

    // Adding a comet with a distinct elliptical orbit
    function createComet(size, distance, speed) {
      const geometry = new THREE.SphereGeometry(size, 16, 16);
      const material = new THREE.MeshBasicMaterial({ map: asteroidTexture });
      const comet = new THREE.Mesh(geometry, material);

      comet.userData = { distance, speed, angle: Math.random() * Math.PI * 2 };
      scene.add(comet);

      return comet;
    }

    const comet = createComet(0.3, 35, 0.007);

    // Meteoroids (small celestial rocks)
    function createMeteoroid(size, distance, speed) {
      const geometry = new THREE.SphereGeometry(size, 16, 16);
      const material = new THREE.MeshBasicMaterial({ map: asteroidTexture });
      const meteoroid = new THREE.Mesh(geometry, material);

      meteoroid.userData = { distance, speed, angle: Math.random() * Math.PI * 2 };
      scene.add(meteoroid);

      return meteoroid;
    }

    const meteoroids = [];
    for (let i = 0; i < 10; i++) {
      meteoroids.push(createMeteoroid(0.05, 18 + i * 1.5, 0.008 + i * 0.001));
    }

    // Set camera position
    camera.position.z = 60;

    // Update planet and object orbits
    function updateOrbit(bodies, speedFactor) {
      bodies.forEach(body => {
        body.userData.angle += body.userData.speed * speedFactor;
        body.position.x = body.userData.distance * Math.cos(body.userData.angle);
        body.position.z = body.userData.distance * Math.sin(body.userData.angle);
      });
    }

    // Speed factor for adjusting the speed of the simulation
    let speedFactor = 1;

    // Speed control buttons
    document.getElementById('faster').addEventListener('click', () => speedFactor *= 1.5);
    document.getElementById('slower').addEventListener('click', () => speedFactor /= 1.5);
    document.getElementById('resetSpeed').addEventListener('click', () => speedFactor = 1);

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      updateOrbit(planets, speedFactor);
      updateOrbit(asteroids, speedFactor);
      updateOrbit([comet], speedFactor);
      updateOrbit(meteoroids, speedFactor);

      controls.update();
      renderer.render(scene, camera);
    }

    animate();

    // Handle window resizing
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Fetch comet data from NASA's API
async function fetchCometData() {
    const response = await fetch('https://data.nasa.gov/resource/b67r-rgxc.json');
    const data = await response.json();
    populateCometTable(data);
}

function populateCometTable(comets) {
    const cometList = document.getElementById('comet-list');
    comets.forEach(comet => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${comet.name}</td>
            <td>${comet.object_number}</td>
            <td>${comet.distance_from_earth}</td>
            <td>${comet.orbital_period}</td>
        `;
        cometList.appendChild(row);
    });
}

addOrrery();  // Add the solar system orrery
fetchCometData();  // Fetch and populate comet data
