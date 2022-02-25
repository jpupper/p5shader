precision mediump float;

//ooEqvnpwTPrqxSynoGjBXpNtpQeuY2tjLcakgKFhdhYnDzkqHff XX
//oog9Cf48CEiucQa3Ph3NxoPawwYnCxY3GTPUnRT8shTa1H55kDn
//ooYpNZwJN6jASrX9XyL3LQhM1eMtFr8qtEn5tCE5C8Mg2YbWKBj
//ooZ5V8BVcaXy61vLYbovEC7evKndVEcAKUVM5JUurpcEAUd1zuw
//ooX9uWRKMdDDgYbhfeKNQ749AE2EUK4TxvmPcYFAXyBn59P11sj
//ooR1XvHgYW2z6vF1izsrJCvdUqLskjnJu65Swb3Tsgeg7kBkw5M
//oo8E5RUTCFQXt4A3psnydSi5cP3P4iUGvZx2mnVvinaPgqgRu5r
//ooPZsPx4bxWdhAzgQJ4tACeLWgUVnAFQPrXjU6ui9XxB16D4AD5 XX
//oo5gtFYAMZmWL4fa5ePUk6HMSNv45UeDsYRPJArY5QbqUzZykCx
//oo2UsUZQLvTu6P88pmN7GygFHBKJicCz6Kx6Z5UQW2krgfUA4oa
//ooL9AccvzF4zcHPmCYQaqEurJnFj6zGug4jPT5ZGYQv2qvm8gwY
//ooJxqKxNddFrwfzrLwYMcFyYJ9Gr2X5rt4bDiLWM2rAb1atWueR
//ooMQojRsSBJATazwPUa7q9AHhanwmxVDp1TxjE3Jk9jcbULq3N6
//ooThdUNkWmgGiKvfQA1dFygEX2uTk68M386LZdf11pq2jZYnkkn
//ooo1CaEmXRJQ3wm7xfnpawrFKNwsPdxLHyFnb76uHYAKGByBDGc
//ooqDvaup6oXZfdQTtmw1DLSUoeB8atTRKFkrANTdnNitMoCSuHW

//shader, glsl, animation, move, rgbshift, colorfull, sine, cosine,rxr,noise,random,snoise,voronoi,p5js,processing,buffer,backbuffers,minerals,medicine,cellular,celular,
/*P U R E R X R  

/*This is the raw implementation a visualization of rxr algorithm. 
This was the core algorithm used in other of myh artworks like Cave dreams,
rxr planets, rxr poster. 

Colors palette are generated using a RGB shift. 
*/








//vec3 verdejpupper(){return vec3(0.0,1.0,0.8);}

// we need the sketch resolution to perform some calculations
uniform vec2 resolution ;
uniform float time ;
uniform vec2 mouse ;


#define iTime time
#define iResolution resolution


#define OCTAVES 8
#define pi 3.14159265359
#define PI 3.14159265359
#define TWO_PI 6.28318530718

varying vec2 vTexCoord ;

uniform float sc ;
uniform float sc2 ;
uniform float seed ;
uniform float r1 ; 
uniform float g1 ; 
uniform float b1 ; 
uniform float flush ; 




float mapr(float _value,float _low2,float _high2) {
	float val = _low2 + (_high2 - _low2) * (_value - 0.) / (1.0 - 0.);
    //float val = 0.1;
	return val;
}


vec2 scale(vec2 uv, float s);
mat2 scale(vec2 _scale);
mat2 rotate2d(float _angle);

float snoise(vec2 v);
float random (in vec2 _st);
vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}


mat2 scale(vec2 _scale){    
    mat2 e = mat2(_scale.x,0.0,
                0.0,_scale.y); 
    return e;
}



mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}


float cir(vec2 uv,vec2 p, float s, float d){
    
    p = p -uv;    
    float r = length(p);    
    float e = 1.-smoothstep(s,s+d,r);
    return e ;
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
        float n = ridge(snoise(p*freq+seed*20.), offset);
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

    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h) +seed*5001.;

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
        float n = ridge2(snoise2(p*freq+seed*4551565.), offset);
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

  //  float n = snoise(vec2(uv.x*100.*noisex,uv.y*100.*noisey+time*1)*0.002) ;
    const int cnt = 3;
    for(int i=0; i<cnt; i++){
        float fas = float(i)*PI*2./float(cnt);
        uv+=vec2(0.5);
        uv = scale(vec2(1.2))*uv;
        uv-=vec2(0.5);   
    }
    uv/=float(cnt);


	float msc = mapr(sc,10.,40.);
     //     msc = mod(60.0,msc);
    float msc2 = mapr(sc2,0.1,0.8);
	
	float mseed = mapr(seed,0.1,20.);
//	float flush
	
	
	float xs = seed;
    	   
    float gsc = mapr(sc,0.,1.2);
	
		float e2 = ridgedMF2(uv);
		e2 = sin(e2*10.)*0.01;
		
		
	float rsc1 = 1.2;
	float rsc2 = 0.8;
	float e = ridgedMF(vec2(uv.x*rsc1*gsc
					        ,uv.y*rsc1*gsc)
			  *ridgedMF(vec2(uv.x*rsc2*msc2*gsc,
			                 uv.y*rsc2*msc2*gsc))-uv);
	
	
	
	float mflush = mapr(flush,0.3,1.0);
	e = sin(e*2.*mflush+time*.05)*5.;
	
	
	
	
	vec3 col1 = vec3(sin(e*2.+r1*TWO_PI)*.5+.5,
					 sin(e*2.+g1*TWO_PI)*.5+.5,
					 sin(e*2.+b1*TWO_PI)*.5+.5);
		  //col1 = vec3(r1,g1,b1);
   	
		col1 = mix(col1,vec3(0.),cos(e*8.));
	vec3 col2 = mix(col1,vec3(0.),cos(e*8.));
		//  col2 = vec3(r2,g2,b2);
    
    e = sin(e*5.+time*0.1);
    
    vec3 fin = mix(col1,col2,e);

	gl_FragColor = vec4(fin,1.0);


   
}

