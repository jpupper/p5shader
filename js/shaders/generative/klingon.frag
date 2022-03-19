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


uniform float f1 ;
uniform float f2 ;
uniform float f3 ;
uniform float a4 ;
uniform float f4 ;
uniform float faser ;
uniform float faseg ;
uniform float faseb ;


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

    // Gradients:
    //  41 pts uniformly over a line, mapped onto a diamond
    //  The ring size 17*17 = 289 is close to a multiple
    //      of 41 (41*7 = 287)

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
float ridge2(float h, float offset) {
    h = abs(h);     // create creases
    h = offset - h; // invert so creases are at top
    h = h * h;      // sharpen creases
    return h;
}

float ridgedMF2(vec2 p) {
    float lacunarity = 2.0;
    float gain = 0.5;
    float offset = 0.9;

    float sum = 0.0;
    float freq = 1.0, amp = 0.5;
    float prev = 1.0;
    for(int i=0; i < OCTAVES; i++) {
        float n = ridge2(snoise2(p*freq), offset);
        sum += n*amp;
        sum += n*amp*prev;  // scale by previous octave
        prev = n;
        freq *= lacunarity;
        amp *= gain;
    }
    return sum;
}


float cir(vec2 uv,vec2 p, float s, float d){
    
    p = p -uv;
    float r = length(p);    
    float e = 1.-smoothstep(s,s+d,r);
    return e ;
}
float desf (vec2 uv, float fase){

	//float mf1 = mapr(f1y,0.0,1.0);
	
	
	
	float ma4 = mapr(a4,0.0,0.3);
	
	float v1 = 0.;
	v1+= sin(uv.x*40.*f1+time) * sin(uv.y*40.*f1);
	float v2 = cos(uv.x*40.*f2)*sin(uv.y*40.*f2);
	v1*=sin(v2*1.+time);
	float v3 = cos(uv.x*40.*f4+time) + sin(uv.y*40.*f4+time);
	
	float ff = sin(uv.x*10.*v1*f3+fase)*sin(uv.y*10.+v1*10.0*f3+time+fase);
	
	ff = mix(ff,v3,ma4);
	return ff;
}

void main(void){   
    vec2 uv = gl_FragCoord.xy / resolution;
	
	float r = desf(uv,mapr(faser,0.0,pi*2.0));
	float g = desf(uv,mapr(faseg,0.0,pi*2.0));
	float b = desf(uv,mapr(faseb,0.0,pi*2.0));
	
	vec3 fin = vec3(r,g,b);
	
	gl_FragColor = vec4(fin,1.0); 
}
