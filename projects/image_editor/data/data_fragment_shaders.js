var data_fragment_shaders = [
	{
		name:"normal",
		code:`precision mediump float;
uniform sampler2D u_image;
varying vec2 v_texCoord;
void main(){
	gl_FragColor = texture2D(u_image, v_texCoord);
}`
	},
	{
		name:"red",
		code:`precision mediump float;
uniform sampler2D u_image;
varying vec2 v_texCoord;
void main(){
	gl_FragColor = vec4(texture2D(u_image, v_texCoord).r, 0.0, 0.0, 1.0);
}`
	},
	{
		name:"green",
		code:`precision mediump float;
uniform sampler2D u_image;
varying vec2 v_texCoord;
void main(){
	gl_FragColor = vec4(0.0, texture2D(u_image, v_texCoord).g, 0.0, 1.0);
}`
	},
	{
		name:"blue",
		code:`precision mediump float;
uniform sampler2D u_image;
varying vec2 v_texCoord;
void main(){
	gl_FragColor = vec4(0.0, 0.0, texture2D(u_image, v_texCoord).b, 1.0);
}`
	},
	{
		name:"red all",
		code:`precision mediump float;
uniform sampler2D u_image;
varying vec2 v_texCoord;
void main(){
	gl_FragColor = vec4(texture2D(u_image, v_texCoord).rrr, 1.0);
}`
	},
	{
		name:"green all",
		code:`precision mediump float;
uniform sampler2D u_image;
varying vec2 v_texCoord;
void main(){
	gl_FragColor = vec4(texture2D(u_image, v_texCoord).ggg, 1.0);
}`
	},
	{
		name:"blue all",
		code:`precision mediump float;
uniform sampler2D u_image;
varying vec2 v_texCoord;
void main(){
	gl_FragColor = vec4(texture2D(u_image, v_texCoord).bbb, 1.0);
}`
	},
	{
		name:"negative",
		code:`precision mediump float;
uniform sampler2D u_image;
varying vec2 v_texCoord;
void main(){
	gl_FragColor = vec4(1.0 - texture2D(u_image, v_texCoord).r, 1.0 - texture2D(u_image, v_texCoord).g, 1.0 - texture2D(u_image, v_texCoord).b, 1.0);
}`
	},
	{
		name:"grayscale",
		code:`precision mediump float;
uniform sampler2D u_image;
varying vec2 v_texCoord;
void main(){
	float v1 = (texture2D(u_image, v_texCoord).r + texture2D(u_image, v_texCoord).g + texture2D(u_image, v_texCoord).b) / 3.0;
	gl_FragColor = vec4(v1, v1, v1, 1.0);
}`
	},
	{
		name:"black and white",
		code:`precision mediump float;
uniform sampler2D u_image;
varying vec2 v_texCoord;
void main(){
	float v1 = (texture2D(u_image, v_texCoord).r + texture2D(u_image, v_texCoord).g + texture2D(u_image, v_texCoord).b) / 3.0;
	if(v1 > 0.5)gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
	else gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}`
	}
];