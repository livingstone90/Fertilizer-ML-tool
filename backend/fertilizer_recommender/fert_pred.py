from models import Data

my_village = Data.objects.get(village='Hallu')
predicted_practice = my_village.predict_farm_practice()
print(predicted_practice)
