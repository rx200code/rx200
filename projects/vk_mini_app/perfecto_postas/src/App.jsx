import './App.css';
import {help_base_1, help_base_2, help_base_3} from './help_base.jsx';
import React, { useState, useEffect } from 'react';
import vkBridge from '@vkontakte/vk-bridge';

let host = "https://m.vk.com/";
function int_to_str4(n){
	if(n < 10_000)return n.toString();
	if(n < 1_000_000)return Math.round(n / 1_000) + "K";
	if(n < 10_000_000 && n % 1_000_000 >= 50_000)return (n / 1_000_000).toFixed(1) + "M";
	if(n < 1_000_000_000)return Math.round(n / 1_000_000) + "M";
	if(n < 10_000_000_000 && n % 1_000_000_000 >= 50_000_000)return (n / 1_000_000_000).toFixed(1) + "G";
	return Math.round(n / 1_000_000_000) + "G";
}
let months = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
function Resource(props){
	
	if(props.post.viewsLikes === undefined)return(
		<div className="elm border">Загрузка</div>
	);
	
	let reactions;
	if(props.post.reactions.count > 0){
		reactions = [];
		let item = props.post.reactions.items.find(e => e.id == 0);
		if(item)reactions.push(<span title={item.count}><span className="r_0"></span><span className="n_4">{int_to_str4(item.count)}</span></span>);
		else reactions.push(<span />);
		item = props.post.reactions.items.find(e => e.id == 1);
		if(item)reactions.push(<span title={item.count}><span className="r_1"></span><span className="n_4">{int_to_str4(item.count)}</span></span>);
		else reactions.push(<span />);
		item = props.post.reactions.items.find(e => e.id == 2);
		if(item)reactions.push(<span title={item.count}><span className="r_2"></span><span className="n_4">{int_to_str4(item.count)}</span></span>);
		else reactions.push(<span />);
		item = props.post.reactions.items.find(e => e.id == 3);
		if(item)reactions.push(<span title={item.count}><span className="r_3"></span><span className="n_4">{int_to_str4(item.count)}</span></span>);
		else reactions.push(<span />);
		item = props.post.reactions.items.find(e => e.id == 5);
		if(item)reactions.push(<span title={item.count}><span className="r_5"></span><span className="n_4">{int_to_str4(item.count)}</span></span>);
		else reactions.push(<span />);
		item = props.post.reactions.items.find(e => e.id == 4);
		if(item)reactions.push(<span title={item.count}><span className="r_4"></span><span className="n_4">{int_to_str4(item.count)}</span></span>);
		else reactions.push(<span />);
	}else reactions = [<span />,<span />,<span />,<span />,<span />,<span />];
	
	let date = new Date(props.post.date * 1000);
	let strHours = date.getHours() < 10 ? "0" + date.getHours(): date.getHours();
	let strMinutes = date.getMinutes() < 10 ? "0" + date.getMinutes(): date.getMinutes();
	let strDate = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear() + ", " + strHours + ":" + strMinutes;
	return(
		<div className="elm border" onClick={() => props.openPost(props.id)}>
			<img
				className="avatar_c2"
				src={props.post.photo}
			/>
			<span title={props.post.reactions.count+"\nКаждый: "+props.post.viewsLikes}><svg viewBox="0 0 24 24"><use href="#likes"/></svg><span className="n_4">{props.post.reactions.count}<div>{int_to_str4(Math.round(props.post.viewsLikes))}</div></span></span>
			<span title={props.post.comments+"\nКаждый: "+props.post.viewsComments}><svg viewBox="0 0 24 24"><use href="#comments"/></svg><span className="n_4">{int_to_str4(props.post.comments)}<div>{int_to_str4(Math.round(props.post.viewsComments))}</div></span></span>
			<span title={props.post.reposts+"\nКаждый: "+props.post.viewsReposts}><svg viewBox="0 0 24 24"><use href="#reposts"/></svg><span className="n_4">{int_to_str4(props.post.reposts)}<div>{int_to_str4(Math.round(props.post.viewsReposts))}</div></span></span>
			<span title={props.post.views}><svg viewBox="0 0 24 24"><use href="#views"/></svg><span className="n_4">{int_to_str4(props.post.views)}<div>&nbsp;</div></span></span>
			<span className="button right" onClick={e => {e.stopPropagation();props.delPost(props.id);}}>X</span>
			{reactions}
			<span className="text">{props.post.text}</span>
			<a className="date" href={host + "wall" + props.post.owner_id + "_" + props.post.id} target="_blank" onClick={e => e.stopPropagation()}>{strDate}</a>
		</div>
	);
}


let typeSortSymbol = ["▼", "▲", "ᐱ", "ᐯ"];

