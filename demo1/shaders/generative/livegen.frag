precision mediump float;
//vec3 verdejpupper(){return vec3(0.0,1.0,0.8);}

// we need the sketch resolution to perform some calculations
uniform vec2 resolution ;
uniform float time ;
uniform vec2 mouse ;
uniform sampler2D feedback ;

varying vec2 vTexCoord ;

uniform float value1 ;

#define iTime time
#define iResolution resolution

#define PI 3.14159265359
#define TWO_PI 6.28318530718

#define OCTAVES 8
#define pi 3.14159265359


void main(void){   
    
     

    vec2 uv = gl_FragCoord.xy/resolution.xy;
         //uv = vTexCoord;
    

    float e = sin(uv.x*20.0)*.5+.5;
    gl_FragColor = vec4(e,0.0,0.0,1.0);
}