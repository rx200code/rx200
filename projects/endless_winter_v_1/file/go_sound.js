//содержит звуки, музыки игры.
/*############## СОКРАЩЕНИЯ ###############

############################################*/
var go_sound = null;

function Sound(){
	this.audio_tag = new Audio();//'music/From_Russia_With_Love.mp3');
	this.audio_tag.volume = 0.1;
	this.audio_tag.autoplay = true;
	
	this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	
	//this.channels = 2;
	//this.frameCount = this.audioCtx.sampleRate * 2.0;
	//this.myArrayBuffer = this.audioCtx.createBuffer(this.channels, this.frameCount, this.audioCtx.sampleRate);
	
	//this.audio = this.audioCtx.createMediaElementSource(this.audio_tag);
	this.gainNode = this.audioCtx.createGain();
	//this.gainNode.gain.value = 1;
	//this.audio.connect(this.gainNode);
	//this.gainNode.connect(this.audioCtx.destination);
	
	
}
//go_sound = new Sound();//перенесено в Manager_setting.js