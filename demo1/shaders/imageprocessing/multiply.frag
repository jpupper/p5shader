precision mediump float ;

uniform vec2 resolution ;
uniform float time ;
uniform vec2 mouse ;

varying vec2 vTexCoord;

#define iTime time
#define iResolution resolution
#define pi 3.14159265359


//#pragma include "../common.frag" //ESta linea tiene todas las definiciones de las funciones globales

uniform sampler2D tx ;
uniform float v1 ;
uniform float v2 ;
uniform float v3 ;
void main()
{	
	vec2 uv = gl_FragCoord.xy / resolution;	
	     uv = vTexCoord;
	vec3 c=texture2D(tx,vec2(uv.x,1.-uv.y)).rgb;

	c.r = c.r*v1;
	c.g = c.g*v2;
	c.b = c.b*v3;

	gl_FragColor = vec4(c,1.0); 
}