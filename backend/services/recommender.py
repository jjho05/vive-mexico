import pandas as pd
from sklearn.neighbors import NearestNeighbors
from typing import List, Dict

class RecommenderSystem:
    def __init__(self):
        # Mock data for initial prototype
        self.businesses = pd.DataFrame([
            {"id": 1, "name": "Tacos El Guero", "category": "food", "tags": "street food, classic, cheap", "lat": 19.4326, "lng": -99.1332},
            {"id": 2, "name": "Artesanías Juan", "category": "shopping", "tags": "crafts, traditional, gift", "lat": 19.4340, "lng": -99.1350},
            {"id": 3, "name": "Fonda Doña Mary", "category": "food", "tags": "homemade, authentic, local", "lat": 19.4310, "lng": -99.1320},
        ])
        # In a real app, tags would be vectorized
        
    def get_recommendations(self, user_interests: List[str]) -> List[Dict]:
        """
        Simple content-based matching for prototype.
        Will evolve to Collaborative Filtering with user swipe data.
        """
        results = []
        for _, biz in self.businesses.iterrows():
            score = 0
            for interest in user_interests:
                if interest.lower() in biz['tags'].lower():
                    score += 1
            if score > 0:
                results.append(biz.to_dict())
        return results

recommender = RecommenderSystem()
