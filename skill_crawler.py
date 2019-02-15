import requests
from bs4 import BeautifulSoup
import lxml
import re
import pandas as pd
import openpyxl

card = []

for i in range(1, 2050):
    print("正在抓取編號"+str(i)+"...")

    num = str(i).zfill(3)
    url = "https://tos.fandom.com/zh/wiki/"+num
    
    res = requests.get(url)
    res.encoding = 'utf-8'
    soup = BeautifulSoup(res.text,'lxml')
    
    th_a = soup.find_all("th", text=re.compile('效果'))
    
    skill = []
    monster = []
    
    if th_a is not None:
        if len(th_a) == 2:
            skill.append(th_a[0].find_next_sibling('td').text)
            skill.append("")
        elif len(th_a) == 3:
            skill.append(th_a[0].find_next_sibling('td').text)
            skill.append(th_a[1].find_next_sibling('td').text)
    else:
        skill.append("")
        skill.append("")
    
    monster.append(str(i))
    for x in skill:
        monster.append(x)
    
    card.append(monster)
    
print("正在轉成 excel 格式 ...")
df = pd.DataFrame(card)
df.columns = ['id', 'skill', 'skill2']
df.to_csv('skill_crawler.csv', index=False, encoding="utf_8_sig")
print("===完成===")