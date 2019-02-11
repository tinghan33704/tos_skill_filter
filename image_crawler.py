#!/usr/bin/python
# -*- coding: utf-8 -*-
import requests
from bs4 import BeautifulSoup
import lxml
import os
from urllib.request import urlretrieve
import sys

for i in range(9001, 9020):
    print("正在抓取編號"+str(i)+"...")

    num = str(i).zfill(3)
    url = "https://tos.fandom.com/zh/wiki/"+num
    
    res = requests.get(url)
    res.encoding = 'utf-8'
    soup = BeautifulSoup(res.text,'lxml')
    
    img_link = soup.find("table", id="monster-data")
    if img_link is not None:
        img_link = img_link.find("img", width="100")['data-src']
        print(img_link)
    
    if img_link is not None:
        local_storage = os.path.join('D:\\github\\tos_skill_filter\\img\\'+str(i)+'.png')
        urlretrieve(img_link, local_storage)
print("===完成===")