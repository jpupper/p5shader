precision mediump float;
//vec3 verdejpupper(){return vec3(0.0,1.0,0.8);}

// we need the sketch resolution to perform some calculations

//ooX8sTpEAtLsgv4EjnXrnwUK6ge8ERtxPe1dBsN3XhBkSHxcqbC

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

uniform float f1 ;
uniform float f2 ;
uniform float f3 ;



float mapr(float _value,float _low2,float _high2) {
	float val = _low2 + (_high2 - _low2) * (_value - 0.) / (1.0 - 0.);
    //float val = 0.1;
	return val;
}

void main(void){   
    
    vec2 uv = gl_FragCoord.xy/resolution.xy;
    uv = vTexCoord;
	
   
    
    
    float mf1 = mapr(f1,1.0,20.0);
	
    float mf2 = mapr(f2,1.0,20.0);
	
    float mf3 = mapr(f3,1.0,20.0);
    
    float r=  step(sin(distance(vec2(0.8),uv)*PI*3.+time+sin(uv.x*PI*mf1)+cos(uv.y*PI*5.)),0.1)*0.7;
	
    float g = step(cos(distance(vec2(0.5),uv)*PI*3.+time+sin(uv.x*PI*mf2)+cos(uv.y*PI*15.)),0.1)*0.7;
	
    float b = cos(distance(vec2(.2),uv)*PI*3.+time+sin(uv.x*PI*mf3)+cos(uv.y*PI*5.))*1500.+65.;
    gl_FragColor = vec4(r,g,b,1.0);
}