function Result(props){
	const posts = props.posts.map((post, i) => <Resource id={i} openPost={props.openPost} delPost={props.delPost} post={post} />);
	const [typeSort, setTypeSort] = useState(0);
	const [prevSort, setPrevSort] = useState(5);
	// Авто запуск поиска. Если поиска ещё небыло. App.data.wallArray.find(wall => wall.isSearch) !== undefined
	if(props.posts.length === 0 && props.data.criterias.offset === 0 && props.data.wallArray.find(wall => wall.isSearch) !== undefined)props.searchPosts();
	return(
		<>
			<div className="elm border" ><span>∑ {posts.length ? posts.length:""}</span>
			<span onClick={(e) => {
				let type = prevSort === 4 ? typeSort: 0;
				if(type === 0)props.posts.sort((a, b) => b.date - a.date);
				else if(type === 1)props.posts.sort((a, b) => a.date - b.date);
				setTypeSort((type + 1) % 2);
				setPrevSort(4);
			}}><svg className="button_svg" viewBox="0 0 24 24" ><use href="#date"/></svg>{prevSort === 4 ? typeSortSymbol[(typeSort + 1) % 2]: ""}</span>
			<span onClick={(e) => {
				let type = prevSort === 0 ? typeSort: 0;
				if(type === 0)props.posts.sort((a, b) => b.reactions.count - a.reactions.count);
				else if(type === 1)props.posts.sort((a, b) => a.reactions.count - b.reactions.count);
				else if(type === 2)props.posts.sort((a, b) => (a.viewsLikes ? a.viewsLikes: Infinity) - (b.viewsLikes ? b.viewsLikes: Infinity));
				else if(type === 3)props.posts.sort((a, b) => (b.viewsLikes ? b.viewsLikes: Infinity) - (a.viewsLikes ? a.viewsLikes: Infinity));
				setTypeSort((type + 1) % 4);
				setPrevSort(0);
			}}><svg className="button_svg bs_likes" viewBox="0 0 24 24" ><use href="#likes"/></svg>{prevSort === 0 ? typeSortSymbol[(typeSort + 3) % 4]: ""}</span>
			<span onClick={(e) => {
				let type = prevSort === 1 ? typeSort: 0;
				if(type === 0)props.posts.sort((a, b) => b.comments - a.comments);
				else if(type === 1)props.posts.sort((a, b) => a.comments - b.comments);
				else if(type === 2)props.posts.sort((a, b) => (a.viewsComments ? a.viewsComments: Infinity) - (b.viewsComments ? b.viewsComments: Infinity));
				else if(type === 3)props.posts.sort((a, b) => (b.viewsComments ? b.viewsComments: Infinity) - (a.viewsComments ? a.viewsComments: Infinity));
				setTypeSort((type + 1) % 4);
				setPrevSort(1);
			}}><svg className="button_svg bs_comments" viewBox="0 0 24 24" ><use href="#comments"/></svg>{prevSort === 1 ? typeSortSymbol[(typeSort + 3) % 4]: ""}</span>
			<span onClick={(e) => {
				let type = prevSort === 2 ? typeSort: 0;
				if(type === 0)props.posts.sort((a, b) => b.reposts - a.reposts);
				else if(type === 1)props.posts.sort((a, b) => a.reposts - b.reposts);
				else if(type === 2)props.posts.sort((a, b) => (a.viewsReposts ? a.viewsReposts: Infinity) - (b.viewsReposts ? b.viewsReposts: Infinity));
				else if(type === 3)props.posts.sort((a, b) => (b.viewsReposts ? b.viewsReposts: Infinity) - (a.viewsReposts ? a.viewsReposts: Infinity));
				setTypeSort((type + 1) % 4);
				setPrevSort(2);
			}}><svg className="button_svg bs_reposts" viewBox="0 0 24 24" ><use href="#reposts"/></svg>{prevSort === 2 ? typeSortSymbol[(typeSort + 3) % 4]: ""}</span>
			<span onClick={(e) => {
				let type = prevSort === 3 ? typeSort: 0;
				if(type === 0)props.posts.sort((a, b) => b.views - a.views);
				else if(type === 1)props.posts.sort((a, b) => a.views - b.views);
				setTypeSort((type + 1) % 2);
				setPrevSort(3);
			}}><svg className="button_svg bs_views" viewBox="0 0 24 24" ><use href="#views"/></svg>{prevSort === 3 ? typeSortSymbol[(typeSort + 1) % 2]: ""}</span>
			<span className="button right" onClick={() => props.delPosts()}>X</span>
			</div>
			<div className="content">
				{posts}
				<div className="next" ><span className="button mc_3" onClick={() => {setPrevSort(5);props.searchPosts();}}>Искать {posts.length ? "дальше":""}</span></div>
				<span className="block" style={{display: (props.flagSearch ? 'none': 'block') }} onClick={e => e.stopPropagation()} >
					<svg width="180" height="50" viewBox="0 0 1080 300" xmlns='http://www.w3.org/2000/svg'>
						<path className="block_path" d="M-20,90 h100 l70,70 l70,-70 h880 v120 h-1120 z" stroke="#000" fill="#fd0" stroke-width="0" />
						<path d="M150,105 a47,47 0 0,1 90,30 q-10,40 -90,100 q-80,-60 -90,-100 a47,47 0 0,1 90,-30 z" stroke="#000" fill="#d00" stroke-width="0" />
						<text x="270" y="190" >Идет поиск</text>
					</svg>
				</span>
				
			</div>
		</>
	);
}


function WallBar(props){
	if(props.wall.name === undefined)return(
		<div className="elm">Загрузка</div>
	);
	return(
		<label className="elm" key={props.wall.id}>
			<input type="checkbox" defaultChecked={props.wall.isSearch} onChange={() => props.checkWall(props.wall)} />
			<img
				className="avatar"
				src={props.wall.photo}
			/>
			<span className="c_4 name">
				<b><a href={host + props.wall.domain} target="_blank" onClick={e => e.stopPropagation()}>{props.wall.name}</a></b><br/>
				<span className="users">{props.wall.members_count} </span>
			</span>
			<span className="button right" onClick={e => {
				e.stopPropagation();
				props.delWall(props.wall.id);
			}}>X</span>
		</label>
	);
}


function WallList(props){
	const wallBars = props.wallArray.map(wall => <WallBar wall={wall} checkWall={props.checkWall} delWall={props.delWall}/>);
	const [inputValue, setInputValue] = useState("");
	return(
		<>
			<div className="elm">
				<input className="c_4" type="url" placeholder="Введите URL сообщества" value={inputValue} 
					onFocus={e => e.target.select()}
					onChange={e => setInputValue(e.target.value)}
					onKeyUp={e => {if(e.keyCode === 13)props.addWall(inputValue)}}
				/>
				<span />
				<span className="button c_2" onClick={() => props.addWall(inputValue)}>Добавить</span>
			</div>
			<div className="content">
				{wallBars}
			</div>
		</>
	);
}


