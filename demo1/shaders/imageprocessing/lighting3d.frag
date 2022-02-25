precision mediump float;
//vec3 verdejpupper(){return vec3(0.0,1.0,0.8);}

// we need the sketch resolution to perform some calculations
uniform vec2 resolution ;
uniform float time ;
uniform sampler2D tx ;
uniform sampler2D feedback ;
uniform vec2 mouse ;



varying vec2 vTexCoord ;

#define iTime time
#define iResolution resolution


uniform float height ;
uniform float light_dir_x ;
uniform float light_dir_y ;
uniform float light_dir_z ;
uniform float ambient ;
uniform float diffuse ;
uniform float specular_red ;
uniform float specular_green ;
uniform float specular_blue ;
uniform float specular_size ;
 
 
 
 
 float mapr(float _value,float _low2,float _high2) {
	float val = _low2 + (_high2 - _low2) * (_value - 0.) / (1.0 - 0.);
    //float val = 0.1;
	return val;
}

mat2 rot(float a) {
  float c=cos(a);
  float s=sin(a);
  return mat2(c,s,-s,c);
}

float bri(vec2 p) {
	
	
	return length(texture2D(tx, p/resolution))*mapr(height,-300.,300.);
}



vec3 normal(vec2 z) {
	vec2 d = vec2(1.,0.);
	return normalize(cross(
	vec3(d.x,0.,bri(z-d.xy)-bri(z+d.xy)),
	vec3(0.,d.x,bri(z-d.yx)-bri(z+d.yx))));
	z.y = 1.0-z.y;
	//return normalize(cross(
//	vec3(d.x,0.,bri(z-d.xy)-bri(z+d.xy)),
//	vec3(0.,d.x,bri(z-d.yx)-bri(z+d.yx))));
//	
	//return vec3(0.0);
}


void main()
{
	vec2 d = vec2(1.,0.);	
	vec2 uv = gl_FragCoord.xy/resolution;
	//uv.y= 1.0-uv.y;
	uv = vTexCoord;
	uv.y = 1.0-uv.y;
	vec3 t1 =  texture2D(tx, uv).rgb;
	vec2 z = uv*resolution;

	//z/=resolution;


	vec2 zdxy1 = z-d.xy;
	vec2 zdxy2 = z+d.xy;
	vec2 zdyx1 = z-d.yx;
	vec2 zdyx2 = z+d.yx;
/*	zdxy1.y = 1.0-zdxy1.y;	
	zdxy2.y = 1.0-zdxy2.y;	
	zdyx1.y = 1.0-zdyx1.y;	
	zdyx2.y = 1.0-zdxy1.y;	
	*/
	
	
	vec3 n= normal(zdxy1)+normal(zdxy2);
	     n+=normal(zdyx1)+normal(zdyx2);
		 n/=4.;
	
	//n.y = 1.0-n.y;
	
	//n=vec3(1.,0.,0.);
	vec3 lightdir=normalize(vec3(light_dir_x-.5,light_dir_y-.5,light_dir_z));

	float diff=max(0.,dot(n,lightdir))*diffuse;
	float spec_red  =pow(max(0.,dot(reflect(-n,vec3(0.,0.,-1.)),lightdir)),1.+specular_size*100.)*specular_red;
	float spec_green=pow(max(0.,dot(reflect(-n,vec3(0.,0.,-1.)),lightdir)),1.+specular_size*100.)*specular_green;
	float spec_blue =pow(max(0.,dot(reflect(-n,vec3(0.,0.,-1.)),lightdir)),1.+specular_size*100.)*specular_blue;
	
	
	
	
	t1*=diff*2.+ambient*2.;
	t1+=vec3(spec_red,spec_green,spec_blue)*2.;

	gl_FragColor = vec4(t1.rgb,1.);
}
