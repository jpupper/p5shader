precision mediump float;
//vec3 verdejpupper(){return vec3(0.0,1.0,0.8);}

// we need the sketch resolution to perform some calculations
uniform vec2 resolution ;
uniform float time ;
uniform vec2 mouse ;

uniform float sc1 ;
uniform float speed ; 
uniform float rd ;
uniform float rdamp ;

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
void main(void)
{
    vec2 uv = vTexCoord;
    float fx =resolution.x/resolution.y; 
        uv.x*=fx;

    vec2 p = vec2(mouse.x*fx,1.-mouse.y) - uv;
    float r = length(p);
    float a =atan(p.x,p.y);
   
    float e2 =  sm(0.3,0.7,r);
    
    float e = sin(r*.0);
    vec4 fin2 = vec4(1.0-e2,uv.y,sin(e2),1.0);
    
    vec3 dib1 = vec3(1.-fin2.rgb);




    float mrdamp = mapr(rdamp,0.4,0.5);

    vec4 fin = vec4(0.0);

    vec3 dib2 = vec3(0.0);
    const int cnt = 1;
   // for(int i =0; i<cnt; i++){
        
        
        vec2 uv2 = uv;
     //        uv2 = fract(uv*(float(i)+1.));
        float s = abs(sin(3.*r * rd+time*0.02*speed+PI+time*speed)*mrdamp);
        dib2+= vec3(poly(fract(uv2*5.*sc1),vec2(0.5),s,s+0.01,4,0.));
   // }




   



    float df = sin(dib2.r*3.*r+time)*.5+.5;

    vec3 col = vec3(mix(1.0,df,.7));
  
    dib2*=col;
    //fin.rgb =mix(dib1,fin2.rgb,mx);
    
    //dib2 = vec3(1.-smoothstep(0.1,0.11,r));

    gl_FragColor = vec4(dib2,1.0);


}



