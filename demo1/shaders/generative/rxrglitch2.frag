precision mediump float;
//vec3 verdejpupper(){return vec3(0.0,1.0,0.8);}

// we need the sketch resolution to perform some calculations
uniform vec2 resolution ;
uniform float time ;
uniform vec2 mouse ;


varying vec2 vTexCoord ;

uniform float sc ;
uniform float flush ;
uniform float seed ;

uniform float r1 ; 
uniform float g1 ; 
uniform float b1 ; 
uniform float frc ;
#define iTime time
#define iResolution resolution


#define OCTAVES 8
#define pi 3.14159265359




float mapr(float _value,float _low2,float _high2) {
	float val = _low2 + (_high2 - _low2) * (_value - 0.) / (1.0 - 0.);
    //float val = 0.1;
	return val;
}


vec2 scale(vec2 uv, float s);

float rad(vec2 uv);
float ang(vec2 uv);

float rad(vec2 uv, vec2 p);
float ang(vec2 uv, vec2 p);
float def(vec2 uv , float f);
float cir(vec2 uv,vec2 p , float s, float d);
float sin2(float f);
float cos2(float f);
mat2 scale(vec2 _scale);
mat2 rotate2d(float _angle);

float noise (in vec2 st,float fase);
float snoise(vec2 v);
float random (in vec2 _st);
vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}
float voronoi(vec2 uv);
float voronoi(vec2 uv,float circle);
vec3 voronoi2( in vec2 x );
float poly(vec2 uv,vec2 p, float s, float dif,int N,float a);
#define PI 3.14159265359
#define TWO_PI 6.28318530718

float sm(float v1,float v2,float val){return smoothstep(v1,v2,val);}
vec3 fm(vec3 dib, vec3 dec, vec3 limit);


vec3 voronoi2( in vec2 x ) {
    
    float time2 = time;

    vec2 n = floor(x);
    vec2 f = fract(x);

    // first pass: regular voronoi
    vec2 mg, mr;
    float md = 8.0;
    for (int j= -1; j <= 1; j++) {
        for (int i= -1; i <= 1; i++) {
            vec2 g = vec2(float(i),float(j));
            vec2 o = random2( n + g );
            o = 0.5 + 0.5*sin( time2 + 6.2831*o );

            vec2 r = g + o - f;
            float d = dot(r,r);

            if( d<md ) {
                md = d;
                mr = r;
                mg = g;
            }
        }
    }

    // second pass: distance to borders
    md = 8.0;
    for (int j= -2; j <= 2; j++) {
        for (int i= -2; i <= 2; i++) {
            vec2 g = mg + vec2(float(i),float(j));
            vec2 o = random2( n + g );
            o = 0.5 + 0.5*sin( time2 + 6.2831*o );

            vec2 r = g + o - f;

            if ( dot(mr-r,mr-r)>0.00001 ) {
                md = min(md, dot( 0.5*(mr+r), normalize(r-mr) ));
            }
        }
    }
    return vec3(md, mr);
}

