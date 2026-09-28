// Portfolio content. Edit freely: projects appear in the Projects menu in this order.
// Each slide: type ("image" | "video"), src, caption (shown under the slide),
// alt (15 words or fewer, read by screen readers), and optional poster for videos.
window.SITE = {
  "name": "Kahmile A. Whitby",
  "profile": {
    "src": "assets/profile/profile.jpg",
    "alt": "Kahmile A. Whitby smiling in tinted aviator glasses and a pink patterned polo shirt."
  },
  "bio": [
    "With a strong hands-on background, I am passionate about the product development process. My interests currently lie at the intersection of engineering and my lived experience with low vision. I am interested in helping consumer product companies make interfaces that are also usable by people with disabilities."
  ],
  "contact": {
    "email": "kawhitby@mit.edu",
    "linkedin": "https://www.linkedin.com/in/kahmile-a-whitby/"
  },
  "professionalInterests": [
    "Robotics",
    "Accessible Product Design",
    "Hardware Accessibility Consulting",
    "Assistive Technology"
  ],
  "interests": [
    "Fashion design",
    "Jewelry design",
    "Cryptocurrency trading",
    "Sunshine and beaches",
    "Adaptive sports",
    "Active outings: mini golf, axe throwing, ice skating, skiing, and more"
  ]
};

