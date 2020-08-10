const skill_type_string = [
['符石轉水', '符石轉火', '符石轉木', '符石轉光', '符石轉暗', '符石轉心'],
['符石轉水強化', '符石轉火強化', '符石轉木強化', '符石轉光強化', '符石轉暗強化', '符石轉心強化'],
['水轉其他', '火轉其他', '木轉其他', '光轉其他', '暗轉其他', '心轉其他', '指定符石轉其他'],
['符石兼具水', '符石兼具火', '符石兼具木', '符石兼具光', '符石兼具暗', '符石兼具心'],
['水屬追打', '火屬追打', '木屬追打', '光屬追打', '暗屬追打', '無屬追打', '自身追打', '全隊追打'],
['引爆', '整版引爆', '直行引爆', '橫行引爆', 'X型引爆', '多次引爆', '水符石引爆', '火符石引爆', '木符石引爆', '光符石引爆', '暗符石引爆', '心符石引爆', '水外符石引爆', '火外符石引爆', '木外符石引爆', '光外符石引爆', '暗外符石引爆', '心外符石引爆', '指定符石引爆'],
['人族符石製造', '獸族符石製造', '妖族符石製造', '龍族符石製造', '神族符石製造', '魔族符石製造', '機械族符石製造'],
['符石強化', '大幅轉版', '固定轉版', '還原版面', '移除符石', '禁珠', '改變掉落機率', '強制掉落', '改變消除方式', '增加符石'],
['減傷', '意志', '敵方減攻', '迴避', '回血', '我方傷害吸收', '敵方傷害吸收'],
['破防', '直傷', '屬性剋制改變', '排珠', '延長轉珠時間'],
['增傷', '界王拳', '攻擊轉屬', '增回', '攻擊力吸收', '共鳴'],
['對人類增傷', '對獸類增傷', '對妖精類增傷', '對龍類增傷', '對神族增傷', '對魔族增傷', '對機械族增傷'],
['增加Combo', '增加Ex.Combo', '延遲', '減CD', '回復EP', '附加消除', '龍脈儀蓄能', '行動值提升', '隨時關閉', '變身', '合體'],
['無法行動', '敵方轉屬', '凍結敵方', '點燃敵方', '石化敵方', '電擊敵方', '寄生敵方', '敵方中毒', '魅惑敵方', '暈擊敵方'],
['解鎖', '防鎖', '防毒', '防爆', '防反擊', '無視燃燒', '無視黏腐', '無視暴風', '黑白還原', '碎裂還原', '無視拼圖盾', '無視攻前盾', '無視三屬盾', '無視五屬盾', '無視固定連擊盾'],
['風化符石處理', '凍結符石處理', '弱化符石處理', '電擊符石處理', '石化符石處理', '化血符石處理'],
['我方減攻', '我方減回', '我方扣血', '限制成員攻擊', '我方受傷增加']
];

const attr_type_string = ['水', '火', '木', '光', '暗'];

const race_type_string = ['人類', '獸類', '妖精類', '龍類', '神族', '魔族', '機械族', '進化素材', '強化素材'];

const star_type_string = ['1', '2', '3', '4', '5', '6', '7', '8'];

const charge_type_string = ['CD', 'EP'];


const blue_str = "rgb(100, 100, 255)";
const green_str = "rgb(50, 155, 50)";
const white_str = "rgb(255, 255, 255)";
const black_str = "rgb(0, 0, 0)";

var filter_set = new Set();
var or_filter = true;
var sort_by = 'id';
var keyword_search = false;
var input_maxlength = 50;
var theme = 'normal';

const skill_num = skill_type_string.length;
const attr_num = attr_type_string.length;
const race_num = race_type_string.length;
const star_num = star_type_string.length;
const charge_num = charge_type_string.length;

const encode_chart = [
    "0","1","2","3","4","5","6","7","8","9",
    "a","b","c","d","e","f","g","h","i","j",
    "k","l","m","n","o","p","q","r","s","t",
    "u","v","w","x","y","z","A","B","C","D",
    "E","F","G","H","I","J","K","L","M","N",
    "O","P","Q","R","S","T","U","V","W","X",
    "Y","Z","+","-"
];

const attr_zh_to_en = {"水": "w", "火": "f", "木": "e", "光": "l", "暗": "d"};

$(document).ready(function(){
    init();
    $("#start_filter").on("click", startFilter);
    $("#and_or_filter").on("click", andOrChange);
    $("#sort_by_result").on("click", sortByChange);
    $("#reset_skill").on("click", resetSkill);
    $("#reset_all").on("click", resetAll);
    $("#reset_attr").on("click", resetAttr);
    $("#reset_race").on("click", resetRace);
    $("#reset_star").on("click", resetStar);
    $("#reset_charge").on("click", resetCharge);
    $("#reset_keyword").on("click", resetKeyword);
    $("#keyword-switch").on("click", keywordSwitch);
    
    if(location.search) readUrl();
});

