precision mediump float;
//vec3 verdejpupper(){return vec3(0.0,1.0,0.8);}

// we need the sketch resolution to perform some calculations

varying vec2 vTexCoord ;

uniform vec2 resolution ;
uniform float time ;
uniform sampler2D tx ;
uniform sampler2D feedback ;
uniform vec2 mouse ;

#define iTime time
#define iResolution resolution


uniform float offsetx ;
uniform float offsety ;



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
	vec2 uv = vTexCoord;
		 uv.y = 1.-uv.y;
	vec4 t2 =  texture2D(tx,uv);
	float t2_f = (t2.r+t2.g+t2.b)/3.;
	
	vec2 uv2 = uv;
		 //uv2.y = 1.-uv.y;

	float limit = 0.5;
	float moffsetx = mapr(offsetx,-limit,limit);
	float moffsety = mapr(offsety,-limit,limit);
	
	uv2+=vec2(t2_f*moffsetx,t2_f*moffsety);
	//uv2*=resolution;
	vec4 t1 =  texture2D(tx, uv2);
	
	
	
	vec3 fin = t1.rgb;

	gl_FragColor = vec4(t1.rgb,1.0);


}