window.PROJECTS = [
  {
    "slug": "reaction-wheel-inverted-pendulum-robot",
    "title": "Reaction-Wheel Inverted Pendulum Robot",
    "period": "",
    "bullets": [
      "Designed, simulated, and tuned a self-balancing reaction-wheel inverted pendulum capable of upright stabilization via reaction torque control.",
      "Modeled system dynamics and synthesized a Linear Quadratic Regulator (LQR) state-space controller in MATLAB to command real-time corrective flywheel acceleration in the direction of fall, generating an opposing reaction torque on the pendulum arm.",
      "Engineered a custom rim-weighted brass flywheel in CadQuery to maximize moment of inertia while minimizing overall assembly mass.",
      "Integrated a brushless gimbal motor, high-resolution magnetic rotary encoders, and an STM32 microcontroller stacked with a SimpleFOC driver shield for low-latency closed-loop motor control."
    ],
    "slides": [
      {
        "type": "image",
        "src": "assets/projects/reaction-wheel-inverted-pendulum-robot/main-action-shot.png",
        "caption": "Reaction-Wheel Pendulum Balancing Upright",
        "alt": "Spinning flywheel atop upright aluminum pendulum arm, power supply and laptop beside, tan wall."
      },
      {
        "type": "video",
        "src": "assets/projects/reaction-wheel-inverted-pendulum-robot/demo-video-1.mp4",
        "caption": "Demo: Upright Balancing",
        "alt": "Hand positioning tilted pendulum arm near base; power supply and laptop code behind.",
        "poster": "assets/projects/reaction-wheel-inverted-pendulum-robot/demo-video-1-poster.jpg"
      },
      {
        "type": "image",
        "src": "assets/projects/reaction-wheel-inverted-pendulum-robot/front-view-base-frame.jpg",
        "caption": "Front View of Base Frame",
        "alt": "Aluminum base frame with pivot shaft hub, clamped to wooden table, tilted arm above."
      },
      {
        "type": "image",
        "src": "assets/projects/reaction-wheel-inverted-pendulum-robot/top-view-frame.jpg",
        "caption": "Top View of Frame",
        "alt": "Overhead view of aluminum frame with black sensor mount and blue cable on wood."
      },
      {
        "type": "image",
        "src": "assets/projects/reaction-wheel-inverted-pendulum-robot/front-view-cube-mars-gimbal-motor.jpg",
        "caption": "CubeMars GL35 Gimbal Motor, Front View",
        "alt": "Face of CubeMars GL35 KV100 gimbal motor atop aluminum arm, tan wall behind."
      },
      {
        "type": "image",
        "src": "assets/projects/reaction-wheel-inverted-pendulum-robot/side-view-cube-mars-gimbal-motor.jpg",
        "caption": "CubeMars Gimbal Motor, Side View",
        "alt": "Side profile of gimbal motor between aluminum arm and flywheel hub, wood floor behind."
      },
      {
        "type": "image",
        "src": "assets/projects/reaction-wheel-inverted-pendulum-robot/close-up-mounted-flywheel.jpg",
        "caption": "Mounted Brass Flywheel",
        "alt": "Three-spoke curved flywheel bolted to gimbal motor on aluminum arm, tan wall behind."
      },
      {
        "type": "image",
        "src": "assets/projects/reaction-wheel-inverted-pendulum-robot/simplefoc-motor-shield-mounted-to-stm32.jpg",
        "caption": "STM32 with Mounted SimpleFOC Shield",
        "alt": "Black SimpleFOC shield on white STM32 board with power and motor wires, wooden surface."
      },
      {
        "type": "image",
        "src": "assets/projects/reaction-wheel-inverted-pendulum-robot/front-view-3d-printed-magnetic-sensor-mount.jpg",
        "caption": "Magnetic Encoder in 3D-Printed Mount",
        "alt": "Green AS5047P encoder board bolted inside black 3D-printed bracket on wooden floor."
      },
      {
        "type": "image",
        "src": "assets/projects/reaction-wheel-inverted-pendulum-robot/back-view-3d-printed-magnetic-sensor-mount.jpg",
        "caption": "Sensor Mount, Back View",
        "alt": "Back of black 3D-printed sensor mount showing four hex nuts, on wood."
      },
      {
        "type": "image",
        "src": "assets/projects/reaction-wheel-inverted-pendulum-robot/top-view-3d-printed-magnetic-sensor-mount.jpg",
        "caption": "Sensor Mount, Top View",
        "alt": "Top of black 3D-printed sensor mount with two mounting holes, on wood."
      },
      {
        "type": "image",
        "src": "assets/projects/reaction-wheel-inverted-pendulum-robot/back-view-rotating-shaft-with-magnet-and-centering-cup.jpg",
        "caption": "Pivot Shaft with Magnet Centering Cup",
        "alt": "Pivot shaft with black 3D-printed magnet cup protruding from aluminum frame, rear view."
      },
      {
        "type": "image",
        "src": "assets/projects/reaction-wheel-inverted-pendulum-robot/close-up-encoder-cup-magnet-near-sensor.jpg",
        "caption": "Encoder Magnet Aligned with Sensor",
        "alt": "Black magnet cup on shaft collar positioned close to encoder board inside printed mount."
      },
      {
        "type": "video",
        "src": "assets/projects/reaction-wheel-inverted-pendulum-robot/fun-disturbance-video.mp4",
        "caption": "Demo: Disturbance Rejection",
        "alt": "Hand disturbing tilted reaction-wheel pendulum carrying cardboard sheet, with laptop serial monitor behind.",
        "poster": "assets/projects/reaction-wheel-inverted-pendulum-robot/fun-disturbance-video-poster.jpg"
      }
    ]
  },
  {
    "slug": "tray-bussing-mobile-manipulator",
    "title": "Tray-Bussing Mobile Manipulator (2.12 Intro to Robotics)",
    "period": "",
    "bullets": [
      "Award — Most Valuable Engineer (MVE): Voted MVE by teammates for leading the end-to-end mechanical architecture, hardware assembly, and component sourcing/procurement.",
      "System Objective: Designed and built a mobile manipulation robot capable of autonomously bussing a dinner tray from a food prep area, traversing an inclined ramp to a dining table, and delivering the tray to a dishwashing station.",
      "Spring-Assisted Servo Gripper: Engineered a custom tray-lip pinching end-effector passively held closed by dual tension springs, paired with a high-torque goBILDA servo motor to actively amplify clamping force during transport and open the foam-padded jaws for release.",
      "Decoupled 2-DOF Belt-Driven Arm: Constructed a vertical goBILDA aluminum U-channel tower supporting a two-link robotic arm driven by independent timing-belt transmissions, allowing each link to rotate independently without kinematic coupling.",
      "Low-CG Tank Drive & Odometry Optimization: Designed a compact belt-driven tank chassis featuring rugged off-road tires for ramp traction, a short wheelbase for accurate wheel odometry, and low-mounted drive and arm-actuation gearmotors to minimize the center of mass and prevent tipping while carrying payloads on inclines."
    ],
    "slides": [
      {
        "type": "image",
        "src": "assets/projects/tray-bussing-mobile-manipulator/bot-tower-and-arm-in-resting-config-more-forward.jpg",
        "caption": "Tower & 2-DOF Belt-Driven Arm (Resting Configuration)",
        "alt": "Aluminum U-channel mobile robot with folded belt-driven arm and rugged black off-road tires."
      },
      {
        "type": "image",
        "src": "assets/projects/tray-bussing-mobile-manipulator/bot-tower-and-arm-in-resting-config.jpg",
        "caption": "Independent Timing-Belt Transmission & Low-CG Motor Mounts",
        "alt": "Side view of mobile robot showing vertical belt pulleys, low-mounted motors, and folded arm."
      },
      {
        "type": "image",
        "src": "assets/projects/tray-bussing-mobile-manipulator/close-up-gripper-servo.jpg",
        "caption": "Spring-Loaded Tray Gripper & High-Torque Servo",
        "alt": "Close-up of aluminum gripper jaws with dual tension springs, foam padding, and servo motor."
      },
      {
        "type": "image",
        "src": "assets/projects/tray-bussing-mobile-manipulator/front-view-extended-arm-config-realsense-camera-and-wiring.jpg",
        "caption": "Extended Arm, RealSense Camera & Onboard Electronics",
        "alt": "Front view of robot on workbench with extended arm, blue depth camera, and wiring."
      }
    ]
  },
  {
    "slug": "3d-cad-accessibility-project",
    "title": "3D CAD Accessibility Project",
    "period": "February-May  2025",
    "bullets": [
      "Co-led the design and development of a system that translates complex 3D CAD models into navigable 2D cross-sections on a tactile pin-array display, directly addressing the accessibility gap for Blind and Low Vision (BLV) users in engineering fields.",
      "Championed user-centered design as the project's subject matter expert on BLV accessibility: designed intuitive 3D mouse controls for model manipulation, conducted user testing on the final system, and identified critical software bugs and limitations to guide future development.",
      "Conducted extensive technical research on existing assistive technologies, including academic refreshable 3D displays from the MIT Media Lab and commercial 2D tactile graphics devices.",
      "Authored a Python script to improve the slicing-parameter input process for users, and helped teammates debug the web application during system integration."
    ],
    "slides": [
      {
        "type": "image",
        "src": "assets/projects/3d-cad-accessibility-project/tactile-display-and-3d-mouse-1.jpg",
        "caption": "Tactile Pin-Array Display",
        "alt": "Black Graphiti tactile pin-array display angled on white background, raised pins forming a graphic."
      },
      {
        "type": "image",
        "src": "assets/projects/3d-cad-accessibility-project/tactile-display-and-3d-mouse-2.jpg",
        "caption": "3D Mouse Controller",
        "alt": "Top-down view of black 3Dconnexion 3D mouse with blue-ringed knob on white background."
      }
    ]
  },
  {
    "slug": "audio-haptic-rc-car",
    "title": "Audio-Haptic RC Car",
    "period": "June 2024 - TBD",
    "bullets": [
      "Conceptualized and designed a hobby-grade RC car with auditory and vibrational feedback to improve access for individuals with vision disabilities and to provide a richer user interface",
      "Conducted research and calculations to select and integrate the mechanical, electrical, and software components",
      "Assembled the car, wrote dynamics test code in C++, and programmed the radio controllers",
      "Current progress: Integrating distance sensor data with PWM outputs for real-time collision avoidance",
      "Future development: Adding the auditory and vibration feedback system and aesthetic finishes"
    ],
    "slides": [
      {
        "type": "image",
        "src": "assets/projects/audio-haptic-rc-car/angled-view-w-chassis-radio-and-microcontroller.jpg",
        "caption": "Angled View with Chassis, Radio and Microcontroller",
        "alt": "RC car chassis beside RadioLink transmitter and microcontroller on wooden workbench, black pegboard behind."
      },
      {
        "type": "image",
        "src": "assets/projects/audio-haptic-rc-car/chassis-with-electronics-board-and-sensor-testing-mount.jpg",
        "caption": "Chassis with Electronics Board and Sensor Testing Mount",
        "alt": "RC chassis with wired breadboard on clear platform beside laptop showing code on desk."
      },
      {
        "type": "image",
        "src": "assets/projects/audio-haptic-rc-car/close-up-all-wheel-drive-gear-box.jpg",
        "caption": "Close-Up of All-Wheel Drive Gearbox",
        "alt": "Motor, spur gear, and pinion gearbox on carbon fiber chassis, living room behind."
      },
      {
        "type": "image",
        "src": "assets/projects/audio-haptic-rc-car/body-shell-with-360-degree-lidar.jpg",
        "caption": "Body Shell with 360 Degree LIDAR",
        "alt": "White SUV-style body shell with black LIDAR on roof, on wooden bench before pegboard."
      },
      {
        "type": "image",
        "src": "assets/projects/audio-haptic-rc-car/close-up-360-degree-lidar.jpg",
        "caption": "Close-Up of 360 Degree LIDAR",
        "alt": "Close-up of black circular LIDAR unit mounted on white body shell roof, pegboard behind."
      }
    ]
  },
  {
    "slug": "autonomous-navigation-robot",
    "title": "Autonomous Navigation Robot",
    "period": "Dec. 2023 - March 2024",
    "bullets": [
      "Developed Python code enabling the bot to navigate around obstacles based on sensor data",
      "Wired ultrasonic sensor, servo motors, and battery pack to a micro:bit microcontroller via a power distribution board (PDB)",
      "Assembled chassis and drivetrain using LEGO components",
      "Mounted electronic components and tested vehicle dynamics and obstacle detection"
    ],
    "slides": [
      {
        "type": "image",
        "src": "assets/projects/autonomous-navigation-robot/angled-view.jpg",
        "caption": "Assembled Navigation Robot (Angled View)",
        "alt": "Angled view of LEGO robot with ultrasonic sensor, micro:bit, and servo drivetrain on wooden table."
      },
      {
        "type": "image",
        "src": "assets/projects/autonomous-navigation-robot/front-view-close-ultrasonic-sensor.jpg",
        "caption": "Ultrasonic Sensor Mount (Front)",
        "alt": "Ultrasonic sensor rubber-banded atop gray LEGO mount, wires running down, textured white wall behind."
      },
      {
        "type": "image",
        "src": "assets/projects/autonomous-navigation-robot/bot-front-view-close-drivetrain.jpg",
        "caption": "Servo Motor Drivetrain (Front)",
        "alt": "Front view of zip-tied servo motors driving LEGO gears and wheels beneath micro:bit board."
      },
      {
        "type": "image",
        "src": "assets/projects/autonomous-navigation-robot/side-view.jpg",
        "caption": "LEGO Chassis and Sensor Mast (Side)",
        "alt": "Side view of LEGO robot chassis with raised ultrasonic sensor on a wooden table."
      }
    ]
  },
  {
    "slug": "mit-solar-electric-vehicle-team-suspension-parts",
    "title": "MIT Solar Electric Vehicle Team Suspension Parts",
    "period": "Sept. 2019 - March 2020",
    "bullets": [
      "Collaborated with team to manufacture a street-legal, solar-powered electric car to compete in a race",
      "Designed toolpaths for front suspension parts in SolidWorks and manufactured them using shop tools",
      "Car placed first in the 2021 American Solar Challenge"
    ],
    "slides": [
      {
        "type": "image",
        "src": "assets/projects/mit-solar-electric-vehicle-team-suspension-parts/shock-mount-on-mill.jpg",
        "caption": "Shock Mount on Mill",
        "alt": "Aluminum shock mount clamped in mill vise beneath end mill, surrounded by metal chips."
      },
      {
        "type": "image",
        "src": "assets/projects/mit-solar-electric-vehicle-team-suspension-parts/front-shock-mount-finished.jpg",
        "caption": "Front Shock Mount Finished",
        "alt": "Machined aluminum shock mount with two angled tabs resting on a gray workbench."
      },
      {
        "type": "image",
        "src": "assets/projects/mit-solar-electric-vehicle-team-suspension-parts/left-upper-arm-tube-joint.jpg",
        "caption": "Left Upper Arm Tube Joint",
        "alt": "Aluminum tube joint threaded onto a dark tube, held against a white surface."
      },
      {
        "type": "image",
        "src": "assets/projects/mit-solar-electric-vehicle-team-suspension-parts/left-and-right-upper-arm-tube-joint.jpg",
        "caption": "Left and Right Upper Arm Tube Joint",
        "alt": "Two mirrored upper arm tubes with aluminum joints and rod ends on a gray surface."
      },
      {
        "type": "image",
        "src": "assets/projects/mit-solar-electric-vehicle-team-suspension-parts/assembled-suspension.jpg",
        "caption": "Assembled Suspension",
        "alt": "Front wheel mounted on suspension arms and shock inside the car's carbon fiber chassis."
      },
      {
        "type": "image",
        "src": "assets/projects/mit-solar-electric-vehicle-team-suspension-parts/nimbus-body-shell.jpg",
        "caption": "Nimbus Body Shell",
        "alt": "White Nimbus body shell sections resting on foam blocks inside a garage workshop."
      }
    ]
  }
];
