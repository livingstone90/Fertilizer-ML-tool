from django.db import models
import pandas as pd
import numpy as np
from django.utils import timezone
from django.core.files.base import ContentFile
from django_pandas.managers import DataFrameManager
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.model_selection import RandomizedSearchCV
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, OneHotEncoder
from sklearn.metrics import accuracy_score
import joblib as joblib
import pickle
from django.db.models import Q
# from sklearn.externals import joblib

# create models here


class PredictionModel(models.Model):
    model_file = models.FileField()

    def save_model(self, model):
        # Pickle the model and save it to the model_file field
        pickled_model = pickle.dumps(model)
        self.model_file.save('model.pkl', ContentFile(pickled_model))
        self.save()


class Data(models.Model):
    village = models.CharField(max_length=100)
    manure_applied = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    altitude = models.FloatField()
    slope_dem = models.FloatField(default=1.0, blank=True, null=True)
    man_appllast_season = models.CharField(max_length=100, default=' ')
    man_appl_2_season = models.CharField(max_length=100, default=' ')
    man_appl_3_season = models.CharField(max_length=100, default=' ')
    man_appl_4_season = models.CharField(max_length=100, default=' ')
    man_appl_5_season = models.CharField(max_length=100, default=' ')
    man_frequency = models.FloatField(default=1.0, blank=True, null=True)
    plant_date = models.DateTimeField(default=timezone.now)
    land_form = models.CharField(max_length=100, default=' ')
    slope = models.CharField(max_length=100, default=' ')
    slope_position = models.CharField(max_length=100, default=' ')
    wi = models.FloatField(default=1.0, blank=True, null=True)
    tpi = models.FloatField(default=1.0, blank=True, null=True)
    wealth_class = models.CharField(max_length=100, default=' ')
    farmer_practice = models.FloatField(null=True)
    fertilizer_practice = models.FloatField(null=True)
    yield_difference = models.FloatField(null=True)
    prediction = models.CharField(
        max_length=255, blank=True, null=True)
    predicted_practice = models.CharField(
        max_length=255, blank=True, null=True)

    objects = DataFrameManager()

    def __str__(self):
        return self.village

    @staticmethod
    def predict_farm_practice():
        all_data = pd.DataFrame(list(Data.objects.all().values()))
        # drop rows with missing values
        all_data.dropna(axis=0, how='all')
        print(all_data)
        print(all_data[all_data.isnull().any(axis=1)])
        # Split the dataset into features (X) and target variable (y)
        all_data['rry'] = np.log(
            all_data.fertilizer_practice/all_data.farmer_practice)

        all_data.dropna(subset='rry', how='all', inplace=True)
        all_data = all_data.replace({'manure_applied': {'Yes': 1, 'No': 0}})
        all_data = all_data.replace(
            {'wealth_class': {'High': 1, 'Medium': 2, 'Low': 3}})

        all_data = all_data[["id", "village", 'longitude', 'latitude', 'altitude',
                             'manure_applied', "slope_dem", "plant_date", "tpi", "wi", "man_frequency", 'rry']]

        # encode the categorical variables
        encoded_df = pd.get_dummies(
            all_data, columns=["village", "man_frequency", 'manure_applied', "plant_date"])

        print(encoded_df)

        # set the predictor variables
        X = encoded_df.drop(["rry", "id"], axis=1)

        # set the target variable
        y = np.exp(encoded_df["rry"])
        # Train the random forest regressor
        rf_model = RandomForestRegressor()
        # Hyperparameters

        n_estimators = [int(x) for x in np.linspace(100, 1200, 12)]
        print(n_estimators)

        n_estimators = [int(x) for x in np.linspace(100, 1200, 12)]
        max_features = ['auto', 'sqrt']
        max_depth = [int(x) for x in np.linspace(5, 30, 6)]
        min_samples_split = [2, 5, 10, 15, 100]
        min_samples_leaf = [1, 2, 5, 10]

        random_grid = {
            'n_estimators': n_estimators,
            'max_features': max_features,
            'max_depth': max_depth,
            'min_samples_split': min_samples_split,
            'min_samples_leaf': min_samples_leaf
        }

        # First create the base model to tune
        rf = RandomForestRegressor()
        rf_random = RandomizedSearchCV(estimator=rf, param_distributions=random_grid, scoring='neg_mean_squared_error',
                                       n_iter=10, cv=5, verbose=2, random_state=42, n_jobs=1)

        rf_random.fit(X, y)

        # make predictions
        predictions = rf_random.predict(X)

        # decode the categorical variables
        village_cols = [
            col for col in encoded_df.columns if col.startswith("village")]
        manfreq_cols = [
            col for col in encoded_df.columns if col.startswith("man_frequency")]
        manuappl_cols = [
            col for col in encoded_df.columns if col.startswith("manure_applied")]
        plantda_cols = [
            col for col in encoded_df.columns if col.startswith("plant_date")]

        decoded_df = pd.DataFrame({
            "id": all_data["id"],
            "village": encoded_df[village_cols].idxmax(axis=1).apply(lambda x: x.split("_")[1]),
            "latitude": all_data["latitude"],
            "longitude": all_data["longitude"],
            "altitude": all_data["altitude"],
            "manure_applied": encoded_df[manuappl_cols].idxmax(axis=1).apply(lambda x: x.split("_")[2]),
            "slope_dem": all_data["slope_dem"],
            "plant_date": encoded_df[plantda_cols].idxmax(axis=1).apply(lambda x: x.split("_")[2]),
            "tpi": all_data["tpi"],
            "wi": all_data["wi"],
            "man_frequency": encoded_df[manfreq_cols].idxmax(axis=1).apply(lambda x: x.split("_")[2]),
            "rry": all_data["rry"],
            "prediction": predictions
        })
        print(decoded_df)

        # add a column indicating whether fertilizer practice is better or not
        decoded_df["predicted_practice"] = decoded_df["prediction"].apply(
            lambda x: "Fertilizer Practice" if x > 0 else "Farmer Practice")

        print(decoded_df)

        # Save predictions to the database
        for index, row in decoded_df.iterrows():
            village = Data.objects.get(id=row['id'])
            village.prediction = row['prediction']
            village.predicted_practice = row['predicted_practice']
            village.save()
