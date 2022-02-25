precision mediump float;
//vec3 verdejpupper(){return vec3(0.0,1.0,0.8);}

// we need the sketch resolution to perform some calculations
uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;
uniform int mousePressed ;

#define iTime time
#define iResolution resolution
#define pi 3.14159265359



void main(){
	vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec2 uv2 = gl_FragCoord.xy / resolution.xy;
    
	
	float fx = resolution.x/resolution.y;
	uv.x*=fx;
	uv2.x*=fx;
    float t = time *0.1;
	
	
	float my = mouse.y /resolution.y;
    
    uv2 = fract(uv2*floor(2.+1.)); 
    
    vec2 p2 = vec2(0.5) - uv2;
    float r2 = length(p2);
    
	
	float mx = mouse.x /resolution.x;
	

	
	
	float ix = floor(6.0+1.);
	  
	  
	  ix = ix+mod(ix,2.);
	  //if(ix % 2. == 0.){
		//  ix+=1.;
	  //}
	
	
    float tri  = step(sin((uv2.x+uv2.y+t)*pi*ix),0.5);
    float tri2 = step(sin((1.0-uv2.x+uv2.y+t)*pi*ix),0.5);
    
    float f1 = smoothstep(uv2.x,uv2.y,0.5);
    float f2 = smoothstep(uv2.y,uv2.x,0.5);
	float f3 = smoothstep(uv2.y,uv2.x,0.5);
	float f4 = smoothstep(1.-uv2.y,uv2.x,0.5);
    
    float r1 = sin(sin(uv2.x*10.0+time*.0))*0.5+0.5;
    float q = smoothstep(tri,tri2+r1,step(f1,f2))+
              smoothstep(tri2,tri+r1,step(f2,f1))+
			  smoothstep(tri2,tri+r1,step(f3,f2))+
			  smoothstep(tri2,tri+r1,step(f3,f2))+
			  smoothstep(tri2,tri+r1,step(f4,f1))
			  ;

	
	if(mousePressed == 1){
		q = 1.0-q;
	}
	
    gl_FragColor = vec4(vec3(q),1.0);
}