function WallUserBar(props){
	// ДОДЕЛАТЬ.
	return(
		<span className="elm" onClick={() => props.addGpoup(props.group.id)}>
			<img
				className="avatar"
				src={props.group.photo}
			/>
			<b className="c_3 name"><a href={host + props.group.domain} target="_blank" onClick={e => e.stopPropagation()}>{props.group.name}</a></b>
			<span className="users c_2">{props.group.members_count} </span>
			<span className="f_plus button right">+</span>
		</span>
	);
}


let scrollWallUserList = 0;
function WallUserList(props){
	// ДОДЕЛАТЬ.
	
	let WallUserBars = [];
	props.userGroups.forEach(group => {
		if(group.isView)WallUserBars.push(<WallUserBar addGpoup={props.addGpoup} group={group} />);
	});
	let refScroll = React.createRef();
	useEffect(() => {
		//refScroll.current.scroll(0, scrollWallUserList);
		refScroll.current.scrollTop = scrollWallUserList;
	});
	return(
		<>
			<div className="elm">
				<span className="c_4">Выберите группу. {WallUserBars.length}</span>
				<span />
				<span className="c_2" />
			</div>
			<div
				className="content"
				ref={refScroll}
				onScroll={e => {
					scrollWallUserList = e.target.scrollTop;
				}}
			>
				{WallUserBars}
			</div>
		</>
	);
}


class SearchCriteria extends React.Component{
	constructor(props){
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}
	handleChange(event, name){
		if(event.target.type === "checkbox")this.props.handleSearchCriterias(name, event.target.checked);
		else this.props.handleSearchCriterias(name, Math.abs(parseInt(event.target.value, 10) | 0) || 0);
		this.forceUpdate();
	}
	render(){
		return(
			<div className="content">
				<div className="criteria">
					<span/><span>&nbsp;</span>
					<input type="text" value={this.props.searchCriterias.likes} onChange={(e) => this.handleChange(e, "likes")} /><span> &gt;= лайков</span>
					<input type="text" value={this.props.searchCriterias.comments} onChange={(e) => this.handleChange(e, "comments")} /><span> &gt;= комментариев</span>
					<input type="text" value={this.props.searchCriterias.reposts} onChange={(e) => this.handleChange(e, "reposts")} /><span> &gt;= репостов</span>
					<input type="text" value={this.props.searchCriterias.views} onChange={(e) => this.handleChange(e, "views")} /><span> &gt;= просмотров</span>
					<input type="text" value={this.props.searchCriterias.viewsLikes} onChange={(e) => this.handleChange(e, "viewsLikes")} /><span> &lt;= просмотры / лайки</span>
					<input type="text" value={this.props.searchCriterias.viewsComments} onChange={(e) => this.handleChange(e, "viewsComments")} /><span> &lt;= просмотры / комментарии</span>
					<input type="text" value={this.props.searchCriterias.viewsReposts} onChange={(e) => this.handleChange(e, "viewsReposts")} /><span> &lt;= просмотры / репосты</span>
					<input type="text" value={this.props.searchCriterias.offset} onChange={(e) => this.handleChange(e, "offset")} /><span> = смещение</span>
					<label class="c_2">в посте есть видео <input type="checkbox" defaultChecked={this.props.searchCriterias.video} onChange={(e) => this.handleChange(e, "video")} /></label>
				</div>
			</div>
		);
	}
}





function Help(props){
	return(
		<div className="content">
			<div className="help">
				<br />
				<center className="button" onClick={() => props.help()}>Нажмите чтобы, посмотреть введение</center><br />
				I. Добавления групп с постами.<br />
				I. 1. Перейдите на страничку группы или пользователя.<br />
				I. 2. Скопируйте из адресной строки браузера ссылку.<br />
				I. 3. В приложении нажмите кнопку "Группы".<br />
				I. 4. В верхнее окошко вставьте ссылку и нажмите "добавить".<br />
				I. 5. Или при пустом окнее ввода для ссылки группы, нажмите кнопку "добавить", появится список из первых 250 ваших групп, нажмите на нужную группу.<br />
				После чего группа будет в списке групп приложения.<br />
				Максимальное количество групп 25.<br /><br />
				
				II. Фильтры для выбора постов.<br />
				II. 1. Нажмите кнопку "Группы" и в списке групп выберите группу в которых осуществлять поиск, отметив их галочками с лева.<br />
				II. 2. Нажмите кнопку "Фильтры" и задайте нужные условия фильтрации постов.<br />
				II. 2. 1. В условиях для фильтрации, вы можете выбрать. по количеству лайкам(реакциям), комментариев, репостов, просмотров, по отношению просмотров к лайкам, просмотров к комментариям, или просмотров к репостам. Вы можете выбрать как одно условие для фильтрации, тогда остальные надо установить в 0 так и несколько. Так же присутствует возможность фильтрации постов в которых есть видео.<br /><br />
				
				III. Фильтрация постов.<br />
				III. 1. Нажмите кнопку "Поиск" и кнопку "Искать".<br />
				III. 2. Если в результатах поиска уже есть список постов, то прокрутите его в низ и нажмите кнопку "Искать дальше".<br />
				III. 3. Поиск происходит по честям, приложение просматривает по 100 постов за раз. если групп для поиска выбрано несколько то в каждой группе просматривается часть постов(100 / количество групп).<br />
				III. 4. Пока идет поиск внизу приложения появляется надпись "Идет поиск.", по завершению поиска там отображается результат, и смещения для продолжения поиска. Так же смещение можно задать в условиях поиска(см. пункт II).<br />
				III. 5. В результатах поиска, с права от значков <svg viewBox="0 0 24 24"><use href="#likes"/></svg> лайки <svg viewBox="0 0 24 24"><use href="#comments"/></svg> комментарии  и<svg viewBox="0 0 24 24"><use href="#reposts"/></svg> репосты, появятся два числа, верхние количество лайков, комментариев и репостов, а нижние число это отношения этого количества к <svg viewBox="0 0 24 24"><use href="#views"/></svg> просмотрам.<br /><br />
				
				IV. Сортировка результатов.<br />
				IV. 1. После знака "∑", отображается количество результатов, для сортировки нажмите одну из кнопок <svg className="button_svg_help" viewBox="0 0 24 24" ><use href="#date"/></svg> <svg className="button_svg_help" viewBox="0 0 24 24"><use href="#likes"/></svg> <svg className="button_svg_help" viewBox="0 0 24 24"><use href="#comments"/></svg> <svg className="button_svg_help" viewBox="0 0 24 24"><use href="#reposts"/></svg> <svg className="button_svg_help" viewBox="0 0 24 24"><use href="#views"/></svg>, при первом нажатии сортирует в обычном порядке "▼", при втором нажатии в обратном порядке "▲", при третьем нажатии сортирует по отношению к просмотрам "ᐱ" при четвертом нажатии сортирует в обратном порядке по отношению к просмотрам "ᐯ", при дальнейших нажатий процесс повторяется.<br />
				IV. 2. Для удаления результатов нажмите кнопку X.<br />
				<span className="button mc_4" onClick={() => props.resetData()}>Сбросить данные</span>
			</div>
		</div>
	);
}



