import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from PIL import Image
import io
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Load the trained model from the .pth file
MODEL_PATH = "ecovis.pth"
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Define class names (replace with your actual class names)
class_names = ["biological", "metal", "paper", "plastic", "trash", "white-glass"]
num_classes = len(class_names)

class CNN(nn.Module):
    def __init__(self, num_classes=num_classes, img_height=224, dropout_rate=0.4):
        super(CNN, self).__init__()

        self.conv1 = nn.Conv2d(3, 32, 3, padding=1)
        self.conv2 = nn.Conv2d(32, 64, 3, padding=1)
        self.conv3 = nn.Conv2d(64, 128, 3, padding=1)
        self.conv4 = nn.Conv2d(128, 256, 3, padding=1)

        self.pool = nn.MaxPool2d(2, 2)
        self.dropout = nn.Dropout(p=dropout_rate)

        final_size = img_height // 16

        self.fc1 = nn.Linear(256 * final_size * final_size, 512)
        self.fc2 = nn.Linear(512, num_classes)

    def forward(self, x):
        x = self.pool(F.relu(self.conv1(x)))
        x = self.pool(F.relu(self.conv2(x)))
        x = self.pool(F.relu(self.conv3(x)))
        x = self.pool(F.relu(self.conv4(x)))

        x = x.view(x.size(0), -1)
        x = F.relu(self.fc1(x))
        x = self.dropout(x)
        x = self.fc2(x)
        return x

# Load the model
model = CNN(num_classes=num_classes)
try:
    model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
    model.to(device)
    model.eval()
    logging.info(f"Model successfully loaded and moved to: {device}")
except FileNotFoundError:
    logging.error(f"Error: Model file not found at {MODEL_PATH}")
    exit()
except Exception as e:
    logging.error(f"Error loading the model: {e}")
    exit()

# FastAPI app
app = FastAPI()

class PredictionResponse(BaseModel):
    prediction: str

@app.post("/predict", response_model=PredictionResponse)
async def predict_image(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).resize((224, 224)).convert("RGB")

        # Preprocess
        img_array = np.array(image).astype(np.float32) / 255.0
        img_array = img_array.transpose((2, 0, 1))
        input_tensor = torch.tensor(img_array, dtype=torch.float32).unsqueeze(0).to(device)

        with torch.no_grad():
            output = model(input_tensor)
            probabilities = F.softmax(output, dim=1)[0]
            prediction_index = torch.argmax(probabilities).item()
            predicted_class = class_names[prediction_index]
            confidence = probabilities[prediction_index].item()

        logging.info(f"Predicted class: {predicted_class} (Confidence: {confidence:.4f})")
        return {"prediction": predicted_class}

    except FileNotFoundError:
        logging.error("Error: Uploaded file not found.")
        return {"error": "Uploaded file not found."}
    except Image.UnidentifiedImageError:
        logging.error("Error: Could not open or read image file.")
        return {"error": "Could not open or read image file."}
    except Exception as e:
        logging.error(f"Prediction error: {e}")
        return {"error": str(e)}

# To run this code, save it as a Python file (e.g., main.py)
# and then run in your terminal: uvicorn main:app --reload