$(window).resize(function(){
    $('.side_navigation').css({top: (parseInt($('#top-bar').css('height'))-20)+'px'});
});

function init()
{
    $(".row.result-row").hide();
    
    $('#toTop-btn').click(function()
    { 
        $('html,body').animate({scrollTop:0}, 300);
    });
    $(window).scroll(function()
    {
        if ($(this).scrollTop() > 300) $('#toTop-btn').fadeIn(200);
        else $('#toTop-btn').stop().fadeOut(200);
    }).scroll();
    
    
    $('#changeTheme-btn').click(function()
    { 
        changeTheme();
    });
    
    $('.side_navigation').css({top: (parseInt($('#top-bar').css('height'))-20)+'px'});
    
    var i = 0;
    $(".filter-row").html(function()
    {
        var str = $(".filter-row").html();
        for(var x of skill_type_string)
        {
            str += "<div class='col-12 my-2'></div>";
            for(var s of x)
            {   
                str += "<div class='col-6 col-md-4 col-lg-2 btn-shell'><input type='checkbox' class='filter' id='filter-"+i+"'><label class='p-1 w-100 text-center filter-btn' for='filter-"+i+"'>"+s+"</label></div>";
                i ++;
            }
        }
        return str;
    });
    
    $(".keyword-row").html(function()
    {
        var str = $(".keyword-row").html();
        str += "<div class='col-12 my-2'></div>";
        str += "<div class='col-12 col-md-4 col-lg-2 btn-shell'><input type='checkbox' class='filter' id='keyword-switch'><label class='p-1 w-100 text-center keyword-btn' for='keyword-switch'>關鍵字搜尋</label></div>";
        str += "<div class='col-12 col-md-8 col-lg-10 btn-shell'><input type='text' class='form-control keyword-input' id='keyword-input' placeholder='輸入技能關鍵字' maxlength="+input_maxlength+" disabled></div>";
        return str;
    });
    
    $(".attr-row").html(function()
    {
        var str = $(".attr-row").html();
        str += "<div class='col-12 my-2'></div>";
        for(var x of attr_type_string)
        {
            str += "<div class='col-6 col-md-4 col-lg-2 btn-shell'><input type='checkbox' class='filter' id='filter-"+i+"'><label class='p-1 w-100 text-center attr-btn' for='filter-"+i+"'>"+x+"</label></div>";
            i ++;
        }
        return str;
    });
    
    $(".race-row").html(function()
    {
        var str = $(".race-row").html();
        str += "<div class='col-12 my-2'></div>";
        for(var x of race_type_string)
        {
            str += "<div class='col-6 col-md-4 col-lg-2 btn-shell'><input type='checkbox' class='filter' id='filter-"+i+"'><label class='p-1 w-100 text-center race-btn' for='filter-"+i+"'>"+x+"</label></div>";
            i ++;
        }
        return str;
    });
    
    $(".star-row").html(function()
    {
        var str = $(".star-row").html();
        str += "<div class='col-12 my-2'></div>";
        for(var x of star_type_string)
        {
            str += "<div class='col-6 col-md-4 col-lg-2 btn-shell'><input type='checkbox' class='filter' id='filter-"+i+"'><label class='p-1 w-100 text-center star-btn' for='filter-"+i+"'>"+x+" ★</label></div>";
            i ++;
        }
        return str;
    });
    
    $(".charge-row").html(function()
    {
        var str = $(".charge-row").html();
        str += "<div class='col-12 my-2'></div>";
        for(var x of charge_type_string)
        {
            str += "<div class='col-6 col-md-4 col-lg-2 btn-shell'><input type='checkbox' class='filter' id='filter-"+i+"'><label class='p-1 w-100 text-center charge-btn' for='filter-"+i+"'>"+x+"</label></div>";
            i ++;
        }
        return str;
    });
    
    or_filter = true;
    keyword_search = false;
}