function Info(props){
	return(
		<div className="footer">
			{props.text}
		</div>
	);
} 





// Методы по сути меняют систему счисления данных, достаточно быстрые для размеров данных до 4096 байт.
let base100Chars = String.fromCharCode(8,10,12,13);
for(let i = 32; i <= 127; i++)base100Chars += String.fromCharCode(i);
const base100cods = new Map(base100Chars.split("").map((char, i) => [char, i]));
const base_from = 256;
const base_to = base100Chars.length;
const charCod = 0xAB;
function toBase100(arrayBuffer){// max arrayBuffer size 3401 for 4096 byte VK storage
	let byteLength = arrayBuffer.byteLength + 1;
	let bufferUint8 = new Uint8Array(byteLength);
	bufferUint8.set(new Uint8Array(arrayBuffer), 1);
	bufferUint8[0] = 1;// переход 36-37 на 4097
	let arrBase100 = [];
	do{
		let n = 0;
		for(let i = 0; i < byteLength; i++){
			n = n * base_from + bufferUint8[i];
			bufferUint8[i] = n / base_to;
			n %= base_to;
		}
		arrBase100.push(base100Chars[n]);
	}while(bufferUint8.findLast(b => b > 0));
	return arrBase100.reverse().join("").replaceAll("\\t", String.fromCharCode(charCod));
}
function fromBase100(str){
	let codes = str.replaceAll(String.fromCharCode(charCod), "\\t").split("").map(char => base100cods.get(char));
	let codesLength = codes.length;
	let arrBase256 = [];
	do{
		let n = 0;
		for(let i = 0; i < codesLength; i++){
			n = n * base_to + codes[i];
			codes[i] = n / base_from | 0;
			n %= base_from;
		}
		arrBase256.push(n);
	}while(codes.findLast(b => b > 0));
	return new Uint8Array(arrBase256.reverse().slice(1)).buffer;
}

