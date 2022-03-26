const tool_id = 'active_skill';

let filter_set = new Set();
let option_obj = {};
let or_filter = true;
let keyword_search = false;
let sort_by = 'id';
let sort_by_method = [['id', '依編號排序'], ['charge', '依 CD/EP 排序'], ['attribute', '依屬性排序'], ['race', '依種族排序'], ['skill', '依功能排序']];
let theme = 'normal';
let searchResult = [];
let searchResultCharge = [];
let playerData = {uid: '', card: []}
let useInventory = false;

let easterEggFlag = false;

let easterEggData = {
	"id": 595636351,
	"name": "蒼曜",
	"attribute": "木",
	"race": "人類",
	"star": 8,
	"monsterTag": [],
	"crossOver": false,
	"skill": [
		{
			"name": "毫無反應，就是個工程師",
			"type": "normal",
			"charge": "CD",
			"num": 1,
			"description": "I. 發動技能時<br>⇒ 「安安你好，我是作者」<br>⇒ 「不用去翻背包或圖鑑了，這不是卡片只是張名片」<br>II. 每週隨機時機<br>⇒ 更新資料庫<br><br>效果持續至退坑為止",
			"tag": []
		},
	],
	"team_skill": [],
	"maxLevel": 99,
	"maxSkill": 99,
	"maxRefine": 0,
	"version": ""
}

$(document).ready(function() {
    init();
    
    location.search && readUrl();
});

function openOptionPanel()
{
    $('#optionPanel').modal('show');
    renderOptionPanel();
}

function renderOptionPanel() {
    let hasSelectedSkill = false;
    $(".filter-row .filter").each(function() {
        if($(this).prop('checked'))
        {
            if(!(Object.keys(option_obj).includes($(this).next("label").text())))
            {
                option_obj[$(this).next("label").text()] = Array(option_text.length).fill(false);
            }
            hasSelectedSkill = true;
        }
        else 
        {
            if($(this).next("label").text() in option_obj)
            {
                delete option_obj[$(this).next("label").text()];
            }
        }
    });
    
    let render_str = "";
    let option_id = 0;
    skill_type_string.forEach(function(row) {
        row.forEach(function(skill) {
            if(Object.keys(option_obj).includes(skill))
            {
                render_str += "<div class='row option-row'>";
                render_str += "     <div class='col-12 col-md-12 col-lg-4 option-text'>"+skill+"</div>";
                option_text.forEach(function(text, j){
                    render_str += "     <div class='col-12 col-md-4 col-lg-2 btn-shell'><input type='checkbox' class='filter' id='option-"+(option_id*option_text.length+j)+"' "+(option_obj[skill][j] ? 'checked': '')+"><label class='p-1 w-100 text-center option-btn' for='option-"+(option_id*option_text.length+j)+"'>"+text+"</label></div>";
                })
                render_str += "<hr>";
                render_str += "</div>";
                option_id ++;
            }
        })
    })
    
    $("#optionPanel .modal-body").html(render_str)
}

function recordOption() {
    $("#optionPanel .option-row").each(function(){
        let option_text = $(this).find('.option-text').html();
        $(this).children('.btn-shell').each(function(i) {
            option_obj[option_text][i] = $(this).find('.filter').prop('checked');
        })
    });
}

function openUidInputPanel()
{
    $('#uidPanel').modal('show');
    renderUidInputPanel();
}