function keywordSwitch()
{
    if($("#keyword-switch").prop('checked'))
    {
        $('#keyword-input').attr('disabled', false);
        $('#keyword-input').css('border', '1px solid var(--text_color)');
        $('#keyword-input').css('background-color', 'var(--button_keyword_color_input_able)');
        keyword_search = true;
        
        $(".filter-row .filter").each(function(){
            $(this).attr('disabled', true);
            $(this).next().css({
                'border': '1px solid var(--button_keyword_color_unable)', 
                'color': '#AAAAAA', 
                'background-color': 'var(--button_keyword_color_unable)', 
                'cursor': 'default', 
                'font-weight': 'normal'
            });
        });
    }
    else
    {
        $('#keyword-input').attr('disabled', true);
        $('#keyword-input').css('border', '1px solid var(--button_keyword_color_input_unable)');
        $('#keyword-input').css('background-color', 'var(--button_keyword_color_input_unable)');
        keyword_search = false;
        
        $(".filter-row .filter").each(function(){
            $(this).attr('disabled', false);
            $(this).next().removeAttr('style');
        });
    }
}

function startFilter()
{
    changeUrl();
    
    if(keyword_search == false)
    {
        filter_set.clear();
    
        var filter_charge_set = new Set();
    
        var skill_set = new Set();
        var skill_select = false;
        
        skill_set.clear();
        
        $(".filter-row .filter").each(function(){
            if($(this).prop('checked'))
            {
                skill_set.add($(this).next("label").text());
                skill_select = true;
            }
        });
        
        if(keyword_search == false && skill_select == false)
        {
            errorAlert(2);
            return ;
        }
        
        var attr_set = new Set();
        var attr_intersect = false;
        
        $(".attr-row .filter").each(function(){
            if($(this).prop('checked'))
            {
                attr_set.add($(this).next("label").text());
                attr_intersect = true;
            }
        });
        
        var race_set = new Set();
        var race_intersect = false;
        
        $(".race-row .filter").each(function(){
            if($(this).prop('checked'))
            {
                race_set.add($(this).next("label").text());
                race_intersect = true;
            }
        });
        
        var star_set = new Set();
        var star_intersect = false;
        
        $(".star-row .filter").each(function(){
            if($(this).prop('checked'))
            {
                star_set.add(parseInt($(this).next("label").text()[0]));
                star_intersect = true;
            }
        });
        
        var charge_set = new Set();
        var charge_intersect = false;
        
        $(".charge-row .filter").each(function(){
            if($(this).prop('checked'))
            {
                charge_set.add($(this).next("label").text());
                charge_intersect = true;
            }
        });
        
        for(var x of monster_data)
        {
            if(attr_intersect)
            {
                if(!(attr_set.has(x.attribute))) continue;
            }
            if(race_intersect)
            {
                if(!race_set.has(x.race)) continue;
            }
            if(star_intersect)
            {
                if(!star_set.has(x.star)) continue;
            }
            
            var skill_num_array = [];
            for(var ch = 0; ch < x.skill.length; ch ++)
            {
                if(charge_intersect)
                {
                    var non = true;
                    if(charge_set.has(x.skill[ch].charge)) non = false;
                    if(non) continue;
                }
                
                if(or_filter)
                {
                    var check = false;
                    for(var k of skill_set)
                    {
                        if(x.skill[ch].tag.includes(k))
                        {
                            check = true;
                            break;
                        }
                    }
                    
                    if(!check) continue;
                }
                else
                {
                    var check = true;
                    for(var k of skill_set)
                    {
                        if(!x.skill[ch].tag.includes(k))
                        {
                            check = false;
                            break;
                        }
                    }
                    
                    if(!check) continue;
                }
                
                var charge = ('reduce' in x.skill[ch])?x.skill[ch].num-x.skill[ch].reduce:x.skill[ch].num;
                
                skill_num_array.push(ch);
                filter_charge_set.add({'id': x.id, 'num': ch, 'charge': charge});
            }
            if(skill_num_array.length > 0) filter_set.add({'id': x.id, 'nums': skill_num_array});
        }
    }
    else        // keyword search mode
    {
        filter_set.clear();
    
        var filter_charge_set = new Set();
    
        /* keyword input check */
        var keyword = textSanitizer($('#keyword-input').val());
        if(keyword.length <= 0)
        {
            errorAlert(3);
            return;
        }
        else if(keyword.length > input_maxlength)
        {
            errorAlert(4);
            return;
        }
        
        /* keyword input split */
        var keyword_set = new Set();
        var keyword_select = false;
        
        keyword_set.clear();
        
        var keywords = keyword.split(',');
        keywords.forEach(function(element){
            if(element.length > 0 && element.length <= 50) keyword_set.add(element);
        });
        
        if(keyword_set.size <= 0)
        {
            errorAlert(3);
            return;
        }
        
        
        var attr_set = new Set();
        var attr_intersect = false;
        
        $(".attr-row .filter").each(function(){
            if($(this).prop('checked'))
            {
                attr_set.add($(this).next("label").text());
                attr_intersect = true;
            }
        });
        
        var race_set = new Set();
        var race_intersect = false;
        
        $(".race-row .filter").each(function(){
            if($(this).prop('checked'))
            {
                race_set.add($(this).next("label").text());
                race_intersect = true;
            }
        });
        
        var star_set = new Set();
        var star_intersect = false;
        
        $(".star-row .filter").each(function(){
            if($(this).prop('checked'))
            {
                star_set.add(parseInt($(this).next("label").text()[0]));
                star_intersect = true;
            }
        });
        
        var charge_set = new Set();
        var charge_intersect = false;
        
        $(".charge-row .filter").each(function(){
            if($(this).prop('checked'))
            {
                charge_set.add($(this).next("label").text());
                charge_intersect = true;
            }
        });
        
        for(var x of monster_data)
        {
            if(attr_intersect)
            {
                if(!(attr_set.has(x.attribute))) continue;
            }
            if(race_intersect)
            {
                if(!race_set.has(x.race)) continue;
            }
            if(star_intersect)
            {
                if(!star_set.has(x.star)) continue;
            }
            
            var skill_num_array = [];
            for(var ch = 0; ch < x.skill.length; ch ++)
            {
                if(charge_intersect)
                {
                    var non = true;
                    if(charge_set.has(x.skill[ch].charge)) non = false;
                }
                if(non) continue;
                
                
                if(or_filter)
                {
                    var check = false;
                    var skill_desc = textSanitizer(x.skill[ch].description); 
                    for(var k of keyword_set)
                    {
                        if(skill_desc.includes(k))
                        {
                            check = true;
                            break;
                        }
                    }
                    
                    if(!check) continue;
                }
                else
                {
                    var check = true;
                    var skill_desc = textSanitizer(x.skill[ch].description); 
                    for(var k of keyword_set)
                    {
                        if(!skill_desc.includes(k))
                        {
                            check = false;
                            break;
                        }
                    }
                    
                    if(!check) continue;
                }
                
                
                var charge = ('reduce' in x.skill[ch])?x.skill[ch].num-x.skill[ch].reduce:x.skill[ch].num;
                
                skill_num_array.push(ch);
                filter_charge_set.add({'id': x.id, 'num': ch, 'charge': charge});
            }
            if(skill_num_array.length > 0) filter_set.add({'id': x.id, 'nums': skill_num_array});
        }
    }
    
    $(".row.result-row").show();
    
    var monster_array = Array.from(filter_set);
    var monster_charge_array = Array.from(filter_charge_set);
    
    
    $("#result-row").html(function()
    {
        if(sort_by == 'id')
        {
            var str = "";
            if(monster_array.length != 0)
            {
                monster_array.forEach(function(x) {
                    var monster_attr = monster_data.find(function(element){
                        return element.id == x.id;
                    }).attribute;
                    
                    var sk_str = "";
                    var skill_cnt = 0;
                    
                    for(s of x.nums)
                    {
                        var skill = monster_data.find(function(element){
                            return element.id == x.id;
                        }).skill[s];
                        
                        //if(skill_cnt > 0) sk_str += "<hr style='border-top: 1px dotted red;'>";
                        
                        sk_str += "<div class='row'>";
                        
                        if(skill.type == 'normal')
                        {
                            sk_str += "<div class='skill_tooltip skill_name col-9 col-sm-9 mb-1'>"+skill.name+"</div>";
                        }
                        else if(skill.type == 'refine')
                        {
                            sk_str += "<div class='skill_tooltip skill_name_refine col-9 col-sm-9 mb-1'><img src='../tos_tool_data/img/monster/refine_"+skill.refine+".png' />&nbsp;"+skill.name+"</div>";
                        }
                        else if(skill.type == 'recall')
                        {
                            sk_str += "<div class='skill_tooltip skill_name_recall col-9 col-sm-9 mb-1'><img src='../tos_tool_data/img/monster/recall.png' />&nbsp;"+skill.name+"</div>";
                        }
                        
                        if('reduce' in skill)
                        {
                            sk_str += "<div class='skill_tooltip skill_charge col-3 col-sm-3 mb-1'>"+skill.charge+"&nbsp;"+skill.num+" → "+(skill.num-skill.reduce)+"</div>";
                        }
                        else if(skill.num == -1)
                        {
                            sk_str += "<div class='skill_tooltip skill_charge col-3 col-sm-3 mb-1'>"+skill.charge+"&nbsp;"+"-</div>";
                        }
                        else
                        {
                            sk_str += "<div class='skill_tooltip skill_charge col-3 col-sm-3 mb-1'>"+skill.charge+"&nbsp;"+skill.num+"</div>";
                        }
                        sk_str += "</div>";
                        
                        if('combine' in skill)
                        {
                            combine_str = ''
                            skill.combine.member.forEach(function(x, index, arr) {
                                combine_str += "<img src=\'../tos_tool_data/img/monster/"+x+".png\'\>" + (index !== arr.length-1 ? " + " : "");
                            });
                            
                            combine_str += " → <img src=\'../tos_tool_data/img/monster/"+skill.combine.out+".png\'\>";
                            
                            sk_str += "<div class='row'>";
                            sk_str += "   <div class='skill_tooltip col-sm-12'><hr></div>";
                            sk_str += "</div>";
                            sk_str += "<div class='row'>";
                            sk_str += "   <div class='skill_tooltip skill_combine col-sm-12'>"+combine_str+"</div>";
                            sk_str += "</div>";
                        }
                        if('transform' in skill)
                        {
                            transform_str = ''
                            transform_str += "<img src=\'../tos_tool_data/img/monster/"+x.id+".png\'\>";
                            
                            transform_str += " → <img src=\'../tos_tool_data/img/monster/"+skill.transform+".png\'\>";
                            
                            sk_str += "<div class='row'>";
                            sk_str += "   <div class='skill_tooltip col-sm-12'><hr></div>";
                            sk_str += "</div>";
                            sk_str += "<div class='row'>";
                            sk_str += "   <div class='skill_tooltip skill_transform col-sm-12'>"+transform_str+"</div>";
                            sk_str += "</div>";
                        }
                        
                        sk_str += "<div class='row'>";
                        sk_str += "   <div class='skill_tooltip col-sm-12'><hr></div>";
                        sk_str += "</div>";
                        sk_str += "<div class='row'>";
                        sk_str += "   <div class='skill_tooltip skill_description col-sm-12'>"+skill.description+"</div>";
                        sk_str += "</div>";
                        
                        skill_cnt ++;
                    }
                    
                    /*
                    str += "<div class=\"col-3 col-md-2 col-lg-1 result\" data-toggle=\"tooltips\" data-html=\"true\" title=\""+sk_str+"\">"+
                                "<a href=\"https://tos.fandom.com/zh/wiki/"+x.id+"\" target=\"_blank\">"+
                                    "<img class=\"monster_img\" src=\"../tos_tool_data/img/monster/"+x.id+".png\" title=\""+x.id+"\" onerror=\"this.src='../tos_tool_data/img/monster/noname_"+attr_zh_to_en[monster_attr]+".png'\"></img>"+
                                "</a>"+
                                "<div class=\"monsterId\">"+paddingZeros(x.id, 3)+"</div>"+
                            "</div>";
                    */
                    
                    str += "<div class=\"col-3 col-md-2 col-lg-1 result\">"+
                                    "<img class=\"monster_img\" src=\"../tos_tool_data/img/monster/"+x.id+".png\" onerror=\"this.src='../tos_tool_data/img/monster/noname_"+attr_zh_to_en[monster_attr]+".png'\" tabindex="+x.id+" data-toggle=\"popover\" data-title=\"\" data-content=\""+sk_str+"\"></img>"+
                                "<div class=\"monsterId\"><a href=\"https://tos.fandom.com/zh/wiki/"+x.id+"\" target=\"_blank\">"+paddingZeros(x.id, 3)+"</a></div>"+
                            "</div>";
                });
            }
            else
            {
                str = "<div class='col-12' style=\"padding-top: 20px; text-align: center; color: #888888;\"><h1>查無結果</h1></div>";
            }
            return str;
        }
        else if(sort_by == 'charge')
        {
            monster_charge_array.sort(function(a, b) { 
                return a.charge - b.charge;
            });
            
            var str = "";
            var now_cd = 0;
            if(monster_charge_array.length != 0)
            {
                monster_charge_array.forEach(function(x) {
                    var monster_attr = monster_data.find(function(element){
                        return element.id == x.id;
                    }).attribute;
                    
                    var sk_str = "";
                    var skill = monster_data.find(function(element){
                        return element.id == x.id;
                    }).skill[x.num];
                    
                    if(x.charge != now_cd && x.charge > 0)
                    {
                        now_cd = x.charge;
                        str += "<div class='col-sm-12'><hr class='charge_num_hr_bottom'></div>"
                        str += "<div class='col-sm-12 charge_num_div'>&nbsp;"+now_cd+"</div>"
                        str += "<div class='col-sm-12'><hr class='charge_num_hr_top'></div>"
                    }
                    
                    sk_str += "<div class='row'>";
                        
                    if(skill.type == 'normal')
                    {
                        sk_str += "<div class='skill_tooltip skill_name col-9 col-sm-9 mb-1'>"+skill.name+"</div>";
                    }
                    else if(skill.type == 'refine')
                    {
                        sk_str += "<div class='skill_tooltip skill_name_refine col-9 col-sm-9 mb-1'><img src='../tos_tool_data/img/monster/refine_"+skill.refine+".png' />&nbsp;"+skill.name+"</div>";
                    }
                    else if(skill.type == 'recall')
                    {
                        sk_str += "<div class='skill_tooltip skill_name_recall col-9 col-sm-9 mb-1'><img src='../tos_tool_data/img/monster/recall.png' />&nbsp;"+skill.name+"</div>";
                    }
                    
                    if('reduce' in skill)
                    {
                        sk_str += "<div class='skill_tooltip skill_charge col-3 col-sm-3 mb-1'>"+skill.charge+"&nbsp;"+skill.num+" → "+(skill.num-skill.reduce)+"</div>";
                    }
                    else if(skill.num == -1)
                    {
                        sk_str += "<div class='skill_tooltip skill_charge col-3 col-sm-3 mb-1'>"+skill.charge+"&nbsp;"+"-</div>";
                    }
                    else
                    {
                        sk_str += "<div class='skill_tooltip skill_charge col-3 col-sm-3 mb-1'>"+skill.charge+"&nbsp;"+skill.num+"</div>";
                    }
                    sk_str += "</div>";
                    
                    if('combine' in skill)
                    {
                        combine_str = ''
                        skill.combine.member.forEach(function(x, index, arr) {
                            combine_str += "<img src=\'../tos_tool_data/img/monster/"+x+".png\'\>" + (index !== arr.length-1 ? " + " : "");
                        });
                        
                        combine_str += " → <img src=\'../tos_tool_data/img/monster/"+skill.combine.out+".png\'\>";
                        
                        sk_str += "<div class='row'>";
                        sk_str += "   <div class='skill_tooltip col-sm-12'><hr></div>";
                        sk_str += "</div>";
                        sk_str += "<div class='row'>";
                        sk_str += "   <div class='skill_tooltip skill_combine col-sm-12'>"+combine_str+"</div>";
                        sk_str += "</div>";
                    }
                    if('transform' in skill)
                    {
                        transform_str = ''
                        transform_str += "<img src=\'../tos_tool_data/img/monster/"+x.id+".png\'\>";
                        
                        transform_str += " → <img src=\'../tos_tool_data/img/monster/"+skill.transform+".png\'\>";
                        
                        sk_str += "<div class='row'>";
                        sk_str += "   <div class='skill_tooltip col-sm-12'><hr></div>";
                        sk_str += "</div>";
                        sk_str += "<div class='row'>";
                        sk_str += "   <div class='skill_tooltip skill_transform col-sm-12'>"+transform_str+"</div>";
                        sk_str += "</div>";
                    }
                    
                    sk_str += "<div class='row'>";
                    sk_str += "   <div class='skill_tooltip col-sm-12'><hr></div>";
                    sk_str += "</div>";
                    sk_str += "<div class='row'>";
                    sk_str += "   <div class='skill_tooltip skill_description col-sm-12'>"+skill.description+"</div>";
                    sk_str += "</div>";
                    
                    /*    
                    str += "<div class=\"col-3 col-md-1 col-lg-1 result\" data-toggle=\"tooltip\" data-html=\"true\" title=\""+sk_str+"\">"+
                                "<a href=\"https://tos.fandom.com/zh/wiki/"+x.id+"\" target=\"_blank\">"+
                                    "<img class=\"monster_img\" src=\"../tos_tool_data/img/monster/"+x.id+".png\" title=\""+x.id+"\" onerror=\"this.src='../tos_tool_data/img/monster/noname_"+attr_zh_to_en[monster_attr]+".png'\"></img>"+
                                "</a>"+
                                "<div class=\"monsterId\">"+paddingZeros(x.id, 3)+"</div>"+
                            "</div>";
                    */
                    
                    str += "<div class=\"col-3 col-md-2 col-lg-1 result\">"+
                                    "<img class=\"monster_img\" src=\"../tos_tool_data/img/monster/"+x.id+".png\" onerror=\"this.src='../tos_tool_data/img/monster/noname_"+attr_zh_to_en[monster_attr]+".png'\" tabindex="+x.id+" data-toggle=\"popover\" data-title=\"\" data-content=\""+sk_str+"\"></img>"+
                                "<div class=\"monsterId\"><a href=\"https://tos.fandom.com/zh/wiki/"+x.id+"\" target=\"_blank\">"+paddingZeros(x.id, 3)+"</a></div>"+
                            "</div>";
                });
            }
            else
            {
                str = "<div class='col-sm-12' style=\"text-align: center; color: #888888;\"><h1>查無結果</h1></div>";
            }
            return str;
        }
    });
    $('.result').tooltip({ boundary: 'scrollParent', placement: 'auto', container: 'body'});
    
    $(".search_tag").html(function(){
        var tag_html = "";
        
        if(!keyword_search)
        {
            skill_set.forEach(function(element){
                tag_html += '<div class="tag_wrapper"><div class="skill_tag" title="'+element+'">'+element+'</div></div>';
            });
        }
        attr_set.forEach(function(element){
            tag_html += '<div class="tag_wrapper"><div class="genre_tag" title="'+element+'">'+element+'</div></div>';
        });
        race_set.forEach(function(element){
            tag_html += '<div class="tag_wrapper"><div class="genre_tag" title="'+element+'">'+element+'</div></div>';
        });
        star_set.forEach(function(element){
            tag_html += '<div class="tag_wrapper"><div class="genre_tag" title="'+element+' ★">'+element+" ★"+'</div></div>';
        });
        charge_set.forEach(function(element){
            tag_html += '<div class="tag_wrapper"><div class="genre_tag" title="'+element+'">'+element+'</div></div>';
        });
        return tag_html;
    });
    
    
    $('[data-toggle=popover]').popover({
      container: 'body',
      html: true,
      trigger: 'focus',
      placement: 'bottom'
    });
    
    jumpTo("result_title");
}

