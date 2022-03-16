precision mediump float;
//vec3 verdejpupper(){return vec3(0.0,1.0,0.8);}

// we need the sketch resolution to perform some calculations
uniform vec2 resolution ;
uniform float time ;
uniform vec2 mouse ;

#define iTime time
#define iResolution resolution
float PI = 3.14159265359;

#define pi PI
#define OCTAVES 8

varying vec2 vTexCoord ;

uniform float cnt ;
uniform float amp ;
uniform float rsc1 ;
uniform float rsc2 ;
uniform float rsc3 ;
uniform float asc_freq ;
uniform float asc_amp ;
uniform float detalle_amp ;
uniform float detalle_freq ;
uniform float faser ;
uniform float faseg ;
uniform float faseb ;


float mapr(float _value,float _low2,float _high2) {
	float val = _low2 + (_high2 - _low2) * (_value - 0.) / (1.0 - 0.);
    //float val = 0.1;
	return val;
}


float desf(vec2 uv,float fas){
	
	float fix = resolution.x/resolution.y;
	float e= 0.0;
	
	
	int mcnt = int(floor(mapr(cnt,1.0,10.0)));
	int mcnt2 = int(floor(mapr(cnt,0.0,10.0)));
	
/*	float maprsc1 = mapr(rsc1,0.0,30.);
	float maprsc2 = mapr(rsc2,0.0,30.);
	float maprsc3 = mapr(rsc3,0.0,30.);
	float masc_freq = floor(mapr(asc_freq,0.0,10.0));
	float masc_amp = mapr(asc_amp,0.0,10.0);
	*/
	
	
	float maprsc1 = mapr(rsc1,0.0,30.);
	float maprsc2 = mapr(rsc2,0.0,30.);
	float maprsc3 = mapr(rsc3,0.0,30.);
	float masc_freq = floor(mapr(asc_freq,0.0,10.0));
	float masc_amp = mapr(asc_amp,0.0,5.0);
	
	
	const int cnt2 = 10;
		for(int i=0; i<cnt2; i++){	
		
			float fase = float(i)*pi*2./float(mcnt);
			float posx = sin(fase)*amp;
			float posy = cos(fase)*amp;
			vec2 p2 = vec2(0.5*fix+posx,0.5+posy) - uv;
			float r2 = length(p2);
			float a2= atan(p2.x,p2.y);
			e+= sin(r2*maprsc1+time+fas+sin(r2*maprsc2+sin(r2*maprsc3))+sin(a2*masc_freq)*masc_amp);
			e+= sin(e*mapr(detalle_freq,0.0,20.))*mapr(detalle_amp,0.0,0.4);

			if(i > mcnt2){
				break;
			}
		}
	
	e/=float(mcnt);
	return e;
}

void main()
{	
	vec2 uv = gl_FragCoord.xy / resolution;
		 uv = vTexCoord;
	float fix = resolution.x/resolution.y;
	uv.x*=fix;
	
	vec2 coords = gl_FragCoord.xy ;
	//vec4 fb =  texture2D(feedback, coords*resolution.xy);
	

	vec2 p = vec2(0.5*fix,0.5);
	float r = length(p);
	float a = atan(p.x,p.y);
	
	vec3 dib = vec3(0.0);

	float dr = desf(uv,mapr(faser,-pi,pi));
	float dg = desf(uv,mapr(faseg,-pi,pi));
	float db = desf(uv,mapr(faseb,-pi,pi));
	
	
	float dr2 = desf(uv,0.);
	float dg2 = desf(uv,0.);
	float db2 = desf(uv,0.);
	
	dib = vec3(dr,dg,db)+vec3(dr2,dg2,db2);
	
	vec3 fin = dib;
	
	gl_FragColor = vec4(fin,1.0); 
}
