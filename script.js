const canvas = document.getElementById("canvas");
canvas.width = innerWidth;
canvas.height = innerHeight;    
const area = canvas.getContext("2d");
const x_position = 400;
let y_position = 0;
let road_speed = 3;
const carWidth = 180;
const carHeight = 200;
let initial_x = (canvas.width/2 - carWidth/2) - 16;
let lanes = [initial_x-123,initial_x , initial_x+117, initial_x+240];
let car_x = initial_x;
let car_y = (canvas.height - carHeight);
const fixed_y = car_y;
let last_time = 0;
let delay = 3000;
let other_cars = [];
let highscore = 0;
const initial_time = Date.now();
let other_cars_speed = 2;
let prev_score = 0;

const road_img = new Image();
road_img.src = "./Images/road-image.png";
const car_img = new Image();
car_img.src = "./Images/Car.png";


road_img.onload = function () {
    car_img.onload = function () {
        moveRoad();
    };
};

function moveRoad() {
    area.clearRect(0, 0, canvas.width, canvas.height);
    
    area.drawImage(road_img, x_position, y_position, 800, 1500);
    area.drawImage(road_img, x_position, y_position - 1500, 800, 1500);

    let time_seconds = (Date.now() - initial_time) / 1000;
    let score = Math.floor(road_speed * time_seconds);

    if(score % 100 == 0 && score != prev_score){
        road_speed += 1;
        other_cars_speed += 1;
        prev_score = score;
    }
 
    area.font = "30px Arial";
    area.fillStyle = "black";
    area.fillText("Score", 410, 50);
    area.fillText(score, 430, 80);

    y_position = y_position + road_speed;
    
    if (y_position >= 1500) y_position = 0;
    
    area.drawImage(car_img, car_x, car_y, carWidth, carHeight);

    let current_time = Date.now();

    if (current_time - last_time > delay) {

        generateRandom();

        last_time = current_time;
    }

    for(let i = 0; i < other_cars.length; i++){

        other_cars[i].y += 2;

        area.drawImage(car_img, other_cars[i].x, other_cars[i].y, carWidth, carHeight);

        if(other_cars[i].y > canvas.height){
            other_cars.splice(i, 1);
        }

    }

    requestAnimationFrame(moveRoad);
}

function generateRandom(){
    
    let random_index = Math.floor(Math.random() * lanes.length);
    other_cars.push({
        x: lanes[random_index],
        y: 0
    });
}


document.addEventListener("keydown" , (event) => {

        if(event.key === "ArrowLeft" || event.key === 'a'){

            if(car_x-20 > 485){
            car_x -= 20
            }
        }
        else if(event.key === "ArrowRight" || event.key == 'd'){
            if(car_x + 20 < 920){
            car_x += 20;  
            }
        }

        else if(event.key === "ArrowUp" || event.key === 'w'){
            if(car_y - 20 > 0){
                car_y -= 20;
            }
        }
        else if(event.key === "ArrowDown" || event.key === 's'){
            if(car_y + 20  < fixed_y){
                car_y += 20;
            }
        }
});

// document.addEventListener("mousemove" , (event) => {
//     console.log(event.pageX , event.pageY);
// })
