import io
import os
import re
import boto3
import requests
import random
import json
#import pandas as pd
#import numpy as np
import codecs
import tokenize
import datetime
import pytz
from pytz import timezone
from datetime import datetime
from difflib import SequenceMatcher
#PDF handling
from pdfminer.converter import TextConverter
from pdfminer.pdfinterp import PDFPageInterpreter
from pdfminer.pdfinterp import PDFResourceManager
from pdfminer.layout import LAParams
from pdfminer.pdfpage import PDFPage
from pdfminer.pdfparser import PDFSyntaxError
from io import StringIO
#word 97 .doc handling
import subprocess #using linux antiword
#docx word documents handling
from docx import Document
#handle inference of models
import spacy


###CREDENTIALS
os.environ['AWS_KEY'] = 'AKIAJEN4JB3CITFUIUFQ'
os.environ['AWS_SECRET'] = '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'

programmer = ['php', 'java', 'javascript', 'python', 'react', 'angular', 'node',
              'django', 'perl', 'asp', 'ruby', 'cakephp', 'php 5', 'php 7', 'node.js',
              'asp.net', '.net', '.netframework', 'vb.net', 'laravel', 'tensorflow',
              'pytorch', 'sklearn', 'pandas', 'numpy', 'matplotlib', 'spacy', 'opencv',
              'html', 'css', 'c++' , 'c', 'c#', 'delphi', 'pascal', 'visual basic',
              'rust', 'kotlin', 'go', 'dart', 'f#', 'clojure', 'SQL', 'webassembly',
              'typescript', 'r', 'assembly', 'django', 'django-rest-framework', 'angular',
              'vue.js', 'ember', 'next.js']

current = ['actual', 'actualidad', 'presente', 'fecha', 'hoy', 'now']