export default class App extends React.Component{
	static app_id = 52910233;
	static user_token = "";
	static data = {
		criteriasLength_64: 5,// max 11 В двое меньше количества (32 битных параметров в criterias + 1 (само criteriasLength_64)) округленное в большую сторону.
		maxWallsStorage: 25,// max 100
		maxPostsStorage: 25,// max 200 // (11 + 100 + 1 + (200 * 2)) * 8 = 4096 = (4Kb) // max 3401 byte.
		flagsWallSearch: 1,// maxWallsStorage: 32 // max 32
		criterias: {
			likes: 0,
			comments: 0,
			reposts: 0,
			views: 0,
			viewsLikes: 0,
			viewsComments: 0,
			viewsReposts: 0,
			offset: 0,// Не сохраняем между сеансами.
			video: false
		},
		wallArray: [{id:-22822305}],// по умолчанию группа "ВКонтакте", // , domain: "kinohd"
		postArray: []
	}
	static getBufferData(){
		let len_wallArray = this.data.wallArray.length;
		if(len_wallArray > this.data.maxWallsStorage)len_wallArray = this.data.maxWallsStorage;
		let i_buf = this.data.criteriasLength_64;
		let buffer = new ArrayBuffer(i_buf * 8 + len_wallArray * 8 + 8);
		
		let presentUint32 = new Uint32Array(buffer);
		presentUint32[0] = this.data.criteriasLength_64;
		presentUint32[1] = this.data.criterias.likes;
		presentUint32[2] = this.data.criterias.comments;
		presentUint32[3] = this.data.criterias.reposts;
		presentUint32[4] = this.data.criterias.views;
		presentUint32[5] = this.data.criterias.viewsLikes;
		presentUint32[6] = this.data.criterias.viewsComments;
		presentUint32[7] = this.data.criterias.viewsReposts;
		presentUint32[8] = this.data.criterias.video | 0;
		this.data.flagsWallSearch = 0;
		for(let i = 0; i < len_wallArray && i < 32; i++)this.data.flagsWallSearch |= this.data.wallArray[i].isSearch << i;
		presentUint32[9] = this.data.flagsWallSearch;
		
		let presentFloat64 = new Float64Array(buffer);
		for(let i = 0; i < len_wallArray; i++, i_buf++)presentFloat64[i_buf] = this.data.wallArray[i].id;
		presentFloat64[i_buf] = 0;// presentFloat64[i_buf++] = 0;
		
		return buffer;
	}
	static setBufferData(buffer){
		if(buffer.byteLength < 10)return;
		let presentUint32 = new Uint32Array(buffer);
		let i_buf = presentUint32[0];//this.data.criteriasLength_64;
		this.data.criterias.likes = presentUint32[1];
		this.data.criterias.comments = presentUint32[2];
		this.data.criterias.reposts = presentUint32[3];
		this.data.criterias.views = presentUint32[4];
		this.data.criterias.viewsLikes = presentUint32[5];
		this.data.criterias.viewsComments = presentUint32[6];
		this.data.criterias.viewsReposts = presentUint32[7];
		this.data.criterias.video = Boolean(presentUint32[8] & 1);// (presentUint32[7] & 1) === 1;
		this.data.flagsWallSearch = presentUint32[9];
		
		let presentFloat64 = new Float64Array(buffer);
		let len_buf = presentFloat64.length;
		
		this.data.wallArray.length = 0;// очищаем массив от значения по умолчанию, на тот случай если пользователь удалил его.
		
		for(let i = 0; i_buf < len_buf; i++, i_buf++){
			if(presentFloat64[i_buf] === 0)break;
			else this.data.wallArray[i] = {id: presentFloat64[i_buf]};
		}
		//i_buf++;
	}
	static flagSearchData = false;
	static save(){
		if(App.flagSearchData){
			App.flagSearchData = false;
			vkBridge.send('VKWebAppStorageSet', {
				key: "data",
				value: toBase100(App.getBufferData())
			});
		}
	}
	constructor(props){
		super(props);
		this.state = {
			idContent: 1,
			infoText: "Загрузка: 0%",
			isToken: true
		};
		this.infoOut = this.infoOut.bind(this);
		this.errorOut = this.errorOut.bind(this);
		this.handleClickPanel = this.handleClickPanel.bind(this);
		this.handleSearchCriterias = this.handleSearchCriterias.bind(this);
		this.addWall = this.addWall.bind(this);
		this.delWall = this.delWall.bind(this);
		this.checkWall = this.checkWall.bind(this);
		this.delPost = this.delPost.bind(this);
		this.delPosts = this.delPosts.bind(this);
		this.openPost = this.openPost.bind(this);
		this.searchPosts = this.searchPosts.bind(this);
		this.loadUserGroups = this.loadUserGroups.bind(this);
		this.viewUserGroups = this.viewUserGroups.bind(this);
		this.addGpoup = this.addGpoup.bind(this);
		this.help = this.help.bind(this);
		this.resetData = this.resetData.bind(this);
		this.initData = this.initData.bind(this);
	}
	help(){
		vkBridge.send('VKWebAppShowSlidesSheet', {
			slides: [
				{
					media: {
						blob: help_base_1,
						type: 'image'
					},
					title: 'Выбирайте группы.',
					subtitle: 'Можно искать сразу в нескольких группах!'
				},
				{
					media: {
						blob: help_base_2,
						type: 'image'
					},
					title: 'Гибкие условия поиска!',
					subtitle: 'Относительные условия поиска, нивелируют разницу в просмотрах, разных постов в разных группах!'
				},
				{
					media: {
						blob: help_base_3,
						type: 'image'
					},
					title: 'Сортируйте найденные посты по вашему вкусу!',
					subtitle: 'Обычная сортировка "▼", "▲", сортировка относительно просмотров "ᐱ", "ᐯ"'
				}
			]
		});
	}
	resetData(){
		/**
		vkBridge.send('VKWebAppStorageSet', {
			key: "data",
			value: ""
		});
		vkBridge.send('VKWebAppOpenApp', {
			app_id: App.app_id,
			close_parent: true
		});
		vkBridge.send('VKWebAppClose', {status: 'success'});
		/**/
		/**/
		this.help();
		App.data.wallArray = [{id:-22822305}];
		App.data.postArray = [];
		App.data.criterias = {
			likes: 0,
			comments: 0,
			reposts: 0,
			views: 0,
			viewsLikes: 0,
			viewsComments: 0,
			viewsReposts: 0,
			offset: 0,// Не сохраняем между сеансами.
			video: false
		};
		App.data.flagsWallSearch = 0;
		// загрузка данных по умолчанию.
		vkBridge.send("VKWebAppCallAPIMethod", {
			method: "execute.userGroupsStart",
			params: {
				v: "5.199",
				func_v: "1",
				access_token: App.user_token
			}
		});
		/**/
	}
	static flagSearch = true;
	static userGroups = null;
	viewUserGroups(){
		App.userGroups.forEach(group => {
			if(group.members_count !== null && App.data.wallArray.find(wall => wall.id === group.id) === undefined)group.isView = true;
			else group.isView = false;
		});
		if(App.userGroups.find(group => group.isView) === undefined)this.infoOut("Введите URL группы");
		else{
			this.setState({idContent: 4});
			/*
			vkBridge.send('VKWebAppSetLocation', {
				location: '4'
			});
			/**/
		}
		
	}
	
