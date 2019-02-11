# coding=utf-8

import requests
from bs4 import BeautifulSoup
import lxml
import re

water = []
fire = []
earth = []
light = []
dark = []

human = []
beast = []
elf = []
dragon = []
god = []
demon = []
machina = []
evolve = []
level_up = []

stars = [[], [], [], [], [], [], [], []]

for i in range(2001, 2035):
    print("正在抓取編號"+str(i)+"...")
    
    num = str(i).zfill(3)
    url = "https://tos.fandom.com/zh/wiki/"+num
    
    res = requests.get(url)
    res.encoding = 'utf-8'
    soup = BeautifulSoup(res.text,'lxml')
    
    th_a = soup.find("th", text=re.compile('屬性'))
    
    if th_a is not None:
        attri = th_a.find_next_sibling('td').text.rstrip()
        
        if attri == "水":
            water.append(i)
        elif attri == "火":
            fire.append(i)
        elif attri == "木":
            earth.append(i)
        elif attri == "光":
            light.append(i)
        elif attri == "暗":
            dark.append(i)
            
    th_r = soup.find("th", text=re.compile('種族'))
    
    if th_r is not None:
        race = th_r.find_next_sibling('td').text.rstrip()
        
        if race == "人類":
            human.append(i)
        elif race == "獸類":
            beast.append(i)
        elif race == "妖精類":
            elf.append(i)
        elif race == "龍類":
            dragon.append(i)
        elif race == "神族":
            god.append(i)
        elif race == "魔族":
            demon.append(i)
        elif race == "機械族":
            machina.append(i)
        elif race == "進化素材":
            evolve.append(i)
        elif race == "強化素材":
            level_up.append(i)
            
    th_s = soup.find("th", text=re.compile('稀有'))
    
    if th_s is not None:
        star = int(th_s.find_next_sibling('td').text.rstrip()[0])
        stars[star-1].append(i)
    
print("水:"+str(water))
print()
print("火:"+str(fire))
print()
print("木:"+str(earth))
print()
print("光:"+str(light))
print()
print("暗:"+str(dark))
print()
print()
print("人類:"+str(human))
print()
print("獸類:"+str(beast))
print()
print("妖精類:"+str(elf))
print()
print("龍類:"+str(dragon))
print()
print("神族:"+str(god))
print()
print("魔族:"+str(demon))
print()
print("機械族:"+str(machina))
print()
print("進化素材:"+str(evolve))
print()
print("強化素材:"+str(level_up))
print()
print()
for x in range(1, 9):
    print(str(x)+":"+str(stars[x-1]))
    print()

print("===完成===")