function renderUidInputPanel()
{
    let render_str = "";
	render_str += `
	<div class='row uid-row'>
		<div class='col-6 col-md-6 col-lg-6 uid-nav uid-nav-active' id='loadInventoryNav' onclick='switchGetInventory("load")'>匯入背包</div>
		<div class='col-6 col-md-6 col-lg-6 uid-nav' id='updateInventoryNav' onclick='switchGetInventory("update")'>更新背包</div>
		<div class='col-12 my-2'></div>
		
		<div class='col-12 col-md-12 col-lg-12 uid-tab' id='loadInventoryTab' style='display: block;'>
			<div class='col-12 col-md-12 col-lg-12 btn-shell'>
				<input type='text' class='form-control uid-input' id='load-uid-input' placeholder='輸入 UID' maxlength=${uid_maxlength} onkeypress='return (event.charCode !=8 && event.charCode ==0 || (event.charCode >= 48 && event.charCode <= 57))'>
			</div>
			<div class='col-12 col-md-12 col-lg-12 btn-shell'>
				<div>
					<button class='btn btn-success btn-block uid-btn' id='load-confirm-uid' onclick='getPlayerInventory("load")'>
						確定
					</button>
				</div>
				<div>
					<button class='btn btn-success btn-block uid-btn' id='load-save-inventory' onclick='savePlayerInventory("load")'>
						儲存背包
					</button>
				</div>
			</div>
			<div class='col-12 col-md-12 col-lg-12 uid-status' id='load-uid-status'></div>
		</div>
		
		<div class='col-12 col-md-12 col-lg-12 uid-tab' id='updateInventoryTab' style='display: none;'>
			<div class='col-12 col-md-12 col-lg-12 btn-shell'>
				<input type='text' class='form-control uid-input' id='update-uid-input' placeholder='輸入 UID' maxlength=${uid_maxlength} onkeypress='return (event.charCode !=8 && event.charCode ==0 || (event.charCode >= 48 && event.charCode <= 57))'>
			</div>
			<div class='col-12 col-md-12 col-lg-12 btn-shell'>
				<input type='text' class='form-control uid-input' id='update-veri-input' placeholder='輸入驗證碼' maxlength=${veri_maxlength} onkeypress='return (event.charCode !=8 && event.charCode ==0 || (event.charCode >= 48 && event.charCode <= 57))'>
			</div>
			<div class='col-12 col-md-12 col-lg-12 btn-shell'>
				<div>
					<button class='btn btn-success btn-block uid-btn' id='update-confirm-uid' onclick='getPlayerInventory("update")'>
						確定
					</button>
				</div>
				<div>
					<button class='btn btn-success btn-block uid-btn' id='update-save-inventory' onclick='savePlayerInventory("update")'>
						儲存背包
					</button>
				</div>
			</div>
			<div class='col-12 col-md-12 col-lg-12 uid-status' id='update-uid-status'></div>
		</div>
	</div>
	`

    $("#uidPanel .modal-body").html(render_str)
	$('#load-confirm-uid').css({'display': 'block'})
	$('#load-save-inventory').css({'display': 'none'})
	$('#update-confirm-uid').css({'display': 'block'})
	$('#update-save-inventory').css({'display': 'none'})
}

function switchGetInventory(state)
{
	if(state === 'load') {
		$("#loadInventoryNav").addClass('uid-nav-active')
		$("#updateInventoryNav").removeClass('uid-nav-active')
		
		$("#loadInventoryTab").css({'display': 'block'})
		$("#updateInventoryTab").css({'display': 'none'})
	}
	else {
		$("#loadInventoryNav").removeClass('uid-nav-active')
		$("#updateInventoryNav").addClass('uid-nav-active')
		
		$("#loadInventoryTab").css({'display': 'none'})
		$("#updateInventoryTab").css({'display': 'block'})
	}
	
	$('#load-uid-input').val('')
	$('#update-uid-input').val('')
	$('#update-veri-input').val('')
	$('#load-confirm-uid').css({'display': 'block'})
	$('#load-save-inventory').css({'display': 'none'})
	$('#update-confirm-uid').css({'display': 'block'})
	$('#update-save-inventory').css({'display': 'none'})
	$('#load-uid-status').html('')
	$('#update-uid-status').html('')
	$('#load-uid-input').attr('disabled', false)
	$('#update-uid-input').attr('disabled', false)
}

