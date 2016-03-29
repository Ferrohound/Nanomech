//loop power
(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();


var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),

    player = new Queen('violet'),
	keys = [],
	bugs = [],
	friction = 0.9,
	gravity = -0.6;

	
canvas.width = window.innerWidth - 23;
canvas.height = window.innerHeight - 23;	

//bugs.push(player);
//alert(bugs.length);
var spawner;

//it never stops crawling
//make audio array for main themes, menu themes, bug noises
var main_theme = new Audio('assets/audio/crawling.mp3');
main_theme.loop = true;
main_theme.play();

//mute cooldown and counter
m_cooldown = 1;
m_counter = m_cooldown;

//function to spawn queen
function Queen(colour,swarm){
	this.health = 10;
	this.width = 30;
	this.height = 30;
	this.x = (window.innerWidth-5)/2;
	this.y = (window.innerHeight-5)/2;
	this.speed = 3;
	this.velX = 0;
	this.velY = 0;
	this.colour = colour||'red';
	this.swarm_colour = swarm || 'black';
	
	this.draw = function(){
		ctx.fillStyle = this.colour;
		ctx.fill();
		ctx.fillRect(this.x-(this.width/2), this.y-(this.height/2), this.width, this.height);
	};
}


//function to spawn new nanomachines
function Bug(selected, colour, queen){
	var sfx = new Audio('assets/audio/Jump18.wav');
	sfx.play();
	this.health = 5;
	this.width = 20;
	this.height = 20;
	//random starting position
	this.x = Math.floor(Math.random()*window.innerWidth) + 1;
	this.y = Math.floor(Math.random()*window.innerHeight) +1;
	this.speed = 2;
	this.velX = 0;
	this.velY = 0;
	this.selected = selected || false;
	this.colour = colour||'black';
	this.target = queen;
	
	this.click = function(){
		//alert(0);
		if(this.selected){
			this.selected = !this.selected;
			this.colour = 'black';
		}
		else{
			this.selected = !this.selected;
			this.colour = 'red';
		}
		return 0;
	};
	
	this.select = function(){
		this.colour = 'red';
		this.selected = true;
	};
	
	this.deselect = function(){
		this.colour = 'black';
		this.selected = false;
	};
	
	this.idle = function(){
		
	};
	
	this.attack = function(target){
		
	};
	
	this.move = function(){
		
		if(Math.abs(this.x-this.target.x)<this.width&&
			Math.abs(this.y - this.target.y)<this.width){
			this.idle();
		}
		else{
			if(this.x<this.target.x){
				this.x+=this.speed;
			}
			else if(this.x>this.target.x){
				this.x-=this.speed;
			}
		
			if(this.y<this.target.y){
				this.y+=this.speed;
			}
			else if(this.y>this.target.y){
				this.y-=this.speed;
			}
		}
	};
	
	this.draw = function(){
		ctx.fillStyle = this.colour;
		ctx.fill();
		ctx.fillRect(this.x-(this.width/2), this.y-(this.height/2), this.width, this.height);	
	};
}



//main_menu loop
var test=0;
function main_menu(){
	//if certain button is pressed, go to actual game
	if(test>10){
		update();
	}
	test+=0.1;
	requestAnimationFrame(main_menu);
}
	
//game update function
function update(){
	
	ctx.clearRect(0,0,canvas.width,canvas.height);
	
	//mute cooldown
	if(m_counter<m_cooldown){
		m_counter += 0.05;
	}
	
	//w
	if(keys[87]){
		if(player.velY > -player.speed){
			player.velY--;
		}
	}
	
	//s
	if(keys[83]){
		if(player.velY<player.speed){
			player.velY++;
		}
	}
	
	if (keys[39]||keys[68]) {
       // right arrow
       if (player.velX < player.speed) {                         
           player.velX++;                  
       }          
   }          
   if (keys[37]||keys[65]) {                 
        // left arrow                  
       if (player.velX > -player.speed) {
           player.velX--;
       }
	}
	
	if (keys[32] && bugs.length<12){
		spawner = new Bug(false,player.swarm_colour, player);
		bugs.push(spawner);
	}
	
	
	//m for mute
	if (keys[77]){
		if(m_counter>=m_cooldown){
			main_theme.muted = !main_theme.muted;
			m_counter = 0;
		}
	}
	
	player.velX*=friction;
	player.velY*=friction;
	
	player.x += player.velX;
	player.y += player.velY;
	
	if (player.x >= canvas.width-player.width) {
		player.x = canvas.width-player.width;
	} 
	else if (player.x <= 0) {
		player.x = 0;
	}
	
	if(player.y >= canvas.height-player.height){
		player.y = canvas.height - player.height;
	}
	else if (player.y<=0){
		player.y = 0;
	}
	
	for(var i=0; i<bugs.length;i++){
		for(var j = i+1; j<bugs.length;j++){
			colCheck(bugs[j], bugs[i]);
		}
	}
	
	for(var i=bugs.length-1; i>-1;i--){
		bugs[i].move();
		colCheck(player, bugs[i]);
		bugs[i].draw();
	}
	
	player.draw();
	
	requestAnimationFrame(update);
}

