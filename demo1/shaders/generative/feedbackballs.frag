precision mediump float;

uniform sampler2D feedback ;
uniform vec2 resolution ;
uniform float time ;
uniform vec2 mouse ;

varying vec2 vTexCoord ;

#define iTime time
#define iResolution resolution
#define pi 3.14159265359

uniform float sc1 ;
uniform float size ;
uniform float iterations ;
uniform float ite_scale ;
uniform float xspeed ;
uniform float yspeed ;
uniform float rotangle ;
uniform float rotspeed ;
uniform float fb_force ;
uniform float e_force ;
uniform float hue1 ;
uniform float hue2 ;


float mapr(float _value,float _low2,float _high2) {
	float val = _low2 + (_high2 - _low2) * (_value - 0.) / (1.0 - 0.);
    //float val = 0.1;
	return val;
}
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}
mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,
                0.0,_scale.y);
}
mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}
float cir(vec2 uv,vec2 p,float s, float d){
	vec2 p2 = p - uv;
	float a = atan(p2.x,p2.y);
	float r = length(p2);
	float e = 1.-smoothstep(s,s+d,r);
	return e;
}

void main()
{	
	vec2 uv = vTexCoord;


	//coords.y = resolution.y -coords.y;
	vec4 fb =  texture2D(feedback, vTexCoord);
		
	float fix = resolution.x/resolution.y;
	uv.x *= fix;
	float e = 0.;
	
	float msc1 = mapr(sc1,1.,20.);
	float mcnt = floor(mapr(iterations,1.,20.));
	float mite_scale = mapr(ite_scale,0.0,1.);
	float mrot = mapr(rotangle,-pi/8.,pi/8.);
	float mxspeed = mapr(xspeed,-0.5,0.5);
	float myspeed = mapr(yspeed,-0.5,0.5);
	//float mt = time * speed * 10.;//MAP TIME 
	float mrotspeed = mapr(rotspeed,-0.5,0.5);
	float msize = size;
	
	vec3 dib = vec3(0.);
	vec3 col1 = hsb2rgb(vec3(hue1,0.8,1.0));
	vec3 col2 = hsb2rgb(vec3(hue2,0.8,1.0));
	

	const int cntf = 20;
	for(int i=1; i<cntf; i++){
		
		vec2 uv3 = uv;
		
		uv3-=vec2(0.5*fix,time*0.0);
		uv3 = rotate2d(mrot*float(i)+time*mrotspeed)*uv3;
		uv3+=vec2(0.5*fix,0.5);
		
		vec2 uv2 = fract(vec2(uv3.x+mxspeed*time,
							  uv3.y+myspeed*time));
		uv2-=vec2(0.5,0.5);
		uv2 = scale(vec2(msc1+float(i)*mite_scale))*uv2;
		uv2+=vec2(0.5,0.5);
		
		e= cir(fract(uv2),vec2(0.5),msize*0.1,msize*0.08);	
			
		dib+=vec3(e)*mix(col2,col1,float(i)/mcnt);
		if(float(i) > mcnt){
			break;
		}
	}
	
	vec3 fin = vec3(0);
	
	
	//dib = rgb2hsb(dib);
	fin = dib*e_force+fb.rgb*mapr(fb_force,0.2,1.0);
	
	gl_FragColor = vec4(fin,1.0); 
}