function paddingZeros(x, num)
{
    if(x.toString().length < num)
    {
        return "0".repeat(num-x.toString().length)+x.toString();
    }
    else
    {
        return x.toString();
    }
}

function andOrChange()
{
    or_filter = !or_filter;
    if(or_filter == false)
    {
        $("#and_or_filter").removeClass("btn-warning").addClass("btn-danger").text("AND 搜尋");
    }
    else
    {
        $("#and_or_filter").removeClass("btn-danger").addClass("btn-warning").text("OR 搜尋");
    }
}

function sortByChange()
{
    if(sort_by == 'charge')
    {
        sort_by = 'id';
        $("#sort_by_result").text("依編號排序");
    }
    else if(sort_by == 'id')
    {
        sort_by = 'charge';
        $("#sort_by_result").text("依 CD/EP 排序");
    }
}

function resetSkill()
{
    $(".filter-row .filter").prop('checked', false);
    filter_set.clear();
}

function resetAttr()
{
    $(".attr-row .filter").prop('checked', false);
    filter_set.clear();
}

function resetRace()
{
    $(".race-row .filter").prop('checked', false);
    filter_set.clear();
}

function resetStar()
{
    $(".star-row .filter").prop('checked', false);
    filter_set.clear();
}

function resetCharge()
{
    $(".charge-row .filter").prop('checked', false);
    filter_set.clear();
}

