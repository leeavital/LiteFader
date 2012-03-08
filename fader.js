/**
 * Slider.constructor
 * @param args: A javascript object with constructor flags as follows
 *		container:  an HTML element that will be the faders container 
 *		framename: 	a string that is the class name of each of the frames.
 *		framerate:	the framerate of the animations we will use.
 *		milliseconds: the number of milliseconds in which to do the animation.
 *		repositioncontainer: this plugin will set the position of the container to relative, if you need it to be absolute or fixed, pass false here.
 *		zmax: the zindex of the visible slide. The invisible slides will be one less.
 */
function Fader(args){
	
	// instance variables
	this.container;
	this.framerate;
	this.framename;
	this.frames;
	this.numframes = 0;
	this.currentframe = 0;
	this.frameheight = 0;
	this.framewidth = 0;
	this.zmax = 0;
	this.repositioncontainer = true;
	
	
	if(!("container" in args)){
		console.error("there was no container found in args");
	}
	this.container = args.container;
	
	// if args has a framename, put it into the object, else use literal "frame"
	this.framename = ("framename" in args) ? args.framename : "frame";

	// same for framerate.
	this.framerate = ("framerate" in args) ? args.framerate : 30; 	// we'll use 30 fps as the default.
	this.milliseconds = ("milliseconds" in args)  ? args.milliseconds   : 1000;   // we'll use a default animation time of 1 second.
	this.repositioncontainer = ("repositioncontainer" in args) ? args.repositioncontainer : true  // by default, we have to reposition the container. 


	// init a list of frames.
	this.frames = [];
	
	
	// now get the frames list and calculate the frames.
	this.calcFrames();

	// now initialize the styles.
	this.initStyles();
	
}


/**
 * Fader.calcFrames
 * Calculates the number of frames found inside the container. By frame, we 
 * mean immediate children where the classlist includes framename.
 */
Fader.prototype.calcFrames = function(){
	var children = this.container.children;
	var framename = this.framename;
	for(var i = 0; i < children.length; i++){
		var child = children[i];
		if(child.nodeType == 1 && child.classList.contains(framename)){
			this.frames.push(child)
		}
	
	}
	this.numframes = this.frames.length;
}


/**
 * Fader.initStyles
 * initializes the necessary styles for the Slider. The container element is 
 * given relative positioning and the slides are given absolute positioning. 
 * We also set the frames opacity and z-indecies to 1 or 0 depending on which 
 * slide we want to show (0 by default)
 */
Fader.prototype.initStyles = function(){
	this.framewidth = this.frames[0].offsetWidth;
	this.frameheight = this.frames[0].offsetHeight;

	this.container.style.overflow = "hidden";

	// we will only reposition the container if we are told to (although the default
	// is to do the repositioning). This could come in handy if the designer wants
	// the container positioned a bsolutely or fixed.
	if(this.repositioncontainer) { this.container.style.position = "relative"; }   
	this.container.style.width = this.framewidth + "px";
	this.container.style.height = this.frameheight + "px";
	
	for(var i = 0; i < this.frames.length; i++){
		frame = this.frames[i];
		
		frame.style.position = "absolute";
		frame.style.top = 0;
		frame.style.left = 0;
		frame.style.opacity =  (i == this.currentframe) ? 1  : 0;
		frame.style.zIndex = (i == this.currentframe)   ? this.zmax : this.zmax - 1
		frame.style.overflow = "hidden";
	}
}


/** 
 * Fader.animationClosure
 * @param frame: the frame whose opacity we will be setting (HTMLElement)
 * @param o: the opacity value that we will give the frame. (float)
 * @return a function reference to an anonymous function that will give the given
 * element the given opacity. Used with setTimout for animations.
 */
Fader.prototype.animationclosure = function(frame, o){
	return (function(){
		frame.style.opacity = o;
	});
	
}

/**
 * Fader.zclosure
 * @param e: the element we will style
 * @param z: the zindex we will give to the elemtn.
 * @return a reference funciton that will sets e's zindex to z.
 * useful for animation with settimeout
 */
Fader.prototype.zclosure = function(e, z){
	return (function(){
		e.style.zIndex = z;
	});

}


/**
 * Fader.showFrame
 * @param n: the index of the frame to show. 
 * Shows frame number n.
 */
Fader.prototype.showFrame = function(n){
	
	var frame = this.frames[n]; 
	zclosure = this.zclosure(frame, this.zmax);
	setTimeout(zclosure, this.milliseconds);
	
	for(var i = 0; i < this.framerate; i++){
		var oValue = (i) / this.framerate;
		var tOffset = i * (this.milliseconds / this.framerate);
		var closure = this.animationclosure(frame, oValue);
		setTimeout(closure, tOffset);
		
	}
}


Fader.prototype.hideFrame = function(n){
	
	var frame = this.frames[n]; 
	
	
	zclosure = this.zclosure(frame, this.zmax -1);
	setTimeout(zclosure, this.milliseconds);
	for(var i = this.framerate; i > 0; i--){
		var oValue = 1 - ((i) / this.framerate);
		var tOffset = i * (this.milliseconds / this.framerate);
		var closure = this.animationclosure(frame, oValue);
		setTimeout(closure, tOffset);
		
	}
}


Fader.prototype.next = function(){
	var curFrame = this.currentframe;
	var nextFrame = (this.currentframe + 1) % this.numframes;
	console.log("hiding: " + curFrame + " and showing: " + nextFrame);

	// preform this assignment early so animations can overlap
	this.currentframe = nextFrame;
	this.showFrame(nextFrame);
	this.hideFrame(curFrame)
}

Fader.prototype.previous = function(){
	var curFrame = this.currentframe;
	var previousFrame = (curFrame == 0) ? this.numframes - 1 : (this.currentframe - 1) % this.numframes;
	console.log("hiding: " + curFrame + " and showing: " + previousFrame);
	
	// preform this assignment early so animations can overlap
	this.currentframe = previousFrame;
	this.showFrame(previousFrame);
	this.hideFrame(curFrame)
}