def create_candidates(path, sel_id):
    """
    We start by getting text from resumes uploaded to AWS S3 bucket rosev0
    In case of pdf and docx we were able to process bytes making it easier
    to handle and make an inference. 
    On the other hand, we have a processed doc files with antiword, 
    sometimes the doc wiull not be processed in case of having weird format

    AWS 
        S3
            bucket: rosev0
                mail_user / replace @ with _
                    chilean date and selection name

    """
    #connecting to AWS S3
    s3 = boto3.resource("s3",
                    region_name='us-east-2',
                    aws_access_key_id=os.environ.get('AWS_KEY'),
                    aws_secret_access_key=os.environ.get('AWS_SECRET'))
    # loading models
    work_nlp = spacy.load('selection/models/work')
    ed_nlp = spacy.load('selection/models/education')
    per_nlp = spacy.load('selection/models/personal')
    rose_bucket = s3.Bucket(r'rosev0')
    candidates = []
    for resume in rose_bucket.objects.filter(Prefix=path):
        key = resume.key
        body = resume.get()['Body'].read()
        buffer = io.BytesIO()
        buffer.write(body)
        ext = re.search('\.[a-z]+$', key)
        print(key)
        ###body comes in binary stream, we have to decode it
        if ext == None:
            continue
        elif ext.group() == '.docx':
            document = Document(buffer)
            text = "\n".join([paragraph.text for paragraph in document.paragraphs])
            #print(string)
        elif ext.group() == '.pdf':
            rsrcmgr = PDFResourceManager()
            retstr = StringIO()
            codec = 'utf-8'
            laparams = LAParams()
            device = TextConverter(rsrcmgr, retstr, codec=codec, laparams=laparams)
            interpreter = PDFPageInterpreter(rsrcmgr, device)
            password = ""
            maxpages = 0
            caching = True
            pagenos=set()
            for page in PDFPage.get_pages(buffer, pagenos, maxpages=maxpages, password=password,caching=caching, check_extractable=True):
                interpreter.process_page(page)
                #fp.close()
                #device.close()
                #retstr.close()
            text = retstr.getvalue()
            #print(string)
        elif ext.group() == '.doc':
            #LINUX version handles damaged files and text in docs
            split = str(key).split('/')
            #replace special characters, linux problem reading path
            filename = str(split[-1]).replace('$','_').replace('#','_')
            pathdoc = 'selection/tmp/' + filename
            print('trying download in ' + pathdoc)
            rose_bucket.download_file(key, pathdoc)
            #doc_text = os.system('antiword "' + pathdoc + '"')
            try:
                output = subprocess.check_output('antiword "' + pathdoc + '"', shell=True)
                text = output.decode('utf-8')
            except:
                continue

        if text != None:
            doc_work = work_nlp(text) 
            doc_ed = ed_nlp(text) 
            doc_per = per_nlp(text) 
            d = {}
            results = []
            # first we create list for work classes, we need to procces them, get them together
            comp_work = []
            desig_work = []
            years_work = []
            other_work = []
            desig_ind = []
            years_ind = []
            idioms = []
            skills = []
            comb = []
            # then we do the same with college attributes
            grad_ed = []
            colleges = []
            degrees = []
            # then personal
            names = []
            locations = []
            mails = []
            phones = []
            #create array with entity text
            for ent in doc_work.ents:
                for value in [ent.text]:
                    if ent.label_ == 'companies worked at':
                        comp_work.append(value)
                    elif ent.label_ == 'designation':
                        desig_work.append(value)
                        desig_ind.append(ent.start_char)
                    elif ent.label_ == 'years of experience':
                        years_work.append(value)
                        years_ind.append(ent.start_char)
                    elif ent.label_ == 'idioms':
                        idioms.append(value)
                    elif ent.label_ == 'skills':
                        skills.append(value)
                    else:
                        other_work.append([ent.label_, value])
                    results.append([ent.label_, value, text.index(value)])
            for ent in doc_ed.ents:
                for value in [ent.text]:
                    if ent.label_ == 'graduation year':
                        grad_ed.append(value)
                    elif ent.label_ == 'college':
                        colleges.append(value)
                    elif ent.label_ == 'degree':
                        degrees.append(value)
                    results.append([ent.label_, value, text.index(value)])
            for ent in doc_per.ents:
                for value in [ent.text]:
                    if ent.label_ == 'name':
                        names.append(value)
                    elif ent.label_ == 'location':
                        locations.append(value)
                    elif ent.label_ == 'mail':
                        mails.append(value)
                    elif ent.label_ == 'phone':
                        phones.append(value)
                    results.append([ent.label_, value, text.index(value)])

            #Creating list of indexes, we have different list formats, a little messy
            #Why? because year of expereince is involved in the sequence target
            ind = 0 
            #desig_ind = [text.index(x[1]) for x in desig_work]
            #years_ind = [text.index(x[1]) for x in years_work]
            print('Validating same lenght of ind and entities, desig_work_years: ' + str(len(desig_work)) + ' ' + str(len(comp_work)) + ' ' + str(len(years_work)))
            
            #getting working years and calculating experience
            working_years = re.findall("[0-9]{4}", str(years_work))
            if_current = [value.replace("'","") for value in re.findall("([a-zA-Z]+')", str(years_work)) if value != "experience'"]
            val_current = 0
            for value in if_current:
                for value2 in current:
                     match = SequenceMatcher(None, value.lower(), value2).ratio()
                     if match > 0.8:
                         val_current = val_current + 1
            
            #print(results)
            if len(working_years) != 0:
                year_min = min(working_years)
                if val_current > 0:
                    year_max = datetime.now().strftime('%Y')
                else:
                    year_max = max(working_years)


            experience = int(year_max) - int(year_min)
            pro_type = []
            c_idioms = [value for value in idioms if SequenceMatcher(None, value.lower(), 'idioma').ratio() < 0.8]
            print(c_idioms)
            if 'técnic' in str(desig_work).lower() or 'tecnic' in str(desig_work).lower():
                pro_type.append('Técnico')
            elif 'msc' in str(desig_work).lower() or 'master' in str(desig_work).lower():
                pro_type.append('Master')
            elif 'phd' in str(desig_work).lower() or 'doctor' in str(desig_work).lower():
                pro_type.append('Doctorado')
            else:
                pro_type.append('Profesional')

            cand_data = {
                            "exp": experience,
                            "type": pro_type,
                            "idioms": c_idioms,
                            "skills": skills,
                            "location": locations,
                            "companies": comp_work,
                            "phone": phones,
                            "mail": mails,
                            "designation": desig_work,
                            "college": colleges,
                            "graduation": grad_ed
                        }
            ### ADD RANKING HERE
            cand_info = {
                        "data": cand_data,
                        "rank": random.randint(1, 100)
                        }
            cand = {
                        "name": names[0] if len(names) > 0 else 'Desconocido',
                        "mail": mails[0] if len(mails) > 0 else None,
                        "info": cand_info,
                        "selection": sel_id,
                        }
            candidates.append(cand)
    #print(candidates)
    #headers = {'Content-Type': 'application/json'}
    #post_candidates = requests.post('http://localhost:8000/selection/create_candidate/', headers = headers, data=json.dumps(candidates))
    #print('RESPONSE TEXT: ', post_candidates.text)
    return candidates

### Forming pairs of designation and companies
### for now we'll move on to thranking, as training gets better this problem vanishes
"""
for row in comp_work:
    company_i = row[2]
    #print(company_i)
    closest_desig = min(desig_ind, key=lambda x:abs(x-company_i))
    closest_year = min(years_ind, key=lambda x:abs(x-company_i))
    #print('Closest indexes -------- desig: ' + str(closest_desig), '   year:' + str(closest_year))
    #print('Combinations:   ' + str(comb))
    desig = ''
    year = ''
    if closest_desig not in comb:
        desig = desig_work[desig_ind.index(closest_desig)][1]
    if closest_year not in comb:
        year = years_work[years_ind.index(closest_year)][1]
    #print('Literal combinations: ' + row[1], '  ' + desig, '  ' + year)
    comb.append(closest_desig)
    comb.append(closest_year)
"""

#getting desired and minimum requirements from selection



            

            
#rose_bucket, prefix_filter = create_candidates(r'bengonzalez1995_gmail.com/10-12-2020*tíldes_para_gerencia_de_los_mágicos*input/',3)
