const canvas = document.getElementById("canvas");

canvas.width = innerWidth;
canvas.height = innerHeight;

const area = canvas.getContext("2d");

const road_img = new Image();
road_img.src = "./Images/road-image.png";
const car_img = new Image();
car_img.src = "./Images/Car.png";

const x_position = 400;
let y_position = 0;
const road_speed = 5;

const carWidth = 120;
const carHeight = 200;
let car_x = canvas.width/2 - carWidth/2; 
let car_y = canvas.height - carHeight - 10; 

road_img.onload = function () {
    car_img.onload = function () {
        moveRoad();
    };
};

function moveRoad() {
    area.clearRect(0, 0, canvas.width, canvas.height);
    
    area.drawImage(road_img, x_position, y_position, 800, 1500);
    area.drawImage(road_img, x_position, y_position - 1500, 800, 1500);

    y_position = y_position + road_speed;
    
    if (y_position >= 1500) y_position = 0;
    
    area.drawImage(car_img, car_x, car_y, carWidth, carHeight);

    requestAnimationFrame(moveRoad);
}
