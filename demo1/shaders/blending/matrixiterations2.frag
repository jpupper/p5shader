precision mediump float ;

uniform vec2 resolution ;
uniform float time ;
uniform vec2 mouse ;

varying vec2 vTexCoord;

uniform sampler2D tx ;
uniform sampler2D tx2 ;


uniform float cnt ;
uniform float zoom2 ;
uniform float zoom2_index ;
uniform float freq ;
uniform float speedrot ;
uniform float fractalize ;
uniform float fractalize_index ;
uniform float speedx2 ;
uniform float speedy2 ;
uniform float texturewrap ;
uniform float blendmode ;
uniform float colormix ;


float mapr(float _value,float _low2,float _high2) {
	float val = _low2 + (_high2 - _low2) * (_value - 0.) / (1.0 - 0.);
    //float val = 0.1;
	return val;
}


mat2 scale(vec2 _scale){
    mat2 e = mat2(_scale.x,0.0,
                0.0,_scale.y); 
    return e;
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

#define pi 3.14159265359
void main()
{	 
	vec2 uv = gl_FragCoord.xy / resolution;
	uv = vTexCoord;
	vec2 wruv = uv;
		
	float fix = resolution.x/resolution.y;

	//float mapfase = mapr(fase,-pi/2,pi/2);
	float mapspeedrot = mapr(speedrot,-1.0,1.0);
	int mapcnt = int(floor(mapr(cnt,2.0,10.0)));
	
	int cnt = 5;
	
	
	vec3 dib = vec3(0.0);
	vec3 dib_bm2 = vec3(0.0);
		vec2 uv2 = gl_FragCoord.xy/resolution;
		uv2 = vTexCoord;
//	uv2.x *=fix;
	vec3 col1 = vec3(1.0,0.0,0.0);
	vec3 col2 = vec3(0.0,0.0,1.0);
	
	const int maxcnt = 20;
	for(int i=1; i<maxcnt ; i++){
		vec2 uv2 = gl_FragCoord.xy ;
			  uv2 = vTexCoord;
	    float index = float(i) * pi * 2. *freq / (float(mapcnt)-1.);
		
		float index2 = float(i)/float(mapcnt)*(zoom2_index*5.0);
		
		//uv2-=vec2(0.5);
		uv2-=resolution/2.;
		uv2*= scale(vec2(zoom2+index2));
		uv2+=resolution/2.;
		//uv2+=vec2(0.5);
		
		uv2-=resolution/2.;
	    
		//uv-=vec2(0.5);
		//uv2*= rotate2d(0.0+index+time*mapspeedrot); 
		uv2*= rotate2d(0.0+index); 
		
		uv2+=resolution/2.;
		//uv2+=vec2(0.5);
		
		//uv2/=resolution;
		float index3 = mix(1.0,float(i)/float(mapcnt)*4.0,fractalize_index);
		
		//uv2 = fract(uv2*(10.0*fractalize+1.0)*(index3));
		//uv2.y+=time*speedy2*0.01;
		//uv2.y+=time*speedx2;
		uv2 = fract(uv2*(2.0*fractalize+1.0)*(index3));
		
		vec4 t1 =  texture2D(tx, uv2);	 
		uv2 = abs(2.*fract(uv2*(texturewrap*4.0+1.0))-1.0);
		vec4 t2 =  texture2D(tx2, uv2);
		vec4 t3 =  texture2D(tx2, uv2);
		
	    vec3 colf =mix(col1,col2,float(i)/float(mapcnt));
		     colf = mix(t2.rgb,t3.rgb,float(i)/float(mapcnt));
		
		dib_bm2 = mix(mix(dib_bm2,t1.rgb*colf,t1.rgb),
			mix(dib_bm2,t1.rgb,t1.rgb),
			vec3(1.-colormix));
		dib+=t1.rgb;
		if(i > mapcnt ){
			break ;
		}
	} 
	
	
	
	//vec4 t1 =  texture2D(textura1, uv2);
	//dib += t1.rgb;
	dib/=float(mapcnt)*0.5;
	
	
	vec3 fin = mix(dib,dib_bm2,blendmode);
		
	vec4 t1 =  texture2D(tx, vec2(vTexCoord.x,1.-vTexCoord.y));	

    //fin = t1.rgb;
	gl_FragColor = vec4(fin,1.0);  
}