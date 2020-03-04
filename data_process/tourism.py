#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SQL final project - tourism.py
"""

import numpy as np
import os

import requests
import json
import pandas as pd
import sqlalchemy as sql

import datetime
import time

cwb_data = 'tourism_data'
if not os.path.exists(cwb_data):
    os.mkdir(cwb_data)

# 1. Dump the json file from the website
cities = ['南投縣', '嘉義市', '嘉義縣', '基隆市', '宜蘭縣', '屏東縣', '彰化縣', '新北市', '新竹市',
          '新竹縣', '桃園市', '澎湖縣', '臺中市', '臺北市', '臺南市', '臺東縣', '花蓮縣', '苗栗縣',
          '連江縣', '金門縣', '雲林縣', '高雄市']

urls = ['http://gis.taiwan.net.tw/XMLReleaseALL_public/activity_C_f.json',
        'https://gis.taiwan.net.tw/XMLReleaseALL_public/hotel_C_f.json',
        'https://gis.taiwan.net.tw/XMLReleaseALL_public/Walk_f.json',
        'https://gis.taiwan.net.tw/XMLReleaseALL_public/Bike_f.json']

tourism_classes = ['activity', 'hotel_B&B', 'trail', 'bike']

missing_value = ''
'''
tourism_dict = {'title': [], 'address': [], 'longitude': [], 
                'latitude': [], 'label_search': [], 'description': [],
                'picture': [], 'picdescribe': []}
'''
tourism_dict = {'title': [], 'address': [], 'longitude': [], 
                'latitude': [], 'label_search': [], 'description': [],
                'city': [], 'district': [], 'time_start': [], 'time_end': []}    

def json2df(tourism_dict, init_df, url, tourism_class, missing_value):
    r = requests.get(url)
    contents = r.text
    data = json.loads(contents)
    dataset = data['XML_Head']['Infos']['Info']
        
    for spot in dataset:
        city_info = spot['Name'].replace('台', '臺') + spot['Add'].replace('台', '臺')
        city = [city for city in cities if city[:-1] in city_info]
        if len(city) > 1:
            tourism_dict['title'].append(spot['Name'].replace('台', '臺'))
            tourism_dict['address'].append(spot['Add'].replace('台', '臺'))

            tourism_dict['city'].append(city[0])
            
            if '區' not in spot['Add']:
                tourism_dict['district'].append('')
            else:
                destrict_loc = spot['Add'].index('區')
                tourism_dict['district'].append(spot['Add'].replace('台', '臺')[destrict_loc-2:destrict_loc+1])

    
            if tourism_class not in ['trail', 'bike']:
                tourism_dict['longitude'].append(spot['Px'])
                tourism_dict['latitude'].append(spot['Py'])
            else:
                lon_lat = spot['Route_XY'].replace('；', '，').replace(';', '，').split('，')
                tourism_dict['longitude'].append(float(lon_lat[0]))
                tourism_dict['latitude'].append(float(lon_lat[1]))
            
            if 'Start' in spot:
                tourism_dict['time_start'].append(spot['Start'])
                tourism_dict['time_end'].append(spot['End'])
            else:
                tourism_dict['time_start'].append('')
                tourism_dict['time_end'].append('')
            tourism_dict['label_search'].append(tourism_class)
            tourism_dict['description'].append(spot['Description'])
            
            '''
            if len(spot['Picture1']) > 0:
                pic = spot['Picture1']
                pic_describe = spot['Picdescribe1']
            elif len(spot['Picture2']) > 0:
                pic = spot['Picture2']
                pic_describe = spot['Picdescribe2']
            elif len(spot['Picture3']) > 0:
                pic = spot['Picture3']
                pic_describe = spot['Picdescribe3']
            else:
                pic = missing_value
                pic_describe = missing_value
            tourism_dict['picture'].append(pic)
            tourism_dict['picdescribe'].append(pic_describe) 
            '''
        tourism_df = pd.concat([init_df, pd.DataFrame.from_dict(tourism_dict)], 
                                ignore_index = True)
    return tourism_df

# 2. Dataframe
tourism_df = pd.DataFrame()

for i in range(len(urls)):
    url = urls[i]
    tourism_class = tourism_classes[i]
    
    tourism_df = json2df(tourism_dict, tourism_df, url, tourism_class, missing_value)  

# tourism_df = tourism_df.drop_duplicates()/opendata-swagger.htmles().reset_index(drop = True)


def time_format(time_):
    return int(time_[:4]), int(time_[5:7]), int(time_[8:10])

y, m, d = time_format(np.sort(tourism_df['time_end'])[-1])
(datetime.datetime(y, m, d) - datetime.datetime.now()).days >= 0

keep = []
for i in tourism_df['time_end']:
    if i != '':
        y, m, d = time_format(i)
        keep.append((datetime.datetime(y, m, d) - datetime.datetime.now()).days >= 0)
    else:
        keep.append(True)
    
tourism_df = tourism_df[pd.Series(keep)].reset_index(drop = True)

#description
tourism_df.drop(['time_start', 'time_end'], axis=1, inplace=True)

tourism_df.to_csv('tourism_data/tourism_df.csv', index = False)

# sum([len(i) >0 for i in tourism_df['district']]) # 169 records have district info

# 3. To SQL database
# create database: sql_final
sql_engine = sql.create_engine("mysql+pymysql://newuser:1234@localhost/DBfinal") 
con = sql_engine.connect()

tourism_df.to_sql('tourism_df', con)

        
