precision mediump float ;
//vec3 verdejpupper(){return vec3(0.0,1.0,0.8);}

// we need the sketch resolution to perform some calculations
uniform vec2 resolution ;
uniform float time ;
uniform sampler2D tx ;
uniform vec2 mouse ;


varying vec2 vTexCoord;


#define iTime time
#define iResolution resolution


uniform float effect_mix ;
uniform float effect_exp ;
uniform float color_mix ;
uniform float sample_size ;
uniform float brightness ;

mat2 rot(float a) {
  float c=cos(a);
  float s=sin(a);
  return mat2(c,s,-s,c);
}

void main()
{
	
	
	
	vec2 gluv = gl_FragCoord.xy;
		gluv = vTexCoord;
	vec2 uv = gl_FragCoord.xy / resolution;
		 uv = vTexCoord;
	uv.y = 1.0-uv.y;
	
	vec2 uv2 = uv;
	uv2.x*=resolution.x/resolution.y;
	vec2 mm = vec2(mouse.x/resolution.x,mouse.y/resolution.y);
	mm.x*=resolution.x/resolution.y;
	vec2 p = vec2(mm) -uv2;
	float r2 = length(p);
	

	float size=2.+sample_size*10.;
    float it=floor(size*size);
    vec3 C=texture2D(tx,uv).rgb;
	vec3 R=vec3(0.);
    
	const int cnt = 10;
	for(int i=0; i<cnt; i++) {
    	vec2 p=vec2(mod(float(i),size),floor(float(i)/size))-floor(size*.5);
		
		
		vec2 uv2 = (gl_FragCoord.xy+p)/resolution;

		
			//uv2 = ((vTexCoord / resolution)+p)*resolution;
			uv2 = vTexCoord +p/resolution;

		uv2.y = 1.0-uv2.y;
        vec3 aC=texture2D(tx,uv2).rgb;
		    R+=pow(distance(C,aC),effect_exp*3.);
			
			
		
		if(float(i) > it ){
			break;
		}
		it=floor(size*size);
    };
	
	
    R/=it;
    R=mix(R,C*R,color_mix);
    R*=1.+brightness*50.;
    //R=mix(C,R,effect_mix);
	
	float e = smoothstep(0.1,0.3,r2);
	R=mix(C,R,effect_mix);
	
	
	
	
    gl_FragColor = vec4(R,1.);
	
	
	
	
	
	
//	gl_FragColor = vec4(vec3(1.0,0.0,0.0),1.);
	/*vec2 uv = gl_FragCoord.xy/iResolution.xy ; 
	uv.y = 1.0-uv.y;
	vec3 C=texture2D(tx,uv).rgb;
	//C.r*=0.0;
    gl_FragColor = vec4(C,1.);*/
}
