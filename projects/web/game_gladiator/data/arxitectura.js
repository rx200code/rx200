
/**
Damage = D*cnt*Hi
i = A1 — Z2
Hi = (1.0 + 0.1*sign(i))**abs(i)
где:
D – урон атакующего юнита
cnt – количество атакующих юнитов
Hi — коэффициент урона
A1 – уровень атаки атакующего юнита, с учётом уровня атаки героя
Z2 — уровень защиты атакуемого юнита, с учётом уровня защиты героя
i — величина различия атаки атакующего и защиты атакуемого
sign(i) — функция знака числа. Если i < 0, то sign(i) = -1; если i = 0, то sign(i) = 0; если i > 0, то sign(i) = 1
abs(i) — абсолютное значение. Если i < 0, то abs(i) = -i; иначе abs(i) = i
** — возведение в степень
/**/


const b_unit = {// прототип характеристик персонажа, непосредственно учавствующих в итве.
	// Характеристики на которые напрямую игрок влиять не может.
	ap:2,// action points - очки действий
	in:0,// initiative - инициатива

	re:3,// review - обзор.
	st:0,// stealth - скрытность

	// определяют наносимый получаемый урон 
	hp:1,// hit points, health points - очки жизни, здоровья
	dd:1,// Damage Dealer - наносящий урон
	
	at:0,// attack - атака
	de:0,// defense - защита

	ac:0,// accuracy - точность, меткость.// в том числе с силой влияет на дальность атак
	ev:0,// evasion - уклонение.
}

const _unit = {// прототип персонажа.
	// Характеристики на которые напрямую игрок влиять не может.
	ap:2,// action points - очки действий
	in:0,// initiative - инициатива

	re:3,// review - обзор.
	st:0,// stealth - скрытность

	// боевые
	hp:1,// hit points, health points - очки жизни, здоровья
	dd:1,// Damage Dealer - наносящий урон
	
	at:0,// attack - атака
	de:0,// defense - защита

	ac:0,// accuracy - точность, меткость.// влияет на дальность атак
	ev:0,// evasion - уклонение.

	// не боявые
	xp:0,// experience Points - очки опыта.
	le:0,// level - уровень. // за уровень получает points
	po:0,// points - очки которые игрок распределяет на характеристики ниже.

	// Характеристики изменяемые игроком и влияющие на характеристики выше.
	sp:0,// speed - скорость влияет на ap - 1 = 0.5 ap
	rea:0,// reaction - реакция влияет на in - 1 = 1 in

	en:0,// endurance - выносливость, влияет на hp - 1 = 0.8 hp
	str:0,// strength, - сила влияет на dd - 1 = 0.7 dd

	sh:0,// sharpshooting - меткость, влияет на ac - 1 = 0.8 ac
	ag:0,// agility - ловкость, влияет на ev - 1 = 1 ev
	
	vi:0,// vigilance - бдительность, зоркость влияет на re - 1 = 1 re
	inv:0,// invisibility - невидимость влияет на st - 1 = 0.8 st

	// Методы.
	getHp(){
		return hp + en * .8;
	}

}




const unit = {
	// основные характеристики влияющие на другие. от 0 до 31
	st:int,// strength, - сила
	iq:int,// intellect - интеллект
	sp:int,// spirituality, spirit - духовность, душа
	ag:int,// agility - ловкость
	in:int,// intuition - интуиция
	//
	xp:int,// experience Points - очки опыта.
	// второстепенные
	hp:int,// hit points, health points - очки жизни, здоровья
	at:int,// attack - атака
	de:int,// defense - защита
	mp:int,// magical power - магическая сила
	re:int,// reaction - реакция
	
	ap:int,// action points - очки действий
	stealth:int,// stealth - скрытность
	vigilance:int,// vigilance - бдительность, зоркость
	craftsman:int,// craftsman - ремесленник
	tr:int,// trade - торговля
	ac:int,// accuracy - точность, меткость.
	sh:int,// sharpshooting - меткость.
	re:int,// review - обзор.
	in:int,// invisibility - невидимость.
	in:int,// initiative - инициатива
	sp:int,// speed - скорость
};

const game = {
	// data
	texts:[

	],
	races:[
		{
			name:""
		},
	],
	units:[
		{
			name:"",
			race:"",
		},
	],
	cellTypes:[
		{}
	],
	resources:[
		{
			id: 0,
			name: "money",
			price: 1,
			weight: 0
		},
	],
	items:[

		"end"
	],
	// structure
	Players:[Player],

	MapWorld:{
		ObjWorld:{
			MapLocal:{
				ObjLocal:{
					Field:{
						Cell:{
							type:id,
							items:[id],
							ObjCell:id,
							Unit:id
						}
					}
				}
			}
		}
	},
};

Field = {
	w:width * 2 + 1,// x
	h:height * 2 + 1,// y
	// Цена перемещения коэффициенты
	/* стандартно.
	0 для не четных
	1 для не четных по одной оси
	(1 + 1) ** .5 для четным по двум осям.
	перемещаться на четные не может.
	у каждой клетки 8 соседей.
	Infinity для крайних границ.
	*/
	// Задачи Field следить при размещении объектов за блокированием клеток, Cells:[[Infinity]]

	// слои
	Cells:[[]],
	Objects:[],

};

