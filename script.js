const canvas = document.getElementById("canvas");
canvas.width = 800;
canvas.height = 750;
const area = canvas.getContext("2d");

let road_speed = 3;
const carWidth = 135;
const carHeight = 150;
let car_x = 150;
let car_y = 600;
let lanes = [150, 280, 400, 520];
let last_time = 0;
let delay = 3000;
let other_cars = [];
let prev_score = 0;
let collison = 0;
const road_img = new Image();
road_img.src = "./Images/road-image.png";
const car_img = new Image();
car_img.src = "./Images/Car.png";
let y_position = 0;
const initial_time = Date.now();
let other_cars_speed = 2;
let carssources = ["./Images/Greenish_Car.png", "./Images/Pink_Car.png", "./Images/Yelloe_Car.png", "./Images/Red_Car.png"];

road_img.onload = function () {
    car_img.onload = function () {
        moveRoad();
    };
};

const cars = [];

for(let i = 0; i < 4;i++){
    let newCar = new Image();
    newCar.src = carssources[i];
    cars.push(newCar);
}


function moveRoad() {
    area.clearRect(0, 0, canvas.width, canvas.height);

    area.drawImage(road_img, 0, y_position, canvas.width, canvas.height);
    area.drawImage(road_img, 0, y_position - canvas.height, canvas.width, canvas.height);

    let time_seconds = (Date.now() - initial_time) / 1000;
    let score = Math.floor(road_speed * time_seconds);

    if (score % 100 === 0 && score !== prev_score) {
        road_speed += 1;
        other_cars_speed += 1;
        prev_score = score;
    }

    for (let i = 0; i < other_cars.length; i++) {
        let car1_center_x = car_x + carWidth / 2;
        let car1_center_y = car_y + carHeight / 2;
        let car2_center_x = other_cars[i].x + carWidth / 2;
        let car2_center_y = other_cars[i].y + carHeight / 2;

        let x = car1_center_x - car2_center_x;
        let y = car1_center_y - car2_center_y;
        let distance = Math.sqrt(x * x + y * y);

        let half_width = carWidth / 2;
        let half_height = carHeight / 2;
        let collision_distance = Math.sqrt((half_width * half_width) + (half_height * half_height)) - 55;

        if (distance < collision_distance) {
            collison++;
            other_cars.splice(i, 1);
            break;
        }
    }

    area.font = "30px Arial";
    area.fillStyle = "black";
    area.fillText("Score: " + score, 340, 50);
    area.fillText("Collisions: " + collison, 320, 90);

    y_position += road_speed;
    if (y_position >= canvas.height) y_position = 0;

    area.drawImage(car_img, car_x, car_y, carWidth, carHeight);

    let current_time = Date.now();
    if (current_time - last_time > delay) {
        generateRandom();
        last_time = current_time;
    }

    for (let i = other_cars.length - 1; i >= 0; i--) {
        other_cars[i].y += other_cars_speed;
        area.drawImage(cars[other_cars[i].index], other_cars[i].x, other_cars[i].y, carWidth, carHeight);

        if (other_cars[i].y > canvas.height) {
            other_cars.splice(i, 1);
        }
    }

    requestAnimationFrame(moveRoad);
}

function generateRandom() {
    let random_index = Math.floor(Math.random() * lanes.length);

    other_cars.push({
        x: lanes[random_index],
        y: 0,
        index : random_index
    });
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === 'a') {
        if (car_x - 20 >= 120) car_x -= 20;
    }
    else if (event.key === "ArrowRight" || event.key == 'd') {
        if (car_x + carWidth + 20 <= 680) car_x += 20;
    }
    else if (event.key === "ArrowUp" || event.key === 'w') {
        if (car_y - 20 >= 0) car_y -= 20;
    }
    else if (event.key === "ArrowDown" || event.key === 's') {
        if (car_y + carHeight + 20 <= 730) car_y += 20;
    }
});