function resetKeyword()
{
    $("#keyword-input").val('');
}

function resetAll()
{
    resetSkill();
    resetAttr();
    resetRace();
    resetStar();
    resetCharge();
    resetKeyword();
}

function changeUrl()
{
    var str = "";
    
    if(!keyword_search) str += "search=" + encode(".filter-row", skill_num);
    else str += "keyword=" + escape(textSanitizer($('#keyword-input').val()));
    str += "&attr=" + encode(".attr-row", attr_num);
    str += "&race=" + encode(".race-row", race_num);
    str += "&star=" + encode(".star-row", star_num);
    str += "&chrg=" + encode(".charge-row", charge_num);
    str += "&or=" + (or_filter?"1":"0");
    
    window.history.pushState(null, null, "?"+str);
}

function readUrl()
{   
    var code_array = location.search.split("&").map(x => x.split("=")[1]);
    var code_name_array = location.search.split("?")[1].split("&").map(x => x.split("=")[0]);
    
    if(code_array.length != 6)
    {
        errorAlert(1);
        return;
    }
    var code_name_1 = ["search", "attr", "race", "star", "chrg", "or"];
    var code_name_2 = ["keyword", "attr", "race", "star", "chrg", "or"];
    
    
    for(var i in code_name_array)
    {
        if(code_name_array[i] !== code_name_1[i] && code_name_array[i] !== code_name_2[i])
        {
            errorAlert(1);
            return;
        }
    }
    
    if(code_name_array[0] == code_name_1[0])
    {
        var skill_code = decode(code_array[0]);
        setButtonFromUrl(".filter-row", skill_code, resetSkill);
    }
    else
    {
        var skill_keyword = code_array[0];
        setInputFromUrl(".keyword-input", unescape(skill_keyword));
        
        $("#keyword-switch").click();
        keywordSwitch();
    }
    
    var attr_code = decode(code_array[1]);
    setButtonFromUrl(".attr-row", attr_code, resetAttr);
    
    var race_code = decode(code_array[2]);
    setButtonFromUrl(".race-row", race_code, resetRace);
    
    var star_code = decode(code_array[3]);
    setButtonFromUrl(".star-row", star_code, resetStar);
    
    var chrg_code = decode(code_array[4]);
    setButtonFromUrl(".charge-row", chrg_code, resetCharge);
    
    var and_or_code = code_array[5];
    if(and_or_code[0] == "0") andOrChange();
    
    
    startFilter();
    
    window.history.pushState(null, null, location.pathname);    // clear search parameters
}