	loadUserGroups(){
		if(App.userGroups === null){
			vkBridge.send("VKWebAppCallAPIMethod", {
				method: "execute.userGroups",
				params: {
					v: "5.199",
					func_v: "1",
					access_token: App.user_token
				}
			});
		}else this.viewUserGroups();
	}
	initData(){
		if(App.data.wallArray.length || App.data.postArray.length){
			let wallArrayUsers = [];
			let wallArrayGroups = [];
			App.data.wallArray.forEach(value => {
				if(value.id < 0)wallArrayGroups.push(Math.abs(value.id));
				else wallArrayUsers.push(value.id);
			});
			vkBridge.send("VKWebAppCallAPIMethod", {
				method: "execute.initData",
				params: {
					wallUsers: wallArrayUsers.join(),
					wallGroups: wallArrayGroups.join(),
					v: "5.199", // Например, "5.134"
					func_v: "4", // Например, "Версия 4"
					access_token: App.user_token
				}
			});
		}
	}
	static loading_op = 0;
	static is_layer;
	componentDidMount(){// монтирование
		//*
		// Подписывается на события.
		vkBridge.subscribe(event => {
			
			if(!event.detail){
				this.errorOut("ERROR: subscribe");
				return;
			}
			
			switch(event.detail.type){
				// Результат хранимых процедур, поиска.
				case 'VKWebAppCallAPIMethodResult':
					if(event.detail.data.response.type === "searchPosts"){// execute.searchPosts
						// Обработка результатов поиска.
						let posts = [];
						event.detail.data.response.posts.forEach(post => {
							if(isNaN(parseFloat(post.views)) || isNaN(post.views - 0))post.views = 0;
							post.viewsLikes = post.views * (post.reactions.count ? 1 / post.reactions.count: 0);
							post.viewsComments = post.views * (post.comments ? 1 / post.comments: 0);
							post.viewsReposts = post.views * (post.reposts ? 1 / post.reposts: 0);
							if(post.text)post.text = post.text.substring(0, 42);
							if(
								post.reactions.count >= App.data.criterias.likes &&
								post.comments >= App.data.criterias.comments &&
								post.reposts >= App.data.criterias.reposts &&
								post.views >= App.data.criterias.views &&
								(App.data.criterias.viewsLikes === 0 || (post.viewsLikes !== 0 && post.viewsLikes <= App.data.criterias.viewsLikes)) &&
								(App.data.criterias.viewsComments === 0 || (post.viewsComments !== 0 && post.viewsComments <= App.data.criterias.viewsComments)) &&
								(App.data.criterias.viewsReposts === 0 || (post.viewsReposts !== 0 && post.viewsReposts <= App.data.criterias.viewsReposts)) &&
								(!App.data.criterias.video || post.video)
							){
								post.photo = App.data.wallArray.find(wall => wall.id === post.wall_id).photo;
								posts.push(post);
							}
						});
						//App.data.postArray = App.data.postArray.concat(posts);
						let c = 0;
						for(let i = 0; i < posts.length; i++)
							if(App.data.postArray.find(post => post.id === posts[i].id && post.owner_id === posts[i].owner_id))c++;
							else App.data.postArray.push(posts[i]);
						App.data.criterias.offset += App.count;
						App.flagSearch = true;
						this.infoOut("Искать дальше? Найдено: " + posts.length + ", смещение: " + App.data.criterias.offset + (c ? ", уже были: " + c: ""));
					}else if(event.detail.data.response.type === "userGroups"){// execute.userGroups //
						App.userGroups = event.detail.data.response.groups;
						this.viewUserGroups();
					}else if(event.detail.data.response.type === "userGroupsStart"){// execute.userGroupsStart //
						App.userGroups = event.detail.data.response.groups;
						// Первые 10 групп добавляем в группы для поиска.
						if(App.userGroups.length > 0){
							App.data.wallArray = [];
							for(let i = 0; i < App.userGroups.length && i < 10; i++){
								App.userGroups[i].isSearch = false;
								App.data.wallArray.push(App.userGroups[i]);
							}
							App.userGroups[0].isSearch = true;
							App.flagSearchData = true;
							this.setState({idContent: 1});
							window.onbeforeunload = App.save;
							setInterval(App.save, 5000);// мах тысяча в час 3600
							this.infoOut("Загрузка: 100%");
						}else{
							this.initData();
						}
					}else if(event.detail.data.response.type === "getWall"){// получаем данные стены, по короткому имени пользователя или группы.
						event.detail.data.response.wall.isSearch = false;
						App.data.wallArray.unshift(event.detail.data.response.wall);
						this.infoOut("Стена id: " + event.detail.data.response.wall.id + " добавлена");
						App.flagSearchData = true;
						//this.forceUpdate();
					}else if(event.detail.data.response.type === "initData"){// execute.initData
						// Заканчиваем инициализацию данных data
						App.data.wallArray = [];
						for(let i = 0; i < event.detail.data.response.users.length; i++)
							if(!event.detail.data.response.users[i].deactivated)App.data.wallArray.push({id:event.detail.data.response.users[i].id, name:event.detail.data.response.users[i].first_name + " " + event.detail.data.response.users[i].last_name, photo:event.detail.data.response.users[i].photo_50, domain:event.detail.data.response.users[i].domain});
						let groups = event.detail.data.response.groups;
						for(let i = 0; i < groups.length; i++)
							if(!groups[i].deactivated)App.data.wallArray.push({id:groups[i].id * -1, name:groups[i].name, photo:groups[i].photo_50, domain:groups[i].screen_name, members_count:groups[i].members_count});
						
						for(let i = 0; i < App.data.wallArray.length && i < 32; i++)
							App.data.wallArray[i].isSearch = Boolean((App.data.flagsWallSearch >>> i) & 1);
						window.onbeforeunload = App.save;
						setInterval(App.save, 5000);// мах тысяча в час 3600
						this.infoOut("Загрузка: 100%");
					}else if(event.detail.data.response.type === "error"){// Сюда возвращаем все ошибки из пользовательских процедур.
						this.errorOut("Ошибка хранимой процедуры");
					}else if(event.detail.data.response.type === "errorGetWall"){
						this.infoOut("Стена не можнт быть добавлена.");
					}
					break;
				// Конфигурация мини-приложения
				case 'VKWebAppUpdateConfig':// 0 Этап загрузки срабатывает дважды, не размещать вызовы.
					// Настраиваем приложение, размеры и тому подобное.
					//App.app_id = parseInt(event.detail.data.app_id, 10);// event.detail.data.app_id не соответствует иду приложения моего.
					if(event.detail.data.scheme === "bright_light")document.documentElement.setAttribute("data-color-scheme", "light");
					else if(event.detail.data.scheme === "space_gray")document.documentElement.setAttribute("data-color-scheme", "gray");
					else host = "https://vk.com/";
					//this.errorOut("VKWebAppUpdateConfig");
					App.is_layer = event.detail.data.is_layer;
					break;
				
				// Инициализация
				case 'VKWebAppInitResult':// 1
					if(event.detail.data.result){
						// Запрос data
						vkBridge.send('VKWebAppStorageGet', {keys: ["data"]});
						// Запрос токена
						vkBridge.send('VKWebAppGetAuthToken', {app_id: App.app_id, scope: ''});
						this.infoOut("Загрузка: 10%");
					}else{
						// Ошибка
						this.errorOut("ERROR: VKWebAppInit, type: " + event.detail.data.error_type);
					}
					break;
				
				// Токен получен
				case 'VKWebAppAccessTokenReceived':// 2.2
					if(event.detail.data.access_token){
						this.setState({isToken: true});
						App.user_token = event.detail.data.access_token;
						if(App.loading_op === 1)this.initData();
						else if(App.loading_op === 2)vkBridge.send("VKWebAppCallAPIMethod", {method: "execute.userGroupsStart", params: {v: "5.199", func_v: "1", access_token: App.user_token}});
						else this.infoOut("Загрузка: 30%");
					}else{// токен не получен, доп запрос токен с объяснением пользователю зачем.
						// Приложению необходим общий доступ, так приложение сможет делать корректные запросы к вашим группам.
						this.setState({isToken: false});
					}
					break;
				
				// Загружаем данные стен с сервера VK
				case 'VKWebAppStorageGetResult':// 2.1
					this.infoOut("Загрузка: 35%");
					if(event.detail.data.keys[0].value !== ""){
						App.setBufferData(fromBase100(event.detail.data.keys[0].value));// Обрабатываем данные.
						// Вызываем загрузку стен, групп и пользователей.
						if(App.user_token !== "")this.initData();
						else App.loading_op = 1;
					}else{
						this.help();
						// загрузка данных по умолчанию.
						if(App.user_token !== ""){
							vkBridge.send("VKWebAppCallAPIMethod", {
								method: "execute.userGroupsStart",
								params: {
									v: "5.199",
									func_v: "1",
									access_token: App.user_token
								}
							});
						}else App.loading_op = 2;
					}
					this.infoOut("Загрузка: 40%");
					break;
				
				// ERRORS
				case 'VKWebAppCallAPIMethodFailed':// Ошибка
					//this.errorOut("ERROR: VKWebAppCallAPIMethodFailed: " + event.detail.data.error_type);
					App.flagSearch = true;
					this.errorOut("ERROR: VKWebAppCallAPIMethodFailed: " + event.detail.data.error_data.error_msg);
					break;
				case 'VKWebAppInitFailed':// Ошибка
					this.errorOut("ERROR: VKWebAppInit");
					break;
				case 'VKWebAppAccessTokenFailed':// Ошибка 111
					this.errorOut("ERROR: VKWebAppAccessTokenFailed");
					let error = event.detail.data;
					if(error.error_type === "client_error")this.errorOut("error AccessToken client: "+error.error_data.error_code);
					else if(error.error_type === "api_error")this.errorOut("error AccessToken api: "+error.error_data.error_code);
					else this.errorOut("error AccessToken auth: "+error.error_data.error);
					break;
				case 'VKWebAppStorageGetFailed':// Ошибка
					this.errorOut("ERROR: VKWebAppStorageGet");
					break;
				
			}
		});
		vkBridge.send('VKWebAppInit');
	}
	infoOut(text){
		this.setState({infoText: text});
	}
	errorOut(text){
		//this.setState({infoText: "Ошибка: Рекомендуется перезапустить."});
		//console.log(text);
		//this.setState({infoText: text});
	}
	
