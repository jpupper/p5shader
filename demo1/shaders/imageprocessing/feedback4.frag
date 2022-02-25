precision mediump float;
//vec3 verdejpupper(){return vec3(0.0,1.0,0.8);}




varying vec2 vTexCoord ;
// we need the sketch resolution to perform some calculations
uniform vec2 resolution ;
uniform float time ;
uniform sampler2D tx ;
uniform sampler2D feedback ;
uniform vec2 mouse ;

#define iTime time
#define iResolution resolution



// standart UVALUE sc = 0.2;

uniform float sc ;
uniform float limit ;
uniform float speedx ;
uniform float speedy ;
uniform float force ;
uniform float mmof ;


float mapr(float _value,float _low2,float _high2) {
	float val = _low2 + (_high2 - _low2) * (_value - 0.) / (1.0 - 0.);
    //float val = 0.1;
	return val;
}
mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,
                0.0,_scale.y);
}
mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

void main()
{
	vec2 uv = gl_FragCoord.xy / resolution;
	
	uv.y = 1.-uv.y;
	vec4 t = texture2D(tx,uv);
	
	
	vec2 puv = uv;
	vec2 puv2 = uv;
	vec4 fb2 = texture2D(feedback,puv2);
	
	float ff = (fb2.r + fb2.g + fb2.b )/3.;
	
	ff*=mapr(mmof,-0.01,0.01);
	vec2 mm = mouse;
	
	puv-=vec2(mm+vec2(ff*.1));
	puv*=scale(vec2(0.997+ff));
	//puv*=scale(vec2(0.99+ff*.03));
	
	puv+=vec2(mm+vec2(ff*.1));
	puv.x+=mapr(speedx,-0.1,0.1);
	
	puv.x+=mapr(speedy,-0.1,0.1);
	//puv.y-=0.0001;
	vec4 fb = texture2D(feedback,puv);
	
	float limit = 0.001;
	vec3 fin =  vec3(0);
	
	if(limit < t.r && 
	   limit < t.g && 
	   limit < t.b){
	   fin = t.rgb;
	}else{
		fin = fb.rgb *mapr(force,0.96,1.01);
	}
	
	
    gl_FragColor = vec4(fin,1.);

}