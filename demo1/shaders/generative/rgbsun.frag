precision mediump float;
//vec3 verdejpupper(){return vec3(0.0,1.0,0.8);}

// we need the sketch resolution to perform some calculations
uniform vec2 resolution;
uniform float centerpower;
uniform float time;
uniform vec2 mouse;

#define iTime time
#define iResolution resolution
float PI = 3.14159265359;

#define OCTAVES 8

 uniform float scalex ;
 uniform float scaley ;
 float fasex = 0.5;
 float fasey = 0.5;
 float noisex = 0.5;
 float noisey = 0.5;


vec2 scale(vec2 uv, float s);

float random (in vec2 _st);
float sm(float v1,float v2,float val){return smoothstep(v1,v2,val);}
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,
                0.0,_scale.y);
}
mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}
float mapr(float _value,float _low2,float _high2) {
	float val = _low2 + (_high2 - _low2) * (_value - 0.) / (1.0 - 0.);
    //float val = 0.1;
	return val;
}


float superform(in vec2 _uv,in float _angle,in float _radius){


    float result =_radius;
    float osci = 1.5+sin(time)*0.5;
    float rtoa = smoothstep(0.7,0.9,sin(_radius));
    
    vec2 move = vec2(1.0-sin(_uv.x*PI*5.+mouse.x*10.),1.0-cos(_uv.y*PI*5.));
    float angle =  sin(cos(_angle*5.+sin(_radius*PI*8.+time*5.)*0.2)*_radius+0.)*2.0; 

    angle = smoothstep(1.-centerpower,1.-centerpower+0.1,angle);
    return angle;

}




void main(void){   
    vec2 uv = gl_FragCoord.xy/resolution.xy;

    float fx = resolution.x/resolution.y;

    uv.x*=fx;
    vec3 color = vec3(0.0);

    vec2 pos = vec2(mouse.x*fx,1.-mouse.y)-uv;

    float radius = length(pos)*2.0;
    float angle = atan(pos.y,pos.x);
	
    float f = 0.;
    
    float TWO_PI  = PI*2.;
    float result;
   
    
    float angleR = angle + float(TWO_PI)*1./3.;
    float angleG = angle + TWO_PI*2./3.;
    float angleB = angle + TWO_PI*3./3.;
   
    float r =   superform(sin(uv*PI*5.),angleR,radius)*0.7; 
    float g =   superform(uv,angleG,radius)*0.7 ; 
    float b =   superform(uv,angleB,radius)*0.7 ; 
    
    gl_FragColor = vec4(r,g,b,1.0);
    // gl_FragColor = vec4(uv.x,0.0,0.0,1.0);
}
