var app = new Vue({ // 创建Vue对象。Vue的核心对象。
	el: '#box', 
	name:"app",
	data:{
		open:false,
		user:{
			name:"",
			number:"",
			mobile:""
		},
		mine:"",
		shareCode:"",
		login:true,
		showHb:false,
		qy:"",
		hbImg:"",
		inApp:false,
		loading:"",
		q1:"",
		q2:"",
		q3:"",
		q4:"",
		q5:"",
		q6:"",
		qyT:"",
		isGl:false,
		nowDate:"",
		jjrName:"",
		jjrNum:"",
		jjrMobile:"",
		looHouse:"",
		change:false,
		isMy:false,
		open:false,
		nickName:"",
		sex:1  ,//1男  2女,
		zan:false,
		isC:false,
		nextP:false
	},
	mounted() {
		if(navigator.userAgent.indexOf('aplus') > -1){
			this.inApp=true
		}
		if(this.getUrlParam('shareCode')){
			this.login=false;
			this.shareCode=this.getUrlParam('shareCode')
			this.getData();
		}
		setTimeout(()=>{
			gio('page.set', 'city', '深圳');
			gio('page.set', 'channel', 'H5活动');
			gio('page.set', 'page', '年终总结');
			gio('page.set', 'platform', 'WEBAPP');
			gio('page.set', 'property_label', '活动');
			gio('page.set', 'agent_id', this.shareCode);
		},500)
	},
	// filters:{
	// 	m(v){
	// 		console.log(v.indexOf('('));
	// 		if(v.indexOf('(')>-1){
	// 			return v.split("(")[0];
	// 		}else{
	// 			return v;
	// 		}
			
	// 	}
	// },
	methods:{
		cZan(){
			this.zan=true;
			document.getElementById("yh").volume =1;
			var audio = document.getElementById('yh');
			audio.play();
		},
		changeName(){
			if(this.isC==false){
				this.isC=true;
				this.open=true;
				setTimeout(()=>{
					// document.getElementById("op").volume =0.5;
					// var audio = document.getElementById('op');
					var audio1 = document.getElementById('yh');
					audio1.play();
					// audio.play();
					this.bf();
				},100)
				axios({
						method: "post",
						url: "https://sz.centanet.com/partner/actapi/api/YearEnd/ChnageNickName",
						data:{
							shareCode:this.shareCode,
							NickName:this.nickName
						}
					})
					.then(res => {
						console.log(res);
						if(res.data.IsSuccess){
							this.getData();
						}
					})
			}
		},
		getNowDate(){
			var date=new Date();
			var y=date.getFullYear();
			var m=date.getMonth()+1;
			var d=date.getDate();
			var h=date.getHours();
			h=h>9?h:'0'+h.toString();
			var f=date.getMinutes();
			f=f>9?f:'0'+f.toString();
			var miao=date.getSeconds();
			this.nowDate=y+"-"+m+"-"+d+" "+h+":"+f+":"+miao;
			miao=miao>9?miao:'0'+miao.toString();
		},
		changeMobile(){
			axios({
					method: "get",
					url: "https://sz.centanet.com/partner/huihan/Get400ExtCodeNz",
					params:{
						staffNo:this.jjrNum,
						staffCnName:this.jjrName,
						mobile:this.jjrMobile
					}
				})
				.then(res => {
					this.jjrMobile=res.data.data;
				})
		},
		callP(){
			this.getNowDate();
			setTimeout(()=>{
				gio('track', 'conversion', {'cr_time':this.nowDate,'phone_400':this.jjrMobile, 'agent_id':this.shareCode,'agent_name':this.jjrName});
			},200)
		},
		share(i){
		    var url = "centaline:" + this.shareParams(i);
		    window.location.href = url;
		},
		shareParams(i){
		    var json = this.dataJson(i);
		    var jsonData = JSON.stringify({
		        action:"share",
		        data:json
		    });
			
		    return encodeURIComponent(jsonData);
		},
		dataJson(src){
		    return JSON.stringify({
		            channel:["saveImage","wx","QQ","wxImage","wxMomentsImage"],//["wx","wxImage","wxMomentsImage","QQ"]
		            img:src,
		            title:"深夜，客户问我睡了吗？",
		            description:"这是中原人热血激昂的2020",
		            link:location.href.split("#")[0]
		        });
		},
		playV(){
			var audio = document.getElementById('music1');
			document.getElementById("music1").volume =0.5;
			if($("#music").hasClass("animatedR")){                 
			  
			}else{
				audio.play();// 这个就是播放 
				$("#music").addClass("animatedR")
			}
		},
		bf(){
			 var audio = document.getElementById('music1'); 
			 document.getElementById("music1").volume =0.5;
			  $("#music").toggleClass("animatedR"); //控制音乐图标 自转或暂停
			  if($("#music").hasClass("animatedR")){                 
				  audio.play();// 这个就是播放 
			  }else{
				audio.pause();// 这个就是暂停
			  }
		},
		goLogin(){
			this.change=true;
			this.login=true;
		},
		closeH(){
			if(this.change){
				this.login=false;
			}
		},
		loginSub(){
			if(this.user.number==""||this.user.name==""){
				this.$toast.text('所有选项必须填写~');
				return;
			}
			this.loading = this.$toast.loading();
			axios({
					method: "get",
					url: "https://sz.centanet.com/partner/actapi/api/YearEnd/GetToken",
					params:{
						empNo:this.user.number,
						empName:this.user.name,
					}
				})
				.then(res => {
					console.log(res);
					if (res.data.IsSuccess) {
						this.shareCode=res.data.Src;
						this.isMy=true;
						localStorage.setItem("isMy",this.isMy);
						setTimeout(()=>{
							this.loading.hide();
							this.showHb=false
							location.href="index.html?shareCode="+this.shareCode;
						},500)
						
					}else{
						setTimeout(()=>{
							this.loading.hide();
							this.$toast.text("哎呀，报告内容基于A+数据，只面向三级同事哟~");
						},500)
					}
				})
		},
		getData(){
			if(localStorage.getItem("isMy")){
				this.isMy=true;
			}
			localStorage.removeItem("isMy");
			axios({
					method: "get",
					url: "https://sz.centanet.com/partner/actapi/api/YearEnd/GetEmpDataDetailes",
					params:{
						shareCode:this.shareCode,
						isMy:this.isMy
					}
				})
				.then(res => {
					console.log(res);
					if (res.data.IsSuccess) {
						this.mine=res.data.Src;
						this.shareCode=res.data.Src.ShareCode;
						this.q1=res.data.Src.FuWuXiaoQu1.split("(")[0];
						this.q2=res.data.Src.FuWuXiaoQu2.split("(")[0];
						this.q3=res.data.Src.FuWuXiaoQu3.split("(")[0];
						if(res.data.Src.NickName){
							this.nickName=res.data.Src.NickName;
						}else{
							this.nickName=res.data.Src.EmpName;
						}
						
						if(res.data.Src.Sex=="女"){
							this.sex=2
						}else{
							this.sex=1
						}
						if(res.data.Src.FuWuXiaoQu4){
							this.q4=res.data.Src.FuWuXiaoQu4.split("(")[0];
						}
						if(res.data.Src.FuWuXiaoQu5){
							this.q5=res.data.Src.FuWuXiaoQu5.split("(")[0];
						}if(res.data.Src.FuWuXiaoQu6){
							this.q6=res.data.Src.FuWuXiaoQu6.split("(")[0];
						}
						
						this.qy=res.data.Src.AreaCodes;
						this.qyT=res.data.Src.ShuXiDiPan;
						this.jjrName=res.data.Src.EmpName;
						this.jjrNum=res.data.Src.EmpNo;
						this.jjrMobile=res.data.Src.Mobile;
						if(res.data.Src.DaiKanLouPan){
							this.lookHouse=res.data.Src.DaiKanLouPan.split("(")[0];
						}
						this.changeMobile();
						if(res.data.Src.IsGuanLiCeng==1){
							this.isGl=true;
						}else{
							this.isGl=false;
						}
						if(this.getUrlParam('shareCode')){
							
						}else{
							location.href="index.html?shareCode="+res.data.Src.ShareCode
						}
					}else{
						this.login=true;
					}
				})
		},
		setHb(num){
			this.loading = this.$toast.loading('正在生成海报...',{
			    cover: false
			});
			gio('track', 'clickmonitor', {'city':'深圳', 'location':num});
			axios({
					method: "get",
					url: "https://sz.centanet.com/partner/actapi/api/YearEnd/GetImg",
					params:{
						shareCode:this.shareCode,
						type:num
					}
				})
				.then(res => {
					console.log(res);
					this.showHb=true;
					this.hbImg="https://sz.centanet.com/partner/actapi/api/YearEnd/GetImg?shareCode="+this.shareCode+"&type="+num;
					setTimeout(()=>{
						this.loading.hide();
					},800)
				})
		},
		// 截取浏览器地址id
		getUrlParam: function(name) {
			let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
			let r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]);
			return null;
		},
	}
})	