function startFilter()
{
    changeUrl();
    
    let skill_set = new Set();
    let attr_set = new Set();
    let race_set = new Set();
    let star_set = new Set();
    let charge_set = new Set();
    let tag_set = new Set();
    
    let filter_charge_set = new Set();
    
    let isSkillSelected = false;
    let isAttrSelected = false;
    let isRaceSelected = false;
    let isStarSelected = false;
    let isChargeSelected = false;
    let isTagSelected = false;
	
	easterEggFlag = false;
    
    if(keyword_search == false)
    {
        filter_set.clear();
    
        [skill_set, isSkillSelected] = getSelectedButton('filter');
        [attr_set, isAttrSelected] = getSelectedButton('attr');
        [race_set, isRaceSelected] = getSelectedButton('race');
        [star_set, isStarSelected] = getSelectedButton('star', true);
        [charge_set, isChargeSelected] = getSelectedButton('charge');
        [tag_set, isTagSelected] = getSelectedButton('tag');
		
        $.each(monster_data, (index, monster) => {
			
			// if(useInventory && !playerData.card.includes(monster.id)) return;

            if( (!monster.star || monster.star <= 0) ||
                (isAttrSelected && !attr_set.has(monster.attribute)) || 
                (isRaceSelected && !race_set.has(monster.race)) || 
                (isStarSelected && !star_set.has(monster.star))) return;
				
			if(isTagSelected) {
				let hasTag = false;
				
				$.each(monster.monsterTag, (tag_index, tag) => {
					if(tag_set.has(tag)) {
						hasTag = true;
						return;
					}
				})
				
				if((tag_set.has('自家') && !monster.crossOver) || (tag_set.has('合作') && monster.crossOver)) hasTag = true;
				if(!hasTag) return;
			}
            
            if(isSkillSelected) {
                let skill_num_array = [];
                
                $.each(monster.skill, (skill_index, monster_skill) => {
                    if(isChargeSelected && !charge_set.has(monster_skill.charge)) return;
                    
                    if(or_filter)       // OR
                    {
                        let isSkillMatch = false;
                        
                        $.each([...skill_set], (skill_set_index, selected_feat) => {
                            let isTagChecked = false;
                            
                            $.each(monster_skill.tag, (tag_index, tag) => {
                                if($.isArray(tag))      // Tag with round mark
                                {
                                    if(tag[0] == selected_feat) {
                                        if(selected_feat in option_obj)
                                        {
                                            if( (tag[1] == 1 && option_obj[selected_feat][0]) ||
                                                (tag[1] > 1  && option_obj[selected_feat][1]) ||
                                                (tag[1] == -1 && option_obj[selected_feat][2]) ||
                                                (!option_obj[selected_feat][0] && !option_obj[selected_feat][1] && !option_obj[selected_feat][2])
                                            ) 
                                            {
                                                isTagChecked = true;
                                            }
                                        }
                                        else isTagChecked = true;
                                    }
                                }
                                else      // Tag without round mark
                                {
                                    if(tag == selected_feat) {
                                        if(selected_feat in option_obj)
                                        {
                                            if( option_obj[selected_feat][0] ||
                                                (!option_obj[selected_feat][0] && !option_obj[selected_feat][1] && !option_obj[selected_feat][2])
                                            ) 
                                            {
                                                isTagChecked = true;
                                            }
                                        }
                                        else isTagChecked = true;
                                    }
                                }
                                
                                if(isTagChecked)
                                {
                                    isSkillMatch = true;
                                    return false;
                                }
                            })
                        })
                        
                        if(!isSkillMatch) return;
                    }
                    else       // AND
                    {
                        let isSkillMatch = true;
                        
                        $.each([...skill_set], (skill_set_index, selected_feat) => {
                            let isTagChecked = false;
                            $.each(monster_skill.tag, (tag_index, tag) => {
                                if($.isArray(tag))
                                {
                                    if(tag[0] == selected_feat) {
                                        if(selected_feat in option_obj)
                                        {
                                            if( (tag[1] == 1 && option_obj[selected_feat][0]) ||
                                                (tag[1] > 1  && option_obj[selected_feat][1]) ||
                                                (tag[1] == -1 && option_obj[selected_feat][2]) ||
                                                (!option_obj[selected_feat][0] && !option_obj[selected_feat][1] && !option_obj[selected_feat][2])
                                            ) 
                                            {
                                                isTagChecked = true;
                                                return false;
                                            }
                                        }
                                        else
                                        {
                                            isTagChecked = true;
                                            return false;
                                        }
                                    }
                                }
                                else
                                {
                                    if(tag == selected_feat) {
                                        if(selected_feat in option_obj)
                                        {
                                            if( option_obj[selected_feat][0] ||
                                                (!option_obj[selected_feat][0] && !option_obj[selected_feat][1] && !option_obj[selected_feat][2])
                                            ) 
                                            {
                                                isTagChecked = true;
                                                return false;
                                            }
                                        }
                                        else
                                        {
                                            isTagChecked = true;
                                            return false;
                                        }
                                    }
                                }
                            })
                                
                            if(!isTagChecked)
                            {
                                isSkillMatch = false;
                            }
                        })
                        
                        if(!isSkillMatch) return;
                    }
                    
                    let charge = ('reduce' in monster_skill) ? monster_skill.num - monster_skill.reduce : monster_skill.num;
                    
                    skill_num_array.push(skill_index);
                    filter_charge_set.add({'id': monster.id, 'num': skill_index, 'charge': charge});
                    
                })
                
                if(skill_num_array.length > 0) filter_set.add({'id': monster.id, 'attr': monster.attribute, 'race': monster.race, 'nums': skill_num_array});
            }
            else {
                let skill_num_array = [];
                
                $.each(monster.skill, (skill_index, monster_skill) => {
                    if(isChargeSelected && (!charge_set.has(monster_skill.charge) || monster_skill.name.length <= 0)) return;
                    
                    let charge = ('reduce' in monster_skill) ? monster_skill.num - monster_skill.reduce : monster_skill.num;
                    
                    skill_num_array.push(skill_index);
                    filter_charge_set.add({'id': monster.id, 'num': skill_index, 'charge': charge});
                })
                
                if(skill_num_array.length > 0) filter_set.add({'id': monster.id, 'attr': monster.attribute, 'race': monster.race, 'nums': skill_num_array});
            }
        })
    }
    else        // keyword search mode
    {
        filter_set.clear();
    
        let keyword_set = checkKeyword();
        if(!keyword_set) return;
		
		// easter egg :)
		if(keyword_set.size === 1 && [...keyword_set][0] === '蒼曜') easterEggFlag = true;
        
        [attr_set, isAttrSelected] = getSelectedButton('attr');
        [race_set, isRaceSelected] = getSelectedButton('race');
        [star_set, isStarSelected] = getSelectedButton('star', true);
        [charge_set, isChargeSelected] = getSelectedButton('charge');
        [tag_set, isTagSelected] = getSelectedButton('tag');
        
        $.each(monster_data, (index, monster) => {
			
			// if(useInventory && !playerData.card.includes(monster.id)) return;
			
            if( (!monster.star || monster.star <= 0) ||
                (isAttrSelected && !attr_set.has(monster.attribute)) || 
                (isRaceSelected && !race_set.has(monster.race)) || 
                (isStarSelected && !star_set.has(monster.star))) return;
				
			if(isTagSelected) {
				let hasTag = false;
				
				$.each(monster.monsterTag, (tag_index, tag) => {
					if(tag_set.has(tag)) {
						hasTag = true;
						return;
					}
				})
				
				if((tag_set.has('自家') && !monster.crossOver) || (tag_set.has('合作') && monster.crossOver)) hasTag = true;
				if(!hasTag) return;
			}
            
            let skill_num_array = [];
            $.each(monster.skill, (skill_index, monster_skill) => {
                if(isChargeSelected && !charge_set.has(monster_skill.charge)) return;
                
                if(or_filter)
                {
                    let isKeywordChecked = false;
                    let skill_desc = textSanitizer(monster_skill.description);
                    
                    $.each([...keyword_set], (keyword_index, keyword) => {
                        if(skill_desc.includes(keyword))
                        {
                            isKeywordChecked = true;
                            return false;
                        }
                    })
                    
                    if(!isKeywordChecked) return;
                }
                else
                {
                    let isKeywordChecked = true;
                    let skill_desc = textSanitizer(monster_skill.description);
                    
                    $.each([...keyword_set], (keyword_index, keyword) => {
                        if(!skill_desc.includes(keyword))
                        {
                            isKeywordChecked = false;
                            return false;
                        }
                    })
                    
                    if(!isKeywordChecked) return;
                }
                
                let charge = ('reduce' in monster_skill) ? monster_skill.num - monster_skill.reduce : monster_skill.num;
                    
                skill_num_array.push(skill_index);
                filter_charge_set.add({'id': monster.id, 'num': skill_index, 'charge': charge});
            })
            
            if(skill_num_array.length > 0) filter_set.add({'id': monster.id, 'attr': monster.attribute, 'race': monster.race, 'nums': skill_num_array});
        })
    }
    
    $(".row.result-row").show();
    
	searchResult = [...filter_set];
    searchResultCharge = [...filter_charge_set];
	
	renderResult();
    
    $('.result').tooltip({ 
        boundary: 'scrollParent', 
        placement: 'auto', 
        container: 'body'
    });
    
    $(".search_tag").html(() => {
        let tag_html = "";
        
        if(!keyword_search)
        {
            $.each([...skill_set], (skill_index, skill) => {
                
                if(option_obj[skill]) {
                    if( option_obj[skill].every(e => e === false) || 
                        option_obj[skill].every(e => e === true)) {
                        tag_html += renderTags([skill], 'skill');
                    }
                    else {
                        $.each(option_obj[skill], (option_index, option) => {
                            if(option) {
                                tag_html += `
                                    <div class="col-12 col-sm-3 tag_wrapper">
                                        <div class="skill_tag" title="${skill} (${option_text[option_index]})">${skill} <font style="color: #CCCCFF; font-size: 0.8em;">(${option_text[option_index]})</font>
                                        </div>
                                    </div>
                                `;
                            }
                        })
                    }
                }
                else tag_html += renderTags([skill], 'skill');
            })
        }
        
        tag_html += renderTags(tag_set, 'tag');
        tag_html += renderTags(attr_set, 'genre', '屬性');
        tag_html += renderTags(race_set, 'genre');
        tag_html += renderTags(star_set, 'genre', ' ★');
        tag_html += renderTags(charge_set, 'genre');
        
        return tag_html;
    });
	
    jumpTo("result_title");
}

