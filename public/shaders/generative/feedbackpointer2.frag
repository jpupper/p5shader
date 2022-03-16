precision mediump float;
//vec3 verdejpupper(){return vec3(0.0,1.0,0.8);}

// GLOBAL UNIFORMS : 
uniform vec2 resolution ;
uniform float time ;
uniform vec2 mouse ;
uniform sampler2D feedback ;
uniform int touchesCount ;
uniform int mousePressed ;
uniform vec2 tp1 ;
uniform vec2 tp2 ;
uniform vec2 tp3 ;
uniform vec2 tp4 ;
uniform vec2 tp5 ;


uniform vec2 punto1 ;
uniform vec2 punto2 ;
uniform vec2 punto3 ;
uniform vec2 punto4 ;
uniform vec2 punto5 ;
uniform vec2 punto6 ;



uniform float r1 ; 
uniform float g1 ; 
uniform float b1 ; 

uniform float siz ;

uniform float mflag ;
uniform float automatic ; 

const int maxtouches = 5;


#define iTime time
#define iResolution resolution

#define PI 3.14159265359
#define TWO_PI 6.28318530718

#define OCTAVES 8
#define pi 3.14159265359




mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,
                0.0,_scale.y);
}
mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}
float mapr(float _value,float _low2,float _high2) {
	float val = _low2 + (_high2 - _low2) * (_value - 0.) / (1.0 - 0.);
    //float val = 0.1;
	return val;
}


uniform float speed ;
uniform float frac1 ;
uniform float seed ;
vec2 scale(vec2 uv, float s);

mat2 scale(vec2 _scale);
mat2 rotate2d(float _angle); 

float voronoi(vec2 uv);
float voronoi(vec2 uv,float circle);

float t = 0.0;

