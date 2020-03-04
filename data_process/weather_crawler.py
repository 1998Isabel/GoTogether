#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SQL final project - weather crawler
"""


import numpy as np
from bs4 import BeautifulSoup
import datetime
import os
import pyodbc

import urllib.request
import zipfile 

import requests
import json
import pandas as pd
import sqlalchemy as sql

cwb_data = 'weather_data'
if not os.path.exists(cwb_data):
    os.mkdir(cwb_data)

# 1. Dump the json file from the website
## "臺灣各縣市鄉鎮未來1週逐12小時天氣預報"
url = 'https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/F-D0047-091?Authorization=CWB-E425F86B-A36C-49F1-8039-4D91580FEDC3&downloadType=WEB&format=JSON'
r = requests.get(url)
contents = r.text.replace("'", "\"")
data = json.loads(contents)
dataset = descript = data['cwbopendata']['dataset']

# 2. Basic info
## (a) Dataset description
descript = dataset['datasetInfo']['datasetDescription']
print('Data: {}'.format(descript))

## (b) Data issue time
def time_format(time):
    return time[:10], time[11:19]

time = data['cwbopendata']['sent']
print('Data issued time: {} {}'.format(time_format(time)[0], time_format(time)[1]))

# 3. Dataframe
## (a) view
# len(dataset['locations']['location']) # 22 cities
# [i['locationName'] for i in dataset['locations']['location']] # ['連江縣', '金門縣', ..., '桃園市']

## (b) df
weather_df = pd.DataFrame()

for loc in dataset['locations']['location']:
    weather_dict = {}
    
    # Geometric info
    city = loc['locationName']
    lat = loc['lat'] # latitude
    lon = loc['lon'] # longtitude
    weather_dict['city'] = [city] * 14
    weather_dict['latitude'] = [lat] * 14
    weather_dict['longtitude'] = [lon] * 14
    
    # Time info 
    start_dates = [time_format(t['startTime'])[0] for t in loc['weatherElement'][0]['time']]
    start_times = [time_format(t['startTime'])[1] for t in loc['weatherElement'][0]['time']]
    end_dates = [time_format(t['endTime'])[0] for t in loc['weatherElement'][0]['time']]
    end_times = [time_format(t['endTime'])[1] for t in loc['weatherElement'][0]['time']]
    weather_dict['start_date'] = start_dates
    weather_dict['start_time'] = start_times
    weather_dict['end_date'] = end_dates
    weather_dict['end_time'] = end_times
    
    # Weather info
    weather = loc['weatherElement']
    # [weather_info['description'] for weather_info in weather] # ['平均溫度', '平均露點溫度', ..., '天氣預報綜合描述']

    for weather_info in weather:
        weather_idx = weather_info['description'].replace('獻', '線')
        weather_eval = weather_info['time'][0]['elementValue']
        if type(weather_eval) == dict:
            units = [weather_eval['measures']]
        else:
            units = [i['measures'] for i in weather_eval]
        
        for i, unit in enumerate(units):
            if unit != 'NA' and '自定義' not in unit:
                weather_factor = '{} ({})'.format(weather_idx, unit)
            elif weather_idx not in weather_dict:
                weather_factor = weather_idx
            else:
                weather_factor = '{}_2'.format(weather_idx) 
            values = [t_info['elementValue']['value'] if type(t_info['elementValue']) == dict else t_info['elementValue'][i]['value'] for t_info in weather_info['time']]
            if len(values) == 7:
                weather_dict[weather_factor] = list(np.repeat(values, 2))
            elif len(values) == 14:
                weather_dict[weather_factor] = values  
            else:
                print('There are some values missing.')
    if len(weather_df) == 0:
        weather_df = pd.DataFrame.from_dict(weather_dict)
    else:
        weather_df = pd.concat([weather_df, pd.DataFrame.from_dict(weather_dict)])
weather_df = weather_df.drop(['天氣現象_2'], axis = 1)    
weather_df.to_csv('weather_data/weather_df.csv', index = False, na_rep = 'NA')
# weather_df = pd.read_csv('weather_data/weather_df.csv')

# 4. To SQL database
# create database: test
sql_engine = sql.create_engine("mysql+pymysql://newuser:1234@localhost/DBfinal") 
con = sql_engine.connect()

weather_df.to_sql('weather_df', con)


