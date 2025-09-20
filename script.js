const canvas = document.getElementById("canvas");
canvas.width = 800;
canvas.height = 750;
const area = canvas.getContext("2d");
let highscore = 0;
let new_record = false;

function init() {

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
    const road_img = new Image();
    road_img.src = "./Images/road-image.png";
    const car_img = new Image();
    car_img.src = "./Images/Car.png";
    const power_up1 = new Image();
    power_up1.src = "./Images/power_up1.png";
    let y_position = 0;
    let initial_time = Date.now();
    let other_cars_speed = 2;
    // let carssources = ["./Images/Greenish_Car.png", "./Images/Pink_Car.png"];
    // , "./Images/Yelloe_Car.png", "./Images/Red_Car.png"
    let collided = false;
    let invisible = false;
    let power_up_time = 0;
    let power_up_delay = 5000;
    let power_up = [];

    road_img.onload = function () {
        car_img.onload = function () {
            power_up1.onload = function () {
                moveRoad();
            }
        };

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

        if (!power_up) {

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
                collided = true;
                break;
            }
        }
    }

    area.fillStyle = "black";
    area.font = "30px Arial";
    area.textAlign = "left";
    area.fillText("Score: " + score, 0, 50);

    y_position += road_speed;
    if (y_position >= canvas.height) y_position = 0;

    area.drawImage(car_img, car_x, car_y, carWidth, carHeight);

    let current_time = Date.now();
    if (current_time - last_time > delay) {
        generateCar();
        last_time = current_time;
    }
    if (current_time - power_up_time > power_up_delay) {
        generatePowerUp();
        power_up_time = current_time;
    }


    for (let i = other_cars.length - 1; i >= 0; i--) {
        other_cars[i].y += other_cars_speed;
        area.drawImage(car_img, other_cars[i].x, other_cars[i].y, carWidth, carHeight);

        if (other_cars[i].y > canvas.height) {
            other_cars.splice(i, 1);
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
        car_x = 150;
        car_y = 600;
        other_cars = [];
        y_position = 0;
        road_speed = 3;
        other_cars_speed = 2;
        prev_score = 0;
        collided = false;
        initial_time = Date.now();

        moveRoad();
    }
});

}


area.fillStyle = "rgba(0,0,0,0.9)";
area.fillRect(0, 0, canvas.width, canvas.height);

area.fillStyle = "White";
area.font = "50px Arial";
area.textAlign = "center";
area.fillText("Press T to start the game", canvas.width / 2, canvas.height / 2 - 20);

document.addEventListener("keydown", (event) => {
    if (event.key === "T" || event.key === "t") init();
})