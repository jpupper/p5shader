precision mediump float;
//vec3 verdejpupper(){return vec3(0.0,1.0,0.8);}

// we need the sketch resolution to perform some calculations
uniform vec2 resolution ;
uniform float time ;
uniform vec2 mouse ;
uniform sampler2D feedback ;

#define iTime time
#define iResolution resolution
#define PI 3.14159265359
#define pi PI
#define OCTAVES 8


uniform float s ;
uniform float d ; 

void main(void){   
    vec2 uv = gl_FragCoord.xy / resolution;
	
	float fx = resolution.x/resolution.y;
	uv.x*=fx;
	vec2 p = vec2(mouse.x*fx,1.-mouse.y)-uv;
	float r = length(p);


	float e = 1.-smoothstep(s,s+d,r);
	//vec3 fin = vec3(r,g,b);
	
	gl_FragColor = vec4(e,e,e,1.0); 
}
