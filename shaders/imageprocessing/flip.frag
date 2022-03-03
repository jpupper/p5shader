precision mediump float;

varying vec2 vTexCoord ;
uniform vec2 resolution ;
uniform float time ;
uniform vec2 mouse ;


#define iTime time
#define iResolution resolution
#define pi 3.14159265359


//#pragma include "../common.frag" //ESta linea tiene todas las definiciones de las funciones globales

uniform sampler2D tx ;

bool flipx = false;
bool mirrorx = false;
float suavizadox = 0.0;
bool flipy = true;
bool mirrory = false;
float suavizadoy = 0.0;

float mapr(float _value,float _low2,float _high2) {
	float val = _low2 + (_high2 - _low2) * (_value - 0.) / (1.0 - 0.);
    //float val = 0.1;
	return val;
}

void main()
{	
	vec2 uv = gl_FragCoord.xy / resolution;	
	vec2 uv2 = gl_FragCoord.xy / resolution;
	uv = vTexCoord;
	/*uv2 = vTexCoord;

	float flip_x =0.0 ; 
	float msuavizadox = mapr(suavizadox,0.0,0.1);
	if(flipx){
		flip_x = smoothstep(1.-uv.x-msuavizadox,1.-uv.x+msuavizadox,0.5);
		//flip_x = step(1.-uv.x,0.5);
	}else{
		//flip_x = smoothstep(uv.x-msuavizadoy,uv.x+msuavizadox,0.5);
		flip_x = step(uv.x,0.5);
	}
	
	float flip_y =0.0 ; 
	float msuavizadoy = mapr(suavizadoy,0.0,0.1);
	if(flipy){
		flip_y = smoothstep(1.-uv.y-msuavizadoy,1.-uv.y+msuavizadoy,0.5);
	}else{
		flip_y = smoothstep(uv.y-msuavizadoy,uv.y+msuavizadoy,0.5);
	}
	if(mirrorx){
		uv2.x = mix(uv2.x,1.-uv2.x, 1.0);
	}
	if(mirrory){
		uv2.y = mix(uv2.y,1.-uv2.y, 1.0);
	}
	uv2*=resolution;*/
	vec4 t1 =  texture2D(tx, uv);	//Lo vuelve a cargar y lo invierte solo no hace falta hacer nada!!
	vec3 fin = t1.rgb;
	gl_FragColor = vec4(fin,1.0); 
}