	static ilmit_posts = 100;// лимит на количество проверяемых постов за раз. 
	static count = 0;// max 100;//Вычисляемое свойство для определения количества проверяемых постов на одну стену. ilmit_posts/количество_стен
	
	searchPosts(){
		if(App.flagSearch)App.flagSearch = false;
		else return;
		this.infoOut("Готовим поиск.");
		// определяем группы для поиска
		let owner_ids = [];
		App.data.wallArray.forEach(value => {
			if(value.isSearch)owner_ids.push(value.id);
		});
		if(owner_ids.length > App.data.maxWallsStorage){
			this.infoOut("Максимум можно выбрать " + App.data.maxWallsStorage + " стен для поиска.");
			App.flagSearch = true;
			return;
		}else if(owner_ids.length === 0){
			this.setState({idContent: 1});
			this.infoOut("Выберите стену для поиска.");
			App.flagSearch = true;
			return;
		}
		App.count = App.ilmit_posts / owner_ids.length | 0;
		vkBridge.send("VKWebAppCallAPIMethod", {
			method: "execute.searchPosts",
			params: {
				owner_ids: owner_ids.join(),
				offset: App.data.criterias.offset,
				count: App.count,
				v: "5.199", // Например, "5.134"
				func_v: "1", // Например, "Версия 1"
				access_token: App.user_token
			}
		});
		
		
		this.infoOut("Идет поиск.");
	}
	handleClickPanel(id){
		if(id === this.state.idContent){
			if(id === 0)this.searchPosts();
			else this.setState({idContent: 0});
		}else this.setState({idContent: id});
	}
	handleSearchCriterias(name, value){
		App.data.criterias[name] = value;
		if(name !== "offset"){
			App.data.criterias.offset = 0;
			App.flagSearchData = true;
		}
	}
	addGpoup(id){
		if(App.data.wallArray.length >= App.data.maxWallsStorage)this.infoOut("Максимум можно добавить " + App.data.maxWallsStorage + " стен для поиска.");
		else{
			for(let i = 0; i < App.userGroups.length; i++)
				if(App.userGroups[i].id == id){
					App.userGroups[i].isSearch = false;
					App.data.wallArray.unshift(App.userGroups[i]);
					this.infoOut("Стена id: " + App.userGroups[i].id + " добавлена");
					App.flagSearchData = true;
					break;
				}
		}
		this.setState({idContent: 1});
	}
	addWall(url){
		if(App.data.wallArray.length >= App.data.maxWallsStorage){
			this.infoOut("Максимум можно добавить " + App.data.maxWallsStorage + " стен для поиска.");
			return;
		}
		let end = url.indexOf('?');
		if(end === -1)end = url.length;
		url = url.slice(url.lastIndexOf('/') + 1, end);
		if(url !== ""){
			if(App.data.wallArray.find(wall => wall.domain === url) === undefined){
				vkBridge.send("VKWebAppCallAPIMethod", {
					method: "execute.getWall",
					params: {
						screen_name:url,
						v: "5.199", // Например, "5.134"
						func_v: "1", // Например, "Версия 1"
						access_token: App.user_token
					}
				});			
			}else this.infoOut("Стена c domain: " + url + " уже есть.");
		}else{
			// open user groups
			this.loadUserGroups();
		}
	}
	delPosts(){
		App.data.postArray = [];
		this.forceUpdate();
	}
	delWall(id){
		for(let i = 0; i < App.data.wallArray.length; i++)
			if(App.data.wallArray[i].id == id){
				if(App.data.wallArray[i].isSearch)App.data.criterias.offset = 0;
				App.data.wallArray.splice(i, 1);
				break;
			}
		App.flagSearchData = true;
		this.forceUpdate();
	}
	checkWall(wall){
		wall.isSearch = !wall.isSearch;
		App.flagSearchData = true;
		//if(wall.isSearch)App.data.criterias.offset = 0;
		App.data.criterias.offset = 0;
	}
	delPost(id){
		App.data.postArray.splice(id, 1);
		this.forceUpdate();
	}
	