function encode(type, max_num)
{
    var cnt = 1, enc_bin = 0;
    var str = "";
    
    $(type+' .filter').each(function(){
        enc_bin = enc_bin * 2 + ($(this).prop('checked')?1:0);
        if(cnt % 6 == 0)
        {
            str += encode_chart[enc_bin];
            enc_bin = 0;
        }
        cnt ++;
    });
    
    while(cnt % 6 != 1)     // padding for zeros
    {
        enc_bin = enc_bin * 2;
        if(cnt % 6 == 0)
        {
            str += encode_chart[enc_bin];
            enc_bin = 0;
        }
        cnt ++;
    }

    return str;
}

function decode(data)
{
    var bin_str = "";
    for(let c of data)
    {
        for(let i in encode_chart)
        {
            if(c == encode_chart[i])
            {
                var bin_str_part = "";
                for(let k=0; k<6; k++)
                {
                    bin_str_part += (i % 2).toString();
                    i = Math.trunc(i / 2);
                }
                bin_str += bin_str_part.split('').reverse().join('');
            }
        }
    }

    return bin_str;
}

function setButtonFromUrl(type, data, callback)
{
    callback();
    
    var cnt = 0;
    $(type+' .filter').each(function(){
        if(data[cnt] == '1') $(this).click();
        cnt ++;
    });
}

