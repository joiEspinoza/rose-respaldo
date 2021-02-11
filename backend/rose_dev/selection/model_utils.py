import io
import os
import re
import boto3
import requests
import random
import json
import unidecode
from googletrans import Translator
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


googlemaps_reserved = ["!", "°", "-", "*" ,"'" ,"(" ,")" ,";" ,":" ,"@" ,"&" ,"=" ,"+" ,"$" ,"/" ,"?" ,"%" ,"#" ,"[" ,"]"]

programmer = ['php', 'java', 'javascript', 'python', 'react', 'angular', 'node',
              'django', 'perl', 'asp', 'ruby', 'cakephp', 'php 5', 'php 7', 'node.js',
              'asp.net', '.net', '.netframework', 'vb.net', 'laravel', 'tensorflow',
              'pytorch', 'sklearn', 'pandas', 'numpy', 'matplotlib', 'spacy', 'opencv',
              'html', 'css', 'c++' , 'c', 'c#', 'delphi', 'pascal', 'visual basic',
              'rust', 'kotlin', 'go', 'dart', 'f#', 'clojure', 'SQL', 'webassembly',
              'typescript', 'r', 'assembly', 'django', 'django-rest-framework', 'angular',
              'vue.js', 'ember', 'next.js', 'octave', '']

database = ['mongodb', 'microsoft sql server', 'sql server', 'postgre', 'postgre sql', 'knack',
            'amazon rds', 'mysql', 'sqllite', 'ibm db', 'oracle', 'teamdesk', 'sap hana', 'hana',
            ]
ms_office = ['excel', 'ms excel', 'word', 'ms word', 'power point', 'ms power point', 'ms powerpoint',
             'power point', 'office', 'ms office', 'outlook', 'ms outlook']

current = ['actual', 'actualidad', 'presente', 'fecha', 'hoy', 'now']


translator = Translator()
#testing vars
#min_req = {"exp": 2, "idioms": ["español"], "skills": ["office"], "location": ["Chile, Santiago"]}
#desire_req = {"exp": 4, "idioms": ["español", "ingles"], "skills": ["office", "sql", "sap", "crm"], "designation": ["analista", "vendedor"], "college":["Pontificia unversidad católica", "Universidad adolfo ibáñez", "Universidad de chile"], "degree":["Ingenieria civil industrial", "Ingenieria comercial"]}