//returns true if target gets clicked
function click_check(M_pos, target){
	if(M_pos.x>=target.x &&
			M_pos.x<=target.x+target.width &&
			M_pos.y>=target.y &&
			M_pos.y<=target.y+target.height){
				return true;
			}
	else{
		return false;
	}
}


//for select and desleting bugs
function clicked(M_pos){
	if(click_check(M_pos,player)){		
		for(var i=0; i<bugs.length; i++){
			bugs[i].select();
		}
		return;
	}	
	
	var counter = 0;
	for(var i=0; i<bugs.length;i++){
		if(click_check(M_pos, bugs[i])){
				bugs[i].click();
				counter+=1;
		}
	}
	if(counter === 0){
		for(var i=0; i<bugs.length; i++){
			bugs[i].deselect();
		}
		return;
	}
}

function attack(bug_1, bug_2){
	
	
	
}

//self explanatory, see what key's down
document.body.addEventListener("keydown", function(e) {
    keys[e.keyCode] = true;
});
 
//set the key to false when it's up/released
document.body.addEventListener("keyup", function(e) {
    keys[e.keyCode] = false;
});

document.body.addEventListener("click", function(e){
	mouse_pos = {
		x: e.clientX,
		y: e.clientY
	};
	clicked(mouse_pos);
});

document.body.addEventListener("contextmenu", function(e){
	e.preventDefault();
	mouse_pos = {
		x: e.clientX,
		y: e.clientY
	};
	var tmp = 'null';
	//if the bug is selected, make the new target that spot
	//check to see if the selected thing is a bug
	
	if(click_check(mouse_pos, player)){
		tmp = player;
	}
	for(var i=0; i<bugs.length; i++){
		if(click_check(mouse_pos, bugs[i])){
			tmp = bugs[i];
			break;
		}
	}
	
	for(var i=0; i<bugs.length;i++){
		if(bugs[i].selected){
			if(tmp === 'null'){
				bugs[i].target = mouse_pos;
			}
			else{
				bugs[i].target = tmp;
			}
		}
	}
});

//to start the update loop
window.addEventListener("load", function(){
  update();
});

//collision detection
function colCheck(alpha, beta){
	var vX = ((alpha.x-(alpha.width/2)) + (alpha.width/2)) - ((beta.x-(beta.width/2)) + (beta.width/2)),
		vY = ((alpha.y-(alpha.width/2)) + (alpha.width/2)) - ((beta.y-(beta.width/2)) + (beta.width/2)),
		totalW = (alpha.width/2) + (beta.width/2),
		totalH = (alpha.height/2) + (beta.width/2);
		
	if(Math.abs(vX) < totalW && Math.abs(vY) < totalH){
		var oX = totalW - (Math.abs(vX)),
			oY = totalH - (Math.abs(vY));
		
		if(oX>oY){
			if(vY>0){
				//top collision
				alpha.y+=(oY/2);
				beta.y-=(oY/4);
			}
			else{
				alpha.y -=(oY/2);
				beta.y += (oY/4);
			}
		}
		else{
			if(vX>0){
				//left collision
				alpha.x +=(oX/2);
				beta.x -= (oX/4);
			}
			else{
				//right collision
				alpha.x -=(oX/2);
				beta.x += (oX/4);
			}
		}
		
	}
	
}