function renderEasterEggResult() {
	const monster = {'id': easterEggData.id, 'attr': easterEggData.attribute, 'race': easterEggData.race, 'nums': [0]};
	
	$("#result-row").html(() => {
		let str = "";
		let sk_str = "";
				
		sk_str += renderMonsterInfo(monster, easterEggData);
		
		$.each(monster.nums, (num_index, skill_number) => {
			sk_str += renderSkillInfo(monster, skill_number, easterEggData);
		})
		
		str += renderMonsterImage(monster, sk_str, easterEggData, true);
		return str;
	});
	
    $('[data-toggle=popover]').popover({
		container: 'body',
		html: true,
		sanitize: false,
		trigger: 'focus',
		placement: 'bottom',
    });
    
	$("#uid-tag").text(`UID: ${playerData.uid}`)
}

function renderResult() {
	if(easterEggFlag) {
		renderEasterEggResult();
		return;
	}
	
	$("#result-row").html(() => {
        if(sort_by == 'id')
        {
            /*searchResult.sort((a, b) => { 
                return a.id - b.id;
            });*/
            let str = "";
            
            if(searchResult.length != 0)
            {
                $.each(searchResult, (index, monster) => {
                    
                    let sk_str = "";
                    
					sk_str += renderMonsterInfo(monster);
					
                    $.each(monster.nums, (num_index, skill_number) => {
                        sk_str += renderSkillInfo(monster, skill_number);
                    })
                    
                    str += renderMonsterImage(monster, sk_str);
                });
            }
            else
            {
                str = `<div class='col-12' style='padding-top: 20px; text-align: center; color: #888888;'><h1>查無結果</h1></div>`;
            }
            return str;
        }
        else if(sort_by == 'charge')
        {
            searchResultCharge.sort((a, b) => { 
                return a.charge - b.charge;
            });
            
            let str = "";
            let now_cd = 0;
            
            if(searchResultCharge.length != 0)
            {
                $.each(searchResultCharge, (index, monster) => {
                    
                    if(monster.charge != now_cd && monster.charge > 0)
                    {
                        now_cd = monster.charge;
                        str += `
                            <div class='col-sm-12'><hr class='charge_num_hr'></div>
                            <div class='col-sm-12 charge_num_div'>&nbsp;${now_cd}</div>
                        `;
                    }
                    
                    let sk_str = "";
                    
					sk_str += renderMonsterInfo(monster);
                    
                    sk_str += renderSkillInfo(monster, monster.num);
                    
                    str += renderMonsterImage(monster, sk_str);
                });
            }
            else
            {
                str = `<div class='col-sm-12' style="text-align: center; color: #888888;"><h1>查無結果</h1></div>`;
            }
            return str;
        }
        else if(sort_by == 'attribute')
        {
            let attr_obj = {}
            $.each(attr_type_string, (attr_index, attr_str) => {
                attr_obj[attr_str] = [];
            })
            
            $.each(searchResult, (monster_index, monster) => {
                attr_obj[monster.attr].push(monster);
            })
            
            let str = "";
            
            if(searchResult.length != 0)
            {
                $.each(attr_obj, (attr_index, attr) => {
                    str += `
                        <div class='col-sm-12'><hr class='charge_num_hr'></div>
                        <div class='col-sm-12 charge_num_div' style='color: ${attr_color[attr_index]};'>
                            <img src='../tos_tool_data/img/monster/icon_${attr_zh_to_en[attr_index]}.png' style='max-width: 40px;'\>
                            &nbsp;${attr_index}
                        </div>
                    `;
                    
                    if(attr.length != 0) {
                        $.each(attr, (monster_index, monster) => {
                            let sk_str = "";
                    
							sk_str += renderMonsterInfo(monster);
                        
                            $.each(monster.nums, (num_index, skill_number) => {
                                sk_str += renderSkillInfo(monster, skill_number);
                            })
                            
                            str += renderMonsterImage(monster, sk_str);
                        });
                    }
                    else str += `<div class='col-12' style='text-align: center; color: #888888;'><h2>查無結果</h2></div>`;
                });
            }
            else
            {
                str = `<div class='col-12' style='padding-top: 20px; text-align: center; color: #888888;'><h1>查無結果</h1></div>`;
            }
            return str;
        }
        else if(sort_by == 'race')
        {
            let race_obj = {}
            $.each(race_type_string, (race_index, race_str) => {
                race_obj[race_str] = [];
            })
            
            $.each(searchResult, (monster_index, monster) => {
                race_obj[monster.race].push(monster);
            })
            
            let str = "";
            
            if(searchResult.length != 0)
            {
                $.each(race_obj, (race_index, race) => {
                    str += `
                        <div class='col-sm-12'><hr class='charge_num_hr'></div>
                        <div class='col-sm-12 charge_num_div'>
                            <img src='../tos_tool_data/img/monster/icon_${race_zh_to_en[race_index]}.png' style='max-width: 40px;'\>
                            &nbsp;${race_index}
                        </div>
                    `;
                    
                    if(race.length != 0) {
                        $.each(race, (monster_index, monster) => {
                            let sk_str = "";
                    
							sk_str += renderMonsterInfo(monster);
							
                            $.each(monster.nums, (num_index, skill_number) => {
                                sk_str += renderSkillInfo(monster, skill_number);
                            })
                            
                            str += renderMonsterImage(monster, sk_str);
                        });
                    }
                    else str += `<div class='col-12' style='text-align: center; color: #888888;'><h2>查無結果</h2></div>`;
                });
            }
            else
            {
                str = `<div class='col-12' style='padding-top: 20px; text-align: center; color: #888888;'><h1>查無結果</h1></div>`;
            }
            return str;
        }
        else if(sort_by == 'skill')
        {
            let skill_obj = {}
            $.each(skill_type_string, (skill_group_index, skill_group) => {
				$.each(skill_group, (skill_index, skill_str) => {
					skill_obj[skill_str] = []
				})
            })
			
            $.each(searchResult, (monster_index, monster) => {
				const skill_tags_array = monster_data.find(m => monster.id === m.id).skill.map(s => s.tag)
				$.each(monster.nums, (skill_index, skill) => {
					$.each(skill_tags_array[skill], (tag_index, tag) => {
						const tag_str = $.isArray(tag) ? tag[0] : tag
						console.log(monster, tag_str)
						const isMonsterExist = skill_obj[tag_str].some(m => monster.id === m.id)
						
						if(isMonsterExist) {
							skill_obj[tag_str].find(m => monster.id === m.id)?.nums.push(skill)
						} else {
							skill_obj[tag_str].push({...monster, nums:[skill]})
						}
					})
				})
            })
            
            let str = "";
            
            if(searchResult.length != 0)
            {
                $.each(skill_obj, (skill_index, skill) => {
                    str += `
                        <div class='col-sm-12'><hr class='charge_num_hr'></div>
                        <div class='col-sm-12 charge_num_div'>
                            ${skill_index}
                        </div>
                    `;
                    
                    if(skill.length != 0) {
                        $.each(skill, (monster_index, monster) => {
                            let sk_str = "";
                    
							sk_str += renderMonsterInfo(monster);
							
                            $.each(monster.nums, (num_index, skill_number) => {
                                sk_str += renderSkillInfo(monster, skill_number);
                            })
                            
                            str += renderMonsterImage(monster, sk_str);
                        });
                    }
                    else str += `<div class='col-12' style='text-align: center; color: #888888;'><h2>查無結果</h2></div>`;
                });
            }
            else
            {
                str = `<div class='col-12' style='padding-top: 20px; text-align: center; color: #888888;'><h1>查無結果</h1></div>`;
            }
            return str;
        }
    });
	
    $('[data-toggle=popover]').popover({
		container: 'body',
		html: true,
		sanitize: false,
		trigger: 'focus',
		placement: 'bottom',
    });
    
	$("#uid-tag").text(`UID: ${playerData.uid}`)
}

