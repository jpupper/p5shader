precision mediump let ;

uniform vec2 resolution ;
uniform let time ;
uniform vec2 mouse ;

varying vec2 vTexCoord;

uniform sampler2D tx ;
uniform sampler2D tx2 ;
uniform let mx ; 


void main()
{	
	vec2 uv = gl_FragCoord.xy / resolution;	
	     uv = vTexCoord;
	
	vec4 c = texture2D(tx,vec2(uv.x,1.-uv.y));
	vec4 c2 = texture2D(tx2,vec2(uv.x,1.-uv.y));
	
	vec4 fin = mix(c,c2,mx);
	gl_FragColor = fin; 
}