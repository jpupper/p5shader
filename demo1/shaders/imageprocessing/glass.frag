precision mediump float ;

uniform vec2 resolution ;
uniform float time ;
uniform vec2 mouse ;


varying vec2 vTexCoord;

uniform sampler2D tx ;


//PARAMETROS
uniform float rotacionLuz ; //en grados
uniform float tamanioLuz ;  
uniform float brilloLuz ;

float tamanioMarco = 1.;
float det=.001, maxd=30., g=0.;

mat2 rot(float a)
{
    float s=sin(a), c=cos(a);
    return mat2(c,s,-s,c);
}

float box(vec3 p, vec3 c) {
    vec3 b=abs(p)-c;
    return length(max(vec3(0.),b));
}

float de(vec3 p) {
    float x=tamanioMarco*5.4;
    float y=tamanioMarco*5.4;
    p.z-=pow(abs(p.x)/x,30.);
    p.z-=pow(abs(p.y)/y,30.);
    float d=box(p,vec3(x,y,1.));
    return min(d,d)*.5;
}

vec3 normal(vec3 p)
{
    vec2 e=vec2(0.,det);
    return normalize(vec3(de(p+e.yxx),de(p+e.xyx),de(p+e.xxy))-de(p));
}

float mapr(float _value,float _low2,float _high2) {
	float val = _low2 + (_high2 - _low2) * (_value - 0.) / (1.0 - 0.);
    //float val = 0.1;
	return val;
}
vec3 march(vec3 from, vec3 dir)
{
    vec3 p, col=vec3(0.);
    float d, td=0.;
    for (int i=0; i<80; i++)
    {
        p=from+td*dir;
        d=de(p);
        if (d<det || td>maxd) break;
        td+=d;
    }
    if (d<det)
    {
        p-=det*dir;
        vec3 n=normal(p);
        vec3 ldir=normalize(vec3(vec2(0.,-1.)*rot(radians(mapr(rotacionLuz,0.0,360.0))),-1.*mapr(tamanioLuz,0.0,1.2)));
        vec3 ref=reflect(ldir,n);
        float spec=pow(max(0.,dot(dir,ref)),15.)*brilloLuz;
        //spec=smoothstep(0.9,1.,spec)*.5;
		
        col=vec3(spec)+.0;
       // p.x+=0.2;
    }


    //uv = vTexCoord ;
	vec3 img=texture2D(tx,vec2(vTexCoord.x,1.-vTexCoord.y)).rgb;

   

    
	col+=img;
    return col+g*vec3(1.,0.2,1.)*0.;
}

void main(){
	
	vec2 uv = (gl_FragCoord.xy-resolution.xy*.0)/resolution.xy-.5;
         uv = vTexCoord ;
         uv = vec2(vTexCoord.x*.5,vTexCoord.y);
    vec3 from = vec3(0,0,-11.);
    vec3 dir = normalize(vec3(uv,1.));
    vec3 col = march(from, dir);
     
    vec4 img2 = texture2D(tx,vec2(vTexCoord.x,1.-vTexCoord.y));

    /*vec3 chromacol = vec3(0.0,1.0,.0);
    float alpha = 1.0;
    if(distance(col.rgb,chromacol) < 0.65){
      alpha = 0.0;
    } */


    // Output to screen
    gl_FragColor = vec4(col,img2.a);
}