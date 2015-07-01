/// <reference path="../typings/angularjs/angular.d.ts"/>
/// <reference path="../typings/stats/stats.d.ts"/>
/// <reference path="../typings/threejs/three-trackballcontrols.d.ts"/>
/// <reference path="../typings/threejs/three.d.ts"/>
/// <reference path="../typings/tween.js/tween.js.d.ts"/>

(function() {
	var app = angular.module('3d-demo', []);
	var stats, scene, camera, renderer, controls, sphere;
	
	init();
	animate();
	
	window.addEventListener('resize', onResize);
	
	app.controller('mainController', function ($scope) {
		$scope.model = {
			scale: 1
		};
		
		$scope.addStars = function(count) {
			addStars(count);
		};
		
		$scope.$watch('model.scale', function(newVal, oldVal) {
			if (newVal === oldVal)
				return;
				
			new TWEEN.Tween({scale: sphere.scale.x})
				.to({scale: newVal}, 1000)
				.easing(TWEEN.Easing.Elastic.InOut)
				.onUpdate(function () {
					sphere.scale.set(this.scale, this.scale, this.scale);
				})
				.start();
		});
	});
	
	function init() {
		stats = new Stats();
		document.body.appendChild(stats.domElement);
		
		var width = window.innerWidth;
		var height = window.innerHeight - 90;
		
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(45, width/height);
		camera.position.set(0, 0, 100);
		
		renderer = new THREE.WebGLRenderer({antialias: true});
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(width, height);
		renderer.setClearColor(0x000000);
		
		var container = document.getElementById('container');
		container.appendChild(renderer.domElement);
		controls = new THREE.TrackballControls(camera, container);
		
		// Sphere
		var textureLoader = new THREE.TextureLoader();
		textureLoader.load('assets/earth.jpg', function(texture) {		
			var geometry = new THREE.SphereGeometry(5, 50, 50);
			var material = new THREE.MeshLambertMaterial({map: texture});
			sphere = new THREE.Mesh(geometry, material);
			
			scene.add(sphere);
		});
		
		// Lights
		var ambientLight = new THREE.AmbientLight(0xcccccc);
		scene.add(ambientLight);
		
		var pointLight = new THREE.PointLight(0xffffff);
		pointLight.position.set(300, 0, 300);
		scene.add(pointLight);
	}
	
	function addStars(starsCount) {
		var stars = new THREE.Geometry();
		var starMaterial = new THREE.PointCloudMaterial({color: 0xffffff});
		
		for (var i = 0; i < starsCount; i++) {
			var x = Math.random() * 2000 - 1000;
			var y = Math.random() * 2000 - 1000;
			var z = Math.random() * 2000 - 1000;
			
			var star = new THREE.Vector3(x, y, z);
			
			stars.vertices.push(star);
		}
		
		var pointCloud = new THREE.PointCloud(stars, starMaterial);
		scene.add(pointCloud);
	}
	
	function animate() {
		window.requestAnimationFrame(animate);
		
		stats.update();
		controls.update();
		TWEEN.update();
		
		renderer.render(scene, camera);
	}
	
	function onResize() {
		var width = window.innerWidth;
		var height = window.innerHeight - 90;
		
		camera.aspect = width / height;
	    camera.updateProjectionMatrix();
		
		renderer.setSize(width, height);
	}
})();