float voronoi(vec2 uv,float circle){
    // Scale
    // uv *= 10.;

    // Tile the space
    vec2 i_st = floor(uv);
    vec2 f_st = fract(uv);


    //float e2 = cir(uv,vec2(0.5),0.0,0.1);
    float m_dist = circle;  // minimun distance
    vec2 m_point ;        // minimum point

    for (int j=-1; j<=1; j++ ) {
        for (int i=-1; i<=1; i++ ) {
            vec2 neighbor = vec2(float(i),float(j));
            vec2 point = random2(i_st + neighbor);
            point = sin(6.2831*point+time)*0.1+0.5;
            vec2 diff = neighbor + point - f_st;
            float dist = length(diff);

            if( dist < m_dist ) {
                m_dist = dist;
                m_point = point;
            }
        }
    }
    
    return dot(m_point,vec2(.1,1.0));
}
float voronoi(vec2 uv){
 // Scale
   // uv *= 10.;

    // Tile the space
    vec2 i_st = floor(uv);
    vec2 f_st = fract(uv);

    float m_dist = uv.x;  // minimun distance
    vec2 m_point;        // minimum point

    for (int j=-1; j<=1; j++ ) {
        for (int i=-1; i<=1; i++ ) {
            vec2 neighbor = vec2(float(i),float(j));
            vec2 point = random2(i_st + neighbor);
            point = 0.5 + 0.5*sin(time + 6.2831*point);
            vec2 diff = neighbor + point - f_st;
            float dist = length(diff);

            if( dist < m_dist ) {
                m_dist = dist;
                m_point = point;
            }
        }
    }   
    return dot(m_point,vec2(.1,1.0));
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

vec3 fm(vec3 dib, vec3 dec, vec3 limit){

    if(dib.r > limit.r){
        dib.r-=dec.r;
    }
    
    
    if(dib.g > limit.g){
        dib.g-=dec.g;
    }
    
    
    if(dib.b > limit.b){
        dib.b-=dec.b;
    }
    
    return dib; 
}

mat2 scale(vec2 _scale){
    
    
    mat2 e = mat2(_scale.x,0.0,
                0.0,_scale.y); 
    return e;


}

float def(vec2 uv,float f){
    
    vec2 p = vec2(0.5)-uv;
    float a = atan(p.x,p.y);
    float r = length(p);
    
    float xcir = cir(uv,vec2(0.5),0.3,0.4);
    float e = sin2(r*30.+sin(a*20.));
    return e*0.3 ;
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

float sin2(float f){
    return sin(f)*0.5+0.5;
}

float cos2(float f){
    return cos(f)*0.5+0.5;
}


float cir(vec2 uv,vec2 p, float s, float d){
    
    p = p -uv;    
    float r = length(p);    
    float e = 1.-smoothstep(s,s+d,r);
    return e ;
}


float rad(vec2 uv){
    return length(vec2(0.5)-uv);
}

float ang(vec2 uv){
    return atan((vec2(0.5)-uv).x,(vec2(0.5)-uv).y);
}

float rad(vec2 uv,vec2 p){
    vec2 p2 = p -uv;
    float r = length(p2);
    return r;
}

float ang(vec2 uv,vec2 p){
    vec2 p2 = p -uv;
    float a = atan(p2.x,p2.y);
    return a;
}
float noise (in vec2 st,float fase) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    float fase2 = fase;
    // Four corners in 2D of a tile
    float a = sin(random(i)*fase2);
    float b =  sin(random(i + vec2(1.0, 0.0))*fase2);
    float c =  sin(random(i + vec2(0.0, 1.0))*fase2);
    float d =  sin(random(i + vec2(1.0, 1.0))*fase2);

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

// Some useful functions
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

//
// Description : GLSL 2D simplex noise function
//      Author : Ian McEwan, Ashima Arts
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License :
//  Copyright (C) 2011 Ashima Arts. All rights reserved.
//  Distributed under the MIT License. See LICENSE file.
//  https://github.com/ashima/webgl-noise
//
float snoise(vec2 v) {

    // Precompute values for skewed triangular grid
    const vec4 C = vec4(0.211324865405187,
                        // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,
                        // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626,
                        // -1.0 + 2.0 * C.x
                        0.024390243902439);
                        // 1.0 / 41.0

    // First corner (x0)
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);

    // Other two corners (x1, x2)
    vec2 i1 = vec2(0.0);
    i1 = (x0.x > x0.y)? vec2(1.0, 0.0):vec2(0.0, 1.0);
    vec2 x1 = x0.xy + C.xx - i1;
    vec2 x2 = x0.xy + C.zz;

    // Do some permutations to avoid
    // truncation effects in permutation
    i = mod289(i);
    vec3 p = permute(
            permute( i.y + vec3(0.0, i1.y, 1.0))
                + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(
                        dot(x0,x0),
                        dot(x1,x1),
                        dot(x2,x2)
                        ), 0.0);

    m = m*m ;
    m = m*m ;

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    // Normalise gradients implicitly by scaling m
    // Approximation of: m *= inversesqrt(a0*a0 + h*h);
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);

    // Compute final noise value at P
    vec3 g = vec3(0.0);
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * vec2(x1.x,x2.x) + h.yz * vec2(x1.y,x2.y);
    return 130.0 * dot(m, g);
}

float random (in vec2 _st) {
    return fract(sin(dot(floor(_st.xy),
                         vec2(12.9898,78.233)))*
        43000.31);
}
float ridge(float h, float offset) {
    h = abs(h);     // create creases
    h = offset - h; // invert so creases are at top
    h = h * h;      // sharpen creases
    return h;
}

