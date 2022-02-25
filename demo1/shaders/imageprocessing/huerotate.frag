precision mediump float;
//vec3 verdejpupper(){return vec3(0.0,1.0,0.8);}

// we need the sketch resolution to perform some calculations
uniform vec2 resolution ;
uniform float time ;
uniform sampler2D tx ;


varying vec2 vTexCoord ;
#define iTime time
#define iResolution resolution

float effect_mix = 1.0;
float effect_exp = 0.74;
float color_mix = 0.57;
float sample_size = 0.75;
float saturation = 0.25;


uniform float hue ;


mat2 rot(float a) {
  float c=cos(a);
  float s=sin(a);
  return mat2(c,s,-s,c);
}


vec3 rgb2hsb( in vec3 c ){
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz),
                 vec4(c.gb, K.xy),
                 step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r),
                 vec4(c.r, p.yzx),
                 step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)),
                d / (q.x + e),
                q.x);
}
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

void main()
{
	
	
	vec2 uv = gl_FragCoord.xy/iResolution.xy ; 
	     uv = vTexCoord;
    float size=1.+floor(sample_size*2.);
    float it=floor(size*size);
    vec3 C=texture2D(tx,vec2(vTexCoord.x,1.-vTexCoord.y)).rgb;
	  vec3 R=vec3(0.);
	
	vec2 uv2 = gl_FragCoord.xy ;

	vec4 t1 =  texture2D(tx, vec2(vTexCoord.x,1.-vTexCoord.y));	

	  
	vec3 rgbahsb = rgb2hsb(t1.rgb);
			
	vec3 fin = hsb2rgb(vec3(fract(rgbahsb.r+hue),
							rgbahsb.g,
							rgbahsb.b));
	
	
	
	
    gl_FragColor = vec4(fin,1.);
}
