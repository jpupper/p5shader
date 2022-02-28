precision mediump float;
//vec3 verdejpupper(){return vec3(0.0,1.0,0.8);}

// we need the sketch resolution to perform some calculations
uniform vec2 resolution ;
uniform float time ;
uniform vec2 mouse ;
uniform sampler2D feedback ;


uniform float deformator1 ;
uniform float puntas ;
uniform float amp ;
uniform float msize ;

varying vec2 vTexCoord ;

#define iTime time
#define iResolution resolution

#define PI 3.14159265359
#define TWO_PI 6.28318530718

#define OCTAVES 8
#define pi 3.14159265359




float mapr(float _value,float _low2,float _high2) {
	float val = _low2 + (_high2 - _low2) * (_value - 0.) / (1.0 - 0.);
    //float val = 0.1;
	return val;
}



float sm(float s,float d, float var){return smoothstep(s,d,var);}
mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}
mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,
                0.0,_scale.y);
}


float poly(vec2 uv,vec2 p, float s, float dif,int N,float a){
    
    // Remap the space to -1. to 1.
    
    vec2 st = p - uv ;
    
    
    // Angle and radius from the current pixel
    float a2 = atan(st.x,st.y)+a;
    float r = TWO_PI/float(N);
    
    float d = cos(floor(.5+a2/r)*r-a2)*length(st);
    float e = 1.0 - smoothstep(s,dif,d);
      
    return e;
}
void main()
{

   vec2 uv = gl_FragCoord.xy / resolution;
   uv = vTexCoord;
   vec2 pos = vec2(0.5) - uv;
   
   float angle = atan(pos.x,pos.y);
   float radius = length(pos)*2.0;
   
   
   float size = 0.1;
   
   float mpuntas = floor(mapr(puntas,2.0,20.0));
   float mamp = mapr(amp,0.0,5.0);
   float formator = sin(radius)+abs(sin(angle*mpuntas+time*0.9+sin(radius*PI*mpuntas)*mamp))*0.5+
                    +cos(angle*5.+time*2.+sin(angle*18.+sin(radius*10.+sin(angle*5.)*0.5)*10.))*deformator1;
   
   formator = smoothstep(1.,-.5,formator)+mapr(msize,0.0,1.0); 

   
   float r = smoothstep(formator,formator-0.5,radius)+radius/5.;
   float g = smoothstep(formator-0.6,formator-0.9,radius)*0.85
   +smoothstep(formator-0.1,formator-1.2,radius)*0.85;
   
   float b = -smoothstep(formator-0.2,formator-0.9,radius)*0.1;
   
   
   
   gl_FragColor = vec4(r,g,b,1.0);
    

}