#define OCTAVES 8
float ridgedMF(vec2 p) {
    float lacunarity = 2.0;
    float gain = 0.5;
    float offset = 0.9;

    float sum = 0.0;
    float freq = 1.0, amp = 0.5;
    float prev = 1.0;
    for(int i=0; i < OCTAVES; i++) {
        float n = ridge(snoise(p*freq+seed*50.), offset);
        sum += n*amp;
        sum += n*amp*prev;  // scale by previous octave
        prev = n;
        freq *= lacunarity;
        amp *= gain;
    }
    return sum;
}
float ridge2(float h, float offset) {
    h = abs(h);     // create creases
    h = offset - h; // invert so creases are at top
    h = h * h;      // sharpen creases
    return h;
}
float snoise2(vec2 v) {

    // Precompute values for skewed triangular grid
    const vec4 C = vec4(0.211324865405187,
                        // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,
                        // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626,
                        // -1.0 + 2.0 * C.x
                        0.024390243902439);
                        // 1.0 / 41.0

    // First corner (x0)
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);

    // Other two corners (x1, x2)
    vec2 i1 = vec2(0.0);
    i1 = (x0.x > x0.y)? vec2(1.0, 0.0):vec2(0.0, 1.0);
    vec2 x1 = x0.xy + C.xx - i1;
    vec2 x2 = x0.xy + C.zz;

    // Do some permutations to avoid
    // truncation effects in permutation
    i = mod289(i);
    vec3 p = permute(
            permute( i.y + vec3(0.0, i1.y, 1.0))
                + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(
                        dot(x0,x0),
                        dot(x1,x1),
                        dot(x2,x2)
                        ), 0.0);
    m = m*m ;
    m = m*m ;


    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    // Normalise gradients implicitly by scaling m
    // Approximation of: m *= inversesqrt(a0*a0 + h*h);
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h) +mapr(seed,1.0,5.0) ;

    // Compute final noise value at P
    vec3 g = vec3(0.0);
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * vec2(x1.x,x2.x) + h.yz * vec2(x1.y,x2.y);
    return 130.0 * dot(m, g);
}
float ridgedMF2(vec2 p) {
    float lacunarity = 2.0;
    float gain = 0.5;
    float offset = 0.9;

    float sum = 0.0;
    float freq = 1.0, amp = 0.5;
    float prev = 1.0;
    for(int i=0; i < OCTAVES; i++) {
        float n = ridge2(snoise2(p*freq+seed*20.), offset);
        sum += n*amp;
        sum += n*amp*prev;  // scale by previous octave
        prev = n;
        freq *= lacunarity;
        amp *= gain;
    }
    return sum;
}
void main(void)
{   
    vec2 uv = gl_FragCoord.xy/resolution.xy;
         uv = vTexCoord;
	
    float fx = resolution.x/resolution.y;
    uv.x *= fx;
    
    vec2 p = vec2(0.5*fx,0.5) - uv;
    float r = length(p);
    float a = atan(p.x,p.y);
    
    vec3 color = vec3(0.0);

    float msc2 = mapr(sc,1.0,150.0);	
	float mflush = mapr(flush,0.1,120.);
	
	
	float xs = flush;
    //uv-=0.5;
	
	uv.x*=0.05;
	uv.y*=0.05;
		   
    float gsc = 0.02;
	float e = ridgedMF(vec2(uv.x*1.9*gsc
					        ,uv.y*1.9*gsc)
			  *ridgedMF(vec2(uv.x*1.2*msc2*gsc,
			                 uv.y*1.2*msc2*gsc))-uv);
	
            float e2 = ridgedMF2(uv*msc2)*e;
	
	
	vec2 uv2 = vTexCoord.xy;
	uv2.x*=resolution.x/resolution.y;
	
	float mfrc = mapr(frc,1.0,3.0);
	uv2.x*=1.4;
	uv2.x-=0.4;
	vec2 p2 = vec2(0.5*fx,0.5) - uv2;
	float r2 = length(p2);
	
	float ecir = 1.-smoothstep(0.0,0.51,r2+e2*0.05);
	e = sin(e*5.+xs+time*.1+e2)*1.;
	e*=ecir*1.;
	e+=ecir*1.7;
	//e = ecir;
	vec3 col1 = vec3(sin(e*2.+r1*TWO_PI)*.5+.5,
					 sin(e*2.+g1*TWO_PI)*.5+.5,
					 sin(e*2.+b1*TWO_PI)*.5+.5);

	 	 col1 = mix(col1,vec3(0.),cos(e*8.)*.5+.5);
	vec3 col2 = mix(col1,vec3(0.),cos(e*8.)*.5+.5);
		
    e = sin(e*5.+e2*4.*flush+time*1.1);
	
	 float e4 = ridgedMF2(vTexCoord*10.)*smoothstep(0.3,0.2,vTexCoord.y);
		
    vec3 fin = mix(col1,col2,e);
		 fin = mix(vec3(e4)*.02,fin,fin);
		 
		 
	gl_FragColor = vec4(fin,1.0);
}

