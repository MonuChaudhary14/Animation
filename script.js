const canvas = document.getElementById("canvas");
canvas.width = 800;
canvas.height = 750;
const area = canvas.getContext("2d");
let highscore = 0;
let new_record = false;
const carWidth = 135;
const carHeight = 150;
let lanes = [150, 200, 280, 400, 520];
let delay = 3000;
const power_up_width = 100;
const power_up_height = 100;
let road_speed = 3;
let car_x;
let car_y;
let other_cars = [];
let prev_score;
let y_position = 0;
let initial_time = Date.now();
let collided = false;
let power_up = [];
let power_up_time = 0;
let other_cars_speed;

function init() {
    const road_img = new Image();
    road_img.src = "./Images/road-image.png";
    const car_img = new Image();
    car_img.src = "./Images/Car.png";
    const power_up1 = new Image();
    power_up1.src = "./Images/power_up1.png";
    const Yellow_Car = new Image();
    Yellow_Car.src = "./Images/Yellow_Car.png";

    road_speed = 3;
    car_x = 150;
    car_y = 600;
    let last_time = 0;
    other_cars = [];
    prev_score = 0;
    y_position = 0;
    initial_time = Date.now();
    other_cars_speed = 2;
    // let carssources = ["./Images/Greenish_Car.png", "./Images/Pink_Car.png"];
    // , "./Images/Yelloe_Car.png", "./Images/Red_Car.png"
    collided = false;
    let invisible = false;
    power_up_time = 0;
    power_up = [];


    road_img.onload = function () {
        car_img.onload = function () {
            power_up1.onload = function () {
                Yellow_Car.onload = function () {
                    moveRoad();
                };
            }
        };
    }


    function moveRoad() {
        area.clearRect(0, 0, canvas.width, canvas.height);

        area.drawImage(road_img, 0, y_position, canvas.width, canvas.height);
        area.drawImage(road_img, 0, y_position - canvas.height, canvas.width, canvas.height);

        let time_seconds = (Date.now() - initial_time) / 1000; 
        let score = Math.floor(road_speed * time_seconds); 

        if (score != 0 && score % 100 === 0 && score !== prev_score && road_speed < 10 && other_cars_speed < 6) {
            road_speed += 1;
            other_cars_speed += 1;
            prev_score = score;
        }


        if (!invisible) {

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
                let collision_distance = Math.sqrt((half_width * half_width) + (half_height * half_height)) - 45;

                if (distance < collision_distance) {
                    collided = true;
                    break;
                }
            }
        }

        for (let i = 0; i < power_up.length; i++) {
            let car1_center_x = car_x + carWidth / 2;
            let car1_center_y = car_y + carHeight / 2;
            let powerup_center_x = power_up[i].x + power_up_width / 2;
            let powerup_center_y = power_up[i].y + power_up_height / 2;

            let x = car1_center_x - powerup_center_x;
            let y = car1_center_y - powerup_center_y;
            let distance = Math.sqrt(x * x + y * y);

            let half_width = carWidth / 2;
            let half_height = carHeight / 2;
            let collision_distance = Math.sqrt((half_width * half_width) + (half_height * half_height)) - 45;

            if (distance < collision_distance) {
                invisible = true;
                power_up.splice(i, 1);
                power_up_time = Date.now();
                break;
            }
        }

        if (invisible && (Date.now() - power_up_time > 5000)) {
            invisible = false;
        }

        area.fillStyle = "black";
        area.font = "30px Arial";
        area.textAlign = "left";
        area.fillText("Score: ", 0, 50);
        area.fillText(score, 10, 80);
        area.fillText("High Score:", 650, 50);
        area.fillText(highscore, 660, 80);

        y_position += road_speed;
        if (y_position >= canvas.height) y_position = 0;

        area.drawImage(car_img, car_x, car_y, carWidth, carHeight);

        let current_time = Date.now();
        if(score %  300 == 0 && score != prev_score && score !==0 && delay>800){
            delay -= 200;
        }
        if (current_time - last_time > delay) {
            generateCar();
            last_time = current_time;
        }
        if (score % 75 === 0 && score !== prev_score) {
            generatePowerUp();
            prev_score = score;
        }

        for (let i = 0; i < other_cars.length; i++) {
            other_cars[i].y += other_cars_speed;
            area.drawImage(Yellow_Car, other_cars[i].x, other_cars[i].y, carWidth, carHeight);

            if (other_cars[i].y > canvas.height) {
                other_cars.splice(i, 1);
            }
        }

        for (let i = 0; i < power_up.length; i++) {

            power_up[i].y += other_cars_speed;
            area.drawImage(power_up1, power_up[i].x, power_up[i].y, power_up_width, power_up_height);

            if (power_up[i].y > canvas.height) {
                power_up.splice(i, 1);
            }

        }

        if (!collided)
            requestAnimationFrame(moveRoad);

        else {

            area.fillStyle = "rgba(0,0,0,0.9)";
            area.fillRect(0, 0, canvas.width, canvas.height);

            area.fillStyle = "red";
            area.font = "60px Arial";
            area.textAlign = "center";
            area.fillText("GAME OVER!", canvas.width / 2, canvas.height / 2 - 20);

            area.fillStyle = "White";
            area.font = "20px Arial";
            area.fillText("Score " + score, canvas.width / 2, canvas.height / 2 + 30);


            area.fillText("Press R to Restart", canvas.width / 2, canvas.height / 2 + 60);


            if (score > highscore) {
                area.font = "40px Arial";
                area.fillText("New Record", canvas.width / 2, canvas.height / 2 - 150);
                highscore = score;
            }

            return;

        }
    }

    function generateCar() {
        let random_index = Math.floor(Math.random() * lanes.length);

        other_cars.push({
            x: lanes[random_index],
            y: 0,
            // index : random_index
        });
    }

    function generatePowerUp() {
        let random_index = Math.floor(Math.random() * lanes.length);

        power_up.push({
            x: lanes[random_index],
            y: 0,
        });
    }
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === 'a') {
        if (car_x - 20 >= 120) car_x -= 20;
    }
    else if (event.key === "ArrowRight" || event.key === 'd') {
        if (car_x + carWidth + 20 <= 680) car_x += 20;
    }
    else if (event.key === "ArrowUp" || event.key === 'w') {
        if (car_y - 20 >= 0) car_y -= 20;
    }
    else if (event.key === "ArrowDown" || event.key === 's') {
        if (car_y + carHeight + 20 <= 730) car_y += 20;
    }
    else if (event.key === 'R' || event.key === 'r') {

        road_speed = 3;
        car_x = 150;
        car_y = 600;
        other_cars = [];
        prev_score = 0;
        y_position = 0;
        initial_time = Date.now();
        collided = false;
        power_up = [];
        power_up_time = 0;
        other_cars_speed = 2;

        init();
    }
});



area.fillStyle = "rgba(0,0,0,0.9)";
area.fillRect(0, 0, canvas.width, canvas.height);

area.fillStyle = "White";
area.font = "50px Arial";
area.textAlign = "center";
area.fillText("Press T to start the game", canvas.width / 2, canvas.height / 2 - 20);

document.addEventListener("keydown", (event) => {
    if (event.key === "T" || event.key === "t") init();
})