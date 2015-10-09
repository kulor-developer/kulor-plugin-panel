define( "Panel" , [ "Base" , "Template" ] , function( Base , Template ){
    var tool ,
        Panel = Base.extend( function( templateId , jsonInfo , $parentContainer , opts ){
            this._panelConfig       = $.extend( {} , this.__panelConfig.uiConfig , opts );
            this.$parentContainer   = $parentContainer || $( document.body );
            this.$container         = $( this.getTemplate( this._panelConfig , this.__panelConfig.containerTemplateId ) );
            this.$content           = this.$container.find( ".uiSub-panel-container-pos-center-left-fixed" );
            this.$modal             = false;
            this.$coverBy           = false;
            this._panelStatus       = {
                display     : false
            }
            tool.InitCoverByModal.call( this );
            this.$parentContainer.append( tool.setPanelStyle.call( this ) );
            if( templateId ){
                this.showPanel( templateId , jsonInfo );
            }
        } , {
            extend          : Template ,
            __panelConfig        : {
                containerTemplateId     : "uiSub-panel-container" ,
                coverByTemplateId       : "uiSub-panel-coverBy" ,
                zIndex                  : 199 ,
                parentContainer         : {} ,
                panelItems              : [],
                uiConfig                : {
                    theme           : "default"
                }
            } ,
            show        : function(){
                return this.showPanel.apply( this , arguments );
            } ,
            hide        : function(){
               return this.hidePanel.apply( this , arguments ); 
            } ,
            setPanelConfig : function( uiConfig ){
                this.__panelConfig.uiConfig = $.extend( this.__panelConfig.uiConfig , uiConfig );
                this.$container.addClass( "uiSub-panel-theme-" + this.__panelConfig.uiConfig.theme );
                return this;
            },
            showPanel    : function( id , jsonInfo ){
                if ( id ) {
                    this.$content.html( this.getTemplate( jsonInfo || id , jsonInfo ? id : false  ) );
                    this.$modal     = this.$content.children();
                }
                if ( !this._panelStatus.display ) {
                    this.__panelConfig.zIndex++;
                    this.$coverBy.removeClass( "uiSub-hidden" )
                        .css( { zIndex : this.__panelConfig.zIndex } );
                    this.$container.removeClass( "uiSub-hidden" )
                        .css( { zIndex : this.__panelConfig.zIndex } );
                    this._panelStatus.display = true;
                    this.$coverBy.height( $( document ).height() );
                    if( this._panelConfig.topCenter ){
                        tool.panelMoveTopForCenter.call( this );
                    }
                }          
                return this;
            } ,
            /*!
             *  隐藏Panel
             *  alwaysHide  {boolean}   
             */
            hidePanel      : function( alwaysHide ){
                if ( this._panelStatus.display ) {
                    this.$container.addClass( "uiSub-hidden" );
                    this.$coverBy.addClass( "uiSub-hidden" );
                    if( alwaysHide || this.$parentContainer.children( ".uiSub-panel-container-pos-center" ).length == this.$parentContainer.children( ".uiSub-panel-container-pos-center.uiSub-hidden" ).length ){
                        this.$coverBy.addClass( "uiSub-hidden" );
                    }
                    this._panelStatus.display = false;
                }
                return this;
            } ,
            deletePanel     : function(){
                this.hidePanel();
                this.$container.remove();
                this.$content = null;
                for( var a in this ){
                    delete this[ a ];
                }
                return this;
            }
        } );
    tool    = {
        /*!
         *  设置panel的一些通配属性，目前只支持width
         */
        setPanelStyle           : function(){
            var _cssHash    = [ "width" ] ,
                _css        = {};
            for( var i = _cssHash.length; i--; ){
                _css[ _cssHash[ i ] ]   = this._panelConfig[ _cssHash[ i ] ];
            }
            return this.$container.css( _css );
        } ,
        panelMoveTopForCenter   : function(){
            var _top    = ( this._panelConfig.topCenter == "fix" ? 0 : $( document.body ).scrollTop() ) + ( window.screen.availHeight - this.$container.height() ) / 2 - 50;
            this.$container.css( {
                top         : _top  < 50 ? 50 : _top
            } );
            return this;
        } ,
        /*!
         *  构建一个panel遮罩层
         */
        InitCoverByModal : function(){
            this.$coverBy   = this.$parentContainer.children( "." + this.__panelConfig.containerTemplateId );
            if( !this.$coverBy.length ){
                this.$coverBy = $( this.getTemplate( this.__panelConfig.coverByTemplateId ) );
                if ( this.$parentContainer.get( 0 ).tagName != "BODY" ) {
                    this.$parentContainer.css( { position : "relative" } );
                }
                this.$parentContainer.append( this.$coverBy )
                    .on( "resize" , function(){
                        this.$coverBy.height( this.$parentContainer.height() );    
                    } );
                this.$coverBy.height( this.$parentContainer.height() );
            }
            return this;
        }
    };
    return Panel;
} );