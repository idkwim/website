(function() {
  var __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __hasProp = {}.hasOwnProperty;

  jQuery(function($) {
    var AMBER, Badge, Bottle, Camera, Can, Computer, DirLight, HackerRoom, IdaBook, OdroidHeartbeat, Paper, Renderable, Room, TTT, TexturedMesh, Updater;
    TTT = THREE;
    AMBER = 0xF5B34A;
    HackerRoom = (function() {
      function HackerRoom(_at_canvas) {
        this.canvas = _at_canvas;
        this.updater = new Updater;
        this.initializeLoader();
        this.initializeScene();
        this.initializeRoom();
      }

      HackerRoom.prototype.initializeLoader = function() {
        return this.loader = new TTT.LoadingManager();
      };

      HackerRoom.prototype.initializeScene = function() {
        return this.scene = new TTT.Scene;
      };

      HackerRoom.prototype.initializeCamera = function() {
        this.camera = new Camera(this.canvas, this.scene);
        return this.updater.add(this.camera);
      };

      HackerRoom.prototype.initializeRoom = function() {
        this.room = new Room(this.scene, this.loader, this.roomFinished.bind(this));
        return this.updater.add(this.room);
      };

      HackerRoom.prototype.roomFinished = function() {
        this.updater.add(this.room);
        this.initializeDirLight();
        this.initializeComputer();
        this.initializeCamera();
        return requestAnimationFrame(this.renderLoop.bind(this));
      };

      HackerRoom.prototype.initializeDirLight = function() {
        this.dirLight = new DirLight(this.scene, this.room.displayPanel());
        return this.updater.add(this.dirLight);
      };

      HackerRoom.prototype.initializeComputer = function() {
        return this.computer = new Computer(this.scene, this.room.displayPanel());
      };

      HackerRoom.prototype.renderLoop = function() {
        this.updater.render();
        return requestAnimationFrame(this.renderLoop.bind(this));
      };

      return HackerRoom;

    })();
    Updater = (function() {
      function Updater() {
        this.list = [];
      }

      Updater.prototype.add = function(obj) {
        return this.list.push(obj);
      };

      Updater.prototype.render = function() {
        var e, _i, _len, _ref, _results;
        _ref = this.list;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          e = _ref[_i];
          _results.push(e.render());
        }
        return _results;
      };

      return Updater;

    })();
    Renderable = (function() {
      function Renderable() {}

      Renderable.prototype.render = function() {};

      return Renderable;

    })();
    TexturedMesh = (function() {
      function TexturedMesh(_at_object) {
        this.object = _at_object;
        this.mesh = this.object.children[0];
        this.createTexture();
      }

      TexturedMesh.prototype.createTexture = function() {
        this.texture = TTT.ImageUtils.loadTexture(this.textureFilePicker());
        this.texture.anisotropy = 16;
        this.texture.repeat.set(1, 1);
        this.texture.mapFilter = this.texture.magFilter = TTT.LinearFilter;
        this.texture.mapping = TTT.UVMapping;
        return this.mesh.material = new TTT.MeshPhongMaterial({
          color: new TTT.Color(0x444444),
          emissive: new TTT.Color(0x444444),
          specular: new TTT.Color(0x444444),
          shininess: 10,
          map: this.texture
        });
      };

      TexturedMesh.prototype.textureFilePicker = function() {
        return this.textureFile;
      };

      return TexturedMesh;

    })();
    Room = (function(_super) {
      __extends(Room, _super);

      function Room(_at_scene, _at_manager, _at_callback) {
        this.scene = _at_scene;
        this.manager = _at_manager;
        this.callback = _at_callback;
        this.loader = new THREE.ColladaLoader(this.manager);
        this.loader.load('hacker_room.xml', this.loaded.bind(this));
      }

      Room.prototype.loaded = function(o) {
        this.sceneParent = o.scene.children[0];
        this.sceneParent.scale.set(0.15, 0.15, 0.15);
        this.sceneParent.position.set(-6, -2, -2);
        this.sceneParent.rotation.x = 3.0 / 2.0 * Math.PI;
        this.sceneParent.rotation.z = 3.0 / 2.0 * Math.PI;
        this.sceneParent.updateMatrix();
        this.sceneParent.traverse((function(_this) {
          return function(c) {
            if (c.type !== 'PointLight') {
              c.castShadow = true;
            }
            c.receiveShadow = true;
            c.frustrumCulling = false;
            if (c.name === 'IDA Book') {
              return _this.idabook = new IdaBook(c);
            } else if (c.name === 'BeerBottle') {
              return _this.bottle = new Bottle(c);
            } else if (c.name === 'paper') {
              return _this.paper = new Paper(c);
            } else if (c.name.match(/Cylinder00\d/)) {
              if (_this.cans == null) {
                _this.cans = [];
              }
              return _this.cans.push(new Can(c));
            } else if (c.name === 'odroid heartbeat') {
              return _this.heartbeat = new OdroidHeartbeat(c);
            } else if (c.name.match(/badge/i)) {
              if (_this.badge == null) {
                _this.badge = new Badge;
              }
              return _this.badge.addObject(c);
            }
          };
        })(this));
        this.scene.add(this.sceneParent);
        this.sceneParent.updateMatrixWorld();
        this.didLoad = true;
        return this.callback();
      };

      Room.prototype.displayPanel = function() {
        if (this._displayPanel != null) {
          return this._displayPanel;
        }
        this.scene.traverse((function(_this) {
          return function(c) {
            if (c.name === 'display-panel') {
              return _this._displayPanel = c;
            }
          };
        })(this));
        return this._displayPanel;
      };

      return Room;

    })(Renderable);
    IdaBook = (function(_super) {
      __extends(IdaBook, _super);

      function IdaBook() {
        return IdaBook.__super__.constructor.apply(this, arguments);
      }

      IdaBook.prototype.textureFile = 'hacker_room/uv-idabook.png';

      return IdaBook;

    })(TexturedMesh);
    Bottle = (function(_super) {
      __extends(Bottle, _super);

      function Bottle() {
        return Bottle.__super__.constructor.apply(this, arguments);
      }

      Bottle.prototype.textureFile = 'hacker_room/uv-bottle.png';

      return Bottle;

    })(TexturedMesh);
    Paper = (function(_super) {
      __extends(Paper, _super);

      function Paper() {
        return Paper.__super__.constructor.apply(this, arguments);
      }

      Paper.prototype.textureFilePicker = function() {
        var idx, pick;
        idx = Math.floor(Math.random() * this.textureNames.length);
        pick = this.textureNames[idx];
        return "hacker_room/" + pick;
      };

      Paper.prototype.textureNames = ['choripan.png'];

      return Paper;

    })(TexturedMesh);
    Can = (function(_super) {
      __extends(Can, _super);

      function Can() {
        return Can.__super__.constructor.apply(this, arguments);
      }

      Can.prototype.textureFile = 'hacker_room/uv-can.png';

      return Can;

    })(TexturedMesh);
    OdroidHeartbeat = (function() {
      function OdroidHeartbeat(_at_object3d) {
        this.object3d = _at_object3d;
        this.light = this.object3d.children[0];
        this.light.distance = 5;
        hackerRoom.updater.add(this);
      }

      OdroidHeartbeat.prototype.render = function() {
        var cycle;
        cycle = 0.1 + Math.sin(Date.now() * 0.005);
        if (cycle > 1) {
          return this.light.intensity = 0.25;
        } else {
          return this.light.intensity = 0;
        }
      };

      return OdroidHeartbeat;

    })();
    Badge = (function() {
      function Badge() {
        this.eyes = [];
        this.eyeMaterials = [];
        hackerRoom.updater.add(this);
      }

      Badge.prototype.addObject = function(object) {
        if (object.name.match(/BadgeEye/)) {
          return this.addEye(object);
        } else if (object.name === 'badge-light') {
          return this.addLight(object);
        }
      };

      Badge.prototype.addEye = function(eye) {
        this.eyes.push(eye);
        return this.eyeMaterials.push(eye.children[0].material);
      };

      Badge.prototype.addLight = function(light) {
        this.light = light.children[0];
        return this.light.distance = 5;
      };

      Badge.prototype.render = function() {
        var cycle, i, _i, _j, _len, _len1, _ref, _ref1, _ref2, _ref3, _results, _results1;
        cycle = 0.1 + Math.sin((Date.now() * 0.003) + .1);
        if (cycle > 1) {
          if ((_ref = this.light) != null) {
            _ref.intensity = 0.5;
          }
          _ref1 = this.eyeMaterials;
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            i = _ref1[_i];
            _results.push(i.emissive.set(0xaaccff));
          }
          return _results;
        } else {
          if ((_ref2 = this.light) != null) {
            _ref2.intensity = 0.25;
          }
          _ref3 = this.eyeMaterials;
          _results1 = [];
          for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
            i = _ref3[_j];
            _results1.push(i.emissive.set(0x000000));
          }
          return _results1;
        }
      };

      return Badge;

    })();
    Computer = (function(_super) {
      __extends(Computer, _super);

      function Computer(_at_scene, _at_displayPanel) {
        this.scene = _at_scene;
        this.displayPanel = _at_displayPanel;
        this.makeScreen();
      }

      Computer.prototype.makeScreen = function() {
        var mesh;
        mesh = this.displayPanel.children[0];
        mesh.receiveShadow = false;
        this.screenTexture = TTT.ImageUtils.loadTexture('hacker_room/legitbs-2015-text.png');
        this.screenTexture.anisotropy = 16;
        this.screenTexture.repeat.set(1, 1);
        this.screenTexture.mapFilter = this.screenTexture.magFilter = TTT.LinearFilter;
        this.screenTexture.mapping = TTT.UVMapping;
        this.screenTexture.wrapS = this.screenTexture.wrapT = TTT.ClampToEdgeWrapping;
        return mesh.material = new TTT.MeshPhongMaterial({
          color: new TTT.Color(0x444444),
          emissive: new TTT.Color(AMBER),
          specular: new TTT.Color(0xffffff),
          shininess: 30,
          map: this.screenTexture
        });
      };

      return Computer;

    })(Renderable);
    Camera = (function(_super) {
      __extends(Camera, _super);

      function Camera(_at_canvas, _at_scene) {
        this.canvas = _at_canvas;
        this.scene = _at_scene;
        this.initializeCamera();
        this.initializeRenderer();
      }

      Camera.prototype.initializeCamera = function() {
        this.camera = new TTT.PerspectiveCamera(55, (1.0 * this.canvas.width) / this.canvas.height, 0.1, 1000);
        return this.camera.position.set(0, 4.5, 5);
      };

      Camera.prototype.initializeRenderer = function() {
        this.renderer = new TTT.WebGLRenderer({
          canvas: this.canvas,
          antialias: true,
          alpha: true
        });
        this.renderer.shadowMapEnabled = true;
        return this.renderer.shadowMapCullFace = THREE.CullFaceBack;
      };

      Camera.prototype.render = function() {
        var xCycle, yCycle;
        xCycle = -0.25 - (0.08 * Math.cos(Date.now() / 10000.0));
        yCycle = 0.1 * Math.sin((Date.now() + 1000) / 19000.0);
        this.camera.rotation.set(xCycle, yCycle, 0);
        return this.renderer.render(this.scene, this.camera);
      };

      return Camera;

    })(Renderable);
    DirLight = (function(_super) {
      __extends(DirLight, _super);

      function DirLight(_at_scene, _at_target) {
        var shadowCameraSize;
        this.scene = _at_scene;
        this.target = _at_target;
        this.light = new THREE.DirectionalLight(0xffffff, 0.25);
        this.light.position.set(-20, 10, 25);
        this.light.castShadow = true;
        this.light.shadowMapWidth = 2048;
        this.light.shadowMapHeight = 2048;
        this.light.onlyShadow = false;
        shadowCameraSize = 10;
        this.light.shadowCameraLeft = -shadowCameraSize;
        this.light.shadowCameraRight = shadowCameraSize;
        this.light.shadowCameraTop = shadowCameraSize;
        this.light.shadowCameraBottom = -shadowCameraSize;
        this.light.shadowCameraNear = 1;
        this.light.shadowCameraFar = 200;
        this.light.shadowBias = -0.0001;
        this.light.shadowDarkness = 0.35;
        this.light.shadowCameraVisible = true;
        this.light.lookAt(this.target.position);
        this.scene.add(this.light);
      }

      DirLight.prototype.render = function() {
        var xCycle, yCycle;
        xCycle = 0.4 * Math.sin(Date.now() / 10000.0);
        yCycle = 0.8 * Math.cos(Date.now() / 20000.0);
        return this.light.position.set(-21 + xCycle, 10 + yCycle, 25);
      };

      return DirLight;

    })(Renderable);
    return window.hackerRoom = new HackerRoom(document.getElementById('actualScene'));
  });

}).call(this);
