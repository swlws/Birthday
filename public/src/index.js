var backColor = '#d2e9ff';

var DOMUtil = {
	createCanvasELe:function(cansObj){
		var cans = document.getElementById(cansObj.id);
		if(!cans){
			var ele = document.createElement('canvas');
			ele.id = cansObj.id;
			ele.width = cansObj.width;
			ele.height = cansObj.height;
			ele.innerHTML = 'sorry,your browser don\'t support the canvas';
			document.body.appendChild(ele);
		}
	},
	winAttr:function(){
		return {
			height:window.innerHeight,
			width:window.innerWidth
		}		
	},
	getRandomColor:function(){
		return '#'+Math.floor(Math.random()*0xFFFFFF << 0).toString(16);
	}
}

var CanvasUtil = {
	//椭圆
	ellipse:function(ctx,x,y,width,height,clear){
		var k = (width/0.75)/2,
	    w = width/2,
	    h = height/2;
	  	ctx.beginPath();
	  	ctx.moveTo(x, y-h);
	 	ctx.bezierCurveTo(x+k, y-h, x+k, y+h, x, y+h);
	  	ctx.bezierCurveTo(x-k, y+h, x-k, y-h, x, y-h);
	  	ctx.closePath();			  	
	  	if(clear){
	  		ctx.fillStyle = backColor;
	  		ctx.fill();
	  	}else{
	  		ctx.strokeStyle = 'rgb(255,255,255)';
	  		ctx.stroke();
	  	}

	},		
	arc:function(ctx,x,y,radius,clear){
		ctx.beginPath();  			    
	    ctx.arc(x , y  , radius , 0 , Math.PI * 2 , true);  
	    ctx.closePath();   		    
	    if(clear){
	    	ctx.fillStyle = backColor;
	   		ctx.fill();
	    }else{
	    	var lg2 = ctx.createRadialGradient(x , y-radius , 5 , x , y , 40);  		 
	    	lg2.addColorStop(0.1 , "#fff");  		  
	    	lg2.addColorStop(0.8 , "gray");  			 
	    	ctx.fillStyle = lg2;  
	    	ctx.fill();  	
	    }
	},
	water:function(ctx,x,y,clear){
		if(clear){
			ctx.fillStyle = backColor;
		}else{
			var my_gradient=ctx.createRadialGradient(x,y+10,25,x,y-32,7);			
			my_gradient.addColorStop(0,backColor);
			my_gradient.addColorStop(0.2,"red");
			my_gradient.addColorStop(0.4,"green");
			my_gradient.addColorStop(0.6,"blue");
			my_gradient.addColorStop(0.8,"yellow");
			my_gradient.addColorStop(1,"white");
			ctx.fillStyle = my_gradient;
		}											
		ctx.fillRect(x - 50,y - 50,100,100);
	},
	clear:function(ctx,x,y,width,height){		
		ctx.fillStyle = backColor;
		ctx.fillRect(x,y,width,height);
	}
}

function Birthday(){}
Birthday.prototype.commitNotAlive = function(who){
	if(who == 'init'){
		this.drawBack();
	}else if(who == 'back'){
		this.drawAWater();				
	}else if(who == 'aWater'){
		this.drawWave();
	}else if(who == 'wave'){
		this.drawSomeBolls();
		this.typeWord('To:陈云峰 Surprise!!');
		this.showVideo();
	}
}

Birthday.prototype.init = function (){			
	this.nightCanvasAttr = DOMUtil.winAttr();			
	this.nightCanvasAttr.id = 'night';
	DOMUtil.createCanvasELe(this.nightCanvasAttr);	
	this.ctx = document.getElementById(this.nightCanvasAttr.id).getContext('2d');
	this.commitNotAlive('init');					
}
Birthday.prototype.destoryCanvas = function (){
	var canvasEle = document.getElementById(this.nightCanvasAttr.id);
	var parentEle = canvasEle.parentNode;
	parentEle.removeChild(canvasEle);			
}
Birthday.prototype.drawBack = function(){
	this.ctx.fillStyle = backColor;
	this.ctx.fillRect(0,0,this.nightCanvasAttr.width,this.nightCanvasAttr.height);	
	this.commitNotAlive('back');
}

Birthday.prototype.drawAWater = function(){			
    var ctx = this.ctx , that = this;		    
    var x = that.nightCanvasAttr.width / 2 , y = 40;
    var waterInterval =  setInterval(function(){		    								    
		CanvasUtil.water(ctx,x,y,true);			    										    			    
	    y += y * 0.05;				
	    CanvasUtil.water(ctx,x,y);		    
		if( y >= that.nightCanvasAttr.height / 2){
			CanvasUtil.water(ctx,x,y,true);	
			that.origin = {x:x,y:y+20};					    	
	    	clearInterval(waterInterval);				    	
	    	that.commitNotAlive('aWater');				    				    
	    }
    },100);		    
}

Birthday.prototype.drawWave = function(){	
	var that = this, base_x = 100 , base_y = 50 , increase = 0.5 , time = 500 , lineWidth = 1 , LWIncrease = 0.9;
	var origin = that.origin;
	var waveInterval = setInterval(function(){
		CanvasUtil.ellipse(that.ctx,origin.x,origin.y,base_x,base_y,true);				
		if(base_x >= 2 * origin.x){					
			clearInterval(waveInterval);
			that.commitNotAlive('wave');
		}
		base_x += base_x * increase;
		base_y += base_y * increase;
		that.ctx.lineWidth += lineWidth * LWIncrease;
		CanvasUtil.ellipse(that.ctx,origin.x,origin.y,base_x,base_y);
	},time);
}

Birthday.prototype.drawSomeBolls = function(){
	var arr = [] , x = this.nightCanvasAttr.width , y = this.nightCanvasAttr.height , h = y / 2;
	var ctx = this.ctx;
	setInterval(function(){			
		CanvasUtil.clear(ctx,0,0,x,y);
		var arc = new Boll(ctx,x * Math.random() ,h++);
		arr.push(arc);
		for(var i=0;i<arr.length;i++){
			arr[i].drawSelf();
			arr[i].updatePos();
		};				
	},30)
}
Birthday.prototype.typeWord = function(str){
	$('#title').show();
	var index = 0;  		
	var typeInterval = setInterval(function(){
		if(index == str.length) {  	
			clearInterval(typeInterval);
		}  
		document.getElementById("title").innerHTML = str.substring(0, index++) + "_";
	}, 300);
}
Birthday.prototype.showVideo = function(){
	$('#video').show();
	myVideo.play();
}


function Boll(ctx,x,y){
	this.ctx = ctx;
	this.x = x;
	this.y = y;
	this.color = "#"+Math.floor(Math.random()*16777215).toString(16);
	this.radius = Math.floor(Math.random()*10);
	this.speedY = -4;
	this.speedX = Math.random()*4-2;			
	this.gra = 0.05;
}
Boll.prototype.drawSelf = function(){
	this.ctx.beginPath();
	this.ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,true);
	this.ctx.closePath();
	this.ctx.fillStyle = this.color;
	this.ctx.fill();
}
Boll.prototype.updatePos = function(){
	this.x += this.speedX;
	this.y += this.speedY;			
	this.speedY +=this.gra;			
	if(this.y >= window.innerHeight){
		this.speedY = Math.random()*4-4;
	}
}