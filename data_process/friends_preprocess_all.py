#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
108-SQL-Final
Friends_hobbies_preprocess
"""

import pandas as pd
import numpy as np
import os
import itertools
import requests

import gdown

url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTNxJNoqeqKszMdB-6I0xF5xwDo8XlqYHlZqarpIrcH325zGJJ2NizlmH16G2p7P6af0fnW4H1u84tX/pub?output=csv'
output = 'friends.csv'
gdown.download(url, output, quiet = False) 

current_dir = os.getcwd()
FILE = '/friends.csv'
data = pd.read_csv(current_dir + FILE)

# friends data preprocess
data.columns = ['time', 'name', 'id', 'city', 'district', 'hobbies']

data['id'] = data['id'].str.lower()
data['city'] = data['city'].str.replace('台', '臺')
data['district'] = data['district'].str.replace('区', '區')

# mapping to the labels in the spots data
# spotsData = pd.read_csv('allspots.csv')
# spotsData['label_search'].unique()
EN_hobbies = ['food', 'history', 'trail', 'sport', 'drama', 'nature', 
              'seminar', 'read', 'family', 'activity', 'music', 'spring', 'shopping', 
              'art', 'movie', 'dance', 'exhibition']
              
hobby_lists = [i.split(', ') for i in data['hobbies']]
# list(set(itertools.chain(*hobby_lists)))
CH_hobbies = ['美食', '歷史與文化', '散步健行', '運動', '戲劇', '大自然',
              '演講', '閱讀', '親子活動', '節慶活動', '音樂', '溫泉', '購物',
              '藝術', '電影', '舞蹈', '展覽']

for i in range(len(CH_hobbies)):
    data['hobbies'] = data['hobbies'].str.replace(CH_hobbies[i], EN_hobbies[i])

data.to_csv('friends_preprocess.csv', index = False)
