var dogImg, happyDogImg, database, foodS, foodStock,dog,happyDog,feed,addFood,foodObj,fedTime,lastFed;
var bedroom, garden,washroom,changinggameState,readinggameState,sadDog;

function preload()
{
   deadDog_img = loadImage("deadDog.png");
   DogVacc_img = loadImage("dogVaccination.png");
   foodStock_img = loadImage("Food Stock.png");
   injection_img = loadImage("Injection.png");
   running_img = loadImage("running.png");
   runningL_img = loadImage("runningLeft.png");
   Vacc_img = loadImage("Vaccination.jpg");   
   dogImg= loadImage("dog.png");
   happyDogImg = loadImage("Happy.png");
   bedroom_img = loadImage("Bed Room.png");
   garden_img = loadImage("Garden.png");
   washroom_img = loadImage("Wash Room.png");
   sadDog_img = loadImage("Lazy.png");
}

function setup() {
  	createCanvas(900, 900);
    database = firebase.database();

    readState = database.ref('gameState');
    readState.on("value",function(data){
     gameState = data.val();
    });

    fedTime = database.ref('FeedTime');
    fedTime.on("value",function(data){
      lastFed = data.val();
    });

    foodObj = new Food();

  dog = createSprite(380,400,150,150);
  dog.addImage(sadDog_img);
  dog.scale = 0.5;

   foodStock = database.ref('Food');
   foodStock.on("value",readStock,showerror);

   feed = createButton("Feed the Dog");
   feed.position(700,95);
   feed.mousePressed(feedDog);

   addFood = createButton("Add Food");
   addFood.position(800,95);
   addFood.mousePressed(addFoods);
}

function draw() {  
 
currentTime = hour();
if(currentTime === (lastFed+1)){
update("Playing");
foodObj.garden();
}else if(currentTime === (lastFed+2)){
update("Sleeping");
foodObj.bedroom();
}else if(currentTime>(lastFed+2) && currentTime <= (lastFed+4)){
  update("Bathing");
  foodObj.washroom();
}else{
    update("Hungry");
    foodObj.display();
  }

  if(gameState != "Hungry"){
      feed.hide();
      addFood.hide();
      dog.remove();
}
else{
  feed.show();
  addFood.show();
  dog.addImage(dogImg);
}

function update(state){
  database.ref('/').update({
    gameState: state
  });
  }
 
drawSprites();
  }

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function showerror(){
  console.log("error");
}

function feedDog(){
dog.addImage(happyDogImg);

foodObj.updateFoodStock(foodObj.getFoodStock()-1);
database.ref('/').update({
  Food:foodObj.getFoodStock(),
  FeedTime:hour(),
  gameState:"Hungry"
})
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
database.ref('/').update({
gameState:state
})
}