vec2 random3( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

vec3 voronoi2( in vec2 x ) {
    vec2 n = floor(x);
    vec2 f = fract(x);

    // first pass: regular voronoi
    vec2 mg, mr;
    float md = 8.0;
    for (int j= -1; j <= 1; j++) {
        for (int i= -1; i <= 1; i++) {
            vec2 g = vec2(float(i),float(j));
            vec2 o = random3( n + g +seed);
            o = 0.5 + 0.5*sin( time* speed+ 6.2831*o );

            vec2 r = g + o - f;
            float d = dot(r,r);

            if( d<md ) {
                md = d;
                mr = r;
                mg = g;
            }
        }
    }

    // second pass: distance to borders
    md = 8.0;
    for (int j= -2; j <= 2; j++) {
        for (int i= -2; i <= 2; i++) {
            vec2 g = mg + vec2(float(i),float(j));
            vec2 o = random3( n + g +seed );
            o = 0.5 + 0.5*sin( time* speed + 6.2831*o ); 

            vec2 r = g + o - f;

            if ( dot(mr-r,mr-r)>0.00001 ) {
                md = min(md, dot( 0.99995*(mr+r), normalize(r-mr) ));
            }
        }
    }
    return vec3(md, mr);
}

float voronoi_v2(vec2 uv){
 // Scale
   // uv *= 10.;

    // Tile the space
    vec2 i_st = floor(uv);
    vec2 f_st = fract(uv);

    float m_dist = uv.x;  // minimun distance
    vec2 m_point;        // minimum point

    for (int j=-1; j<=1; j++ ) {
        for (int i=-1; i<=1; i++ ) {
            vec2 neighbor = vec2(float(i),float(j));
            vec2 point = random3(i_st + neighbor+seed);
            point = 0.5 + 0.5*sin(time* speed + 6.2831*point);
            vec2 diff = neighbor + point - f_st;
            float dist = length(diff);

            if( dist < m_dist ) {
                m_dist = dist;
                m_point = point;
            }
        }
    }   
    return dot(m_point,vec2(.1,1.0));
}
vec3 rgb2hsb2( in vec3 c ){
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
vec3 lm(vec3 col, vec3 mx, vec3 dec){
		if(col.r > mx.r){col.r -=dec.r;}
		if(col.g > mx.g){col.g -=dec.g;}
		if(col.b > mx.b){col.b -=dec.b;}
		return col;
}
vec3 mouseDraw(vec2 uv , float dif, float siz){
	 float fx = resolution.x/resolution.y;
	vec3 dib = vec3(0.0);
	vec2 mp = vec2(mouse.x*fx,1.-mouse.y) ;
	vec2 p = mp-uv;
	float r = length(p);
	float e = 1.-smoothstep(siz,siz+dif,r);
	
	dib+=vec3(e);
	
	return dib;
	
}

vec3 pointDraw(vec2 uv ,vec2 pos, float dif, float siz){
	 float fx = resolution.x/resolution.y;
	vec3 dib = vec3(0.0);
	vec2 mp = vec2(pos.x*fx,1.-pos.y) ;
	vec2 p = mp-uv;
	float r = length(p);
	float e = 1.-smoothstep(siz,siz+dif,r);
	
	dib+=vec3(e);
	
	return dib;
	
}
vec3 pointDrawMirror(vec2 uv ,vec2 pos, float dif, float siz){

	vec3 d = vec3(0.0);

	d+=pointDraw(uv,pos,dif,siz);
	d+=pointDraw(uv,vec2(1.-pos.x,1.-pos.y),dif,siz);
	d+=pointDraw(uv,vec2(pos.x,1.-pos.y),dif,siz);
	d+=pointDraw(uv,vec2(1.-pos.x,pos.y),dif,siz);
	return d;
}
vec3 touchesDraw2(vec2 uv , float dif, float siz){
	vec3 dib = vec3(0.0);
	float fx = resolution.x/resolution.y;


	vec2 p_tp1 = vec2(tp1.x*fx,1.-tp1.y) -uv;
	float r_tp1 = length(p_tp1);
	float e_tp1 = smoothstep(0.1,0.0,r_tp1);

	vec2 p_tp2 = vec2(tp2.x*fx,1.-tp2.y) -uv;
	float r_tp2 = length(p_tp2);
	float e_tp2 = smoothstep(0.1,0.0,r_tp2);

	vec2 p_tp3 = vec2(tp3.x*fx,1.-tp3.y) -uv;
	float r_tp3 = length(p_tp3);
	float e_tp3 = smoothstep(0.1,0.0,r_tp3);

	vec2 p_tp4 = vec2(tp4.x*fx,1.-tp4.y) -uv;
	float r_tp4 = length(p_tp4);
	float e_tp4 = smoothstep(0.1,0.0,r_tp4);

	vec2 p_tp5 = vec2(tp5.x*fx,1.-tp5.y) -uv;
	float r_tp5 = length(p_tp5);
	float e_tp5 = smoothstep(0.1,0.0,r_tp5);


	if(touchesCount > 0){
		dib+= e_tp1;
	}
	if(touchesCount > 1){
		dib+= e_tp2;
	}
	if(touchesCount > 2){
		dib+= e_tp3;
	}
	if(touchesCount > 3){
		dib+= e_tp4;
	}
	if(touchesCount > 4){
		dib+= e_tp5;
	}
	/*for(int i=0; i<maxtouches; i++){
		if(i == touchesCount){
			break;
		}
		vec2 tp = vec2(touchesPos[i].x*fx,1.-touchesPos[i].y);
		vec2 p2 = tp-uv;
		float r2 = length(p2);
		
		float e2 = 1.-smoothstep(siz,siz+dif,r2);
		
		dib+=e2;		
	}*/
	return dib;
}
void main(void)
{   
    

	vec2 uv = gl_FragCoord.xy / resolution;
	vec2 puv = uv;
	float fx = resolution.x/resolution.y;
	uv.x*=fx;
	vec3 dib = vec3(0.0);
	vec2 pt1 =vec2(0.5);
	
	float size  = 0.04;

	if(mousePressed == 1){
		//dib+=mouseDraw(uv,size,0.0)*.1;
	}else{
	//	dib+=touchesDraw2(uv,0.03 ,0.0)*.1;
	
	}


	float sizz = mapr(siz,0.00,0.05) ;
	      //sizz = siz;
	if(automatic == 0.0 ){
		dib+=pointDrawMirror(uv,punto1,sizz,0.0)*0.02;
		dib+=pointDrawMirror(uv,punto2,sizz,0.0)*0.02;
		//dib+=pointDrawMirror(uv,punto3,sizz,0.0)*0.02;
	}
	else{
		if(mousePressed == 1){
			dib+=pointDrawMirror(uv,vec2(mouse.x,mouse.y),sizz,0.0)*0.02;
		}
	}
	

	puv-=vec2(0.5);
	//puv*=scale(vec2(1.001-dib*0.7));
	puv+=vec2(.5);


  vec4 prev = texture2D(feedback,vec2(puv.x,1.-puv.y));

  vec3 fin = dib*0.95 + prev.rgb*1.011;

  float mr1 = mapr(r1,0.0,0.3);
  float mg1 = mapr(g1,0.0,0.3);
  float mb1 = mapr(b1,0.0,0.3);

  vec3 dec = vec3(0.7+mr1,.7+mg1,.7+mb1);
       //dec = vec3(r1,g1,b1);
  vec3 limit = vec3(.5);
       fin = lm(fin,dec,limit);

	   if(mflag == 1.0){
		 fin = vec3(0.0);
		 prev.rgb = vec3(0.0);
	   }
      // if(touchesCount > 2 || mousePressed == 1){
       //	fin = fin*.8;
       //	}
      // fin*=.89;
	gl_FragColor = vec4(fin, 1.0);
   
}
