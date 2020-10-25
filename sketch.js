//Create variables here
var dog, dogImg,dogHappy;
var database;
var foodStock,foodS;
var feed,addFood,lastFed,fedTime;
var foodObj;
var bedroomImg,washroomImg,gardenImg;
var changeState,readState,gameState;
function preload()
{
  dogImg = loadImage("images/dogImg.png");
  dogHappy = loadImage("images/dogImg1.png");
  bedroomImg = loadImage("images/Bed Room.png");
  washroomImg = loadImage("images/Wash Room.png");
  gardenImg = loadImage("images/Garden.png");

	//load images here
}

function setup() {
  database = firebase.database();
  createCanvas(500, 500);
  
  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);
  
  dog = createSprite(250,375,40,40);
  dog.addImage(dogImg);
  dog.scale = 0.25;
  
  textSize(20);

  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
}


function draw() {  
  background(0,153,51);

  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  readState = database.ref('gameState');
  readState.on("value",function(data){
  gameState = data.val();
  });
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }
  drawSprites();
  fill(255,255,254);
  stroke("black");
  text("Food remaining : "+foodS,170,200);
  
  if(gameState!= "Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
    feed.show();
    addFood.show();
    dog.addImage(DogImg);
  }

currentTime=hour();
if(currentTime ==(lastFed+1)){
  update("playing");
  foodObj.garden();

}else if (currentTime==(lastFed+2)){
  update("sleeping");
  foodObj.bedroom();
}else if (currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
  update("bathing");
  foodObj.washroom();
}else{
  update("hungry");
  foodObj.display();
}




  function update(state){
    database.ref('/').update({
      gameState:state
    });
  }

}
function readStock(data){
foodS = data.val();
foodObj.updateFoodStock(foodS);
}
function writeStock(x){

  if(x<=0){
    x=0;
  }else{
    x=x-1;
  } 
database.ref('/').update({
  Food:x
})
}


function feedDog(){
  dog.addImage(dogHappy);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}