function setInputFromUrl(element, data)
{
    $(element).val(data);
}

function getPosition(element)
{
    var e = document.getElementById(element);
    var left = 0;
    var top = 0;
    var top_padding_offset = 90;

    do
    {
        left += e.offsetLeft;
        top += e.offsetTop;
    }while(e = e.offsetParent);

    return [0, top-top_padding_offset];
}

function jumpTo(id)
{
    window.scrollTo(getPosition(id)[0], getPosition(id)[1]);
}

function changeTheme()
{
    var theme_string = [
        '--background_color', 
        '--text_color', 
        '--text_color_anti', 
        '--button_color', 
        '--button_text_color_checked', 
        '--button_filter_color_checked', 
        '--button_keyword_color_checked', 
        '--button_keyword_color_unable', 
        '--button_keyword_color_input_able', 
        '--button_keyword_color_input_unable', 
        '--button_other_color_checked', 
        '--button_sortby', 
        '--button_primary',
        '--button_warning',
        '--button_danger',
        '--button_success',
        '--text_tag_color', 
        '--monsterid_color', 
        '--text_monsterid_color', 
        '--tooltip_color', 
        '--text_tooltip_color', 
        '--text_name_tooltip_color', 
        '--text_refine_tooltip_color', 
        '--text_recall_tooltip_color', 
        '--text_charge_tooltip_color',
        '--text_charge_sort_color',
    ];
    
    theme = (theme == 'normal')?'dark':'normal';
    
    theme_string.forEach(x => {
        document.documentElement.style.setProperty(x, 'var('+x+'_'+theme+')');
    });
    
}

function toggleSideNavigation() {
    const sideNav = document.getElementsByClassName("side_navigation")[0];
    sideNav.style.width = sideNav.style.width == "250px" ? "0px" : "250px";
}

function errorAlert(index)
{
    switch(index) {
        case 1:
            alert("[Error Code "+paddingZeros(index, 2)+"] 請檢查網址是否正確");
        break;
        case 2:
            alert("[Error Code "+paddingZeros(index, 2)+"] 請先選擇功能或輸入技能關鍵字");
        break;
        case 3:
            alert("[Error Code "+paddingZeros(index, 2)+"] 請輸入技能關鍵字");
        break;
        case 4:
            alert("[Error Code "+paddingZeros(index, 2)+"] 技能關鍵字數量不得超過 "+input_maxlength);
        break;
        default:
            
    }
}

function textSanitizer(text)
{
    return text.replace(/<br>/g,'').replace(/\s/g,'').toLowerCase();
}