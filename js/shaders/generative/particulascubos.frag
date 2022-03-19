precision mediump float;
//vec3 verdejpupper(){return vec3(0.0,1.0,0.8);}

// we need the sketch resolution to perform some calculations
uniform vec2 resolution ;
uniform float time ;
uniform vec2 mouse ;

#define iTime time
#define iResolution resolution
#define pi 3.14159265359
float speed = 0.56;
float distmax = 0.69;
float cajasizx = 0.27;
float cajasizy = 0.0;
float cajasizz = 0.39;  
vec3 objcol;
vec3 verdejpupper(){return vec3(0.0,1.0,0.8);}
// FUNCION DE ROTACION


float det = 0.1;
float maxdist = 30.;
const int maxsteps = 100;

mat2 rot(float a) {
    float s=sin(a), c=cos(a);
    return mat2(c,s,-s,c);
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}
// FUNCIONES DE DISTANCIA PRIMITIVAS 

float sphere(vec3 p, float rad) {
    return length(p) - rad;
}

float box(vec3 p, vec3 c){
    p=abs(p)-c;
    return length(max(p,0.))+min(0.,max(p.z,max(p.x,p.y)));
}

float obj1(vec3 p,vec3 s) {
    s.y+=1.-abs(p.x);
    s.y*=.8;
	s.x*=cajasizx*10.;
	s.y*=cajasizy*10.;
	s.z*=cajasizz*10.;
    float box = box(p, s);
    float sph = sphere(p,0.5);
    float d = box;
    return d;
}

float obj2(vec3 p) 
{
    float box = box(p, vec3(0.2,0.1,0.2));
  
    // de esta manera le restamos al cubo la forma de la esfera
    float d = box;
    return d;
}


// FUNCION DE ESTIMACION DE DISTANCIA
float opSmoothUnion( float d1, float d2, float k ) {
    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) - k*h*(1.0-h); }

float opSmoothSubtraction( float d1, float d2, float k ) {
    float h = clamp( 0.5 - 0.5*(d2+d1)/k, 0.0, 1.0 );
    return mix( d2, -d1, h ) + k*h*(1.0-h); }

float opSmoothIntersection( float d1, float d2, float k ) {
    float h = clamp( 0.5 - 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) + k*h*(1.0-h); }
    
   
float de(vec3 p) 
{
	
	vec3 p2_2 = p;
	float time2 = iTime*speed;
    float ms = floor(2.0)+1.;
	
	
	
	mat2 rotxz = rotate2d(mouse.x*0.005);
    mat2 rotyz = rotate2d(mouse.y*0.005);
    
	/*from.xz*=rotxz;
    dir.xz*=rotxz;
    from.xy*=rotyz;
    dir.xy*=rotyz;
    */
	
	p.xz*=rotxz;
	p.yz*=rotyz;
	
    float indexy = floor(p.z/ms);
	 float indexz = floor(p.x/ms);
    p.xy *= rot(time2*.03+indexy);
	p.xz *= rot(time2*.0+indexy);
    float id2 = floor(p.z/ms);
    p.x = mod(p.x, ms) - ms/2.;
    p.z = mod(p.z, ms) - ms/2.;
    vec3 p3 = p;
    float obj2 = obj2(p3); //Columna
    vec3 p2 = p;
    float ms2 = 2.0;
    p2.y+=time2;
    float id = floor(p2.y/ms2);
    p2.y = mod(p2.y,ms2) -ms2/2.;
    p2.xz*=rot(time2*2.+id*1.);
	p2.xy*=rot(time2*2.+id*1.);
    float obj1 = obj1(p2,vec3(0.1,0.1,0.2));
	
	//p2_2.z-=10.;
	
	p2_2.z+=15.;
	
	
	//p2_2.z+=2.;
	float esf = sphere(p2_2, 1.7);
	
	//obj1 = min(obj1, esf);
    
	obj1 = max(-esf,obj1);
    
	float d = obj1;
	
	
	
	
    if (d == obj2){ 
		objcol = vec3(.0, 0.0, 0.7+sin(id)+.8);
	}
    if (d == obj1) objcol = vec3(0.7+sin(id)*.4+.8,0.4, 0.4+sin(id*3.)*.4+.8);
    return d*0.8;

//	return 0.8;
}
 
// FUNCION NORMAL

vec3 normal(vec3 p) 
{   
    vec2 d = vec2(0., det);
    return normalize(vec3(de(p + d.yxx), de(p + d.xyx), de(p + d.xxy)) - de(p));
}

vec3 shade(vec3 p, vec3 dir) {
    vec3 lightdir = normalize(vec3(1.5, 1.2, -1.)); 
    vec3 col = objcol;
    vec3 n = normal(p);
    float diff = max(0.2, dot(lightdir, n));
    vec3 refl = reflect(dir, n);
    float spec = pow(max(0.2, dot(lightdir, refl)), 5.);
    float amb = .1;
    return (col*(amb + diff) + spec * .8);
}


// FUNCION DE RAYMARCHING

vec3 march(vec3 from, vec3 dir) {
    float d, td=0.;
    vec3 p =vec3(0.);
    vec3 col = vec3(0.);
    for (int i=0; i<maxsteps; i++) 
    {
        p = from + td * dir;
        d = de(p);
        if (d < det || td > maxdist*distmax) break;
        td += d;
    }
    if (d < det){
        p -= det * dir;
        col = shade(p, dir);
    }
    else {
        p = from + maxdist*distmax * dir;
    }
     col = mix(vec3(.0),col, exp(-.0005*td*td));
    return col;    
}

// MAIN


void main(){
	
	vec2 uv = gl_FragCoord.xy/iResolution.xy - .5; 
	
	float time2 = iTime*speed;
    uv.x *= iResolution.x / iResolution.y; 
    
    vec3 from = vec3(0., 0., -15.);
 
    vec3 dir = normalize(vec3(uv, 1.));
    //dir.yx*=rot(.8+time2);
    
	
	mat2 rotxz = rotate2d(mouse.x*0.005);
    mat2 rotyz = rotate2d(mouse.y*0.005);
    
    
    /*from.xz*=rotxz;
    dir.xz*=rotxz;
    from.xy*=rotyz;
    dir.xy*=rotyz;
    */
	
	
	
	
    from.x-=sin(time2);
 
    vec3 col = march(from, dir);

 //  vec3 col = verdejpupper();
  // render to screen
  gl_FragColor = vec4( col, 1.0);
}