def score_candidate(comp_work, desig_work, years_work, other_work, desig_ind, remote_ind, years_ind,
                    idioms, skills, comb, grad_ed, colleges, degrees, certif, names, locations,
                    mails, phones, min_req, desire_req, sel_id):
    """
    Parameters:
        - Inference of algorithm, everything until phones
        - Requirements of selection, min_req and desire_req
    """


    #Creating list of indexes, we have different list formats, a little messy
    #Why? because year of expereince is involved in the sequence target
    min_state, min_state2, min_state3, min_state4 = True, True, True, True

    ### SET YEARS OF EXPERIENCE -- how many years have passed since the first job experience?
    working_years = re.findall("[0-9]{4}", str(years_work))
    if_current = [value.replace("'","") for value in re.findall("([a-zA-Z]+')", str(years_work)) if value != "experience'"]
    val_current = 0
    for value in if_current:
        for value2 in current:
                match = SequenceMatcher(None, value.lower(), value2).ratio()
                if match >= 0.8:
                    val_current = val_current + 1
    if len(working_years) != 0:
        year_min = min(working_years)
        if val_current > 0:
            year_max = datetime.now().strftime('%Y')
        else:
            year_max = max(working_years)
        experience = int(year_max) - int(year_min)
    else:
        experience = 0
    min_exp = min_req['exp']
    desire_exp = desire_req['exp']
    if min_exp != None:
        # If candidate doest not have minimum experience then min_state = false
        minexp_score = 2 if experience >= min_exp else 0
        min_state = False if minexp_score == 0 else True
    if desire_exp != None:
        greatexp_score = 1 if experience >= desire_exp else 0


    ### SETTING IDIOMS - we remove word idioms and create list with idioms
    min_idiom = min_req['idioms']
    desire_idiom = desire_req['idioms']
    try:
        min_idiom.remove('español')
        desire_idiom.remove('español')
    except:
        pass
    minscore_idiom = 0
    greatscore_idiom = 0
    c_idioms = [value for value in idioms if SequenceMatcher(None, value.lower(), 'idioma').ratio() < 0.8]
    if len(min_idiom) == 0:
        pass
    else:
        for idiom in min_idiom:
            #check idiom without any tildes
            idiom_c = unidecode.unidecode(idiom.lower())
            match_eng = SequenceMatcher(None, idiom_c, 'ingles').ratio() >= 0.8
            if match_eng == True:
                min_idiom.append('english')
            if  idiom_c in unidecode.unidecode(str(c_idioms)) and idiom.lower() != 'español':
                minscore_idiom = minscore_idiom + 1
        # If candidate doest not have minimum idiom then min_state = false
        min_state2 = False if minscore_idiom == 0 else True
    if len(desire_idiom) == 0:
        pass
    else:
        for idiom in desire_idiom:
            idiom_c = unidecode.unidecode(idiom.lower())
            match_eng = SequenceMatcher(None, idiom_c, 'ingles').ratio() >= 0.8
            if match_eng == True and 'english' not in str(desire_idiom):
                desire_idiom.append('english')
            if  idiom_c in unidecode.unidecode(str(c_idioms)) and idiom.lower() != 'español':
                greatscore_idiom = greatscore_idiom + 0.5


    ### SETTING TYPE OF DEGREE and low score - is is tech, profesional or postgraduate
    pro_type = []
    if 'técnic' in str(degrees).lower() or 'tecnic' in str(degrees).lower():
        pro_type.append('Técnico')
    elif 'msc' in str(degrees).lower() or 'master' in str(degrees).lower() or 'magister' in str(degrees).lower().replace('í','i') or 'maestría' in str(degrees).lower().replace('í','i'):
        pro_type.append('Master')
    elif 'phd' in str(degrees).lower() or 'doctor' in str(degrees).lower() or 'doctorado' in str(degrees).lower():
        pro_type.append('Doctorado')
    elif 'universidad' in str(degrees).lower():
        pro_type.append('Profesional')
    else:
        pro_type.append('-')

    desire_degree = desire_req['degree']
    if len(desire_degree) > 0:
        degree_score = 0
        for degree.lower() in desire_degree:
            for unidecode.unidecode(inf_degree.lower()) in degrees:
                inf_degree_c = re.sub('(ing)[^a-zA-Z]','ingenieria',unidecode.unidecode(inf_degree.lower()))
                degree_score = 1 if SequenceMatcher(None, inf_degree_c, 
                                                    unidecode.unidecode(degree.lower())).ratio() >= 0.7 else 0
            
    ### SETTING LOCATION INDICATOR - is the candidate inside the minimum region
    min_locs = min_req['location']
    if len(min_locs) > 0:
        if len(locations) > 0:
            location = []
            if len(locations) >= 2 and locations[1] not in locations[0]:
                adress = locations[0] + ' ' + locations[1]
            else:
                adress = locations[0]
            for car in googlemaps_reserved:
                adress = str(adress).replace(car,'')
            endpoint = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + adress.replace(' ','+') + '&key=' + os.environ.get('MAPS_KEY')
            try:
                get_location = requests.get(endpoint).json()['results'][0]
                for comp in get_location['address_components']:
                        if comp['types'][0] == 'administrative_area_level_1':
                            location.append(comp['long_name'])
                        if comp['types'][0] == 'country':
                            location.append(comp['long_name'])
            except:
                loc_ind = 2
            for loc in min_locs:
                min_loc = []
                endpoint2 = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + loc.replace(' ','+') + '&key=' + os.environ.get('MAPS_KEY')
                get_minloc = requests.get(endpoint2).json()['results'][0]
                for comp in get_minloc['address_components']:
                        if comp['types'][0] == 'administrative_area_level_1':
                            min_loc.append(comp['long_name'])
                        if comp['types'][0] == 'country':
                            min_loc.append(comp['long_name'])
                try:
                    if len(min_loc) == 1:
                        state_country = location[1] == min_loc[0]
                        loc_ind = 1 if state_country == True else 0
                    elif len(min_loc) == 2:
                        #print(adress, location)
                        state_country = location[1] == min_loc[1]
                        state_region = location[0] == min_loc[0]
                        loc_ind = 1 if state_country == True and state_region == True else 0
                except:
                    loc_ind = 2
        else:
            loc_ind = 2
    else:
        loc_ind = 99
    min_state3 = False if loc_ind == 0 and remote_ind == False else True

    ### SETTING SKILLS AND CERTIFICATION SCORE - high score
    min_skills = min_req['skills'] if min_req['skills'] != None else []
    desire_skills = desire_req['skills'] if desire_req['skills'] != None else []
    minscore_skill = 0
    greatscore_skill = 0
    if len(min_skills) == 0:
        pass
    else:
        for skill in min_skills:
            regex = '[^a-zA-Z](' + skill + ')[^a-zA-Z]'
            find_skill =  re.findall(regex, str(skills))
            if len(find_skill) > 0:
                minscore_skill = minscore_skill + 2
        # If candidate doest not have minimum idiom then min_state = false
        min_state4 = False if minscore_skill == 0 else True
    if len(desire_skills) == 0:
        pass
    else:
        for skill in desire_skills:
            regex = '[^a-zA-Z](' + skill + ')[^a-zA-Z]'
            find_skill =  re.findall(regex, str(skills))
            if len(find_skill) > 0:
                greatscore_skill = greatscore_skill + 1

    ### SETTING COMPANIES EXPERIENCE LOW SCORE
    companies_score = 0.2 * len(comp_work)

    ### SETTING COLLEGE SCORE -- low
    desire_college = desire_req['college']
    college_score = 0
    if len(desire_college) != 0:
        for college in desire_college:
            for inf_college in colleges:
                match = SequenceMatcher(None, inf_college.lower(), college.lower()).ratio() >= 0.85
                if match == True:
                    college_score = 1
                    break
                else:
                    pass

    ### SETTING DESIGNATION SCORE -- medium
    desire_desig = desire_req['designation']
    desig_score = 0
    if len(desire_desig) != 0:
        for designation in desire_desig:
            designation_c = unidecode.unidecode(designation.lower())
            designation_tes = translator.translate(designation_c, src='es', dest='en').text
            if designation_tes not in desire_desig:
                desire_desig.append(designation_tes)
            designation_ten = translator.translate(designation_c, src='en', dest='es').text
            if designation_ten not in desire_desig:
                desire_desig.append(designation_ten)
            for inf_desig in desig_work:
                inf_desig_c = unidecode.unidecode(inf_desig.lower())
                match = SequenceMatcher(None, inf_desig_c, unidecode.unidecode(designation.lower())).ratio() >= 0.7
                if match == True:
                    desig_score = 2
                    break
                else:
                    pass

    ### CALCULATING CANDIDATE SCORE
    # if candidates achieves minimum requirements then we score else, score is 0
    if min_state == False or min_state2 == False or min_state3 == False or min_state4 == False:
        min_score = 0
    else:
        min_score = minexp_score + minscore_idiom + minscore_skill

    desire_score = greatexp_score + greatscore_idiom + greatscore_skill + desig_score + college_score + companies_score + degree_score

    candidate_score = min_score + desire_score

    #print scores for testing
    """
    print('Candidate score: ' + str(candidate_score))
    print('         MIN exp: ' + str(minexp_score))
    print('         MIN idiom: ' + str(minscore_idiom))
    print('         MIN skill: ' + str(minscore_skill))
    print('         DES exp: ' + str(greatexp_score))
    print('         DES idiom: ' + str(greatscore_idiom))
    print('         DES skill: ' + str(greatscore_skill))
    print('         DES college: ' + str(college_score))
    print('         DES designation: ' + str(desig_score))
    print('         DES companies: ' + str(companies_score))
    print('         DES degree: ' + str(degree_score))
    """


    cand_data = {
                                "exp": experience,
                                "type": pro_type,
                                "idioms": c_idioms,
                                "skills": skills,
                                "location": locations,
                                "companies": comp_work,
                                "phone": phones,
                                "mail": mails,
                                "degree": degrees,
                                "designation": desig_work,
                                "college": colleges,
                                "graduation": grad_ed,
                                "certifications": certif
                            }
    ### ADD RANKING HERE
    cand_info = {
                "rank": candidate_score, #random.randint(1, 100)
                "data": cand_data
                }
    cand = {
                "name": names[0] if len(names) > 0 else 'Desconocido',
                "mail": mails[0] if len(mails) > 0 else None,
                "info": cand_info,
                "selection": sel_id,
                }
    if min_score == 0:
        low = True
        high = False
        medium = False
    elif candidate_score >= 10:
        high = True
        low = False
        medium = False
    else:
        high = False
        low = False
        medium = True
    return cand, high, low, medium


