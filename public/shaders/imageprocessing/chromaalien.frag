precision mediump float ;


uniform sampler2D feedback ;
uniform vec2 resolution ;
uniform float time ;
uniform vec2 mouse ;

varying vec2 vTexCoord;

#define iTime time
#define iResolution resolution
#define pi 3.14159265359


//#pragma include "../common.frag" //ESta linea tiene todas las definiciones de las funciones globales

uniform sampler2D tx ;

void main()
{	
	vec2 uv = gl_FragCoord.xy / resolution;	
	     uv = vTexCoord;
	vec2 puv = uv;


	puv.y-=0.07;
	vec4 c = texture2D(tx,vec2(uv.x,1.-uv.y));
	vec4 fb = texture2D(feedback,vec2(puv.x,1.-puv.y)).rgba;
	
	vec4 c1 = vec4(0.0,1.0,0.0,1.0);

	float limit = 0.8;

	float a = 1.0;
	vec2 p = vec2(0.5) - uv;
	float r = length(p);
	float vig = 1.-smoothstep(0.2,0.71,r);

	
	if(distance(c,c1) < limit){
		c.a = 0.0;
	}
	
	vec4 fin2 = c +vec4(vig*.4);

	fin2 = c;

		
	gl_FragColor = fin2; 
}