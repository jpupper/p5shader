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