precision mediump float;
//vec3 verdejpupper(){return vec3(0.0,1.0,0.8);}

// we need the sketch resolution to perform some calculations
uniform vec2 resolution ;
uniform float time ;
uniform vec2 mouse ;
uniform sampler2D feedback ;



varying vec2 vTexCoord ;

#define iTime time
#define iResolution resolution

#define PI 3.14159265359
#define TWO_PI 6.28318530718

#define OCTAVES 8
#define pi 3.14159265359

uniform float r1 ;
uniform float g1 ;
uniform float b1 ;

uniform float r2 ;
uniform float g2 ;
uniform float b2 ;

uniform float r3 ;
uniform float g3 ;
uniform float b3 ;

uniform float r4 ;
uniform float g4 ;
uniform float b4 ;

float mapr(float _value,float _low2,float _high2) {
	float val = _low2 + (_high2 - _low2) * (_value - 0.) / (1.0 - 0.);
    //float val = 0.1;
	return val;
}

void main(void){   
    
 
    vec2 uv = gl_FragCoord.xy/resolution.xy;
         uv = vTexCoord;
	
	vec3 c1 = vec3(r1,g1,b1);
	vec3 c2 = vec3(r2,g2,b2);
	
	
	vec3 c3 = vec3(r3,g3,b3);
	vec3 c4 = vec3(r4,g4,b4);

	vec3 fin = mix(c1,c2,uv.x);
	vec3 fin2 = mix(c3,c4,uv.y);
	
	vec3 fin3 = mix(fin,fin2,0.5);
    gl_FragColor = vec4(fin3,1.0);
}