function renderMonsterInfo(monster, monsterObj) {
	const monster_info = monsterObj || monster_data.find((element) => {
		return element.id == monster.id;
	});
	
    let sk_str = '';
	
	sk_str += `<div class='row'>`

	sk_str += `<div class='col-6 col-sm-1 monster_attr'><img src='../tos_tool_data/img/monster/icon_${attr_zh_to_en[monster_info.attribute]}.png' width='25px'/></div>`;

	sk_str += `<div class='col-6 col-sm-1 monster_race'><img src='../tos_tool_data/img/monster/icon_${race_zh_to_en[monster_info.race]}.png' width='25px'/></div>`;

	sk_str += `<div class='skill_tooltip monster_name monster_name_${attr_zh_to_en[monster_info.attribute]} col-10 col-sm-10 mb-1'>${monster_info.name}</div>`;
	
	sk_str += `<hr></div>`
	
	return sk_str;
}

function renderSkillInfo(monster, skill_number, monsterObj) {
    const monster_obj = monsterObj || monster_data.find((element) => {
        return element.id == monster.id;
    });
    const skill = monster_obj.skill[skill_number];
    const monster_attr = monster_obj.attribute;
    
    let sk_str = '';
    
    sk_str += `<div class='row'>`;
    
    switch(skill.type) {
        case 'normal':
            sk_str += `<div class='skill_tooltip skill_name col-9 col-sm-9 mb-1'>`;
        break;
        case 'refine':
            sk_str += `<div class='skill_tooltip skill_name_refine col-9 col-sm-9 mb-1'><img src='../tos_tool_data/img/monster/refine_${skill.refine}.png' />&nbsp;`;
        break;
        case 'recall':
            sk_str += `<div class='skill_tooltip skill_name_recall col-9 col-sm-9 mb-1'><img src='../tos_tool_data/img/monster/recall.png' />&nbsp;`;
        break;
        default:
            sk_str += `<div class='skill_tooltip skill_name col-9 col-sm-9 mb-1'>`;
    }
    sk_str += `${skill.name}</div>`
    
    let cd_str = 'reduce' in skill ? skill.num+" → "+(skill.num-skill.reduce) : skill.num <= 0 ? '-' : skill.num
    sk_str += `<div class='skill_tooltip skill_charge col-3 col-sm-3 mb-1'>${skill.charge}&nbsp;${cd_str}</div>`
    
    sk_str += `</div>`;
    
    if('combine' in skill)
    {
        let combine_str = ''
        $.each(skill.combine.member, (combine_index, member) => {
            combine_str += `<img src='../tos_tool_data/img/monster/${member}.png'\> ${combine_index !== skill.combine.member.length-1 ? ` + ` : ``}`;
        })
        
        combine_str += ` → <img src='../tos_tool_data/img/monster/${skill.combine.out}.png'\>`;
        
        sk_str += `
            <div class='row'>
                <div class='skill_tooltip col-sm-12'><hr></div>
            </div>
            <div class='row'>
                <div class='skill_tooltip skill_combine col-sm-12'>${combine_str}</div>
            </div>
        `;
    }
    
    if('transform' in skill)
    {
        let transform_str = ''
        transform_str += `<img src='../tos_tool_data/img/monster/${monster.id}.png' \>`;
        
        transform_str += ` → <img src='../tos_tool_data/img/monster/${skill.transform}.png' \>`;
        
        sk_str += `
            <div class='row'>
                <div class='skill_tooltip col-sm-12'><hr></div>
            </div>
            <div class='row'>
                <div class='skill_tooltip skill_transform col-sm-12'>${transform_str}</div>
            </div>
        `;
    }
    
    sk_str += `
        <div class='row'>
            <div class='skill_tooltip col-sm-12'><hr></div>
        </div>
        <div class='row'>
            <div class='skill_tooltip skill_description col-sm-12'>${descriptionTranslator(monster.id, skill.description)}</div>
        </div>
    `;  

    return sk_str;
}

