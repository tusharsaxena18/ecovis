import requests

url = "http://your-api-endpoint/predict"
image_path = "D:/Documents/code/ai environment impact analyzer/dataset/testing/paper/paper_1.jpg"

try:
    with open(image_path, 'rb') as f:
        files = {'file': (image_path.split('/')[-1], f)}  # (filename, file_object)
        response = requests.post(url, files=files)

        if response.status_code == 200:
            print(response.json())
        else:
            print(f"Error: {response.status_code} - {response.text}")

except FileNotFoundError:
    print(f"Error: Image file not found at {image_path}")
except Exception as e:
    print(f"An error occurred: {e}")