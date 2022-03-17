precision mediump float;
//vec3 verdejpupper(){return vec3(0.0,1.0,0.8);}

// we need the sketch resolution to perform some calculations
uniform vec2 resolution ;
uniform float time ;
uniform vec2 mouse ;
uniform sampler2D feedback ;

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



uniform float seed ;
uniform float cnt ;
uniform float ite_scale ;
uniform float speedrdm ;
uniform float speedx ;
uniform float speedy ;
uniform float speedrot ;
uniform float fb_force ;
uniform float palette ;


mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,
                0.0,_scale.y);
}
mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}
mat2 rotate2d(float _angle); 

float voronoi(vec2 uv);
float voronoi(vec2 uv,float circle);

float t = 0.0;

vec2 random3( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
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
float random2 (in vec2 _st,float _time) {
    return fract(sin(dot(floor(_st.xy),
                         vec2(12.9898,78.233)))*
        43000.3+_time);
}
float random2 (in vec2 _st) {
    return fract(sin(dot(floor(_st.xy),
                         vec2(12.9898,78.233)))*
        43000.3);
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
	vec2 uv = gl_FragCoord.xy / resolution;
	uv = vTexCoord;
	
	float fix = resolution.x/resolution.y;
	uv.x *=fix;
	vec2 puv = gl_FragCoord.xy ;
	vec4 fb =  texture2D(feedback, vTexCoord);
	fb.rgb*=vec3(0.0);
	
	vec3 dib = vec3(1.0);
	
	int mcnt = int(floor(mapr(cnt,7.0,9.0)));
	float mite_scale = mapr(ite_scale,.15,0.75);
	float mspeedx = mapr(speedx,-0.01,0.01);
	float mspeedy = mapr(speedy,-0.01,0.01);
	float mspeedrot = mapr(speedrot,-0.01,0.01);
	float mspeedrdm = mapr(speedrdm,0.0,0.1);
	
	//col1 = vec3(1.0,0.0,0.0);
	//col2 = vec3(0.0,0.0,1.0);


	const int cnt3 = 9;
	for(int i=1; i<cnt3; i++){
		float fase = float(i)*pi*2./float(mcnt);
		vec2 uv2 = uv;
		uv2*=resolution.x/resolution.y;
		float indx = float(i)/float(mcnt);
		uv2.x+=time*mspeedx+seed*100.;
		uv2.y+=time*mspeedy-seed*10.;
		
		uv2-=vec2(0.5);
		uv2 = rotate2d(0.)*uv2;
		uv2+=vec2(0.5);
		
		uv2-=vec2(0.5);
		uv2 = scale(vec2(mite_scale*float(i)))*uv2;
		uv2+=vec2(0.5);
		
		float e = random2(uv2*mite_scale*float(i),time*mspeedrdm);
		vec3 col1 = hsb2rgb(vec3(0.8,1.0,1.0));
		vec3 col2 = hsb2rgb(vec3(0.2,1.0,1.0));
		
		float cnt_cols = 5.;
		float indexcolor= mapr(palette,0.0,float(cnt_cols));
		
	
		if(indexcolor < 1.){
			 col1 = vec3(1.0,sin(e*10.)*.5+.5,sin(e*10.)*1.5)*.8;
			 col2 = vec3(0.4,sin(e*10.)*0.5,0.0)*.8;
		}else if(indexcolor < 2.){
			col1 = vec3(sin(e*10.)*1.5,0.0,0.5);
			col2 = vec3(sin(e*10.+time)*0.5,sin(e*10.)*1.5,0.0);
		}else if(indexcolor < 3.){
			col1 = hsb2rgb(vec3(sin(e*4.+time*.1),1.0,1.0));
			col2 = hsb2rgb(vec3(cos(e*1.+time*.1),1.0,1.0));
		}else if(indexcolor <4.){
				
			col1 = hsb2rgb(vec3(.2,sin(e*10.),1.0))*.8;
			col2 = hsb2rgb(vec3(sin(e*10.)*.5+.5,1.0,sin(e*10.)*.5+.5))*.8;
		}else if(indexcolor <5.){
				
			col1 = vec3(sin(e*10.),sin(e*10.),sin(e*10.));
			col2 = vec3(sin(e*10.),sin(e*10.),sin(e*10.));
			//obj1_col1 = vec3(0.8,.6,0.4);
		}
		
		
		dib+= vec3(e)*mix(col2,col1,e);

		if(float(i) > float(mcnt)){
			break;
		}
	}
	
	dib/=(float(mcnt)+1.);
	
	//dib = smoothstep(sm1,sm2,dib);
	dib = smoothstep(.0,1.,dib);
	
	float mfb_force = mapr(fb_force,0.2,0.4);
	
	vec3 fin = dib*.6+
			   fb.rgb*mfb_force;
	
	gl_FragColor = vec4(fin,1.0); 
}