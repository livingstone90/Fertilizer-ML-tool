
import pandas as pd
import os
import django
import sys
from fertilizer_recommender.models import Data

#os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
# print(os.environ['DJANGO_SETTINGS_MODULE'])
# django.setup()


# Set the working directory to the project root directory
os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(sys.argv[0]))))

# Set the DJANGO_SETTINGS_MODULE environment variable
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Initialize Django
django.setup()


def import_data():
    data = pd.read_excel('SCALING_HARVEST_DATA_2017_JK.xlsx',
                         sheet_name='Survey_2017_sila')

    for index, row in data.iterrows():
        village = row['Village']
        manure_applied = row['Manu_Appl']
        latitude = row['Latitude']
        longitude = row['Longitude']
        altitude = row['Altitude']
        farmer_practice = row['Av_FP']
        fertilizer_practice = row['Av_IP']
        yield_difference = row['YldDiff']

        data = Data(
            village=village,
            manure_applied=manure_applied,
            latitude=latitude,
            longitude=longitude,
            altitude=altitude,
            farmer_practice=farmer_practice,
            fertilizer_practice=fertilizer_practice,
            yield_difference=yield_difference
        )
        data.save()
