<?php
	$newUID = $pr->post("New-Uid");
	$theme = explode(':',$pr->post("themeselector"));
	
	$usr_list = $sysConfig->loadUsr();
	
	$js='';
	
	if($newUID==''){
		$pr->addAlertBox("Il codice uetnte non pu&eacute; essere vuoto")->set('CloseWin',false)->response();
	}
	if($newUID != $pr->post("Old-Uid")){
		if($pr->post("Old-Uid")=='root'){$pr->addAlertBox("<b>Root</b> non &eacute; un utente modificabile!")->set('CloseWin',false)->response();}
		if($pr->post("Old-Uid")=='guest'){$pr->addAlertBox("<b>Guest</b> non &eacute; un utente modificabile!")->set('CloseWin',false)->response();}
		if(isset($usr_list[$newUID])){$pr->addAlertBox("Il nuovo codice utente <b>".$newUID."</b> esiste gi&aacute;!")->set('CloseWin',false)->response();}
		$usr_list[$newUID] = $usr_list[$pr->post("Old-Uid")];
		unset($usr_list[$pr->post("Old-Uid")]);
		$js='$("#input_cerca_utente").val("'.$newUID.'");';
	}
	$usr_list[$newUID]["nome"] = $pr->post("nome");
	if($pr->post("pwd") != ''){$usr_list[$newUID]["pwd"] = md5($pr->post("pwd"));}
	
	$k = 0;
	$ext = array();
	while($pr->post('ext_key_'.$k,false) !== false){
		if($pr->post('ext_key_'.$k) != ''){
			$ext[$pr->post('ext_key_'.$k)] = $pr->post('ext_val_'.$k);
		}
		$k++;
	}
	
	$usr_list[$newUID]["use_pwd"] = $pr->post("use_pwd");
	$usr_list[$newUID]["menu"] = $pr->post("menu");
	$usr_list[$newUID]["email"] = $pr->post("email");
	$usr_list[$newUID]["showsidemenu"] = $pr->post("showsidemenu");
	$usr_list[$newUID]["db"] = $pr->post("db");
	$usr_list[$newUID]["lang"] = $pr->post("lang");
	$usr_list[$newUID]["nome"] = $pr->post("nome");
	$usr_list[$newUID]["grpdef"] = $pr->post("grpdef");
	$usr_list[$newUID]["acc_dev"] = $pr->post("acc_dev");
	$usr_list[$newUID]["acc_err"] = $pr->post("acc_err");
	$usr_list[$newUID]["acc_dis"] = $pr->post("acc_dis");
	$usr_list[$newUID]["acc_priv"] = $pr->post("acc_priv");
	$usr_list[$newUID]["theme"] = $theme[0];
	$usr_list[$newUID]["style"] = $theme[1];
	$usr_list[$newUID]["http"] = $pr->post("http");
	$usr_list[$newUID]["https"] = $pr->post("https");
	$usr_list[$newUID]["extension"] = $ext;
	$usr_list[$newUID]["events"] = $pr->post("events");
	$grpkey = explode(':',$pr->post("Grp-key-list"));
	unset($usr_list[$newUID]["grp"]);
	foreach($grpkey as $k){
		if($pr->post("Grp-dett-".$k)==-1){continue;}
		$usr_list[$newUID]["grp"][$k] = $pr->post("Grp-dett-".$k);
	}
	$sysConfig->saveUsr($usr_list);
	
	$pr->addScript($js.'pi.requestOnLoad("cerca_utente");')->response();
?>