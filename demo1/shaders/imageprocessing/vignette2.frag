precision mediump float ;

uniform vec2 resolution ;
uniform float time ;
uniform vec2 mouse ;

uniform sampler2D tx ;
varying vec2 vTexCoord;

uniform float size ;
uniform float difuse2 ;

 bool respectaspectradio = true;
 bool quadvignette = true;

 
// Some useful functions
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
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

#define OCTAVES 8
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
void main(){
	
	vec2 uv = gl_FragCoord.xy / resolution;
		 uv = vTexCoord ;
	float fx = resolution.x/resolution.y;
	vec2 uv2 = gl_FragCoord.xy;
		 uv2 = vTexCoord ;

	vec2 p = vec2(0.0);
	
	float mapsize = 1.-size;
	float mapdifuse = difuse2;
	//uv.x*=fx;



	mapsize = 0.0;



    float e = ridgedMF2(vec2(uv.x*0.55+time*0.01+size*10000.,uv.y*0.15+time*0.01+size*10500.))*1.;


	mapdifuse = 0.08*e;



	if(respectaspectradio){
		uv.x*=fx;
		p = vec2(0.5*fx,0.5) - uv;
	}else{
		p = vec2(0.5) - uv;
	}
	
	float r = length(p);
	
	vec4 t1 =  texture2D(tx, vec2(uv2.x,1.0-uv2.y));
		
	float v = 0.;

	if(quadvignette){
		if(respectaspectradio){
			vec2 uv3 = vec2(uv.x/fx,uv.y);
			v = smoothstep(mapsize,mapsize+mapdifuse,uv3.x) *
				smoothstep(mapsize,mapsize+mapdifuse,1.-uv3.x) *
				smoothstep(mapsize,mapsize+mapdifuse,1.-uv3.y) *
				smoothstep(mapsize,mapsize+mapdifuse,uv3.y)
			;
		}else{
			v = smoothstep(mapsize,mapsize+mapdifuse,uv.x) *
				smoothstep(mapsize,mapsize+mapdifuse,1.-uv.x) *
				smoothstep(mapsize,mapsize+mapdifuse,1.-uv.y) *
				smoothstep(mapsize,mapsize+mapdifuse,uv.y)
			;
		}
	}else{
		v = (1.-smoothstep(mapsize,mapsize+mapdifuse,r));
	}
	
	vec3 fin = t1.rgb * v;
	//fin = vec3(cir(uv,vec2(0.5*fx,0.5),0.4,0.0));
	gl_FragColor = vec4(fin,1.0); 
}