/**
 * Ueditor 批注显示隐藏
 */
'use strict';
UE.registerUI('showPostil',function(editor,uiName){
	var me = this;

	var btn = new UE.ui.Button({
		name:'显示批注',
		title:'显示批注',
		cssRules :'background: url('+editor.options.UEDITOR_HOME_URL+'customize/showPostil.png) no-repeat 3px 2px / 18px !important',
		onclick:function () {
			var markList = me.document.getElementsByTagName('mark');
			UE.utils.each( markList, function( value, key ){
				if(value.getAttribute('plugins') == 'hidepostil'){
					value.setAttribute('plugins','postil');
					// UE.dom.domUtils.setStyle(value,'background-color','#ff0');
				}
			});


		}
	});


	return btn;
});

UE.registerUI('hidePostil',function(editor,uiName){
	var me = this;

	var btn = new UE.ui.Button({
		name:'隐藏批注',
		title:'隐藏批注',
		cssRules :'background: url('+editor.options.UEDITOR_HOME_URL+'customize/hidePostil.png) no-repeat 3px 2px / 18px !important',
		onclick:function () {
			var markList = me.document.getElementsByTagName('mark');
			UE.utils.each( markList, function( value, key ){
				if(value.getAttribute('plugins') == 'postil'){
					value.setAttribute('plugins','hidepostil');
					// UE.dom.domUtils.removeStyle( value, 'background-color' );
					// UE.dom.domUtils.setStyle( value, 'background-color', '#fff' );
				}
			});


		}
	});


	return btn;
});
