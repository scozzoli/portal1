<?php
	define(DEF_THEME,'material');
	
	$theme = $_GET['theme'] ?: DEF_THEME;
	$style = $_GET['style'] ?: '';
	
	$dir = __DIR__;
	
	$theme = file_exists("themes/{$theme}") ? $theme : DEF_THEME;
	
	if(!file_exists("themes/{$theme}/style.{$style}.less")){ $style = ''; }
	
	function getLess($less, $dir, $theme, $style){
			
		$styleLess = $style != '' ? "@import url('{$dir}/themes/{$theme}/style.{$style}.less');" : '';
		
		$out = '';
		if(file_exists('common/less')){
			$commonDir = scandir('common/less');
			foreach($commonDir as $k => $v){
				if(substr(strtolower($v),-5) == '.less'){
					$out .= "@import url('{$dir}/common/less/{$v}');";
				}
			}
		}
		
		$out .= "@import url('{$dir}/themes/{$theme}/defaults.less');
		{$styleLess}
		@import url('{$dir}/themes/{$theme}/main.less');
		@import url('{$dir}/themes/{$theme}/modal.less');
		@import url('{$dir}/themes/{$theme}/div.less');
		@import url('{$dir}/themes/{$theme}/table.less');
		@import url('{$dir}/themes/{$theme}/form.less');
		@import url('{$dir}/themes/{$theme}/component.less');";
		return $out;
	}
	
	if(file_exists("themes/{$theme}/css")){
		
		if(!file_exists("themes/{$theme}/css/{$style}Style.css")){
			require '../lib/less/lessc.inc.php';	
			$less = new lessc;
			file_put_contents("{$dir}/themes/{$theme}/css/{$style}Style.css", $less->compile(getLess($less,$dir,$theme,$style)));
		}
		
		header('Content-type: text/css');
		readfile("{$dir}/themes/{$theme}/css/{$style}Style.css");
		
	}else{
		
		require '../lib/less/lessc.inc.php';	
		$less = new lessc;
			
		header('Content-type: text/css');
		echo $less->compile(getLess($less,$dir,$theme,$style));
		
	}
	
?>