function descriptionTranslator(monster_id, description) {
	return description.replace(/<board\s*(\d*)>(.*?)<\/board>/g, `<span class='fixed_board_label' onmouseover='showFixedBoard(${monster_id}, $1)' ontouchstart='showFixedBoard(${monster_id}, $1)'>$2</span>`).replace(/<anno>(.*?)<\/anno>/g, `<font class='annotation_tag'>$1</font>`).replace(/【階段 (\d*)】/g, `<font class='multiple_effect_tag'>【階段 $1】</font>`).replace(/效果(\d+)：/g, `<font class='multiple_effect_tag'>效果$1：</font>`).replace(/【連攜魔導式】/g, `<span class='desc_note_label' onmouseover='renderDescriptionNote(0)' ontouchstart='renderDescriptionNote(0)'>【連攜魔導式】</span>`)
}

function showFixedBoard(id, subid) {
	const monster_obj = monster_data.find((element) => {
        return element.id === id;
    });
	const board_id = subid ? subid-1 : 0
	const board_data = $.isPlainObject(monster_obj.board[board_id]) ? monster_obj.board[board_id].board : monster_obj.board[board_id]
	
	renderFixedBoard(board_data, monster_obj.board[board_id]?.row, monster_obj.board[board_id]?.column)
}

function renderFixedBoard(data, row, column) {
	let board = ''
	const rowCount = row ?? 5
	const columnCount = column ?? 6
	for(let row = 0; row < rowCount; row++) {
		board += `<tr class='rune_tr'>`
		for(let col = 0; col < columnCount; col++) {
			const isNone = data[row * columnCount + col][0] === '-'
			const runeType = data[row * columnCount + col][0]
			const raceMark = data[row * columnCount + col][1]
			const isEnchanted = runeType === runeType.toUpperCase()
			const rune_img = `../tos_tool_data/img/rune/rune_${isNone ? 'none' : runeType.toLowerCase()}${(!isNone && isEnchanted) ? '_enc' : ''}.png`
			
			if(raceMark) {
				const race_img = `../tos_tool_data/img/rune/race_${raceMark}.png`
				board += `<td class='rune_td'><img class='rune_img' src=${rune_img} /><img class='race_img' src=${race_img} /></td>`
			}
			else {
				board += `<td class='rune_td'><img class='rune_img' src=${rune_img} /></td>`
			}
			
		}
		board += '</tr>'
	}
	
	$("#fixedBoard").html(`<table class='board_table'>${board}</table>`)
	
	$(document).on('mousemove', '.fixed_board_label', (e) => {
		$("#fixedBoard").css({
			left: e.pageX + 20,
			top: e.pageY - 100
		});
	}).on('touchstart', '.fixed_board_label', (e) => {
		var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
		$("#fixedBoard").css({
			left: touch.pageX + 20,
			top: touch.pageY - 100
		});
	})
}

