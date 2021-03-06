<?php
	$mod_list = $sysConfig->loadMod();
	$grp_list = $sysConfig->loadGrp();
	$i18n = $sysConfig->loadI18n();

	$grp_sel ='<select name="grp">';
	$id = $pr->post("ID",'');

	foreach($grp_list as $k => $v){
		$grp_sel.='<option value="'.$k.'">'.$k.' - '.$sysConfig->i18nGet($v["nome"]).'</option>';
	}
	$grp_sel.='</select>';

	$fill = $mod_list[$id];
	unset($fill['nome']);
	unset($fill['des']);
	$descr = '<table class="lite green">
		<tr>
			<th colspan="2"><i18n>mod:iface:lang</i18n></th>
			<th><i18n>mod:iface:name</i18n></th>
			<th><i18n>mod:iface:desc</i18n></th>
		</tr>';
	foreach($i18n['langs'] as $k => $v){
		$descr .= '<tr>
			<td style="text-align:right"><b> '.$v['des'].'<b></td>
			<td> <img src="./style/img/'.$v['icon'].'"> </td>
			<td><input type="text" class="" name="nome_'.$k.'"></td>
			<td><input type="text" class="double" name="des_'.$k.'"></td>
		</tr>';
		$fill['nome_'.$k] = $mod_list[$id]['nome'][$k] ?: '';
		$fill['des_'.$k] = $mod_list[$id]['des'][$k] ?: '';
	}
	$descr .= '</table>';


	$out='<div class="green focus">
			<i18n>mod:win:info;'.$sysConfig->i18nGet($mod_list[$id]["nome"]).'</i18n>
		</div>
		<div style="text-align:left;">
		<div id="Mod_Del">
			<input type="hidden" name="Mid" value="'.$id.'">
			<input type="hidden" name="Q" value="Mod/Del">
		</div>
		<div id="mod_mod">
			<table class="form">
				<tr>
					<th><i18n>mod:iface:modId</i18n></th>
					<td>
						<input type="text" class="ale" name="New-Id" value="'.$id.'" id="focusme">
						<input type="hidden" name="Old-Id" value="'.$id.'" id="MID">
						<input type="hidden" name="icon">
						<input type="hidden" name="Q" value="Mod/Mod">
					</td>
				</tr>
				<tr>
					<th><i18n>mod:iface:path</i18n></th>
					<td><input type="text" class="double" name="path"> Usare la barra stile Unix</td>
				</tr>
				<tr>
					<th><i18n>mod:iface:state</i18n></th>
					<td>
						<select name="stato" data-i18n>
							<option value="ATT"> mod:comb:active </option>
							<option value="DEV"> mod:comb:devel </option>
							<option value="ERR"> mod:comb:error </option>
							<option value="PRIV"> mod:comb:priv </option>
							<option value="DIS"> mod:comb:disable </option>
						</select>
					</td>
				</tr>
				<tr>
					<th> <i18n>mod:iface:group</i18n> </th>
					<td>'.$grp_sel.'</td>
				</tr>

			</table>
			'.$descr.'
		</div>';

		$footer.='<button class="red" onclick="pi.win.close();"> <i18n>cancel</i18n> </button>
			<button class="red" onclick="pi.chk(\'<i18n>mod:chk:removeMod</i18n>\').requestOnModal(\'Mod_Del\')"> <i18n>mod:win:removeModule</i18n> </button>
			<button class="green" onclick="pi.requestOnModal(\'mod_mod\')"> <i18n>save</i18n> </button>';

	if($id == ''){
		$fill['icon'] = 'mdi-android-studio';
	}
	$pr->addWindow(650,0,'Modifica dettagli del modulo',$out,$footer)->addFill('mod_mod',$fill)->addScript(" $('#focusme').focus(); ")->response();
?>