######################################################################################################


def create_candidates(path, sel_id, min_req, desire_req, remote_ind, scorer, model_type):
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

    model_type = 3c or whole

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
    whole_nlp = spacy.load('selection/models/whole')
    rose_bucket = s3.Bucket(r'rosev0')
    low_ind = 0
    high_ind = 0
    medium_ind = 0
    candidates = []
    for resume in rose_bucket.objects.filter(Prefix=path):
        key = resume.key
        body = resume.get()['Body'].read()
        buffer = io.BytesIO()
        buffer.write(body)
        ext = re.search('\.[a-z]+$', key)
        #print(key)
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
            #print('trying download in ' + pathdoc)
            rose_bucket.download_file(key, pathdoc)
            #doc_text = os.system('antiword "' + pathdoc + '"')
            try:
                output = subprocess.check_output('antiword "' + pathdoc + '"', shell=True)
                text = output.decode('utf-8')
            except:
                continue

        if text != None:
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
            certif = []
            # then personal
            names = []
            locations = []
            mails = []
            phones = []
            if model_type == '3c':
                doc_work = work_nlp(text) 
                doc_ed = ed_nlp(text) 
                doc_per = per_nlp(text) 
                #create array with entity text from algorithm inference
                for ent in doc_work.ents:
                    for value in [ent.text]:
                        if ent.label_ == 'companies worked at':
                            comp_work.append(value)
                        elif ent.label_ == 'designation':
                            desig_work.append(value.lower())
                            desig_ind.append(ent.start_char)
                        elif ent.label_ == 'years of experience':
                            years_work.append(value)
                            years_ind.append(ent.start_char)
                        elif ent.label_ == 'idioms':
                            idioms.append(value.lower())
                        elif ent.label_ == 'skills':
                            skills.append(value.lower())
                        else:
                            other_work.append([ent.label_, value])
                        results.append([ent.label_, value, text.index(value)])
                for ent in doc_ed.ents:
                    for value in [ent.text]:
                        if ent.label_ == 'graduation year':
                            grad_ed.append(value)
                        elif ent.label_ == 'college':
                            colleges.append(value.lower())
                        elif ent.label_ == 'degree':
                            degrees.append(value.lower())
                        elif ent.label_ == 'certifications':
                            certif.append(value.lower())
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
            elif model_type == 'whole':
                doc = whole_nlp(text) 
                for ent in doc.ents:
                    for value in [ent.text]:
                        if ent.label_ == 'companies worked at':
                            comp_work.append(value)
                        elif ent.label_ == 'designation':
                            desig_work.append(value.lower())
                            desig_ind.append(ent.start_char)
                        elif ent.label_ == 'years of experience':
                            years_work.append(value)
                            years_ind.append(ent.start_char)
                        elif ent.label_ == 'idioms':
                            idioms.append(value.lower())
                        elif ent.label_ == 'skills':
                            skills.append(value.lower())
                        elif ent.label_ == 'location':
                            locations.append(value)
                        elif ent.label_ == 'mail':
                            mails.append(value)
                        elif ent.label_ == 'phone':
                            phones.append(value)
                        elif ent.label_ == 'name':
                            names.append(value)
                        elif ent.label_ == 'graduation year':
                            grad_ed.append(value)
                        elif ent.label_ == 'college':
                            colleges.append(value.lower())
                        elif ent.label_ == 'degree':
                            degrees.append(value.lower())
                        elif ent.label_ == 'certifications':
                            certif.append(value.lower())
                        else:
                            other_work.append([ent.label_, value])
                        results.append([ent.label_, value, text.index(value)])
            if scorer == 'scorer':
                cand_json, high, low, medium = score_candidate(comp_work, desig_work, years_work, other_work, desig_ind, remote_ind,
                                                  years_ind, idioms, skills, comb, grad_ed, colleges, degrees, 
                                                  certif, names, locations, mails, phones, min_req, desire_req, sel_id)
                match = re.findall('(\[])', str(cand_json))
                if len(match) >= 5 and cand_json['info']['rank'] == 0:
                    pass
                else:
                    candidates.append(cand_json)
            if high:
                high_ind = high_ind + 1
            if low:
                low_ind = low_ind + 1
            if medium:
                medium_ind = medium_ind + 1
    return candidates, high_ind, low_ind, medium_ind
            #elif scorer == 'unsupervised':


### Forming pairs of designation and companies
### for now we'll move on to thranking, as training gets better this problem vanishes