function renderDescriptionNote(desc_index) {
	switch(desc_index) {
		case 0:
			$("#descriptionNote").html('場上有【連攜魔導式】技能生效時<br>⓵【連攜魔導式】類別技能<br>⇒ 不能發動<br>⓶ 改為可發動另一技能：<br>延長當前【連攜魔導式】 1 回合效果<br>⇒ 最多可延長至 6 回合')
		break;
		default:
			$("#descriptionNote").html('');
	}
	
	$(document).on('mousemove', '.desc_note_label', (e) => {
		$("#descriptionNote").css({
			left: e.pageX + 20,
			top: e.pageY
		});
	}).on('touchstart', '.desc_note_label', (e) => {
		var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
		$("#descriptionNote").css({
			left: touch.pageX + 20,
			top: touch.pageY
		});
	})
}

function renderMonsterImage(monster, tooltip_content, monsterObj, eggLink = false) {
    const monster_obj = monsterObj || monster_data.find((element) => {
        return element.id == monster.id;
    });
    const monster_attr = monster_obj.attribute;
    const hasSpecialImage = 'specialImage' in monster_obj && monster_obj.specialImage;
	const hasImageChange = monster.nums.length === 1 ? monster_obj.skill[monster.nums[0]].imageChange : null;
    const notInInventory = useInventory && !playerData.card.includes(monster.id)
	
    return `
        <div class='col-3 col-md-2 col-lg-1 result'>
            <img class='monster_img${notInInventory ? '_gray' : ''}' src='../tos_tool_data/img/monster/${hasImageChange ? hasImageChange[0] : monster_obj.id}.png' onerror='this.src="../tos_tool_data/img/monster/noname_${attr_zh_to_en[monster_attr]}.png"' onfocus=${hasImageChange ? `this.src="../tos_tool_data/img/monster/${hasImageChange[1]}.png"` : hasSpecialImage ? `this.src="../tos_tool_data/img/monster/${monster_obj.id}_sp.png"` : null} onblur=${hasImageChange ? `this.src="../tos_tool_data/img/monster/${hasImageChange[0]}.png"` : hasSpecialImage ? `this.src="../tos_tool_data/img/monster/${monster_obj.id}.png"` : null} tabindex=${monster_obj.id.toString().replace('?', '')} data-toggle='popover' data-title='' data-content="${tooltip_content}"></img>
			<!-- special image preload -->
			<img class='monster_img${notInInventory ? '_gray' : ''}' style="display: none;" src=${hasSpecialImage ? `../tos_tool_data/img/monster/${monster_obj.id}_sp.png` : ''}>
			<!-- -->
            <div class='monsterId${notInInventory ? '_gray' : ''}'>
                <a href='${eggLink ? `https://home.gamer.com.tw/homeindex.php?owner=tinghan33704` : `https://tos.fandom.com/zh/wiki/${monster_obj.id}`}' target='_blank'>${paddingZeros(monster_obj.id, 3)}</a>
            </div>
        </div>
    `;
}

function sortByChange()
{
    let sort_by_next_index = (sort_by_method.findIndex(element => element[0] === sort_by) + 1) % sort_by_method.length
    
    sort_by = sort_by_method[sort_by_next_index][0]
    $("#sort_by_result").text(sort_by_method[sort_by_next_index][1])
	
	renderResult()
	
    jumpTo("result_title");
}
