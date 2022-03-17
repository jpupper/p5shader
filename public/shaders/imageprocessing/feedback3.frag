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
	//float fx = resolution.x/resolution.y;
		uv = vTexCoord;
	float mapsc = mapr(sc,0.99,1.01);
	vec2 puv = uv;
	
	vec4 t1 =  texture2D(tx, vec2(uv.x,1.-uv.y));
	
	

	float t1m  = (t1.r+t1.g+t1.b)/3.;
	//float mofx = t1m*mapr(sctx1,-3.5,3.5);
	//float mofy = t1m*mapr(scty1,-3.5,3.5);
	
	//float mttx1 = t1m*mapr(ttx1,-0.5,0.5);
	//float mtty1 = t1m*mapr(tty1,-0.5,0.5);
	//puv.x+=mapr(speedx,-0.03,0.03);
	//puv.y+=mapr(sasa,-0.03,0.03);
	//puv.x+=mttx1;
	//puv.y+=mtty1;
	//puv.y+=0.1;
	puv-=vec2(0.5);
/*	puv = scale(vec2(mapsc+mofx,
					 mapsc+mofy))*puv;*/
	
	puv = scale(vec2(mapsc,mapsc))*puv;
	puv+=vec2(0.5);
	//puv = abs(.5-fract(puv*mapr(fb_fract,1.0,3.0)));
	//puv*=resolution;

	puv.x+=mapr(speedx,-0.03,0.03);
	puv.y+=mapr(speedy,-0.03,0.03);



	//puv.x-=0.5;

	vec4 fb =  texture2D(feedback, vec2(puv.x,1.-puv.y));
	vec3 fin = vec3(0.);
	

//	fin = t1.rgb+fb.rgb ;
	
	if(limit < t1.r && 
	   limit < t1.g && 
	   limit < t1.b){
		fin = t1.rgb;
	}else{
		fin = fb.rgb *mapr(force,0.96,1.01);

		//fin = fb.rgb *.1;
	}

	//	fin = t1.rgb+fb.rgb *.4;
	//fin = t1.rgb;
	//fin = t1.rgb;
	
	
	//fin = mix(fb.rgb,t1.rgb,t1.rgb);
		
	//vec3 fin2 = vec3(force,force2,lala);
	gl_FragColor = vec4(fin,1.0);
}