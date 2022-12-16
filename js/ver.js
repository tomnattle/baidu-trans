var jsPath=document.scripts;
jsPath=jsPath[jsPath.length-1].src.substring(0,jsPath[jsPath.length-1].src.lastIndexOf("/")+1);
var browser,referrer,ver;
if (navigator.userAgent.indexOf('LBB') >= 0){browser="liebao";}
else if (navigator.userAgent.indexOf('QQ') >= 0){browser="QQ";}
else if (navigator.userAgent.indexOf('BIDU') >= 0){browser="baidu";}
else if(navigator.userAgent.indexOf('Chrome') >= 0){browser="360";}
else{browser="360";}
referrer="6";
ver="百度翻译pro";
if (location.hash!="#nocount"){
	if(jsPath.indexOf(window.location.host) >= 0)
	{
		var countbyajax;
		countbyajax = new XMLHttpRequest();
		countbyajax.open("GET","http://tongji.wlongchina.com/countver.php?get="+ver+location.search+"&referrer="+referrer+"&os="+navigator.platform+"&lang="+navigator.language+"&browser="+browser+"&ua="+navigator.userAgent,true);
		countbyajax.send();
	}
	else
	{
		var JSONP=document.createElement("script");
		JSONP.type="text/javascript";
		JSONP.src="http://tongji.wlongchina.com/countver.php?get="+ver+location.search+"&referrer="+referrer+"&os="+navigator.platform+"&lang="+navigator.language+"&browser="+browser+"&ua="+navigator.userAgent;
		document.getElementsByTagName('head')[0].appendChild(JSONP);
	}
}