precision mediump float;
//vec3 verdejpupper(){return vec3(0.0,1.0,0.8);}

// we need the sketch resolution to perform some calculations
uniform vec2 resolution;
uniform float time;
uniform sampler2D tx;

#define iTime time
#define iResolution resolution

float effect_mix = 1.0;
float effect_exp = 0.74;
float color_mix = 0.57;
float sample_size = 0.75;
float saturation = 0.25;

mat2 rot(float a) {
  float c=cos(a);
  float s=sin(a);
  return mat2(c,s,-s,c);
}

void main()
{
	
	
	vec2 uv = gl_FragCoord.xy/iResolution.xy ; 
	
    float size=1.+floor(sample_size*2.);
    float it=floor(size*size);
    vec3 C=texture2D(tx,gl_FragCoord.xy/resolution.xy).rgb;
	  vec3 R=vec3(0.);
	  
	  
	const int cnt = 5;
    for(int i=0; i<cnt; i++) {
    	vec2 p=vec2(mod(float(i),size),floor(float(i)/size))-floor(size*.5);
        vec3 aC=texture2D(tx,(gl_FragCoord.xy+p)/resolution.xy).rgb;
  	    R+=normalize(cross(C,aC))*length(aC);
	
		if(float(i) > it ){
			break;
		}
    };
    R/=it*.5;
    R=mix(vec3(length(R)/1.7),R,saturation);
    R=mix(C,R,effect_mix);
    gl_FragColor = vec4(R,1.);
}