	openPost(id){
		/* Временно
		window.open(host + "wall" + App.data.postArray[id].owner_id + "_" + App.data.postArray[id].id, '_blank');
		return;/* Временно */
		vkBridge.supportsAsync("VKWebAppOpenWallPost").then( res => {
			if(res && !App.is_layer){// && !App.is_layer Временно пока не исправят баг
				vkBridge.send('VKWebAppOpenWallPost', {
					owner_id: App.data.postArray[id].owner_id,
					post_id: App.data.postArray[id].id
				}).then((data) => {
					if(data.result){
						// Делаем ссылку на пост посещенной.
						/*
						// сделать ссылку на пост посещенной.
						let current_url = window.location.href;
						try{
							history.pushState(null, "vk", host + "wall" + App.data.postArray[id].owner_id + "_" + App.data.postArray[id].id);
							history.replaceState({}, "", current_url);
						}catch(err){
							//alert(err);
							//alert(host + "wall" + App.data.postArray[id].owner_id + "_" + App.data.postArray[id].id);
						}
						/**/
					}
				}).catch((error) => {
					// Ошибка
					window.open(host + "wall" + App.data.postArray[id].owner_id + "_" + App.data.postArray[id].id, '_blank');
					if(error.error_type === "client_error")this.errorOut("error openPost client: "+error.error_data.error_code);
					else if(error.error_type === "api_error")this.errorOut("error openPost api: "+error.error_data.error_code);
					else this.errorOut("error openPost auth: "+error.error_data.error);
				});
			}else window.open(host + "wall" + App.data.postArray[id].owner_id + "_" + App.data.postArray[id].id, '_blank');
		});
	}
	render(){
		let content, title;
		if(this.state.idContent === 0){
			content = <Result flagSearch={App.flagSearch} searchPosts={this.searchPosts} openPost={this.openPost} delPost={this.delPost} delPosts={this.delPosts} posts={App.data.postArray} data={App.data}/>;
			title = "Для сортировки постов нажмите кнопку ниже";
		}else if(this.state.idContent === 1){
			content = <WallList wallArray={App.data.wallArray} addWall={this.addWall} delWall={this.delWall} checkWall={this.checkWall} />;
			title = "Отметьте группы в которых искать";
		}else if(this.state.idContent === 2){
			content = <SearchCriteria handleSearchCriterias={this.handleSearchCriterias} searchCriterias={App.data.criterias} />;
			title = "Условия для фильтра постов";
		}else if(this.state.idContent === 3){
			content = <Help help={this.help} resetData={this.resetData} />;
			title = "";
		}else if(this.state.idContent === 4){
			content = <WallUserList addGpoup={this.addGpoup} userGroups={App.userGroups} />;
			title = "Группы для добавления в список групп для поиска";
		}
		return(
			<div className="app">
				<div className="header">
					<span className="button mc_1" onClick={() => this.handleClickPanel(1)}>Группы</span>
					<span className="button mc_2" onClick={() => this.handleClickPanel(2)}>Фильтры</span>
					<span className="button mc_3" onClick={() => this.handleClickPanel(0)}>Поиск</span>
					<span className="button mc_4 right" onClick={() => this.handleClickPanel(3)}>?</span>
				</div>
				<center className="title">{title}</center>
				{content}
				<Info text={this.state.infoText}/>
				
				<span className="block_not_token" style={{display: (this.state.isToken ? 'none': 'block') }} onClick={e => {
						vkBridge.send('VKWebAppGetAuthToken', {app_id: App.app_id, scope: ''});
						e.stopPropagation();
					}} >
					<span>
						<span className="mc_4">Ошибка</span><br/>
						Приложению необходим общий доступ, так приложение сможет делать корректные запросы к постам ваших групп.<br/>
						<span className="mc_2">Нажмите чтобы подтвердить доступ</span>
					</span>
				</span>
			</div>
		);
	}
}